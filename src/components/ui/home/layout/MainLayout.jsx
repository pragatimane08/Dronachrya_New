// src/components/Layout/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./footer";

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (only if showNavbar is true) */}
      {showNavbar && <Navbar />}

      {/* Main Page Content */}
      <main className={`flex-1 ${showNavbar ? "pt-10" : ""}`}>
        {children}
      </main>

      {/* Footer (optional) */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
