// import React, { useState, useRef, useEffect } from "react";
// import {
//   ChevronDownIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import TutorReg from "./TutorReg";
// import StudentReg from "./StudentReg";
// import Login from "./Login";
// import Logo from "../../../assets/img/logo.jpg";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//   const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showTutorReg, setShowTutorReg] = useState(false);
//   const [showStudentReg, setShowStudentReg] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const registerRef = useRef(null);
//   const plansRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         registerRef.current &&
//         !registerRef.current.contains(event.target)
//       ) {
//         setRegisterDropdownOpen(false);
//       }
//       if (
//         plansRef.current &&
//         !plansRef.current.contains(event.target)
//       ) {
//         setPlansDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

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
//             onClick={() => navigate("/")}
//           >
//             Home
//           </li>

//           <li
//             className="px-3 py-1.5 rounded-md hover:bg-[#E6FAF7] hover:text-[#35BAA3] cursor-pointer transition"
//             onClick={() => navigate("/explorecategory_home")}
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
//                     navigate("/subscription-plan");
//                   }}
//                 >
//                   Student Plan
//                 </li>
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setPlansDropdownOpen(false);
//                     navigate("/subscriptionplan_tutor");
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
//                     setShowStudentReg(true);
//                   }}
//                 >
//                   As Student
//                 </li>
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setRegisterDropdownOpen(false);
//                     setShowTutorReg(true);
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
//           <div className="hover:text-[#35BAA3] cursor-pointer">Home</div>
//           <div className="hover:text-[#35BAA3] cursor-pointer">Find Tutors</div>

//           <div className="font-semibold">Plans</div>
//           <div
//             className="ml-4 hover:text-[#35BAA3] cursor-pointer"
//             onClick={() => {
//               navigate("/myplanupgrade_student");
//               setMobileMenuOpen(false);
//             }}
//           >
//             Student Plan
//           </div>
//           <div
//             className="ml-4 hover:text-[#35BAA3] cursor-pointer"
//             onClick={() => {
//               navigate("/myplanupgrade_tutor");
//               setMobileMenuOpen(false);
//             }}
//           >
//             Tutor Plan
//           </div>

//           <div className="font-semibold mt-4">Register</div>
//           <div
//             className="ml-4 hover:text-[#35BAA3] cursor-pointer"
//             onClick={() => {
//               setShowStudentReg(true);
//               setMobileMenuOpen(false);
//             }}
//           >
//             As Student
//           </div>
//           <div
//             className="ml-4 hover:text-[#35BAA3] cursor-pointer"
//             onClick={() => {
//               setShowTutorReg(true);
//               setMobileMenuOpen(false);
//             }}
//           >
//             As Tutor
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

//       {/* Modals */}
//       {showStudentReg && <StudentReg onClose={() => setShowStudentReg(false)} />}
//       {showTutorReg && <TutorReg onClose={() => setShowTutorReg(false)} />}
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
import TutorReg from "./TutorReg";
import StudentReg from "./StudentReg";
import Login from "./Login";
import Logo from "../../../assets/img/logo.jpg";

const Navbar = () => {
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTutorReg, setShowTutorReg] = useState(false);
  const [showStudentReg, setShowStudentReg] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const registerRef = useRef(null);
  const plansRef = useRef(null);

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

  // Scroll helpers
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToFindTutors = () => {
    const section = document.getElementById("find-tutors-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full px-6 py-4 shadow-sm bg-white flex items-center justify-between font-sans fixed top-0 z-50">
        {/* Logo */}
        <div
          className="text-xl md:text-2xl font-bold flex items-center cursor-pointer"
          onClick={scrollToTop}
        >
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
            onClick={scrollToTop}
          >
            Home
          </li>

          <li
            className="px-3 py-1.5 rounded-md hover:bg-[#E6FAF7] hover:text-[#35BAA3] cursor-pointer transition"
            onClick={scrollToFindTutors}
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
                  // Replace these with your real navigation or modal open as needed
                  onClick={() => {
                    setPlansDropdownOpen(false);
                    // example: navigate("/subscription-plan");
                  }}
                >
                  Student Plan
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setPlansDropdownOpen(false);
                    // example: navigate("/subscriptionplan_tutor");
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
                    setShowStudentReg(true);
                  }}
                >
                  As Student
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setRegisterDropdownOpen(false);
                    setShowTutorReg(true);
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
              onClick={() => setShowLogin(true)}
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
          {/* Home */}
          <div
            className="hover:text-[#35BAA3] cursor-pointer"
            onClick={scrollToTop}
          >
            Home
          </div>

          {/* Find Tutors */}
          <div
            className="hover:text-[#35BAA3] cursor-pointer"
            onClick={scrollToFindTutors}
          >
            Find Tutors
          </div>

          {/* Plans */}
          <div className="font-semibold">Plans</div>
          <div
            className="ml-4 hover:text-[#35BAA3] cursor-pointer"
            onClick={() => {
              // Replace this with your plan page navigation or modal
              setMobileMenuOpen(false);
            }}
          >
            Student Plan
          </div>
          <div
            className="ml-4 hover:text-[#35BAA3] cursor-pointer"
            onClick={() => {
              // Replace this with your plan page navigation or modal
              setMobileMenuOpen(false);
            }}
          >
            Tutor Plan
          </div>

          {/* Register */}
          <div className="font-semibold mt-4">Register</div>
          <div
            className="ml-4 hover:text-[#35BAA3] cursor-pointer"
            onClick={() => {
              setShowStudentReg(true);
              setMobileMenuOpen(false);
            }}
          >
            As Student
          </div>
          <div
            className="ml-4 hover:text-[#35BAA3] cursor-pointer"
            onClick={() => {
              setShowTutorReg(true);
              setMobileMenuOpen(false);
            }}
          >
            As Tutor
          </div>

          {/* Login */}
          <div>
            <button
              onClick={() => {
                setShowLogin(true);
                setMobileMenuOpen(false);
              }}
              className="w-full mt-4 bg-[#35BAA3] hover:bg-[#2ba390] text-white py-2 rounded"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showStudentReg && <StudentReg onClose={() => setShowStudentReg(false)} />}
      {showTutorReg && <TutorReg onClose={() => setShowTutorReg(false)} />}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Navbar;


