import React, { useState, useEffect, useMemo } from "react";
import { FaPrint, FaChevronDown, FaFilter, FaSearch } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

// chart data will be computed from server rows below (daily/weekly/monthly aggregations)

// rows are loaded from backend; only expenses added by admins/superadmins are shown

const API_URL = `${API_BASE_URL}/api/expenses`;

const Expense = () => {
  const [selectedRange, setSelectedRange] = useState("1Week");
  const [select, setSelect] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ amount: "", remarks: "" });
  const [requestRow, setRequestRow] = useState(null);
  const [requestValues, setRequestValues] = useState({
    amount: "",
    remarks: "",
  });

  // load real expenses from backend
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.expenses)
          setRows(
            res.data.expenses.map((e) => ({
              id: e._id,
              date: e.date ? e.date.split("T")[0] : "",
              expenseName: e.expenseName,
              amount: e.amount,
              remarks: e.remarks || "",
              createdBy: e.createdBy,
            })),
          );
      } catch (err) {
        console.error("load expenses error", err.response?.data || err.message);
      }
    };
    load();
  }, []);

  // Filter state for dropdown
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterExpenseName, setFilterExpenseName] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterAmountMin, setFilterAmountMin] = useState("");
  const [filterAmountMax, setFilterAmountMax] = useState("");

  const handleAdd = async () => {
    // Simple validation
    if (!date || !select || !amount) {
      toast.error("Please fill Date, Select, and Amount fields");
      return;
    }

    const numericAmount = Number(String(amount).replace(/,/g, ""));
    if (Number.isNaN(numericAmount)) {
      toast.error("Please enter a valid number for amount");
      return;
    }

    const expenseNameMap = {
      office: "Office Expense",
      bills: "Bills",
      salaries: "Salaries",
    };

    const payload = {
      date,
      type: select,
      expenseName: expenseNameMap[select] || "Other Expense",
      amount: numericAmount,
      remarks,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const created = res.data?.expense;
      if (created) {
        const row = {
          id: created._id,
          date: created.date ? created.date.split("T")[0] : date,
          expenseName: created.expenseName,
          amount: created.amount,
          remarks: created.remarks || "",
          createdBy: created.createdBy,
        };
        setRows((prev) => [row, ...prev]);
      } else {
        // fallback optimistic add if backend didn't return created object
        setRows((prev) => [
          {
            id: Date.now(),
            date,
            expenseName: payload.expenseName,
            amount: payload.amount,
            remarks: payload.remarks,
          },
          ...prev,
        ]);
      }
      // Clear inputs after success
      setSelect("");
      setAmount("");
      setDate("");
      setRemarks("");
      toast.success("Expense added");
    } catch (err) {
      console.error("create expense failed", err.response?.data || err.message);
      toast.error("Failed to create expense");
    }
  };

  // Helper to parse date string to comparable Date object or null
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Date input format is YYYY-MM-DD which Date constructor accepts safely
    return new Date(dateStr);
  };

  // Build chart data from rows depending on selectedRange
  const chartData = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    const today = new Date();

    const sumInRange = (start, end) => {
      // inclusive start, inclusive end
      const s = new Date(start);
      const e = new Date(end);
      e.setHours(23, 59, 59, 999);
      return rows.reduce((acc, r) => {
        const rd = parseDate(r.date);
        if (!rd) return acc;
        if (rd >= s && rd <= e) return acc + Number(r.amount || 0);
        return acc;
      }, 0);
    };

    const formatDayLabel = (d) => {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    };

    const formatMonthLabel = (d) => {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      });
    };

    if (selectedRange === "1Week") {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const val = sumInRange(dayStart, dayEnd);
        days.push({ label: formatDayLabel(d), value: val });
      }
      return days;
    }

    if (selectedRange === "1Month") {
      // last 30 days
      const days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const val = sumInRange(dayStart, dayEnd);
        days.push({ label: formatDayLabel(d), value: val });
      }
      return days;
    }

    if (selectedRange === "5Weeks") {
      // last 5 weeks (7-day buckets)
      const weeks = [];
      for (let w = 4; w >= 0; w--) {
        const end = new Date(today);
        end.setDate(today.getDate() - w * 7);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        const val = sumInRange(start, end);
        weeks.push({
          label: `${formatDayLabel(start)} - ${formatDayLabel(end)}`,
          value: val,
        });
      }
      return weeks;
    }

    if (selectedRange === "1Year") {
      // last 12 months, monthly buckets
      const months = [];
      for (let m = 11; m >= 0; m--) {
        const d = new Date(today.getFullYear(), today.getMonth() - m, 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0); // last day of month
        const val = sumInRange(start, end);
        months.push({ label: formatMonthLabel(d), value: val });
      }
      return months;
    }

    // MAX: group by month across all data (sorted chronologically)
    const map = new Map();
    rows.forEach((r) => {
      if (!r.date) return;
      const d = parseDate(r.date);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      map.set(key, (map.get(key) || 0) + Number(r.amount || 0));
    });
    const entries = Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    return entries.map(([k, v]) => {
      const [y, mo] = k.split("-");
      const dt = new Date(Number(y), Number(mo) - 1, 1);
      return { label: formatMonthLabel(dt), value: v };
    });
  }, [rows, selectedRange]);

  // Filtering logic including search and filter dropdown
  const filteredRows = rows.filter((row) => {
    // Search filter (case insensitive)
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      row.expenseName.toLowerCase().includes(searchTerm) ||
      row.remarks.toLowerCase().includes(searchTerm) ||
      row.amount.toString().toLowerCase().includes(searchTerm) ||
      row.date.toLowerCase().includes(searchTerm);

    if (!matchesSearch) return false;

    // Expense Name filter
    if (filterExpenseName !== "all") {
      const map = {
        office: "Office Expense",
        bills: "Bills",
        salaries: "Salaries",
      };
      const expNameFilter = map[filterExpenseName] || null;
      if (expNameFilter && row.expenseName !== expNameFilter) return false;
    }

    // Date range filter
    const rowDate = parseDate(row.date);
    const fromDate = parseDate(filterDateFrom);
    const toDate = parseDate(filterDateTo);

    if (fromDate && rowDate < fromDate) return false;
    if (toDate && rowDate > toDate) return false;

    // Amount filter
    const amountNum = Number(row.amount.toString().replace(/,/g, ""));
    const minAmount = filterAmountMin ? Number(filterAmountMin) : null;
    const maxAmount = filterAmountMax ? Number(filterAmountMax) : null;

    if (minAmount !== null && amountNum < minAmount) return false;
    if (maxAmount !== null && amountNum > maxAmount) return false;

    return true;
  });

  // Reset filter inputs
  const resetFilters = () => {
    setFilterExpenseName("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterAmountMin("");
    setFilterAmountMax("");
  };

  const [filtersApplied, setFiltersApplied] = useState(false);

  const applyFilters = () => {
    setFiltersApplied(true);
    setFilterVisible(false);
    toast.success("Filters applied");
  };

  const handlePrint = () => {
    try {
      const printableRows = filteredRows;
      const html = `
        <html>
          <head>
            <title>Expenses Report</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background: #f3f3f3; }
            </style>
          </head>
          <body>
            <h2>Expenses Report</h2>
            <p>Total: ${Number(
              rows.reduce((s, r) => s + Number(r.amount || 0), 0),
            ).toLocaleString()}</p>
            <table>
              <thead><tr><th>Date</th><th>Expense Name</th><th>Amount</th><th>Remarks</th></tr></thead>
              <tbody>
                ${printableRows
                  .map(
                    (r) =>
                      `<tr><td>${r.date}</td><td>${
                        r.expenseName
                      }</td><td>${Number(r.amount).toLocaleString()}</td><td>${
                        r.remarks || ""
                      }</td></tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;
      const newWin = window.open("", "_blank");
      newWin.document.write(html);
      newWin.document.close();
      newWin.focus();
      newWin.print();
      newWin.close();
    } catch (err) {
      console.error("print failed", err);
      toast.error("Print failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-[20%] bg-white">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="min-h-screen bg-gray-100 p-6">
          {/* Top buttons + Print */}
          <div className="flex items-center justify-between mb-6">
            {/* Blue Filter Buttons */}
            <div className="flex-1 flex justify-center gap-3">
              {[
                { key: "1Week", label: "1 Week" },
                { key: "1Month", label: "1 Month" },
                { key: "1Year", label: "1 Year" },
                { key: "5Weeks", label: "5 Weeks" },
                { key: "MAX", label: "MAX" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setSelectedRange(btn.key)}
                  className={`px-3 py-1 rounded-md text-sm border transition-colors duration-200 ${
                    selectedRange === btn.key
                      ? "bg-blue-600 border-blue-700 text-white"
                      : "bg-blue-200 border-blue-400 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Green Print Button */}
            <div className="ml-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200">
                <FaPrint className="text-white" />
                <span className="text-sm font-medium">Print</span>
              </button>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-orange-100 rounded-xl p-4 mb-5 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="text-2xl font-semibold text-gray-800">
                  {Number(
                    rows.reduce((s, r) => s + Number(r.amount || 0), 0),
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-gray-800 ml-2">Total Expense</div>
              </div>
            </div>

            <div className="w-full h-72 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barCategoryGap="20%"
                  barGap={0}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${value / 1000}k`;
                      return value;
                    }}
                  />
                  <Tooltip
                    formatter={(value) => new Intl.NumberFormat().format(value)}
                  />
                  <Bar dataKey="value" radius={0} fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Input card (light green) */}
          <div className="bg-green-100 rounded-lg p-4 mb-4 shadow-sm border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              {/* Select */}
              <div className="md:col-span-1">
                <label className="text-sm block mb-1">Select</label>
                <select
                  value={select}
                  onChange={(e) => setSelect(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded border border-gray-200"
                >
                  <option value="">Select</option>
                  <option value="office">Office Expense</option>
                  <option value="bills">Bills</option>
                  <option value="salaries">Salaries</option>
                </select>
              </div>

              {/* Amount */}
              <div className="md:col-span-1">
                <label className="text-sm block mb-1">Amount</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded border border-gray-200"
                  placeholder="25,000"
                />
              </div>

              {/* Date */}
              <div className="md:col-span-1">
                <label className="text-sm block mb-1">Date</label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="w-full bg-white px-3 py-2 rounded border border-gray-200"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-3">
                <label className="text-sm block mb-1">Remarks</label>
                <input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded border border-gray-200"
                  placeholder="Lorem ipsum dolor sit amet consectetur. Ante egestas."
                />
              </div>

              {/* Add button full width center */}
              <div className="md:col-span-6 flex justify-center mt-2">
                <button
                  onClick={handleAdd}
                  className="bg-green-600 text-white py-2 px-28 rounded-md font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Search + Filter Row */}
          <div className="flex items-center gap-3 mb-3 relative">
            <div className="flex items-center bg-green-100 rounded-md px-3 py-2 flex-1">
              <FaSearch className="text-green-700 mr-2" />
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="e.g electric bills"
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>

            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md relative z-10"
            >
              <FaFilter />
              Filter
            </button>

            <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md">
              <FaPrint />
              <span onClick={handlePrint}>Print</span>
            </button>

            {/* Filter dropdown */}
            {filterVisible && (
              <div className="absolute top-full right-0 mt-12 w-80 bg-white rounded shadow-lg border border-gray-300 z-20 p-4">
                <div className="mb-3">
                  <label className="block font-semibold mb-1">
                    Expense Name
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={filterExpenseName}
                    onChange={(e) => setFilterExpenseName(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="office">Office Expense</option>
                    <option value="bills">Bills</option>
                    <option value="salaries">Salaries</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block font-semibold mb-1">Date From</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="block font-semibold mb-1">Date To</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">
                      Min Amount
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterAmountMin}
                      onChange={(e) => setFilterAmountMin(e.target.value)}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterAmountMax}
                      onChange={(e) => setFilterAmountMax(e.target.value)}
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      resetFilters();
                      setFilterVisible(false);
                      toast("Filters reset");
                    }}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200 mb-4" />

          {/* Table container */}
          <div className="bg-white shadow-sm overflow-x-auto ">
            <table className="min-w-full table-auto border border-black">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 border-b text-right text-sm font-medium">
                    Date{" "}
                    <FaChevronDown className="inline-block ml-2 text-gray-400" />
                  </th>
                  <th className="px-4 py-3 border-b text-right text-sm font-medium">
                    Expense Name{" "}
                    <FaChevronDown className="inline-block ml-2 text-gray-400" />
                  </th>
                  <th className="px-4 py-3 border-b text-right text-sm font-medium">
                    Amount{" "}
                    <FaChevronDown className="inline-block ml-2 text-gray-400" />
                  </th>
                  <th className="px-4 py-3 border-b text-left text-sm font-medium">
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-right text-sm">
                      {r.date}
                    </td>
                    <td className="px-4 py-3 border-b text-right text-sm">
                      {r.expenseName}
                    </td>
                    <td className="px-4 py-3 border-b text-right text-sm">
                      {Number(r.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b text-sm flex items-center justify-between">
                      <span>{r.remarks}</span>
                      <div className="flex items-center gap-2">
                        {editingRow === r.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editValues.amount}
                              onChange={(e) =>
                                setEditValues((v) => ({
                                  ...v,
                                  amount: e.target.value,
                                }))
                              }
                              className="w-24 px-2 py-1 border rounded"
                              placeholder="Amount"
                            />
                            <input
                              value={editValues.remarks}
                              onChange={(e) =>
                                setEditValues((v) => ({
                                  ...v,
                                  remarks: e.target.value,
                                }))
                              }
                              className="w-48 px-2 py-1 border rounded"
                              placeholder="Remarks"
                            />
                            <button
                              onClick={async () => {
                                const numericAmount = Number(
                                  String(editValues.amount).replace(/,/g, ""),
                                );
                                if (Number.isNaN(numericAmount)) {
                                  toast.error("Invalid amount");
                                  return;
                                }
                                try {
                                  const token = localStorage.getItem("token");
                                  await axios.put(
                                    `${API_URL}/${r.id}`,
                                    {
                                      amount: numericAmount,
                                      remarks: editValues.remarks,
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  setRows(
                                    rows.map((rr) =>
                                      rr.id === r.id
                                        ? {
                                            ...rr,
                                            amount: numericAmount,
                                            remarks: editValues.remarks,
                                          }
                                        : rr,
                                    ),
                                  );
                                  setEditingRow(null);
                                  toast.success("Expense updated");
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Update failed");
                                }
                              }}
                              className="px-2 py-1 bg-blue-600 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingRow(null);
                                setEditValues({ amount: "", remarks: "" });
                              }}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : requestRow === r.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={requestValues.amount}
                              onChange={(e) =>
                                setRequestValues((v) => ({
                                  ...v,
                                  amount: e.target.value,
                                }))
                              }
                              className="w-24 px-2 py-1 border rounded"
                              placeholder="Amount"
                            />
                            <input
                              value={requestValues.remarks}
                              onChange={(e) =>
                                setRequestValues((v) => ({
                                  ...v,
                                  remarks: e.target.value,
                                }))
                              }
                              className="w-48 px-2 py-1 border rounded"
                              placeholder="Remarks"
                            />
                            <button
                              onClick={async () => {
                                const numericAmount = Number(
                                  String(requestValues.amount).replace(
                                    /,/g,
                                    "",
                                  ),
                                );
                                if (Number.isNaN(numericAmount)) {
                                  toast.error("Invalid amount");
                                  return;
                                }
                                try {
                                  const token = localStorage.getItem("token");
                                  await axios.post(
                                    `${API_URL}/${r.id}/request`,
                                    {
                                      requestType: "edit",
                                      payload: {
                                        amount: numericAmount,
                                        remarks: requestValues.remarks,
                                      },
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  setRequestRow(null);
                                  setRequestValues({ amount: "", remarks: "" });
                                  toast.success(
                                    "Edit request submitted to superadmin",
                                  );
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Request failed");
                                }
                              }}
                              className="px-2 py-1 bg-yellow-600 text-white rounded"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => {
                                setRequestRow(null);
                                setRequestValues({ amount: "", remarks: "" });
                              }}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : user?.role === "superadmin" ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingRow(r.id);
                                setEditValues({
                                  amount: r.amount,
                                  remarks: r.remarks,
                                });
                              }}
                              className="px-2 py-1 bg-blue-600 text-white rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  await axios.delete(`${API_URL}/${r.id}`, {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });
                                  setRows(rows.filter((rr) => rr.id !== r.id));
                                  toast.success("Expense deleted");
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Delete failed");
                                }
                              }}
                              className="px-2 py-1 bg-red-600 text-white rounded"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          // admin or regular users: provide request buttons for edit/delete
                          <>
                            <button
                              onClick={() => {
                                setRequestRow(r.id);
                                setRequestValues({
                                  amount: r.amount,
                                  remarks: r.remarks,
                                });
                              }}
                              className="px-2 py-1 bg-yellow-600 text-white rounded"
                            >
                              Request Edit
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  await axios.post(
                                    `${API_URL}/${r.id}/request`,
                                    { requestType: "delete" },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  toast.success(
                                    "Delete request submitted to superadmin",
                                  );
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Request failed");
                                }
                              }}
                              className="px-2 py-1 bg-yellow-600 text-white rounded"
                            >
                              Request Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
