import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const OnlineApplications = () => {
  const [employer, setEmployer] = useState("");
  const [job, setJob] = useState("");
  const [candidate, setCandidate] = useState("");
  const [search, setSearch] = useState("");

  // Mock data for demonstration
  const onlineApplications = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Online Applications</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Manage Online Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer:
              </label>
              <select
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employer</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job:
              </label>
              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate:
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
          </div>
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
                placeholder=""
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
                {onlineApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  onlineApplications.map((application, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm">
                        {application.jobTitle}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.principleCompany}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.candidateName}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.contactPerson}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.name}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.mobile}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.applicationDate}
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
  );
};

export default OnlineApplications;
