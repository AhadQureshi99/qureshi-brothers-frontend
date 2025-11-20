import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const InitialRegistration = () => {
  const [formData, setFormData] = useState({
    date: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    age: "",
    placeOfBirth: "",
    email: "",
    mobile: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    maritalStatus: "",
    companyNameEnglish: "",
    companyNameArabic: "",
    tradeEnglish: "",
    tradeArabic: "",
    visaId: "",
    visaNo: "",
    eNo: "",
    salary: "",
    profession: "",
    address: "",
    experience: "",
  });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/candidates/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // backend may return { candidates: [...] } or the array directly
      setCandidates(response.data?.candidates || response.data || []);
    } catch (error) {
      toast.error("Failed to fetch candidates");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const candidateData = {
        date: formData.date,
        name: `${formData.firstName} ${formData.lastName}`,
        fatherName: formData.fatherName,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        placeOfBirth: formData.placeOfBirth,
        email: formData.email,
        contact: formData.mobile,
        passportIssueDate: formData.passportIssueDate,
        passportExpiryDate: formData.passportExpiryDate,
        maritalStatus: formData.maritalStatus,
        companyNameEnglish: formData.companyNameEnglish,
        companyNameArabic: formData.companyNameArabic,
        tradeEnglish: formData.tradeEnglish,
        tradeArabic: formData.tradeArabic,
        visaId: formData.visaId,
        visaNo: formData.visaNo,
        eNo: formData.eNo,
        salary: formData.salary,
        profession: formData.profession,
        address: formData.address,
        experience: formData.experience,
        status: "Initial Registration",
      };

      if (editingCandidate) {
        await axios.put(
          `/api/candidates/${editingCandidate._id}`,
          candidateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Candidate updated successfully");
      } else {
        await axios.post("/api/candidates/", candidateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Candidate registered successfully");
      }

      // Reset form
      setFormData({
        date: "",
        firstName: "",
        lastName: "",
        fatherName: "",
        dateOfBirth: "",
        age: "",
        placeOfBirth: "",
        email: "",
        mobile: "",
        passportIssueDate: "",
        passportExpiryDate: "",
        maritalStatus: "",
        companyNameEnglish: "",
        companyNameArabic: "",
        tradeEnglish: "",
        tradeArabic: "",
        visaId: "",
        visaNo: "",
        eNo: "",
        salary: "",
        profession: "",
        address: "",
        experience: "",
      });
      setEditingCandidate(null);
      fetchCandidates();
    } catch (error) {
      toast.error(
        editingCandidate
          ? "Failed to update candidate"
          : "Failed to register candidate"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      dateOfBirth: "",
      age: "",
      placeOfBirth: "",
      email: "",
      mobile: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      maritalStatus: "",
      companyNameEnglish: "",
      companyNameArabic: "",
      tradeEnglish: "",
      tradeArabic: "",
      visaId: "",
      visaNo: "",
      eNo: "",
      salary: "",
      profession: "",
      address: "",
      experience: "",
    });
    setEditingCandidate(null);
  };

  const handleEdit = (candidate) => {
    const nameParts = candidate.name.split(" ");
    setFormData({
      date: candidate.date || "",
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      fatherName: candidate.fatherName || "",
      dateOfBirth: candidate.dateOfBirth || "",
      age: candidate.age || "",
      placeOfBirth: candidate.placeOfBirth || "",
      email: candidate.email || "",
      mobile: candidate.contact || "",
      passportIssueDate: candidate.passportIssueDate || "",
      passportExpiryDate: candidate.passportExpiryDate || "",
      maritalStatus: candidate.maritalStatus || "",
      companyNameEnglish: candidate.companyNameEnglish || "",
      companyNameArabic: candidate.companyNameArabic || "",
      tradeEnglish: candidate.tradeEnglish || "",
      tradeArabic: candidate.tradeArabic || "",
      visaId: candidate.visaId || "",
      visaNo: candidate.visaNo || "",
      eNo: candidate.eNo || "",
      salary: candidate.salary || "",
      profession: candidate.profession || "",
      address: candidate.address || "",
      experience: candidate.experience || "",
    });
    setEditingCandidate(candidate);
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const name = (candidate?.name || "").toString();
    const email = (candidate?.email || "").toString();
    const term = (searchTerm || "").toLowerCase();
    return (
      name.toLowerCase().includes(term) || email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Candidate Initial Registration
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingCandidate ? "Edit Candidate" : "Add/Edit Candidate"}
            </h2>
            <div className="space-y-4">
              {/* Personal Information */}
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Father Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Place of Birth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <h3 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mobile"
                  />
                </div>
              </div>

              {/* Passport Information */}
              <h3 className="text-lg font-semibold text-gray-800">
                Passport Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Issue Date
                  </label>
                  <input
                    type="date"
                    name="passportIssueDate"
                    value={formData.passportIssueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Expiry Date
                  </label>
                  <input
                    type="date"
                    name="passportExpiryDate"
                    value={formData.passportExpiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Employment Information */}
              <h3 className="text-lg font-semibold text-gray-800">
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (English)
                  </label>
                  <input
                    type="text"
                    name="companyNameEnglish"
                    value={formData.companyNameEnglish}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name (English)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (Arabic)
                  </label>
                  <input
                    type="text"
                    name="companyNameArabic"
                    value={formData.companyNameArabic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name (Arabic)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trade (English)
                  </label>
                  <input
                    type="text"
                    name="tradeEnglish"
                    value={formData.tradeEnglish}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Trade (English)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trade (Arabic)
                  </label>
                  <input
                    type="text"
                    name="tradeArabic"
                    value={formData.tradeArabic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Trade (Arabic)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visa ID
                  </label>
                  <input
                    type="text"
                    name="visaId"
                    value={formData.visaId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Visa ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visa No
                  </label>
                  <input
                    type="text"
                    name="visaNo"
                    value={formData.visaNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Visa No"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E No
                  </label>
                  <input
                    type="text"
                    name="eNo"
                    value={formData.eNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E No"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Salary"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <h3 className="text-lg font-semibold text-gray-800">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Profession"
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
                    placeholder="Experience"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Address"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Record Listing */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Record Listing</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Candidate No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Email
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Mobile
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      DOB
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Company (EN)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Trade (EN)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Visa No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Experience
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate, index) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.date
                            ? new Date(candidate.date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.contact}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.dateOfBirth
                            ? new Date(
                                candidate.dateOfBirth
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.companyNameEnglish || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.tradeEnglish || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.visaNo || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {candidate.experience || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleEdit(candidate)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredCandidates.length} entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialRegistration;
