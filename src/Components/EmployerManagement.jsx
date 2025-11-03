import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const EmployerManagement = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    username: "",
    companyName: "",
    city: "",
    state: "",
    country: "",
    password: "",
    ownership: "",
    sector: "",
    salesTurnover: "",
    numberOfEmployees: "",
    numberOfOffices: "",
    companyInfo: "",
    companyAddress: "",
    zip: "",
    street: "",
    fax: "",
    website: "",
    plan: "",
    phone: "",
    type: "",
    email: "",
    contactPersonName: "",
    contactPersonPhone: "",
    files: [],
  });

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/employers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployers(response.data.employers);
    } catch (error) {
      toast.error("Failed to fetch employers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "files") {
          formData.files.forEach((file) =>
            formDataToSend.append("files", file)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingEmployer) {
        await axios.put(
          `/api/employers/${editingEmployer._id}`,
          formDataToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Employer updated successfully");
      } else {
        await axios.post("/api/employers/", formDataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employer created successfully");
      }

      setShowForm(false);
      setEditingEmployer(null);
      resetForm();
      fetchEmployers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save employer");
      console.error(error);
    }
  };

  const handleEdit = (employer) => {
    setEditingEmployer(employer);
    setFormData({
      code: employer.code,
      username: employer.username,
      companyName: employer.companyName,
      city: employer.city,
      state: employer.state,
      country: employer.country,
      password: "",
      ownership: employer.ownership || "",
      sector: employer.sector || "",
      salesTurnover: employer.salesTurnover || "",
      numberOfEmployees: employer.numberOfEmployees || "",
      numberOfOffices: employer.numberOfOffices || "",
      companyInfo: employer.companyInfo || "",
      companyAddress: employer.companyAddress || "",
      zip: employer.zip || "",
      street: employer.street || "",
      fax: employer.fax || "",
      website: employer.website || "",
      plan: employer.plan || "",
      phone: employer.phone || "",
      type: employer.type || "",
      email: employer.email,
      contactPersonName: employer.contactPersonName || "",
      contactPersonPhone: employer.contactPersonPhone || "",
      files: [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employer?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/employers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employer deleted successfully");
      fetchEmployers();
    } catch (error) {
      toast.error("Failed to delete employer");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      username: "",
      companyName: "",
      city: "",
      state: "",
      country: "",
      password: "",
      ownership: "",
      sector: "",
      salesTurnover: "",
      numberOfEmployees: "",
      numberOfOffices: "",
      companyInfo: "",
      companyAddress: "",
      zip: "",
      street: "",
      fax: "",
      website: "",
      plan: "",
      phone: "",
      type: "",
      email: "",
      contactPersonName: "",
      contactPersonPhone: "",
      files: [],
    });
  };

  const handleNew = () => {
    setEditingEmployer(null);
    resetForm();
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Manage Employers</h1>

      {!showForm ? (
        <>
          <div className="mb-4">
            <button
              onClick={handleNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Code</th>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Company Name</th>
                  <th className="px-4 py-2 border">City</th>
                  <th className="px-4 py-2 border">State</th>
                  <th className="px-4 py-2 border">Country</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employers.map((employer) => (
                  <tr key={employer._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{employer.code}</td>
                    <td className="px-4 py-2 border">{employer.username}</td>
                    <td className="px-4 py-2 border">{employer.companyName}</td>
                    <td className="px-4 py-2 border">{employer.city}</td>
                    <td className="px-4 py-2 border">{employer.state}</td>
                    <td className="px-4 py-2 border">{employer.country}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(employer)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employer._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {editingEmployer ? "Edit Employer" : "Add/Edit Detail"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required={!editingEmployer}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ownership</label>
                <input
                  type="text"
                  name="ownership"
                  value={formData.ownership}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Sector / Industry
                </label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Sales Turnover
                </label>
                <input
                  type="text"
                  name="salesTurnover"
                  value={formData.salesTurnover}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Number Of Employees
                </label>
                <input
                  type="text"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Number Of Offices
                </label>
                <input
                  type="text"
                  name="numberOfOffices"
                  value={formData.numberOfOffices}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Company Info
                </label>
                <textarea
                  name="companyInfo"
                  value={formData.companyInfo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Company Address
                </label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Zip</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Street *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fax</label>
                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Website URL</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Plan</label>
                <input
                  type="text"
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2">Contact Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Name *</label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone *</label>
                    <input
                      type="text"
                      name="contactPersonPhone"
                      value={formData.contactPersonPhone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Files</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingEmployer ? "Save" : "Save"}
              </button>
              {!editingEmployer && (
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save & Close
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployerManagement;
