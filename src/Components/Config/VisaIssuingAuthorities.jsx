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

const VisaIssuingAuthorities = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [authorities, setAuthorities] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAuthority, setEditingAuthority] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadAuthorities();
  }, []);

  const loadAuthorities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/config/visa-issuing-authorities/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuthorities(response.data.authorities || []);
    } catch (error) {
      console.error("Error loading visa issuing authorities:", error);
      toast.error("Failed to load visa issuing authorities");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingAuthority) {
        await axios.put(
          `/api/config/visa-issuing-authorities/${editingAuthority._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Visa Issuing Authority updated successfully!");
      } else {
        await axios.post("/api/config/visa-issuing-authorities/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Visa Issuing Authority added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
      });
      setEditingAuthority(null);
      loadAuthorities();
    } catch (error) {
      console.error("Error saving visa issuing authority:", error);
      toast.error(
        error.response?.data?.message || "Failed to save visa issuing authority"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (authority) => {
    setEditingAuthority(authority);
    setFormData({
      name: authority.name,
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this visa issuing authority?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/visa-issuing-authorities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Visa Issuing Authority deleted successfully!");
      loadAuthorities();
    } catch (error) {
      console.error("Error deleting authority:", error);
      toast.error("Failed to delete visa issuing authority");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/visa-issuing-authorities/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Visa Issuing Authority ${
          currentStatus ? "deactivated" : "activated"
        } successfully!`
      );
      loadAuthorities();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredAuthorities = authorities.filter((authority) =>
    authority.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingAuthority
              ? "Edit Visa Issuing Authority"
              : "Add Visa Issuing Authority"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visa Issuing Authority *
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
                    <FaPlus /> {editingAuthority ? "Update" : "Add"} Authority
                  </>
                )}
              </button>
              {editingAuthority && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAuthority(null);
                    setFormData({
                      name: "",
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

        {/* Authorities Listing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Visa Issuing Authorities
            </h2>
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search authorities..."
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
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAuthorities.length > 0 ? (
                  filteredAuthorities.map((authority) => (
                    <tr key={authority._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {authority.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            authority.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {authority.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(authority)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                authority._id,
                                authority.isActive
                              )
                            }
                            className={`px-2 py-1 rounded hover:opacity-80 ${
                              authority.isActive
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                            title={
                              authority.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {authority.isActive ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(authority._id)}
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
                      colSpan="3"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No visa issuing authorities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredAuthorities.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredAuthorities.length} of {authorities.length}{" "}
              entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaIssuingAuthorities;
