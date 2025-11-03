import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const AddPaymentAgent = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    cnic: "",
    passportNo: "",
    primaryEmail: "",
    secondaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
  });
  const [files, setFiles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAgent, setEditingAgent] = useState(null);

  // Load agents from backend (assuming API exists)
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/config/payment-agents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgents(res.data.agents || []);
      } catch (err) {
        console.error("Load agents error", err);
      }
    };
    loadAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      files.forEach((file) => {
        data.append("files", file);
      });

      if (editingAgent) {
        await axios.put(
          `/api/config/payment-agents/${editingAgent._id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Payment Agent updated successfully");
      } else {
        await axios.post("/api/config/payment-agents", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Payment Agent added successfully");
      }

      // Reset form and reload
      setFormData({
        code: "",
        name: "",
        location: "",
        cnic: "",
        passportNo: "",
        primaryEmail: "",
        secondaryEmail: "",
        primaryPhone: "",
        secondaryPhone: "",
      });
      setFiles([]);
      setEditingAgent(null);
      // Reload agents
      const res = await axios.get("/api/config/payment-agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data.agents || []);
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Failed to save Payment Agent");
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      code: agent.code,
      name: agent.name,
      location: agent.location,
      cnic: agent.cnic,
      passportNo: agent.passportNo,
      primaryEmail: agent.primaryEmail,
      secondaryEmail: agent.secondaryEmail,
      primaryPhone: agent.primaryPhone,
      secondaryPhone: agent.secondaryPhone,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/payment-agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Payment Agent deleted successfully");
      setAgents(agents.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete Payment Agent");
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Payment Agents
        </h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAgent ? "Edit Detail" : "Add Detail"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
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
                Location *
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
                CNIC *
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport No *
              </label>
              <input
                type="text"
                name="passportNo"
                value={formData.passportNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Email
              </label>
              <input
                type="email"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Email
              </label>
              <input
                type="email"
                name="secondaryEmail"
                value={formData.secondaryEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Phone
              </label>
              <input
                type="tel"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Phone
              </label>
              <input
                type="tel"
                name="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                  Drag & drop files here or click to select files
                </p>
                {files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {files.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingAgent ? "Update" : "Add"} Payment Agent
              </button>
              {editingAgent && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAgent(null);
                    setFormData({
                      code: "",
                      name: "",
                      location: "",
                      cnic: "",
                      passportNo: "",
                      primaryEmail: "",
                      secondaryEmail: "",
                      primaryPhone: "",
                      secondaryPhone: "",
                    });
                    setFiles([]);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Agent Listing</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {filteredAgents.length} records
            </div>
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Code
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Location
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    CNIC
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Primary Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Secondary Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Primary Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Secondary Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.code}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.location}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.cnic}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.primaryEmail}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.secondaryEmail}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.primaryPhone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.secondaryPhone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(agent._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
                      colSpan="9"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAgents.length > 0 ? 1 : 0} to{" "}
            {filteredAgents.length} of {filteredAgents.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentAgent;
