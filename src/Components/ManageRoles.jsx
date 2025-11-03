import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

// Centralized permissions definition
const defaultPermissions = {
  actions: {
    editTestInterview: false,
    editMedicalTest: false,
    editENumber: false,
    editSubmission: false,
    editVisaStamped: false,
    editNadra: false,
    editProtector: false,
    editFlight: false,
    editDeparted: false,
    goBack: false,
    editJobPrices: false,
  },
  configuration: {
    configuration: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addOptions: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    ageRanges: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    salaryRanges: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    experienceRanges: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    airlines: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    visaProfession: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    sectorsIndustries: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    skills: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    cities: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    educationLevel: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    careerLevel: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addPaymentAgent: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addRecruitmentAgent: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addTravelAgent: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    visaCategories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    educationCategories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    jobCategories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    subCategories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    workingCategories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    visaIssuingAuthorities: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    verifyingInstitutions: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addTestCenter: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addMedicalCenters: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    addTestTypes: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
  },
  candidateManagement: {
    candidateManagement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    initialRegistration: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateFinalRegistration: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    applyJob: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    shortlisting: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    shortlistedCandidates: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    onlineApplications: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    jobApplications: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    reportManagerCm: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateLedgerExpenses: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateLedgerSummary: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateAgentLedger: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    protectorPrintCandidates: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateFilterReport: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    traveledCandidatesReport: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateApplicationStatusReport: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    freezeApplications: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    completedApplications: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    interviewSchedule: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    bulkApplicationMaker: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    bulkOfferSender: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    bulkFlightCancel: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
  },
  accountingFinance: {
    accountingFinance: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    chartOfAccounts: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    managePayments: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    jobPayment: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    travelAgentPayment: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateReceipt: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    candidateJv: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    expensesAgainstCandidate: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    openingBalance: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    cashReceipt: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    cashPayment: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    reportManagerAf: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    chartOfAccountBalances: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    cashBook: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    bankBook: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    generalLedger: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    trialBalance: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    accountBalances: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    incomeStatement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    balanceSheet: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    cashFlowStatement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    equityReport: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    bankReceipt: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    bankPayment: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    jv: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
  },
  adminArea: {
    adminArea: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    dashboard: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    manageUsers: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    manageRole: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    reportManagerAn: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    userLogReport: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
  },
  applicationProcess: {
    applicationProcess: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    viewDetails: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
  },
  employerManagement: {
    employerManagement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    employerSetup: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    employerPlans: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    jobSetup: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    reportManagerEm: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    employerLedger: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    jobGroupingPrints: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    statusJobsReport: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    securityFeeRefundPrints: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
    travelAgentLedger: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      authorize: false,
    },
  },
};

// Sub-component for role table
const RoleTable = ({ roles, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border" aria-label="Roles table">
      <thead>
        <tr>
          <th className="py-2 px-4 border" scope="col">
            Role Name
          </th>
          <th className="py-2 px-4 border" scope="col">
            Created At
          </th>
          <th className="py-2 px-4 border" scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {roles.map((r) => (
          <tr key={r._id} aria-label={`Role ${r.name}`}>
            <td className="py-2 px-4 border">{r.name}</td>
            <td className="py-2 px-4 border">
              {new Date(r.createdAt).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 border">
              <button
                onClick={() => onEdit(r)}
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                aria-label={`Edit role ${r.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(r._id)}
                className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                aria-label={`Delete role ${r.name}`}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Sub-component for role form
const RoleForm = ({
  form,
  setForm,
  editing,
  onSubmit,
  onCancel,
  permissions,
  setPermissions,
}) => {
  const permissionLabels = {
    actions: {
      editTestInterview: "User can edit Test Interview",
      editMedicalTest: "User can edit Medical Test",
      editENumber: "User can edit E Number",
      editSubmission: "User can edit Submission",
      editVisaStamped: "User can edit Visa Stamped",
      editNadra: "User can edit Nadra",
      editProtector: "User can edit Protector",
      editFlight: "User can edit Flight",
      editDeparted: "User can edit Departed",
      goBack: "User can go back",
      editJobPrices: "User can edit Job prices",
    },
    configuration: {
      configuration: "Configuration",
      addOptions: "Add Options",
      ageRanges: "Age Ranges",
      salaryRanges: "Salary Ranges",
      experienceRanges: "Experience Ranges",
      airlines: "Airlines",
      visaProfession: "Visa Profession",
      sectorsIndustries: "Sectors / Industries",
      skills: "Skills",
      cities: "Cities",
      educationLevel: "Education Level",
      careerLevel: "Career Level",
      addPaymentAgent: "Add Payment Agent",
      addRecruitmentAgent: "Add Recruitment Agent",
      addTravelAgent: "Add Travel Agent",
      visaCategories: "Visa Categories",
      educationCategories: "Education Categories",
      jobCategories: "Job Categories",
      subCategories: "Sub Categories",
      workingCategories: "Working Categories",
      visaIssuingAuthorities: "Visa Issuing Authorities",
      verifyingInstitutions: "Verifying Institutions",
      addTestCenter: "Add Test Center",
      addMedicalCenters: "Add Medical Centers",
      addTestTypes: "Add Test Types",
    },
    candidateManagement: {
      candidateManagement: "Candidate Management",
      initialRegistration: "Initial Registration",
      candidateFinalRegistration: "Candidate Final Registration",
      applyJob: "Apply Job",
      shortlisting: "Shortlisting",
      shortlistedCandidates: "Shortlisted Candidates",
      onlineApplications: "Online Applications",
      jobApplications: "Job Applications",
      reportManagerCm: "Report Manager (CM)",
      candidateLedgerExpenses: "Candidate Ledger with Expenses",
      candidateLedgerSummary: "Candidate Ledger Summary",
      candidateAgentLedger: "Candidate Agent Ledger",
      protectorPrintCandidates: "Protector Print for Candidates",
      candidateFilterReport: "Candidate Filter Report",
      traveledCandidatesReport: "Traveled Candidates Report",
      candidateApplicationStatusReport: "Candidate Application Status Report",
      freezeApplications: "Freeze Applications",
      completedApplications: "Completed Applications",
      interviewSchedule: "Interview Schedule",
      bulkApplicationMaker: "Bulk Application Maker",
      bulkOfferSender: "Bulk Offer Sender",
      bulkFlightCancel: "Bulk flight Cancel",
    },
    accountingFinance: {
      accountingFinance: "Accounting & Finance",
      chartOfAccounts: "Chart of Accounts",
      managePayments: "Manage Payments",
      jobPayment: "Job Payment",
      travelAgentPayment: "Travel Agent Payment",
      candidateReceipt: "Candidate Receipt",
      candidateJv: "Candidate JV",
      expensesAgainstCandidate: "Expenses Against Candidate",
      openingBalance: "Opening Balance",
      cashReceipt: "Cash Receipt",
      cashPayment: "Cash Payment",
      reportManagerAf: "Report Manager (AF)",
      chartOfAccountBalances: "Chart of Account with Balances",
      cashBook: "Cash Book",
      bankBook: "Bank Book",
      generalLedger: "General Ledger",
      trialBalance: "Trial Balance",
      accountBalances: "Account Balances",
      incomeStatement: "Income Statement",
      balanceSheet: "Balance Sheet",
      cashFlowStatement: "Cash Flow Statement",
      equityReport: "Equity Report",
      bankReceipt: "Bank Receipt",
      bankPayment: "Bank Payment",
      jv: "JV",
    },
    adminArea: {
      adminArea: "Admin Area",
      dashboard: "Dashboard",
      manageUsers: "Manage Users",
      manageRole: "Manage Role",
      reportManagerAn: "Report Manager (AN)",
      userLogReport: "User Log Report",
    },
    applicationProcess: {
      applicationProcess: "Application Process",
      viewDetails: "View Details",
    },
    employerManagement: {
      employerManagement: "Employer Management",
      employerSetup: "Employer Setup",
      employerPlans: "Employer Plans",
      jobSetup: "Job Setup",
      reportManagerEm: "Report Manager (EM)",
      employerLedger: "Employer Ledger",
      jobGroupingPrints: "Job Grouping for Prints",
      statusJobsReport: "Status of Jobs Report",
      securityFeeRefundPrints: "Security Fee Refund Prints",
      travelAgentLedger: "Travel Agent Ledger",
    },
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">
        {editing ? "Edit Role" : "Add Role"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <label htmlFor="name" className="block mb-1">
          Role Name
          <input
            id="name"
            type="text"
            placeholder="Role Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <div className="border p-4 rounded">
          <h4 className="font-medium mb-2">Permissions</h4>
          {/* Actions */}
          <div className="mb-4">
            <h5 className="font-semibold">Actions</h5>
            {Object.keys(permissions.actions).map((key) => (
              <label key={key} className="block">
                <input
                  type="checkbox"
                  checked={permissions.actions[key]}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      actions: {
                        ...permissions.actions,
                        [key]: e.target.checked,
                      },
                    })
                  }
                />{" "}
                {permissionLabels.actions[key]}
              </label>
            ))}
          </div>
          {/* Other categories as tables */}
          {Object.keys(permissions)
            .filter((cat) => cat !== "actions")
            .map((category) => (
              <div key={category} className="mb-4">
                <h5 className="font-semibold">
                  {permissionLabels[category][category] || category}
                </h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Title</th>
                        <th className="border px-2 py-1">View</th>
                        <th className="border px-2 py-1">Add</th>
                        <th className="border px-2 py-1">Edit</th>
                        <th className="border px-2 py-1">Delete</th>
                        <th className="border px-2 py-1">Authorize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(permissions[category]).map((sub) => (
                        <tr key={sub}>
                          <td className="border px-2 py-1">
                            {permissionLabels[category][sub]}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <input
                              type="checkbox"
                              checked={permissions[category][sub].view}
                              onChange={(e) =>
                                setPermissions({
                                  ...permissions,
                                  [category]: {
                                    ...permissions[category],
                                    [sub]: {
                                      ...permissions[category][sub],
                                      view: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <input
                              type="checkbox"
                              checked={permissions[category][sub].add}
                              onChange={(e) =>
                                setPermissions({
                                  ...permissions,
                                  [category]: {
                                    ...permissions[category],
                                    [sub]: {
                                      ...permissions[category][sub],
                                      add: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <input
                              type="checkbox"
                              checked={permissions[category][sub].edit}
                              onChange={(e) =>
                                setPermissions({
                                  ...permissions,
                                  [category]: {
                                    ...permissions[category],
                                    [sub]: {
                                      ...permissions[category][sub],
                                      edit: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <input
                              type="checkbox"
                              checked={permissions[category][sub].delete}
                              onChange={(e) =>
                                setPermissions({
                                  ...permissions,
                                  [category]: {
                                    ...permissions[category],
                                    [sub]: {
                                      ...permissions[category][sub],
                                      delete: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <input
                              type="checkbox"
                              checked={permissions[category][sub].authorize}
                              onChange={(e) =>
                                setPermissions({
                                  ...permissions,
                                  [category]: {
                                    ...permissions[category],
                                    [sub]: {
                                      ...permissions[category][sub],
                                      authorize: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
          aria-label={editing ? "Update role" : "Add role"}
        >
          {editing ? "Update Role" : "Add Role"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-500 text-white py-2 rounded mt-2"
          aria-label="Cancel"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

// Main component
const ManageRoles = () => {
  const { user } = useSelector((state) => state.user);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
  });
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role !== "superadmin") return;
    fetchRoles();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      console.error("fetch roles error", err);
      toast.error(
        err.response?.status === 401
          ? "Unauthorized: Please log in again"
          : "Failed to fetch roles"
      );
    }
  };

  const validateForm = () => {
    if (!form.name) return "Role name is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const payload = { ...form, permissions };
      const res = editing
        ? await axios.put(`/api/roles/${editing._id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post("/api/roles", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
      toast.success(editing ? "Role updated" : "Role created");
      resetForm();
      fetchRoles();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.status === 401
          ? "Unauthorized: Please log in again"
          : err.response?.data?.message || "Error"
      );
    }
  };

  const handleEdit = (r) => {
    setForm({
      name: r.name,
    });
    setPermissions(r.permissions || defaultPermissions);
    setEditing(r);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/roles/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Role deleted");
      fetchRoles();
      setShowModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const handleAddRole = () => {
    setShowForm(true);
    setEditing(null);
    setForm({
      name: "",
    });
    setPermissions(defaultPermissions);
  };

  const resetForm = () => {
    setForm({
      name: "",
    });
    setEditing(null);
    setShowForm(false);
    setPermissions(defaultPermissions);
  };

  const filteredRoles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(term));
  }, [roles, searchTerm]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (user?.role !== "superadmin") {
    return <div className="p-6">Access denied.</div>;
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h2 className="text-2xl font-semibold mb-4">Manage Roles</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Role List</h3>
            <button
              onClick={handleAddRole}
              className="bg-green-500 text-white px-4 py-2 rounded"
              aria-label="Add new role"
            >
              New
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="search" className="sr-only">
              Search roles
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by role name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <RoleTable
            roles={paginatedRoles}
            onEdit={handleEdit}
            onDelete={(id) => {
              setDeleteId(id);
              setShowModal(true);
            }}
          />
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
        {showForm && (
          <RoleForm
            form={form}
            setForm={setForm}
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            permissions={permissions}
            setPermissions={setPermissions}
          />
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h3 className="text-lg mb-4">
              Are you sure you want to delete this role?
            </h3>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              aria-label="Confirm delete"
            >
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              aria-label="Cancel delete"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;
