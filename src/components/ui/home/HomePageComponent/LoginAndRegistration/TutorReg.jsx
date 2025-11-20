

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { X, Eye, EyeOff, AlertCircle, CheckCircle2, Info } from "lucide-react";
// import { authRepository } from "../../../../../api/repository/auth.repository";
// import FormLayout from "../../layout/FormLayout";

// const TutorReg = ({ onClose }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const fromLookingToTeach = location.state?.fromLookingToTeach || false;

//   const handleClose = () => {
//     if (onClose) {
//       onClose();
//     } else if (fromLookingToTeach) {
//       navigate("/#looking-to-teach");
//     } else {
//       navigate("/");
//     }
//   };

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     class: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [step, setStep] = useState("form");
//   const [userId, setUserId] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [inlineMessage, setInlineMessage] = useState(null);
//   const [otpTimer, setOtpTimer] = useState(30);

//   // OTP timer
//   useEffect(() => {
//     let interval;
//     if (step === "otp" && otpTimer > 0) {
//       interval = setInterval(() => {
//         setOtpTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [step, otpTimer]);

//   const inputClass =
//     "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#35BAA3]";

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateFields = () => {
//     const errors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[0-9]{10}$/;
//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{6,}$/;
//     const nameRegex = /^[A-Za-z\s]+$/;

//     if (!formData.name.trim()) errors.name = "Full name is required.";
//     else if (!nameRegex.test(formData.name.trim()))
//       errors.name = "Name cannot contain numbers or special characters.";

//     if (!emailRegex.test(formData.email.trim()))
//       errors.email = "Enter a valid email.";
//     if (!phoneRegex.test(formData.phone.trim()))
//       errors.phone = "Enter a 10-digit mobile number.";
//     if (!formData.class.trim()) errors.class = "Class is required.";
//     if (!formData.subject.trim()) errors.subject = "Subjects are required.";
//     if (!passwordRegex.test(formData.password)) {
//       errors.password =
//         "Password must be 6+ chars with uppercase, lowercase, digit & special char.";
//     }
//     if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = "Passwords do not match.";
//     }
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setInlineMessage(null);

//     const errors = validateFields();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       setInlineMessage({ type: "error", text: "Please fix the highlighted errors." });
//       return;
//     }

//     const userData = {
//       name: formData.name,
//       email: formData.email,
//       mobile_number: formData.phone,
//       password: formData.password,
//       role: "tutor",
//       classes: [formData.class.trim()],
//       subjects: formData.subject.split(",").map((s) => s.trim()),
//     };

//     try {
//       const res = await authRepository.register(userData);

//       if (res.data?.user_id) {
//         setUserId(res.data.user_id);
//         setStep("otp");
//         setInlineMessage({ type: "success", text: "OTP sent! Please verify your account." });
//       }
//     } catch (error) {
//       if (error.response?.status === 409) {
//         const message = error.response.data.message;
//         if (message.includes("not verified")) {
//           setUserId(error.response.data.user_id);
//           setStep("otp");
//           setInlineMessage({
//             type: "info",
//             text: "Your account exists but is not verified. A new OTP has been sent.",
//           });
//         } else {
//           setInlineMessage({
//             type: "error",
//             text: "This email or mobile is already registered. Please log in instead.",
//           });
//         }
//       } else {
//         setInlineMessage({
//           type: "error",
//           text: "Registration failed. Please try again later.",
//         });
//       }
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setInlineMessage(null);

//     if (!otp.trim()) {
//       setInlineMessage({ type: "warning", text: "Please enter the OTP." });
//       return;
//     }

//     setLoading(true);
//     setInlineMessage({ type: "info", text: "Verifying OTP..." });

//     try {
//       const res = await authRepository.tutorVerifyOtp({
//         user_id: userId,
//         otp: otp.trim(),
//       });

//       if (res.data?.token) {
//         const { token: authToken, user: authUser } = res.data;
//         localStorage.setItem("authToken", authToken);
//         localStorage.setItem("user", JSON.stringify(authUser));
//         localStorage.setItem("role", authUser.role);
//         localStorage.setItem("user_id", authUser.id);

//         setInlineMessage({
//           type: "success",
//           text: "Tutor registered successfully! Redirecting...",
//         });

//         setTimeout(() => {
//           navigate("/tutor_referral_code", { state: { token: authToken } });
//         }, 1500);
//       } else {
//         setInlineMessage({ type: "error", text: "OTP verification failed." });
//       }
//     } catch (error) {
//       const msg = error.response?.data?.message || "Invalid or expired OTP.";
//       setInlineMessage({ type: "error", text: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       if (!userId) {
//         setInlineMessage({
//           type: "error",
//           text: "User ID missing. Please register again.",
//         });
//         return;
//       }
//       await authRepository.resendOtp({ user_id: userId });
//       setOtpTimer(30);
//       setInlineMessage({ type: "success", text: "A new OTP has been sent!" });
//     } catch (error) {
//       const msg = error.response?.data?.message || "Failed to resend OTP. Try again later.";
//       setInlineMessage({ type: "error", text: msg });
//     }
//   };

//   return (
//     <FormLayout>
//       <button
//         onClick={handleClose}
//         className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//       >
//         <X size={20} />
//       </button>

//       <h2 className="text-center text-xl font-bold text-[#0E2D63] mb-4">
//         {step === "form" ? "Tutor Registration" : "OTP Verification"}
//       </h2>

//       {/* Inline Message */}
//       {inlineMessage && (
//         <div
//           className={`flex items-center gap-2 px-3 py-2 rounded text-sm mb-3 ${
//             inlineMessage.type === "error"
//               ? "bg-red-100 text-red-700 border border-red-300"
//               : inlineMessage.type === "success"
//               ? "bg-green-100 text-green-700 border border-green-300"
//               : inlineMessage.type === "warning"
//               ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//               : "bg-blue-100 text-blue-700 border border-blue-300"
//           }`}
//         >
//           {inlineMessage.type === "error" ? (
//             <AlertCircle size={18} />
//           ) : inlineMessage.type === "success" ? (
//             <CheckCircle2 size={18} />
//           ) : (
//             <Info size={18} />
//           )}
//           <span>{inlineMessage.text}</span>
//           <button
//             onClick={() => setInlineMessage(null)}
//             className="ml-auto text-gray-500 hover:text-gray-700"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {step === "form" ? (
//         <form onSubmit={handleSubmit} className="space-y-3">
//           {[
//             { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
//             { label: "Email", name: "email", type: "email", placeholder: "tutor@example.com" },
//             { label: "Mobile Number", name: "phone", type: "tel", placeholder: "9876543210" },
//             { label: "Class", name: "class", type: "text", placeholder: "10" },
//             { label: "Subjects", name: "subject", type: "text", placeholder: "Math, Science" },
//           ].map((input) => (
//             <div key={input.name}>
//               <label className="block text-xs font-medium text-gray-700">{input.label}</label>
//               <input
//                 {...input}
//                 value={formData[input.name]}
//                 onChange={handleChange}
//                 required
//                 className={`${inputClass} ${
//                   formErrors[input.name] ? "border-red-500" : ""
//                 }`}
//               />
//               {formErrors[input.name] && (
//                 <p className="text-red-500 text-xs mt-1">{formErrors[input.name]}</p>
//               )}
//             </div>
//           ))}

//           {/* Password */}
//           <div className="relative">
//             <label className="block text-xs font-medium text-gray-700">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Tutor@123"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className={`${inputClass} ${formErrors.password ? "border-red-500" : ""}`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <label className="block text-xs font-medium text-gray-700">Confirm Password</label>
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className={`${inputClass} ${
//                 formErrors.confirmPassword ? "border-red-500" : ""
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           <div className="flex justify-center gap-3 pt-3">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="bg-gray-300 hover:bg-gray-400 px-3 py-1.5 rounded text-xs"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-[#35BAA3] hover:bg-[#2fa28e] text-white px-3 py-1.5 rounded text-xs disabled:opacity-50"
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       ) : (
//         <form onSubmit={handleVerifyOTP} className="space-y-3">
//           <div>
//             <label className="block text-xs font-medium text-gray-700">Registered Email</label>
//             <input
//               type="email"
//               value={formData.email}
//               className={`${inputClass} bg-gray-100`}
//               readOnly
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-gray-700">Enter OTP</label>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => e.target.value.length <= 6 && setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               required
//               className={inputClass}
//             />
//           </div>

//           {/* Resend OTP */}
//           <div className="flex items-center justify-between text-xs text-gray-600">
//             {otpTimer > 0 ? (
//               <span>Resend OTP in {otpTimer}s</span>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResendOTP}
//                 className="text-[#35BAA3] hover:underline"
//               >
//                 Resend OTP
//               </button>
//             )}
//           </div>

//           <div className="flex justify-center gap-3 pt-3">
//             <button
//               type="button"
//               onClick={() => setStep("form")}
//               className="bg-gray-300 hover:bg-gray-400 px-3 py-1.5 rounded text-xs"
//             >
//               Back
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-[#35BAA3] hover:bg-[#2fa28e] text-white px-3 py-1.5 rounded text-xs disabled:opacity-50"
//             >
//               {loading ? "Verifying..." : "Verify"}
//             </button>
//           </div>
//         </form>
//       )}
//     </FormLayout>
//   );
// };

// export default TutorReg;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Eye, EyeOff, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { authRepository } from "../../../../../api/repository/auth.repository";
import FormLayout from "../../layout/FormLayout";

const TutorReg = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLookingToTeach = location.state?.fromLookingToTeach || false;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (fromLookingToTeach) {
      navigate("/#looking-to-teach");
    } else {
      navigate("/");
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    class: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState("form");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inlineMessage, setInlineMessage] = useState(null);
  const [otpTimer, setOtpTimer] = useState(30);

  // OTP timer
  useEffect(() => {
    let interval;
    if (step === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const inputClass =
    "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#35BAA3]";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{6,}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!formData.name.trim()) errors.name = "Full name is required.";
    else if (!nameRegex.test(formData.name.trim()))
      errors.name = "Name cannot contain numbers or special characters.";

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
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineMessage(null);

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setInlineMessage({ type: "error", text: "Please fix the highlighted errors." });
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      mobile_number: formData.phone,
      password: formData.password,
      role: "tutor",
      classes: [formData.class.trim()],
      subjects: formData.subject.split(",").map((s) => s.trim()),
    };

    try {
      const res = await authRepository.register(userData);

      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setStep("otp");
        setInlineMessage({ type: "success", text: "OTP sent! Please verify your account." });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        const message = error.response.data.message;
        if (message.includes("not verified")) {
          setUserId(error.response.data.user_id);
          setStep("otp");
          setInlineMessage({
            type: "info",
            text: "Your account exists but is not verified. A new OTP has been sent.",
          });
        } else {
          setInlineMessage({
            type: "error",
            text: "This email or mobile is already registered. Please log in instead.",
          });
        }
      } else {
        setInlineMessage({
          type: "error",
          text: "Registration failed. Please try again later.",
        });
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setInlineMessage(null);

    if (!otp.trim()) {
      setInlineMessage({ type: "warning", text: "Please enter the OTP." });
      return;
    }

    setLoading(true);
    setInlineMessage({ type: "info", text: "Verifying OTP..." });

    try {
      const res = await authRepository.tutorVerifyOtp({
        user_id: userId,
        otp: otp.trim(),
      });

      if (res.data?.token) {
        const { token: authToken, user: authUser } = res.data;
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("user", JSON.stringify(authUser));
        localStorage.setItem("role", authUser.role);
        localStorage.setItem("user_id", authUser.id);

        setInlineMessage({
          type: "success",
          text: "Tutor registered successfully! Redirecting...",
        });

        setTimeout(() => {
          navigate("/tutor_referral_code", { state: { token: authToken } });
        }, 1500);
      } else {
        setInlineMessage({ type: "error", text: "OTP verification failed." });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid or expired OTP.";
      setInlineMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (!userId) {
        setInlineMessage({
          type: "error",
          text: "User ID missing. Please register again.",
        });
        return;
      }
      await authRepository.resendOtp({ user_id: userId });
      setOtpTimer(30);
      setInlineMessage({ type: "success", text: "A new OTP has been sent!" });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to resend OTP. Try again later.";
      setInlineMessage({ type: "error", text: msg });
    }
  };

  return (
    <FormLayout>
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h2 className="text-center text-xl font-bold text-[#0E2D63] mb-4">
        {step === "form" ? "Tutor Registration" : "OTP Verification"}
      </h2>

      {/* Inline Message */}
      {inlineMessage && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm mb-3 ${
            inlineMessage.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : inlineMessage.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : inlineMessage.type === "warning"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}
        >
          {inlineMessage.type === "error" ? (
            <AlertCircle size={18} />
          ) : inlineMessage.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{inlineMessage.text}</span>
          <button
            onClick={() => setInlineMessage(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {step === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
            { label: "Email", name: "email", type: "email", placeholder: "tutor@example.com" },
            { label: "Mobile Number", name: "phone", type: "tel", placeholder: "9876543210" },
            { label: "Class", name: "class", type: "text", placeholder: "10" },
            { label: "Subjects", name: "subject", type: "text", placeholder: "Math, Science" },
          ].map((input) => (
            <div key={input.name}>
              <label className="block text-xs font-medium text-gray-700">{input.label}</label>
              <input
                {...input}
                value={formData[input.name]}
                onChange={handleChange}
                required
                className={`${inputClass} ${
                  formErrors[input.name] ? "border-red-500" : ""
                }`}
              />
              {formErrors[input.name] && (
                <p className="text-red-500 text-xs mt-1">{formErrors[input.name]}</p>
              )}
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Tutor@123"
              value={formData.password}
              onChange={handleChange}
              required
              className={`${inputClass} ${formErrors.password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`${inputClass} ${
                formErrors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1.5 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#35BAA3] hover:bg-[#2fa28e] text-white px-3 py-1.5 rounded text-xs disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Registered Email</label>
            <input
              type="email"
              value={formData.email}
              className={`${inputClass} bg-gray-100`}
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => e.target.value.length <= 6 && setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className={inputClass}
            />
          </div>

          {/* Resend OTP */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            {otpTimer > 0 ? (
              <span>Resend OTP in {otpTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-[#35BAA3] hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1.5 rounded text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#35BAA3] hover:bg-[#2fa28e] text-white px-3 py-1.5 rounded text-xs disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      )}
    </FormLayout>
  );
};

export default TutorReg;


