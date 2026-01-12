import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearMessages, getAuthUser } from "../userSlice";
const logo = "/components_logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, user } = useSelector((state) => state.user);

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";
    // Removed strict password validation for debugging
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(clearMessages());

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      setEmail("");
      setPassword("");

      // Verify auth status with backend BEFORE redirecting
      console.log("[LOGIN] Verifying auth with backend...");
      try {
        await dispatch(getAuthUser()).unwrap();
        console.log("[LOGIN] Auth verified successfully");
      } catch (authErr) {
        console.error("[LOGIN] Auth verification failed:", authErr);
        // Don't redirect if auth verification fails
        throw new Error("Auth verification failed");
      }

      // Always redirect to /admin/dashboard after successful login
      console.log("[LOGIN] Redirecting to /admin/dashboard");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("[LOGIN] Login error:", err);
      // Error is already handled by Redux and displayed in the UI
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-green-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>
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
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
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
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
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
              onClick={() => navigate("/forgot-password")}
              className="text-green-600 hover:underline font-medium"
              disabled={loading}
            >
              Reset Password
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
