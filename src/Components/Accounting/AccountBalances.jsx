import React, { useState, useEffect } from "react";
import { FaPrint, FaEye } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const AccountBalances = () => {
  const [balances, setBalances] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    account: "",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/accounting/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Load accounts error", err);
      toast.error("Failed to load accounts");
    }
  };

  const loadBalances = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      if (filters.account) params.accountId = filters.account;

      const res = await axios.get("/api/accounting/reports/account-balances", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setBalances(res.data.balances || []);
    } catch (err) {
      console.error("Load balances error", err);
      toast.error("Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleViewReport = () => {
    loadBalances();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Account Balances</h1>
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
                From Date *
              </label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <select
                name="account"
                value={filters.account}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.accountCode} - {account.accountName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Balances Data */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Balances Data</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading balances...</div>
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Account Code
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Account Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Debit Balance
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Credit Balance
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Net Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {balances.length > 0 ? (
                  balances.map((balance, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {balance.accountCode}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {balance.accountName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {balance.accountType}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {balance.debitBalance?.toFixed(2) || "0.00"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {balance.creditBalance?.toFixed(2) || "0.00"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {balance.netBalance?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No balances found. Please adjust filters and view report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountBalances;
