import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp, clearMessages } from "../userSlice";
const logo = "/components_logo.png";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.user);

  const validateForm = () => {
    const errors = {};
    if (!otp) errors.otp = "OTP is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(clearMessages());
    const result = await dispatch(verifyOtp(otp));
    if (verifyOtp.fulfilled.match(result)) {
      setOtp("");
      navigate("/dashboard");
    }
  };

  const handleResend = async () => {
    dispatch(clearMessages());
    await dispatch(resendOtp());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-green-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Verify OTP
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
              <p className="text-red-500 text-sm mt-1">{formErrors.otp}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="text-center text-sm text-gray-600">
            Didn't receive OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-green-600 hover:underline font-medium"
              disabled={loading}
            >
              Resend OTP
            </button>
          </p>
          <p className="text-center text-sm text-gray-600">
            Back to{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline font-medium"
              disabled={loading}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
