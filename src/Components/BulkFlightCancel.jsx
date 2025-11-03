import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const BulkFlightCancel = () => {
  const [employer, setEmployer] = useState("");
  const [job, setJob] = useState("");

  const handleLoadFlights = () => {
    // Placeholder for loading flights logic
    alert("Load Flights clicked");
  };

  // Mock data for short listed candidates
  const shortListedCandidates = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Flight Cancellation</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          </div>
          <button
            onClick={handleLoadFlights}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          >
            Load Flights
          </button>
          <h2 className="text-xl font-semibold mb-4">
            Short Listed Candidates
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Candidate Name
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Mobile
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
                {shortListedCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  shortListedCandidates.map((candidate, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default BulkFlightCancel;
