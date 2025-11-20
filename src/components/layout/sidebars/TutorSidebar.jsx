import React, { useEffect, useState, useCallback } from "react";
import {
  FiActivity,
  FiCalendar,
  FiMessageSquare,
  FiMail,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiHelpCircle,
  FiUser,
  FiFileText,
  FiCreditCard,
  FiBookmark,
  FiUserPlus,
} from "react-icons/fi";
import SidebarTemplate from "../../common/SidebarTemplate";
import { getProfile } from "../../../api/repository/profile.repository";

const menuItems = [
  { icon: <FiActivity />, label: "Dashboard", route: "/tutor-dashboard" },
  { icon: <FiCalendar />, label: "My Classes", route: "/my_classes_tutor" },
  { icon: <FiMessageSquare />, label: "Messages", route: "/message_tutor" },
  // { icon: <FiMail />, label: "Enquiries", route: "/view_all_enquires" },
  { icon: <FiUsers />, label: "Students", route: "/Student_Filter" },
  { icon: <FiDollarSign />, label: "Invoices", route: "/tutor_invoice" },
  { icon: <FiSettings />, label: "Account", hasSubmenu: true },
  { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
];

const accountSubmenu = [
  { label: "Profile", icon: <FiUser />, route: "/tutor-profile-show" },
  { label: "Billing History", icon: <FiFileText />, route: "/billing_history_tutor" },
  { label: "Subscription Plan", icon: <FiCreditCard />, route: "/tutor_subscription_plan" },
  { label: "Bookmark", icon: <FiBookmark />, route: "/bookmark_tutor" },
  { label: "Refer Friends", icon: <FiUserPlus />, route: "/refer_tutor" },
];

const TutorSidebar = ({ isOpen, toggleSidebar }) => {
  const [tutorData, setTutorData] = useState({
    name: "Tutor",
    subjects: [],
    location: "Location not set",
    profileStatus: "pending",
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  // Ensure subjects is always returned as an array
  const ensureArray = useCallback((data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return [data];
    return [];
  }, []);

  // Fetch latest profile from API
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await getProfile();
      setTutorData({
        name: profile.name || "Tutor",
        subjects: ensureArray(profile.subjects),
        location: profile.Location?.city || profile.location || "Location not set",
        profileStatus: profile.profile_status || "pending",
        profileImage: profile.profile_photo || null,
      });
    } catch (err) {
      console.error("Failed to fetch tutor profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [ensureArray]);

  // Update tutor data from stored user (localStorage)
  const updateTutorDataFromUser = useCallback(
    (user) => {
      if (!user) return;
      const profile = user.profile || {};
      setTutorData({
        name: profile.name || "Tutor",
        subjects: ensureArray(profile.subjects),
        location:
          profile.Location?.city ||
          profile.Location?.address ||
          profile.location ||
          "Location not set",
        profileStatus: profile.profile_status || "pending",
        profileImage: profile.profile_photo || null,
      });
      setIsLoading(false);
    },
    [ensureArray]
  );

  useEffect(() => {
    // Load initial user data
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "tutor") updateTutorDataFromUser(user);

    // Fetch from API for latest data
    loadProfile();

    // Handle custom event for profile updates
    const handleProfileUpdate = () => loadProfile();

    // Handle localStorage user updates
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        if (updatedUser?.role === "tutor") updateTutorDataFromUser(updatedUser);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadProfile, updateTutorDataFromUser]);

  return (
    <SidebarTemplate
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      menuItems={menuItems}
      submenuItems={accountSubmenu}
      profileData={tutorData}
      onLogout={handleLogout}
      userType="tutor"
      isLoading={isLoading}
    />
  );
};

export default TutorSidebar;

