import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAuthUser } from "./features/users/userSlice";
import toast, { Toaster } from "react-hot-toast";

// Layout & Auth Components
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import ProtectedRoute from "./Components/ProtectedRoute"; // ← Assume you have this or create it

// Page Components
import Login from "./features/users/components/Login";
import Signup from "./features/users/components/Signup";
import VerifyOTP from "./features/users/components/VerifyOTP";
import ForgotPassword from "./features/users/components/ForgotPassword";
import ResetPassword from "./features/users/components/ResetPassword";

import Dashboard from "./Components/Dashboard/Dashboard";
import Candidate from "./Components/Candidate/Candidate";
import DepositSlip from "./Components/DepositSlip/DepositSlip";
import CandidatesCV from "./Components/CandidatesCV/CandidatesCV";
import ContractLetter from "./Components/Contract Letter/ContractLetter";
import UndertakingLetter from "./Components/UndertakingLetter/UndertakingLetter";
import Nbpchallan from "./Components/Nbpchallan/Nbpchallan";
import VisaForm from "./Components/VisaForm/VisaForm";
import AlliedForm from "./Components/AlliedForm/AlliedForm";
import Expense from "./Components/Expense/Expense";
import SuperAdmin from "./Components/SuperAdmin/SuperAdmin";

import AddPaymentAgent from "./Components/Config/AddPaymentAgent";
import AddRecruitmentAgent from "./Components/Config/AddRecruitmentAgent";
import AddTravelAgent from "./Components/Config/AddTravelAgent";
import VisaCategories from "./Components/Config/VisaCategories";
import VisaIssuingAuthorities from "./Components/Config/VisaIssuingAuthorities";
import VerifyingInstitutions from "./Components/Config/VerifyingInstitutions";
import AddTestCenter from "./Components/Config/AddTestCenter";
import AddMedicalCenters from "./Components/Config/AddMedicalCenters";
import TestTypes from "./Components/Config/TestTypes";
import AgeRanges from "./Components/Config/AgeRanges";
import SalaryRanges from "./Components/Config/SalaryRanges";
import ExperienceRanges from "./Components/Config/ExperienceRanges";
import Airlines from "./Components/Config/Airlines";
import VisaProfession from "./Components/Config/VisaProfession";
import WorkingSectors from "./Components/Config/WorkingSectors";
import Cities from "./Components/Config/Cities";
import EducationLevels from "./Components/Config/EducationLevels";
import CareerLevels from "./Components/Config/CareerLevels";
import Skills from "./Components/Skills";
import ManageUsers from "./Components/ManageUsers";
import ManageRoles from "./Components/ManageRoles";
import UserLogReport from "./Components/UserLogReport";
import AllActivityLogs from "./Components/AllActivityLogs";

import EducationCategories from "./Components/Config/EducationCategories";
import JobCategories from "./Components/Config/JobCategories";
import SubCategories from "./Components/Config/SubCategories";
import WorkingCategories from "./Components/Config/WorkingCategories";

import ChartOfAccounts from "./Components/Accounting/ChartOfAccounts";
import ChartOfAccountsBalances from "./Components/Accounting/ChartOfAccountsBalances";
import CashBook from "./Components/Accounting/CashBook";
import BankBook from "./Components/Accounting/BankBook";
import OpeningBalance from "./Components/Accounting/OpeningBalance";
import CashReceiptVoucher from "./Components/Accounting/CashReceiptVoucher";
import CashPaymentVoucher from "./Components/Accounting/CashPaymentVoucher";
import BankReceiptVoucher from "./Components/Accounting/BankReceiptVoucher";
import BankPaymentVoucher from "./Components/Accounting/BankPaymentVoucher";
import JournalVoucher from "./Components/Accounting/JournalVoucher";
import JobPayment from "./Components/Accounting/JobPayment";
import TravelAgentPayment from "./Components/Accounting/TravelAgentPayment";
import CandidateReceipt from "./Components/Accounting/CandidateReceipt";
import CandidateJV from "./Components/Accounting/CandidateJV";
import ExpensesAgainstCandidate from "./Components/Accounting/ExpensesAgainstCandidate";
import TrialBalance from "./Components/Accounting/GeneralLedger";
import AccountBalances from "./Components/Accounting/AccountBalances";
import IncomeStatement from "./Components/Accounting/IncomeStatement";
import BalanceSheet from "./Components/Accounting/BalanceSheet";
import CashFlowStatement from "./Components/Accounting/CashFlowStatement";
import StatementOfOwnersEquity from "./Components/Accounting/StatementOfOwnersEquity";

import EmployerManagement from "./Components/EmployerManagement";
import EmployerPlans from "./Components/EmployerPlans";
import JobSetup from "./Components/JobSetup";
import EmployerLedger from "./Components/Accounting/EmployerLedger";
import JobGroupingPrints from "./Components/JobGroupingPrints";
import StatusJobsReport from "./Components/StatusJobsReport";
import SecurityFeeRefundPrints from "./Components/SecurityFeeRefundPrints";
import TravelAgentLedger from "./Components/TravelAgentLedger";

import InitialRegistration from "./Components/InitialRegistration";
import CandidateFinalRegistration from "./Components/CandidateFinalRegistration";
import ApplyJob from "./Components/ApplyJob";
import Shortlisting from "./Components/Shortlisting";
import ShortlistedCandidates from "./Components/ShortlistedCandidates";
import OnlineApplications from "./Components/OnlineApplications";
import JobApplications from "./Components/JobApplications";
import FreezeApplications from "./Components/FreezeApplications";
import CompletedApplications from "./Components/CompletedApplications";
import InterviewSchedules from "./Components/InterviewSchedules";
import BulkApplicationMaker from "./Components/BulkApplicationMaker";
import BulkOfferSender from "./Components/BulkOfferSender";
import BulkFlightCancel from "./Components/BulkFlightCancel";
import CandidateLedgerExpenses from "./Components/CandidateLedgerExpenses";
import CandidateLedgerSummary from "./Components/CandidateLedgerSummary";
import CandidateAgentLedger from "./Components/CandidateAgentLedger";
import ProtectorPrintCandidates from "./Components/ProtectorPrintCandidates";
import CandidateFilterReport from "./Components/CandidateFilterReport";
import TravelledCandidatesReport from "./Components/TravelledCandidatesReport";
import CandidateApplicationStatusReport from "./Components/CandidateApplicationStatusReport";

// Newly added imports that were floating
import ReadyToSubmitted from "./Components/ReadyToSubmitted";
import SubmittedCandidates from "./Components/SubmittedCandidates";

// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const authRoutes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ];

  return (
    <>
      {!authRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log(
        "[APP] App init - checking auth, token:",
        token ? "EXISTS" : "NOT_FOUND"
      );
      if (!token) {
        console.log("[APP] No token, skipping auth check");
        setAuthChecked(true);
        return;
      }
      try {
        console.log("[APP] Token found, calling getAuthUser...");
        const result = await dispatch(getAuthUser()).unwrap();
        console.log("[APP] Auth check successful:", result);
      } catch (err) {
        console.error("[APP] Auth check failed:", err);
        localStorage.removeItem("token");
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [dispatch]);

  // ProtectedRoute Component (you can move this to a separate file)
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    // If no token at all, redirect to login
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // Wait for initial auth check before rendering protected content
    if (!authChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-gray-600">Loading...</span>
        </div>
      );
    }

    // If token exists and auth check completed, render the content
    return children;
  };

  return (
    <BrowserRouter>
      {authChecked ? (
        <>
          {error && (
            <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
              {error}
            </div>
          )}
          <Toaster position="top-right" />

          <Routes>
            {/* Public/Auth Routes */}
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/signup"
              element={
                <Layout>
                  <Signup />
                </Layout>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <Layout>
                  <VerifyOTP />
                </Layout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Layout>
                  <ForgotPassword />
                </Layout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <Layout>
                  <ResetPassword />
                </Layout>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/sidebar"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Sidebar />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/super-admin"
              element={
                <Layout>
                  <ProtectedRoute>
                    <SuperAdmin />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* Candidate Management */}
            <Route
              path="/admin/candidate-management/initial-registration"
              element={
                <Layout>
                  <ProtectedRoute>
                    <InitialRegistration />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/ready-to-submitted"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ReadyToSubmitted />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/submitted-candidates"
              element={
                <Layout>
                  <ProtectedRoute>
                    <SubmittedCandidates />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/candidate-final-registration"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateFinalRegistration />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/apply-job"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ApplyJob />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/shortlisting"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Shortlisting />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/shortlisted-candidates"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ShortlistedCandidates />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/online-applications"
              element={
                <Layout>
                  <ProtectedRoute>
                    <OnlineApplications />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/job-applications"
              element={
                <Layout>
                  <ProtectedRoute>
                    <JobApplications />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/freeze-applications"
              element={
                <Layout>
                  <ProtectedRoute>
                    <FreezeApplications />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/completed-applications"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CompletedApplications />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/interview-schedule"
              element={
                <Layout>
                  <ProtectedRoute>
                    <InterviewSchedules />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* ... You can continue adding the remaining routes in the same pattern ... */}

            {/* Fallback Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-xl font-semibold text-gray-700">
            Loading application...
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
