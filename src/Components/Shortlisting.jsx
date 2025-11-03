import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const Shortlisting = () => {
  const [employers, setEmployers] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategories, setJobCategories] = useState("");
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [message, setMessage] = useState(
    "Dear {Name} congratulations upon shortlisting of your job application for the post of {JobPosition}."
  );

  // Mock data for demonstration
  const shortlistedCandidates = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  const handleSendEmail = () => {
    // Handle send email logic
    console.log("Sending email...");
  };

  const handleSendSMS = () => {
    // Handle send SMS logic
    console.log("Sending SMS...");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Short Listing</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Short List Candidate by Job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Short Listed Candidate
            </h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showPlaceholders"
                checked={showPlaceholders}
                onChange={(e) => setShowPlaceholders(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="showPlaceholders"
                className="text-sm font-medium text-gray-700"
              >
                Show/Hide Place Holders
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Email
              </button>
              <button
                onClick={handleSendSMS}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Send SMS
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">All</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Qualification
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      City
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Mobile
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Address
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Experience
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shortlistedCandidates.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    shortlistedCandidates.map((candidate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.name}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.qualification}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.city}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.mobile}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.email}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.address}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.experience}
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
    </div>
  );
};

export default Shortlisting;
