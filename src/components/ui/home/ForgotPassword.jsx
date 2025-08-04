import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../api/services/auth.service";

const ForgotPassword = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!emailOrMobile.trim()) {
      setError("Email or Mobile number is required");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(emailOrMobile.trim());
      setMessage("OTP sent to your email/mobile");
      setStep(2);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(emailOrMobile.trim(), otp.trim());
      setMessage("OTP verified successfully");
      setStep(3);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(
        emailOrMobile.trim(),
        newPassword.trim(),
        otp.trim()
      );
      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-[#35BAA3]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#35BAA3]">
            Reset Your Password
          </h2>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email / Mobile Number
                </label>
                <input
                  type="text"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className="mt-1 block w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-[#35BAA3]/30 focus:border-[#35BAA3]"
                  placeholder="Enter your email or mobile number"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#35BAA3] hover:bg-[#2a9d8a]"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-[#35BAA3]/30 focus:border-[#35BAA3]"
                  placeholder="Enter OTP sent to your email/mobile"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#35BAA3] hover:bg-[#2a9d8a]"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-[#35BAA3]/30 focus:border-[#35BAA3]"
                  placeholder="Enter your new password"
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#35BAA3] hover:bg-[#2a9d8a]"
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-[#35BAA3] hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;