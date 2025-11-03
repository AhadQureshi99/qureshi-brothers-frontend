import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const JobSetup = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    employer: "",
    jobTitle: "",
    jobNo: "",
    processTypes: "",
    receiptDate: "",
    letterNo: "",
    visaNo: "",
    numberOfVisa: "",
    visaDate: "",
    currency: "",
    permissionNo: "",
    permissionDate: "",
    issuanceDate: "",
    deadlineDate: "",
    salaryAmount: "",
    deploymentArea: "",
    city: "",
    state: "",
    country: "",
    categories: "",
    jobTitleForDisplay: "",
    type: "",
    noOfPerson: "",
    educationalCategory: "",
    educationLevel: "",
    experienceRange: "",
    ageRange: "",
    salaryRange: "",
    careerLevel: "",
    salary: "",
    contractDuration: "",
    skills: "",
    additionalExperience: "",
    jobDetails: "",
    specialInstructions: "",
    jobDescription: "",
    jobType: "Full Time",
    applyMode: "With Resume Online",
    jobStatus: "Open",
    showOnWeb: false,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value; // 'save' or 'saveAndClose'
    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        ...formData,
        numberOfVisa: parseInt(formData.numberOfVisa) || 0,
        salaryAmount: parseFloat(formData.salaryAmount) || 0,
        noOfPerson: parseInt(formData.noOfPerson) || 0,
        salary: parseFloat(formData.salary) || 0,
        contractDuration: parseInt(formData.contractDuration) || 0,
      };

      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob._id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job updated successfully");
      } else {
        await axios.post("/api/jobs/", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job created successfully");
      }

      fetchJobs();

      if (action === "saveAndClose") {
        setShowForm(false);
        setEditingJob(null);
        resetForm();
      } else {
        // For 'save', reset form only if adding new job
        if (!editingJob) {
          resetForm();
        }
        // For editing, keep the form open with current data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
      console.error(error);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      employer: job.employer || "",
      jobTitle: job.jobTitle || "",
      jobNo: job.jobNo || "",
      processTypes: job.processTypes || "",
      receiptDate: job.receiptDate || "",
      letterNo: job.letterNo || "",
      visaNo: job.visaNo || "",
      numberOfVisa: job.numberOfVisa || "",
      visaDate: job.visaDate || "",
      currency: job.currency || "",
      permissionNo: job.permissionNo || "",
      permissionDate: job.permissionDate || "",
      issuanceDate: job.issuanceDate || "",
      deadlineDate: job.deadlineDate || "",
      salaryAmount: job.salaryAmount || "",
      deploymentArea: job.deploymentArea || "",
      city: job.city || "",
      state: job.state || "",
      country: job.country || "",
      categories: job.categories || "",
      jobTitleForDisplay: job.jobTitleForDisplay || "",
      type: job.type || "",
      noOfPerson: job.noOfPerson || "",
      educationalCategory: job.educationalCategory || "",
      educationLevel: job.educationLevel || "",
      experienceRange: job.experienceRange || "",
      ageRange: job.ageRange || "",
      salaryRange: job.salaryRange || "",
      careerLevel: job.careerLevel || "",
      salary: job.salary || "",
      contractDuration: job.contractDuration || "",
      skills: job.skills || "",
      additionalExperience: job.additionalExperience || "",
      jobDetails: job.jobDetails || "",
      specialInstructions: job.specialInstructions || "",
      jobDescription: job.jobDescription || "",
      jobType: job.jobType || "Full Time",
      applyMode: job.applyMode || "With Resume Online",
      jobStatus: job.jobStatus || "Open",
      showOnWeb: job.showOnWeb || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete job");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      employer: "",
      jobTitle: "",
      jobNo: "",
      processTypes: "",
      receiptDate: "",
      letterNo: "",
      visaNo: "",
      numberOfVisa: "",
      visaDate: "",
      currency: "",
      permissionNo: "",
      permissionDate: "",
      issuanceDate: "",
      deadlineDate: "",
      salaryAmount: "",
      deploymentArea: "",
      city: "",
      state: "",
      country: "",
      categories: "",
      jobTitleForDisplay: "",
      type: "",
      noOfPerson: "",
      educationalCategory: "",
      educationLevel: "",
      experienceRange: "",
      ageRange: "",
      salaryRange: "",
      careerLevel: "",
      salary: "",
      contractDuration: "",
      skills: "",
      additionalExperience: "",
      jobDetails: "",
      specialInstructions: "",
      jobDescription: "",
      jobType: "Full Time",
      applyMode: "With Resume Online",
      jobStatus: "Open",
      showOnWeb: false,
    });
  };

  const handleNew = () => {
    setEditingJob(null);
    resetForm();
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Manage Jobs</h1>

      {!showForm ? (
        <>
          <div className="mb-4">
            <button
              onClick={handleNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Job Title</th>
                  <th className="px-4 py-2 border">Employer</th>
                  <th className="px-4 py-2 border">Job No</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{job.jobTitle}</td>
                    <td className="px-4 py-2 border">{job.employer}</td>
                    <td className="px-4 py-2 border">{job.jobNo}</td>
                    <td className="px-4 py-2 border">{job.jobStatus}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(job)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {editingJob ? "Edit Job" : "Add/Edit Detail"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Employer *</label>
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Job No. *</label>
                <input
                  type="text"
                  name="jobNo"
                  value={formData.jobNo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Process Types *
                </label>
                <input
                  type="text"
                  name="processTypes"
                  value={formData.processTypes}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Receipt Date
                </label>
                <input
                  type="date"
                  name="receiptDate"
                  value={formData.receiptDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Letter No</label>
                <input
                  type="text"
                  name="letterNo"
                  value={formData.letterNo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Visa No</label>
                <input
                  type="text"
                  name="visaNo"
                  value={formData.visaNo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Number of Visa
                </label>
                <input
                  type="number"
                  name="numberOfVisa"
                  value={formData.numberOfVisa}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Visa Date</label>
                <input
                  type="date"
                  name="visaDate"
                  value={formData.visaDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Permission No. *
                </label>
                <input
                  type="text"
                  name="permissionNo"
                  value={formData.permissionNo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Permission Date *
                </label>
                <input
                  type="date"
                  name="permissionDate"
                  value={formData.permissionDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Issuance Date
                </label>
                <input
                  type="date"
                  name="issuanceDate"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Deadline Date
                </label>
                <input
                  type="date"
                  name="deadlineDate"
                  value={formData.deadlineDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Salary Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="salaryAmount"
                  value={formData.salaryAmount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Deployment Area
                </label>
                <input
                  type="text"
                  name="deploymentArea"
                  value={formData.deploymentArea}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Categories *
                </label>
                <input
                  type="text"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Job Title for Display *
                </label>
                <input
                  type="text"
                  name="jobTitleForDisplay"
                  value={formData.jobTitleForDisplay}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Type *</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  No of Person *
                </label>
                <input
                  type="number"
                  name="noOfPerson"
                  value={formData.noOfPerson}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Educational Category
                </label>
                <input
                  type="text"
                  name="educationalCategory"
                  value={formData.educationalCategory}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Education Level
                </label>
                <input
                  type="text"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Experience Range
                </label>
                <input
                  type="text"
                  name="experienceRange"
                  value={formData.experienceRange}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Age Range</label>
                <input
                  type="text"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Career Level
                </label>
                <input
                  type="text"
                  name="careerLevel"
                  value={formData.careerLevel}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Contract Duration *
                </label>
                <input
                  type="number"
                  name="contractDuration"
                  value={formData.contractDuration}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Additional Experience
                </label>
                <textarea
                  name="additionalExperience"
                  value={formData.additionalExperience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Job Details</label>
                <textarea
                  name="jobDetails"
                  value={formData.jobDetails}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Apply Mode</label>
                <select
                  name="applyMode"
                  value={formData.applyMode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="With Resume Online">With Resume Online</option>
                  <option value="Via Email">Via Email</option>
                  <option value="Via Post">Via Post</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Job Status</label>
                <select
                  name="jobStatus"
                  value={formData.jobStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  <input
                    type="checkbox"
                    name="showOnWeb"
                    checked={formData.showOnWeb}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Show On Web
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                value="save"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="submit"
                value="saveAndClose"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save & Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobSetup;
