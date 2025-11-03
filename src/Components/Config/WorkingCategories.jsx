import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const WorkingCategories = () => {
  const [workingCategories, setWorkingCategories] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingWorkingCategory, setEditingWorkingCategory] = useState(null);
  const [formData, setFormData] = useState({
    mainCategory: "",
    subCategory: "",
    name: "",
    description: "",
  });

  // Load working categories, job categories, and sub categories
  useEffect(() => {
    loadWorkingCategories();
    loadJobCategories();
    loadSubCategories();
  }, []);

  const loadWorkingCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/config/working-categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkingCategories(res.data.workingCategories || []);
    } catch (err) {
      console.error("load working categories error", err);
    }
  };

  const loadJobCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/config/job-categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobCategories(res.data.categories || []);
    } catch (err) {
      console.error("load job categories error", err);
    }
  };

  const loadSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/config/sub-categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data.subCategories || []);
    } catch (err) {
      console.error("load sub categories error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingWorkingCategory) {
        await axios.put(
          `/api/config/working-categories/${editingWorkingCategory._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Working Category updated successfully");
      } else {
        await axios.post("/api/config/working-categories/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Working Category created successfully");
      }
      setShowForm(false);
      setEditingWorkingCategory(null);
      setFormData({
        mainCategory: "",
        subCategory: "",
        name: "",
        description: "",
      });
      loadWorkingCategories();
    } catch (err) {
      console.error("submit error", err);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (workingCategory) => {
    setEditingWorkingCategory(workingCategory);
    setFormData({
      mainCategory: workingCategory.mainCategory._id,
      subCategory: workingCategory.subCategory._id,
      name: workingCategory.name,
      description: workingCategory.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this working category?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/working-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Working Category deleted successfully");
      loadWorkingCategories();
    } catch (err) {
      console.error("delete error", err);
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/working-categories/${id}/toggle-status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      loadWorkingCategories();
    } catch (err) {
      console.error("toggle error", err);
      toast.error("Status update failed");
    }
  };

  const filteredWorkingCategories = workingCategories.filter(
    (wc) =>
      wc.name.toLowerCase().includes(search.toLowerCase()) ||
      wc.mainCategory.name.toLowerCase().includes(search.toLowerCase()) ||
      wc.subCategory.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter(
    (sc) => sc.mainCategory._id === formData.mainCategory
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Manage Working Categories</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add/Edit Detail</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingWorkingCategory(null);
                setFormData({
                  mainCategory: "",
                  subCategory: "",
                  name: "",
                  description: "",
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "Add New"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Category *
                </label>
                <select
                  value={formData.mainCategory}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      mainCategory: e.target.value,
                      subCategory: "",
                    });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Main Category</option>
                  {jobCategories.map((jc) => (
                    <option key={jc._id} value={jc._id}>
                      {jc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category *
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subCategory: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  disabled={!formData.mainCategory}
                >
                  <option value="">Select Sub Category</option>
                  {filteredSubCategories.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Working Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingWorkingCategory ? "Update" : "Create"}
              </button>
            </form>
          )}

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">
              Working Categories Listing
            </h2>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {filteredWorkingCategories.length} records
              </div>
              <div className="flex items-center">
                <span className="mr-2">Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Main Category
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Sub Category
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Working Category
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
                  {filteredWorkingCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    filteredWorkingCategories.map((wc) => (
                      <tr key={wc._id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {wc.mainCategory.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {wc.subCategory.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {wc.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {wc.description || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => toggleStatus(wc._id, wc.isActive)}
                            className={`px-2 py-1 rounded text-xs ${
                              wc.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {wc.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleEdit(wc)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2 hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(wc._id)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredWorkingCategories.length} to{" "}
              {filteredWorkingCategories.length} of{" "}
              {filteredWorkingCategories.length} entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingCategories;
