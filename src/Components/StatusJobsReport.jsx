import React, { useState } from "react";
import { FaPrint, FaEye } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const StatusJobsReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShowReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/employer-management/status-jobs-report",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { fromDate, toDate },
        }
      );
      setReportData(response.data.report || []);
    } catch (error) {
      toast.error("Failed to fetch report data");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            Status of Jobs Report
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleShowReport}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                From Date *
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                To Date *
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Report Data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Report Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Sr. No
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Employer
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Job Title
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Categories
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Vacancies
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Jobs in Process
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Filled
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : reportData.length > 0 ? (
                  reportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.employer || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.jobTitle || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.categories || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.vacancies || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.jobsInProcess || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.filled || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.balance || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No data available. Please select dates and click "Show
                      Report".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusJobsReport;
