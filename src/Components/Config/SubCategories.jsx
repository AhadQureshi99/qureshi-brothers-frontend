import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    mainCategory: "",
    name: "",
    description: "",
  });

  // Load sub categories and job categories
  useEffect(() => {
    loadSubCategories();
    loadJobCategories();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingSubCategory) {
        await axios.put(
          `/api/config/sub-categories/${editingSubCategory._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Sub Category updated successfully");
      } else {
        await axios.post("/api/config/sub-categories/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Sub Category created successfully");
      }
      setShowForm(false);
      setEditingSubCategory(null);
      setFormData({ mainCategory: "", name: "", description: "" });
      loadSubCategories();
    } catch (err) {
      console.error("submit error", err);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (subCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      mainCategory: subCategory.mainCategory._id,
      name: subCategory.name,
      description: subCategory.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub category?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/sub-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Sub Category deleted successfully");
      loadSubCategories();
    } catch (err) {
      console.error("delete error", err);
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/config/sub-categories/${id}/toggle`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      loadSubCategories();
    } catch (err) {
      console.error("toggle error", err);
      toast.error("Status update failed");
    }
  };

  const filteredSubCategories = subCategories.filter(
    (sc) =>
      sc.name.toLowerCase().includes(search.toLowerCase()) ||
      sc.mainCategory.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Manage Sub Categories</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add/Edit Detail</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingSubCategory(null);
                setFormData({ mainCategory: "", name: "", description: "" });
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
                  onChange={(e) =>
                    setFormData({ ...formData, mainCategory: e.target.value })
                  }
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
                  Sub Category Name *
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
                {editingSubCategory ? "Update" : "Create"}
              </button>
            </form>
          )}

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">
              Sub Categories Listing
            </h2>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {filteredSubCategories.length} records
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
                  {filteredSubCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    filteredSubCategories.map((sc) => (
                      <tr key={sc._id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {sc.mainCategory.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {sc.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {sc.description || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => toggleStatus(sc._id, sc.isActive)}
                            className={`px-2 py-1 rounded text-xs ${
                              sc.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sc.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleEdit(sc)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2 hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sc._id)}
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
              Showing {filteredSubCategories.length} to{" "}
              {filteredSubCategories.length} of {filteredSubCategories.length}{" "}
              entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategories;
