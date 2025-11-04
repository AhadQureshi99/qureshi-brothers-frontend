import React, { useState, useEffect } from "react";
import { FaPrint, FaSearch } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const CandidateApplicationStatusReport = () => {
  const [filters, setFilters] = useState({
    employer: "",
    job: "",
    category: "",
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns - replace with actual API calls
  const employers = ["Employer A", "Employer B", "Employer C"];
  const jobs = ["Job 1", "Job 2", "Job 3"];
  const categories = ["Category 1", "Category 2", "Category 3"];

  useEffect(() => {
    // Load initial data if needed
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShowReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/candidates/application-status-report",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        }
      );
      setReportData(response.data.candidates || []);
    } catch (error) {
      toast.error("Failed to fetch report data");
      console.error(error);
      // Mock data for demonstration
      setReportData([
        {
          candidateName: "Yasir Ali",
          mobile: "",
          age: "29 years,2 months",
          city: "",
          education: "Under Matric",
          category: "",
          religion: "",
          nationality: "Pakistani",
          stepNumber: "1",
        },
        {
          candidateName: "Tanweer Ahmed",
          mobile: "",
          age: "42 years,1 month",
          city: "",
          education: "Computer Science",
          category: "",
          religion: "Islam",
          nationality: "United Kingdom",
          stepNumber: "2",
        },
        {
          candidateName: "Junaid Ali",
          mobile: "",
          age: "28 years,7 months",
          city: "",
          education: "Under Matric",
          category: "",
          religion: "",
          nationality: "Pakistani",
          stepNumber: "3",
        },
        {
          candidateName: "Ateeq Qureshi",
          mobile: "",
          age: "31 years,5 months",
          city: "",
          education: "Computer Science",
          category: "",
          religion: "Islam",
          nationality: "Pakistani",
          stepNumber: "4",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (reportData.length === 0) {
      toast.error("Please generate a report first");
      return;
    }
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Candidate Application Status Report
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleShowReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaSearch />
              Show Report
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer *
              </label>
              <select
                value={filters.employer}
                onChange={(e) => handleFilterChange("employer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employer</option>
                {employers.map((employer, index) => (
                  <option key={index} value={employer}>
                    {employer}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job *
              </label>
              <select
                value={filters.job}
                onChange={(e) => handleFilterChange("job", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job</option>
                {jobs.map((job, index) => (
                  <option key={index} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Report Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Candidate Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Mobile
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Age
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    City
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Education
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Religion
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Nationality
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    StepNumber
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? (
                  reportData.map((candidate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.candidateName || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.mobile || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.age || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.city || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.education || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.category || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.religion || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.nationality || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.stepNumber || ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      {loading
                        ? "Loading..."
                        : "No data available. Click 'Show Report' to generate the report."}
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

export default CandidateApplicationStatusReport;
