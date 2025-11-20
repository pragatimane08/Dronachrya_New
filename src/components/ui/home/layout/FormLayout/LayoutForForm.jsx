// src/components/Layout/Layout.jsx
import React from "react";
import TopbarForFrom from "./TopbarForFrom";

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (only if showNavbar is true) */}
      {showNavbar && <TopbarForFrom />}

      {/* Main Page Content */}
      <main className={`flex-1 ${showNavbar ? "pt-10" : ""}`}>
        {children}
      </main>
      
    </div>
  );
};

export default Layout;
