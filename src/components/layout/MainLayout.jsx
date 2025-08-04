import React, { useState } from "react";
import Topbar from "./Topbar";
import AdminSidebar from "./sidebars/AdminSidebar";
import StudentSidebar from "./sidebars/StudentSidebar";
import TutorSidebar from "./sidebars/TutorSidebar";

const MainLayout = ({ role, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  let SidebarComponent;

  switch (role) {
    case "admin":
      SidebarComponent = (
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      );
      break;
    case "student":
      SidebarComponent = (
        <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      );
      break;
    case "tutor":
      SidebarComponent = (
        <TutorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      );
      break;
    default:
      SidebarComponent = null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onMenuClick={toggleSidebar} role={role} />

      <div className="flex flex-1 pt-[52px]">
        {/* Sidebar */}
        {SidebarComponent && (
          <div className="fixed top-[52px] left-0 bottom-0 z-40">
            {SidebarComponent}
          </div>
        )}

        {/* Content Area */}
        <div
          className={`flex-1 min-h-[calc(100vh-52px)] transition-all duration-300
            ${
              SidebarComponent
                ? isSidebarOpen
                  ? "ml-64"
                  : "ml-20"
                : ""
            }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
