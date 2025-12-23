import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineSetting, AiOutlineUser, AiOutlineTeam } from "react-icons/ai";
import { FiLayers, FiGrid } from "react-icons/fi";

const items = [
  { to: "/admin", label: "Admin Area", icon: FiGrid },
  {
    to: "/admin/configuration",
    label: "Configuration",
    icon: AiOutlineSetting,
  },
  { to: "/admin/accounting", label: "Accounting & Finance", icon: FiLayers },
  {
    to: "/admin/employer-management",
    label: "Employer Management",
    icon: AiOutlineTeam,
  },
  {
    to: "/admin/candidate-management",
    label: "Candidate Management",
    icon: AiOutlineUser,
  },
];

const adminSub = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/manage-users", label: "Manage Users" },
  { to: "/admin/manage-role", label: "Manage Role" },
  { to: "/admin/user-log-report", label: "User Log Report" },
];

const accountingSub = [
  { to: "/admin/accounting/chart-of-accounts", label: "Chart of Accounts" },
  { to: "/admin/accounting/opening-balance", label: "Opening Balance" },
  { to: "/admin/accounting/cash-receipt", label: "Cash Receipt" },
  { to: "/admin/accounting/cash-payment", label: "Cash Payment" },
  { to: "/admin/accounting/bank-receipt", label: "Bank Receipt" },
  { to: "/admin/accounting/bank-payment", label: "Bank Payment" },
  { to: "/admin/accounting/jv", label: "JV" },
  { to: "/admin/accounting/manage-payments", label: "Manage Payments" },
  { to: "/admin/accounting/job-payment", label: "Job Payment" },
  {
    to: "/admin/accounting/travel-agent-payment",
    label: "Travel Agent Payment",
  },
  { to: "/admin/accounting/candidate-receipt", label: "Candidate Receipt" },
  { to: "/admin/accounting/candidate-jv", label: "Candidate JV" },
  {
    to: "/admin/accounting/expenses-against-candidate",
    label: "Expenses Against Candidate",
  },
  { to: "/admin/accounting/report-manager", label: "Report Manager (AF)" },
  {
    to: "/admin/accounting/chart-of-accounts-balances",
    label: "Chart of Account with Balances",
  },
  { to: "/admin/accounting/cash-book", label: "Cash Book" },
  { to: "/admin/accounting/bank-book", label: "Bank Book" },
  { to: "/admin/accounting/general-ledger", label: "General Ledger" },
  { to: "/admin/accounting/trial-balance", label: "Trial Balance" },
  { to: "/admin/accounting/account-balances", label: "Account Balances" },
  { to: "/admin/accounting/income-statement", label: "Income Statement" },
  { to: "/admin/accounting/balance-sheet", label: "Balance Sheet" },
  { to: "/admin/accounting/cash-flow-statement", label: "Cash Flow Statement" },
  { to: "/admin/accounting/equity-report", label: "Equity Report" },
];

const configSub = [
  { to: "/admin/config/add-payment-agent", label: "Add Payment Agent" },
  { to: "/admin/config/add-recruitment-agent", label: "Add Recruitment Agent" },
  { to: "/admin/config/add-travel-agent", label: "Add Travel Agent" },
  { to: "/admin/config/manage-travel-agents", label: "Manage Travel Agents" },
  { to: "/admin/config/visa-categories", label: "Visa Categories" },
  { to: "/admin/config/education-categories", label: "Education Categories" },
  { to: "/admin/config/job-categories", label: "Job Categories" },
  { to: "/admin/config/sub-categories", label: "Sub Categories" },
  { to: "/admin/config/working-categories", label: "Working Categories" },
  {
    to: "/admin/config/visa-issuing-authorities",
    label: "Visa Issuing Authorities",
  },
  {
    to: "/admin/config/verifying-institutions",
    label: "Verifying Institutions",
  },
  { to: "/admin/config/add-test-center", label: "Add Test Center" },
  { to: "/admin/config/add-medical-centers", label: "Add Medical Centers" },
  { to: "/admin/config/test-types", label: "Add Test Types" },
  { to: "/admin/config/age-ranges", label: "Age Ranges" },
  { to: "/admin/config/salary-ranges", label: "Salary Ranges" },
  { to: "/admin/config/experience-ranges", label: "Experience Ranges" },
  { to: "/admin/config/airlines", label: "Airlines" },
  { to: "/admin/config/visa-professions", label: "Visa Profession" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/config/working-sectors", label: "Sectors / Industries" },
  { to: "/admin/config/cities", label: "Cities" },
  { to: "/admin/config/education-level", label: "Education Level" },
  { to: "/admin/config/career-level", label: "Carrer Level" },
];

const employerSub = [
  { to: "/admin/employer-management/employer-setup", label: "Employer Setup" },
  { to: "/admin/employer-management/employer-plans", label: "Employer Plans" },
  { to: "/admin/employer-management/job-setup", label: "Job Setup" },
  {
    to: "/admin/employer-management/employer-ledger",
    label: "Employer Ledger",
  },
  {
    to: "/admin/employer-management/job-grouping-prints",
    label: "Job Grouping for Prints",
  },
  {
    to: "/admin/employer-management/status-jobs-report",
    label: "Status of Jobs Report",
  },
  {
    to: "/admin/employer-management/security-fee-refund-prints",
    label: "Security Fee Refund Prints",
  },
  {
    to: "/admin/employer-management/travel-agent-ledger",
    label: "Travel Agent Ledger",
  },
];

const candidateSub = [
  {
    to: "/admin/candidate-management/initial-registration",
    label: "Initial Registration",
  },
  {
    to: "/admin/candidate-management/candidate-final-registration",
    label: "Candidate Final Registration",
  },
  { to: "/admin/candidate-management/apply-job", label: "Apply Job" },
  { to: "/admin/candidate-management/shortlisting", label: "Shortlisting" },
  {
    to: "/admin/candidate-management/shortlisted-candidates",
    label: "Shortlisted Candidates",
  },
  {
    to: "/admin/candidate-management/online-applications",
    label: "Online Applications",
  },
  {
    to: "/admin/candidate-management/job-applications",
    label: "Job Applications",
  },
  {
    to: "/admin/candidate-management/freeze-applications",
    label: "Freeze Applications",
  },
  {
    to: "/admin/candidate-management/completed-applications",
    label: "Completed Applications",
  },
  {
    to: "/admin/candidate-management/interview-schedule",
    label: "Interview Schedule",
  },
  {
    to: "/admin/candidate-management/bulk-application-maker",
    label: "Bulk Application Maker",
  },
  {
    to: "/admin/candidate-management/bulk-offer-sender",
    label: "Bulk Offer Sender",
  },
  {
    to: "/admin/candidate-management/bulk-flight-cancel",
    label: "Bulk flight Cancel",
  },
  {
    to: "/admin/candidate-management/report-manager",
    label: "Report Manager (CM)",
  },
  {
    to: "/admin/candidate-management/candidate-ledger-expenses",
    label: "Candidate Ledger with Expenses",
  },
  {
    to: "/admin/candidate-management/candidate-ledger-summary",
    label: "Candidate Ledger Summary",
  },
  {
    to: "/admin/candidate-management/candidate-agent-ledger",
    label: "Candidate Agent Ledger",
  },
  {
    to: "/admin/candidate-management/protector-print-candidates",
    label: "Protector Print for Candidates",
  },
  {
    to: "/admin/candidate-management/candidate-filter-report",
    label: "Candidate Filter Report",
  },
  {
    to: "/admin/candidate-management/traveled-candidates-report",
    label: "Traveled Candidates Report",
  },
  {
    to: "/admin/candidate-management/candidate-application-status-report",
    label: "Candidate Application Status Report",
  },
];

const AdminNavbar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeout = React.useRef();

  // Helper to handle hover with delay
  const handleMouseEnter = (item) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredItem(item);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredItem(null), 120);
  };
  const location = useLocation();
  const { user } = useSelector((state) => state.user || {});

  // Hide navbar for all admin users, only show for superadmin
  if (user?.role !== "superadmin") {
    return null;
  }

  // Helper: check if admin has permission for a given path
  const hasPermission = (path) => {
    if (user?.role === "superadmin") return true;
    if (!user?.permissions) return false;
    // Example: permissions structure: { candidateManagement: { initialRegistration: { view: true } } }
    // You may need to adjust this logic to match your permissions structure
    if (path.includes("candidate-management")) {
      if (path.includes("initial-registration")) {
        return user.permissions?.candidateManagement?.initialRegistration?.view;
      }
      if (path.includes("candidate-final-registration")) {
        return user.permissions?.candidateManagement?.candidateFinalRegistration
          ?.view;
      }
      // Add more candidate management checks as needed
      return true; // fallback
    }
    // Add more section checks as needed (employerManagement, accounting, etc.)
    return true; // fallback: allow
  };

  return (
    <nav className="bg-white rounded-lg shadow-sm mb-6 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold text-gray-800">Admin</h4>
            <p className="text-sm text-gray-500">Management</p>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {items.map((it) => {
              const Icon = it.icon;
              if (it.to === "/admin") {
                // render Admin Area with hover dropdown
                return (
                  <div
                    key={it.to}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter("/admin")}
                    onMouseLeave={handleMouseLeave}
                    style={{ display: "inline-block" }}
                  >
                    <div>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                            isActive
                              ? "bg-emerald-600 text-white shadow"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon className="text-base" />
                        <span>{it.label}</span>
                        <svg
                          className="ml-1 w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </NavLink>
                    </div>
                    {hoveredItem === "/admin" && (
                      <div
                        className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg opacity-100 transform scale-100 transition-all duration-150 origin-top z-50"
                        onMouseEnter={() => handleMouseEnter("/admin")}
                        onMouseLeave={handleMouseLeave}
                      >
                        <ul className="py-2">
                          {adminSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }

              if (it.to === "/admin/configuration") {
                // render Configuration with hover dropdown
                return (
                  <div
                    key={it.to}
                    className="relative"
                    onMouseEnter={() =>
                      handleMouseEnter("/admin/configuration")
                    }
                    onMouseLeave={handleMouseLeave}
                    style={{ display: "inline-block" }}
                  >
                    <div>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                            isActive
                              ? "bg-emerald-600 text-white shadow"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon className="text-base" />
                        <span>{it.label}</span>
                        <svg
                          className="ml-1 w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </NavLink>
                    </div>
                    {hoveredItem === "/admin/configuration" && (
                      <div
                        className="absolute left-0 mt-2 w-[760px] bg-white border rounded-md shadow-lg opacity-100 transform scale-100 transition-all duration-150 origin-top z-50"
                        onMouseEnter={() =>
                          handleMouseEnter("/admin/configuration")
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {configSub.map((s) => (
                              <NavLink
                                key={s.to}
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                              >
                                {s.label}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (it.to === "/admin/accounting") {
                // render Accounting & Finance with hover dropdown
                return (
                  <div
                    key={it.to}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter("/admin/accounting")}
                    onMouseLeave={handleMouseLeave}
                    style={{ display: "inline-block" }}
                  >
                    <div>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                            isActive
                              ? "bg-emerald-600 text-white shadow"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon className="text-base" />
                        <span>{it.label}</span>
                        <svg
                          className="ml-1 w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </NavLink>
                    </div>
                    {hoveredItem === "/admin/accounting" && (
                      <div
                        className="absolute left-0 mt-2 w-[800px] bg-white border rounded-md shadow-lg opacity-100 transform scale-100 transition-all duration-150 origin-top z-50"
                        onMouseEnter={() =>
                          handleMouseEnter("/admin/accounting")
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {accountingSub.map((s) => (
                              <NavLink
                                key={s.to}
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                              >
                                {s.label}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (it.to === "/admin/employer-management") {
                // render Employer Management with hover dropdown
                return (
                  <div
                    key={it.to}
                    className="relative"
                    onMouseEnter={() =>
                      handleMouseEnter("/admin/employer-management")
                    }
                    onMouseLeave={handleMouseLeave}
                    style={{ display: "inline-block" }}
                  >
                    <div>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                            isActive
                              ? "bg-emerald-600 text-white shadow"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon className="text-base" />
                        <span>{it.label}</span>
                        <svg
                          className="ml-1 w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </NavLink>
                    </div>
                    {hoveredItem === "/admin/employer-management" && (
                      <div
                        className="absolute left-0 mt-2 w-64 bg-white border rounded-md shadow-lg opacity-100 transform scale-100 transition-all duration-150 origin-top z-50"
                        onMouseEnter={() =>
                          handleMouseEnter("/admin/employer-management")
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <ul className="py-2">
                          {employerSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }

              if (it.to === "/admin/candidate-management") {
                // render Candidate Management with hover dropdown
                return (
                  <div
                    key={it.to}
                    className="relative"
                    onMouseEnter={() =>
                      handleMouseEnter("/admin/candidate-management")
                    }
                    onMouseLeave={handleMouseLeave}
                    style={{ display: "inline-block" }}
                  >
                    <div>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                            isActive
                              ? "bg-emerald-600 text-white shadow"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon className="text-base" />
                        <span>{it.label}</span>
                        <svg
                          className="ml-1 w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </NavLink>
                    </div>
                    {hoveredItem === "/admin/candidate-management" && (
                      <div
                        className="absolute right-0 mt-2 w-[800px] bg-white border rounded-md shadow-lg opacity-100 transform scale-100 transition-all duration-150 origin-top z-50"
                        onMouseEnter={() =>
                          handleMouseEnter("/admin/candidate-management")
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {candidateSub.map((s) => (
                              <NavLink
                                key={s.to}
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                              >
                                {s.label}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                      isActive
                        ? "bg-emerald-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="text-base" />
                  <span>{it.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* mobile menu - simple overflow menu */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer px-3 py-2 rounded-md bg-gray-100 text-gray-700">
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-md z-20">
                <ul className="divide-y">
                  {items.map((it) => (
                    <li key={it.to}>
                      <NavLink
                        to={it.to}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <it.icon />
                        <span>{it.label}</span>
                      </NavLink>

                      {/* include adminSub under Admin Area for mobile */}
                      {it.to === "/admin" && (
                        <ul className="pl-8 py-2">
                          {adminSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* include configSub under Configuration for mobile */}
                      {it.to === "/admin/configuration" && (
                        <ul className="pl-8 py-2">
                          {configSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* include accountingSub under Accounting & Finance for mobile */}
                      {it.to === "/admin/accounting" && (
                        <ul className="pl-8 py-2">
                          {accountingSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* include employerSub under Employer Management for mobile */}
                      {it.to === "/admin/employer-management" && (
                        <ul className="pl-8 py-2">
                          {employerSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* include candidateSub under Candidate Management for mobile */}
                      {it.to === "/admin/candidate-management" && (
                        <ul className="pl-8 py-2">
                          {candidateSub.map((s) => (
                            <li key={s.to}>
                              <NavLink
                                to={s.to}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {s.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
