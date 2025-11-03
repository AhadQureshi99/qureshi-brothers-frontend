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

const AddTestCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactPerson: "",
    phone: "",
    location: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [testCenters, setTestCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTestCenter, setEditingTestCenter] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadTestCenters();
  }, []);

  const loadTestCenters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/test-centers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestCenters(response.data.testCenters || []);
    } catch (error) {
      console.error("Error loading test centers:", error);
      toast.error("Failed to load test centers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingTestCenter) {
        await axios.put(
          `/api/config/test-centers/${editingTestCenter._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Test Center updated successfully!");
      } else {
        await axios.post("/api/config/test-centers/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Test Center added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        contactPerson: "",
        phone: "",
        location: "",
        address: "",
      });
      setEditingTestCenter(null);
      loadTestCenters();
    } catch (error) {
      console.error("Error saving test center:", error);
      toast.error(
        error.response?.data?.message || "Failed to save test center"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testCenter) => {
    setFormData({
      name: testCenter.name,
      email: testCenter.email,
      contactPerson: testCenter.contactPerson,
      phone: testCenter.phone,
      location: testCenter.location,
      address: testCenter.address,
    });
    setEditingTestCenter(testCenter);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test center?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/test-centers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Test Center deleted successfully!");
      loadTestCenters();
    } catch (error) {
      console.error("Error deleting test center:", error);
      toast.error("Failed to delete test center");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/test-centers/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Test Center ${
          currentStatus ? "deactivated" : "activated"
        } successfully!`
      );
      loadTestCenters();
    } catch (error) {
      console.error("Error toggling test center status:", error);
      toast.error("Failed to update test center status");
    }
  };

  const filteredTestCenters = testCenters.filter((testCenter) =>
    testCenter.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Test Center
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
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
                  {loading ? "Saving..." : editingTestCenter ? "Update" : "Add"}
                </button>
                {editingTestCenter && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTestCenter(null);
                      setFormData({
                        name: "",
                        email: "",
                        contactPerson: "",
                        phone: "",
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
              Test Centre Listing
            </h2>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredTestCenters.length} records
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
                      Email
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Contact Person
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Phone
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Location
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Address
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestCenters.length > 0 ? (
                    filteredTestCenters.map((testCenter) => (
                      <tr key={testCenter._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {testCenter.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {testCenter.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {testCenter.contactPerson}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {testCenter.phone}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {testCenter.location}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {testCenter.address}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(testCenter)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  testCenter._id,
                                  testCenter.isActive
                                )
                              }
                              className={`px-2 py-1 rounded hover:opacity-80 ${
                                testCenter.isActive
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                              title={
                                testCenter.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {testCenter.isActive ? (
                                <FaToggleOn />
                              ) : (
                                <FaToggleOff />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(testCenter._id)}
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
                        colSpan="7"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredTestCenters.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredTestCenters.length} of {testCenters.length}{" "}
                entries
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTestCenter;
