// src/components/tutor/TutorTopbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../../components/common/Topbar";
import { getUser, getUserRole } from "../../../api/apiclient";

const TutorTopbar = ({ onMenuClick, isMobile = false }) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        const role = getUserRole();

        console.log("🎯 TutorTopbar - Starting user data load...");
        console.log("🎯 TutorTopbar - Raw user from storage:", user);
        console.log("🎯 TutorTopbar - User role:", role);

        if (user) {
          console.log("🎯 TutorTopbar - Setting user data:", user);
          setUserData(user);
          
          // Debug: Check all possible name locations
          console.log("🔍 Debug - User object structure:");
          console.log("🔍 user.name:", user.name);
          console.log("🔍 user.first_name:", user.first_name);
          console.log("🔍 user.last_name:", user.last_name);
          console.log("🔍 user.full_name:", user.full_name);
          console.log("🔍 user.firstName:", user.firstName);
          console.log("🔍 user.fullName:", user.fullName);
          
          if (user.profile) {
            console.log("🔍 Profile object exists");
            console.log("🔍 user.profile.name:", user.profile.name);
            console.log("🔍 user.profile.first_name:", user.profile.first_name);
            console.log("🔍 user.profile.last_name:", user.profile.last_name);
            console.log("🔍 user.profile.full_name:", user.profile.full_name);
          } else {
            console.log("❌ No profile object found");
          }
        } else {
          console.log("❌ TutorTopbar - No user found in storage");
          setUserData({});
        }
      } catch (error) {
        console.error("❌ TutorTopbar - Error loading user data:", error);
        setUserData({});
      }
    };

    loadUserData();

    // Listen for auth changes
    window.addEventListener("authChange", loadUserData);
    return () => window.removeEventListener("authChange", loadUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully!", { autoClose: 2000 });

    // Dispatch auth change event
    window.dispatchEvent(new Event("authChange"));

    setTimeout(() => navigate("/"), 2000);
  };

  const handleProfileClick = () => {
    navigate("/tutor-profile-show");
  };

  const handleDashboardClick = () => {
    navigate("/tutor-dashboard");
  };

  return (
    <>
      <Topbar
        role="tutor"
        userData={userData}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
        showDropdown={true}
        onProfileClick={handleProfileClick}
        onDashboardClick={handleDashboardClick}
        isMobile={isMobile}
        showDashboardOption={false}
        showProfileOption={true}
        showUserName={true}
      />
      <ToastContainer />
    </>
  );
};

export default TutorTopbar;