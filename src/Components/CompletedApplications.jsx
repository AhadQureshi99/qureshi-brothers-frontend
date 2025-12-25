import React, { useState } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const CompletedApplications = () => {
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

  // Permission check
  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.completedApplications?.view ===
      true;

  if (!canView) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            <strong>Access Denied:</strong> You do not have permission to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const completedApplications = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Completed Applications</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Completed Applications Details
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
                    Salary
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Company Name
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Contact Person
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Candidate Name
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Mobile
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Application Date
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  completedApplications.map((application, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm">
                        {application.jobTitle}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.salary}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.companyName}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.contactPerson}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.candidateName}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.mobile}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.applicationDate}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {application.status}
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

export default CompletedApplications;
