// src/common/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiLogOut, FiUser } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import Logo from "../../assets/img/logo.jpg";
import "./Topbar.css";

const Topbar = ({
    role,
    userData,
    onMenuClick,
    onLogout,
    showDropdown = false,
    onProfileClick,
    isMobile = false,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Always show first letter of first name
    const avatarInitial = userData?.fullName
        ? userData.fullName.charAt(0).toUpperCase()
        : (userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : "A");

    return (
        <div className="topbar">
            {/* Left Section - Menu + Logo */}
            <div className="topbar-left">
                <button
                    className="topbar-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                >
                    <FaBars />
                </button>

                <div className="topbar-logo">
                    <img src={Logo} alt="Logo" className="topbar-logo-image" />
                    <span className="topbar-logo-text">
                        <span className="text-primary">Drona</span>
                        <span className="text-secondary">charya</span>
                    </span>
                </div>
            </div>

            {/* Right Section */}
            <div
                className="topbar-right"
                ref={dropdownRef}
            >
                {/* Notification
                <button className="topbar-notification-btn" aria-label="Notifications">
                    <FiBell />
                </button> */}

                {/* Avatar + Name */}
                <div
                    className={`topbar-user ${showDropdown ? "cursor-pointer" : ""}`}
                    onClick={() => showDropdown && setDropdownOpen((prev) => !prev)}
                >
                    <div className="topbar-avatar">
                        {avatarInitial}
                    </div>
                    {userData?.firstName && !isMobile && (
                        <span className="topbar-username">
                            {role === "admin"
                                ? `Admin - ${userData.firstName}`
                                : userData.firstName}
                        </span>
                    )}
                </div>

                {/* Student Dropdown */}
                {showDropdown && dropdownOpen && (
                    <div className="topbar-dropdown">
                        <button
                            onClick={() => {
                                if (onProfileClick) onProfileClick();
                                setDropdownOpen(false);
                            }}
                            className="topbar-dropdown-item"
                        >
                            <FiUser /> Profile
                        </button>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className="topbar-logout-btn"
                >
                    <FiLogOut />
                    <span className="topbar-logout-text">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Topbar;