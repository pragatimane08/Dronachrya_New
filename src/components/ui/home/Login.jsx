import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../../api/repository/auth.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react"; // Cross Icon

export default function Login() {
  const [role, setRole] = useState("student");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(""); // store user_id from sendOtp response
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    const isMobile = /^[0-9]{10}$/.test(input.trim());
    const isEmail = /^\S+@\S+\.\S+$/.test(input.trim());

    if (!input.trim()) {
      newErrors.input =
        role === "student"
          ? "Mobile number is required."
          : "Email or Mobile number is required.";
    } else if (role === "student" && !isMobile) {
      newErrors.input = "Enter a valid 10-digit mobile number.";
    } else if (role === "tutor" && !isMobile && !isEmail) {
      newErrors.input = "Enter a valid email or 10-digit mobile number.";
    }

    if (role === "tutor") {
      if (!password.trim()) {
        newErrors.password = "Password is required.";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }
    }

    if (role === "student" && otpSent && !otp.trim()) {
      newErrors.otp = "OTP is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Send OTP for student
  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(input.trim())) {
      toast.error("❌ Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      setLoading(true);
      const res = await authRepository.sendOtp({ emailOrMobile: input.trim() });
      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setOtpSent(true);
        toast.success("✅ OTP sent successfully!");
      } else {
        toast.error("❌ Failed to send OTP. Try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "❌ Failed to send OTP.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login handler
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      let res;
      if (role === "student") {
        // 🔹 Student login via OTP
        res = await authRepository.verifyOtp({
          user_id: userId,
          otp: otp.trim(),
        });
      } else {
        // 🔹 Tutor login via password
        res = await authRepository.login({
          emailOrMobile: input.trim(),
          password: password.trim(),
          role: "tutor",
        });
      }

      const { token, user } = res.data;

      if (!token) {
        toast.error("❌ Login failed. Invalid response from server.");
        setLoading(false);
        return;
      }

      // 🔹 Role mismatch check
      if (role === "student" && user?.role === "tutor") {
        toast.error("❌ This account is registered as a Tutor. Please login as Tutor.");
        setLoading(false);
        return;
      }

      // Save token
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      // Save minimal user object
      localStorage.setItem("user", JSON.stringify(user || { role }));
      localStorage.setItem("role", role);

      toast.success("✅ Login successful!");

      setTimeout(() => {
        if (role === "tutor") {
          navigate("/tutor-dashboard");
        } else {
          navigate("/student-dashboard", { state: { role: "student" } });
        }
      }, 1200);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "❌ Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="relative bg-white border border-[#35BAA3] rounded-xl p-6 space-y-4 w-full max-w-md shadow">
          {/* ❌ Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-black text-center text-xl font-bold mb-4">
            LOGIN TO YOUR ACCOUNT
          </h2>

          {/* Role Switch */}
          <div className="flex justify-center space-x-4 mb-2">
            {["student", "tutor"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setRole(type);
                  setOtpSent(false);
                  setOtp("");
                  setPassword("");
                }}
                className={`px-4 py-1 rounded-full border font-medium capitalize ${
                  role === type
                    ? "bg-[#35BAA3] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Inline Errors */}
          {Object.values(errors).length > 0 && (
            <div className="text-red-500 text-sm text-center mb-2">
              {Object.values(errors).map((errMsg, i) => (
                <div key={i}>{errMsg}</div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {/* Email/Mobile */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                {role === "student" ? "Mobile No" : "Email / Mobile No"}
              </label>
              <input
                type="text"
                maxLength={role === "student" ? 10 : undefined}
                placeholder={
                  role === "student" ? "Enter Mobile Number" : "Email or Mobile"
                }
                className={`w-full border px-3 py-2 rounded outline-none focus:ring ${
                  errors.input ? "border-red-500" : "focus:ring-[#35BAA3]"
                }`}
                value={input}
                onChange={(e) =>
                  setInput(
                    role === "student"
                      ? e.target.value.replace(/\D/g, "")
                      : e.target.value
                  )
                }
              />
            </div>

            {/* Tutor Password Field */}
            {role === "tutor" && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={`w-full border px-3 py-2 rounded outline-none focus:ring ${
                    errors.password ? "border-red-500" : "focus:ring-[#35BAA3]"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {/* Remember Me + Send OTP row */}
            {role === "student" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-[#35BAA3]"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || otpSent}
                  className="px-3 py-1 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
                >
                  {otpSent ? "OTP Sent" : "Send OTP"}
                </button>
              </div>
            )}

            {role === "tutor" && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-[#35BAA3]"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="hover:underline text-sm text-[#0E2D63]"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Student OTP Field */}
            {role === "student" && otpSent && (
              <div>
                <label className="block mb-1 text-sm font-medium">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className={`w-full border px-3 py-2 rounded outline-none focus:ring ${
                    errors.otp ? "border-red-500" : "focus:ring-[#35BAA3]"
                  }`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || (role === "student" && !otpSent)}
              className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
            >
              {loading ? "Processing..." : "Login"}
            </button>

            {/* Sign up link */}
            <div className="text-center text-sm">
              New User?{" "}
              <button
                type="button"
                onClick={() =>
                  navigate(role === "tutor" ? "/tutorreg" : "/studentreg")
                }
                className="text-[#35BAA3] hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
