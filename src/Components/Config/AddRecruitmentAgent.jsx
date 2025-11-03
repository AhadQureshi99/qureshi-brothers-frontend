import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddRecruitmentAgent = () => {
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
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAgent, setEditingAgent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/config/recruitment-agents/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error("Error loading agents:", error);
      toast.error("Failed to load recruitment agents");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Add files
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      if (editingAgent) {
        await axios.put(
          `/api/config/recruitment-agents/${editingAgent._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Recruitment Agent updated successfully!");
      } else {
        await axios.post("/api/config/recruitment-agents/", formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Recruitment Agent added successfully!");
      }

      // Reset form
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
      loadAgents();
    } catch (error) {
      console.error("Error saving recruitment agent:", error);
      toast.error(
        error.response?.data?.message || "Failed to save recruitment agent"
      );
    } finally {
      setLoading(false);
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
      primaryEmail: agent.primaryEmail || "",
      secondaryEmail: agent.secondaryEmail || "",
      primaryPhone: agent.primaryPhone || "",
      secondaryPhone: agent.secondaryPhone || "",
    });
    setFiles([]);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this recruitment agent?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/config/recruitment-agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recruitment Agent deleted successfully!");
      loadAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Failed to delete recruitment agent");
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.code.toLowerCase().includes(search.toLowerCase()) ||
      agent.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingAgent ? "Edit Recruitment Agent" : "Add Recruitment Agent"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Code *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name *
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    <FaPlus /> {editingAgent ? "Update" : "Add"} Recruitment
                    Agent
                  </>
                )}
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
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Agents Listing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Recruitment Agents
            </h2>
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
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
                        {agent.primaryEmail || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.secondaryEmail || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.primaryPhone || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {agent.secondaryPhone || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(agent._id)}
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
                      colSpan="9"
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      No recruitment agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredAgents.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredAgents.length} of {agents.length} entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRecruitmentAgent;
