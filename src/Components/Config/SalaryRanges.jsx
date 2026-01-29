import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineSearch } from "react-icons/md";

const SalaryRanges = () => {
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [filteredSalaryRanges, setFilteredSalaryRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSalaryRange, setEditingSalaryRange] = useState(null);
  const [formData, setFormData] = useState({
    salaryRange: "",
  });
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchSalaryRanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalaryRanges(response.data.salaryRanges);
      setFilteredSalaryRanges(response.data.salaryRanges);
    } catch (error) {
      toast.error("Failed to fetch salary ranges");
    }
  };

  useEffect(() => {
    fetchSalaryRanges();
  }, []);

  useEffect(() => {
    const filtered = salaryRanges.filter((range) =>
      range.salaryRange.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredSalaryRanges(filtered);
  }, [searchTerm, salaryRanges]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (editingSalaryRange) {
        await axios.put(`${BASE_URL}/${editingSalaryRange._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Salary Range updated successfully");
      } else {
        await axios.post(BASE_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Salary Range created successfully");
      }

      setFormData({ salaryRange: "" });
      setShowForm(false);
      setEditingSalaryRange(null);
      fetchSalaryRanges();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save salary range",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (range) => {
    setEditingSalaryRange(range);
    setFormData({ salaryRange: range.salaryRange });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this salary range?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Salary Range deleted successfully");
        fetchSalaryRanges();
      } catch (error) {
        toast.error("Failed to delete salary range");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Status updated successfully");
      fetchSalaryRanges();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({ salaryRange: "" });
    setEditingSalaryRange(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Salary Ranges
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 flex items-center gap-2"
            >
              <IoMdAdd className="text-lg" />
              Add Salary Range
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">
                {editingSalaryRange ? "Edit Salary Range" : "Add Salary Range"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryRange: e.target.value })
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
                      : editingSalaryRange
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
                placeholder="Search salary ranges..."
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
                    Salary Range
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
                {filteredSalaryRanges.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No salary ranges found
                    </td>
                  </tr>
                ) : (
                  filteredSalaryRanges.map((range) => (
                    <tr key={range._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {range.salaryRange}
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
            Showing {filteredSalaryRanges.length} of {salaryRanges.length}{" "}
            entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryRanges;
