// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { authRepository } from "../../../../../api/repository/auth.repository";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { X, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
// import FormLayout from '../../layout/FormLayout';

// export default function Login() {
//   const [role, setRole] = useState("student");
//   const [input, setInput] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [inlineMessage, setInlineMessage] = useState(null);
//   const [resendTimer, setResendTimer] = useState(0);

//   const navigate = useNavigate();

//   // Countdown timer for OTP resend
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // Validation function
//   const validate = () => {
//     const newErrors = {};
//     const isMobile = /^[0-9]{10}$/.test(input.trim());
//     const isEmail = /^\S+@\S+\.\S+$/.test(input.trim());

//     if (!input.trim()) {
//       newErrors.input =
//         role === "student"
//           ? "Mobile number is required."
//           : "Email or Mobile number is required.";
//     } else if (role === "student" && !isMobile) {
//       newErrors.input = "Enter a valid 10-digit mobile number.";
//     } else if (role === "tutor" && !isMobile && !isEmail) {
//       newErrors.input = "Enter a valid email or 10-digit mobile number.";
//     }

//     if (role === "tutor") {
//       if (!password.trim()) newErrors.password = "Password is required.";
//       else if (password.length < 6)
//         newErrors.password = "Password must be at least 6 characters.";
//     }

//     if (role === "student" && otpSent && !otp.trim()) {
//       newErrors.otp = "OTP is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Send OTP for student
//   const handleSendOtp = async () => {
//     if (!/^[0-9]{10}$/.test(input.trim())) {
//       setInlineMessage({ type: "error", text: "Enter a valid 10-digit mobile number." });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await authRepository.sendOtp({ emailOrMobile: input.trim() });

//       if (res.data?.user_id) {
//         setUserId(res.data.user_id);
//         setOtpSent(true);
//         setResendTimer(30);
//         setInlineMessage({ type: "success", text: "OTP sent successfully!" });
//       } else {
//         setInlineMessage({ type: "error", text: "Failed to send OTP. Try again." });
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to send OTP.";
//       setInlineMessage({ type: "error", text: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend OTP
//   const handleResendOtp = async () => {
//     if (!input.trim()) {
//       setInlineMessage({ type: "error", text: "No user found. Please request OTP again." });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await authRepository.resendLoginOtp({ emailOrMobile: input.trim() });

//       if (res.data?.user_id) {
//         setResendTimer(30);
//         setInlineMessage({ type: "success", text: "OTP resent successfully!" });
//       } else {
//         setInlineMessage({ type: "error", text: "Failed to resend OTP. Try again." });
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to resend OTP.";
//       setInlineMessage({ type: "error", text: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login handler
//   const handleLogin = async () => {
//     if (!validate()) return;

//     setLoading(true);
//     setErrors({});

//     try {
//       let res;
//       if (role === "student") {
//         res = await authRepository.verifyOtp({ user_id: userId, otp: otp.trim() });
//       } else {
//         res = await authRepository.login({
//           emailOrMobile: input.trim(),
//           password: password.trim(),
//           role: "tutor",
//         });
//       }

//       const { token, user } = res.data;

//       if (!token) {
//         setInlineMessage({ type: "error", text: "Login failed. Invalid response from server." });
//         setLoading(false);
//         return;
//       }

//       if (rememberMe) localStorage.setItem("authToken", token);
//       else sessionStorage.setItem("authToken", token);

//       localStorage.setItem("user", JSON.stringify(user || { role }));
//       localStorage.setItem("role", role);

//       setInlineMessage({ type: "success", text: "Login successful!" });

//       setTimeout(() => {
//         navigate(role === "tutor" ? "/tutor-dashboard" : "/student-dashboard");
//       }, 1000);
//     } catch (err) {
//       const msg = err.response?.data?.message || "Login failed. Check your credentials.";
//       setInlineMessage({ type: "error", text: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormLayout>
//       <ToastContainer position="top-right" autoClose={2000} />
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="relative bg-white border border-[#35BAA3] rounded-xl p-6 space-y-4 w-full max-w-md shadow">
//           <button onClick={() => navigate("/")} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>

//           <h2 className="text-black text-center text-xl font-bold mb-4">LOGIN TO YOUR ACCOUNT</h2>

//           {/* Inline feedback */}
//           {inlineMessage && (
//             <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm mb-3 ${inlineMessage.type === "error"
//                 ? "bg-red-100 text-red-700 border border-red-300"
//                 : "bg-green-100 text-green-700 border border-green-300"
//               }`}>
//               {inlineMessage.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
//               <span>{inlineMessage.text}</span>
//               <button onClick={() => setInlineMessage(null)} className="ml-auto text-gray-500 hover:text-gray-700">
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           {/* Role Switch */}
//           <div className="flex justify-center space-x-4 mb-2">
//             {["student", "tutor"].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => {
//                   setRole(type);
//                   setOtpSent(false);
//                   setOtp("");
//                   setPassword("");
//                   setInlineMessage(null);
//                   setErrors({});
//                 }}
//                 className={`px-4 py-1 rounded-full border font-medium capitalize ${role === type ? "bg-[#35BAA3] text-white" : "bg-gray-200 text-gray-700"
//                   }`}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>

//           {/* Input fields */}
//           <div className="space-y-4">
//             {/* Email/Mobile */}
//             <div>
//               <label className="block mb-1 text-sm font-medium">{role === "student" ? "Mobile No" : "Email / Mobile No"}</label>
//               <input
//                 type="text"
//                 maxLength={role === "student" ? 10 : undefined}
//                 placeholder={role === "student" ? "Enter Mobile Number" : "Email or Mobile"}
//                 className={`w-full border px-3 py-2 rounded outline-none focus:ring ${errors.input ? "border-red-500" : "focus:ring-[#35BAA3]"
//                   }`}
//                 value={input}
//                 onChange={(e) =>
//                   setInput(role === "student" ? e.target.value.replace(/\D/g, "") : e.target.value)
//                 }
//               />
//             </div>

//             {/* Password */}
//             {role === "tutor" && (
//               <div>
//                 <label className="block mb-1 text-sm font-medium">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter Password"
//                     className={`w-full border px-3 py-2 rounded outline-none focus:ring ${errors.password ? "border-red-500" : "focus:ring-[#35BAA3]"
//                       }`}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Remember Me / OTP Send */}
//             {role === "student" && (
//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center space-x-2 text-gray-600">
//                   <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="accent-[#35BAA3]" />
//                   <span>Remember Me</span>
//                 </label>
//                 <button type="button" onClick={handleSendOtp} disabled={loading || otpSent} className="px-3 py-1 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70">
//                   {otpSent ? "OTP Sent" : "Send OTP"}
//                 </button>
//               </div>
//             )}

//             {/* Student OTP */}
//             {role === "student" && otpSent && (
//               <>
//                 <div>
//                   <label className="block mb-1 text-sm font-medium">OTP</label>
//                   <input type="text" placeholder="Enter OTP" className={`w-full border px-3 py-2 rounded outline-none focus:ring ${errors.otp ? "border-red-500" : "focus:ring-[#35BAA3]"}`} value={otp} onChange={(e) => setOtp(e.target.value)} />
//                 </div>
//                 <div className="text-right text-sm">
//                   <button type="button" onClick={handleResendOtp} disabled={loading || resendTimer > 0} className="text-[#35BAA3] hover:underline disabled:opacity-60">
//                     {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Tutor Remember Me / Forgot Password */}
//             {role === "tutor" && (
//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <label className="flex items-center space-x-2">
//                   <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="accent-[#35BAA3]" />
//                   <span>Remember Me</span>
//                 </label>
//                 <button type="button" onClick={() => navigate("/forgot-password")} className="hover:underline text-sm text-[#0E2D63]">
//                   Forgot Password?
//                 </button>
//               </div>
//             )}

//             {/* Login Button */}
//             <button onClick={handleLogin} disabled={loading || (role === "student" && !otpSent)} className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70">
//               {loading ? "Processing..." : "Login"}
//             </button>

//             {/* Sign Up */}
//             <div className="text-center text-sm">
//               New User?{" "}
//               <button type="button" onClick={() => navigate(role === "tutor" ? "/tutorreg" : "/studentreg")} className="text-[#35BAA3] hover:underline">
//                 Sign Up
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </FormLayout>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../../../../api/repository/auth.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import FormLayout from "../../layout/FormLayout";

export default function Login() {
  const [role, setRole] = useState("student");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [inlineMessage, setInlineMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  // OTP resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Validation
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
      if (!password.trim()) newErrors.password = "Password is required.";
      else if (password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
    }

    if (role === "student" && otpSent && !otp.trim()) {
      newErrors.otp = "OTP is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(input.trim())) {
      setInlineMessage({
        type: "error",
        text: "Enter a valid 10-digit mobile number.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await authRepository.sendOtp({ emailOrMobile: input.trim() });

      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setOtpSent(true);
        setResendTimer(30);
        setInlineMessage({ type: "success", text: "OTP sent successfully!" });
      } else {
        setInlineMessage({
          type: "error",
          text: "Failed to send OTP. Try again.",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP.";
      setInlineMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!input.trim()) {
      setInlineMessage({
        type: "error",
        text: "No user found. Please request OTP again.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await authRepository.resendLoginOtp({
        emailOrMobile: input.trim(),
      });

      if (res.data?.user_id) {
        setResendTimer(30);
        setInlineMessage({ type: "success", text: "OTP resent successfully!" });
      } else {
        setInlineMessage({
          type: "error",
          text: "Failed to resend OTP. Try again.",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP.";
      setInlineMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      let res;
      if (role === "student") {
        res = await authRepository.verifyOtp({
          user_id: userId,
          otp: otp.trim(),
        });
      } else {
        res = await authRepository.login({
          emailOrMobile: input.trim(),
          password: password.trim(),
          role: "tutor",
        });
      }

      const { token, user } = res.data;

      if (!token) {
        setInlineMessage({
          type: "error",
          text: "Login failed. Invalid response from server.",
        });
        setLoading(false);
        return;
      }

      if (rememberMe) localStorage.setItem("authToken", token);
      else sessionStorage.setItem("authToken", token);

      localStorage.setItem("user", JSON.stringify(user || { role }));
      localStorage.setItem("role", role);

      setInlineMessage({ type: "success", text: "Login successful!" });

      setTimeout(() => {
        navigate(role === "tutor" ? "/tutor-dashboard" : "/student-dashboard");
      }, 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Check your credentials.";
      setInlineMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <button
        onClick={() => navigate("/")}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h2 className="text-black text-center text-xl font-bold mb-4">
        LOGIN TO YOUR ACCOUNT
      </h2>

      {/* Inline feedback */}
      {inlineMessage && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm mb-3 ${
            inlineMessage.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {inlineMessage.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
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
              setInlineMessage(null);
              setErrors({});
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

      {/* Inputs */}
      <div className="space-y-4">
        {/* Mobile / Email */}
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

        {/* Tutor Password */}
        {role === "tutor" && (
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full border px-3 py-2 rounded outline-none focus:ring ${
                  errors.password ? "border-red-500" : "focus:ring-[#35BAA3]"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Student OTP & Send */}
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

        {/* OTP input */}
        {role === "student" && otpSent && (
          <>
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
            <div className="text-right text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendTimer > 0}
                className="text-[#35BAA3] hover:underline disabled:opacity-60"
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {/* Tutor Remember / Forgot */}
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading || (role === "student" && !otpSent)}
          className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
        >
          {loading ? "Processing..." : "Login"}
        </button>

        {/* Signup */}
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
    </FormLayout>
  );
}
