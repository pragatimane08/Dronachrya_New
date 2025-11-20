// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 text-center p-6">
      <h1 className="text-5xl font-bold mb-4 text-[#2F4380]">We’ll Be Back Soon!</h1>
      <p className="text-lg max-w-md mb-6">
        Our site is currently undergoing scheduled maintenance.  
        We’re working hard to improve your experience.  
        Please check back later or return to the homepage.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-[#35BAA3] text-white rounded-2xl shadow hover:bg-[#2ba390] transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
