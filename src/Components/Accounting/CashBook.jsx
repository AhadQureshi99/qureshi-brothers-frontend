import React, { useState, useEffect } from "react";
import { FaEye, FaPrint } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const CashBook = () => {
  const [cashBookData, setCashBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    accountId: "",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/accounting/accounts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Load accounts error", err);
      toast.error("Failed to load accounts");
    }
  };

  const loadCashBook = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.accountId) params.accountId = filters.accountId;

      const res = await axios.get("/api/accounting/reports/cash-book", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setCashBookData(res.data.cashBook || []);
    } catch (err) {
      console.error("Load cash book error", err);
      toast.error("Failed to load cash book");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleViewReport = () => {
    loadCashBook();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cash Book</h1>
          <div className="flex gap-4">
            <button
              onClick={handleViewReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaEye /> View Report
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account/Party
              </label>
              <select
                name="accountId"
                value={filters.accountId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.accountCode} - {account.accountName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Data */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Report Data</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading cash book...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Voucher Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Voucher#
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Description
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
                  {cashBookData.length > 0 ? (
                    cashBookData.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.date}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.voucherType}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.voucherNumber}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.description}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.debit?.toFixed(2) || "0.00"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.credit?.toFixed(2) || "0.00"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.balance?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No cash book data found. Please adjust filters and view
                        report.
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

export default CashBook;
