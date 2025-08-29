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
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    const isMobile = /^[0-9]{10}$/.test(input.trim());
    const isEmail = /^\S+@\S+\.\S+$/.test(input.trim());

    if (!input.trim()) {
      newErrors.input = "Email or Mobile number is required.";
    } else if (!isMobile && !isEmail) {
      newErrors.input = "Enter a valid email or 10-digit mobile number.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Login handler
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const res = await authRepository.login({
        emailOrMobile: input.trim(),
        password: password.trim(),
      });

      const { token, user } = res.data;

      if (user.role !== role) {
        toast.error(
          `⚠️ You're trying to log in as a ${role}, but this account is registered as a ${user.role}.`
        );
        setLoading(false);
        return;
      }

      // Save token
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      // Store user info
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("user_id", user.id);

      toast.success("✅ Login successful!");

      // Navigate after short delay so toast is visible
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
                onClick={() => setRole(type)}
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
                Email / Mobile No
              </label>
              <input
                type="text"
                placeholder="Email or Mobile"
                className={`w-full border px-3 py-2 rounded outline-none focus:ring ${
                  errors.input ? "border-red-500" : "focus:ring-[#35BAA3]"
                }`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
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

            {/* Remember me & Forgot */}
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

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
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
