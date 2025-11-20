



// import React, { useState } from "react";
// import { authRepository } from "../../../../../api/repository/auth.repository";
// import { useNavigate } from "react-router-dom";
// import { X, Eye, EyeOff } from "lucide-react";

// export default function ForgotPassword() {
//   const [step, setStep] = useState("forgot");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const navigate = useNavigate();

//   // Handle Forgot Password (Send OTP)
//   const handleForgot = async () => {
//     if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
//       setMessage({ type: "error", text: "Please enter a valid email address." });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });
//     try {
//       const res = await authRepository.forgotPassword({ email: email.trim() });
//       setMessage({
//         type: "success",
//         text: res.data?.message || "OTP sent to your email!",
//       });
//       setStep("reset");
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text:
//           err.response?.data?.error ||
//           err.response?.data?.message ||
//           "Failed to send OTP. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Reset Password
//   const handleReset = async () => {
//     if (!otp.trim() || !newPassword.trim()) {
//       setMessage({ type: "error", text: "Please enter OTP and a new password." });
//       return;
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

//     if (!passwordRegex.test(newPassword)) {
//       setMessage({
//         type: "error",
//         text: "Password must include uppercase, lowercase, number, special character and be at least 6 characters long.",
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });
//     try {
//       const res = await authRepository.resetPassword({
//         email: email.trim(),
//         otp: otp.trim(),
//         new_password: newPassword.trim(),
//       });
//       setMessage({
//         type: "success",
//         text:
//           res.data?.message ||
//           "Password reset successful! Redirecting to login...",
//       });

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);

//       setStep("forgot");
//       setEmail("");
//       setOtp("");
//       setNewPassword("");
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text:
//           err.response?.data?.error ||
//           err.response?.data?.message ||
//           "Failed to reset password. Please check your OTP and try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow relative">
//         {/* Cross Button */}
//         <button
//           onClick={() => navigate("/")}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//         >
//           <X size={22} />
//         </button>

//         {step === "forgot" && (
//           <>
//             <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
//               Forgot Password
//             </h2>
//             <p className="text-sm text-gray-500 text-center mb-4">
//               Enter your registered email address. We’ll send you an OTP to reset your password.
//             </p>

//             {message.text && (
//               <div
//                 className={`mb-4 p-2 rounded text-sm ${
//                   message.type === "error"
//                     ? "bg-red-100 text-red-600"
//                     : "bg-green-100 text-green-600"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button
//               onClick={handleForgot}
//               disabled={loading}
//               className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {step === "reset" && (
//           <>
//             <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
//               Reset Password
//             </h2>
//             <p className="text-sm text-gray-500 text-center mb-4">
//               Enter the OTP you received on your email and set a new password.
//             </p>

//             {message.text && (
//               <div
//                 className={`mb-4 p-2 rounded text-sm ${
//                   message.type === "error"
//                     ? "bg-red-100 text-red-600"
//                     : "bg-green-100 text-green-600"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             {/* OTP Input */}
//             <div className="relative mb-4">
//               <input
//                 type={showOtp ? "text" : "password"}
//                 placeholder="Enter OTP"
//                 className="w-full border px-3 py-2 rounded outline-none focus:ring focus:ring-[#35BAA3] pr-10"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowOtp(!showOtp)}
//                 className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
//               >
//                 {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* Password Input */}
//             <div className="relative mb-2">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter New Password"
//                 className="w-full border px-3 py-2 rounded outline-none focus:ring focus:ring-[#35BAA3] pr-10"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             <p className="text-xs text-gray-500 mb-4">
//               Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 6+ characters long.
//             </p>

//             <button
//               onClick={handleReset}
//               disabled={loading}
//               className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
//             >
//               {loading ? "Resetting..." : "Reset Password"}
//             </button>
//             <button
//               onClick={() => setStep("forgot")}
//               className="w-full py-2 mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition"
//             >
//               ← Back
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { authRepository } from "../../../../../api/repository/auth.repository";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import FormLayout from "../../layout/FormLayout";

export default function ForgotPassword() {
  const [step, setStep] = useState("forgot");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // ✅ Handle Forgot Password (Send OTP)
  const handleForgot = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await authRepository.forgotPassword({ email: email.trim() });
      setMessage({
        type: "success",
        text: res.data?.message || "OTP sent to your email!",
      });
      setStep("reset");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Reset Password
  const handleReset = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      setMessage({ type: "error", text: "Please enter OTP and a new password." });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage({
        type: "error",
        text: "Password must include uppercase, lowercase, number, special character and be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await authRepository.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword.trim(),
      });
      setMessage({
        type: "success",
        text:
          res.data?.message ||
          "Password reset successful! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      setStep("forgot");
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to reset password. Please check your OTP and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <div className="w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {step === "forgot" && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Enter your registered email address. We’ll send you an OTP to reset your password.
            </p>

            {message.text && (
              <div
                className={`mb-4 p-2 rounded text-sm ${
                  message.type === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

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
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Enter the OTP you received on your email and set a new password.
            </p>

            {message.text && (
              <div
                className={`mb-4 p-2 rounded text-sm ${
                  message.type === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* OTP Input */}
            <div className="relative mb-4">
              <input
                type={showOtp ? "text" : "password"}
                placeholder="Enter OTP"
                className="w-full border px-3 py-2 rounded outline-none focus:ring focus:ring-[#35BAA3] pr-10"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Input */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="w-full border px-3 py-2 rounded outline-none focus:ring focus:ring-[#35BAA3] pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

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
    </FormLayout>
  );
}
