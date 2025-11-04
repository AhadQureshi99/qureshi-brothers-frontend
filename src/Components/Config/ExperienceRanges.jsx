import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineSearch } from "react-icons/md";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const ExperienceRanges = () => {
  const [experienceRanges, setExperienceRanges] = useState([]);
  const [filteredExperienceRanges, setFilteredExperienceRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExperienceRange, setEditingExperienceRange] = useState(null);
  const [formData, setFormData] = useState({
    experienceRange: "",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "https://api.cloudandroots.com/api/config/experience-ranges";

  const fetchExperienceRanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExperienceRanges(response.data.experienceRanges);
      setFilteredExperienceRanges(response.data.experienceRanges);
    } catch (error) {
      toast.error("Failed to fetch experience ranges");
    }
  };

  useEffect(() => {
    fetchExperienceRanges();
  }, []);

  useEffect(() => {
    const filtered = experienceRanges.filter((range) =>
      range.experienceRange.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExperienceRanges(filtered);
  }, [searchTerm, experienceRanges]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (editingExperienceRange) {
        await axios.put(`${API_URL}/${editingExperienceRange._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Experience Range updated successfully");
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Experience Range created successfully");
      }

      setFormData({ experienceRange: "" });
      setShowForm(false);
      setEditingExperienceRange(null);
      fetchExperienceRanges();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save experience range"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (range) => {
    setEditingExperienceRange(range);
    setFormData({ experienceRange: range.experienceRange });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this experience range?")
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Experience Range deleted successfully");
        fetchExperienceRanges();
      } catch (error) {
        toast.error("Failed to delete experience range");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status updated successfully");
      fetchExperienceRanges();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({ experienceRange: "" });
    setEditingExperienceRange(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Experience Ranges
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 flex items-center gap-2"
            >
              <IoMdAdd className="text-lg" />
              Add Experience Range
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">
                {editingExperienceRange
                  ? "Edit Experience Range"
                  : "Add Experience Range"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Range *
                  </label>
                  <input
                    type="text"
                    value={formData.experienceRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceRange: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingExperienceRange
                      ? "Update"
                      : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search experience ranges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExperienceRanges.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No experience ranges found
                    </td>
                  </tr>
                ) : (
                  filteredExperienceRanges.map((range) => (
                    <tr key={range._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {range.experienceRange}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            range.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {range.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {range.createdBy?.username || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(range.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(range)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(range._id)}
                            className={`${
                              range.isActive
                                ? "text-green-600"
                                : "text-gray-600"
                            } hover:text-gray-900`}
                            title={range.isActive ? "Deactivate" : "Activate"}
                          >
                            {range.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <button
                            onClick={() => handleDelete(range._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredExperienceRanges.length} of{" "}
            {experienceRanges.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceRanges;
