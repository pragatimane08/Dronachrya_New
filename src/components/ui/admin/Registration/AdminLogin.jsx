import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUtl } from "../../../../api/apiUtl";

const AdminLogin = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    if (!emailOrMobile.trim()) {
      formErrors.emailOrMobile = "Email or Mobile number is required";
    }
    if (!password.trim()) {
      formErrors.password = "Password is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const loginPayload = {
        emailOrMobile,
        password,
      };

      const response = await axios.post(
        `${apiUtl.baseUrl}/auth/login`,
        loginPayload
      );

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token && user) {
        if (user.role !== "admin") {
          toast.error("Access denied. Only admins can login here.");
          return;
        }

        // Save token
        if (rememberMe) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }

        // Save user info
        localStorage.setItem("user_id", user?.user_id || "");
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1000);
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-10 pt-12 rounded-lg shadow-md w-full max-w-md border relative">
        {/* Cancel (close) button */}
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
          Login to Your Admin Account
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email / Mobile input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email / Mobile No
            </label>
            <input
              type="text"
              placeholder="Email Address or Mobile Number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                errors.emailOrMobile ? "border-red-500" : ""
              }`}
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
            />
            {errors.emailOrMobile && (
              <p className="text-red-500 text-sm mt-1">{errors.emailOrMobile}</p>
            )}
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                errors.password ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember me & forgot password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="accent-teal-500 h-4 w-4 mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="text-sm font-semibold">Remember Me</span>
            </label>
            <button
              type="button"
              className="text-sm text-black font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-medium"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
