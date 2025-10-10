import { FiHome, FiUsers, FiUser, FiClipboard, FiTag, FiGift, FiSend, FiBarChart2, FiFileText } from "react-icons/fi";
import SidebarTemplate from "../../common/SidebarTemplate";

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
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <SidebarTemplate
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      menuItems={menuItems}
      profileData={{
        name: user?.profile?.name || "Admin",
        extra: "admin@dronacharya.com",
      }}
      onLogout={handleLogout}
      userType="admin"
    />
  );
};

export default AdminSidebar;