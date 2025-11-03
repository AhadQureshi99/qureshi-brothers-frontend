import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const TravelAgentPayment = () => {
  const [payments, setPayments] = useState([]);
  const [travelAgents, setTravelAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [nextVouNumber, setNextVouNumber] = useState("1");

  // Form state
  const [formData, setFormData] = useState({
    vouNumber: "",
    date: new Date().toISOString().split("T")[0],
    accountCode: "",
    payments: [
      {
        name: "",
        job: "",
        agent: "",
        description: "",
        amount: 0,
      },
    ],
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchTravelAgents();
    fetchNextVouNumber();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "/api/accounting/travel-agent-payments/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPayments(response.data);
    } catch (error) {
      toast.error("Failed to fetch travel agent payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchTravelAgents = async () => {
    try {
      const response = await axios.get("/api/config/travel-agents/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTravelAgents(response.data);
    } catch (error) {
      toast.error("Failed to fetch travel agents");
    }
  };

  const fetchNextVouNumber = async () => {
    try {
      const response = await axios.get(
        "/api/accounting/travel-agent-payments/next-vou-number",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNextVouNumber(response.data.nextVouNumber);
      setFormData((prev) => ({
        ...prev,
        vouNumber: response.data.nextVouNumber,
      }));
    } catch (error) {
      console.error("Failed to fetch next voucher number");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        payments: formData.payments.filter(
          (p) => p.name && p.job && p.agent && p.description && p.amount > 0
        ),
      };

      if (editingPayment) {
        await axios.put(
          `/api/accounting/travel-agent-payments/${editingPayment._id}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Travel agent payment updated successfully");
      } else {
        await axios.post("/api/accounting/travel-agent-payments/", dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Travel agent payment created successfully");
      }

      fetchPayments();
      fetchNextVouNumber();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save payment");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`/api/accounting/travel-agent-payments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Payment deleted successfully");
        fetchPayments();
      } catch (error) {
        toast.error("Failed to delete payment");
      }
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      vouNumber: payment.vouNumber,
      date: new Date(payment.date).toISOString().split("T")[0],
      accountCode: payment.accountCode,
      payments: payment.payments,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      vouNumber: nextVouNumber,
      date: new Date().toISOString().split("T")[0],
      accountCode: "",
      payments: [
        {
          name: "",
          job: "",
          agent: "",
          description: "",
          amount: 0,
        },
      ],
    });
    setEditingPayment(null);
    setShowForm(false);
  };

  const addPaymentRow = () => {
    setFormData((prev) => ({
      ...prev,
      payments: [
        ...prev.payments,
        {
          name: "",
          job: "",
          agent: "",
          description: "",
          amount: 0,
        },
      ],
    }));
  };

  const removePaymentRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== index),
    }));
  };

  const updatePaymentRow = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      payments: prev.payments.map((payment, i) =>
        i === index ? { ...payment, [field]: value } : payment
      ),
    }));
  };

  const calculateTotal = () => {
    return formData.payments.reduce(
      (sum, payment) => sum + (parseFloat(payment.amount) || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Travel Agent Payment
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <FaPlus />
            {showForm ? "Cancel" : "Add Payment"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingPayment
                ? "Edit Travel Agent Payment"
                : "Add Travel Agent Payment"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vou # *
                  </label>
                  <input
                    type="text"
                    value={formData.vouNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vouNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Code *
                  </label>
                  <input
                    type="text"
                    value={formData.accountCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountCode: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                          Job
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                          Agent
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                          Description
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.payments.map((payment, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border border-gray-300">
                            <input
                              type="text"
                              value={payment.name}
                              onChange={(e) =>
                                updatePaymentRow(index, "name", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            <input
                              type="text"
                              value={payment.job}
                              onChange={(e) =>
                                updatePaymentRow(index, "job", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            <select
                              value={payment.agent}
                              onChange={(e) =>
                                updatePaymentRow(index, "agent", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            >
                              <option value="">Select Agent</option>
                              {travelAgents.map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                  {agent.name} ({agent.code})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            <input
                              type="text"
                              value={payment.description}
                              onChange={(e) =>
                                updatePaymentRow(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            <input
                              type="number"
                              step="0.01"
                              value={payment.amount}
                              onChange={(e) =>
                                updatePaymentRow(
                                  index,
                                  "amount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {formData.payments.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePaymentRow(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    onClick={addPaymentRow}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaPlus />
                    Add Row
                  </button>

                  <div className="text-lg font-semibold">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <FaSave />
                  {editingPayment ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Travel Agent Payments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vou #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No travel agent payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.vouNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.accountCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${payment.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.createdBy?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(payment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAgentPayment;
