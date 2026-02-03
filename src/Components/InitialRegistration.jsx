import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import { API_BASE_URL } from "../utils/apiBaseUrl";
import { FaEdit, FaTrash, FaCopy } from "react-icons/fa";
import { MdMoveToInbox, MdOutlineDriveFileMove } from "react-icons/md";

const InitialRegistration = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.initialRegistration?.view === true;

  const canDelete =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.initialRegistration?.delete ===
      true;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    experience: "",
    profession: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [movingId, setMovingId] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    if (canView) {
      fetchCandidates();
    }
  }, [canView]);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allCandidates = response.data?.candidates || response.data || [];
      // Filter candidates by status
      const filteredCandidates = allCandidates.filter(
        (c) => c.status === "Initial Registration" || !c.status,
      );
      setCandidates(filteredCandidates);
    } catch (error) {
      toast.error("Failed to fetch candidates");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const candidateData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        status: editingCandidate
          ? editingCandidate.status
          : "Initial Registration",
      };

      if (editingCandidate) {
        await axios.put(
          `${API_BASE_URL}/api/candidates/${editingCandidate._id}`,
          candidateData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Candidate updated successfully");
        setEditingCandidate(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/candidates`, candidateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Candidate registered successfully");
      }
      fetchCandidates();
      handleCancel(); // reset form
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save candidate");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      experience: "",
      profession: "",
      address: "",
    });
    setEditingCandidate(null);
  };

  const handleEdit = (candidate) => {
    setFormData({
      firstName: candidate.firstName || "",
      lastName: candidate.lastName || "",
      email: candidate.email || "",
      mobile: candidate.mobile || "",
      experience: candidate.experience || "",
      profession: candidate.profession || "",
      address: candidate.address || "",
    });
    setEditingCandidate(candidate);
  };

  const handleMoveToShortlisting = async (candidate) => {
    try {
      setMovingId(candidate._id);
      const token = localStorage.getItem("token");

      // Update status to Final Registration
      await axios.put(
        `${API_BASE_URL}/api/candidates/${candidate._id}`,
        { status: "Final Registration" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Moving to Final Registration");

      // Navigate to CandidateFinalRegistration with candidate data
      navigate("/admin/candidate-management/candidate-final-registration", {
        state: {
          candidateId: candidate._id,
          initialData: candidate,
        },
      });
    } catch (error) {
      toast.error("Failed to move candidate");
      console.error(error);
      setMovingId(null);
    }
  };

  const handleCopyToShortlisting = async (candidate) => {
    if (!confirm("Create a copy of this candidate in Shortlisting?")) return;

    try {
      const token = localStorage.getItem("token");
      // Remove fields that shouldn't be duplicated
      const { _id, createdAt, updatedAt, __v, ...rest } = candidate;
      const newCandidate = { ...rest, status: "Shortlisting" };

      await axios.post(`${API_BASE_URL}/api/candidates`, newCandidate, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Candidate copied to Shortlisting");
      fetchCandidates();
    } catch (error) {
      toast.error("Failed to copy candidate");
      console.error(error);
    }
  };

  const handleDelete = async (candidateId) => {
    if (!canDelete) {
      toast.error("You do not have permission to delete candidates");
      return;
    }

    if (!confirm("Delete this candidate permanently? This cannot be undone."))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Candidate deleted successfully");
      fetchCandidates();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete candidate",
      );
      console.error(error);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const term = searchTerm.toLowerCase();
    const isInitial =
      candidate.status === "Initial Registration" || !candidate.status;
    const name = (
      candidate.firstName +
      " " +
      (candidate.lastName || "")
    ).toLowerCase();
    const email = (candidate.email || "").toLowerCase();
    return isInitial && (name.includes(term) || email.includes(term));
  });

  if (!canView) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            <strong>Access Denied:</strong> You do not have permission to view
            this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />

      <div className=" space-y-8">
        {/* FORM SECTION */}
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            {editingCandidate ? "Edit Candidate" : "Initial Registration"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? editingCandidate
                    ? "Updating..."
                    : "Saving..."
                  : editingCandidate
                    ? "Update"
                    : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* CANDIDATES LIST */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Candidates List
          </h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Candidate No
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Date
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Mobile
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    DOB
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Company (EN)
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Trade (EN)
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Visa No
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Experience
                  </th>
                  <th className="border px-4 py-2 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-12 text-center text-gray-500"
                    >
                      No candidates found
                      {searchTerm && " matching your search"}
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate, index) => (
                    <tr key={candidate._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.date
                          ? new Date(candidate.date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="border px-4 py-2 font-medium">
                        {candidate.firstName} {candidate.lastName || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.email || "—"}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.mobile || "—"}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.dateOfBirth
                          ? new Date(candidate.dateOfBirth).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.companyNameEnglish || "—"}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.tradeEnglish || "—"}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.visaNo || "—"}
                      </td>
                      <td className="border px-4 py-2">
                        {candidate.experience || "—"}
                      </td>
                      <td className="border px-1 py-1">
                        <div className="grid grid-cols-2 gap-2 mx-auto w-max">
                          <button
                            onClick={() => handleEdit(candidate)}
                            title="Edit"
                            className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <FaEdit size={14} />
                          </button>

                          <button
                            onClick={() => handleMoveToShortlisting(candidate)}
                            disabled={movingId === candidate._id}
                            title="Move to Candidate Final Registration"
                            className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {movingId === candidate._id ? (
                              <span className="text-[9px]">...</span>
                            ) : (
                              <MdOutlineDriveFileMove size={16} />
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyToShortlisting(candidate)}
                            title="Copy to Shortlisting"
                            className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            <FaCopy size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(candidate._id)}
                            title="Delete"
                            className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCandidates.length} entr
            {filteredCandidates.length === 1 ? "y" : "ies"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialRegistration;
