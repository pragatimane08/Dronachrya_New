// import React, { useState, useRef, useEffect } from "react";
// import {
//   ChevronDownIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// // import Login from "../Login";
// import Logo from "../../../../assets/img/logo.jpg";
// import { useNavigate, useLocation } from "react-router-dom";

// const Navbar = () => {
//   const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//   const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobilePlansOpen, setMobilePlansOpen] = useState(false);
//   const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const registerRef = useRef(null);
//   const plansRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (registerRef.current && !registerRef.current.contains(event.target)) {
//         setRegisterDropdownOpen(false);
//       }
//       if (plansRef.current && !plansRef.current.contains(event.target)) {
//         setPlansDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Function to handle smooth scrolling to explore categories
//   const scrollToExploreCategories = () => {
//     setMobileMenuOpen(false);
//     const exploreSection = document.getElementById("explore-categories");

//     if (exploreSection) {
//       exploreSection.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     } else {
//       navigate("/");
//       setTimeout(() => {
//         const section = document.getElementById("explore-categories");
//         if (section) {
//           section.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       }, 100);
//     }
//   };

//   // Function to scroll to hero section
//   const scrollToHeroSection = () => {
//     setMobileMenuOpen(false);
//     if (location.pathname === "/") {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } else {
//       navigate("/");
//     }
//   };

//   return (
//     <>
//       <nav className="w-full px-6 py-4 shadow-sm bg-white flex items-center justify-between font-sans fixed top-0 z-50">
//         {/* Logo */}
//         <div className="text-xl md:text-2xl font-bold flex items-center">
//           <img src={Logo} alt="Dronacharya Logo" className="h-9 w-auto" />
//           <span className="ml-2">
//             <span className="text-[#35BAA3]">Dro</span>
//             <span className="text-[#4B38EF]">nacharya</span>
//           </span>
//         </div>

//         {/* Hamburger Icon */}
//         <div className="md:hidden">
//           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//             {mobileMenuOpen ? (
//               <XMarkIcon className="h-6 w-6 text-gray-700" />
//             ) : (
//               <Bars3Icon className="h-6 w-6 text-gray-700" />
//             )}
//           </button>
//         </div>

//         {/* Desktop Menu */}
//         <ul className="hidden md:flex items-center space-x-6 text-sm md:text-base font-medium text-gray-700">
//           <li
//             className="px-3 py-1.5 rounded-md hover:bg-[#E6FAF7] hover:text-[#35BAA3] cursor-pointer transition"
//             onClick={scrollToHeroSection}
//           >
//             Home
//           </li>
//           <li
//             className="px-3 py-1.5 rounded-md hover:bg-[#E6FAF7] hover:text-[#35BAA3] cursor-pointer transition"
//             onClick={scrollToExploreCategories}
//           >
//             Find Tutors
//           </li>

//           {/* Plans Dropdown */}
//           <li className="relative" ref={plansRef}>
//             <div
//               onClick={() => setPlansDropdownOpen(!plansDropdownOpen)}
//               className="px-3 py-1.5 rounded-md flex items-center cursor-pointer hover:bg-[#E6FAF7] hover:text-[#35BAA3] transition"
//             >
//               Plans
//               <ChevronDownIcon className="h-4 w-4 ml-1" />
//             </div>
//             {plansDropdownOpen && (
//               <ul className="absolute top-full mt-2 w-44 bg-white border shadow-md rounded-md text-left z-10 text-sm md:text-base">
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setPlansDropdownOpen(false);
//                     navigate("/student-plan");
//                   }}
//                 >
//                   Student Plan
//                 </li>
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setPlansDropdownOpen(false);
//                     navigate("/tutor-plan");
//                   }}
//                 >
//                   Tutor Plan
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Register Dropdown */}
//           <li className="relative" ref={registerRef}>
//             <div
//               onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
//               className="px-3 py-1.5 rounded-md flex items-center cursor-pointer hover:bg-[#E6FAF7] hover:text-[#35BAA3] transition"
//             >
//               Register
//               <ChevronDownIcon className="h-4 w-4 ml-1" />
//             </div>
//             {registerDropdownOpen && (
//               <ul className="absolute top-full mt-2 w-40 bg-white border shadow-md rounded-md text-left z-10 text-sm md:text-base">
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setRegisterDropdownOpen(false);
//                     navigate("/studentreg"); // ✅ navigate to route
//                   }}
//                 >
//                   As Student
//                 </li>
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setRegisterDropdownOpen(false);
//                     navigate("/tutorreg"); // ✅ navigate to route
//                   }}
//                 >
//                   As Tutor
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Login */}
//           <li>
//             <button
//               onClick={() => setShowLogin(true)}
//               className="px-4 py-2 bg-[#35BAA3] hover:bg-[#2ba390] text-white rounded text-sm md:text-base"
//             >
//               Login
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white shadow-md px-6 py-4 text-base text-gray-700 space-y-3 mt-20 z-40">
//           <div
//             className="hover:text-[#35BAA3] cursor-pointer"
//             onClick={scrollToHeroSection}
//           >
//             Home
//           </div>
//           <div
//             className="hover:text-[#35BAA3] cursor-pointer"
//             onClick={scrollToExploreCategories}
//           >
//             Find Tutors
//           </div>

//           {/* Plans Dropdown for Mobile */}
//           <div>
//             <div
//               className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
//               onClick={() => setMobilePlansOpen(!mobilePlansOpen)}
//             >
//               <span>Plans</span>
//               <ChevronDownIcon
//                 className={`h-4 w-4 transition-transform ${
//                   mobilePlansOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </div>
//             {mobilePlansOpen && (
//               <div className="ml-4 mt-2 space-y-2">
//                 <div
//                   className="hover:text-[#35BAA3] cursor-pointer"
//                   onClick={() => {
//                     navigate("/student-plan");
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   Student Plan
//                 </div>
//                 <div
//                   className="hover:text-[#35BAA3] cursor-pointer"
//                   onClick={() => {
//                     navigate("/tutor-plan");
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   Tutor Plan
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Register Dropdown for Mobile */}
//           <div>
//             <div
//               className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
//               onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)}
//             >
//               <span>Register</span>
//               <ChevronDownIcon
//                 className={`h-4 w-4 transition-transform ${
//                   mobileRegisterOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </div>
//             {mobileRegisterOpen && (
//               <div className="ml-4 mt-2 space-y-2">
//                 <div
//                   className="hover:text-[#35BAA3] cursor-pointer"
//                   onClick={() => {
//                     navigate("/studentreg"); // ✅ navigate
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   As Student
//                 </div>
//                 <div
//                   className="hover:text-[#35BAA3] cursor-pointer"
//                   onClick={() => {
//                     navigate("/tutorreg"); // ✅ navigate
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   As Tutor
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <button
//               onClick={() => {
//                 setShowLogin(true);
//                 setMobileMenuOpen(false);
//               }}
//               className="w-full mt-4 bg-[#35BAA3] hover:bg-[#2ba390] text-white py-2 rounded"
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Login Modal only (Register now via routes) */}
//       <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to handle smooth scrolling to explore categories
  const scrollToExploreCategories = () => {
    setMobileMenuOpen(false);
    const exploreSection = document.getElementById("explore-categories");

    if (exploreSection) {
      exploreSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("explore-categories");
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  // Function to scroll to hero section
  const scrollToHeroSection = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="w-full px-13 py-5 shadow-sm bg-white flex items-center justify-between font-sans fixed top-0 z-50">
        {/* Logo */}
        <div className="text-xl md:text-2xl font-bold flex items-center">
          <img src={Logo} alt="Dronacharya Logo" className="h-9 w-auto" />
          <span className="ml-2">
            <span className="text-[#35BAA3]">Dro</span>
            <span className="text-[#4B38EF]">nacharya</span>
          </span>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 text-sm md:text-base font-medium text-gray-700">
          <li
            className="px-3 py-1.5 rounded-md hover:bg-[#E6FAF7] hover:text-[#35BAA3] cursor-pointer transition"
            onClick={scrollToHeroSection}
          >
            Home
          </li>
          <li
            className="px-3 py-1.5 rounded-md hover:bg-[#E6FAF7] hover:text-[#35BAA3] cursor-pointer transition"
            onClick={scrollToExploreCategories}
          >
            Find Tutors
          </li>

          {/* Plans Dropdown */}
          <li className="relative" ref={plansRef}>
            <div
              onClick={() => setPlansDropdownOpen(!plansDropdownOpen)}
              className="px-3 py-1.5 rounded-md flex items-center cursor-pointer hover:bg-[#E6FAF7] hover:text-[#35BAA3] transition"
            >
              Plans
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </div>
            {plansDropdownOpen && (
              <ul className="absolute top-full mt-2 w-44 bg-white border shadow-md rounded-md text-left z-10 text-sm md:text-base">
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

          {/* Register Dropdown */}
          <li className="relative" ref={registerRef}>
            <div
              onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
              className="px-3 py-1.5 rounded-md flex items-center cursor-pointer hover:bg-[#E6FAF7] hover:text-[#35BAA3] transition"
            >
              Register
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </div>
            {registerDropdownOpen && (
              <ul className="absolute top-full mt-2 w-40 bg-white border shadow-md rounded-md text-left z-10 text-sm md:text-base">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setRegisterDropdownOpen(false);
                    navigate("/studentreg");
                  }}
                >
                  As Student
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setRegisterDropdownOpen(false);
                    navigate("/tutorreg");
                  }}
                >
                  As Tutor
                </li>
              </ul>
            )}
          </li>

          {/* Login */}
          <li>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-[#35BAA3] hover:bg-[#2ba390] text-white rounded text-sm md:text-base"
            >
              Login
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 text-base text-gray-700 space-y-3 mt-20 z-40">
          <div
            className="hover:text-[#35BAA3] cursor-pointer"
            onClick={scrollToHeroSection}
          >
            Home
          </div>
          <div
            className="hover:text-[#35BAA3] cursor-pointer"
            onClick={scrollToExploreCategories}
          >
            Find Tutors
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
