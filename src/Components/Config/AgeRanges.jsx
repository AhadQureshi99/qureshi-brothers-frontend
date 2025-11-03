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

const AgeRanges = () => {
  const [formData, setFormData] = useState({
    ageRange: "",
  });
  const [loading, setLoading] = useState(false);
  const [ageRanges, setAgeRanges] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAgeRange, setEditingAgeRange] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadAgeRanges();
  }, []);

  const loadAgeRanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/age-ranges/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgeRanges(response.data.ageRanges || []);
    } catch (error) {
      console.error("Error loading age ranges:", error);
      toast.error("Failed to load age ranges");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingAgeRange) {
        await axios.put(
          `/api/config/age-ranges/${editingAgeRange._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Age Range updated successfully!");
      } else {
        await axios.post("/api/config/age-ranges/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Age Range added successfully!");
      }

      // Reset form
      setFormData({
        ageRange: "",
      });
      setEditingAgeRange(null);
      loadAgeRanges();
    } catch (error) {
      console.error("Error saving age range:", error);
      toast.error(error.response?.data?.message || "Failed to save age range");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ageRange) => {
    setFormData({
      ageRange: ageRange.ageRange,
    });
    setEditingAgeRange(ageRange);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this age range?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/age-ranges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Age Range deleted successfully!");
      loadAgeRanges();
    } catch (error) {
      console.error("Error deleting age range:", error);
      toast.error("Failed to delete age range");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/age-ranges/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Age Range ${currentStatus ? "deactivated" : "activated"} successfully!`
      );
      loadAgeRanges();
    } catch (error) {
      console.error("Error toggling age range status:", error);
      toast.error("Failed to update age range status");
    }
  };

  const filteredAgeRanges = ageRanges.filter((ageRange) =>
    ageRange.ageRange.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Age Ranges
          </h1>

          {/* Form Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Add/Edit Detail
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range *
                </label>
                <input
                  type="text"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingAgeRange ? "Update" : "Add"}
                </button>
                {editingAgeRange && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAgeRange(null);
                      setFormData({
                        ageRange: "",
                      });
                    }}
                    className="ml-4 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Age Ranges Listing
            </h2>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredAgeRanges.length} records
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">Search:</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by age range..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Age Range
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgeRanges.length > 0 ? (
                    filteredAgeRanges.map((ageRange) => (
                      <tr key={ageRange._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {ageRange.ageRange}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(ageRange)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  ageRange._id,
                                  ageRange.isActive
                                )
                              }
                              className={`px-2 py-1 rounded hover:opacity-80 ${
                                ageRange.isActive
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                              title={
                                ageRange.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {ageRange.isActive ? (
                                <FaToggleOn />
                              ) : (
                                <FaToggleOff />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(ageRange._id)}
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
                        colSpan="2"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredAgeRanges.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredAgeRanges.length} of {ageRanges.length} entries
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeRanges;
