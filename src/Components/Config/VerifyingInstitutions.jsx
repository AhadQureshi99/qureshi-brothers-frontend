import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaSearch,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const VerifyingInstitutions = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [search, setSearch] = useState("");
  const [editingInstitution, setEditingInstitution] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/verifying-institutions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstitutions(response.data.institutions || []);
    } catch (error) {
      console.error("Error loading verifying institutions:", error);
      toast.error("Failed to load verifying institutions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingInstitution) {
        await axios.put(
          `/api/config/verifying-institutions/${editingInstitution._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Verifying Institution updated successfully!");
      } else {
        await axios.post("/api/config/verifying-institutions/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Verifying Institution added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        type: "",
      });
      setEditingInstitution(null);
      loadInstitutions();
    } catch (error) {
      console.error("Error saving verifying institution:", error);
      toast.error(
        error.response?.data?.message || "Failed to save verifying institution"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (institution) => {
    setEditingInstitution(institution);
    setFormData({
      name: institution.name,
      type: institution.type,
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this verifying institution?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/verifying-institutions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Verifying Institution deleted successfully!");
      loadInstitutions();
    } catch (error) {
      console.error("Error deleting institution:", error);
      toast.error("Failed to delete verifying institution");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/verifying-institutions/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Verifying Institution ${
          currentStatus ? "deactivated" : "activated"
        } successfully!`
      );
      loadInstitutions();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(search.toLowerCase()) ||
      institution.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingInstitution
              ? "Edit Verifying Institution"
              : "Add Verifying Institution"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Degree">Degree</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaPlus /> {editingInstitution ? "Update" : "Add"}{" "}
                    Institution
                  </>
                )}
              </button>
              {editingInstitution && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingInstitution(null);
                    setFormData({
                      name: "",
                      type: "",
                    });
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Institutions Listing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Verifying Institutions
            </h2>
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search institutions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((institution) => (
                    <tr key={institution._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {institution.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {institution.type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            institution.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {institution.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(institution)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                institution._id,
                                institution.isActive
                              )
                            }
                            className={`px-2 py-1 rounded hover:opacity-80 ${
                              institution.isActive
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                            title={
                              institution.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {institution.isActive ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(institution._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No verifying institutions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredInstitutions.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredInstitutions.length} of {institutions.length}{" "}
              entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyingInstitutions;
