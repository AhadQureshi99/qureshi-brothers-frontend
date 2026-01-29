import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { FaArrowUp, FaPlus } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const bg1 = "/dashboard_bg1.jpeg";
const bg2 = "/dashboard_bg2.jpeg";
const visa = "/dashboard_visa.png";
const protector = "/dashboard_protector.png";
const active = "/dashboard_Active.png";
const navtac = "/dashboard_NAVTTC.png";
const profile = "/dashboard_profile.jpeg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [summary, setSummary] = useState({
    totalCandidates: 0,
    monthlyExpense: 0,
    completedVisas: 0,
    pendingProtector: 0,
    activeCases: 0,
    navttcTests: 0,
    monthlyExpenseBreakdown: {},
    candidateSteps: {
      "CV Collection": 0,
      "Medical Process": 0,
      "NAVTTC Tests": 0,
      "E-Number Issued": 0,
      "Embassy Submission": 0,
      "Visa Approved": 0,
      "Protector Completed": 0,
    },
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [selectedActivityFilter, setSelectedActivityFilter] = useState("All");
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    const API_URL = `${BASE_URL}/api`;
    const fetchSummary = async () => {
      setLoadingSummary(true);
      setSummaryError(null);
      try {
        const token = localStorage.getItem("token");
        // Candidates
        const candidatesRes = await axios.get(`${API_URL}/candidates`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        const candidates = candidatesRes.data;
        // Expenses
        const expensesRes = await axios.get(`${API_URL}/expenses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        const expenses = expensesRes.data.expenses || [];
        // Jobs
        const jobsRes = await axios.get(`${API_URL}/jobs`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        const jobs = jobsRes.data.jobs || [];

        // Calculate summary values
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        // Monthly expense (sum for current month)
        let monthlyExpense = 0;
        let monthlyExpenseBreakdown = {};
        expenses.forEach((exp) => {
          const expDate = new Date(exp.date);
          if (
            expDate.getMonth() === thisMonth &&
            expDate.getFullYear() === thisYear
          ) {
            monthlyExpense += exp.amount;
            monthlyExpenseBreakdown[exp.type] =
              (monthlyExpenseBreakdown[exp.type] || 0) + exp.amount;
          }
        });

        // Completed Visas: candidates with status 'Visa Approved' or similar
        const completedVisas = candidates.filter(
          (c) =>
            c.status &&
            ["Visa Approved", "Visa Completed", "Protector Completed"].includes(
              c.status,
            ),
        ).length;
        // Pending Protector: candidates with status 'Pending Protector'
        const pendingProtector = candidates.filter(
          (c) =>
            c.status &&
            c.status.toLowerCase().includes("protector") &&
            !c.status.toLowerCase().includes("completed"),
        ).length;
        // Active Cases: jobs with status 'Open' or candidates with status 'Active'
        const activeCases = jobs.filter((j) => j.jobStatus === "Open").length;
        // NAVTTC Tests: candidates with a document or status indicating NAVTTC
        const navttcTests = candidates.filter(
          (c) =>
            (c.documents &&
              c.documents.some(
                (d) => d.title && d.title.toLowerCase().includes("navttc"),
              )) ||
            (c.status && c.status.toLowerCase().includes("navttc")),
        ).length;

        // Progress steps: count by status
        const stepStatusMap = {
          "CV Collection": ["CV Collection", "Initial Registration"],
          "Medical Process": ["Medical Process"],
          "NAVTTC Tests": ["NAVTTC Test", "NAVTTC Tests"],
          "E-Number Issued": [
            "E-Number Issued",
            "E Number Issued",
            "ENumber Issued",
          ],
          "Embassy Submission": ["Embassy Submission"],
          "Visa Approved": ["Visa Approved"],
          "Protector Completed": ["Protector Completed"],
        };
        const candidateSteps = {};
        Object.entries(stepStatusMap).forEach(([step, statuses]) => {
          candidateSteps[step] = candidates.filter(
            (c) =>
              c.status &&
              statuses.some((s) => c.status.toLowerCase() === s.toLowerCase()),
          ).length;
        });
        setSummary({
          totalCandidates: candidates.length,
          monthlyExpense,
          completedVisas,
          pendingProtector,
          activeCases,
          navttcTests,
          monthlyExpenseBreakdown,
          candidateSteps,
        });
      } catch (err) {
        setSummaryError("Failed to load dashboard summary");
      } finally {
        setLoadingSummary(false);
      }
    };
    const fetchLogs = async () => {
      setLoadingLogs(true);
      setLogsError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/activity-logs/recent?limit=50`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          },
        );
        setActivityLogs(res.data);
      } catch (err) {
        setLogsError("Failed to load activity logs");
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchSummary();
    fetchLogs();
  }, []);

  const handleFileChange = async (e, label) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`${label} file selected:`, file.name);

      if (label === "UPLOAD CV") {
        try {
          const formData = new FormData();
          formData.append("documents", file);

          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${BASE_URL}/api/candidates`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            },
          );
          console.log("CV uploaded successfully:", response.data);
          alert("CV uploaded successfully!");
          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          console.error("Error uploading CV:", error);
          alert("Failed to upload CV. Please try again.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        {user?.role !== "superadmin" && (
          <div className="w-[25%] bg-white border-r border-gray-200">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">Summary</h2>

          {loadingSummary ? (
            <div className="text-gray-500">Loading summary...</div>
          ) : summaryError ? (
            <div className="text-red-500">{summaryError}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Total Candidates */}
                <div
                  className="relative h-44 text-white rounded-xl overflow-hidden shadow-md"
                  style={{
                    backgroundImage: `url(${bg1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Total Candidates
                      </h3>
                      <p className="text-3xl font-bold mt-2">
                        {summary.totalCandidates}
                      </p>
                    </div>
                    <label className="self-start mt-2 bg-white text-black text-sm font-medium px-3 py-1 rounded-full cursor-pointer flex items-center">
                      <FaPlus className="inline mr-1" />
                      UPLOAD CV
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "UPLOAD CV")}
                      />
                    </label>
                  </div>
                </div>
                {/* Monthly Expense */}
                <div
                  className="relative h-44 text-white rounded-xl overflow-hidden shadow-md"
                  style={{
                    backgroundImage: `url(${bg2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Monthly Expense</h3>
                      <p className="text-3xl font-bold mt-2">
                        PKR {summary.monthlyExpense.toLocaleString()}
                      </p>
                    </div>
                    <label className="self-start mt-2 bg-white text-black text-sm font-medium px-3 py-1 rounded-full cursor-pointer flex items-center">
                      <FaPlus className="inline mr-1" />
                      ADD EXPENSE
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "ADD EXPENSE")}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completed Visas */}
                <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700">
                      Completed Visas
                    </h3>
                    <p className="text-2xl font-bold text-black mt-1">
                      {summary.completedVisas}
                    </p>
                  </div>
                  <img
                    src={visa}
                    alt="icon"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                {/* Pending Protector */}
                <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700">
                      Pending Protector
                    </h3>
                    <p className="text-2xl font-bold text-black mt-1">
                      {summary.pendingProtector}
                    </p>
                  </div>
                  <img
                    src={protector}
                    alt="icon"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                {/* Active Cases */}
                <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700">
                      Active Cases
                    </h3>
                    <p className="text-2xl font-bold text-black mt-1">
                      {summary.activeCases}
                    </p>
                  </div>
                  <img
                    src={active}
                    alt="icon"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                {/* NAVTTC Tests */}
                <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700">
                      NAVTTC Tests
                    </h3>
                    <p className="text-2xl font-bold text-black mt-1">
                      {summary.navttcTests}
                    </p>
                  </div>
                  <img
                    src={navtac}
                    alt="icon"
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>
            </>
          )}

          <div className="bg-white shadow-lg rounded-xl p-6 mt-10">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              Total Candidates
            </h3>
            {Object.entries(summary.candidateSteps).map(
              ([step, count], idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{step}</span>
                    <span className="text-sm text-gray-700">
                      {count}/{summary.totalCandidates}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          summary.totalCandidates
                            ? (count / summary.totalCandidates) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Expenses and Recent Activity in Flex Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Monthly Expenses */}
            <div className="bg-green-100 p-6 rounded-xl shadow-md">
              <h3 className="text-md font-semibold text-green-800 mb-4">
                Monthly Expenses
              </h3>
              <p className="text-3xl font-bold text-black mb-6">
                PKR {summary.monthlyExpense.toLocaleString()}{" "}
                <span className="text-yellow-500">🟡</span>
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(summary.monthlyExpenseBreakdown).length ===
                0 ? (
                  <div className="col-span-2 text-gray-400">
                    No breakdown available
                  </div>
                ) : (
                  Object.entries(summary.monthlyExpenseBreakdown).map(
                    ([type, amount]) => (
                      <React.Fragment key={type}>
                        <div>
                          {type.charAt(0).toUpperCase() + type.slice(1)} Fees
                        </div>
                        <div className="text-right">
                          PKR {amount.toLocaleString()}
                        </div>
                      </React.Fragment>
                    ),
                  )
                )}
              </div>
              <hr className="my-4 border-gray-300" />
              <div className="flex justify-between font-semibold text-black">
                <span>Total</span>
                <span>PKR {summary.monthlyExpense.toLocaleString()}</span>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => window.print()}
                  className="flex-1 text-green-700 font-medium py-2 rounded-lg bg-white hover:bg-green-50 transition"
                >
                  Print Report
                </button>
                <button
                  onClick={() => navigate("/expense")}
                  className="flex-1 bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
                >
                  View Full Report
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-green-100 p-4 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-green-600">
                  Recent Activity
                </h3>
                <select
                  value={selectedActivityFilter}
                  onChange={(e) => setSelectedActivityFilter(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-green-500"
                >
                  <option value="All">All Activities</option>
                  {[...new Set(activityLogs.map((log) => log.entityType))].map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {loadingLogs ? (
                <div className="text-gray-500">Loading activity...</div>
              ) : logsError ? (
                <div className="text-red-500">{logsError}</div>
              ) : (
                <div className="grid gap-1 max-h-96 overflow-y-auto pr-2">
                  {activityLogs.filter(
                    (log) =>
                      selectedActivityFilter === "All" ||
                      log.entityType === selectedActivityFilter,
                  ).length === 0 ? (
                    <div className="text-gray-500">
                      No activity found for this filter.
                    </div>
                  ) : (
                    activityLogs
                      .filter(
                        (log) =>
                          selectedActivityFilter === "All" ||
                          log.entityType === selectedActivityFilter,
                      )
                      .map((log, idx) => (
                        <div
                          key={log._id || idx}
                          className="bg-white rounded-lg px-4 py-2 shadow flex flex-col md:flex-row md:justify-between md:items-center"
                        >
                          <div>
                            <div className="font-medium text-sm text-gray-800">
                              {log.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(log.createdAt).toLocaleString("en-GB", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 md:ml-4">
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                              {log.entityType}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Latest Job Applications */}
            <div className="bg-green-100 shadow-lg rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Latest Job Applications
              </h3>
              <div className="overflow-x-auto h-96 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Sr No</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Candidate Name</th>
                      <th className="px-4 py-3">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">China Mobile Company</td>
                      <td className="px-4 py-3">Computer Science</td>
                      <td className="px-4 py-3">Ateeq Qureshi</td>
                      <td className="px-4 py-3">0.0000</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3">China Mobile Company</td>
                      <td className="px-4 py-3">Computer Science</td>
                      <td className="px-4 py-3">Ateeq Qureshi</td>
                      <td className="px-4 py-3">0.0000</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">3</td>
                      <td className="px-4 py-3">CCC UAE</td>
                      <td className="px-4 py-3">Driver Required for CCC UAE</td>
                      <td className="px-4 py-3">Junaid Ali</td>
                      <td className="px-4 py-3">0.0000</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">4</td>
                      <td className="px-4 py-3">CCC UAE</td>
                      <td className="px-4 py-3">Driver Required for CCC UAE</td>
                      <td className="px-4 py-3">Yasir Ali</td>
                      <td className="px-4 py-3">0.0000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latest Online Applications */}
            <div className="bg-green-100 shadow-lg rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Latest Online Applications
              </h3>
              <div className="overflow-x-auto max-h-96 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Sr No</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Candidate Name</th>
                      <th className="px-4 py-3">Candidate Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">China Mobile Company</td>
                      <td className="px-4 py-3">Computer Science</td>
                      <td className="px-4 py-3">Ateeq Qureshi</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3">CCC UAE</td>
                      <td className="px-4 py-3">Driver Required for CCC UAE</td>
                      <td className="px-4 py-3">Junaid Ali</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">3</td>
                      <td className="px-4 py-3">CCC UAE</td>
                      <td className="px-4 py-3">Driver Required for CCC UAE</td>
                      <td className="px-4 py-3">Yasir Ali</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latest Jobs */}
            <div className="bg-green-100 shadow-lg rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Latest Jobs
              </h3>
              <div className="overflow-x-auto h-96 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Sr No</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Salary</th>
                      <th className="px-4 py-3">Last date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">
                        ER-1001-International Recruiters
                      </td>
                      <td className="px-4 py-3">name</td>
                      <td className="px-4 py-3">5000</td>
                      <td className="px-4 py-3">12/01/2025</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3">
                        ER-1004-China Mobile Company
                      </td>
                      <td className="px-4 py-3">Computer Science</td>
                      <td className="px-4 py-3">50000</td>
                      <td className="px-4 py-3">31/12/2022</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">3</td>
                      <td className="px-4 py-3">17-CCC UAE</td>
                      <td className="px-4 py-3">Driver</td>
                      <td className="px-4 py-3">1200</td>
                      <td className="px-4 py-3">15/12/2017</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
