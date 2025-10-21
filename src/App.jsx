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
      const token = localStorage.getItem("token");
      console.log("Checking auth, token:", token ? "present" : "missing");
      if (token) {
        try {
          await dispatch(getAuthUser()).unwrap();
          console.log(
            "getAuthUser successful, isAuthenticated:",
            isAuthenticated
          );
        } catch (err) {
          console.error("getAuthUser failed:", err);
        }
      } else {
        console.log("No token found in localStorage");
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
    return isAuthenticated ? children : <Navigate to="/login" />;
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
