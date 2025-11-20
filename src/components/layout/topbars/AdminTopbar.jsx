import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../../components/common/Topbar";
import { getUser, getUserRole } from "../../../api/apiclient";

const AdminTopbar = ({ onMenuClick, isMobile = false }) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  // Super debugging function to see everything in user object
  const debugUserObject = (user) => {
    console.log("🕵️‍♂️ === ADMIN USER OBJECT DEBUG ===");
    console.log("Full user object:", user);
    
    if (user) {
      // Log all top-level properties
      console.log("📋 Top-level properties:");
      Object.keys(user).forEach(key => {
        console.log(`  ${key}:`, user[key]);
      });
      
      // Log profile properties if exists
      if (user.profile) {
        console.log("📋 Profile properties:");
        Object.keys(user.profile).forEach(key => {
          console.log(`  profile.${key}:`, user.profile[key]);
        });
      }
    }
    console.log("🕵️‍♂️ === END ADMIN DEBUG ===");
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        const role = getUserRole();
        
        console.log("🔍 AdminTopbar - Starting user data load...");
        debugUserObject(user); // Super debug
        
        if (user) {
          let name = "";
          let foundIn = "";

          // Comprehensive search through all possible name locations
          const searchPaths = [
            { path: user.profile?.name, location: "user.profile.name" },
            { path: user.profile?.first_name, location: "user.profile.first_name" },
            { path: user.profile?.full_name, location: "user.profile.full_name" },
            { path: user.profile?.firstName, location: "user.profile.firstName" },
            { path: user.profile?.fullName, location: "user.profile.fullName" },
            { path: user.profile?.username, location: "user.profile.username" },
            { path: user.name, location: "user.name" },
            { path: user.first_name, location: "user.first_name" },
            { path: user.full_name, location: "user.full_name" },
            { path: user.firstName, location: "user.firstName" },
            { path: user.fullName, location: "user.fullName" },
            { path: user.username, location: "user.username" },
            { path: user.displayName, location: "user.displayName" },
            { path: user.display_name, location: "user.display_name" },
            { path: user.email?.split('@')[0], location: "user.email (extracted)" }
          ];

          for (const { path, location } of searchPaths) {
            if (path && typeof path === 'string' && path.trim() !== "" && path !== "Admin") {
              name = path.trim();
              foundIn = location;
              console.log(`✅ AdminTopbar - Found name in ${location}:`, name);
              break;
            }
          }

          // Final fallback
          if (!name) {
            name = "Admin";
            foundIn = "fallback";
            console.log("⚠️ AdminTopbar - No name found, using fallback");
          } else {
            console.log(`🎉 AdminTopbar - Name extracted from ${foundIn}:`, name);
          }

          const firstName = name.split(" ")[0] || name;
          const fullName = name;

          const userDataObj = {
            role: role || "admin",
            firstName,
            fullName,
            name,
            profile: user.profile || {}
          };

          console.log("🎉 AdminTopbar - Final user data:", userDataObj);
          setUserData(userDataObj);
        } else {
          console.log("❌ AdminTopbar - No user found");
          setUserData({
            role: "admin",
            firstName: "Admin",
            fullName: "Administrator",
            name: "Admin",
            profile: {}
          });
        }
      } catch (error) {
        console.error("❌ AdminTopbar - Error loading user data:", error);
        setUserData({
          role: "admin",
          firstName: "Admin",
          fullName: "Administrator",
          name: "Admin",
          profile: {}
        });
      }
    };

    loadUserData();

    // Listen for auth changes
    window.addEventListener('authChange', loadUserData);
    return () => window.removeEventListener('authChange', loadUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully!", { autoClose: 2000 });
    
    // Dispatch auth change for navbar
    window.dispatchEvent(new Event('authChange'));
    
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <>
      <Topbar
        role="admin"
        userData={userData}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
        showDropdown={true}
        isMobile={isMobile}
        showDashboardOption={false}
        showProfileOption={false}
        showUserName={true}
      />
      <ToastContainer />
    </>
  );
};

export default AdminTopbar;