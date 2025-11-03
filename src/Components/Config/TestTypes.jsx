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

const TestTypes = () => {
  const [formData, setFormData] = useState({
    testType: "",
  });
  const [loading, setLoading] = useState(false);
  const [testTypes, setTestTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTestType, setEditingTestType] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    loadTestTypes();
  }, []);

  const loadTestTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/test-types/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestTypes(response.data.testTypes || []);
    } catch (error) {
      console.error("Error loading test types:", error);
      toast.error("Failed to load test types");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingTestType) {
        await axios.put(
          `/api/config/test-types/${editingTestType._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Test Type updated successfully!");
      } else {
        await axios.post("/api/config/test-types/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Test Type added successfully!");
      }

      // Reset form
      setFormData({
        testType: "",
      });
      setEditingTestType(null);
      loadTestTypes();
    } catch (error) {
      console.error("Error saving test type:", error);
      toast.error(error.response?.data?.message || "Failed to save test type");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testType) => {
    setFormData({
      testType: testType.testType,
    });
    setEditingTestType(testType);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test type?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/test-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Test Type deleted successfully!");
      loadTestTypes();
    } catch (error) {
      console.error("Error deleting test type:", error);
      toast.error("Failed to delete test type");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/test-types/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `Test Type ${currentStatus ? "deactivated" : "activated"} successfully!`
      );
      loadTestTypes();
    } catch (error) {
      console.error("Error toggling test type status:", error);
      toast.error("Failed to update test type status");
    }
  };

  const filteredTestTypes = testTypes.filter((testType) =>
    testType.testType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Test Types
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
                  Test Type *
                </label>
                <input
                  type="text"
                  name="testType"
                  value={formData.testType}
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
                  {loading ? "Saving..." : editingTestType ? "Update" : "Add"}
                </button>
                {editingTestType && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTestType(null);
                      setFormData({
                        testType: "",
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
              Test Types Listing
            </h2>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredTestTypes.length} records
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">Search:</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by test type..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Test Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestTypes.length > 0 ? (
                    filteredTestTypes.map((testType) => (
                      <tr key={testType._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {testType.testType}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(testType)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  testType._id,
                                  testType.isActive
                                )
                              }
                              className={`px-2 py-1 rounded hover:opacity-80 ${
                                testType.isActive
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                              title={
                                testType.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              {testType.isActive ? (
                                <FaToggleOn />
                              ) : (
                                <FaToggleOff />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(testType._id)}
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

            {filteredTestTypes.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredTestTypes.length} of {testTypes.length} entries
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTypes;
