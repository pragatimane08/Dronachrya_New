// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css";
// import { apiUrl } from "../../../../api/apiUtl"; // ✅ only apiUrl

// const AdminRegistration = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile_number: "",
//     password: "",
//     role: "admin",
//   });

//   const [errors, setErrors] = useState({});
//   const [userId, setUserId] = useState(null);
//   const [otp, setOtp] = useState("");
//   const [showOtpForm, setShowOtpForm] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const nameRegex = /^[a-zA-Z\s]{2,}$/;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const mobileRegex = /^[0-9]{10}$/;
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!nameRegex.test(formData.name)) {
//       newErrors.name =
//         "Name must be at least 2 characters and only contain letters.";
//     }

//     if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Invalid email format.";
//     }

//     if (!mobileRegex.test(formData.mobile_number)) {
//       newErrors.mobile_number = "Mobile number must be 10 digits.";
//     }

//     if (!passwordRegex.test(formData.password)) {
//       newErrors.password =
//         "Password must have 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be 8+ characters.";
//     }

//     setErrors(newErrors);

//     // Show toasts for all errors
//     Object.values(newErrors).forEach((msg) => toast.error(msg));

//     return Object.keys(newErrors).length === 0;
//   };

//   // Step 1: Register Admin
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const res = await axios.post(
//         `${apiUrl.baseUrl}${apiUrl.auth.register}`,
//         formData
//       );

//       if (res.data?.user_id) {
//         setUserId(res.data.user_id);
//         setShowOtpForm(true);
//         toast.success("✅ Registration successful, OTP sent to your email!");
//       } else {
//         toast.error("⚠️ Registration failed, try again.");
//       }
//     } catch (error) {
//       toast.error(
//         `❌ ${error.response?.data?.message || "Registration failed"}`
//       );
//     }
//   };

//   // Step 2: Verify OTP
//   const handleOtpVerify = async (e) => {
//     e.preventDefault();
//     if (!otp.trim()) {
//       toast.error("OTP is required");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${apiUrl.baseUrl}${apiUrl.auth.verifyOtp}`,
//         {
//           user_id: userId,
//           otp,
//         }
//       );

//       const { token, user } = res.data;
//       if (token && user) {
//         localStorage.setItem("authToken", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("user_id", user.user_id);

//         toast.success("🎉 OTP Verified Successfully!");
//         setTimeout(() => navigate("/admin-dashboard"), 1000);
//       } else {
//         toast.error("⚠️ OTP verified but no token/user returned.");
//       }
//     } catch (error) {
//       toast.error(
//         `❌ ${error.response?.data?.message || "OTP verification failed"}`
//       );
//     }
//   };

//   const handleCancel = () => {
//     navigate("/");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <ToastContainer />
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
//         <button
//           onClick={handleCancel}
//           className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
//         >
//           ✕
//         </button>

//         {!showOtpForm ? (
//           <>
//             <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
//               Admin Registration
//             </h2>
//             <form className="space-y-4" onSubmit={handleRegister}>
//               <div>
//                 <label className="block text-gray-700 mb-1">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Full Name"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-red-500">{errors.name}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Email Address"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-red-500">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="mobile_number"
//                   value={formData.mobile_number}
//                   onChange={handleChange}
//                   placeholder="Phone Number"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 {errors.mobile_number && (
//                   <p className="text-sm text-red-500">
//                     {errors.mobile_number}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 {errors.password && (
//                   <p className="text-sm text-red-500">{errors.password}</p>
//                 )}
//               </div>

//               <div className="flex justify-between mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </>
//         ) : (
//           <>
//             <h2 className="text-xl font-semibold text-center text-blue-900 mb-6">
//               Verify OTP
//             </h2>
//             <form className="space-y-4" onSubmit={handleOtpVerify}>
//               <div>
//                 <label className="block text-gray-700 mb-1">Enter OTP</label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter the OTP"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div className="flex justify-between mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminRegistration;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Eye, EyeOff } from "lucide-react"; // ✅ for password toggle
// import { authRepository } from "../../../../api/repository/auth.repository";
// import FormLayout from "../../home/layout/FormLayout";


// const AdminRegistration = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile_number: "",
//     password: "",
//     confirmPassword: "",
//     role: "admin", // ✅ always admin
//   });

//   const [errors, setErrors] = useState({});
//   const [userId, setUserId] = useState(null);
//   const [otp, setOtp] = useState("");
//   const [showOtpForm, setShowOtpForm] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // ✅ handle input changes
//   const handleChange = (e) => {
//     let { name, value } = e.target;

//     // Restrict mobile number to digits only and max 10
//     if (name === "mobile_number") {
//       value = value.replace(/\D/g, ""); // remove non-digits
//       if (value.length > 10) return; // block typing beyond 10 digits
//     }

//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" }); // Clear error on change
//   };

//   // ✅ validate inputs
//   const validateForm = () => {
//     const newErrors = {};
//     const nameRegex = /^[a-zA-Z\s]{2,}$/;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const mobileRegex = /^[0-9]{10}$/;
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!nameRegex.test(formData.name)) {
//       newErrors.name =
//         "Name must be at least 2 characters and only contain letters.";
//     }

//     if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Invalid email format.";
//     }

//     if (!mobileRegex.test(formData.mobile_number)) {
//       newErrors.mobile_number = "Mobile number must be exactly 10 digits.";
//     }

//     if (!passwordRegex.test(formData.password)) {
//       newErrors.password =
//         "Password must have 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be 8+ characters.";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match.";
//     }

//     setErrors(newErrors);

//     // Show toast for all errors
//     Object.values(newErrors).forEach((msg) => toast.error(msg));

//     return Object.keys(newErrors).length === 0;
//   };

//   // ✅ Step 1: Register Admin
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const res = await authRepository.register({
//         name: formData.name,
//         email: formData.email,
//         mobile_number: formData.mobile_number,
//         password: formData.password,
//         role: "admin",
//       });

//       if (res?.data?.user_id) {
//         setUserId(res.data.user_id);
//         setShowOtpForm(true);
//         toast.success("✅ Registration successful, OTP sent to your email!");
//       } else {
//         toast.error("⚠️ Registration failed, try again.");
//       }
//     } catch (error) {
//       toast.error(
//         `❌ ${error.response?.data?.message || "Registration failed"}`
//       );
//     }
//   };

//   // ✅ Step 2: Verify OTP
//   const handleOtpVerify = async (e) => {
//     e.preventDefault();
//     if (!otp.trim()) {
//       setErrors({ otp: "OTP is required" });
//       toast.error("OTP is required");
//       return;
//     }

//     try {
//       const res = await authRepository.verifyAdminOtp({
//         user_id: userId,
//         otp,
//       });

//       const { token, user } = res.data;
//       if (token && user) {
//         localStorage.setItem("authToken", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("user_id", user.user_id);

//         toast.success("🎉 OTP Verified Successfully!");
//         setTimeout(() => navigate("/admin-dashboard"), 1000);
//       } else {
//         toast.error("⚠️ OTP verified but no token/user returned.");
//       }
//     } catch (error) {
//       toast.error(
//         `❌ ${error.response?.data?.message || "OTP verification failed"}`
//       );
//     }
//   };

//   const handleCancel = () => {
//     navigate("/");
//   };

//   return (
//         <FormLayout>

//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <ToastContainer />
//       <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md relative">
//         <button
//           onClick={handleCancel}
//           className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
//         >
//           ✕
//         </button>

//         {!showOtpForm ? (
//           <>
//             <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
//               Admin Registration
//             </h2>
//             <form className="space-y-4" onSubmit={handleRegister}>
//               {/* Name */}
//               <div>
//                 <label className="block text-gray-700 mb-1">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Full Name"
//                   className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
//                     errors.name ? "border-red-500" : ""
//                   }`}
//                   required
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-red-500">{errors.name}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Email Address"
//                   className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
//                     errors.email ? "border-red-500" : ""
//                   }`}
//                   required
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-red-500">{errors.email}</p>
//                 )}
//               </div>

//               {/* Mobile Number */}
//               <div>
//                 <label className="block text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="mobile_number"
//                   value={formData.mobile_number}
//                   onChange={handleChange}
//                   placeholder="10-digit Phone Number"
//                   maxLength="10"
//                   className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
//                     errors.mobile_number ? "border-red-500" : ""
//                   }`}
//                   required
//                 />
//                 {errors.mobile_number && (
//                   <p className="text-sm text-red-500">
//                     {errors.mobile_number}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-gray-700 mb-1">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Password"
//                     className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
//                       errors.password ? "border-red-500" : ""
//                     }`}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-2.5 text-gray-600"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-red-500">{errors.password}</p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="block text-gray-700 mb-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Confirm Password"
//                     className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
//                       errors.confirmPassword ? "border-red-500" : ""
//                     }`}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowConfirmPassword(!showConfirmPassword)
//                     }
//                     className="absolute right-3 top-2.5 text-gray-600"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-sm text-red-500">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </>
//         ) : (
//           <>
//             <h2 className="text-xl font-semibold text-center text-blue-900 mb-6">
//               Verify OTP
//             </h2>
//             <form className="space-y-4" onSubmit={handleOtpVerify}>
//               <div>
//                 <label className="block text-gray-700 mb-1">Enter OTP</label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => {
//                     setOtp(e.target.value);
//                     setErrors({ ...errors, otp: "" });
//                   }}
//                   placeholder="Enter the OTP"
//                   className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
//                     errors.otp ? "border-red-500" : ""
//                   }`}
//                   required
//                 />
//                 {errors.otp && (
//                   <p className="text-sm text-red-500">{errors.otp}</p>
//                 )}
//               </div>
//               <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//             </FormLayout>

//   );
// };

// export default AdminRegistration;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { authRepository } from "../../../../api/repository/auth.repository";
import FormLayout from "../../home/layout/FormLayout";

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "mobile_number") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) return;
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
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
      newErrors.mobile_number = "Mobile number must be exactly 10 digits.";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must have uppercase, lowercase, number, special char, and be 8+ chars.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => toast.error(msg));
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await authRepository.register({
        name: formData.name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        password: formData.password,
        role: "admin",
      });

      if (res?.data?.user_id) {
        setUserId(res.data.user_id);
        setShowOtpForm(true);
        toast.success("✅ Registration successful, OTP sent to your email!");
      } else {
        toast.error("⚠️ Registration failed, try again.");
      }
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || "Registration failed"}`);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      toast.error("OTP is required");
      return;
    }

    try {
      const res = await authRepository.verifyAdminOtp({ user_id: userId, otp });
      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        localStorage.setItem("user_id", user.user_id);

        toast.success("🎉 OTP Verified Successfully!");
        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        toast.error("⚠️ OTP verified but no token/user returned.");
      }
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || "OTP verification failed"}`);
    }
  };

  const handleCancel = () => navigate("/");

  return (
    <FormLayout>
      <ToastContainer />
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
            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="10-digit Phone Number"
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.mobile_number ? "border-red-500" : ""
                }`}
                required
              />
              {errors.mobile_number && (
                <p className="text-sm text-red-500">{errors.mobile_number}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
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
                onChange={(e) => {
                  setOtp(e.target.value);
                  setErrors({ ...errors, otp: "" });
                }}
                placeholder="Enter the OTP"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.otp ? "border-red-500" : ""
                }`}
                required
              />
              {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
              >
                Verify
              </button>
            </div>
          </form>
        </>
      )}
    </FormLayout>
  );
};

export default AdminRegistration;
