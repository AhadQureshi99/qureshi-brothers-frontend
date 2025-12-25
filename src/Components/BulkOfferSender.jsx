import React, { useState } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const BulkOfferSender = () => {
  const { user } = useSelector((state) => state.user);
  const [employer, setEmployer] = useState("");
  const [job, setJob] = useState("");
  const [category, setCategory] = useState("");

  // Permission check
  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.bulkOfferSender?.view === true;

  if (!canView) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            <strong>Access Denied:</strong> You do not have permission to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  const handleShowApplicants = () => {
    // Placeholder for showing applicants logic
    alert("Show Applicants clicked");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Bulk Offer Sender</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer: *
              </label>
              <select
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employer</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job: *
              </label>
              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job</option>
                {/* Add options dynamically */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category: *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {/* Add options dynamically */}
              </select>
            </div>
          </div>
          <button
            onClick={handleShowApplicants}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Show Applicants
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOfferSender;
