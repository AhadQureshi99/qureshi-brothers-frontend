import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const CandidateFinalRegistration = () => {
  const [activeTab, setActiveTab] = useState("addEdit");
  const [showForm, setShowForm] = useState(false);
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
      const response = await axios.get(
        "https://api.cloudandroots.com/api/candidates/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCandidates(response.data || []);
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
          `https://api.cloudandroots.com/api/candidates/${editingCandidate._id}`,
          candidateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Candidate updated successfully");
      } else {
        await axios.post(
          "https://api.cloudandroots.com/api/candidates/",
          candidateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
          : "Failed to register candidate"
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
            {activeTab === "addEdit" && (
              <div className="text-center py-10">
                <p className="text-gray-600">
                  Select a tab to edit details. Save when finished.
                </p>
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
                {/* ... other fields (title, firstName, lastName, cnic, etc.) ... */}
                {/* I truncated here for brevity – copy the rest from your original code */}
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
                {/* ... other passport fields ... */}
              </div>
            )}

            {/* Add your other tabs similarly: residence, contact, skills, education, status, dependents, resumes */}
            {/* Example for skills tab: */}
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
                        setSkillForm((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border rounded"
                    />
                    {/* ... other skill inputs ... */}
                  </div>
                  <button
                    onClick={addSkill}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add Skill
                  </button>
                </div>
                {/* ... display skills list ... */}
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
                        {/* Edit button removed */}
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "visaCandidates",
                              JSON.stringify(filteredCandidates)
                            );
                            localStorage.setItem(
                              "visaCandidateIndex",
                              String(i)
                            );
                            window.location.href = "/visa-form";
                          }}
                          className="px-2 py-1 bg-green-600 text-white rounded mr-2"
                        >
                          Visa
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "depositCandidates",
                              JSON.stringify(filteredCandidates)
                            );
                            localStorage.setItem(
                              "depositCandidateIndex",
                              String(i)
                            );
                            window.location.href = "/deposit-slip";
                          }}
                          className="px-2 py-1 bg-purple-600 text-white rounded mr-2"
                        >
                          Deposit
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "nbpCandidates",
                              JSON.stringify(filteredCandidates)
                            );
                            localStorage.setItem(
                              "nbpCandidateIndex",
                              String(i)
                            );
                            window.location.href = "/nbpchallan";
                          }}
                          className="px-2 py-1 bg-yellow-600 text-white rounded mr-2"
                        >
                          NBP
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "undertakingCandidates",
                              JSON.stringify(filteredCandidates)
                            );
                            localStorage.setItem(
                              "undertakingCandidateIndex",
                              String(i)
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
                              JSON.stringify(filteredCandidates)
                            );
                            localStorage.setItem(
                              "contactCandidateIndex",
                              String(i)
                            );
                            window.location.href = "/contact";
                          }}
                          className="px-2 py-1 bg-cyan-600 text-white rounded mr-2"
                        >
                          Contact
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "alliedCandidates",
                              JSON.stringify(filteredCandidates)
                            );
                            localStorage.setItem(
                              "alliedCandidateIndex",
                              String(i)
                            );
                            window.location.href = "/allied-form";
                          }}
                          className="px-2 py-1 bg-teal-600 text-white rounded mr-2"
                        >
                          Allied
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
