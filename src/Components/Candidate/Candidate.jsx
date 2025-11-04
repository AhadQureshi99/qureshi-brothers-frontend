import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { FaPrint, FaFilter, FaEye } from "react-icons/fa";
import { BsCalendar } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
const img1 = "/candidate_img1.png";
const img2 = "/candidate_img2.png";
import { Link } from "react-router-dom";

const getStatusColor = (status) => {
  if (status === "Medical Pending" || status === "Collect VISA")
    return "text-green-600";
  if (status === "VISA pending") return "text-orange-500";
  if (status === "Failed Medical Test") return "text-red-600";
  return "text-gray-600";
};

const uniqueValues = (arr, key) => [...new Set(arr.map((item) => item[key]))];

const parseDate = (dateStr) => {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
};

const Candidate = () => {
  const [candidate, setCandidate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterProfession, setFilterProfession] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const apiUrl =
          typeof import.meta !== "undefined" &&
          import.meta.env &&
          import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL
            : "http://213.199.41.219:3001";
        const res = await fetch(`${apiUrl}/api/candidates/`);
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        // if navigated with a newCandidate in location.state, prepend it
        const loc = locationStateRef?.current?.state?.newCandidate;
        if (loc) {
          // avoid duplicate if server includes same record
          const exists = data.some((d) => d._id === loc._id);
          setCandidate(exists ? data : [loc, ...data]);
        } else {
          setCandidate(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // read location state once (to avoid reactivity issues)
  const location = useLocation();
  const locationStateRef = { current: location };

  const filteredCandidate = candidate.filter((c) => {
    // Name search filter (applies on name and profession)
    const searchLower = searchText.toLowerCase();
    const name = c.name || "";
    const profession = c.profession || "";
    const matchesSearch =
      name.toLowerCase().includes(searchLower) ||
      profession.toLowerCase().includes(searchLower);
    if (!matchesSearch) return false;

    // Profession filter
    if (filterProfession !== "all" && profession !== filterProfession)
      return false;

    // Status filter
    if (filterStatus !== "all" && c.status !== filterStatus) return false;

    // Date filter
    const cDate = c.receiveDate ? new Date(c.receiveDate) : null;
    const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
    const toDate = filterDateTo ? new Date(filterDateTo) : null;
    if (fromDate && cDate && cDate < fromDate) return false;
    if (toDate && cDate && cDate > toDate) return false;

    return true;
  });

  const resetFilters = () => {
    setFilterProfession("all");
    setFilterStatus("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const handleViewCandidate = async (candidate) => {
    try {
      const apiUrl =
        typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_URL
          ? import.meta.env.VITE_API_URL
          : "http://213.199.41.219:3001";
      const res = await fetch(`${apiUrl}/api/candidates/${candidate._id}`);
      if (!res.ok) throw new Error("Failed to fetch candidate details");
      const data = await res.json();
      setSelectedCandidate(data);
      setViewModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load candidate details");
    }
  };

  return (
    <div>
      <div className="flex min-h-screen">
        <div className="w-[20%]">
          <Sidebar />
        </div>

        <div className="w-[80%] p-6 space-y-6 bg-gray-50 relative">
          {/* Search & Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-green-100 p-4 rounded-lg mb-4">
            <input
              type="text"
              placeholder="Search by Candidate name or Profession"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex gap-2 relative">
              <button
                className="bg-green-600 text-white px-8 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                <FaFilter /> Filter
              </button>
              <button className="bg-green-600 text-white px-8 py-2 rounded-md flex items-center gap-2 hover:bg-green-700">
                <FaPrint /> Print
              </button>

              {/* Filter dropdown */}
              {filterVisible && (
                <div className="absolute top-full right-0 mt-12 w-72 bg-white rounded shadow-lg border border-gray-300 z-20 p-4">
                  <div className="mb-3">
                    <label className="block font-semibold mb-1">
                      Profession
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterProfession}
                      onChange={(e) => setFilterProfession(e.target.value)}
                    >
                      <option value="all">All</option>
                      {uniqueValues(candidate, "profession").map((prof) => (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block font-semibold mb-1">Status</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      {uniqueValues(candidate, "status").map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block font-semibold mb-1">
                      Date From
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block font-semibold mb-1">Date To</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={() => {
                        resetFilters();
                        setFilterVisible(false);
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded"
                      onClick={() => setFilterVisible(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-md text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">NO#</th>
                  <th className="p-3 border">Candidates</th>
                  <th className="p-3 border">Profession</th>
                  <th className="p-3 border">Source</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Received Date</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      Loading candidates...
                    </td>
                  </tr>
                ) : filteredCandidate.length > 0 ? (
                  filteredCandidate.map((c, index) => (
                    <tr key={c._id} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="p-2 border flex items-center gap-2">
                        <img
                          src={c.profilePicture || img1}
                          alt="profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="text-left">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.city}</p>
                        </div>
                      </td>

                      <td className="p-2 border">
                        <p className="font-medium">{c.profession}</p>
                        <p className="text-xs text-gray-500">
                          {c.qualification}
                        </p>
                      </td>

                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-1">
                          <MdEmail className="text-xl text-gray-700" />
                          <span>Email</span>
                        </div>
                      </td>

                      <td
                        className={`p-2 border font-medium ${getStatusColor(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </td>

                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-1">
                          <BsCalendar className="text-sm" />
                          <span>
                            {c.receiveDate
                              ? new Date(c.receiveDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewCandidate(c)}
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            <FaEye />
                          </button>
                          <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Candidate Details
                </h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <img
                    src={selectedCandidate.profilePicture || img1}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
                  />
                  <h3 className="text-xl font-semibold mt-4">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCandidate.profession}
                  </p>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Name
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Father Name
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.fatherName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Gender
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.gender || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Age
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.age || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        CNIC
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.cnic || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Passport
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.passport || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.address || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        City
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.city || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        State
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.state || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Country
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.country || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Contact
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.contact || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Marital Status
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.maritalStatus || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Professional Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Profession
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.profession || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Qualification
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.qualification || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Salary
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.salary || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <p
                        className={`text-sm font-medium ${getStatusColor(
                          selectedCandidate.status
                        )}`}
                      >
                        {selectedCandidate.status || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Receive Date
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.receiveDate
                          ? new Date(
                              selectedCandidate.receiveDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Place of Birth
                      </label>
                      <p className="text-sm">
                        {selectedCandidate.placeOfBirth || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              {selectedCandidate.documents &&
                selectedCandidate.documents.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                      Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedCandidate.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <h5 className="font-medium text-gray-800 mb-2">
                            {doc.title}
                          </h5>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                doc.done
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {doc.done ? "Done" : "Pending"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                doc.passed
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {doc.passed ? "Passed" : "Not Passed"}
                            </span>
                          </div>
                          <button
                            onClick={() => window.open(doc.url, "_blank")}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            View Document
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidate;
