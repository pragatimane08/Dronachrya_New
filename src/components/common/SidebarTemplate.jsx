// // // src/common/SidebarTemplate.jsx
// // import React, { useEffect, useState, useCallback } from "react";
// // import { FiChevronLeft, FiChevronRight, FiLogOut, FiX } from "react-icons/fi";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const SidebarTemplate = ({
// //   isOpen,
// //   toggleSidebar,
// //   menuItems,
// //   submenuItems = [],
// //   profileData = {},
// //   onLogout,
// //   getInitials,
// //   isLoading = false,
// // }) => {
// //   const [activeIndex, setActiveIndex] = useState(null);
// //   const [activeSubItem, setActiveSubItem] = useState(null);
// //   const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
// //   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
// //   const [isTablet, setIsTablet] = useState(
// //     window.innerWidth >= 768 && window.innerWidth < 1024
// //   );

// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Handle responsiveness
// //   useEffect(() => {
// //     const handleResize = () => {
// //       const width = window.innerWidth;
// //       setIsMobile(width < 768);
// //       setIsTablet(width >= 768 && width < 1024);

// //       // Auto-expand sidebar on desktop
// //       if (width >= 1024 && !isOpen) {
// //         toggleSidebar();
// //       }
// //     };

// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, [isOpen, toggleSidebar]);

// //   // Auto-close sidebar on mobile when route changes
// //   useEffect(() => {
// //     if (isMobile && isOpen) {
// //       toggleSidebar();
// //     }
// //   }, [location.pathname, isMobile, isOpen, toggleSidebar]);

// //   // Track active menu + submenu
// //   useEffect(() => {
// //     const index = menuItems.findIndex(
// //       (item) =>
// //         item.route === location.pathname ||
// //         (item.hasSubmenu &&
// //           submenuItems.some((sub) => sub.route === location.pathname))
// //     );

// //     if (index !== activeIndex) {
// //       setActiveIndex(index);
// //     }

// //     const subItem = submenuItems.find((sub) => sub.route === location.pathname);
// //     if (subItem && activeSubItem !== subItem.label) {
// //       setActiveSubItem(subItem.label);
// //       if (index !== -1) {
// //         setOpenSubmenuIndex(index);
// //       }
// //     } else if (!subItem) {
// //       setActiveSubItem(null);
// //     }
// //   }, [location.pathname, menuItems, submenuItems, activeIndex, activeSubItem]);

// //   const handleMenuClick = useCallback(
// //     (index) => {
// //       const selectedItem = menuItems[index];

// //       if (index !== activeIndex) {
// //         setActiveIndex(index);
// //         setActiveSubItem(null);
// //       }

// //       if (selectedItem.hasSubmenu) {
// //         setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
// //       } else {
// //         setOpenSubmenuIndex(null);
// //         navigate(selectedItem.route);
// //       }
// //     },
// //     [menuItems, activeIndex, navigate, openSubmenuIndex]
// //   );

// //   const handleSubmenuClick = useCallback(
// //     (sub) => {
// //       if (activeSubItem !== sub.label) {
// //         setActiveSubItem(sub.label);
// //       }
// //       navigate(sub.route);
// //     },
// //     [activeSubItem, navigate]
// //   );

// //   // Profile initials
// //   const getProfileInitials = useCallback(() => {
// //     if (isLoading) return "⋯";
// //     if (getInitials && profileData.name) return getInitials(profileData.name);
// //     if (profileData.name) return profileData.name[0]?.toUpperCase();
// //     return "U";
// //   }, [isLoading, getInitials, profileData.name]);

// //   // Render profile details (no default userType handling anymore)
// //   const renderProfileDetails = useCallback(() => {
// //     if (!isOpen) return null;

// //     if (isLoading) {
// //       return (
// //         <div className="animate-pulse">
// //           <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
// //           <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div className="text-center">
// //         <h2 className="font-semibold text-sm md:text-base truncate">
// //           {profileData.name || "User"}
// //         </h2>
// //         {profileData.extra && (
// //           <p className="text-xs text-gray-300 truncate">{profileData.extra}</p>
// //         )}
// //         {profileData.location && (
// //           <p className="text-xs text-gray-300 truncate">{profileData.location}</p>
// //         )}
// //       </div>
// //     );
// //   }, [isOpen, isLoading, profileData]);

// //   // Determine sidebar classes
// //   const getSidebarClasses = () => {
// //     if (isMobile) {
// //       return `fixed inset-y-0 left-0 z-50 bg-[#2c3e91] h-full pt-4 pb-2 px-2 text-white flex flex-col shadow-lg transform transition-transform duration-300 ${
// //         isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full"
// //       }`;
// //     }

// //     return `bg-[#2c3e91] h-screen sticky top-0 rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col shadow-lg transition-all duration-300 ${
// //       isOpen ? "w-64" : "w-20"
// //     }`;
// //   };

// //   return (
// //     <>
// //       {isMobile && isOpen && (
// //         <div
// //           className="fixed inset-0 bg-black bg-opacity-50 z-40"
// //           onClick={toggleSidebar}
// //         />
// //       )}

// //       <div className={getSidebarClasses()}>
// //         {/* Toggle Button */}
// //         <div className="w-full flex justify-end pr-2 mb-4">
// //           <button
// //             onClick={toggleSidebar}
// //             className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
// //             aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
// //           >
// //             {isMobile ? (
// //               <FiX size={24} />
// //             ) : isOpen ? (
// //               <FiChevronLeft size={20} />
// //             ) : (
// //               <FiChevronRight size={20} />
// //             )}
// //           </button>
// //         </div>

// //         {/* Profile Section */}
// //         <div className="flex flex-col items-center mb-6 flex-shrink-0 px-2">
// //           {profileData.profileImage ? (
// //             <img
// //               src={profileData.profileImage}
// //               alt="Profile"
// //               className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-2"
// //             />
// //           ) : (
// //             <div className="w-14 h-14 bg-white text-[#2c3e91] rounded-full flex items-center justify-center text-xl font-bold shadow-md mb-2">
// //               {getProfileInitials()}
// //             </div>
// //           )}
// //           {renderProfileDetails()}
// //         </div>

// //         {isOpen && <hr className="w-full border-gray-400/50 my-3" />}

// //         {/* Menu */}
// //         <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
// //           <style>
// //             {`
// //               .no-scrollbar {
// //                 -ms-overflow-style: none;
// //                 scrollbar-width: none;
// //               }
// //               .no-scrollbar::-webkit-scrollbar {
// //                 display: none;
// //               }
// //             `}
// //           </style>
// //           <div className="h-full">
// //             <div className="flex flex-col gap-1">
// //               {menuItems.map((item, index) => (
// //                 <div key={index}>
// //                   <div
// //                     onClick={() => handleMenuClick(index)}
// //                     className={`flex items-center ${
// //                       isOpen ? "justify-start" : "justify-center"
// //                     } gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200 ${
// //                       activeIndex === index && !item.hasSubmenu
// //                         ? "bg-white text-[#2c3e91] font-semibold"
// //                         : "hover:bg-white/10"
// //                     }`}
// //                   >
// //                     <span className="text-lg flex-shrink-0">{item.icon}</span>
// //                     {isOpen && <span className="truncate">{item.label}</span>}
// //                     {item.hasSubmenu && isOpen && (
// //                       <span className="text-xs ml-auto flex-shrink-0">
// //                         {openSubmenuIndex === index ? "▲" : "▼"}
// //                       </span>
// //                     )}
// //                   </div>

// //                   {item.hasSubmenu &&
// //                     isOpen &&
// //                     openSubmenuIndex === index && (
// //                       <div className="ml-8 mt-1 mb-2 flex flex-col gap-1">
// //                         {submenuItems.map((sub, subIndex) => (
// //                           <div
// //                             key={subIndex}
// //                             onClick={() => handleSubmenuClick(sub)}
// //                             className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all ${
// //                               activeSubItem === sub.label
// //                                 ? "bg-white/20 font-semibold"
// //                                 : "hover:bg-white/10"
// //                             }`}
// //                           >
// //                             <span className="text-sm flex-shrink-0">
// //                               {sub.icon}
// //                             </span>
// //                             <span className="text-sm">{sub.label}</span>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </nav>

// //         {/* Logout */}
// //         <div className="mt-auto pt-2 border-t border-gray-400/50">
// //           <div
// //             onClick={onLogout}
// //             className={`flex items-center ${
// //               isOpen ? "justify-start" : "justify-center"
// //             } gap-3 px-4 py-3 rounded-md cursor-pointer transition-all hover:bg-red-500/80`}
// //           >
// //             <FiLogOut className="text-lg flex-shrink-0" />
// //             {isOpen && <span>Logout</span>}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default React.memo(SidebarTemplate);


// // src/common/SidebarTemplate.jsx
// // src/common/SidebarTemplate.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { FiChevronLeft, FiChevronRight, FiLogOut, FiX, FiMenu } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";

// const SidebarTemplate = ({
//   isOpen,
//   toggleSidebar,
//   menuItems,
//   submenuItems = [],
//   profileData = {},
//   onLogout,
//   getInitials,
//   isLoading = false,
// }) => {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [activeSubItem, setActiveSubItem] = useState(null);
//   const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Track active menu + submenu
//   useEffect(() => {
//     const index = menuItems.findIndex(
//       (item) =>
//         item.route === location.pathname ||
//         (item.hasSubmenu &&
//           submenuItems.some((sub) => sub.route === location.pathname))
//     );

//     if (index !== activeIndex) {
//       setActiveIndex(index);
//     }

//     const subItem = submenuItems.find((sub) => sub.route === location.pathname);
//     if (subItem && activeSubItem !== subItem.label) {
//       setActiveSubItem(subItem.label);
//       if (index !== -1) {
//         setOpenSubmenuIndex(index);
//       }
//     } else if (!subItem) {
//       setActiveSubItem(null);
//     }
//   }, [location.pathname, menuItems, submenuItems, activeIndex, activeSubItem]);

//   const handleMenuClick = useCallback(
//     (index) => {
//       const selectedItem = menuItems[index];

//       if (index !== activeIndex) {
//         setActiveIndex(index);
//         setActiveSubItem(null);
//       }

//       if (selectedItem.hasSubmenu) {
//         setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
//       } else {
//         setOpenSubmenuIndex(null);
//         navigate(selectedItem.route);
//       }
//     },
//     [menuItems, activeIndex, navigate, openSubmenuIndex]
//   );

//   const handleSubmenuClick = useCallback(
//     (sub) => {
//       if (activeSubItem !== sub.label) {
//         setActiveSubItem(sub.label);
//       }
//       navigate(sub.route);
//     },
//     [activeSubItem, navigate]
//   );

//   // Profile initials
//   const getProfileInitials = useCallback(() => {
//     if (isLoading) return "⋯";
//     if (getInitials && profileData.name) return getInitials(profileData.name);
//     if (profileData.name) return profileData.name[0]?.toUpperCase();
//     return "U";
//   }, [isLoading, getInitials, profileData.name]);

//   // Render profile details
//   const renderProfileDetails = useCallback(() => {
//     if (!isOpen) return null;

//     if (isLoading) {
//       return (
//         <div className="animate-pulse">
//           <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
//           <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center">
//         <h2 className="font-semibold truncate text-sm md:text-base">
//           {profileData.name || "User"}
//         </h2>
//         {profileData.extra && (
//           <p className="text-xs text-gray-300 truncate">{profileData.extra}</p>
//         )}
//         {profileData.location && (
//           <p className="text-xs text-gray-300 truncate">{profileData.location}</p>
//         )}
//       </div>
//     );
//   }, [isOpen, isLoading, profileData]);

//   // Sidebar classes
//   const getSidebarClasses = () => {
//     const baseClasses = "h-screen sticky top-0 rounded-r-3xl pt-6 pb-4 px-3 bg-gradient-to-b from-[#2c3e91] to-[#1a237e] text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out";
    
//     return `${baseClasses} ${isOpen ? "w-60" : "w-16"}`;
//   };

//   return (
//     <>
//       <div className={getSidebarClasses()}>
//         {/* Toggle Button */}
//         <div className="w-full flex justify-end mb-2">
//           <button
//             onClick={toggleSidebar}
//             className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200 hover:scale-105"
//             aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//           >
//             {isOpen ? (
//               <FiChevronLeft size={18} />
//             ) : (
//               <FiChevronRight size={18} />
//             )}
//           </button>
//         </div>

//         {/* Profile Section */}
//         <div className="flex flex-col items-center flex-shrink-0 mb-8 px-2">
//           {profileData.profileImage ? (
//             <img
//               src={profileData.profileImage}
//               alt="Profile"
//               className={`${isOpen ? 'w-14 h-14' : 'w-10 h-10'} rounded-full object-cover border-2 border-white shadow-lg mb-3 hover:scale-105 transition-all duration-200`}
//             />
//           ) : (
//             <div className={`${isOpen ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-sm'} bg-white text-[#2c3e91] rounded-full flex items-center justify-center font-bold shadow-lg mb-3 hover:scale-105 transition-all duration-200`}>
//               {getProfileInitials()}
//             </div>
//           )}
//           {renderProfileDetails()}
//         </div>

//         {isOpen && <hr className="w-full border-gray-300/30 my-4" />}

//         {/* Menu */}
//         <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
//           <style>
//             {`
//               .custom-scrollbar {
//                 scrollbar-width: none;
//                 -ms-overflow-style: none;
//               }
//               .custom-scrollbar::-webkit-scrollbar {
//                 display: none;
//               }
//             `}
//           </style>
//           <div className="h-full">
//             <div className="flex flex-col gap-2">
//               {menuItems.map((item, index) => (
//                 <div key={index}>
//                   <div
//                     onClick={() => handleMenuClick(index)}
//                     className={`flex items-center cursor-pointer transition-all duration-200 ${
//                       isOpen ? "justify-start" : "justify-center"
//                     } gap-4 px-4 py-3 rounded-xl hover:scale-105 ${
//                       activeIndex === index && !item.hasSubmenu
//                         ? "bg-white text-[#2c3e91] font-semibold shadow-lg"
//                         : "hover:bg-white/15 hover:shadow-md"
//                     }`}
//                   >
//                     <span className="flex-shrink-0 text-lg">{item.icon}</span>
//                     {isOpen && (
//                       <span className="truncate text-sm">{item.label}</span>
//                     )}
//                     {item.hasSubmenu && isOpen && (
//                       <span className="text-xs ml-auto flex-shrink-0 transition-transform duration-200">
//                         {openSubmenuIndex === index ? "▲" : "▼"}
//                       </span>
//                     )}
//                   </div>

//                   {item.hasSubmenu &&
//                     isOpen &&
//                     openSubmenuIndex === index && (
//                       <div className="ml-8 mt-2 mb-3 flex flex-col gap-1 animate-fadeIn">
//                         {submenuItems.map((sub, subIndex) => (
//                           <div
//                             key={subIndex}
//                             onClick={() => handleSubmenuClick(sub)}
//                             className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
//                               activeSubItem === sub.label
//                                 ? "bg-white/25 font-semibold shadow-md"
//                                 : "hover:bg-white/15"
//                             }`}
//                           >
//                             <span className="flex-shrink-0 text-sm">
//                               {sub.icon}
//                             </span>
//                             <span className="text-xs">
//                               {sub.label}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </nav>

//         {/* Logout */}
//         <div className="mt-auto pt-4 border-t border-gray-300/30">
//           <div
//             onClick={onLogout}
//             className={`flex items-center cursor-pointer transition-all duration-200 ${
//               isOpen ? "justify-start" : "justify-center"
//             } gap-4 px-4 py-3 rounded-xl hover:bg-red-500/80 hover:scale-105 hover:shadow-lg`}
//           >
//             <FiLogOut className="flex-shrink-0 text-lg" />
//             {isOpen && (
//               <span className="text-sm">Logout</span>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>
//         {`
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(-10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           .animate-fadeIn {
//             animation: fadeIn 0.3s ease-out;
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default React.memo(SidebarTemplate);


// src/common/SidebarTemplate.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import "./SidebarTemplate.css";

const SidebarTemplate = ({
  isOpen,
  toggleSidebar,
  menuItems,
  submenuItems = [],
  profileData = {},
  isLoading = false,
  isMobile = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Track active menu + submenu
  useEffect(() => {
    const index = menuItems.findIndex(
      (item) =>
        item.route === location.pathname ||
        (item.hasSubmenu &&
          submenuItems.some((sub) => sub.route === location.pathname))
    );

    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    const subItem = submenuItems.find((sub) => sub.route === location.pathname);
    if (subItem && activeSubItem !== subItem.label) {
      setActiveSubItem(subItem.label);
      if (index !== -1) {
        setOpenSubmenuIndex(index);
      }
    } else if (!subItem) {
      setActiveSubItem(null);
    }
  }, [location.pathname, menuItems, submenuItems, activeIndex, activeSubItem]);

  const handleMenuClick = useCallback(
    (index) => {
      const selectedItem = menuItems[index];

      if (index !== activeIndex) {
        setActiveIndex(index);
        setActiveSubItem(null);
      }

      if (selectedItem.hasSubmenu) {
        setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
      } else {
        setOpenSubmenuIndex(null);
        navigate(selectedItem.route);
        if (isMobile) {
          toggleSidebar();
        }
      }
    },
    [menuItems, activeIndex, navigate, openSubmenuIndex, isMobile, toggleSidebar]
  );

  const handleSubmenuClick = useCallback(
    (sub) => {
      if (activeSubItem !== sub.label) {
        setActiveSubItem(sub.label);
      }
      navigate(sub.route);
      if (isMobile) {
        toggleSidebar();
      }
    },
    [activeSubItem, navigate, isMobile, toggleSidebar]
  );

  // Profile initials
  const getProfileInitials = useCallback(() => {
    if (isLoading) return "⋯";
    if (profileData.name) return profileData.name[0]?.toUpperCase();
    return "U";
  }, [isLoading, profileData.name]);

  // Render profile details
  const renderProfileDetails = useCallback(() => {
    if (!isOpen) return null;

    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h2 className="font-semibold truncate text-sm md:text-base">
          {profileData.name || "User"}
        </h2>
        {profileData.extra && (
          <p className="text-xs text-gray-300 truncate">{profileData.extra}</p>
        )}
        {profileData.location && (
          <p className="text-xs text-gray-300 truncate">{profileData.location}</p>
        )}
      </div>
    );
  }, [isOpen, isLoading, profileData]);

  return (
    <div className={`sidebar-template ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Toggle Button */}
      <div className="sidebar-toggle-container">
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <FiChevronLeft size={18} />
          ) : (
            <FiChevronRight size={18} />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile-section">
        {profileData.profileImage ? (
          <img
            src={profileData.profileImage}
            alt="Profile"
            className={`sidebar-profile-image ${isOpen ? 'profile-image-large' : 'profile-image-small'}`}
          />
        ) : (
          <div className={`sidebar-profile-initials ${isOpen ? 'initials-large' : 'initials-small'}`}>
            {getProfileInitials()}
          </div>
        )}
        {renderProfileDetails()}
      </div>

      {isOpen && <hr className="sidebar-divider" />}

      {/* Menu */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-inner">
          <div className="sidebar-menu-items">
            {menuItems.map((item, index) => (
              <div key={index} className="sidebar-menu-item">
                <div
                  onClick={() => handleMenuClick(index)}
                  className={`sidebar-menu-link ${isOpen ? 'justify-start' : 'justify-center'} ${
                    activeIndex === index && !item.hasSubmenu
                      ? 'sidebar-menu-active'
                      : 'sidebar-menu-inactive'
                  }`}
                >
                  <span className="sidebar-menu-icon">{item.icon}</span>
                  {isOpen && (
                    <span className="sidebar-menu-label">{item.label}</span>
                  )}
                  {item.hasSubmenu && isOpen && (
                    <span className="sidebar-menu-arrow">
                      {openSubmenuIndex === index ? "▲" : "▼"}
                    </span>
                  )}
                </div>

                {item.hasSubmenu &&
                  isOpen &&
                  openSubmenuIndex === index && (
                    <div className="sidebar-submenu">
                      {submenuItems.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          onClick={() => handleSubmenuClick(sub)}
                          className={`sidebar-submenu-item ${
                            activeSubItem === sub.label
                              ? 'sidebar-submenu-active'
                              : 'sidebar-submenu-inactive'
                          }`}
                        >
                          <span className="sidebar-submenu-icon">
                            {sub.icon}
                          </span>
                          <span className="sidebar-submenu-label">
                            {sub.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default React.memo(SidebarTemplate);