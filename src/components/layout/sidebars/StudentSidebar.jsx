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
  FiCheckSquare,
} from "react-icons/fi";

const menuItems = [
  { icon: <FiActivity />, label: "Dashboard", route: "/student-dashboard" },
  { icon: <FiCalendar />, label: "My Classes", route: "/student_classes" },
  { icon: <FiMessageCircle />, label: "Message", route: "/student_message_dashboard" },
  { icon: <FiUser />, label: "Account", hasSubmenu: true },
  { icon: <FiMessageCircle />, label: "Invoice", route: "/student_invoice" },
   { icon: <FiMessageCircle />, label: "Referal", route: "/student_referal" },
  { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
];

const accountSubmenu = [
  { label: "Profile", icon: <FiUser />, route: "/student_profile_show" },
  { label: "Billing History", icon: <FiCheckSquare />, route: "/student_billing_history" },
  { label: "Bookmark", icon: <FiBookmark />, route: "/student_bookmark" },
];

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    subjects: [],
    location: "",
  });

  const [activeIndex, setActiveIndex] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
        setStudentData({ name, subjects, location: loc });
      }
    };

    updateFromStorage(); // Initial load
    window.addEventListener("storageUpdate", updateFromStorage);

    return () => {
      window.removeEventListener("storageUpdate", updateFromStorage);
    };
  }, []);

  useEffect(() => {
    const foundMenu = menuItems.findIndex((item) =>
      item.route === location.pathname ||
      (item.hasSubmenu &&
        accountSubmenu.some((sub) => sub.route === location.pathname))
    );
    setActiveIndex(foundMenu);

    const foundSub = accountSubmenu.find(
      (sub) => sub.route === location.pathname
    );
    if (foundSub) {
      setActiveSubItem(foundSub.label);
      setOpenSubmenu(true);
    }
  }, [location.pathname]);

  const handleMenuClick = (index) => {
    const item = menuItems[index];
    setActiveIndex(index);
    setActiveSubItem(null);

    if (item.hasSubmenu) {
      setOpenSubmenu(true);
    } else {
      setOpenSubmenu(false);
      navigate(item.route);
    }
  };

  const handleSubmenuClick = (sub) => {
    setActiveSubItem(sub.label);
    navigate(sub.route);
  };

  return (
    <div
      className={`bg-[#2c3e91] h-full rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col items-center shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex md:flex`}
    >
      {/* Toggle */}
      <div className="w-full flex justify-end pr-2 mb-4">
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-14 h-14 bg-white text-[#2c3e91] rounded-full flex items-center justify-center text-xl font-bold shadow-md">
          {studentData.name?.charAt(0).toUpperCase() || "S"}
        </div>
        {isOpen && (
          <>
            <h2 className="mt-2 font-semibold text-base md:text-lg">
              {studentData.name}
            </h2>
            <p className="text-xs md:text-sm text-gray-300 mt-0.5">
              {studentData.subjects?.length
                ? `${studentData.subjects.length} Learning ${
                    studentData.subjects.length > 1 ? "Needs" : "Need"
                  }`
                : "No subjects added"}
            </p>
            <p className="text-xs md:text-sm text-gray-300">
              {studentData.location}
            </p>
          </>
        )}
      </div>

      <hr className="w-full border-gray-400 my-3" />

      {/* Menu */}
      <nav className="w-full flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => handleMenuClick(index)}
              className={`flex items-center ${
                isOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-2 rounded-md cursor-pointer transition-all duration-200
                ${
                  activeIndex === index &&
                  (!item.hasSubmenu || openSubmenu)
                    ? "bg-white text-[#2c3e91] font-semibold"
                    : "text-white hover:bg-white hover:text-[#2c3e91]"
                } text-sm md:text-base`}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </div>

            {/* Submenu */}
            {item.hasSubmenu &&
              isOpen &&
              openSubmenu &&
              activeIndex === index && (
                <div className="ml-8 mt-1 flex flex-col gap-1">
                  {accountSubmenu.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleSubmenuClick(sub)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all
                      text-xs md:text-sm ${
                        activeSubItem === sub.label
                          ? "bg-white text-[#2c3e91] font-semibold"
                          : "text-white hover:bg-white hover:text-[#2c3e91]"
                      }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{sub.label}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default StudentSidebar;
