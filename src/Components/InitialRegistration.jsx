import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const InitialRegistration = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Permission check
  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.initialRegistration?.view === true;

  if (!canView) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            <strong>Access Denied:</strong> You do not have permission to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    age: "",
    placeOfBirth: "",
    maritalStatus: "",
    email: "",
    mobile: "",
    passport: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    companyNameEnglish: "",
    companyNameArabic: "",
    tradeEnglish: "",
    tradeArabic: "",
    visaId: "",
    visaNo: "",
    eNo: "",
    salary: "",
    profession: "",
    experience: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [movingId, setMovingId] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Fetch candidates on mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api.cloudandroots.com/api/candidates",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCandidates(response.data?.candidates || response.data || []);
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
      if (editingCandidate) {
        // Update existing candidate
        await axios.put(
          `https://api.cloudandroots.com/api/candidates/${editingCandidate._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Candidate updated successfully");
        setEditingCandidate(null);
      } else {
        // Create new candidate
        await axios.post(
          "https://api.cloudandroots.com/api/candidates",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Candidate registered successfully");
      }
      setFormData({
        date: "",
        firstName: "",
        lastName: "",
        fatherName: "",
        dateOfBirth: "",
        age: "",
        placeOfBirth: "",
        maritalStatus: "",
        email: "",
        mobile: "",
        passport: "",
        passportIssueDate: "",
        passportExpiryDate: "",
        companyNameEnglish: "",
        companyNameArabic: "",
        tradeEnglish: "",
        tradeArabic: "",
        visaId: "",
        visaNo: "",
        eNo: "",
        salary: "",
        profession: "",
        experience: "",
        address: "",
      });
      fetchCandidates(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save candidate");
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
      maritalStatus: "",
      email: "",
      mobile: "",
      passport: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      companyNameEnglish: "",
      companyNameArabic: "",
      tradeEnglish: "",
      tradeArabic: "",
      visaId: "",
      visaNo: "",
      eNo: "",
      salary: "",
      profession: "",
      experience: "",
      address: "",
    });
    setEditingCandidate(null);
  };

  const handleEdit = (candidate) => {
    setFormData({
      date: candidate.date || "",
      firstName: candidate.firstName || "",
      lastName: candidate.lastName || "",
      fatherName: candidate.fatherName || "",
      dateOfBirth: candidate.dateOfBirth || "",
      age: candidate.age || "",
      placeOfBirth: candidate.placeOfBirth || "",
      maritalStatus: candidate.maritalStatus || "",
      email: candidate.email || "",
      mobile: candidate.mobile || "",
      passport: candidate.passport || "",
      passportIssueDate: candidate.passportIssueDate || "",
      passportExpiryDate: candidate.passportExpiryDate || "",
      companyNameEnglish: candidate.companyNameEnglish || "",
      companyNameArabic: candidate.companyNameArabic || "",
      tradeEnglish: candidate.tradeEnglish || "",
      tradeArabic: candidate.tradeArabic || "",
      visaId: candidate.visaId || "",
      visaNo: candidate.visaNo || "",
      eNo: candidate.eNo || "",
      salary: candidate.salary || "",
      profession: candidate.profession || "",
      experience: candidate.experience || "",
      address: candidate.address || "",
    });
    setEditingCandidate(candidate);
  };

  const handleMoveToShortlisting = async (candidateId) => {
    if (
      !confirm("Are you sure you want to move this candidate to Shortlisting?")
    )
      return;
    try {
      setMovingId(candidateId);
      const token = localStorage.getItem("token");
      await axios.put(
        `https://api.cloudandroots.com/api/candidates/${candidateId}`,
        { status: "Shortlisting" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Candidate moved to Shortlisting");
      // Find candidate and set form data
      const candidate = candidates.find((c) => c._id === candidateId);
      if (candidate) {
        setFormData({
          date: candidate.date || "",
          firstName: candidate.firstName || "",
          lastName: candidate.lastName || "",
          fatherName: candidate.fatherName || "",
          dateOfBirth: candidate.dateOfBirth || "",
          age: candidate.age || "",
          placeOfBirth: candidate.placeOfBirth || "",
          maritalStatus: candidate.maritalStatus || "",
          email: candidate.email || "",
          mobile: candidate.mobile || "",
          passport: candidate.passport || "",
          passportIssueDate: candidate.passportIssueDate || "",
          passportExpiryDate: candidate.passportExpiryDate || "",
          companyNameEnglish: candidate.companyNameEnglish || "",
          companyNameArabic: candidate.companyNameArabic || "",
          tradeEnglish: candidate.tradeEnglish || "",
          tradeArabic: candidate.tradeArabic || "",
          visaId: candidate.visaId || "",
          visaNo: candidate.visaNo || "",
          eNo: candidate.eNo || "",
          salary: candidate.salary || "",
          profession: candidate.profession || "",
          experience: candidate.experience || "",
          address: candidate.address || "",
        });
        setEditingCandidate(candidate);
      }
      fetchCandidates();
    } catch (error) {
      toast.error("Failed to move candidate");
      console.error(error);
    } finally {
      setMovingId(null);
    }
  };

  const handleDelete = async (candidateId) => {
    if (
      !user?.permissions?.candidateManagement?.initialRegistration?.delete &&
      user?.role !== "superadmin"
    ) {
      toast.error("You do not have permission to delete candidates");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this candidate? This action cannot be undone."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res?.data?.message || "Candidate deleted");
      fetchCandidates();
    } catch (error) {
      console.error("Failed to delete candidate", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Delete failed");
      }
      if (error?.response?.status === 404) {
        setCandidates((prev) => prev.filter((c) => c._id !== candidateId));
      }
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const name = (candidate?.name || "").toString().toLowerCase();
    const email = (candidate?.email || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase();
    const isInitialReg =
      candidate.status === "Initial Registration" || !candidate.status;
    return isInitialReg && (name.includes(term) || email.includes(term));
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* === FORM SECTION === */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            {editingCandidate
              ? "Edit Candidate - Initial Registration"
              : "Initial Registration"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    required
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
                    required
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    name="passport"
                    value={formData.passport}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Passport Number"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Passport Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
            </div>

            {/* Address */}
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

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* === CANDIDATES LIST === */}
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
                        {candidate.firstName} {candidate.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.mobile}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.dateOfBirth
                          ? new Date(candidate.dateOfBirth).toLocaleDateString()
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
                      <td className="border border-gray-300 px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleMoveToShortlisting(candidate._id)
                          }
                          disabled={movingId === candidate._id}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {movingId === candidate._id
                            ? "Moving..."
                            : "Move to Shortlisting"}
                        </button>
                        <button
                          onClick={() => handleDelete(candidate._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          Delete
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
  );
};

export default InitialRegistration;
