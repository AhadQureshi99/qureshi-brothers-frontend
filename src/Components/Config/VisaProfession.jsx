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

const VisaProfession = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [professions, setProfessions] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProfession, setEditingProfession] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadProfessions();
  }, []);

  const loadProfessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/visa-professions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessions(response.data.professions || []);
    } catch (error) {
      console.error("Error loading visa professions:", error);
      toast.error("Failed to load visa professions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingProfession) {
        await axios.put(
          `/api/config/visa-professions/${editingProfession._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Visa Profession updated successfully!");
      } else {
        await axios.post("/api/config/visa-professions/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Visa Profession added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
      });
      setEditingProfession(null);
      loadProfessions();
    } catch (error) {
      console.error("Error saving visa profession:", error);
      toast.error(
        error.response?.data?.message || "Failed to save visa profession"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profession) => {
    setEditingProfession(profession);
    setFormData({
      name: profession.name,
      description: profession.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this visa profession?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/visa-professions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Visa Profession deleted successfully!");
      loadProfessions();
    } catch (error) {
      console.error("Error deleting profession:", error);
      toast.error("Failed to delete visa profession");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/visa-professions/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Visa Profession ${
          currentStatus ? "deactivated" : "activated"
        } successfully!`
      );
      loadProfessions();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredProfessions = professions.filter(
    (profession) =>
      profession.name.toLowerCase().includes(search.toLowerCase()) ||
      (profession.description &&
        profession.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingProfession ? "Edit Visa Profession" : "Add Visa Profession"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
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
                    <FaPlus /> {editingProfession ? "Update" : "Add"} Profession
                  </>
                )}
              </button>
              {editingProfession && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfession(null);
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

        {/* Professions Listing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Visa Profession Listing
            </h2>
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search professions..."
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
                {filteredProfessions.length > 0 ? (
                  filteredProfessions.map((profession) => (
                    <tr key={profession._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {profession.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {profession.description || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profession.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {profession.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(profession)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                profession._id,
                                profession.isActive
                              )
                            }
                            className={`px-2 py-1 rounded hover:opacity-80 ${
                              profession.isActive
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                            title={
                              profession.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {profession.isActive ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(profession._id)}
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
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredProfessions.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProfessions.length} of {professions.length}{" "}
              entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaProfession;
