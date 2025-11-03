import React, { useState } from "react";
import { FaPrint, FaEye } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const IncomeStatement = () => {
  const [incomeStatement, setIncomeStatement] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const loadIncomeStatement = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await axios.get("/api/accounting/reports/income-statement", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setIncomeStatement(res.data.incomeStatement || {});
    } catch (err) {
      console.error("Load income statement error", err);
      toast.error("Failed to load income statement");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    loadIncomeStatement();
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
            Income Statement Report
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
              <div className="text-gray-500">Loading income statement...</div>
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Sr. No.
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Particulars
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Most Inner Column
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Inner Column
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Outer Column
                  </th>
                </tr>
              </thead>
              <tbody>
                {incomeStatement.revenue !== undefined ? (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Revenue
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {incomeStatement.revenue?.toFixed(2) || "0.00"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Expenses
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                      <td className="border border-gray-300 px-4 py-2">
                        {incomeStatement.expenses?.toFixed(2) || "0.00"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-semibold">
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Net Income
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                      <td className="border border-gray-300 px-4 py-2">
                        {incomeStatement.netIncome?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="5"
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

export default IncomeStatement;
