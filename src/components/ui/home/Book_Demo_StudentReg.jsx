import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { authRepository } from "../../../api/repository/auth.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Book_Demo_StudentReg = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ From BookDemoReg
  const tempStudentId = location.state?.temp_student_id || null;
  const prefilledData = location.state?.prefilledData || null;

  const [formData, setFormData] = useState({
    name: prefilledData?.name || "",
    class: prefilledData?.class || "",
    subject: prefilledData?.subjects?.join(", ") || "",
    email: prefilledData?.email || "",
    phone: prefilledData?.mobile_number || "",
    password: prefilledData?.password || "",
  });

  const [step, setStep] = useState("form");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full border rounded px-3 py-2 mt-1";

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  /** Handle Signup - Skip form validation since data already validated */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // const userData = {
    //   name: formData.name.trim(),
    //   email: formData.email.trim(),
    //   mobile_number: formData.phone.trim(),
    //   password: formData.password.trim(),
    //   role: "student",
    //   ...(tempStudentId && { temp_student_id: tempStudentId }), // ✅ link pre-register
    // };

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile_number: formData.phone.trim(),
      password: formData.password.trim(),
      role: "student",
      class_modes: prefilledData?.class_modes || [],  // ✅ include this
      ...(tempStudentId && { temp_student_id: tempStudentId }),
    };


    try {
      const res = await authRepository.register(userData);
      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setStep("otp");
        toast.success("✅ OTP sent to your email and mobile.");
      } else {
        toast.error(res.data.message || "⚠ Registration failed.");
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.message;
      if (status === 409) {
        toast.warn("⚠ Email or mobile already exists.");
      } else {
        toast.error("❌ Error: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /** Handle OTP Verification */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.warning("⚠ Please enter the OTP.");
      return;
    }

    if (otp.length < 6) {
      toast.info("ℹ OTP must be 6 digits.");
      return;
    }

    toast.info("🔍 Verifying OTP...");
    setLoading(true);

    try {
      const res = await authRepository.verifyOtp({
        user_id: userId,
        otp: otp.trim(),
      });

      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        localStorage.setItem("user_id", user.id);

        toast.success("✅ OTP verified successfully!", {
          autoClose: 1500,
          onClose: () => navigate("/student-dashboard"),
        });
      } else {
        toast.error("⚠ OTP verification failed.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "❌ Invalid or expired OTP.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30"
      onClick={handleClose}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded border border-gray-300 p-6 shadow-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="text-center text-lg font-semibold text-blue-900 mb-6">
              Student Registration - Confirm Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* All fields are now read-only and prefilled */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <input
                  type="text"
                  value={formData.class}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjects
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value="••••••••"
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>Note:</strong> These details were collected in the previous step. Please review and confirm to proceed with registration.</p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
                >
                  {loading ? "Registering..." : "Confirm & Register"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-center text-lg font-semibold text-blue-900 mb-6">
              OTP Verification
            </h2>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className={`${inputClass} bg-gray-100`}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  maxLength={6}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          </>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default Book_Demo_StudentReg;