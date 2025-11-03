// Components/AuthForms/AuthForms.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/logo.png";

const API_URL = "http://213.199.41.219:3001/api/users";

// Axios interceptor to attach token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/");
      setError("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

const AuthForms = ({ isAuthenticated, setIsAuthenticated, onAuthSuccess }) => {
  const [formType, setFormType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthForms useEffect: isAuthenticated=", isAuthenticated);
    if (isAuthenticated) {
      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    if (
      [
        "login",
        "signup",
        "verify-otp",
        "forgot-password",
        "reset-password",
      ].includes(formType)
    ) {
      if (!email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email))
        errors.email = "Invalid email format";
    }
    if (["login", "signup"].includes(formType)) {
      if (!password) errors.password = "Password is required";
      else if (password.length < 6)
        errors.password = "Password must be at least 6 characters";
    }
    if (formType === "signup" && !name) errors.name = "Full name is required";
    if (formType === "verify-otp" && !otp) errors.otp = "OTP is required";
    if (formType === "reset-password") {
      if (!otp) errors.otp = "OTP is required";
      if (!newPassword) errors.newPassword = "New password is required";
      else if (newPassword.length < 6)
        errors.newPassword = "New password must be at least 6 characters";
    }
    setFormErrors(errors);
    console.log("Form validation errors:", errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log("Sending login request:", { email, password });
      const response = await axios.post(`${API_URL}/login-user`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      onAuthSuccess();
      setEmail("");
      setPassword("");
      setSuccess("Login successful!");
      console.log("Authentication state set to true, calling onAuthSuccess");
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data,
        err.response?.status,
        err.message
      );
      const errorMessages = {
        "User does not exist": "No account found with this email.",
        "Invalid password": "Incorrect password. Please try again.",
        "Please verify your email first":
          "Please verify your email before logging in.",
      };
      setError(
        errorMessages[err.response?.data?.message] ||
          "Login failed. Please check your credentials or network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log("Sending signup request:", {
        username: name,
        email,
        password,
      });
      const response = await axios.post(`${API_URL}/register-user`, {
        username: name,
        email,
        password,
      });
      console.log("Signup response:", response.data);
      setEmail("");
      setName("");
      setPassword("");
      setSuccess(
        "Registration successful! Please verify OTP sent to your email."
      );
      setFormType("verify-otp");
    } catch (err) {
      console.error(
        "Signup error:",
        err.response?.data,
        err.response?.status,
        err.message
      );
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log("Sending OTP verification request:", { email, otp });
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });
      console.log("OTP verification response:", response.data);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      onAuthSuccess();
      setEmail("");
      setOtp("");
      setSuccess("OTP verified successfully!");
      console.log("Authentication state set to true, calling onAuthSuccess");
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "OTP verification error:",
        err.response?.data,
        err.response?.status,
        err.message
      );
      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log("Sending forgot password request:", { email });
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      console.log("Forgot password response:", response.data);
      setEmail("");
      setSuccess("Password reset OTP sent to your email.");
      setFormType("reset-password");
    } catch (err) {
      console.error(
        "Forgot password error:",
        err.response?.data,
        err.response?.status,
        err.message
      );
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log("Sending reset password request:", {
        email,
        otp,
        newPassword,
      });
      const response = await axios.post(`${API_URL}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      console.log("Reset password response:", response.data);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setSuccess("Password reset successfully! Please login.");
      setFormType("login");
    } catch (err) {
      console.error(
        "Reset password error:",
        err.response?.data,
        err.response?.status,
        err.message
      );
      setError(
        err.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setSuccess("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-green-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-md text-center">
            {success}
          </div>
        )}

        {isAuthenticated ? (
          <div className="text-center">
            <p className="text-lg text-gray-800 mb-6">
              Welcome! You are logged in.
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {formType === "login" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                  Login
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleLoginSubmit}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setFormType("signup")}
                      className="text-green-600 hover:underline font-medium"
                      disabled={loading}
                    >
                      Sign Up
                    </button>
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    Forgot password?{" "}
                    <button
                      type="button"
                      onClick={() => setFormType("forgot-password")}
                      className="text-green-600 hover:underline font-medium"
                      disabled={loading}
                    >
                      Reset Password
                    </button>
                  </p>
                </div>
              </>
            )}

            {formType === "signup" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                  Sign Up
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleSignupSubmit}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setFormType("login")}
                      className="text-green-600 hover:underline font-medium"
                      disabled={loading}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </>
            )}

            {formType === "verify-otp" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                  Verify OTP
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter OTP"
                      disabled={loading}
                    />
                    {formErrors.otp && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.otp}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleVerifyOtpSubmit}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Back to{" "}
                    <button
                      type="button"
                      onClick={() => setFormType("login")}
                      className="text-green-600 hover:underline font-medium"
                      disabled={loading}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </>
            )}

            {formType === "forgot-password" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                  Forgot Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleForgotPasswordSubmit}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Back to{" "}
                    <button
                      type="button"
                      onClick={() => setFormType("login")}
                      className="text-green-600 hover:underline font-medium"
                      disabled={loading}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </>
            )}

            {formType === "reset-password" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                  Reset Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter OTP"
                      disabled={loading}
                    />
                    {formErrors.otp && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.otp}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                    {formErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.newPassword}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleResetPasswordSubmit}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Back to{" "}
                    <button
                      type="button"
                      onClick={() => setFormType("login")}
                      className="text-green-600 hover:underline font-medium"
                      disabled={loading}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForms;
