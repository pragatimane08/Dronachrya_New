// src/components/Navbar/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../../../assets/img/logo.jpg";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePlansOpen, setMobilePlansOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);

  const registerRef = useRef(null);
  const plansRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegisterDropdownOpen(false);
      }
      if (plansRef.current && !plansRef.current.contains(event.target)) {
        setPlansDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open Plans dropdown if query param is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openPlans = params.get("openPlans");

    if (openPlans === "true") {
      setPlansDropdownOpen(true);
      setMobilePlansOpen(true);
      params.delete("openPlans");
      window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
    }
  }, [location.search, location.pathname]);

  const scrollToFindInstructor = () => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/find-instructor") navigate("/find-instructor");
  };

  const scrollToHeroSection = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-3 sm:py-4 md:py-5 shadow-sm bg-white flex items-center justify-between font-sans fixed top-0 z-50">
        {/* Logo */}
        <div className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
          <img src={Logo} alt="Dronacharya Logo" className="h-7 sm:h-8 md:h-9 w-auto" />
          <span className="ml-2">
            <span className="text-[#35BAA3]">Dro</span>
            <span className="text-[#4B38EF]">nacharya</span>
          </span>
        </div>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-4 lg:space-x-6 text-sm sm:text-base md:text-lg font-medium text-gray-700">
          <li
            className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
              isActive("/") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
            }`}
            onClick={scrollToHeroSection}
          >
            Home
          </li>
          <li
            className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
              isActive("/find-instructor") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
            }`}
            onClick={scrollToFindInstructor}
          >
            Find Instructor
          </li>

          {/* Signup as Tutor */}
          <li
            className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
              isActive("/tutorreg") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
            }`}
            onClick={() => navigate("/tutorreg")}
          >
            Signup as a Tutor
          </li>

          {/* Plans Dropdown */}
          <li className="relative" ref={plansRef}>
            <div
              onClick={() => setPlansDropdownOpen(!plansDropdownOpen)}
              className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
                isActive("/student-plan") || isActive("/tutor-plan")
                  ? "bg-[#E6FAF7] text-[#35BAA3]"
                  : ""
              }`}
            >
              Plans
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </div>
            {plansDropdownOpen && (
              <ul className="absolute top-full mt-2 w-44 bg-white border shadow-md rounded-md text-left z-20 text-sm md:text-base">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setPlansDropdownOpen(false);
                    navigate("/student-plan");
                  }}
                >
                  Student Plan
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setPlansDropdownOpen(false);
                    navigate("/tutor-plan");
                  }}
                >
                  Tutor Plan
                </li>
              </ul>
            )}
          </li>

          {/* Login */}
          <li>
            <button
              onClick={() => navigate("/login")}
              className={`px-4 py-2 rounded text-sm md:text-base ${
                isActive("/login")
                  ? "bg-[#2ba390] text-white"
                  : "bg-[#35BAA3] hover:bg-[#2ba390] text-white"
              }`}
            >
              Login
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white shadow-md px-6 py-4 text-base text-gray-700 space-y-3 z-40">
          <div
            className={`hover:text-[#35BAA3] cursor-pointer ${
              isActive("/") ? "text-[#35BAA3]" : ""
            }`}
            onClick={scrollToHeroSection}
          >
            Home
          </div>
          <div
            className={`hover:text-[#35BAA3] cursor-pointer ${
              isActive("/find-instructor") ? "text-[#35BAA3]" : ""
            }`}
            onClick={scrollToFindInstructor}
          >
            Find Instructor
          </div>

          {/* Plans Dropdown for Mobile */}
          <div>
            <div
              className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
              onClick={() => setMobilePlansOpen(!mobilePlansOpen)}
            >
              <span>Plans</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  mobilePlansOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {mobilePlansOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <div
                  className="hover:text-[#35BAA3] cursor-pointer"
                  onClick={() => {
                    navigate("/student-plan");
                    setMobileMenuOpen(false);
                  }}
                >
                  Student Plan
                </div>
                <div
                  className="hover:text-[#35BAA3] cursor-pointer"
                  onClick={() => {
                    navigate("/tutor-plan");
                    setMobileMenuOpen(false);
                  }}
                >
                  Tutor Plan
                </div>
              </div>
            )}
          </div>

          {/* Register Dropdown for Mobile */}
          <div>
            <div
              className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
              onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)}
            >
              <span>Register</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  mobileRegisterOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {mobileRegisterOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <div
                  className="hover:text-[#35BAA3] cursor-pointer"
                  onClick={() => {
                    navigate("/studentreg");
                    setMobileMenuOpen(false);
                  }}
                >
                  As Student
                </div>
                <div
                  className="hover:text-[#35BAA3] cursor-pointer"
                  onClick={() => {
                    navigate("/tutorreg");
                    setMobileMenuOpen(false);
                  }}
                >
                  As Tutor
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="w-full mt-4 bg-[#35BAA3] hover:bg-[#2ba390] text-white py-2 rounded"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
