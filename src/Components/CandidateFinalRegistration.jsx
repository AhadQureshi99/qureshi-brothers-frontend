import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/apiBaseUrl";

const CandidateFinalRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  // Get initial data from location state if coming from InitialRegistration
  const initialDataFromState = location.state?.initialData || null;
  const candidateIdFromState = location.state?.candidateId || null;

  // Permission check
  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.candidateFinalRegistration?.view ===
      true;

  const canAdd =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.candidateFinalRegistration?.add ===
      true;

  const canEdit =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.candidateFinalRegistration?.edit ===
      true;

  const canDelete =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.candidateFinalRegistration
      ?.delete === true;

  const [activeTab, setActiveTab] = useState("basic");
  const [showForm, setShowForm] = useState(true);

  // Permission access control
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

  const [formData, setFormData] = useState({
    username: "",
    candidateType: "",
    title: "",
    firstName: "",
    lastName: "",
    cnic: "",
    fatherName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    placeOfBirth: "",
    nationality: "",
    password: "",
    religion: "",
    wages: "",
    maritalStatus: "",
    education: "",
    profession: "",
    experience: "",
    jobType: "",
    jobAppliedFor: "",
    plan: "",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportIssuePlace: "",
    country: "",
    state: "",
    province: "",
    zip: "",
    district: "",
    city: "",
    street: "",
    phone: "",
    mobile: "",
    email: "",
    fax: "",
    website: "",
    contactAddress: "",
    returnAddress: "",
    emergencyContact: "",
    emergencyContactRelation: "",
    skills: [],
    educations: [],
    currentStatus: "",
    statusDate: "",
    convicted: "",
    politicalAffiliation: "",
    presentEmployment: "",
    achievements: "",
    dependents: [],
    resumes: [],
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCandidate, setEditingCandidate] = useState(null);

  const [skillForm, setSkillForm] = useState({
    from: "",
    to: "",
    degree: "",
    institute: "",
    duration: "",
  });

  const [dependentForm, setDependentForm] = useState({
    dependent: "",
    gender: "",
    age: "",
  });

  const [educationForm, setEducationForm] = useState({
    from: "",
    to: "",
    degree: "",
    institute: "",
    duration: "",
  });

  const [resumeName, setResumeName] = useState("");

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "passport", label: "Passport Info" },
    { id: "residence", label: "Residence Info" },
    { id: "contact", label: "Contact Details" },
    { id: "skills", label: "Skills" },
    { id: "status", label: "Present Status" },
    { id: "dependents", label: "Candidate Dependents" },
    { id: "resumes", label: "Resumes" },
  ];

  useEffect(() => {
    fetchCandidates();

    // Populate form with initial data from InitialRegistration if available
    if (initialDataFromState) {
      setFormData((prev) => ({
        ...prev,
        firstName: initialDataFromState.firstName || prev.firstName || "",
        lastName: initialDataFromState.lastName || prev.lastName || "",
        email: initialDataFromState.email || prev.email || "",
        mobile: initialDataFromState.mobile || prev.mobile || "",
        experience: initialDataFromState.experience || prev.experience || "",
        profession: initialDataFromState.profession || prev.profession || "",
        // Additional fields can be added from initialData if needed
      }));

      // If we have a candidate ID, load full candidate data
      if (candidateIdFromState) {
        setEditingCandidate({
          _id: candidateIdFromState,
          ...initialDataFromState,
        });
      }
    }
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/candidates/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allCandidates = response.data || [];
      // Filter candidates by status
      const filteredCandidates = allCandidates.filter(
        (c) => c.status === "Final Registration",
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newResumes = files.map((file) => ({ file, name: file.name }));
    setFormData((prev) => ({
      ...prev,
      resumes: [...prev.resumes, ...newResumes],
    }));
  };

  const addSkill = () => {
    if (skillForm.degree && skillForm.institute) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { ...skillForm }],
      }));
      setSkillForm({
        from: "",
        to: "",
        degree: "",
        institute: "",
        duration: "",
      });
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addDependent = () => {
    if (dependentForm.dependent && dependentForm.gender) {
      setFormData((prev) => ({
        ...prev,
        dependents: [...prev.dependents, { ...dependentForm }],
      }));
      setDependentForm({ dependent: "", gender: "", age: "" });
    }
  };

  const removeDependent = (index) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    if (educationForm.degree && educationForm.institute) {
      setFormData((prev) => ({
        ...prev,
        educations: [...prev.educations, { ...educationForm }],
      }));
      setEducationForm({
        from: "",
        to: "",
        degree: "",
        institute: "",
        duration: "",
      });
    }
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (closeAfterSave = false) => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.cnic ||
      !formData.fatherName ||
      !formData.dateOfBirth ||
      !formData.nationality
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const candidateData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        status: "Final Registration",
      };

      if (editingCandidate) {
        await axios.put(
          `${API_BASE_URL}/api/candidates/${editingCandidate._id}`,
          candidateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Candidate updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/api/candidates/`, candidateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Candidate registered successfully");
      }

      if (closeAfterSave) {
        handleCancel();
      } else {
        setFormData({
          username: "",
          candidateType: "",
          title: "",
          firstName: "",
          lastName: "",
          cnic: "",
          fatherName: "",
          gender: "",
          dateOfBirth: "",
          age: "",
          placeOfBirth: "",
          nationality: "",
          password: "",
          religion: "",
          wages: "",
          maritalStatus: "",
          education: "",
          profession: "",
          experience: "",
          jobType: "",
          jobAppliedFor: "",
          plan: "",
          passportNumber: "",
          passportIssueDate: "",
          passportExpiryDate: "",
          passportIssuePlace: "",
          country: "",
          state: "",
          province: "",
          zip: "",
          district: "",
          city: "",
          street: "",
          phone: "",
          mobile: "",
          email: "",
          fax: "",
          website: "",
          contactAddress: "",
          returnAddress: "",
          emergencyContact: "",
          emergencyContactRelation: "",
          skills: [],
          educations: [],
          currentStatus: "",
          statusDate: "",
          convicted: "",
          politicalAffiliation: "",
          presentEmployment: "",
          achievements: "",
          dependents: [],
          resumes: [],
        });
        setEditingCandidate(null);
        fetchCandidates();
      }
    } catch (error) {
      toast.error(
        editingCandidate
          ? "Failed to update candidate"
          : "Failed to register candidate",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      candidateType: "",
      title: "",
      firstName: "",
      lastName: "",
      cnic: "",
      fatherName: "",
      gender: "",
      dateOfBirth: "",
      age: "",
      placeOfBirth: "",
      nationality: "",
      password: "",
      religion: "",
      wages: "",
      maritalStatus: "",
      education: "",
      profession: "",
      experience: "",
      jobType: "",
      jobAppliedFor: "",
      plan: "",
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      passportIssuePlace: "",
      country: "",
      state: "",
      province: "",
      zip: "",
      district: "",
      city: "",
      street: "",
      phone: "",
      mobile: "",
      email: "",
      fax: "",
      website: "",
      contactAddress: "",
      returnAddress: "",
      emergencyContact: "",
      emergencyContactRelation: "",
      skills: [],
      educations: [],
      currentStatus: "",
      statusDate: "",
      convicted: "",
      politicalAffiliation: "",
      presentEmployment: "",
      achievements: "",
      dependents: [],
      resumes: [],
    });
    setEditingCandidate(null);
    setShowForm(false);
  };

  const handleEdit = (candidate) => {
    const nameParts = (candidate.name || "").split(" ");
    setFormData({
      username: candidate.username || "",
      candidateType: candidate.candidateType || "",
      title: candidate.title || "",
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      cnic: candidate.cnic || "",
      fatherName: candidate.fatherName || "",
      gender: candidate.gender || "",
      dateOfBirth: candidate.dateOfBirth || "",
      age: candidate.age || "",
      placeOfBirth: candidate.placeOfBirth || "",
      nationality: candidate.nationality || "",
      password: "",
      religion: candidate.religion || "",
      wages: candidate.wages || "",
      maritalStatus: candidate.maritalStatus || "",
      education: candidate.education || "",
      profession: candidate.profession || "",
      experience: candidate.experience || "",
      jobType: candidate.jobType || "",
      jobAppliedFor: candidate.jobAppliedFor || "",
      plan: candidate.plan || "",
      passportNumber: candidate.passportNumber || "",
      passportIssueDate: candidate.passportIssueDate || "",
      passportExpiryDate: candidate.passportExpiryDate || "",
      passportIssuePlace: candidate.passportIssuePlace || "",
      country: candidate.country || "",
      state: candidate.state || "",
      province: candidate.province || "",
      zip: candidate.zip || "",
      district: candidate.district || "",
      city: candidate.city || "",
      street: candidate.street || "",
      phone: candidate.phone || candidate.contact || "",
      mobile: candidate.mobile || "",
      email: candidate.email || "",
      fax: candidate.fax || "",
      website: candidate.website || "",
      contactAddress: candidate.contactAddress || "",
      returnAddress: candidate.returnAddress || "",
      emergencyContact: candidate.emergencyContact || "",
      emergencyContactRelation: candidate.emergencyContactRelation || "",
      skills: candidate.skills || [],
      educations: candidate.educations || [],
      currentStatus: candidate.currentStatus || "",
      statusDate: candidate.statusDate || "",
      convicted: candidate.convicted || "",
      politicalAffiliation: candidate.politicalAffiliation || "",
      presentEmployment: candidate.presentEmployment || "",
      achievements: candidate.achievements || "",
      dependents: candidate.dependents || [],
      resumes: candidate.resumes || [],
    });
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  // Move candidate to Ready to Submitted
  const handleMoveToReady = async (candidateId) => {
    if (!canEdit) {
      toast.error("You do not have permission to move candidates");
      return;
    }
    if (!window.confirm("Move this candidate to Ready to Submitted?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/candidates/${candidateId}`,
        { status: "Ready to Submitted" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Candidate moved to Ready to Submitted");
      fetchCandidates();
      navigate("/admin/candidate-management/ready-to-submitted");
    } catch (error) {
      toast.error("Failed to move candidate");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Copy candidate to Ready to Submitted
  const handleCopyToReady = async (candidate) => {
    if (!canEdit) {
      toast.error("You do not have permission to copy candidates");
      return;
    }
    if (!window.confirm("Copy this candidate to Ready to Submitted?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { _id, createdAt, updatedAt, __v, ...rest } = candidate;
      const newCandidate = { ...rest, status: "Ready to Submitted" };
      await axios.post(`${API_BASE_URL}/api/candidates`, newCandidate, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Candidate copied to Ready to Submitted");
      fetchCandidates();
      navigate("/admin/candidate-management/ready-to-submitted");
    } catch (error) {
      toast.error("Failed to copy candidate");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = (candidates || []).filter((candidate) => {
    const name = (candidate?.name || "").toString().toLowerCase();
    const email = (candidate?.email || "").toString().toLowerCase();
    const term = (searchTerm || "").toLowerCase();
    return (
      candidate.status === "Final Registration" &&
      (name.includes(term) || email.includes(term))
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Candidate Final Registration
        </h1>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Candidate Type
                  </label>
                  <select
                    name="candidateType"
                    value={formData.candidateType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Candidate Type</option>
                    <option value="unskilled">Unskilled</option>
                    <option value="semiskilled">Semi-skilled</option>
                    <option value="skilled">Skilled</option>
                    <option value="highlyskilled">Highly Skilled</option>
                    <option value="highly qualified">Highly Qualified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wages/Salary
                  </label>
                  <input
                    type="text"
                    name="wages"
                    value={formData.wages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
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
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
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
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <input
                    type="text"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Applied For
                  </label>
                  <input
                    type="text"
                    name="jobAppliedFor"
                    value={formData.jobAppliedFor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan
                  </label>
                  <input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "passport" && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport No.
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Issue Date
                  </label>
                  <input
                    type="date"
                    name="passportIssueDate"
                    value={formData.passportIssueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Issue Place
                  </label>
                  <input
                    type="text"
                    name="passportIssuePlace"
                    value={formData.passportIssuePlace}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "residence" && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
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
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fax
                  </label>
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="contactAddress"
                    value={formData.contactAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Address
                  </label>
                  <textarea
                    name="returnAddress"
                    value={formData.returnAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <div className="mb-6 p-4 border rounded bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Add Skill
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={skillForm.from}
                        onChange={(e) =>
                          setSkillForm((prev) => ({
                            ...prev,
                            from: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={skillForm.to}
                        onChange={(e) =>
                          setSkillForm((prev) => ({
                            ...prev,
                            to: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        placeholder="Degree"
                        value={skillForm.degree}
                        onChange={(e) =>
                          setSkillForm((prev) => ({
                            ...prev,
                            degree: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Institute
                      </label>
                      <input
                        type="text"
                        placeholder="Institute"
                        value={skillForm.institute}
                        onChange={(e) =>
                          setSkillForm((prev) => ({
                            ...prev,
                            institute: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addSkill}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Add Skill
                  </button>
                </div>

                {formData.skills && formData.skills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Added Skills
                    </h3>
                    <div className="space-y-2">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border rounded bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {skill.degree} - {skill.institute}
                            </p>
                            <p className="text-xs text-gray-600">
                              {skill.from} to {skill.to}
                            </p>
                          </div>
                          <button
                            onClick={() => removeSkill(index)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "status" && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Have you ever been convicted in a police case in the court
                    of law?
                  </label>
                  <select
                    name="convicted"
                    value={formData.convicted}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you have affiliation/membership with any
                    political/religious party?
                  </label>
                  <select
                    name="politicalAffiliation"
                    value={formData.politicalAffiliation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Present Employment
                  </label>
                  <textarea
                    name="presentEmployment"
                    value={formData.presentEmployment}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "dependents" && (
              <div>
                <div className="mb-6 p-4 border rounded bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Add Dependent
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Dependent
                      </label>
                      <input
                        type="text"
                        placeholder="Name/Relationship"
                        value={dependentForm.dependent}
                        onChange={(e) =>
                          setDependentForm((prev) => ({
                            ...prev,
                            dependent: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={dependentForm.gender}
                        onChange={(e) =>
                          setDependentForm((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={dependentForm.age}
                        onChange={(e) =>
                          setDependentForm((prev) => ({
                            ...prev,
                            age: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addDependent}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Add Dependent
                  </button>
                </div>

                {formData.dependents && formData.dependents.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Added Dependents
                    </h3>
                    <div className="space-y-2">
                      {formData.dependents.map((dependent, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border rounded bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {dependent.dependent} - {dependent.gender}
                            </p>
                            <p className="text-xs text-gray-600">
                              Age: {dependent.age}
                            </p>
                          </div>
                          <button
                            onClick={() => removeDependent(index)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "resumes" && (
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Resumes
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You can upload multiple resume files (PDF, DOC, DOCX, etc.)
                  </p>
                </div>

                {formData.resumes && formData.resumes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Uploaded Resumes ({formData.resumes.length})
                    </h3>
                    <div className="space-y-2">
                      {formData.resumes.map((resume, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border rounded bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📄</span>
                            <span className="text-sm font-medium">
                              {resume.name || resume.file?.name}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                resumes: prev.resumes.filter(
                                  (_, i) => i !== index,
                                ),
                              }));
                            }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Common Save/Cancel buttons at the bottom */}
            <div className="flex gap-4 mt-8 border-t pt-6">
              <button
                onClick={() => handleSave(true)}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingCandidate
                    ? "Update Candidate"
                    : "Save Candidate"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Candidates List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Candidates</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setActiveTab("basic"); // Start with basic info
                setEditingCandidate(null);
                setFormData({
                  // reset formData (same as in handleCancel)
                  username: "",
                  candidateType: "",
                  // ... rest of reset ...
                });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              New
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left">#</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Mobile</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((c, i) => (
                    <tr key={c._id || i} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{i + 1}</td>
                      <td className="border px-4 py-2">{c.name}</td>
                      <td className="border px-4 py-2">{c.email}</td>
                      <td className="border px-4 py-2">
                        {c.contact || c.mobile}
                      </td>
                      <td className="border px-4 py-2">{c.status}</td>
                      <td className="border px-4 py-2">
                        {/* Move/Copy to Ready to Submitted */}
                        <button
                          onClick={() => handleMoveToReady(c._id)}
                          className="px-2 py-1 bg-blue-600 text-white rounded mr-2"
                        >
                          Move to Ready to Submitted
                        </button>
                        <button
                          onClick={() => handleCopyToReady(c)}
                          className="px-2 py-1 bg-purple-600 text-white rounded mr-2"
                        >
                          Copy to Ready to Submitted
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "visaCandidates",
                              JSON.stringify(filteredCandidates),
                            );
                            localStorage.setItem(
                              "visaCandidateIndex",
                              String(i),
                            );
                            window.location.href = "/visa-form";
                          }}
                          className="px-2 py-1 bg-green-600 text-white rounded mr-2"
                        >
                          Visa Form
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "depositCandidates",
                              JSON.stringify(filteredCandidates),
                            );
                            localStorage.setItem(
                              "depositCandidateIndex",
                              String(i),
                            );
                            window.location.href = "/deposit-slip";
                          }}
                          className="px-2 py-1 bg-purple-600 text-white rounded mr-2"
                        >
                          Deposit Slip
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "nbpCandidates",
                              JSON.stringify(filteredCandidates),
                            );
                            localStorage.setItem(
                              "nbpCandidateIndex",
                              String(i),
                            );
                            window.location.href = "/nbpchallan";
                          }}
                          className="px-2 py-1 bg-yellow-600 text-white rounded mr-2"
                        >
                          NBP Chalan
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "undertakingCandidates",
                              JSON.stringify(filteredCandidates),
                            );
                            localStorage.setItem(
                              "undertakingCandidateIndex",
                              String(i),
                            );
                            window.location.href = "/undertaking-letter";
                          }}
                          className="px-2 py-1 bg-pink-600 text-white rounded mr-2"
                        >
                          Undertaking
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "contactCandidates",
                              JSON.stringify(filteredCandidates),
                            );
                            localStorage.setItem(
                              "contactCandidateIndex",
                              String(i),
                            );
                            window.location.href = "/contact";
                          }}
                          className="px-2 py-1 bg-cyan-600 text-white rounded mr-2"
                        >
                          Contract Letter
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "alliedCandidates",
                              JSON.stringify(filteredCandidates),
                            );
                            localStorage.setItem(
                              "alliedCandidateIndex",
                              String(i),
                            );
                            window.location.href = "/allied-form";
                          }}
                          className="px-2 py-1 bg-teal-600 text-white rounded mr-2"
                        >
                          ABL Form
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="border px-4 py-8 text-center text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateFinalRegistration;
