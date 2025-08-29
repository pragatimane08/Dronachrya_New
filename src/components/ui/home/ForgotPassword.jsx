import React, { useState } from "react";
import { authRepository } from "../../../api/repository/auth.repository";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [step, setStep] = useState("forgot"); // "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Forgot Password (Send OTP)
  const handleForgot = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await authRepository.forgotPassword({ email: email.trim() });
      toast.success(res.data?.message || "OTP sent to your email!");
      setStep("reset");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Reset Password
  const handleReset = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      toast.error("Enter OTP and new password.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must include uppercase, lowercase, number, special character and be at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await authRepository.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword.trim(),
      });
      toast.success(res.data?.message || "Password reset successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login"); // ✅ Redirect after success
      }, 2000);

      setStep("forgot");
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          {step === "forgot" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">
                Forgot Password
              </h2>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleForgot}
                disabled={loading}
                className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">
                Reset Password
              </h2>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full border px-3 py-2 rounded mb-2 outline-none focus:ring focus:ring-[#35BAA3]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500 mb-4">
                Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 6+ characters long.
              </p>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                onClick={() => setStep("forgot")}
                className="w-full py-2 mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition"
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
