import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const CandidateLedgerExpenses = () => {
  const [passenger, setPassenger] = useState("");

  // Mock data for ledger entries
  const ledgerEntries = [
    // Add mock data if needed, currently empty as per "No data available"
  ];

  // Mock data for particulars
  const particulars = [
    { particulars: "Ledger", amount: 0 },
    { particulars: "Expenses", amount: 0 },
  ];

  const totalProfit = particulars.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Passenger Ledger</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Report Filters</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passenger
            </label>
            <select
              value={passenger}
              onChange={(e) => setPassenger(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Passenger</option>
              {/* Add options dynamically */}
            </select>
          </div>
          <h2 className="text-xl font-semibold mb-4">Report Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passenger:
              </label>
              <input
                type="text"
                value={passenger}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent:
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Vou. Type
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Vou#
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Particulars
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
                {ledgerEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  ledgerEntries.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.date}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.vouType}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.vouNumber}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.particulars}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.debit}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.credit}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {entry.balance}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Particulars
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {particulars.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-sm">
                      {item.particulars}
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      {item.amount}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-4 py-2 border-b text-sm">Total Profit:</td>
                  <td className="px-4 py-2 border-b text-sm">{totalProfit}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLedgerExpenses;
