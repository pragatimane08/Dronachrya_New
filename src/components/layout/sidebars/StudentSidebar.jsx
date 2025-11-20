// import React, { useEffect, useState } from "react";
// import { FiActivity, FiCalendar, FiMessageCircle, FiUser, FiHelpCircle, FiBookmark, FiDollarSign, FiShare2 } from "react-icons/fi";
// import SidebarTemplate from "../../common/SidebarTemplate";
// import { getProfile } from "../../../api/repository/profile.repository";

// const menuItems = [
//   { icon: <FiActivity />, label: "Dashboard", route: "/student-dashboard" },
//   { icon: <FiCalendar />, label: "My Classes", route: "/student_classes" },
//   { icon: <FiMessageCircle />, label: "Messages", route: "/student_message_dashboard" },
//   { icon: <FiUser />, label: "Account", hasSubmenu: true },
//   { icon: <FiDollarSign />, label: "Invoices", route: "/student_invoice" },
//   { icon: <FiShare2 />, label: "Referrals", route: "/student_referal" },
//   { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
// ];

// const accountSubmenu = [
//   { label: "Profile", icon: <FiUser />, route: "/student_profile_show" },
//   { label: "Billing History", icon: <FiDollarSign />, route: "/student_billing_history" },
//   { label: "Bookmarks", icon: <FiBookmark />, route: "/student_bookmark" },
//   { label: "Subscription Plan", icon: <FiBookmark />, route: "/student_subscription_plan" },
// ];

// const StudentSidebar = ({ isOpen, toggleSidebar }) => {
//   const [studentData, setStudentData] = useState({
//     name: "",
//     subjects: [],
//     location: "Unknown",
//     profileImage: null,
//   });

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     window.location.href = "/login";
//   };

//   // ✅ Fetch latest profile from API
//   const loadProfile = async () => {
//     try {
//       const p = await getProfile();
//       setStudentData({
//         name: p.name || "",
//         subjects: p.subjects || [],
//         location: p.Location?.city || p.location || "Unknown",
//         profileImage: p.profile_photo || null,
//       });
//     } catch (err) {
//       console.error("Failed to fetch student profile:", err);
//     }
//   };

//   useEffect(() => {
//     loadProfile();

//     // ✅ Sync with localStorage updates too
//     const updateFromStorage = () => {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (user?.role === "student") {
//         const name = user.profile?.name || "";
//         const subjects = user.profile?.subjects || [];
//         const loc =
//           user.profile?.Location?.city ||
//           user.profile?.Location?.address ||
//           user.profile?.location ||
//           "Unknown";
//         const profileImage = user.profile?.profile_image || null;
//         setStudentData({ name, subjects, location: loc, profileImage });
//       }
//     };

//     window.addEventListener("storageUpdate", updateFromStorage);
//     return () => {
//       window.removeEventListener("storageUpdate", updateFromStorage);
//     };
//   }, []);

//   return (
//     <SidebarTemplate
//       isOpen={isOpen}
//       toggleSidebar={toggleSidebar}
//       menuItems={menuItems}
//       submenuItems={accountSubmenu}
//       profileData={studentData}
//       onLogout={handleLogout}
//       userType="student"
//     />
//   );
// };

// export default StudentSidebar;

import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiMessageCircle,
  FiUser,
  FiHelpCircle,
  FiBookmark,
  FiDollarSign,
  FiShare2,
  FiCreditCard,
  FiSearch,
  FiMail // ✅ Added for Find Instructor
} from "react-icons/fi";
import SidebarTemplate from "../../common/SidebarTemplate";
import { getProfile } from "../../../api/repository/profile.repository";

const menuItems = [
  { icon: <FiActivity />, label: "Dashboard", route: "/student-dashboard" },
   { icon: <FiMail />, label: " Enquiries", route: "/student_enquires" },
  { icon: <FiCalendar />, label: "My Classes", route: "/student_classes" },
  { icon: <FiMessageCircle />, label: "Messages", route: "/student_message_dashboard" },
  { icon: <FiSearch />, label: "Find Instructor", route: "/student_find_tutor" }, // ✅ Updated with search icon
  { icon: <FiUser />, label: "Account", hasSubmenu: true },
  { icon: <FiDollarSign />, label: "Invoices", route: "/student_invoice" },
  // { icon: <FiShare2 />, label: "Referrals", route: "/student_referal" },
  { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
];

const accountSubmenu = [
  { label: "Profile", icon: <FiUser />, route: "/student_profile_show" },
  { label: "Billing History", icon: <FiDollarSign />, route: "/student_billing_history" },
  { label: "Bookmarks", icon: <FiBookmark />, route: "/student_bookmark" },
  { label: "Subscription Plan", icon: <FiCreditCard />, route: "/student_subscription_plan" },
];

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    subjects: [],
    location: "Unknown",
    profileImage: null,
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  // ✅ Fetch latest profile from API
  const loadProfile = async () => {
    try {
      const p = await getProfile();
      setStudentData({
        name: p.name || "",
        subjects: p.subjects || [],
        location: p.Location?.city || p.location || "Unknown",
        profileImage: p.profile_photo || null,
      });
    } catch (err) {
      console.error("Failed to fetch student profile:", err);
    }
  };

  useEffect(() => {
    loadProfile();

    // ✅ Sync with localStorage updates too
    const updateFromStorage = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "student") {
        const name = user.profile?.name || "";
        const subjects = user.profile?.subjects || [];
        const loc =
          user.profile?.Location?.city ||
          user.profile?.Location?.address ||
          user.profile?.location ||
          "Unknown";
        const profileImage = user.profile?.profile_image || null;
        setStudentData({ name, subjects, location: loc, profileImage });
      }
    };

    window.addEventListener("storageUpdate", updateFromStorage);
    return () => {
      window.removeEventListener("storageUpdate", updateFromStorage);
    };
  }, []);

  return (
    <SidebarTemplate
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      menuItems={menuItems}
      submenuItems={accountSubmenu}
      profileData={studentData}
      onLogout={handleLogout}
      userType="student"
    />
  );
};

export default StudentSidebar;
