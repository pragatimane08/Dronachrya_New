import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { apiUtl, apiUrl } from "../../../../api/apiUtl";

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must be at least 2 characters and only contain letters.";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!mobileRegex.test(formData.mobile_number)) {
      newErrors.mobile_number = "Mobile number must be 10 digits.";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must have 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be 8+ characters.";
    }

    setErrors(newErrors);

    // Show toasts for all errors
    Object.values(newErrors).forEach((msg) => toast.error(msg));

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${apiUtl.baseUrl}${apiUrl.auth.register}`,
        formData
      );

      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setShowOtpForm(true);
        toast.success("✅ Registration successful! Please verify OTP.");
      } else {
        toast.error("⚠️ User ID not returned. Please contact support.");
      }
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || "Registration failed"}`);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    try {
      await axios.post(`${apiUtl.baseUrl}${apiUrl.auth.verifyOtp}`, {
        user_id: userId,
        otp: otp,
      });

      toast.success("🎉 OTP Verified Successfully!");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || "OTP verification failed"}`);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {!showOtpForm ? (
          <>
            <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
              Admin Registration
            </h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.mobile_number && (
                  <p className="text-sm text-red-500">{errors.mobile_number}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center text-blue-900 mb-6">
              Verify OTP
            </h2>
            <form className="space-y-4" onSubmit={handleOtpVerify}>
              <div>
                <label className="block text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
                >
                  Verify
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRegistration;
