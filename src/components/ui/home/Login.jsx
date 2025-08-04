import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../../api/repository/auth.repository"; // 👈 Adjust path as needed

export default function LoginForm({ isOpen, onClose }) {
  const [role, setRole] = useState("student");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const navigate = useNavigate();
  const isMobile = /^[0-9]{10}$/.test(input.trim());
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!input.trim()) {
      newErrors.input = "Email or Mobile number is required.";
    } else if (!isMobile && !/^\S+@\S+\.\S+$/.test(input.trim())) {
      newErrors.input = "Enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password.trim())) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, symbol and be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
  if (!validate()) return;

  setLoading(true);
  setServerError("");

  try {
    const res = await authRepository.login({
      emailOrMobile: input.trim(),
      password: password.trim(),
    });

    const { token, user } = res.data;

    // ✅ Check role match
    if (user.role !== role) {
      setServerError(`You're trying to log in as a ${role}, but this account is registered as a ${user.role}.`);
      setLoading(false);
      return;
    }

    // ✅ Save token based on rememberMe
    if (rememberMe) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }

    // ✅ Store user info
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
    localStorage.setItem("user_id", user.id);

    alert("Login successful!");
    onClose();

    // ✅ Navigate based on role
    if (role === "tutor") {
      navigate("/tutor-dashboard");
    } else {
      navigate("/student-dashboard", {
        state: { role: "student" },
      });
    }
  } catch (err) {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Login failed. Please check your credentials.";
    setServerError(msg);
  } finally {
    setLoading(false);
  }
};



  const handleForgotPassword = async () => {
    const emailOnly = input.trim();

    if (!/^\S+@\S+\.\S+$/.test(emailOnly)) {
      setErrors({ input: "Enter a valid email for password reset." });
      return;
    }

    try {
      await authRepository.forgotPassword({ emailOrMobile: emailOnly });
      setForgotSent(true);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send reset link. Try again.";
      setServerError(msg);
    }
  };

  const handleCancel = () => {
    setInput("");
    setPassword("");
    setRememberMe(false);
    setErrors({});
    setServerError("");
    setForgotSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white border border-[#35BAA3] rounded-xl p-6 space-y-4 relative w-full max-w-md">
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
        >
          &times;
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
              className={`px-4 py-1 rounded-full border font-medium capitalize ${role === type
                  ? "bg-[#35BAA3] text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {serverError && (
          <div className="text-red-500 text-sm text-center">{serverError}</div>
        )}
        {forgotSent && (
          <div className="text-green-600 text-sm text-center">
            Reset link sent to your email!
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
              className={`w-full border px-3 py-2 rounded outline-none focus:ring ${errors.input ? "border-red-500" : "focus:ring-[#35BAA3]"
                }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {errors.input && (
              <div className="text-red-500 text-sm mt-1">{errors.input}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full border px-3 py-2 rounded outline-none focus:ring ${errors.password ? "border-red-500" : "focus:ring-[#35BAA3]"
                }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            )}
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
              onClick={handleForgotPassword}
              className="hover:underline text-sm text-[#0E2D63]"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Sign up link */}
          <div className="text-center text-sm">
            New User?{" "}
            <a href="/register" className="text-[#35BAA3] hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}