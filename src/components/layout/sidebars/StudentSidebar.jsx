import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiCalendar,
  FiMessageCircle,
  FiUser,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiBookmark,
  FiDollarSign,
  FiShare2,
  FiLogOut,
} from "react-icons/fi";
import { getProfile } from "../../../api/repository/profile.repository";

const menuItems = [
  { icon: <FiActivity />, label: "Dashboard", route: "/student-dashboard" },
  { icon: <FiCalendar />, label: "My Classes", route: "/student_classes" },
  { icon: <FiMessageCircle />, label: "Messages", route: "/student_message_dashboard" },
  { icon: <FiUser />, label: "Account", hasSubmenu: true },
  { icon: <FiDollarSign />, label: "Invoices", route: "/student_invoice" },
  { icon: <FiShare2 />, label: "Referrals", route: "/student_referal" },
  { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
];

const accountSubmenu = [
  { label: "Profile", icon: <FiUser />, route: "/student_profile_show" },
  { label: "Billing History", icon: <FiDollarSign />, route: "/student_billing_history" },
  { label: "Bookmarks", icon: <FiBookmark />, route: "/student_bookmark" },
];

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    subjects: [],
    location: "Unknown",
    profileImage: null,
  });

  const [activeIndex, setActiveIndex] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const foundMenu = menuItems.findIndex(
      (item) =>
        item.route === location.pathname ||
        (item.hasSubmenu && accountSubmenu.some((sub) => sub.route === location.pathname))
    );
    setActiveIndex(foundMenu);

    const foundSub = accountSubmenu.find((sub) => sub.route === location.pathname);
    if (foundSub) {
      setActiveSubItem(foundSub.label);
      setOpenSubmenu(true);
    } else {
      setOpenSubmenu(false);
    }
  }, [location.pathname]);

  const handleMenuClick = (index) => {
    const item = menuItems[index];
    setActiveIndex(index);
    setActiveSubItem(null);

    if (item.hasSubmenu) {
      setOpenSubmenu(!openSubmenu);
    } else {
      setOpenSubmenu(false);
      navigate(item.route);
    }
  };

  const handleSubmenuClick = (sub) => {
    setActiveSubItem(sub.label);
    navigate(sub.route);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div
      className={`bg-[#2c3e91] h-screen sticky top-0 rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Toggle */}
      <div className="w-full flex justify-end pr-2 mb-4">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-4 flex-shrink-0">
        {studentData.profileImage ? (
          <img
            src={studentData.profileImage}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
          />
        ) : (
          <div className="w-14 h-14 bg-white text-[#2c3e91] rounded-full flex items-center justify-center text-xl font-bold shadow-md">
            {studentData.name?.charAt(0).toUpperCase() || "S"}
          </div>
        )}
        {isOpen && (
          <>
            <h2 className="mt-2 font-semibold text-base md:text-lg truncate max-w-full px-2 text-center">
              {studentData.name || "Student"}
            </h2>
            <p className="text-xs md:text-sm text-gray-300 mt-0.5">
              {studentData.subjects?.length
                ? `${studentData.subjects.length} Learning ${
                    studentData.subjects.length > 1 ? "Needs" : "Need"
                  }`
                : "No subjects added"}
            </p>
            <p className="text-xs md:text-sm text-gray-300 truncate max-w-full px-2 text-center">
              {studentData.location}
            </p>
          </>
        )}
      </div>

      <hr className="w-full border-gray-400/50 my-3" />

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="flex flex-col gap-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => handleMenuClick(index)}
                className={`flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200 ${
                  activeIndex === index && !item.hasSubmenu
                    ? "bg-white text-[#2c3e91] font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="truncate">{item.label}</span>}
                {item.hasSubmenu && isOpen && (
                  <span className="text-xs ml-auto">
                    {openSubmenu && activeIndex === index ? "▲" : "▼"}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {item.hasSubmenu &&
                isOpen &&
                openSubmenu &&
                activeIndex === index && (
                  <div className="ml-8 mt-1 flex flex-col gap-1 mb-2">
                    {accountSubmenu.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => handleSubmenuClick(sub)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all ${
                          activeSubItem === sub.label
                            ? "bg-white/20 font-semibold"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm">{sub.icon}</span>
                        <span className="text-sm">{sub.label}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-2 border-t border-gray-400/50">
        <div
          onClick={handleLogout}
          className={`flex items-center ${
            isOpen ? "justify-start" : "justify-center"
          } gap-3 px-4 py-3 rounded-md cursor-pointer transition-all hover:bg-red-500/80`}
        >
          <FiLogOut className="text-lg" />
          {isOpen && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
