import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSave,
  FaPrint,
  FaTrash,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const ExpensesAgainstCandidate = () => {
  const [voucherNumber, setVoucherNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [accountCode, setAccountCode] = useState("");
  const [job, setJob] = useState("");
  const [candidate, setCandidate] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [entries, setEntries] = useState([
    { candidate: "", code: "", name: "", description: "", amount: "" },
  ]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadAccounts();
    loadCandidates();
    loadJobs();
    generateVoucherNumber();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [entries]);

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/accounting/accounts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Load accounts error", err);
      toast.error("Failed to load accounts");
    }
  };

  const loadCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/candidates/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Load candidates error", err);
      toast.error("Failed to load candidates");
    }
  };

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/config/job-categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.categories || []);
    } catch (err) {
      console.error("Load jobs error", err);
      toast.error("Failed to load jobs");
    }
  };

  const generateVoucherNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setVoucherNumber(`${year}${month}${day}${random}`);
  };

  const calculateTotal = () => {
    const sum = entries.reduce(
      (acc, entry) => acc + (parseFloat(entry.amount) || 0),
      0
    );
    setTotal(sum);
  };

  const handleAccountChange = (index, accountId) => {
    const selectedAccount = accounts.find((acc) => acc._id === accountId);
    if (selectedAccount) {
      const updatedEntries = [...entries];
      updatedEntries[index] = {
        ...updatedEntries[index],
        code: selectedAccount.accountCode,
        name: selectedAccount.accountName,
      };
      setEntries(updatedEntries);
    }
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    setEntries(updatedEntries);
  };

  const addNewEntry = () => {
    setEntries([
      ...entries,
      { candidate: "", code: "", name: "", description: "", amount: "" },
    ]);
  };

  const removeEntry = (index) => {
    if (entries.length > 1) {
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
    }
  };

  const handleSave = async () => {
    if (!voucherNumber || !date || !accountCode || !job || !candidate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      entries.some((entry) => !entry.candidate || !entry.code || !entry.amount)
    ) {
      toast.error("Please fill in all entry details");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Create transactions for each entry
      const transactionPromises = entries.map((entry) => {
        const selectedAccount = accounts.find(
          (acc) => acc.accountCode === entry.code
        );
        const selectedCandidate = candidates.find(
          (cand) => cand.name === entry.candidate
        );
        return axios.post(
          "/api/accounting/transactions/",
          {
            transactionType: "Expenses Against Candidate",
            date,
            reference: voucherNumber,
            description: entry.description,
            amount: parseFloat(entry.amount),
            account: selectedAccount._id,
            contraAccount: accountCode, // Main account code
            candidate: selectedCandidate?._id,
            job: job,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      });

      await Promise.all(transactionPromises);
      toast.success("Expenses against candidate saved successfully");
      handleNew();
    } catch (err) {
      console.error("Save error", err);
      toast.error("Failed to save expenses against candidate");
    }
  };

  const handleNew = () => {
    generateVoucherNumber();
    setDate(new Date().toISOString().split("T")[0]);
    setAccountCode("");
    setJob("");
    setCandidate("");
    setEntries([
      { candidate: "", code: "", name: "", description: "", amount: "" },
    ]);
    setTotal(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClientPrint = () => {
    // Client print functionality - could open a different print view
    toast.info("Client print functionality - opens client receipt");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      handleNew();
      toast.success("Voucher cleared");
    }
  };

  const handleClose = () => {
    // Navigate back or close modal - for now just show a message
    toast.info("Close functionality - navigate back to previous page");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Candidate Payments
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> New
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={handleClientPrint}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FaUser /> Client Print
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>

        {/* Voucher Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vou # *
              </label>
              <input
                type="text"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Code *
              </label>
              <select
                value={accountCode}
                onChange={(e) => setAccountCode(e.target.value)}
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
                Job *
              </label>
              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Job</option>
                {jobs.map((jobItem) => (
                  <option key={jobItem._id} value={jobItem._id}>
                    {jobItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate *
              </label>
              <select
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Candidate</option>
                {candidates.map((cand) => (
                  <option key={cand._id} value={cand.name}>
                    {cand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Candidate
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Code
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Amount
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={entry.candidate}
                      onChange={(e) =>
                        handleEntryChange(index, "candidate", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Candidate</option>
                      {candidates.map((cand) => (
                        <option key={cand._id} value={cand.name}>
                          {cand.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={entry.code}
                      onChange={(e) =>
                        handleAccountChange(index, e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Account</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.accountCode}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={entry.name}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                      placeholder="Auto-filled"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) =>
                        handleEntryChange(index, "description", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Description"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={entry.amount}
                      onChange={(e) =>
                        handleEntryChange(index, "amount", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => removeEntry(index)}
                      disabled={entries.length === 1}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-right font-semibold"
                >
                  Total
                </td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  {total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={addNewEntry}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaPlus />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesAgainstCandidate;
