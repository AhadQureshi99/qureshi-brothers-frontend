import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ReadyToSubmitted = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actioningId, setActioningId] = useState(null);

  // Permission check
  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.readyToSubmitted?.view === true;
  const canEdit =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.readyToSubmitted?.edit === true;
  const canDelete =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.readyToSubmitted?.delete === true;

  useEffect(() => {
    if (canView) fetchCandidates();
  }, [canView]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api.cloudandroots.com/api/candidates",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidates(
        (response.data?.candidates || response.data || []).filter(
          (c) => c.status === "Ready to Submitted"
        )
      );
    } catch (error) {
      toast.error("Failed to fetch candidates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Move to Submitted
  const handleMoveToSubmitted = async (candidateId) => {
    if (!canEdit) {
      toast.error("You do not have permission to move candidates");
      return;
    }
    if (!window.confirm("Move this candidate to Submitted Candidates?")) return;
    try {
      setActioningId(candidateId);
      const token = localStorage.getItem("token");
      await axios.put(
        `https://api.cloudandroots.com/api/candidates/${candidateId}`,
        { status: "Submitted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Candidate moved to Submitted Candidates");
      fetchCandidates();
      navigate("/admin/candidate-management/submitted-candidates");
    } catch (error) {
      toast.error("Failed to move candidate");
      console.error(error);
    } finally {
      setActioningId(null);
    }
  };

  // Copy to Submitted
  const handleCopyToSubmitted = async (candidate) => {
    if (!canEdit) {
      toast.error("You do not have permission to copy candidates");
      return;
    }
    if (!window.confirm("Copy this candidate to Submitted Candidates?")) return;
    try {
      setActioningId(candidate._id);
      const token = localStorage.getItem("token");
      const { _id, createdAt, updatedAt, __v, ...rest } = candidate;
      const newCandidate = { ...rest, status: "Submitted" };
      await axios.post(
        "https://api.cloudandroots.com/api/candidates",
        newCandidate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Candidate copied to Submitted Candidates");
      fetchCandidates();
      navigate("/admin/candidate-management/submitted-candidates");
    } catch (error) {
      toast.error("Failed to copy candidate");
      console.error(error);
    } finally {
      setActioningId(null);
    }
  };

  // Delete candidate
  const handleDelete = async (candidateId) => {
    if (!canDelete) {
      toast.error("You do not have permission to delete candidates");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;
    try {
      setActioningId(candidateId);
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://api.cloudandroots.com/api/candidates/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Candidate deleted successfully");
      fetchCandidates();
    } catch (error) {
      toast.error("Failed to delete candidate");
      console.error(error);
    } finally {
      setActioningId(null);
    }
  };

  // Filtered candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const term = searchTerm.toLowerCase();
    const name = (candidate.name || "").toLowerCase();
    const firstName = (candidate.firstName || "").toLowerCase();
    const lastName = (candidate.lastName || "").toLowerCase();
    const email = (candidate.email || "").toLowerCase();
    const passport = (candidate.passport || "").toLowerCase();
    return (
      name.includes(term) ||
      firstName.includes(term) ||
      lastName.includes(term) ||
      email.includes(term) ||
      passport.includes(term)
    );
  });

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Ready to Submitted Candidates
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, email, or passport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading candidates...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Mobile
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Passport
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No candidates in Ready to Submitted
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((candidate, index) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.firstName || candidate.name || "N/A"}{" "}
                          {candidate.lastName || ""}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.email || "N/A"}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.mobile || candidate.contact || "N/A"}
                        </td>
                        <td className="px-4 py-2 border-b text-sm">
                          {candidate.passport || "N/A"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleMoveToSubmitted(candidate._id)
                              }
                              disabled={actioningId === candidate._id}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs disabled:opacity-50"
                            >
                              {actioningId === candidate._id
                                ? "Processing..."
                                : "Move to Submitted Candidates"}
                            </button>
                            <button
                              onClick={() => handleCopyToSubmitted(candidate)}
                              disabled={actioningId === candidate._id}
                              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs disabled:opacity-50"
                            >
                              Copy to Submitted Candidates
                            </button>
                            <button
                              onClick={() => handleDelete(candidate._id)}
                              disabled={
                                actioningId === candidate._id || !canDelete
                              }
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCandidates.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyToSubmitted;
