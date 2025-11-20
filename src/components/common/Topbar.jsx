// src/components/common/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiLogOut, FiUser, FiHome } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/img/logo.jpg";
import "./Topbar.css";

const Topbar = ({
    role,
    userData,
    onMenuClick,
    onLogout,
    showDropdown = true,
    onProfileClick,
    onDashboardClick,
    isMobile = false,
    showDashboardOption = false,
    showProfileOption = true,
    showUserName = true,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [avatarInitial, setAvatarInitial] = useState("U");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Simple and reliable user name extraction
    useEffect(() => {
        const extractUserName = () => {
            try {

                // Priority 1: Use the userData prop if available
                if (userData && Object.keys(userData).length > 0) {

                    // Check various name fields in userData
                    let name = "";

                    if (userData.profile?.name) {
                        name = userData.profile.name;

                    } else if (userData.name) {
                        name = userData.name;

                    } else if (userData.firstName) {
                        name = userData.firstName;

                    } else if (userData.first_name) {
                        name = userData.first_name;

                    } else if (userData.profile?.first_name) {
                        name = userData.profile.first_name;

                    }

                    if (name) {
                        const firstName = name.split(" ")[0] || name;
                        setUserName(firstName);
                        setAvatarInitial(firstName.charAt(0).toUpperCase());

                        return;
                    }
                }

                // Priority 2: Fallback to localStorage/sessionStorage

                const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");

                if (userStr) {
                    const user = JSON.parse(userStr);


                    let name = "";

                    if (user.profile?.name) {
                        name = user.profile.name;

                    } else if (user.name) {
                        name = user.name;

                    } else if (user.firstName) {
                        name = user.firstName;

                    } else if (user.first_name) {
                        name = user.first_name;

                    }

                    if (name) {
                        const firstName = name.split(" ")[0] || name;
                        setUserName(firstName);
                        setAvatarInitial(firstName.charAt(0).toUpperCase());

                        return;
                    }
                }

                // Final fallback

                const defaultName = role === "tutor" ? "Tutor" : role === "student" ? "Student" : "User";
                setUserName(defaultName);
                setAvatarInitial(defaultName.charAt(0).toUpperCase());

            } catch (error) {
                console.error("❌ Topbar - Error extracting user name:", error);
                const defaultName = role === "tutor" ? "Tutor" : role === "student" ? "Student" : "User";
                setUserName(defaultName);
                setAvatarInitial(defaultName.charAt(0).toUpperCase());
            }
        };

        extractUserName();

        // Listen for auth changes
        const handleAuthChange = () => {

            extractUserName();
        };

        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, [role, userData]); // Re-run when role or userData changes

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

    // Handle logo click - navigate to home
    const handleLogoClick = () => {
        navigate("/");
    };

    // Get dashboard route based on role
    const getDashboardRoute = () => {
        switch (role) {
            case 'admin':
                return '/admin-dashboard';
            case 'tutor':
                return '/tutor-dashboard';
            case 'student':
                return '/student-dashboard';
            default:
                return '/';
        }
    };

    // Get profile route based on role
    const getProfileRoute = () => {
        switch (role) {
            case 'admin':
                return '/admin-profile';
            case 'tutor':
                return '/tutor-profile-show';
            case 'student':
                return '/student_profile_show';
            default:
                return '/profile';
        }
    };

    const handleDashboardClick = () => {
        if (onDashboardClick) {
            onDashboardClick();
        } else {
            navigate(getDashboardRoute());
        }
        setDropdownOpen(false);
    };

    const handleProfileClick = () => {
        if (onProfileClick) {
            onProfileClick();
        } else {
            navigate(getProfileRoute());
        }
        setDropdownOpen(false);
    };

    // Show user name next to avatar
    const shouldShowUserName = showUserName && !isMobile && userName;

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

                <div className="topbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img src={Logo} alt="Logo" className="topbar-logo-image" />
                    <span className="topbar-logo-text">
                        <span className="text-primary">Drona</span>
                        <span className="text-secondary">charya</span>
                    </span>
                </div>
            </div>

            {/* Right Section */}
            <div className="topbar-right" ref={dropdownRef}>
                {/* User Avatar with Name and Dropdown */}
                <div
                    className={`topbar-user ${showDropdown ? "cursor-pointer" : ""}`}
                    onClick={() => showDropdown && setDropdownOpen((prev) => !prev)}
                >
                    <div className="topbar-avatar">
                        {avatarInitial}
                    </div>
                    {shouldShowUserName && (
                        <span className="topbar-username">
                            {userName}
                        </span>
                    )}
                </div>

                {/* Enhanced Dropdown Menu */}
                {showDropdown && dropdownOpen && (
                    <div className="topbar-dropdown">
                        {/* Dashboard Option - Conditionally rendered */}
                        {showDashboardOption && (
                            <button
                                onClick={handleDashboardClick}
                                className="topbar-dropdown-item"
                            >
                                <FiHome className="topbar-dropdown-icon" />
                                <span>Go to Dashboard</span>
                            </button>
                        )}

                        {/* Profile Option - Conditionally rendered */}
                        {showProfileOption && (
                            <button
                                onClick={handleProfileClick}
                                className="topbar-dropdown-item"
                            >
                                <FiUser className="topbar-dropdown-icon" />
                                <span>Profile</span>
                            </button>
                        )}

                        {/* Only show divider if there are items above logout */}
                        {(showDashboardOption || showProfileOption) && (
                            <div className="topbar-dropdown-divider"></div>
                        )}

                        {/* Logout Option - Always shown */}
                        <button
                            onClick={onLogout}
                            className="topbar-dropdown-item topbar-dropdown-item-logout"
                        >
                            <FiLogOut className="topbar-dropdown-icon" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}

                {/* Standalone Logout Button (when no dropdown) */}
                {!showDropdown && (
                    <button
                        onClick={onLogout}
                        className="topbar-logout-btn"
                    >
                        <FiLogOut />
                        <span className="topbar-logout-text">Logout</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Topbar;
