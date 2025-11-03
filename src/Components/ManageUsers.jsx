// src/Components/ManageUsers.jsx
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

// Sub-component for user table
const UserTable = ({ users, onEdit, onDelete, onToggleStatus }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border" aria-label="Users table">
      <thead>
        <tr>
          <th className="py-2 px-4 border" scope="col">
            Username
          </th>
          <th className="py-2 px-4 border" scope="col">
            First Name
          </th>
          <th className="py-2 px-4 border" scope="col">
            Last Name
          </th>
          <th className="py-2 px-4 border" scope="col">
            Email
          </th>
          <th className="py-2 px-4 border" scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} aria-label={`User ${u.username}`}>
            <td className="py-2 px-4 border">{u.username}</td>
            <td className="py-2 px-4 border">{u.firstName || "-"}</td>
            <td className="py-2 px-4 border">{u.lastName || "-"}</td>
            <td className="py-2 px-4 border">{u.email}</td>
            <td className="py-2 px-4 border">
              <button
                onClick={() => onEdit(u)}
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                aria-label={`Edit user ${u.username}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(u._id)}
                className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                aria-label={`Delete user ${u.username}`}
              >
                Delete
              </button>
              <button
                onClick={() => onToggleStatus(u._id, u.isActive)}
                className={`px-2 py-1 rounded ${
                  u.isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
                aria-label={`${u.isActive ? "Deactivate" : "Activate"} user ${
                  u.username
                }`}
              >
                {u.isActive ? "Active" : "Inactive"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Sub-component for user form
const UserForm = ({
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
        {editing ? "Edit User" : "Add User"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <label htmlFor="username" className="block mb-1">
          Username
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label htmlFor="email" className="block mb-1">
          Email
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        {!editing && (
          <label htmlFor="password" className="block mb-1">
            Password
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </label>
        )}
        <label htmlFor="userType" className="block mb-1">
          User Type
          <select
            id="userType"
            value={form.userType}
            onChange={(e) => setForm({ ...form, userType: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="accountant">Accountant</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </label>
        <label htmlFor="role" className="block mb-1">
          Role *
          <input
            id="role"
            type="text"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label htmlFor="firstName" className="block mb-1">
          First Name
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label htmlFor="lastName" className="block mb-1">
          Last Name
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label htmlFor="fatherName" className="block mb-1">
          Father Name
          <input
            id="fatherName"
            type="text"
            placeholder="Father Name"
            value={form.fatherName}
            onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label htmlFor="contactNo" className="block mb-1">
          Contact No
          <input
            id="contactNo"
            type="text"
            placeholder="Contact No."
            value={form.contactNo}
            onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label htmlFor="cnic" className="block mb-1">
          CNIC
          <input
            id="cnic"
            type="text"
            placeholder="CNIC"
            value={form.cnic}
            onChange={(e) => setForm({ ...form, cnic: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label htmlFor="isActive" className="block mb-1">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="mr-2"
          />
          Admin Active
        </label>
        {editing && (
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
            <button
              type="button"
              onClick={() => handlePermissions(editing, permissions)}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
            >
              Update Permissions
            </button>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
          aria-label={editing ? "Update user" : "Add user"}
        >
          {editing ? "Update User" : "Add User"}
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
const ManageUsers = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    userType: "admin",
    role: "",
    password: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    contactNo: "",
    email: "",
    cnic: "",
    isActive: false,
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
    fetchUsers();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error("fetch users error", err);
      toast.error(
        err.response?.status === 401
          ? "Unauthorized: Please log in again"
          : "Failed to fetch users"
      );
    }
  };

  const validateForm = () => {
    if (!form.username) return "Username is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Valid email is required";
    }
    if (!editing && !form.password) return "Password is required";
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
      const payload = { ...form };
      const res = editing
        ? await axios.put(`/api/users/${editing._id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post("/api/users/create-admin", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
      toast.success(editing ? "User updated" : "User created");
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.status === 401
          ? "Unauthorized: Please log in again"
          : err.response?.data?.message || "Error"
      );
    }
  };

  const handleEdit = (u) => {
    setForm({
      username: u.username,
      email: u.email,
      password: "",
      userType: u.userType || "admin",
      role: u.role || "",
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      fatherName: u.fatherName || "",
      contactNo: u.contactNo || "",
      cnic: u.cnic || "",
      isActive: u.isActive || false,
    });
    setPermissions(u.permissions || defaultPermissions);
    setEditing(u);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsers();
      setShowModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/users/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handlePermissions = async (user, perms) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/users/${user._id}/permissions`,
        { permissions: perms },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Permissions updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update permissions");
    }
  };

  const handleAddUser = () => {
    setShowForm(true);
    setEditing(null);
    setForm({
      username: "",
      email: "",
      password: "",
      userType: "admin",
      role: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      contactNo: "",
      cnic: "",
      isActive: false,
    });
    setPermissions(defaultPermissions);
  };

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      userType: "admin",
      role: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      contactNo: "",
      cnic: "",
      isActive: false,
    });
    setEditing(null);
    setShowForm(false);
    setPermissions(defaultPermissions);
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(term) ||
        (u.firstName && u.firstName.toLowerCase().includes(term)) ||
        (u.lastName && u.lastName.toLowerCase().includes(term)) ||
        u.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (user?.role !== "superadmin") {
    return <div className="p-6">Access denied.</div>;
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">User List</h3>
            <button
              onClick={handleAddUser}
              className="bg-green-500 text-white px-4 py-2 rounded"
              aria-label="Add new user"
            >
              Add User
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="search" className="sr-only">
              Search users
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by username, first name, last name, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <UserTable
            users={paginatedUsers}
            onEdit={handleEdit}
            onDelete={(id) => {
              setDeleteId(id);
              setShowModal(true);
            }}
            onToggleStatus={handleToggleStatus}
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
          <UserForm
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
              Are you sure you want to delete this user?
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

export default ManageUsers;
