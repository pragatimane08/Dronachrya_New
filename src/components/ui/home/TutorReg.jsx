import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../../api/repository/auth.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TutorReg = ({ onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    class: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState("form");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500";

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{6,}$/;

    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!emailRegex.test(formData.email.trim()))
      errors.email = "Enter a valid email.";
    if (!phoneRegex.test(formData.phone.trim()))
      errors.phone = "Enter a 10-digit mobile number.";
    if (!formData.class.trim()) errors.class = "Class is required.";
    if (!formData.subject.trim()) errors.subject = "Subjects are required.";
    if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be 6+ chars with uppercase, lowercase, digit & special char.";
    }

    return errors;
  };

  const handleChange = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      toast.warning("⚠ Please fix the highlighted fields.");
      return;
    }

    toast.info("⏳ Submitting registration...");
    setLoading(true);

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile_number: formData.phone.trim(),
      password: formData.password.trim(),
      role: "tutor",
      classes: [formData.class.trim()],
      subjects: formData.subject
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await authRepository.register(userData);
      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setStep("otp");
        toast.success("✅ OTP sent to your email and mobile.");
      } else {
        toast.warn(res.data.message || "⚠ Registration failed.");
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.message;
      console.error("Registration Error:", msg);
      if (status === 409) {
        toast.error("⚠ Email or mobile already exists.");
      } else {
        toast.error("❌ " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.warn("⚠ Please enter the OTP.");
      return;
    }

    toast.info("🔐 Verifying OTP...");
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

        toast.success("🎉 OTP verified successfully!", {
          autoClose: 2000,
          onClose: () => navigate("/location-form", { state: { token } }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-white w-[90%] max-w-md rounded border border-gray-300 p-6 shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="text-center text-lg font-semibold text-blue-900 mb-6">
              Tutor Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
                { label: "Email", name: "email", type: "email", placeholder: "tutor@example.com" },
                { label: "Mobile Number", name: "phone", type: "tel", placeholder: "9876543210", maxLength: 10 },
                { label: "Class", name: "class", type: "text", placeholder: "10" },
                { label: "Subjects", name: "subject", type: "text", placeholder: "Math, Science" },
                { label: "Password", name: "password", type: "password", placeholder: "Tutor@123" },
              ].map((input) => (
                <div key={input.name}>
                  <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                  <input
                    {...input}
                    value={formData[input.name]}
                    onChange={handleChange}
                    required
                    className={`${inputClass} ${formErrors[input.name] ? "border-red-500" : ""}`}
                  />
                  {formErrors[input.name] && (
                    <p className="text-red-500 text-xs mt-1">{formErrors[input.name]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
                >
                  {loading ? "Submitting..." : "Submit"}
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
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 6) {
                      setOtp(val);
                      if (val.length === 6 && otp.length < 6) {
                        toast.info("ℹ OTP entered. Click Verify.");
                      }
                    }
                  }}
                  placeholder="Enter OTP"
                  required
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
      </div>
    </div>
  );
};

export default TutorReg;
