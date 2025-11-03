import React, { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const JobGroupingPrints = () => {
  const [jobCandidates, setJobCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printType, setPrintType] = useState("");

  useEffect(() => {
    fetchJobCandidates();
  }, []);

  const fetchJobCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/jobs/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobCandidates(response.data.candidates || []);
    } catch (error) {
      toast.error("Failed to fetch job candidates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = (candidate) => {
    if (selectedCandidates.find((c) => c._id === candidate._id)) {
      setSelectedCandidates(
        selectedCandidates.filter((c) => c._id !== candidate._id)
      );
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const handlePrint = () => {
    if (!printType) {
      toast.error("Please select a print type");
      return;
    }
    if (selectedCandidates.length === 0) {
      toast.error("Please select candidates to print");
      return;
    }
    // Implement print logic here
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Job Grouping
          </h1>
          <div className="flex gap-4">
            <select
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Print Type *</option>
              <option value="application">Application Form</option>
              <option value="contract">Contract Letter</option>
              <option value="visa">Visa Form</option>
            </select>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        {/* Job Candidates Listing */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Job Candidates Listing</h2>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {jobCandidates.length} records
            </p>
            <input
              type="text"
              placeholder="Search:"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    <input type="checkbox" />
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Title
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Salary
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Company Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Contact Person
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Candidate Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Mobile
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Application Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobCandidates.length > 0 ? (
                  jobCandidates.map((candidate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.some(
                            (c) => c._id === candidate._id
                          )}
                          onChange={() => handleSelectCandidate(candidate)}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.jobTitle || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.salary || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.companyName || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.contactPerson || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.candidateName || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.mobile || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.applicationDate || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.status || ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing 1 to {jobCandidates.length} of {jobCandidates.length}{" "}
            entries
          </div>
        </div>

        {/* Selected Candidates Listing */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Selected Candidates Listing
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Job Title
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Salary
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Company Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Contact Person
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Candidate Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Mobile
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Application Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCandidates.length > 0 ? (
                  selectedCandidates.map((candidate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.jobTitle || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.salary || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.companyName || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.contactPerson || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.candidateName || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.mobile || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.applicationDate || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {candidate.status || ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No selected candidates.
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

export default JobGroupingPrints;
