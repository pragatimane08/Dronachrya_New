// src/components/Layout/Layout.jsx
import React from "react";
import Navbar from "./Navbar"; // adjust path to where your Navbar is
import Footer from '../footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="pt-20 flex-1 top-0 mt-0 mb-0">
        {children}
      </main>

      {/* (Optional) Footer can be added here later */}
      <Footer />
    </div>
  );
};

export default Layout;
