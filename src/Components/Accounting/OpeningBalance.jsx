import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const OpeningBalance = () => {
  const [balances, setBalances] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBalance, setEditingBalance] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    account: "",
    date: "",
    debit: "",
    credit: "",
    description: "",
  });
  const [editData, setEditData] = useState({
    debit: "",
    credit: "",
  });

  useEffect(() => {
    loadBalances();
    loadAccounts();
  }, []);

  const loadBalances = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/accounting/opening-balances/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances(res.data.openingBalances || []);
    } catch (err) {
      console.error("Load balances error", err);
      toast.error("Failed to load opening balances");
    }
  };

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/accounting/accounts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Load accounts error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingBalance) {
        await axios.put(
          `/api/accounting/opening-balances/${editingBalance._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Opening balance updated successfully");
      } else {
        await axios.post("/api/accounting/opening-balances/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Opening balance created successfully");
      }
      setShowForm(false);
      setEditingBalance(null);
      setFormData({
        account: "",
        date: "",
        debit: "",
        credit: "",
        description: "",
      });
      loadBalances();
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Failed to save opening balance");
    }
  };

  const handleEdit = (balance) => {
    setEditingBalance(balance);
    setFormData({
      account: balance.account._id,
      date: balance.date ? balance.date.split("T")[0] : "",
      debit: balance.debit,
      credit: balance.credit,
      description: balance.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this opening balance?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/accounting/opening-balances/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Opening balance deleted successfully");
      loadBalances();
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete opening balance");
    }
  };

  const handleInlineEdit = (balance) => {
    setEditingRow(balance._id);
    setEditData({
      debit: balance.debit,
      credit: balance.credit,
    });
  };

  const handleInlineSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/accounting/opening-balances/${id}`,
        {
          debit: Number(editData.debit) || 0,
          credit: Number(editData.credit) || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Opening balance updated successfully");
      setEditingRow(null);
      loadBalances();
    } catch (err) {
      console.error("Inline save error", err);
      toast.error("Failed to update opening balance");
    }
  };

  const handleInlineCancel = () => {
    setEditingRow(null);
    setEditData({ debit: "", credit: "" });
  };

  const filteredBalances = balances.filter(
    (balance) =>
      balance.account.accountName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      balance.account.accountCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Opening Balance</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add Opening Balance
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingBalance
                  ? "Edit Opening Balance"
                  : "Add Opening Balance"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account *
                  </label>
                  <select
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountCode} - {account.accountName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Debit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.debit}
                    onChange={(e) =>
                      setFormData({ ...formData, debit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.credit}
                    onChange={(e) =>
                      setFormData({ ...formData, credit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingBalance ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBalance(null);
                      setFormData({
                        account: "",
                        date: "",
                        debit: "",
                        credit: "",
                        description: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Balances Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Account
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Debit
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Credit
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBalances.length > 0 ? (
                filteredBalances.map((balance) => (
                  <tr key={balance._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {balance.account.accountCode} -{" "}
                      {balance.account.accountName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(balance.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {editingRow === balance._id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editData.debit}
                          onChange={(e) =>
                            setEditData({ ...editData, debit: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        balance.debit.toFixed(2)
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {editingRow === balance._id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editData.credit}
                          onChange={(e) =>
                            setEditData({ ...editData, credit: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        balance.credit.toFixed(2)
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {balance.description || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2">
                        {editingRow === balance._id ? (
                          <>
                            <button
                              onClick={() => handleInlineSave(balance._id)}
                              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleInlineCancel}
                              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleInlineEdit(balance)}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleEdit(balance)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(balance._id)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                  >
                    No opening balances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OpeningBalance;
