import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const ShortlistedCandidates = () => {
  const [search, setSearch] = useState("");

  // Mock data for demonstration
  const shortlistedCandidates = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Short Listed Candidates</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Short Listed Candidates Details
          </h2>
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
                    Candidate Name
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Mobile #
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Address
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Employer
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Job Title
                  </th>
                </tr>
              </thead>
              <tbody>
                {shortlistedCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  shortlistedCandidates.map((candidate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm">
                        {candidate.candidateName}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {candidate.mobile}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {candidate.address}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {candidate.employer}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {candidate.jobTitle}
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

export default ShortlistedCandidates;
