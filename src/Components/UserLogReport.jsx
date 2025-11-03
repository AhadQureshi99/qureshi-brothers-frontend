import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const UserLogReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/users/logs?from=${fromDate}&to=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching user log report:", error);
      alert("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          User Log Report
        </h1>

        {/* Report Parameters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Report Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Report Data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Report Data</h2>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              <FaPrint />
              Print
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading report data...</div>
          ) : reportData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available. Please generate the report.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Username
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Created At
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((user, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {user.role}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogReport;
