import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiUser,
  FiUsers,
  FiCalendar,
  FiCheckSquare,
  FiSettings,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiMail,
} from "react-icons/fi";

const menuItems = [
  { icon: <FiActivity />, label: "Dashboard", route: "/tutor-dashboard" },
  { icon: <FiCalendar />, label: "My Classes", route: "/my_classes_tutor" },
  { icon: <FiCheckSquare />, label: "Messages", route: "/message_tutor" },
  { icon: <FiMail />, label: "Enquiries", route: "/view_all_enquires" }, // ✅ Updated icon
  { icon: <FiUsers />, label: "Student", route: "/Student_Filter" },
  { icon: <FiUsers />, label: "Invoice", route: "/tutor_invoice" },
    { icon: <FiUsers />, label: "Refral", route: "/refer_tutor" },
  

  { icon: <FiSettings />, label: "Account", hasSubmenu: true },
  { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
];

const accountSubmenu = [
  { label: "Profile", icon: <FiUser />, route: "/tutor-profile-show" },
  { label: "My Plans", icon: <FiCheckSquare />, route: "/my_plan_tutor" },
  { label: "Refer", icon: <FiDollarSign />, route: "/refer_tutor" },
];

const TutorSidebar = ({ isOpen, toggleSidebar }) => {
  const [tutorData, setTutorData] = useState({
    name: "Tutor",
    subjects: [],
    location: "Location not set",
    profileStatus: "pending",
  });

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user?.role === "tutor") {
            const name = user.profile?.name || "Tutor";
            const subjects = user.profile?.subjects || [];
            const location =
              user.profile?.Location?.city ||
              user.profile?.location?.city ||
              user.profile?.Location?.address ||
              "Location not set";
            const profileStatus = user.profile?.profile_status || "pending";

            setTutorData({ name, subjects, location, profileStatus });
          }
        } catch (e) {
          console.error("Error parsing localStorage user:", e);
        }
      }
    };

    updateFromStorage();
    window.addEventListener("storageUpdate", updateFromStorage);

    return () => {
      window.removeEventListener("storageUpdate", updateFromStorage);
    };
  }, []);

  useEffect(() => {
    const index = menuItems.findIndex(
      (item) =>
        item.route === location.pathname ||
        (item.hasSubmenu &&
          accountSubmenu.some((sub) => sub.route === location.pathname))
    );
    setActiveIndex(index);

    const subItem = accountSubmenu.find(
      (sub) => sub.route === location.pathname
    );
    if (subItem) {
      setActiveSubItem(subItem.label);
      setOpenSubmenu(true);
    } else {
      setOpenSubmenu(false); // Close submenu when navigating away
    }
  }, [location.pathname]);

  const getInitials = () => {
    if (!tutorData.name) return "T";
    const names = tutorData.name.trim().split(" ");
    return names.length === 1
      ? names[0][0].toUpperCase()
      : `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const handleMenuClick = (index) => {
    const selectedItem = menuItems[index];
    setActiveIndex(index);

    if (selectedItem.hasSubmenu) {
      setOpenSubmenu((prev) => !prev);
    } else {
      setOpenSubmenu(false);
      navigate(selectedItem.route);
    }

    setActiveSubItem(null);
  };

  const handleSubmenuClick = (sub) => {
    setActiveSubItem(sub.label);
    navigate(sub.route);
  };

  return (
    <div
      className={`bg-[#2c3e91] h-full rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col items-center shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        }`}
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
          {getInitials()}
        </div>
        {isOpen && (
          <>
            <h2 className="mt-2 font-semibold truncate max-w-full px-2 text-center text-base md:text-lg">
              {tutorData.name}
            </h2>
            <div className="flex gap-1 mt-1">
              <span
                className={`px-2 py-0.5 rounded text-xs md:text-sm ${tutorData.profileStatus === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-gray-800"
                  }`}
              >
                {tutorData.profileStatus}
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 mt-1 truncate max-w-full px-2 text-center">
              {tutorData.location}
            </p>
            {tutorData.subjects.length > 0 && (
              <div className="mt-1 flex flex-wrap justify-center gap-1 max-w-full">
                {tutorData.subjects.slice(0, 3).map((subject, idx) => (
                  <span
                    key={idx}
                    className="text-xs md:text-sm bg-blue-500/30 px-1.5 py-0.5 rounded"
                  >
                    {subject}
                  </span>
                ))}
                {tutorData.subjects.length > 3 && (
                  <span className="text-xs md:text-sm bg-blue-500/30 px-1.5 py-0.5 rounded">
                    +{tutorData.subjects.length - 3}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <hr className="w-full border-gray-400 my-3" />

      {/* Navigation */}
      <nav className="w-full flex flex-col gap-2 text-sm md:text-base">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => handleMenuClick(index)}
              className={`flex items-center ${isOpen ? "justify-start" : "justify-center"
                } gap-3 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${activeIndex === index &&
                  (!item.hasSubmenu || (item.hasSubmenu && openSubmenu))
                  ? "bg-white text-[#2c3e91] font-semibold"
                  : "text-white hover:bg-white hover:text-[#2c3e91]"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </div>

            {item.hasSubmenu &&
              isOpen &&
              openSubmenu &&
              activeIndex === index && (
                <div className="ml-8 mt-1 flex flex-col gap-1 text-xs md:text-sm">
                  {accountSubmenu.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleSubmenuClick(sub)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all ${activeSubItem === sub.label
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

export default TutorSidebar;
