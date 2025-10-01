// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   FiActivity,
//   FiUser,
//   FiUsers,
//   FiCalendar,
//   FiCheckSquare,
//   FiSettings,
//   FiHelpCircle,
//   FiChevronLeft,
//   FiChevronRight,
//   FiDollarSign,
//   FiMail,
//   FiMessageSquare,
//   FiLogOut,
// } from "react-icons/fi";
// import { getProfile } from "../../../api/repository/profile.repository";

// const scrollbarStyle = `
//   .custom-scrollbar {
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//   }
//   .custom-scrollbar::-webkit-scrollbar {
//     display: none;
//   }
// `;

// const menuItems = [
//   { icon: <FiActivity />, label: "Dashboard", route: "/tutor-dashboard" },
//   { icon: <FiCalendar />, label: "My Classes", route: "/my_classes_tutor" },
//   { icon: <FiMessageSquare />, label: "Messages", route: "/message_tutor" },
//   { icon: <FiMail />, label: "Enquiries", route: "/view_all_enquires" },
//   { icon: <FiUsers />, label: "Students", route: "/Student_Filter" },
//   { icon: <FiDollarSign />, label: "Invoices", route: "/tutor_invoice" },
//   { icon: <FiSettings />, label: "Account", hasSubmenu: true },
//   { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
// ];

// const accountSubmenu = [
//   { label: "Profile", icon: <FiUser />, route: "/tutor-profile-show" },
//   { label: "My Plans", icon: <FiCheckSquare />, route: "/my_plan_tutor" },
//   { label: "Refer Friends", icon: <FiUsers />, route: "/refer_tutor" },
// ];

// const TutorSidebar = ({ isOpen, toggleSidebar }) => {
//   const [tutorData, setTutorData] = useState({
//     name: "Tutor",
//     subjects: [],
//     location: "Location not set",
//     profileStatus: "pending",
//     profileImage: null,
//   });

//   const [activeIndex, setActiveIndex] = useState(null);
//   const [activeSubItem, setActiveSubItem] = useState(null);
//   const [openSubmenu, setOpenSubmenu] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Ensure subjects is always an array
//   const ensureArray = (data) => {
//     if (Array.isArray(data)) return data;
//     if (typeof data === 'string') return [data];
//     if (data === null || data === undefined) return [];
//     return [];
//   };

//   // ✅ Fetch latest profile from API
//   const loadProfile = async () => {
//     try {
//       const p = await getProfile();
//       setTutorData({
//         name: p.name || "Tutor",
//         subjects: ensureArray(p.subjects),
//         location: p.Location?.city || p.location || "Location not set",
//         profileStatus: p.profile_status || "pending",
//         profileImage: p.profile_photo || null,
//       });
//     } catch (err) {
//       console.error("Failed to fetch tutor profile:", err);
//     }
//   };

//   useEffect(() => {
//     loadProfile();

//     // ✅ Listen for custom event when profile is updated elsewhere in the app
//     const handleProfileUpdate = () => {
//       loadProfile();
//     };

//     // ✅ Listen for localStorage changes
//     const handleStorageChange = (e) => {
//       if (e.key === "user") {
//         const user = e.newValue ? JSON.parse(e.newValue) : null;
//         if (user?.role === "tutor") {
//           updateTutorDataFromUser(user);
//         }
//       }
//     };

//     // ✅ Function to update tutor data from user object
//     const updateTutorDataFromUser = (user) => {
//       const name = user.profile?.name || "Tutor";
//       const subjects = ensureArray(user.profile?.subjects);
//       const loc =
//         user.profile?.Location?.city ||
//         user.profile?.Location?.address ||
//         user.profile?.location ||
//         "Location not set";
//       const profileStatus = user.profile?.profile_status || "pending";
//       const profileImage = user.profile?.profile_image || null;
      
//       setTutorData({ 
//         name, 
//         subjects, 
//         location: loc, 
//         profileStatus, 
//         profileImage 
//       });
//     };

//     // Add event listeners
//     window.addEventListener("profileUpdated", handleProfileUpdate);
//     window.addEventListener("storage", handleStorageChange);
    
//     // Also check if there's a user in localStorage on mount
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user?.role === "tutor") {
//       updateTutorDataFromUser(user);
//     }

//     // Cleanup
//     return () => {
//       window.removeEventListener("profileUpdated", handleProfileUpdate);
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   useEffect(() => {
//     const index = menuItems.findIndex(
//       (item) =>
//         item.route === location.pathname ||
//         (item.hasSubmenu &&
//           accountSubmenu.some((sub) => sub.route === location.pathname))
//     );
//     setActiveIndex(index);

//     const subItem = accountSubmenu.find(
//       (sub) => sub.route === location.pathname
//     );
//     if (subItem) {
//       setActiveSubItem(subItem.label);
//       setOpenSubmenu(true);
//     } else {
//       setOpenSubmenu(false);
//     }
//   }, [location.pathname]);

//   const getInitials = () => {
//     if (!tutorData.name) return "T";
//     const names = tutorData.name.trim().split(" ");
//     return names.length === 1
//       ? names[0][0].toUpperCase()
//       : `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
//   };

//   const handleMenuClick = (index) => {
//     const selectedItem = menuItems[index];
//     setActiveIndex(index);

//     if (selectedItem.hasSubmenu) {
//       setOpenSubmenu((prev) => !prev);
//     } else {
//       setOpenSubmenu(false);
//       navigate(selectedItem.route);
//     }

//     setActiveSubItem(null);
//   };

//   const handleSubmenuClick = (sub) => {
//     setActiveSubItem(sub.label);
//     navigate(sub.route);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     navigate("/login");
//   };

//   return (
//     <>
//       <style>{scrollbarStyle}</style>

//       <div
//         className={`bg-[#2c3e91] h-screen sticky top-0 rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col shadow-lg transition-all duration-300 ${
//           isOpen ? "w-64" : "w-20"
//         }`}
//       >
//         <div className="w-full flex justify-end pr-2 mb-4">
//           <button
//             onClick={toggleSidebar}
//             className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
//           >
//             {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
//           <div className="flex flex-col items-center mb-4 px-2">
//             {tutorData.profileImage ? (
//               <img
//                 src={tutorData.profileImage}
//                 alt="Profile"
//                 className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-3"
//               />
//             ) : (
//               <div className="w-14 h-14 bg-white text-[#2c3e91] rounded-full flex items-center justify-center text-xl font-bold shadow-md mb-3">
//                 {getInitials()}
//               </div>
//             )}
//             {isOpen && (
//               <div className="w-full text-center">
//                 <h2 className="font-semibold text-lg truncate">
//                   {tutorData.name}
//                 </h2>
//                 <div className="flex justify-center mt-1">
//                   <span
//                     className={`px-2 py-0.5 rounded text-xs ${
//                       tutorData.profileStatus === "approved"
//                         ? "bg-green-500 text-white"
//                         : "bg-yellow-500 text-gray-800"
//                     }`}
//                   >
//                     {tutorData.profileStatus}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-300 mt-1 truncate">
//                   {tutorData.location}
//                 </p>
//                 {tutorData.subjects.length > 0 && (
//                   <div className="mt-2 flex flex-wrap justify-center gap-1">
//                     {tutorData.subjects.slice(0, 3).map((subject, idx) => (
//                       <span
//                         key={idx}
//                         className="text-xs bg-blue-500/30 px-2 py-0.5 rounded"
//                       >
//                         {subject}
//                       </span>
//                     ))}
//                     {tutorData.subjects.length > 3 && (
//                       <span className="text-xs bg-blue-500/30 px-2 py-0.5 rounded">
//                         +{tutorData.subjects.length - 3}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <hr className="w-full border-gray-400/50 my-3" />

//           <nav className="w-full flex flex-col gap-1">
//             {menuItems.map((item, index) => (
//               <div key={index} className="mb-1">
//                 <div
//                   onClick={() => handleMenuClick(index)}
//                   className={`flex items-center ${
//                     isOpen ? "justify-start" : "justify-center"
//                   } gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200 ${
//                     activeIndex === index && !item.hasSubmenu
//                       ? "bg-white text-[#2c3e91] font-semibold"
//                       : "hover:bg-white/10"
//                   }`}
//                 >
//                   <span className="text-lg flex-shrink-0">{item.icon}</span>
//                   {isOpen && (
//                     <span className="truncate flex-grow">{item.label}</span>
//                   )}
//                   {item.hasSubmenu && isOpen && (
//                     <span className="text-xs">
//                       {openSubmenu && activeIndex === index ? "▲" : "▼"}
//                     </span>
//                   )}
//                 </div>

//                 {item.hasSubmenu &&
//                   isOpen &&
//                   openSubmenu &&
//                   activeIndex === index && (
//                     <div className="ml-8 mt-1 mb-2 flex flex-col gap-1">
//                       {accountSubmenu.map((sub, subIndex) => (
//                         <div
//                           key={subIndex}
//                           onClick={() => handleSubmenuClick(sub)}
//                           className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all ${
//                             activeSubItem === sub.label
//                               ? "bg-white/20 font-semibold"
//                               : "hover:bg-white/10"
//                           }`}
//                         >
//                           <span className="text-sm">{sub.icon}</span>
//                           <span className="text-sm">{sub.label}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//               </div>
//             ))}
//           </nav>
//         </div>

//         <div className="mt-auto pt-2 border-t border-gray-400/50">
//           <div
//             onClick={handleLogout}
//             className={`flex items-center mt-2 ${
//               isOpen ? "justify-start" : "justify-center"
//             } gap-3 px-4 py-3 rounded-md cursor-pointer transition-all hover:bg-red-500/80`}
//           >
//             <FiLogOut className="text-lg" />
//             {isOpen && <span>Logout</span>}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TutorSidebar;
<<<<<<< HEAD


=======
// src/components/tutor/TutorSidebar.jsx
>>>>>>> cac235298da95deccf6cd953a03454e3e250d1f3
// src/components/tutor/TutorSidebar.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FiActivity, FiUser, FiUsers, FiCalendar, FiCheckSquare, FiSettings, FiHelpCircle, FiDollarSign, FiMail, FiMessageSquare } from "react-icons/fi";
import SidebarTemplate from "../../common/SidebarTemplate";
import { getProfile } from "../../../api/repository/profile.repository";

const menuItems = [
  { icon: <FiActivity />, label: "Dashboard", route: "/tutor-dashboard" },
  { icon: <FiCalendar />, label: "My Classes", route: "/my_classes_tutor" },
  { icon: <FiMessageSquare />, label: "Messages", route: "/message_tutor" },
  { icon: <FiMail />, label: "Enquiries", route: "/view_all_enquires" },
  { icon: <FiUsers />, label: "Students", route: "/Student_Filter" },
  { icon: <FiDollarSign />, label: "Invoices", route: "/tutor_invoice" },
  { icon: <FiSettings />, label: "Account", hasSubmenu: true },
  { icon: <FiHelpCircle />, label: "Help Center", route: "/help-center" },
];

const accountSubmenu = [
  { label: "Profile", icon: <FiUser />, route: "/tutor-profile-show" },
  { label: "Billing History", icon: <FiCheckSquare />, route: "/billing_history_tutor" },
  { label: "Subscription Plan", icon: <FiUsers />, route: "/tutor_subscription_plan" },
  { label: "Bookmark", icon: <FiUsers />, route: "/bookmark_tutor" },
<<<<<<< HEAD
  { label: "Refer Friends", icon: <FiUsers />, route: "/refer_tutor" },
=======
  // { label: "Refer Friends", icon: <FiUsers />, route: "/refer_tutor" },
>>>>>>> cac235298da95deccf6cd953a03454e3e250d1f3
];

const TutorSidebar = ({ isOpen, toggleSidebar }) => {
  const [tutorData, setTutorData] = useState({
    name: "",
    subjects: [],
    location: "",
    profileStatus: "",
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  // ✅ Ensure subjects is always an array
  const ensureArray = useCallback((data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return [data];
    if (data === null || data === undefined) return [];
    return [];
  }, []);

  // ✅ Fetch latest profile from API
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const p = await getProfile();
      setTutorData({
        name: p.name || "Tutor",
        subjects: ensureArray(p.subjects),
        location: p.Location?.city || p.location || "Location not set",
        profileStatus: p.profile_status || "pending",
        profileImage: p.profile_photo || null,
      });
    } catch (err) {
      console.error("Failed to fetch tutor profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [ensureArray]);

  // ✅ Function to update tutor data from user object
  const updateTutorDataFromUser = useCallback((user) => {
    const name = user.profile?.name || "Tutor";
    const subjects = ensureArray(user.profile?.subjects);
    const loc =
      user.profile?.Location?.city ||
      user.profile?.Location?.address ||
      user.profile?.location ||
      "Location not set";
    const profileStatus = user.profile?.profile_status || "pending";
    const profileImage = user.profile?.profile_image || null;
    
    setTutorData({ 
      name, 
      subjects, 
      location: loc, 
      profileStatus, 
      profileImage 
    });
    setIsLoading(false);
  }, [ensureArray]);

  useEffect(() => {
    // Check localStorage first for immediate data
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "tutor") {
      updateTutorDataFromUser(user);
    }

    // Then fetch the latest data from API
    loadProfile();

    // ✅ Listen for custom event when profile is updated elsewhere in the app
    const handleProfileUpdate = () => {
      loadProfile();
    };

    // ✅ Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const user = e.newValue ? JSON.parse(e.newValue) : null;
        if (user?.role === "tutor") {
          updateTutorDataFromUser(user);
        }
      }
    };

    // Add event listeners
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
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

export default React.memo(TutorSidebar);