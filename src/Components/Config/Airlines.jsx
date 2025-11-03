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

const Airlines = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAirline, setEditingAirline] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadAirlines();
  }, []);

  const loadAirlines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/airlines/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirlines(response.data.airlines || []);
    } catch (error) {
      console.error("Error loading airlines:", error);
      toast.error("Failed to load airlines");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingAirline) {
        await axios.put(
          `/api/config/airlines/${editingAirline._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Airline updated successfully!");
      } else {
        await axios.post("/api/config/airlines/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Airline added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
      });
      setEditingAirline(null);
      loadAirlines();
    } catch (error) {
      console.error("Error saving airline:", error);
      toast.error(error.response?.data?.message || "Failed to save airline");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (airline) => {
    setEditingAirline(airline);
    setFormData({
      name: airline.name,
      description: airline.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this airline?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/airlines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Airline deleted successfully!");
      loadAirlines();
    } catch (error) {
      console.error("Error deleting airline:", error);
      toast.error("Failed to delete airline");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/airlines/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Airline ${currentStatus ? "deactivated" : "activated"} successfully!`
      );
      loadAirlines();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredAirlines = airlines.filter(
    (airline) =>
      airline.name.toLowerCase().includes(search.toLowerCase()) ||
      (airline.description &&
        airline.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingAirline ? "Edit Airline" : "Add Airline"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline Name *
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
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
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
                    <FaPlus /> {editingAirline ? "Update" : "Add"} Airline
                  </>
                )}
              </button>
              {editingAirline && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAirline(null);
                    setFormData({
                      name: "",
                      description: "",
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

        {/* Airlines Listing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Airlines</h2>
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search airlines..."
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
                    Description
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
                {filteredAirlines.length > 0 ? (
                  filteredAirlines.map((airline) => (
                    <tr key={airline._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {airline.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {airline.description || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            airline.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {airline.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(airline)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(airline._id, airline.isActive)
                            }
                            className={`px-2 py-1 rounded hover:opacity-80 ${
                              airline.isActive
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                            title={airline.isActive ? "Deactivate" : "Activate"}
                          >
                            {airline.isActive ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(airline._id)}
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
                      No airlines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredAirlines.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredAirlines.length} of {airlines.length} entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Airlines;
