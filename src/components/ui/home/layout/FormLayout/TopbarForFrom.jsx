// src/components/Topbar/Topbar.jsx
import React from "react";
import Logo from "../../../../../assets/img/logo.jpg"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const TopbarForFrom = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full fixed top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={Logo}
            alt="Dronacharya Logo"
            className="h-8 w-auto sm:h-9"
          />
          <span className="text-xl sm:text-2xl font-bold">
            <span className="text-[#35BAA3]">Dro</span>
            <span className="text-[#4B38EF]">nacharya</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopbarForFrom;
