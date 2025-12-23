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
import Navbar from "./Components/Navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "./Components/Sidebar/Sidebar";
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
import Login from "./features/users/components/Login";
import Signup from "./features/users/components/Signup";
import VerifyOTP from "./features/users/components/VerifyOTP";
import ForgotPassword from "./features/users/components/ForgotPassword";
import ResetPassword from "./features/users/components/ResetPassword";


// Component to handle Navbar visibility
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
      let token = localStorage.getItem("token");
      console.log("Checking auth, token:", token ? "present" : "missing");
      if (!token) {
        // Set fallback token if none exists
        token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWY0NGNhNzQ3YWJmYjA5OGZlYjRjZSIsImVtYWlsIjoiYWhhZHF1cmVzaGkxNjc1NkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImFoYWQiLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc2MTg5NjQ0NywiZXhwIjoxNzYzMTkyNDQ3fQ.dZcyWdxwSSk7Ndgn_x4HxB4FNXClPBL_uCyrGEiHNkk";
        localStorage.setItem("token", token);
        console.log("Set fallback token");
      }
      try {
        await dispatch(getAuthUser()).unwrap();
        console.log(
          "getAuthUser successful, isAuthenticated:",
          isAuthenticated
        );
      } catch (err) {
        console.error("getAuthUser failed:", err);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [dispatch]);

  const ProtectedRoute = ({ children }) => {
    if (!authChecked) {
      console.log("Auth not checked yet, waiting...");
      return <div>Loading...</div>; // Show loading state
    }
    console.log("ProtectedRoute check, isAuthenticated:", isAuthenticated);
    const token = localStorage.getItem("token");
    return isAuthenticated || token ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      {authChecked ? (
        <>
          {error && (
            <div className="fixed top-0 w-full bg-red-600 text-white text-center p-2">
              {error}
            </div>
          )}
          <Toaster position="top-right" />
          <Routes>
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
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/sidebar"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Sidebar />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/candidate"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Candidate />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/deposit-slip"
              element={
                <Layout>
                  <ProtectedRoute>
                    <DepositSlip />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/candidates-cv"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidatesCV />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/contract-letter"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ContractLetter />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/undertaking-letter"
              element={
                <Layout>
                  <ProtectedRoute>
                    <UndertakingLetter />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/nbpchallan"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Nbpchallan />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/visa-form"
              element={
                <Layout>
                  <ProtectedRoute>
                    <VisaForm />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/allied-form"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AlliedForm />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/expense"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Expense />
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
            <Route
              path="/admin/config/add-payment-agent"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AddPaymentAgent />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/add-recruitment-agent"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AddRecruitmentAgent />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/add-travel-agent"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AddTravelAgent />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/visa-categories"
              element={
                <Layout>
                  <ProtectedRoute>
                    <VisaCategories />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/visa-issuing-authorities"
              element={
                <Layout>
                  <ProtectedRoute>
                    <VisaIssuingAuthorities />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/verifying-institutions"
              element={
                <Layout>
                  <ProtectedRoute>
                    <VerifyingInstitutions />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/add-test-center"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AddTestCenter />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/add-medical-centers"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AddMedicalCenters />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/test-types"
              element={
                <Layout>
                  <ProtectedRoute>
                    <TestTypes />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/age-ranges"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AgeRanges />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/salary-ranges"
              element={
                <Layout>
                  <ProtectedRoute>
                    <SalaryRanges />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/experience-ranges"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ExperienceRanges />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/airlines"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Airlines />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/visa-professions"
              element={
                <Layout>
                  <ProtectedRoute>
                    <VisaProfession />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/working-sectors"
              element={
                <Layout>
                  <ProtectedRoute>
                    <WorkingSectors />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/cities"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Cities />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/education-level"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EducationLevels />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/career-level"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CareerLevels />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/skills"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/manage-users"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ManageUsers />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/manage-role"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ManageRoles />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/user-log-report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <UserLogReport />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/education-categories"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EducationCategories />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/job-categories"
              element={
                <Layout>
                  <ProtectedRoute>
                    <JobCategories />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/sub-categories"
              element={
                <Layout>
                  <ProtectedRoute>
                    <SubCategories />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/config/working-categories"
              element={
                <Layout>
                  <ProtectedRoute>
                    <WorkingCategories />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/chart-of-accounts"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ChartOfAccounts />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/chart-of-accounts-balances"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ChartOfAccountsBalances />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/cash-book"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CashBook />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/bank-book"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BankBook />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/opening-balance"
              element={
                <Layout>
                  <ProtectedRoute>
                    <OpeningBalance />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/cash-receipt"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CashReceiptVoucher />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/cash-payment"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CashPaymentVoucher />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/bank-receipt"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BankReceiptVoucher />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/bank-payment"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BankPaymentVoucher />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/jv"
              element={
                <Layout>
                  <JournalVoucher />
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/job-payment"
              element={
                <Layout>
                  <ProtectedRoute>
                    <JobPayment />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/travel-agent-payment"
              element={
                <Layout>
                  <ProtectedRoute>
                    <TravelAgentPayment />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/candidate-receipt"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateReceipt />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/candidate-jv"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateJV />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/expenses-against-candidate"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ExpensesAgainstCandidate />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/general-ledger"
              element={
                <Layout>
                  <ProtectedRoute>
                    <TrialBalance />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/trial-balance"
              element={
                <Layout>
                  <ProtectedRoute>
                    <TrialBalance />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/account-balances"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AccountBalances />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/income-statement"
              element={
                <Layout>
                  <ProtectedRoute>
                    <IncomeStatement />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/balance-sheet"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BalanceSheet />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/cash-flow-statement"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CashFlowStatement />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/accounting/equity-report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <StatementOfOwnersEquity />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/employer-setup"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EmployerManagement />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/employer-plans"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EmployerPlans />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/job-setup"
              element={
                <Layout>
                  <ProtectedRoute>
                    <JobSetup />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/employer-ledger"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EmployerLedger />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/job-grouping-prints"
              element={
                <Layout>
                  <ProtectedRoute>
                    <JobGroupingPrints />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/status-jobs-report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <StatusJobsReport />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/security-fee-refund-prints"
              element={
                <Layout>
                  <ProtectedRoute>
                    <SecurityFeeRefundPrints />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/employer-management/travel-agent-ledger"
              element={
                <Layout>
                  <ProtectedRoute>
                    <TravelAgentLedger />
                  </ProtectedRoute>
                </Layout>
              }
            />
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
            <Route
              path="/admin/candidate-management/bulk-application-maker"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BulkApplicationMaker />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/bulk-offer-sender"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BulkOfferSender />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/bulk-flight-cancel"
              element={
                <Layout>
                  <ProtectedRoute>
                    <BulkFlightCancel />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/candidate-ledger-expenses"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateLedgerExpenses />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/candidate-ledger-summary"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateLedgerSummary />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/candidate-agent-ledger"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateAgentLedger />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/protector-print-candidates"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ProtectorPrintCandidates />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/candidate-filter-report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateFilterReport />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/traveled-candidates-report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <TravelledCandidatesReport />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/candidate-management/candidate-application-status-report"
              element={
                <Layout>
                  <ProtectedRoute>
                    <CandidateApplicationStatusReport />
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
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
