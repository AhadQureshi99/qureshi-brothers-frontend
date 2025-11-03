import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const ApplyJob = () => {
  const [employers, setEmployers] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategories, setJobCategories] = useState("");
  const [allCandidates, setAllCandidates] = useState("");
  const [candidate, setCandidate] = useState("");
  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    cnic: "",
    qualification: "",
    mobile: "",
  });
  const [search, setSearch] = useState("");

  // Mock data for demonstration
  const appliedJobs = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Apply Job</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add/Edit Detail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employers *
              </label>
              <select
                value={employers}
                onChange={(e) => setEmployers(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employer</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job Title</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Categories *
              </label>
              <select
                value={jobCategories}
                onChange={(e) => setJobCategories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job Category</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                All Candidates
              </label>
              <select
                value={allCandidates}
                onChange={(e) => setAllCandidates(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Candidate</option>
                {/* Add options dynamically */}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Candidate *
            </label>
            <select
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Candidate</option>
              {/* Add options dynamically */}
            </select>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Candidate Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={candidateInfo.name}
                  onChange={(e) =>
                    setCandidateInfo({ ...candidateInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNIC
                </label>
                <input
                  type="text"
                  value={candidateInfo.cnic}
                  onChange={(e) =>
                    setCandidateInfo({ ...candidateInfo, cnic: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  value={candidateInfo.qualification}
                  onChange={(e) =>
                    setCandidateInfo({
                      ...candidateInfo,
                      qualification: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  value={candidateInfo.mobile}
                  onChange={(e) =>
                    setCandidateInfo({
                      ...candidateInfo,
                      mobile: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Applied Job Listing</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">10 records</div>
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-700">
                  Search:
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="umer.aziz"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Job Title
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Principle Company
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Candidate Name
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Contact Person
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Mobile
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Application Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appliedJobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    appliedJobs.map((job, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b text-sm">
                          {job.jobTitle}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {job.principleCompany}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {job.candidateName}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {job.contactPerson}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {job.name}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {job.mobile}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {job.applicationDate}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing 0 to 0 of 0 entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
