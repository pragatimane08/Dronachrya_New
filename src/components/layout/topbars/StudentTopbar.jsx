import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiLogOut, FiUser } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import Logo from "../../../assets/img/logo.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentTopbar = ({ onMenuClick }) => {
  const [userData, setUserData] = useState({ firstName: "", role: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const role = user?.role || "";
        const firstName = user?.profile?.name?.split(" ")[0] || "";
        setUserData({ role, firstName });
      } catch (e) {
        console.error("Error parsing user from storage:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");

    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    // Navigate to home after short delay (to allow toast to show)
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full h-14 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm border-b border-[#2c3e91]">
        {/* Left Section - Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-xl text-[#2c3e91]"
            onClick={onMenuClick}
          >
            <FaBars />
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold">
              <span className="text-[#35BAA3]">Drona</span>
              <span className="text-[#4B38EF]">charya</span>
            </span>
          </div>
        </div>

        {/* Right Section - Notifications + Logout + Profile */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <FiBell className="text-xl text-gray-700 cursor-pointer" />

          {/* Avatar + Name */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="w-9 h-9 bg-[#2c3e91] text-white flex items-center justify-center rounded-full">
              <FiUser className="text-lg" />
            </div>
            {userData.firstName && (
              <span className="hidden sm:block font-medium">
                {userData.firstName}
              </span>
            )}
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white shadow-lg rounded-lg border overflow-hidden">
              <button
                onClick={() => {
                  navigate("/student_profile_show");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiUser /> Profile
              </button>
            </div>
          )}

          {/* Logout Button (Always Visible) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium shadow-md hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 ease-in-out"
          >
            <FiLogOut className="text-lg" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default StudentTopbar;

