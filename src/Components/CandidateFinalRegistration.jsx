import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const CandidateFinalRegistration = () => {
  const [activeTab, setActiveTab] = useState("addEdit");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
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
    // Passport Info
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportIssuePlace: "",
    // Residence Info
    country: "",
    state: "",
    province: "",
    zip: "",
    district: "",
    city: "",
    street: "",
    // Contact Details
    phone: "",
    mobile: "",
    email: "",
    fax: "",
    website: "",
    contactAddress: "",
    returnAddress: "",
    emergencyContact: "",
    emergencyContactRelation: "",
    // Skills
    skills: [],
    // Education
    educations: [],
    // Present Status
    currentStatus: "",
    statusDate: "",
    convicted: "",
    politicalAffiliation: "",
    presentEmployment: "",
    achievements: "",
    // Candidate Dependents
    dependents: [],
    // Resumes
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
    { id: "addEdit", label: "Add/Edit Detail" },
    { id: "basic", label: "Basic Info" },
    { id: "passport", label: "Passport Info" },
    { id: "residence", label: "Residence Info" },
    { id: "contact", label: "Contact Details" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "status", label: "Present Status" },
    { id: "dependents", label: "Candidate Dependents" },
    { id: "resumes", label: "Resumes" },
  ];

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/candidates/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data || []);
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newResumes = files.map((file) => ({ file, name: file.name }));
    setFormData({
      ...formData,
      resumes: [...formData.resumes, ...newResumes],
    });
  };

  const addSkill = () => {
    if (skillForm.degree && skillForm.institute) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { ...skillForm }],
      });
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
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addDependent = () => {
    if (dependentForm.dependent && dependentForm.gender) {
      setFormData({
        ...formData,
        dependents: [...formData.dependents, { ...dependentForm }],
      });
      setDependentForm({
        dependent: "",
        gender: "",
        age: "",
      });
    }
  };

  const removeDependent = (index) => {
    setFormData({
      ...formData,
      dependents: formData.dependents.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    if (educationForm.degree && educationForm.institute) {
      setFormData({
        ...formData,
        educations: [...formData.educations, { ...educationForm }],
      });
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
    setFormData({
      ...formData,
      educations: formData.educations.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (closeAfterSave = false) => {
    // Validation
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

      if (closeAfterSave) {
        handleCancel();
      } else {
        // Reset form but keep it open
        setFormData({
          // Basic Info
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
          // Passport Info
          passportNumber: "",
          passportIssueDate: "",
          passportExpiryDate: "",
          passportIssuePlace: "",
          // Residence Info
          country: "",
          state: "",
          province: "",
          zip: "",
          district: "",
          city: "",
          street: "",
          // Contact Details
          phone: "",
          mobile: "",
          email: "",
          fax: "",
          website: "",
          contactAddress: "",
          returnAddress: "",
          emergencyContact: "",
          emergencyContactRelation: "",
          // Skills
          skills: [],
          // Education
          educations: [],
          // Present Status
          currentStatus: "",
          statusDate: "",
          convicted: "",
          politicalAffiliation: "",
          presentEmployment: "",
          achievements: "",
          // Candidate Dependents
          dependents: [],
          // Resumes
          resumes: [],
        });
        setEditingCandidate(null);
        fetchCandidates();
      }
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
      // Basic Info
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
      // Passport Info
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      passportIssuePlace: "",
      // Residence Info
      country: "",
      state: "",
      province: "",
      zip: "",
      district: "",
      city: "",
      street: "",
      // Contact Details
      phone: "",
      mobile: "",
      email: "",
      fax: "",
      website: "",
      contactAddress: "",
      returnAddress: "",
      emergencyContact: "",
      emergencyContactRelation: "",
      // Skills
      skills: [],
      // Education
      educations: [],
      // Present Status
      currentStatus: "",
      statusDate: "",
      convicted: "",
      politicalAffiliation: "",
      presentEmployment: "",
      achievements: "",
      // Candidate Dependents
      dependents: [],
      // Resumes
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
      phone: candidate.phone || "",
      mobile: candidate.mobile || candidate.contact || "",
      email: candidate.email || "",
      fax: candidate.fax || "",
      website: candidate.website || "",
      contactAddress: candidate.contactAddress || "",
      returnAddress: candidate.returnAddress || "",
      emergencyContact: candidate.emergencyContact || "",
      emergencyContactRelation: candidate.emergencyContactRelation || "",
      skills: candidate.skills || [],
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

  const filteredCandidates = (candidates || []).filter((candidate) => {
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
        <h1 className="text-2xl font-bold mb-4">
          Candidate Final Registration
        </h1>
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Sub Navbar Tabs */}
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

            {/* Form Fields based on activeTab */}
            {activeTab === "addEdit" && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            )}

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
                    placeholder="Username"
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
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="w-full px-3 py-2 border rounded"
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
                    placeholder="First Name"
                    className="w-full px-3 py-2 border rounded"
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
                    placeholder="Last Name"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC *
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    placeholder="CNIC"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father Name *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Father Name"
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
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="Date of Birth"
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
                    placeholder="Age"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place Of Birth
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    placeholder="Place Of Birth"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="Nationality"
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
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded"
                  />
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
                    placeholder="Religion"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wages/Salary
                  </label>
                  <input
                    type="number"
                    name="wages"
                    value={formData.wages}
                    onChange={handleInputChange}
                    placeholder="Wages"
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
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widow">Widow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Education</option>
                    <option value="computerscience">Computer Science</option>
                    <option value="engineering">Engineering</option>
                    <option value="arts">Arts</option>
                    <option value="designing">Designing</option>
                    <option value="mba finance">MBA Finance</option>
                    <option value="mba hr">MBA HR</option>
                    <option value="mba global chain supply">
                      MBA Global Chain Supply
                    </option>
                    <option value="B.A">B.A</option>
                    <option value="science">Science</option>
                    <option value="under matric">Under Matric</option>
                  </select>
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
                    placeholder="Profession"
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
                    placeholder="Experience"
                    className="w-full px-3 py-2 border rounded"
                  />
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
                    placeholder="Job Type"
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
                    placeholder="Job Applied For"
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
                    placeholder="Plan"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Drag & drop files here …
                  </p>
                </div>
              </div>
            )}

            {activeTab === "passport" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Zip
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
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
                    type="text"
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
                    Contact Address
                  </label>
                  <input
                    type="text"
                    name="contactAddress"
                    value={formData.contactAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Address
                  </label>
                  <input
                    type="text"
                    name="returnAddress"
                    value={formData.returnAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Relation
                  </label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Add Skill
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <input
                      type="date"
                      placeholder="From"
                      value={skillForm.from}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          from: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="date"
                      placeholder="To"
                      value={skillForm.to}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          to: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={skillForm.degree}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          degree: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Institute"
                      value={skillForm.institute}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          institute: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={skillForm.duration}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          duration: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={addSkill}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add Skill
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>
                          {skill.degree} - {skill.institute} - From:{" "}
                          {skill.from} - To: {skill.to} - Duration:{" "}
                          {skill.duration}
                        </span>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "status" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Have you ever convicted in police case in the court of law
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
                    political/religious party
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
                  <input
                    type="text"
                    name="presentEmployment"
                    value={formData.presentEmployment}
                    onChange={handleInputChange}
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
                    rows="4"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === "dependents" && (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Add Dependent
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select
                      value={dependentForm.dependent}
                      onChange={(e) =>
                        setDependentForm({
                          ...dependentForm,
                          dependent: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    >
                      <option value="">Select Dependent</option>
                      <option value="mother">Mother</option>
                      <option value="father">Father</option>
                      <option value="wife">Wife</option>
                      <option value="brother">Brother</option>
                      <option value="children">Children</option>
                      <option value="sisters">Sisters</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Gender"
                      value={dependentForm.gender}
                      onChange={(e) =>
                        setDependentForm({
                          ...dependentForm,
                          gender: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={dependentForm.age}
                      onChange={(e) =>
                        setDependentForm({
                          ...dependentForm,
                          age: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={addDependent}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add Dependent
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Dependents
                  </h3>
                  <div className="space-y-2">
                    {formData.dependents.map((dependent, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>
                          {dependent.dependent} - {dependent.gender} - Age:{" "}
                          {dependent.age}
                        </span>
                        <button
                          onClick={() => removeDependent(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Add Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <input
                      type="date"
                      placeholder="From"
                      value={educationForm.from}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          from: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="date"
                      placeholder="To"
                      value={educationForm.to}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          to: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={educationForm.degree}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          degree: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Institute"
                      value={educationForm.institute}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          institute: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={educationForm.duration}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          duration: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={addEducation}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add Education
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Education
                  </h3>
                  <div className="space-y-2">
                    {formData.educations.map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>
                          {edu.degree} - {edu.institute} - From: {edu.from} -
                          To: {edu.to} - Duration: {edu.duration}
                        </span>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resumes" && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume Name
                  </label>
                  <input
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    placeholder="Enter resume name"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resumes
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Drag & drop files here …
                </p>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Resumes
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border px-4 py-2 text-left">Name</th>
                          <th className="border px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.resumes.length > 0 ? (
                          formData.resumes.map((file, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border px-4 py-2">{file.name}</td>
                              <td className="border px-4 py-2">
                                <button
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      resumes: formData.resumes.filter(
                                        (_, i) => i !== index
                                      ),
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="2"
                              className="border px-4 py-8 text-center text-gray-500"
                            >
                              No resumes uploaded
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Candidates</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setActiveTab("addEdit");
                setEditingCandidate(null);
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
                  address: "",
                  city: "",
                  state: "",
                  country: "",
                  postalCode: "",
                  mobile: "",
                  email: "",
                  emergencyContact: "",
                  emergencyContactRelation: "",
                  skills: [],
                  currentStatus: "",
                  statusDate: "",
                  dependents: [],
                  resumes: [],
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
                      <td className="border px-4 py-2">{c.contact}</td>
                      <td className="border px-4 py-2">{c.status}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                        >
                          Edit
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
