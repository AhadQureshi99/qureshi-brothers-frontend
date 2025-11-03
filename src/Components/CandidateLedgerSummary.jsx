import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const CandidateLedgerSummary = () => {
  const [fromDate, setFromDate] = useState("2025-07-01");
  const [toDate, setToDate] = useState("2025-11-03");

  const handlePrint = () => {
    // Placeholder for print functionality
    alert("Print clicked");
  };

  // Mock data for report data
  const reportData = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">File Passenger Summary</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          >
            Print
          </button>
          <h2 className="text-xl font-semibold mb-4">Report Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    File
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Passenger Name
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Father Name
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Passport
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Agent
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Receivable
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Received
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Ledger Balance
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Last Ledger Date
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Expenses
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Last Expenses
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Gross Income
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="12"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  reportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm">
                        {item.file}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.passengerName}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.fatherName}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.passport}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.agent}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.receivable}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.received}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.ledgerBalance}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.lastLedgerDate}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.expenses}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.lastExpenses}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {item.grossIncome}
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

export default CandidateLedgerSummary;
