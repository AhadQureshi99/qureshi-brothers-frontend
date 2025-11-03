import React, { useState, useEffect } from "react";
import { FaEye, FaPrint } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const EmployerLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    accountId: "",
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/accounting/accounts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data.accounts || []);
    } catch (error) {
      toast.error("Failed to fetch accounts");
      console.error(error);
    }
  };

  const loadEmployerLedger = async () => {
    if (!filters.accountId) {
      toast.error("Please select an account/party");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        accountId: filters.accountId,
      };
      if (filters.fromDate) params.startDate = filters.fromDate;
      if (filters.toDate) params.endDate = filters.toDate;

      const res = await axios.get("/api/accounting/reports/general-ledger", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setLedgerData(res.data.generalLedger || []);
    } catch (err) {
      console.error("Load employer ledger error", err);
      toast.error("Failed to load employer ledger");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleViewReport = () => {
    loadEmployerLedger();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employer Ledger</h1>
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
                From Date
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
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
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
                <option value="">Select Account/Party</option>
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Report Data</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading employer ledger...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
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
                  {ledgerData.length > 0 ? (
                    ledgerData.map((entry, index) => (
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
                          {entry.debit ? entry.debit.toFixed(2) : "0.00"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.credit ? entry.credit.toFixed(2) : "0.00"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {entry.balance ? entry.balance.toFixed(2) : "0.00"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No ledger data found. Please adjust filters and view
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

export default EmployerLedger;
