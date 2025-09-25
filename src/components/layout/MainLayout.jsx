// import React, { useState } from "react";
// import Topbar from "./Topbar";
// import AdminSidebar from "./sidebars/AdminSidebar";
// import StudentSidebar from "./sidebars/StudentSidebar";
// import TutorSidebar from "./sidebars/TutorSidebar";
// import TutorTopbar from "./topbars/TutorTopbar";
// import StudentTopbar from "./topbars/TutorTopbar";
// import AdminTopbar from "./topbars/TutorTopbar";

// const MainLayout = ({ role, children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   let SidebarComponent;

//   switch (role) {
//     case "admin":
//       SidebarComponent = (
//         <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       );
//       break;
//     case "student":
//       SidebarComponent = (
//         <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       );
//       break;
//     case "tutor":
//       SidebarComponent = (
//         <TutorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       );
//       break;
//     default:
//       SidebarComponent = null;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Topbar onMenuClick={toggleSidebar} role={role} />

//       <div className="flex flex-1 pt-[52px]">
//         {/* Sidebar */}
//         {SidebarComponent && (
//           <div className="fixed top-[52px] left-0 bottom-0 z-40">
//             {SidebarComponent}
//           </div>
//         )}

//         {/* Content Area */}
//         <div
//           className={`flex-1 min-h-[calc(100vh-52px)] transition-all duration-300
//             ${
//               SidebarComponent
//                 ? isSidebarOpen
//                   ? "ml-64"
//                   : "ml-20"
//                 : ""
//             }`}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

// import React, { useState, useEffect } from "react";
// import AdminSidebar from "./sidebars/AdminSidebar";
// import StudentSidebar from "./sidebars/StudentSidebar";
// import TutorSidebar from "./sidebars/TutorSidebar";

// import TutorTopbar from "./topbars/TutorTopbar";
// import StudentTopbar from "./topbars/StudentTopbar";
// import AdminTopbar from "./topbars/AdminTopbar";

// const MainLayout = ({ role, children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.profile?.name || "");
//       } catch (e) {
//         console.error("Error parsing user from localStorage:", e);
//       }
//     }
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   let SidebarComponent;
//   let TopbarComponent;

//   switch (role) {
//     case "admin":
//       SidebarComponent = (
//         <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       );
//       TopbarComponent = (
//         <AdminTopbar
//           onMenuClick={toggleSidebar}
//           name={userName}
//           onLogout={handleLogout}
//         />
//       );
//       break;

//     case "student":
//       SidebarComponent = (
//         <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       );
//       TopbarComponent = (
//         <StudentTopbar
//           onMenuClick={toggleSidebar}
//           name={userName}
//           onLogout={handleLogout}
//         />
//       );
//       break;

//     case "tutor":
//       SidebarComponent = (
//         <TutorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       );
//       TopbarComponent = (
//         <TutorTopbar
//           onMenuClick={toggleSidebar}
//           name={userName}
//           onLogout={handleLogout}
//         />
//       );
//       break;

//     default:
//       SidebarComponent = null;
//       TopbarComponent = null;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {TopbarComponent}

//       <div className="flex flex-1 pt-[52px]">
//         {/* Sidebar */}
//         {SidebarComponent && (
//           <div className="fixed top-[52px] left-0 bottom-0 z-40">
//             {SidebarComponent}
//           </div>
//         )}

//         {/* Content Area */}
//         <div
//           className={`flex-1 min-h-[calc(100vh-52px)] transition-all duration-300
//             ${
//               SidebarComponent
//                 ? isSidebarOpen
//                   ? "ml-64"
//                   : "ml-20"
//                 : ""
//             }`}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

// src/layout/MainLayout.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "./sidebars/AdminSidebar";
import StudentSidebar from "./sidebars/StudentSidebar";
import TutorSidebar from "./sidebars/TutorSidebar";
import TutorTopbar from "./topbars/TutorTopbar";
import StudentTopbar from "./topbars/StudentTopbar";
import AdminTopbar from "./topbars/AdminTopbar";
import "./MainLayout.css";

const MainLayout = ({ role, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser?.profile?.name || "",
          firstName: parsedUser?.profile?.firstName || "",
          fullName: parsedUser?.profile?.fullName || ""
        });
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  let SidebarComponent;
  let TopbarComponent;

  switch (role) {
    case "admin":
      SidebarComponent = (
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          isMobile={isMobile}
        />
      );
      TopbarComponent = (
        <AdminTopbar
          onMenuClick={toggleSidebar}
          userData={userData}
          onLogout={handleLogout}
          isMobile={isMobile}
        />
      );
      break;

    case "student":
      SidebarComponent = (
        <StudentSidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          isMobile={isMobile}
        />
      );
      TopbarComponent = (
        <StudentTopbar
          onMenuClick={toggleSidebar}
          userData={userData}
          onLogout={handleLogout}
          isMobile={isMobile}
        />
      );
      break;

    case "tutor":
      SidebarComponent = (
        <TutorSidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          isMobile={isMobile}
        />
      );
      TopbarComponent = (
        <TutorTopbar
          onMenuClick={toggleSidebar}
          userData={userData}
          onLogout={handleLogout}
          isMobile={isMobile}
        />
      );
      break;

    default:
      SidebarComponent = null;
      TopbarComponent = null;
  }

  return (
    <div className="main-layout">
      {TopbarComponent}

      <div className="layout-content">
        {/* Sidebar Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        {SidebarComponent && (
          <div className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {SidebarComponent}
          </div>
        )}

        {/* Content Area */}
        <div className={`main-content ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          <div className="content-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;