// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { authRepository } from "../../../../api/repository/auth.repository";

// const AdminLogin = () => {
//   const [emailOrMobile, setEmailOrMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validateLogin = () => {
//     let formErrors = {};
//     if (!emailOrMobile.trim()) formErrors.emailOrMobile = "Email or Mobile is required";
//     if (!password.trim()) formErrors.password = "Password is required";
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateLogin()) {
//       toast.error("Please fill all required fields.");
//       return;
//     }
//     try {
//       const response = await authRepository.login({ emailOrMobile, password });
//       const token = response?.data?.token;
//       const user = response?.data?.user;

//       if (token && user) {
//         if (user.role !== "admin") {
//           toast.error("Access denied. Only admins can login here.");
//           return;
//         }

//         if (rememberMe) {
//           localStorage.setItem("authToken", token);
//           localStorage.setItem("role", user.role);
//         } else {
//           sessionStorage.setItem("authToken", token);
//           sessionStorage.setItem("role", user.role);
//         }

//         localStorage.setItem("user_id", user?.user_id || "");
//         localStorage.setItem("user", JSON.stringify(user));

//         toast.success("Login successful!");
//         setTimeout(() => navigate("/admin-dashboard"), 1000);
//       } else {
//         toast.error("Invalid response from server.");
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Login failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <ToastContainer />
//       <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md border relative">
//         <button
//           onClick={() => navigate("/")}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//         >
//           <XMarkIcon className="h-6 w-6" />
//         </button>

//         <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
//           Login to Admin Account
//         </h2>

//         <form onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Email or Mobile"
//             className="w-full mb-3 px-3 py-2 border rounded-md"
//             value={emailOrMobile}
//             onChange={(e) => setEmailOrMobile(e.target.value)}
//           />
//           {errors.emailOrMobile && <p className="text-red-500 text-sm">{errors.emailOrMobile}</p>}

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full mb-3 px-3 py-2 border rounded-md"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

//           <div className="flex justify-between mb-4">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="mr-2"
//               />
//               Remember Me
//             </label>
//             <button
//               type="button"
//               onClick={() => navigate("/admin-forgot-password")}
//               className="text-sm text-black-600 "
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button className="w-full bg-teal-500 text-white py-2 rounded-md">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
<<<<<<< HEAD
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   XMarkIcon,
//   EyeIcon,
//   EyeSlashIcon,
// } from "@heroicons/react/24/outline";
// import { authRepository } from "../../../../api/repository/auth.repository";
// import FormLayout from "../../home/layout/FormLayout";

// const AdminLogin = () => {
//   const [emailOrMobile, setEmailOrMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [inlineMessage, setInlineMessage] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Auto-check for existing admin session
//   useEffect(() => {
//     const token =
//       localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
//     const role =
//       localStorage.getItem("role") || sessionStorage.getItem("role");

//     if (token && role === "admin") {
//       navigate("/admin-dashboard");
//     }
//   }, [navigate]);

//   const validateLogin = () => {
//     let formErrors = {};
//     if (!emailOrMobile.trim())
//       formErrors.emailOrMobile = "Email or Mobile is required";
//     if (!password.trim()) formErrors.password = "Password is required";
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateLogin()) {
//       setInlineMessage({
//         type: "error",
//         text: "Please fill all required fields.",
//       });
//       return;
//     }

//     try {
//       const response = await authRepository.login({
//         emailOrMobile,
//         password,
//         role: "admin", // ✅ enforce admin role here
//       });

//       const token = response?.data?.token;
//       const user = response?.data?.user;

//       if (token) {
//         // ✅ Save login details based on Remember Me
//         if (rememberMe) {
//           localStorage.setItem("authToken", token);
//           localStorage.setItem("role", "admin");
//         } else {
//           sessionStorage.setItem("authToken", token);
//           sessionStorage.setItem("role", "admin");
//         }

//         if (user) {
//           localStorage.setItem("user_id", user?.user_id || "");
//           localStorage.setItem("user", JSON.stringify({ ...user, role: "admin" }));
//         }

//         setInlineMessage({
//           type: "success",
//           text: "Login successful! Redirecting...",
//         });

//         setTimeout(() => navigate("/admin-dashboard"), 1000);
//       } else {
//         setInlineMessage({
//           type: "error",
//           text: "Login failed. Please check your credentials.",
//         });
//       }
//     } catch (error) {
//       setInlineMessage({
//         type: "error",
//         text:
//           error?.response?.data?.message ||
//           "Login failed. Invalid email/mobile or password.",
//       });
//     }
//   };

//   return (
//     <FormLayout>
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border relative">
//         {/* Close Button */}
//         <div className="absolute top-3 right-3">
//           <button
//             onClick={() => navigate("/")}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>

//         <h2 className="text-center text-xl sm:text-2xl font-semibold text-blue-900 mb-6">
//           Login to Admin Account
//         </h2>

//         {/* Inline feedback message */}
//         {inlineMessage && (
//           <div
//             className={`flex flex-wrap items-start gap-2 px-3 py-2 rounded text-sm mb-4 w-full whitespace-normal break-words ${
//               inlineMessage.type === "error"
//                 ? "bg-red-100 text-red-700 border border-red-300"
//                 : "bg-green-100 text-green-700 border border-green-300"
//             }`}
//           >
//             <span className="flex-1 break-words">{inlineMessage.text}</span>
//             <button
//               onClick={() => setInlineMessage(null)}
//               className="ml-auto text-gray-500 hover:text-gray-700 flex-shrink-0"
//             >
//               <XMarkIcon className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           {/* Email / Mobile */}
//           <div>
//             <input
//               type="text"
//               placeholder="Email or Mobile"
//               className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
//               value={emailOrMobile}
//               onChange={(e) => {
//                 setEmailOrMobile(e.target.value);
//                 if (inlineMessage) setInlineMessage(null);
//               }}
//             />
//             {errors.emailOrMobile && (
//               <p className="text-red-500 text-xs mt-1">{errors.emailOrMobile}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full px-3 py-2 border rounded-md text-sm sm:text-base pr-10"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 if (inlineMessage) setInlineMessage(null);
//               }}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? (
//                 <EyeSlashIcon className="h-5 w-5" />
//               ) : (
//                 <EyeIcon className="h-5 w-5" />
//               )}
//             </button>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* Remember Me + Forgot Password */}
//           <div className="flex flex-wrap justify-between items-center text-sm">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="mr-2"
//               />
//               Remember Me
//             </label>
//             <button
//               type="button"
//               onClick={() => navigate("/admin-forgot-password")}
//               className="text-teal-600 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md text-sm sm:text-base">
//             Login
//           </button>
//         </form>

//         {/* Sign up option */}
//         <div className="mt-4 text-center text-sm sm:text-base">
//           <p className="text-gray-600">
//             Don’t have an account?{" "}
//             <button
//               onClick={() => navigate("/admin-registration")}
//               className="text-teal-600 font-semibold hover:underline"
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//     </FormLayout>
//   );
// };

// export default AdminLogin;


=======
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { authRepository } from "../../../../api/repository/auth.repository";
import FormLayout from "../../home/layout/FormLayout";

const AdminLogin = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [inlineMessage, setInlineMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Auto-check for existing admin session
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const role =
      localStorage.getItem("role") || sessionStorage.getItem("role");

    if (token && role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const validateLogin = () => {
    let formErrors = {};
    if (!emailOrMobile.trim())
      formErrors.emailOrMobile = "Email or Mobile is required";
    if (!password.trim()) formErrors.password = "Password is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) {
      setInlineMessage({
        type: "error",
        text: "Please fill all required fields.",
      });
      return;
    }

    try {
      const response = await authRepository.login({
        emailOrMobile,
        password,
        role: "admin", // ✅ enforce admin role here
      });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token) {
        // ✅ Save login details based on Remember Me
        if (rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("role", "admin");
        } else {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("role", "admin");
        }

        if (user) {
          localStorage.setItem("user_id", user?.user_id || "");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, role: "admin" })
          );
        }

        setInlineMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        setInlineMessage({
          type: "error",
          text: "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      setInlineMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Login failed. Invalid email/mobile or password.",
      });
    }
  };


  return (
    <FormLayout>
      {/* Card content inside FormLayout white box */}
      <div className="w-full">
        {/* Close Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <h2 className="text-center text-xl sm:text-2xl font-semibold text-blue-900 mb-6">
          Login to Admin Account
        </h2>

        {/* Inline feedback message */}
        {inlineMessage && (
          <div
            className={`flex flex-wrap items-start gap-2 px-3 py-2 rounded text-sm mb-4 w-full whitespace-normal break-words ${
              inlineMessage.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            <span className="flex-1 break-words">{inlineMessage.text}</span>
            <button
              onClick={() => setInlineMessage(null)}
              className="ml-auto text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email / Mobile */}
          <div>
            <input
              type="text"
              placeholder="Email or Mobile"
              className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
              value={emailOrMobile}
              onChange={(e) => {
                setEmailOrMobile(e.target.value);
                if (inlineMessage) setInlineMessage(null);
              }}
            />
            {errors.emailOrMobile && (
              <p className="text-red-500 text-xs mt-1">
                {errors.emailOrMobile}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md text-sm sm:text-base pr-10"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (inlineMessage) setInlineMessage(null);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-wrap justify-between items-center text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => navigate("/admin-forgot-password")}
              className="text-teal-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md text-sm sm:text-base">
            Login
          </button>
        </form>

        {/* Sign up option */}
        <div className="mt-4 text-center text-sm sm:text-base">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/admin-registration")}
              className="text-teal-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </FormLayout>
  );
};

export default AdminLogin;
