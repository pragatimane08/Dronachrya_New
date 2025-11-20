// import React, { useState, useEffect } from "react";
// import { authRepository } from "../../../../api/repository/auth.repository";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// export default function ForgotResetPassword() {
//   const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [timer, setTimer] = useState(0); // OTP countdown timer
//   const navigate = useNavigate();

//   // ✅ Step 1: Send OTP
//   const handleSendOtp = async () => {
//     if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
//       toast.error("Enter a valid email.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await authRepository.forgotPassword({ email: email.trim() });
//       toast.success(res.data?.message || "OTP sent to your email.");
//       setStep(2); // Move to OTP step
//       setTimer(60); // Start 60 seconds countdown
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ OTP Countdown Timer
//   useEffect(() => {
//     if (timer <= 0) return;
//     const countdown = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(countdown);
//   }, [timer]);

//   // ✅ Step 2: Verify OTP & Move to Reset Password
//   const handleVerifyOtp = () => {
//     if (!otp.trim()) {
//       toast.error("Enter the OTP sent to your email.");
//       return;
//     }
//     setStep(3); // Proceed to reset password
//   };

//   // ✅ Step 3: Reset Password
//   const handleResetPassword = async () => {
//     if (!newPassword.trim()) {
//       toast.error("Enter new password.");
//       return;
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
//     if (!passwordRegex.test(newPassword)) {
//       toast.error(
//         "Password must include uppercase, lowercase, number, symbol and be at least 6 characters."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await authRepository.resetPassword({
//         email: email.trim(),
//         otp: otp.trim(),
//         new_password: newPassword.trim(),
//       });
//       toast.success(res.data?.message || "Password reset successful!");
//       setTimeout(() => navigate("/admin-login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Close button handler
//   const handleClose = () => {
//     navigate("/admin-login");
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="relative max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
//         {/* Cross button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
//         >
//           ×
//         </button>

//         {step === 1 && (
//           <>
//             <h2 className="text-xl font-bold mb-4 text-center ">
//               Forgot Password
//             </h2>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button
//               onClick={handleSendOtp}
//               disabled={loading}
//               className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <h2 className="text-xl font-bold mb-4 text-center">
//               Enter OTP
//             </h2>
//             <p className="text-gray-600 text-center mb-4">
//               OTP has been sent to {email}
//             </p>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />
//             <button
//               onClick={handleVerifyOtp}
//               className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition mb-2"
//             >
//               Verify OTP
//             </button>
//             <button
//               onClick={handleSendOtp}
//               disabled={timer > 0}
//               className={`w-full py-2 text-white font-medium rounded transition ${
//                 timer > 0
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gray-700 hover:bg-gray-800"
//               }`}
//             >
//               {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
//             </button>
//           </>
//         )}

//         {step === 3 && (
//           <>
//             <h2 className="text-xl font-bold mb-4 text-center">
//               Reset Password
//             </h2>
//             <input
//               type="password"
//               placeholder="Enter New Password"
//               className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//             <button
//               onClick={handleResetPassword}
//               disabled={loading}
//               className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
//             >
//               {loading ? "Resetting..." : "Reset Password"}
//             </button>
//           </>
//         )}
//       </div>
//     </>
//   );
// }



// import React, { useState, useEffect } from "react";
// import { authRepository } from "../../../../api/repository/auth.repository";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// export default function ForgotResetPassword() {
//   const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [timer, setTimer] = useState(0); // OTP countdown timer
//   const navigate = useNavigate();

//   // ✅ Step 1: Send OTP
//   const handleSendOtp = async () => {
//     if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
//       toast.error("Enter a valid email.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await authRepository.forgotPassword({ email: email.trim() });
//       toast.success(res.data?.message || "OTP sent to your email.");
//       setStep(2); // Move to OTP step
//       setTimer(60); // Start 60 seconds countdown
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ OTP Countdown Timer
//   useEffect(() => {
//     if (timer <= 0) return;
//     const countdown = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(countdown);
//   }, [timer]);

//   // ✅ Step 2: Verify OTP & Move to Reset Password
//   const handleVerifyOtp = () => {
//     if (!otp.trim()) {
//       toast.error("Enter the OTP sent to your email.");
//       return;
//     }

//     if (otp.length < 4) {
//       toast.error("Invalid OTP. Please check and try again.");
//       return;
//     }

//     setStep(3); // Proceed to reset password
//   };

//   // ✅ Step 3: Reset Password
//   const handleResetPassword = async () => {
//     if (!newPassword.trim()) {
//       toast.error("Enter new password.");
//       return;
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
//     if (!passwordRegex.test(newPassword)) {
//       toast.error(
//         "Password must include uppercase, lowercase, number, symbol and be at least 6 characters."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await authRepository.resetPassword({
//         email: email.trim(),
//         otp: otp.trim(),
//         new_password: newPassword.trim(),
//       });
//       toast.success(res.data?.message || "Password reset successful!");
//       setTimeout(() => navigate("/admin-login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reset password. Please check OTP and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Close button handler
//   const handleClose = () => {
//     navigate("/admin-login");
//   };

//   return (
//     <>
//       {/* ✅ Toasts in the center of the screen */}
//       <ToastContainer position="top-center" autoClose={3000} />

//       {/* ✅ Full-screen centered wrapper */}
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="relative max-w-md w-full bg-white p-6 rounded shadow">
//           {/* Cross button */}
//           <button
//             onClick={handleClose}
//             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
//           >
//             ×
//           </button>

//           {step === 1 && (
//             <>
//               <h2 className="text-xl font-bold mb-4 text-center ">
//                 Forgot Password
//               </h2>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <button
//                 onClick={handleSendOtp}
//                 disabled={loading}
//                 className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
//               >
//                 {loading ? "Sending..." : "Send OTP"}
//               </button>
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <h2 className="text-xl font-bold mb-4 text-center">
//                 Enter OTP
//               </h2>
//               <p className="text-gray-600 text-center mb-4">
//                 OTP has been sent to {email}
//               </p>
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <button
//                 onClick={handleVerifyOtp}
//                 className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition mb-2"
//               >
//                 Verify OTP
//               </button>
//               <button
//                 onClick={handleSendOtp}
//                 disabled={timer > 0}
//                 className={`w-full py-2 text-white font-medium rounded transition ${
//                   timer > 0
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-gray-700 hover:bg-gray-800"
//                 }`}
//               >
//                 {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
//               </button>
//             </>
//           )}

//           {step === 3 && (
//             <>
//               <h2 className="text-xl font-bold mb-4 text-center">
//                 Reset Password
//               </h2>
//               <input
//                 type="password"
//                 placeholder="Enter New Password"
//                 className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//               <button
//                 onClick={handleResetPassword}
//                 disabled={loading}
//                 className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }



import React, { useState, useEffect } from "react";
import { authRepository } from "../../../../api/repository/auth.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../home/layout/FormLayout"; // ✅ Use FormLayout

export default function ForgotResetPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // ✅ Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await authRepository.forgotPassword({ email: email.trim() });
      toast.success(res.data?.message || "OTP sent to your email.");
      setStep(2);
      setTimer(60); // Start 60s countdown
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ OTP Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      toast.error("Enter the OTP sent to your email.");
      return;
    }
    if (otp.length < 4) {
      toast.error("Invalid OTP. Please check and try again.");
      return;
    }
    setStep(3);
  };

  // ✅ Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      toast.error("Enter new password.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must include uppercase, lowercase, number, symbol and be at least 6 characters."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await authRepository.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword.trim(),
      });
      toast.success(res.data?.message || "Password reset successful!");
      setTimeout(() => navigate("/admin-login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please check OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/admin-login");
  };

  return (
    <FormLayout>
      <ToastContainer position="top-center" autoClose={3000} />

      <button
        onClick={handleClose}
        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>

      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Enter your registered email. We’ll send you an OTP to reset your password.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
            Enter OTP
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            OTP has been sent to {email}
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded mb-4 outline-none focus:ring focus:ring-[#35BAA3]"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition mb-2"
          >
            Verify OTP
          </button>
          <button
            onClick={handleSendOtp}
            disabled={timer > 0}
            className={`w-full py-2 text-white font-medium rounded transition ${
              timer > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-800"
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
            Reset Password
          </h2>
          <input
            type="password"
            placeholder="Enter New Password"
            className="w-full border px-3 py-2 rounded mb-3 outline-none focus:ring focus:ring-[#35BAA3]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500 mb-4">
            Must include uppercase, lowercase, number, symbol, and be 6+ characters long.
          </p>
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full py-2 bg-[#35BAA3] hover:bg-[#2fa28e] text-white font-medium rounded transition disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </FormLayout>
  );
}
