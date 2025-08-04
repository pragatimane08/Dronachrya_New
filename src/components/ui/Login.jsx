import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student"); // 'admin', 'tutor', or 'student'
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate credentials
    let isValid = false;
    
    if (userType === "admin" && email === "admin@gmail.com" && password === "Admin@123") {
      isValid = true;
      navigate("/admin-dashboard"); // Redirect to admin dashboard
    } else if (userType === "tutor" && email === "tutor@gmail.com" && password === "Tutor@123") {
      isValid = true;
      navigate("/tutor-dashboard"); // Redirect to tutor dashboard
    } else if (userType === "student" && email === "student@gmail.com" && password === "Student@123") {
      isValid = true;
      navigate("/student-dashboard"); // Redirect to student dashboard
    }

    if (isValid) {
      onClose(); // Close modal after successful login
    } else {
      setError("Invalid credentials for selected user type");
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white border border-violet-400 shadow-pink-200 rounded-xl p-6 space-y-4 relative w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-black text-center text-xl font-bold mb-4">
          LOGIN TO YOUR ACCOUNT
        </h2>
        
        {/* User Type Selection */}
        <div className="flex justify-center space-x-4 mb-4">
          {["student", "tutor", "admin"].map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`px-4 py-2 rounded-md capitalize ${
                userType === type
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email ID"
            className="w-full border px-3 py-2 rounded outline-none focus:ring focus:ring-violet-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border px-3 py-2 rounded outline-none focus:ring focus:ring-violet-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-violet-500" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded transition"
          >
            Login
          </button>

          <div className="text-center text-sm">
            New User?{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;