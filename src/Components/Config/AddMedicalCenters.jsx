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

const AddMedicalCenters = () => {
  const [formData, setFormData] = useState({
    city: "",
    name: "",
    phoneNo: "",
    contactPerson: "",
    fax: "",
    email: "",
    location: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [editingMedicalCenter, setEditingMedicalCenter] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadMedicalCenters();
  }, []);

  const loadMedicalCenters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/medical-centers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicalCenters(response.data.medicalCenters || []);
    } catch (error) {
      console.error("Error loading medical centers:", error);
      toast.error("Failed to load medical centers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingMedicalCenter) {
        await axios.put(
          `/api/config/medical-centers/${editingMedicalCenter._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Medical Center updated successfully!");
      } else {
        await axios.post("/api/config/medical-centers/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Medical Center added successfully!");
      }

      // Reset form
      setFormData({
        city: "",
        name: "",
        phoneNo: "",
        contactPerson: "",
        fax: "",
        email: "",
        location: "",
        address: "",
      });
      setEditingMedicalCenter(null);
      loadMedicalCenters();
    } catch (error) {
      console.error("Error saving medical center:", error);
      toast.error(
        error.response?.data?.message || "Failed to save medical center"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicalCenter) => {
    setFormData({
      city: medicalCenter.city,
      name: medicalCenter.name,
      phoneNo: medicalCenter.phoneNo,
      contactPerson: medicalCenter.contactPerson,
      fax: medicalCenter.fax,
      email: medicalCenter.email,
      location: medicalCenter.location,
      address: medicalCenter.address,
    });
    setEditingMedicalCenter(medicalCenter);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this medical center?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/medical-centers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Medical Center deleted successfully!");
      loadMedicalCenters();
    } catch (error) {
      console.error("Error deleting medical center:", error);
      toast.error("Failed to delete medical center");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/medical-centers/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Medical Center ${
          currentStatus ? "deactivated" : "activated"
        } successfully!`
      );
      loadMedicalCenters();
    } catch (error) {
      console.error("Error toggling medical center status:", error);
      toast.error("Failed to update medical center status");
    }
  };

  const filteredMedicalCenters = medicalCenters.filter((medicalCenter) =>
    medicalCenter.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Medical Center
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
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone No *
                </label>
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fax
                </label>
                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingMedicalCenter
                    ? "Update"
                    : "Add"}
                </button>
                {editingMedicalCenter && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMedicalCenter(null);
                      setFormData({
                        city: "",
                        name: "",
                        phoneNo: "",
                        contactPerson: "",
                        fax: "",
                        email: "",
                        location: "",
                        address: "",
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
              Medical Center Listing
            </h2>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredMedicalCenters.length} records
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">Search:</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Fax
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Email
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Phone
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicalCenters.length > 0 ? (
                    filteredMedicalCenters.map((medicalCenter) => (
                      <tr key={medicalCenter._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {medicalCenter.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {medicalCenter.fax}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {medicalCenter.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {medicalCenter.phoneNo}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(medicalCenter)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  medicalCenter._id,
                                  medicalCenter.isActive
                                )
                              }
                              className={`px-2 py-1 rounded hover:opacity-80 ${
                                medicalCenter.isActive
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                              title={
                                medicalCenter.isActive
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {medicalCenter.isActive ? (
                                <FaToggleOn />
                              ) : (
                                <FaToggleOff />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(medicalCenter._id)}
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
                        colSpan="5"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredMedicalCenters.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredMedicalCenters.length} of{" "}
                {medicalCenters.length} entries
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalCenters;
