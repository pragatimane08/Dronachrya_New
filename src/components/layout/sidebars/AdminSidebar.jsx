// src/components/Admin/AdminSidebar.js
import { FiHome, FiUsers, FiUser, FiClipboard, FiTag, FiGift, FiSend, FiBarChart2, FiFileText } from "react-icons/fi";
import SidebarTemplate from "../../common/SidebarTemplate";
import { useEffect, useState } from "react";

const menuItems = [
  { icon: <FiHome />, label: "Dashboard", route: "/admin-dashboard" },
  { icon: <FiUsers />, label: "Manage Tutors", route: "/admin_manage_tutor" },
  { icon: <FiUser />, label: "Manage Students", route: "/admin_manage_students" },
  { icon: <FiClipboard />, label: "Student Enquiries", route: "/admin_student_enquiries" },
  { icon: <FiClipboard />, label: "Subscriptions", route: "/admin_subscriptions" },
  { icon: <FiTag />, label: "Coupons & Offers", route: "/admin_coupon_offers" },
  { icon: <FiGift />, label: "Referral Codes", route: "/admin_referral_code" },
  { icon: <FiSend />, label: "Enquiries", route: "/admin_send_notifications" },
  { icon: <FiBarChart2 />, label: "Analytics", route: "/admin_analysis" },
  { icon: <FiFileText />, label: "Invoices", route: "/admin_invoices" },
  { icon: <FiUsers />, label: "Clases", route: "/admin_group_clases" },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const [userData, setUserData] = useState({
    name: "Admin",
    email: "admin@dronacharya.com"
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      console.log("🔄 Loading admin user data...");
      
      // Check localStorage first (for persistent login)
      const storedUser = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      
      console.log("📁 Stored User:", storedUser);
      console.log("🔑 Auth Token:", authToken ? "Present" : "Missing");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("✅ Parsed User Object:", user);
        
        if (user.name || user.email) {
          setUserData({
            name: user.name || "Admin",
            email: user.email || "admin@dronacharya.com"
          });
          console.log("✅ User data set from localStorage");
          return;
        }
      }

      // If no user in localStorage, check if we have individual items
      const userName = localStorage.getItem("user_name");
      const userEmail = localStorage.getItem("user_email");
      
      if (userName || userEmail) {
        setUserData({
          name: userName || "Admin",
          email: userEmail || "admin@dronacharya.com"
        });
        console.log("✅ User data set from individual items");
        return;
      }

      // Fallback: Check sessionStorage
      const sessionUser = sessionStorage.getItem("user");
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        if (user.name || user.email) {
          setUserData({
            name: user.name || "Admin",
            email: user.email || "admin@dronacharya.com"
          });
          console.log("✅ User data set from sessionStorage");
          return;
        }
      }

      console.warn("⚠️ Using default admin data - no user data found in storage");
      
    } catch (error) {
      console.error("❌ Error loading user data:", error);
    }
  };

  const handleLogout = () => {
    console.log("🚪 Logging out admin...");
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = "/admin-login";
  };

  return (
    <SidebarTemplate
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      menuItems={menuItems}
      profileData={{
        name: userData.name,
        extra: userData.email,
      }}
      onLogout={handleLogout}
      userType="admin"
    />
  );
};

export default AdminSidebar;