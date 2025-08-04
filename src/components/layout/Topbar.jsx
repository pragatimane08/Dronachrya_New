import React from "react";
import { FiBell } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import Logo from "../../assets/img/logo.jpg";

/**
 * Topbar component with responsive hamburger menu and dynamic avatar letter.
 * @param {function} onMenuClick - Function triggered when hamburger icon is clicked.
 * @param {string} role - User role: "admin", "student", or "tutor"
 */
const Topbar = ({ onMenuClick, role = "admin" }) => {
  // Determine avatar initial based on role
  const avatarInitial = role === "admin" ? "A" : role === "student" ? "S" : "T";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-13 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm border-b border-[#2c3e91]">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        {/* Hamburger Icon (visible only on mobile) */}
        <button className="md:hidden text-xl text-[#2c3e91]" onClick={onMenuClick}>
          <FaBars />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold">
            <span className="text-[#35BAA3]">Drona</span>
            <span className="text-[#4B38EF]">charya</span>
          </span>
        </div>

      </div>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-4">
        <FiBell className="text-xl text-gray-700 cursor-pointer" />
        <div className="w-9 h-9 bg-[#2c3e91] text-white flex items-center justify-center rounded-full font-bold">
          {avatarInitial}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
