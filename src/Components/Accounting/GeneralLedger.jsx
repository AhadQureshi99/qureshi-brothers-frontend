import React, { useState, useEffect } from "react";
import { FaEye, FaPrint } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const TrialBalance = () => {
  const [trialBalanceData, setTrialBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    filterZeroBalance: false,
  });

  const loadTrialBalance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      params.filterZeroBalance = filters.filterZeroBalance;

      const res = await axios.get("/api/accounting/reports/trial-balance", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTrialBalanceData(res.data.trialBalance || []);
    } catch (err) {
      console.error("Load trial balance error", err);
      toast.error("Failed to load trial balance");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleViewReport = () => {
    loadTrialBalance();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Trial Balance</h1>
          <div className="flex gap-4">
            <button
              onClick={handleViewReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaEye />
              Show Report
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date *
              </label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date *
              </label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="filterZeroBalance"
                checked={filters.filterZeroBalance}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Filter Zero Balance
              </label>
            </div>
          </div>
        </div>

        {/* Report Data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Report Data</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading trial balance...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Code
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Account Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Opening Balance
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Debit
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Credit
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalanceData.length > 0 ? (
                    trialBalanceData.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.code}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.accountName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.openingBalance}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.debit}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.credit}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.balance}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No trial balance data found. Please adjust filters and
                        view report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
