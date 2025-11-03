import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const CandidateAgentLedger = () => {
  const [fromDate, setFromDate] = useState("2025-07-01");
  const [toDate, setToDate] = useState("2025-11-03");
  const [agent, setAgent] = useState("");

  const handlePrint = () => {
    // Placeholder for print functionality
    alert("Print clicked");
  };

  const handleShowReports = () => {
    // Placeholder for show reports functionality
    alert("Show Reports clicked");
  };

  // Mock data for report data
  const reportData = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Recruitment Agent Ledger</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent
              </label>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Agent</option>
                {/* Add options dynamically */}
              </select>
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Print
            </button>
            <button
              onClick={handleShowReports}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Show Reports
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Report Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Vou.Type
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Vou#
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Passport/Chq
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Passenger
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Trade
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Debit
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Credit
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  reportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm">
                        {item.date}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.vouType}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.vouNumber}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.passportChq}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.passenger}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.trade}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.status}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.debit}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.credit}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.balance}
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

export default CandidateAgentLedger;
