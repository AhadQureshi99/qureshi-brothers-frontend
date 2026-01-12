import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const FreezeApplications = () => {
  const { user } = useSelector((state) => state.user);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  // Permission checks
  const canView =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.freezeApplications?.view === true;

  const canEdit =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.freezeApplications?.edit === true;

  const canDelete =
    user?.role === "superadmin" ||
    user?.permissions?.candidateManagement?.freezeApplications?.delete === true;

  useEffect(() => {
    if (canView) {
      fetchCandidates();
    }
  }, [canView]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api.cloudandroots.com/api/candidates",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const allCandidates = response.data?.candidates || response.data || [];
      // Filter candidates by status
      const filteredCandidates = allCandidates.filter(
        (c) => c.status === "Freeze Applications"
      );
      setCandidates(filteredCandidates);
    } catch (error) {
      toast.error("Failed to fetch candidates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfreeze = async (candidateId) => {
    if (!canEdit) {
      toast.error("You do not have permission to unfreeze candidates");
      return;
    }

    if (!confirm("Are you sure you want to unfreeze this application?")) return;

    try {
      setActioningId(candidateId);
      const token = localStorage.getItem("token");
      await axios.put(
        `https://api.cloudandroots.com/api/candidates/${candidateId}`,
        { status: "Shortlisting" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application unfrozen successfully");
      fetchCandidates();
    } catch (error) {
      toast.error("Failed to unfreeze application");
      console.error(error);
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (candidateId) => {
    if (!canDelete) {
      toast.error("You do not have permission to delete candidates");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this candidate? This cannot be undone."
      )
    )
      return;

    try {
      setActioningId(candidateId);
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://api.cloudandroots.com/api/candidates/${candidateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const handleCopyToInterview = async (candidate) => {
    if (!confirm("Create a copy of this candidate in Interview Schedules?"))
      return;

    try {
      const token = localStorage.getItem("token");
      // Remove fields that shouldn't be duplicated
      const { _id, createdAt, updatedAt, __v, ...rest } = candidate;
      const newCandidate = { ...rest, status: "Interview" };

      await axios.post(
        "https://api.cloudandroots.com/api/candidates",
        newCandidate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Candidate copied to Interview Schedules");
      fetchCandidates();
    } catch (error) {
      toast.error("Failed to copy candidate");
      console.error(error);
    }
  };

  // Filter only frozen candidates + search
  const filteredCandidates = candidates.filter((candidate) => {
    const term = searchTerm.toLowerCase();
    const isFrozen = candidate.status === "Freeze";

    const name = (candidate.name || "").toLowerCase();
    const firstName = (candidate.firstName || "").toLowerCase();
    const lastName = (candidate.lastName || "").toLowerCase();
    const email = (candidate.email || "").toLowerCase();
    const passport = (candidate.passport || "").toLowerCase();

    return (
      isFrozen &&
      (name.includes(term) ||
        firstName.includes(term) ||
        lastName.includes(term) ||
        email.includes(term) ||
        passport.includes(term))
    );
  });

  if (!canView) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            <strong>Access Denied:</strong> You do not have permission to view
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
        <h1 className="text-2xl font-bold mb-6">Freeze Applications</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-5">
            Frozen Candidate Applications
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, passport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Loading frozen applications...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Passport
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Profession
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Experience
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        No frozen applications found
                        {searchTerm && " matching your search"}
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((candidate, index) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {candidate.name ||
                            `${candidate.firstName || ""} ${
                              candidate.lastName || ""
                            }`.trim() ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {candidate.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {candidate.mobile || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {candidate.passport || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {candidate.profession || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {candidate.experience || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {canEdit && (
                              <button
                                onClick={() => handleUnfreeze(candidate._id)}
                                disabled={actioningId === candidate._id}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                              >
                                {actioningId === candidate._id
                                  ? "Processing..."
                                  : "Unfreeze"}
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyToInterview(candidate)}
                              className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                            >
                              Copy to Interview
                            </button>

                            {canDelete && (
                              <button
                                onClick={() => handleDelete(candidate._id)}
                                disabled={actioningId === candidate._id}
                                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                              >
                                {actioningId === candidate._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (
            <div className="mt-5 text-sm text-gray-600">
              Showing {filteredCandidates.length} frozen application
              {filteredCandidates.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreezeApplications;
