import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JobPayment = () => {
  const dispatch = useDispatch();
  const [jobPayments, setJobPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobPayments();
  }, []);

  const fetchJobPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/accounting/job-payments/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setJobPayments(data);
    } catch (error) {
      toast.error("Failed to fetch job payments");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = jobPayments.filter(
    (payment) =>
      payment.employer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Job Payments
            </h1>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
              Add New Payment
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Job Payment Listing</span>
              <span className="text-sm text-gray-500">Employer</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {itemsPerPage} records
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="umer.aziz"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Id
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UnSkilled
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semi Skilled
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skilled
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Highly Skilled
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Highly Qualified
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment, index) => (
                      <tr key={payment._id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.employer?.name || "N/A"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.employer?.email || "N/A"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.employer?.phone || "N/A"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.job?.title || "N/A"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.unSkilled || 0}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.semiSkilled || 0}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.skilled || 0}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.highlySkilled || 0}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.highlyQualified || 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of{" "}
              {filteredPayments.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPayment;
