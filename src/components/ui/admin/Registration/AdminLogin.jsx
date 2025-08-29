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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authRepository } from "../../../../api/repository/auth.repository";

const AdminLogin = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Auto-check for existing session or remember me token
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const role =
      localStorage.getItem("role") || sessionStorage.getItem("role");

    if (token && role === "admin") {
      navigate("/admin-dashboard"); // auto-redirect if already logged in
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
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      const response = await authRepository.login({ emailOrMobile, password });
      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token && user) {
        if (user.role !== "admin") {
          toast.error("Access denied. Only admins can login here.");
          return; // ❌ stay on page
        }

        // ✅ Save login details based on Remember Me
        if (rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("role", user.role);
        } else {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("role", user.role);
        }

        localStorage.setItem("user_id", user?.user_id || "");
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful!");
        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      // ✅ Show clear error message and stay on same page
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Invalid email/mobile or password."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md border relative">
        {/* Top-right buttons (Back + Close) */}
        <div className="absolute top-3 right-3 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
          Login to Admin Account
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Mobile"
            className="w-full mb-3 px-3 py-2 border rounded-md"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
          {errors.emailOrMobile && (
            <p className="text-red-500 text-sm">{errors.emailOrMobile}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <div className="flex justify-between mb-4">
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
              className="text-sm text-black-600"
            >
              Forgot Password?
            </button>
          </div>

          <button className="w-full bg-teal-500 text-white py-2 rounded-md">
            Login
          </button>
        </form>

        {/* Sign up option */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
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
    </div>
  );
};

export default AdminLogin;
