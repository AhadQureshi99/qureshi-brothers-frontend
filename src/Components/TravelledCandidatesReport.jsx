import React, { useState, useEffect } from "react";
import { FaPrint, FaSearch } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const TravelledCandidatesReport = () => {
  const [filters, setFilters] = useState({
    company: "",
    category: "",
    subCategory: "",
    workingCategory: "",
    experience: "",
    experienceType: "",
    city: "",
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns - replace with actual API calls
  const companies = ["Company A", "Company B", "Company C"];
  const categories = ["Category 1", "Category 2", "Category 3"];
  const subCategories = ["Sub Category 1", "Sub Category 2"];
  const workingCategories = ["Working Category 1", "Working Category 2"];
  const experiences = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];
  const experienceTypes = ["Type 1", "Type 2"];

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
      const response = await axios.get("/api/candidates/travelled-report", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
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
          religion: "",
          nationality: "Pakistani",
          status: "",
          education: "Under Matric",
          fromYear: "",
          toYear: "",
          category: "",
          subCategory: "",
          workingCategory: "",
          companyName: "",
        },
        {
          candidateName: "Tanweer Ahmed",
          mobile: "",
          age: "42 years,1 month",
          city: "",
          religion: "Islam",
          nationality: "United Kingdom",
          status: "",
          education: "Computer Science",
          fromYear: "",
          toYear: "",
          category: "",
          subCategory: "",
          workingCategory: "",
          companyName: "",
        },
        {
          candidateName: "Junaid Ali",
          mobile: "",
          age: "28 years,7 months",
          city: "",
          religion: "",
          nationality: "Pakistani",
          status: "",
          education: "Under Matric",
          fromYear: "",
          toYear: "",
          category: "",
          subCategory: "",
          workingCategory: "",
          companyName: "",
        },
        {
          candidateName: "Ateeq Qureshi",
          mobile: "",
          age: "31 years,5 months",
          city: "",
          religion: "Islam",
          nationality: "Pakistani",
          status: "",
          education: "Computer Science",
          fromYear: "",
          toYear: "",
          category: "",
          subCategory: "",
          workingCategory: "",
          companyName: "",
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
            Travelled Candidates Report
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
                Company
              </label>
              <select
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Company</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category
              </label>
              <select
                value={filters.subCategory}
                onChange={(e) =>
                  handleFilterChange("subCategory", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sub Category</option>
                {subCategories.map((subCat, index) => (
                  <option key={index} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Category
              </label>
              <select
                value={filters.workingCategory}
                onChange={(e) =>
                  handleFilterChange("workingCategory", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Working Category</option>
                {workingCategories.map((workCat, index) => (
                  <option key={index} value={workCat}>
                    {workCat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience:
              </label>
              <select
                value={filters.experience}
                onChange={(e) =>
                  handleFilterChange("experience", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Experience</option>
                {experiences.map((exp, index) => (
                  <option key={index} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Type:
              </label>
              <select
                value={filters.experienceType}
                onChange={(e) =>
                  handleFilterChange("experienceType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Experience Type</option>
                {experienceTypes.map((expType, index) => (
                  <option key={index} value={expType}>
                    {expType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="umer.aziz"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                    Mobile #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Age
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    City
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Religion
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Nationality
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Education / Qualification
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    From Year
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    To Year
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Sub Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Working Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                    Company Name
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
                        {candidate.religion || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.nationality || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.status || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.education || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.fromYear || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.toYear || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.category || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.subCategory || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.workingCategory || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {candidate.companyName || ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="14"
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

export default TravelledCandidatesReport;
