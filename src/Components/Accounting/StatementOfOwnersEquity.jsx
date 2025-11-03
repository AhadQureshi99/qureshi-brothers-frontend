import React, { useState } from "react";
import { FaPrint, FaEye } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const StatementOfOwnersEquity = () => {
  const [statementOfOwnersEquity, setStatementOfOwnersEquity] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const loadStatementOfOwnersEquity = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await axios.get(
        "/api/accounting/reports/statement-of-owners-equity",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setStatementOfOwnersEquity(res.data.statementOfOwnersEquity || {});
    } catch (err) {
      console.error("Load statement of owners equity error", err);
      toast.error("Failed to load statement of owners equity");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    loadStatementOfOwnersEquity();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Statement of Owners Equity Report
          </h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
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
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
              <div className="text-gray-500">
                Loading statement of owners equity...
              </div>
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Particulars
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {statementOfOwnersEquity.openingEquity !== undefined ? (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Opening Equity
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {statementOfOwnersEquity.openingEquity?.toFixed(2) ||
                          "0.00"}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Net Income
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {statementOfOwnersEquity.netIncome?.toFixed(2) ||
                          "0.00"}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Equity Changes
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {statementOfOwnersEquity.equityChanges?.toFixed(2) ||
                          "0.00"}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-bold">
                      <td className="border border-gray-300 px-4 py-2">
                        Closing Equity
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {statementOfOwnersEquity.closingEquity?.toFixed(2) ||
                          "0.00"}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No data found. Please adjust filters and view report.
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

export default StatementOfOwnersEquity;
