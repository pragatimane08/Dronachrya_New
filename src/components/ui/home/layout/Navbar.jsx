// // src/components/Navbar/Navbar.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { ChevronDownIcon, Bars3Icon, XMarkIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon, HomeIcon } from "@heroicons/react/24/outline";
// import Logo from "../../../../assets/img/logo.jpg";
// import { useNavigate, useLocation } from "react-router-dom";
// import { isAuthenticated, getUser, clearToken, getUserRole } from "../../../../api/apiclient";

// const Navbar = () => {
//     const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//     const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
//     const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [mobilePlansOpen, setMobilePlansOpen] = useState(false);
//     const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
//     const [mobileUserOpen, setMobileUserOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [userDisplayName, setUserDisplayName] = useState("");
//     const [userInitials, setUserInitials] = useState("U");

//     const registerRef = useRef(null);
//     const plansRef = useRef(null);
//     const userRef = useRef(null);

//     const navigate = useNavigate();
//     const location = useLocation();

//     // SUPER DEBUGGING - Let's see EVERYTHING in the user object
//     const debugUserObject = (user) => {
//         console.log("🕵️‍♂️ === FULL USER OBJECT DEBUG ===");
//         console.log("User object:", user);
        
//         if (user) {
//             // Log all top-level properties
//             console.log("📋 Top-level properties:");
//             Object.keys(user).forEach(key => {
//                 console.log(`  ${key}:`, user[key]);
//             });
            
//             // Log profile properties if exists
//             if (user.profile) {
//                 console.log("📋 Profile properties:");
//                 Object.keys(user.profile).forEach(key => {
//                     console.log(`  profile.${key}:`, user.profile[key]);
//                 });
//             }
            
//             // Check common name patterns
//             console.log("🔍 Checking common name patterns:");
//             const namePatterns = [
//                 'name', 'firstName', 'first_name', 'fullName', 'full_name',
//                 'username', 'userName', 'displayName', 'display_name'
//             ];
            
//             namePatterns.forEach(pattern => {
//                 if (user[pattern]) {
//                     console.log(`✅ Found user.${pattern}:`, user[pattern]);
//                 }
//                 if (user.profile && user.profile[pattern]) {
//                     console.log(`✅ Found user.profile.${pattern}:`, user.profile[pattern]);
//                 }
//             });
//         }
//         console.log("🕵️‍♂️ === END DEBUG ===");
//     };

//     // Enhanced user name extraction function
//     const extractUserName = (user) => {
//         if (!user) {
//             const role = getUserRole();
//             console.log("❌ No user object provided, using role:", role);
//             return {
//                 displayName: role === "tutor" ? "Tutor" : role === "student" ? "Student" : role === "admin" ? "Admin" : "User",
//                 initials: role === "tutor" ? "T" : role === "student" ? "S" : role === "admin" ? "A" : "U"
//             };
//         }

//         console.log("🔍 Navbar - Starting name extraction from user:", user);

//         let name = "";
//         let foundIn = "";

//         // Deep search for any name field
//         const searchPaths = [
//             { path: user.profile?.name, location: "user.profile.name" },
//             { path: user.profile?.first_name, location: "user.profile.first_name" },
//             { path: user.profile?.full_name, location: "user.profile.full_name" },
//             { path: user.profile?.firstName, location: "user.profile.firstName" },
//             { path: user.profile?.fullName, location: "user.profile.fullName" },
//             { path: user.profile?.username, location: "user.profile.username" },
//             { path: user.name, location: "user.name" },
//             { path: user.first_name, location: "user.first_name" },
//             { path: user.full_name, location: "user.full_name" },
//             { path: user.firstName, location: "user.firstName" },
//             { path: user.fullName, location: "user.fullName" },
//             { path: user.username, location: "user.username" },
//             { path: user.displayName, location: "user.displayName" },
//             { path: user.display_name, location: "user.display_name" },
//             { path: user.email?.split('@')[0], location: "user.email (extracted)" }
//         ];

//         for (const { path, location } of searchPaths) {
//             if (path && typeof path === 'string' && path.trim() !== "" && path !== "Tutor") {
//                 name = path.trim();
//                 foundIn = location;
//                 console.log(`✅ Found name in ${location}:`, name);
//                 break;
//             }
//         }

//         // Final fallback
//         if (!name) {
//             const role = getUserRole();
//             name = role === "tutor" ? "Tutor" : role === "student" ? "Student" : role === "admin" ? "Admin" : "User";
//             console.log("⚠️ No name found, using role-based fallback:", name);
//         } else {
//             console.log(`🎉 Name extracted from ${foundIn}:`, name);
//         }

//         const firstName = name.split(" ")[0] || name;
//         const initials = firstName.charAt(0).toUpperCase();

//         console.log("📝 Final result - Display name:", firstName, "Initials:", initials);

//         return {
//             displayName: firstName,
//             initials: initials
//         };
//     };

//     // Load user data on component mount and when storage changes
//     useEffect(() => {
//         const loadUserData = () => {
//             console.log("🔄 Navbar - Loading user data...");
            
//             if (isAuthenticated()) {
//                 const user = getUser();
//                 console.log("🔐 User is authenticated, user object:", user);
                
//                 // SUPER DEBUG - Let's see everything
//                 debugUserObject(user);
                
//                 setCurrentUser(user);
                
//                 // Extract and set user name
//                 const { displayName, initials } = extractUserName(user);
//                 setUserDisplayName(displayName);
//                 setUserInitials(initials);
                
//                 console.log("👤 Navbar - Final display name:", displayName);
//                 console.log("👤 Navbar - Final initials:", initials);
//             } else {
//                 console.log("🔓 User is NOT authenticated");
//                 setCurrentUser(null);
//                 setUserDisplayName("");
//                 setUserInitials("U");
//             }
//         };

//         loadUserData();

//         // Listen for storage changes (login/logout from other tabs)
//         const handleStorageChange = () => {
//             console.log("💾 Navbar - Storage changed, reloading user data");
//             loadUserData();
//         };

//         window.addEventListener('storage', handleStorageChange);
        
//         // Custom event for login/logout
//         window.addEventListener('authChange', loadUserData);

//         return () => {
//             window.removeEventListener('storage', handleStorageChange);
//             window.removeEventListener('authChange', loadUserData);
//         };
//     }, []);

//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (registerRef.current && !registerRef.current.contains(event.target)) {
//                 setRegisterDropdownOpen(false);
//             }
//             if (plansRef.current && !plansRef.current.contains(event.target)) {
//                 setPlansDropdownOpen(false);
//             }
//             if (userRef.current && !userRef.current.contains(event.target)) {
//                 setUserDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Handle logo click - navigate to home
//     const handleLogoClick = () => {
//         navigate("/");
//         setMobileMenuOpen(false);
//     };

//     // Open Plans dropdown if query param is present
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const openPlans = params.get("openPlans");

//         if (openPlans === "true") {
//             setPlansDropdownOpen(true);
//             setMobilePlansOpen(true);
//             params.delete("openPlans");
//             window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
//         }
//     }, [location.search, location.pathname]);

//     const scrollToFindInstructor = () => {
//         setMobileMenuOpen(false);
//         if (location.pathname !== "/find-instructor") navigate("/find-instructor");
//     };

//     const scrollToHeroSection = () => {
//         setMobileMenuOpen(false);
//         if (location.pathname === "/") {
//             window.scrollTo({ top: 0, behavior: "smooth" });
//         } else {
//             navigate("/");
//         }
//     };

//     const goToEnquiries = () => {
//         setMobileMenuOpen(false);
//         if (location.pathname !== "/show-all-enquiries") navigate("/show-all-enquiries");
//     };

//     const handleLogin = () => {
//         setMobileMenuOpen(false);
//         navigate("/login");
//     };

//     const handleLogout = () => {
//         console.log("🚪 Navbar - Logging out user");
//         clearToken();
//         setCurrentUser(null);
//         setUserDisplayName("");
//         setUserInitials("U");
//         setUserDropdownOpen(false);
//         setMobileUserOpen(false);
//         setMobileMenuOpen(false);
        
//         // Dispatch custom event for other components
//         window.dispatchEvent(new Event('authChange'));
        
//         // Redirect to home page
//         navigate("/");
//     };

//     const getDashboardRoute = () => {
//         const role = getUserRole();
//         switch (role) {
//             case 'admin':
//                 return '/admin-dashboard';
//             case 'tutor':
//                 return '/tutor-dashboard';
//             case 'student':
//                 return '/student-dashboard';
//             default:
//                 return '/';
//         }
//     };

//     const getProfileRoute = () => {
//         const role = getUserRole();
//         switch (role) {
//             case 'admin':
//                 return '/admin-profile';
//             case 'tutor':
//                 return '/tutor-profile-show';
//             case 'student':
//                 return '/student_profile_show';
//             default:
//                 return '/profile';
//         }
//     };

//     // Check if profile option should be shown (hide for admin)
//     const shouldShowProfileOption = () => {
//         const role = getUserRole();
//         return role !== 'admin';
//     };

//     // Function to check if a route is active
//     const isActive = (path) => location.pathname === path;

//     // Check if user is logged in
//     const isLoggedIn = isAuthenticated() && currentUser;
    
//     // Get user role
//     const userRole = getUserRole();

//     // Check if user is admin
//     const isAdmin = isLoggedIn && userRole === 'admin';
    
//     // Check if user is tutor
//     const isTutor = isLoggedIn && userRole === 'tutor';
    
//     // Check if user is student
//     const isStudent = isLoggedIn && userRole === 'student';

//     // For admin, show all options (like public user)
//     const shouldShowFindInstructor = isAdmin || isStudent || !isLoggedIn;
//     const shouldShowEnquiries = isAdmin || isTutor || !isLoggedIn;
//     const shouldShowTutorSignup = isAdmin || !isLoggedIn;

//     return (
//         <>
//             <nav className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-3 sm:py-4 md:py-5 shadow-sm bg-white flex items-center justify-between font-sans fixed top-0 z-50">
//                 {/* Logo - Clickable */}
//                 <div 
//                     className="text-lg sm:text-xl md:text-2xl font-bold flex items-center cursor-pointer"
//                     onClick={handleLogoClick}
//                 >
//                     <img src={Logo} alt="Dronacharya Logo" className="h-7 sm:h-8 md:h-9 w-auto" />
//                     <span className="ml-2">
//                         <span className="text-[#35BAA3]">Dro</span>
//                         <span className="text-[#4B38EF]">nacharya</span>
//                     </span>
//                 </div>

//                 {/* Hamburger Icon */}
//                 <div className="lg:hidden">
//                     <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//                         {mobileMenuOpen ? (
//                             <XMarkIcon className="h-6 w-6 text-gray-700" />
//                         ) : (
//                             <Bars3Icon className="h-6 w-6 text-gray-700" />
//                         )}
//                     </button>
//                 </div>

//                 {/* Desktop Menu */}
//                 <ul className="hidden lg:flex items-center space-x-4 lg:space-x-6 text-sm sm:text-base md:text-lg font-medium text-gray-700">
//                     {/* Home - Always visible */}
//                     <li
//                         className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
//                             isActive("/") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
//                         }`}
//                         onClick={scrollToHeroSection}
//                     >
//                         Home
//                     </li>
                    
//                     {/* Find Instructor - Show for admin, students and non-logged in users, hide for tutors */}
//                     {/* {shouldShowFindInstructor && (
//                         <li
//                             className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
//                                 isActive("/find-instructor") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
//                             }`}
//                             onClick={scrollToFindInstructor}
//                         >
//                             Find Instructor
//                         </li>
//                     )} */}

//                     {/* Enquiries - Show for admin, tutors and non-logged in users, hide for students */}
//                     {/* {shouldShowEnquiries && (
//                         <li
//                             className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
//                                 isActive("/show-all-enquiries") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
//                             }`}
//                             onClick={goToEnquiries}
//                         >
//                             Enquiries
//                         </li>
//                     )} */}

//                     {/* Signup as Tutor - Show for admin and non-logged in users */}
//                     {shouldShowTutorSignup && (
//                         <li
//                             className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
//                                 isActive("/tutorreg") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
//                             }`}
//                             onClick={() => navigate("/tutorreg")}
//                         >
//                             Signup as a Tutor
//                         </li>
//                     )}

//                     {/* Plans Dropdown */}
//                     <li className="relative" ref={plansRef}>
//                         <div
//                             onClick={() => setPlansDropdownOpen(!plansDropdownOpen)}
//                             className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${
//                                 isActive("/student-plan") || isActive("/tutor-plan")
//                                 ? "bg-[#E6FAF7] text-[#35BAA3]"
//                                 : ""
//                             }`}
//                         >
//                             Plans
//                             <ChevronDownIcon className="h-4 w-4 ml-1" />
//                         </div>
//                         {plansDropdownOpen && (
//                             <ul className="absolute top-full mt-2 w-44 bg-white border shadow-md rounded-md text-left z-20 text-sm md:text-base">
//                                 {/* Show both plans for admin, otherwise show relevant plan */}
//                                 {isLoggedIn && !isAdmin ? (
//                                     isTutor ? (
//                                         <li
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                             onClick={() => {
//                                                 setPlansDropdownOpen(false);
//                                                 navigate("/tutor-plan");
//                                             }}
//                                         >
//                                             Tutor Plan
//                                         </li>
//                                     ) : isStudent ? (
//                                         <li
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                             onClick={() => {
//                                                 setPlansDropdownOpen(false);
//                                                 navigate("/student-plan");
//                                             }}
//                                         >
//                                             Student Plan
//                                         </li>
//                                     ) : (
//                                         // For other roles, show both
//                                         <>
//                                             <li
//                                                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                                 onClick={() => {
//                                                     setPlansDropdownOpen(false);
//                                                     navigate("/student-plan");
//                                                 }}
//                                             >
//                                                 Student Plan
//                                             </li>
//                                             <li
//                                                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                                 onClick={() => {
//                                                     setPlansDropdownOpen(false);
//                                                     navigate("/tutor-plan");
//                                                 }}
//                                             >
//                                                 Tutor Plan
//                                             </li>
//                                         </>
//                                     )
//                                 ) : (
//                                     // Show both when not logged in or when admin
//                                     <>
//                                         <li
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                             onClick={() => {
//                                                 setPlansDropdownOpen(false);
//                                                 navigate("/student-plan");
//                                             }}
//                                         >
//                                             Student Plan
//                                         </li>
//                                         <li
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                             onClick={() => {
//                                                 setPlansDropdownOpen(false);
//                                                 navigate("/tutor-plan");
//                                             }}
//                                         >
//                                             Tutor Plan
//                                         </li>
//                                     </>
//                                 )}
//                             </ul>
//                         )}
//                     </li>

//                     {/* User Dropdown (when logged in) or Login Button */}
//                     {isLoggedIn ? (
//                         <li className="relative" ref={userRef}>
//                             <div
//                                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                                 className="flex items-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3]"
//                             >
//                                 <div className="w-8 h-8 bg-gradient-to-r from-[#35BAA3] to-[#4B38EF] text-white rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white shadow-sm">
//                                     {userInitials}
//                                 </div>
//                                 <span className="text-sm font-medium">{userDisplayName}</span>
//                                 <ChevronDownIcon className="h-4 w-4" />
//                             </div>
//                             {userDropdownOpen && (
//                                 <ul className="absolute top-full right-0 mt-2 w-48 bg-white border shadow-lg rounded-md text-left z-20 text-sm">
//                                     <li
//                                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
//                                         onClick={() => {
//                                             setUserDropdownOpen(false);
//                                             navigate(getDashboardRoute());
//                                         }}
//                                     >
//                                         <HomeIcon className="h-4 w-4" />
//                                         <span>Go to Dashboard</span>
//                                     </li>
                                    
//                                     {/* Profile Option - Hidden for Admin */}
//                                     {shouldShowProfileOption() && (
//                                         <li
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
//                                             onClick={() => {
//                                                 setUserDropdownOpen(false);
//                                                 navigate(getProfileRoute());
//                                             }}
//                                         >
//                                             <UserIcon className="h-4 w-4" />
//                                             <span>Profile</span>
//                                         </li>
//                                     )}
                                    
//                                     <li className="border-t">
//                                         <div
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-red-600"
//                                             onClick={handleLogout}
//                                         >
//                                             <ArrowRightOnRectangleIcon className="h-4 w-4" />
//                                             <span>Log out</span>
//                                         </div>
//                                     </li>
//                                 </ul>
//                             )}
//                         </li>
//                     ) : (
//                         <li>
//                             <button
//                                 onClick={handleLogin}
//                                 className={`px-4 py-2 rounded text-sm md:text-base ${
//                                     isActive("/login")
//                                         ? "bg-[#2ba390] text-white"
//                                         : "bg-[#35BAA3] hover:bg-[#2ba390] text-white"
//                                 }`}
//                             >
//                                 Login
//                             </button>
//                         </li>
//                     )}
//                 </ul>
//             </nav>

//             {/* Mobile Menu */}
//             {mobileMenuOpen && (
//                 <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white shadow-md px-6 py-4 text-base text-gray-700 space-y-3 z-40">
//                     {/* Home - Always visible */}
//                     <div
//                         className={`hover:text-[#35BAA3] cursor-pointer ${
//                             isActive("/") ? "text-[#35BAA3]" : ""
//                         }`}
//                         onClick={scrollToHeroSection}
//                     >
//                         Home
//                     </div>
                    
//                     {/* Find Instructor - Show for admin, students and non-logged in users, hide for tutors */}
//                     {shouldShowFindInstructor && (
//                         <div
//                             className={`hover:text-[#35BAA3] cursor-pointer ${
//                                 isActive("/find-instructor") ? "text-[#35BAA3]" : ""
//                             }`}
//                             onClick={scrollToFindInstructor}
//                         >
//                             Find Instructor
//                         </div>
//                     )}

//                     {/* Enquiries - Show for admin, tutors and non-logged in users, hide for students */}
//                     {shouldShowEnquiries && (
//                         <div
//                             className={`hover:text-[#35BAA3] cursor-pointer ${
//                                 isActive("/show-all-enquiries") ? "text-[#35BAA3]" : ""
//                             }`}
//                             onClick={goToEnquiries}
//                         >
//                             Enquiries
//                         </div>
//                     )}

//                     {/* Plans Dropdown for Mobile */}
//                     <div>
//                         <div
//                             className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
//                             onClick={() => setMobilePlansOpen(!mobilePlansOpen)}
//                         >
//                             <span>Plans</span>
//                             <ChevronDownIcon
//                                 className={`h-4 w-4 transition-transform ${
//                                     mobilePlansOpen ? "rotate-180" : ""
//                                 }`}
//                             />
//                         </div>
//                         {mobilePlansOpen && (
//                             <div className="ml-4 mt-2 space-y-2">
//                                 {/* Show both plans for admin, otherwise show relevant plan */}
//                                 {isLoggedIn && !isAdmin ? (
//                                     isTutor ? (
//                                         <div
//                                             className="hover:text-[#35BAA3] cursor-pointer"
//                                             onClick={() => {
//                                                 navigate("/tutor-plan");
//                                                 setMobileMenuOpen(false);
//                                             }}
//                                         >
//                                             Tutor Plan
//                                         </div>
//                                     ) : isStudent ? (
//                                         <div
//                                             className="hover:text-[#35BAA3] cursor-pointer"
//                                             onClick={() => {
//                                                 navigate("/student-plan");
//                                                 setMobileMenuOpen(false);
//                                             }}
//                                         >
//                                             Student Plan
//                                         </div>
//                                     ) : (
//                                         // For other roles, show both
//                                         <>
//                                             <div
//                                                 className="hover:text-[#35BAA3] cursor-pointer"
//                                                 onClick={() => {
//                                                     navigate("/student-plan");
//                                                     setMobileMenuOpen(false);
//                                                 }}
//                                             >
//                                                 Student Plan
//                                             </div>
//                                             <div
//                                                 className="hover:text-[#35BAA3] cursor-pointer"
//                                                 onClick={() => {
//                                                     navigate("/tutor-plan");
//                                                     setMobileMenuOpen(false);
//                                                 }}
//                                             >
//                                                 Tutor Plan
//                                             </div>
//                                         </>
//                                     )
//                                 ) : (
//                                     // Show both when not logged in or when admin
//                                     <>
//                                         <div
//                                             className="hover:text-[#35BAA3] cursor-pointer"
//                                             onClick={() => {
//                                                 navigate("/student-plan");
//                                                 setMobileMenuOpen(false);
//                                             }}
//                                         >
//                                             Student Plan
//                                         </div>
//                                         <div
//                                             className="hover:text-[#35BAA3] cursor-pointer"
//                                             onClick={() => {
//                                                 navigate("/tutor-plan");
//                                                 setMobileMenuOpen(false);
//                                             }}
//                                         >
//                                             Tutor Plan
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Register Dropdown for Mobile - Show for admin and non-logged in users */}
//                     {shouldShowTutorSignup && (
//                         <div>
//                             <div
//                                 className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
//                                 onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)}
//                             >
//                                 <span>Register</span>
//                                 <ChevronDownIcon
//                                     className={`h-4 w-4 transition-transform ${
//                                         mobileRegisterOpen ? "rotate-180" : ""
//                                     }`}
//                                 />
//                             </div>
//                             {mobileRegisterOpen && (
//                                 <div className="ml-4 mt-2 space-y-2">
//                                     <div
//                                         className="hover:text-[#35BAA3] cursor-pointer"
//                                         onClick={() => {
//                                             navigate("/studentreg");
//                                             setMobileMenuOpen(false);
//                                         }}
//                                     >
//                                         As Student
//                                     </div>
//                                     <div
//                                         className="hover:text-[#35BAA3] cursor-pointer"
//                                         onClick={() => {
//                                             navigate("/tutorreg");
//                                             setMobileMenuOpen(false);
//                                         }}
//                                     >
//                                         As Tutor
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* User Section for Mobile (when logged in) */}
//                     {isLoggedIn ? (
//                         <div>
//                             <div
//                                 className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
//                                 onClick={() => setMobileUserOpen(!mobileUserOpen)}
//                             >
//                                 <div className="flex items-center space-x-2">
//                                     <div className="w-6 h-6 bg-gradient-to-r from-[#35BAA3] to-[#4B38EF] text-white rounded-full flex items-center justify-center text-xs font-semibold">
//                                         {userInitials}
//                                     </div>
//                                     <span className="font-medium">{userDisplayName}</span>
//                                 </div>
//                                 <ChevronDownIcon
//                                     className={`h-4 w-4 transition-transform ${
//                                         mobileUserOpen ? "rotate-180" : ""
//                                     }`}
//                                 />
//                             </div>
//                             {mobileUserOpen && (
//                                 <div className="ml-4 mt-2 space-y-2">
//                                     <div
//                                         className="hover:text-[#35BAA3] cursor-pointer flex items-center space-x-2"
//                                         onClick={() => {
//                                             navigate(getDashboardRoute());
//                                             setMobileMenuOpen(false);
//                                         }}
//                                     >
//                                         <HomeIcon className="h-4 w-4" />
//                                         <span>Dashboard</span>
//                                     </div>
                                    
//                                     {/* Profile Option - Hidden for Admin in Mobile */}
//                                     {shouldShowProfileOption() && (
//                                         <div
//                                             className="hover:text-[#35BAA3] cursor-pointer flex items-center space-x-2"
//                                             onClick={() => {
//                                                 navigate(getProfileRoute());
//                                                 setMobileMenuOpen(false);
//                                             }}
//                                         >
//                                             <UserIcon className="h-4 w-4" />
//                                             <span>Profile</span>
//                                         </div>
//                                     )}
                                    
//                                     <div
//                                         className="hover:text-red-600 cursor-pointer flex items-center space-x-2 text-red-600"
//                                         onClick={handleLogout}
//                                     >
//                                         <ArrowRightOnRectangleIcon className="h-4 w-4" />
//                                         <span>Log out</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div>
//                             <button
//                                 onClick={handleLogin}
//                                 className="w-full mt-4 bg-[#35BAA3] hover:bg-[#2ba390] text-white py-2 rounded"
//                             >
//                                 Login
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </>
//     );
// };

// export default Navbar;



// src/components/Navbar/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import Logo from "../../../../assets/img/logo.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUser, clearToken, getUserRole } from "../../../../api/apiclient";

const Navbar = () => {
    const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
    const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobilePlansOpen, setMobilePlansOpen] = useState(false);
    const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
    const [mobileUserOpen, setMobileUserOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userDisplayName, setUserDisplayName] = useState("");
    const [userInitials, setUserInitials] = useState("U");

    const registerRef = useRef(null);
    const plansRef = useRef(null);
    const userRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // SUPER DEBUGGING - Let's see EVERYTHING in the user object
    const debugUserObject = (user) => {

        if (user) {
            // Log all top-level properties

            Object.keys(user).forEach(key => {

            });

            // Log profile properties if exists
            if (user.profile) {

                Object.keys(user.profile).forEach(key => {

                });
            }

            // Check common name patterns

            const namePatterns = [
                'name', 'firstName', 'first_name', 'fullName', 'full_name',
                'username', 'userName', 'displayName', 'display_name'
            ];

            namePatterns.forEach(pattern => {
                if (user[pattern]) {

                }
                if (user.profile && user.profile[pattern]) {

                }
            });
        }

    };

    // Enhanced user name extraction function
    const extractUserName = (user) => {
        if (!user) {
            const role = getUserRole();

            return {
                displayName: role === "tutor" ? "Tutor" : role === "student" ? "Student" : role === "admin" ? "Admin" : "User",
                initials: role === "tutor" ? "T" : role === "student" ? "S" : role === "admin" ? "A" : "U"
            };
        }



        let name = "";
        let foundIn = "";

        // Deep search for any name field
        const searchPaths = [
            { path: user.profile?.name, location: "user.profile.name" },
            { path: user.profile?.first_name, location: "user.profile.first_name" },
            { path: user.profile?.full_name, location: "user.profile.full_name" },
            { path: user.profile?.firstName, location: "user.profile.firstName" },
            { path: user.profile?.fullName, location: "user.profile.fullName" },
            { path: user.profile?.username, location: "user.profile.username" },
            { path: user.name, location: "user.name" },
            { path: user.first_name, location: "user.first_name" },
            { path: user.full_name, location: "user.full_name" },
            { path: user.firstName, location: "user.firstName" },
            { path: user.fullName, location: "user.fullName" },
            { path: user.username, location: "user.username" },
            { path: user.displayName, location: "user.displayName" },
            { path: user.display_name, location: "user.display_name" },
            { path: user.email?.split('@')[0], location: "user.email (extracted)" }
        ];

        for (const { path, location } of searchPaths) {
            if (path && typeof path === 'string' && path.trim() !== "" && path !== "Tutor") {
                name = path.trim();
                foundIn = location;

                break;
            }
        }

        // Final fallback
        if (!name) {
            const role = getUserRole();
            name = role === "tutor" ? "Tutor" : role === "student" ? "Student" : role === "admin" ? "Admin" : "User";

        } else {

        }

        const firstName = name.split(" ")[0] || name;
        const initials = firstName.charAt(0).toUpperCase();



        return {
            displayName: firstName,
            initials: initials
        };
    };

    // Load user data on component mount and when storage changes
    useEffect(() => {
        const loadUserData = () => {

            if (isAuthenticated()) {
                const user = getUser();

                // SUPER DEBUG - Let's see everything
                debugUserObject(user);

                setCurrentUser(user);

                // Extract and set user name
                const { displayName, initials } = extractUserName(user);
                setUserDisplayName(displayName);
                setUserInitials(initials);


            } else {

                setCurrentUser(null);
                setUserDisplayName("");
                setUserInitials("U");
            }
        };

        loadUserData();

        // Listen for storage changes (login/logout from other tabs)
        const handleStorageChange = () => {

            loadUserData();
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event for login/logout
        window.addEventListener('authChange', loadUserData);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', loadUserData);
        };
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (registerRef.current && !registerRef.current.contains(event.target)) {
                setRegisterDropdownOpen(false);
            }
            if (plansRef.current && !plansRef.current.contains(event.target)) {
                setPlansDropdownOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle logo click - navigate to home
    const handleLogoClick = () => {
        navigate("/");
        setMobileMenuOpen(false);
    };

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

    const goToEnquiries = () => {
        setMobileMenuOpen(false);
        if (location.pathname !== "/show-all-enquiries") navigate("/show-all-enquiries");
    };

    const handleLogin = () => {
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const handleLogout = () => {

        clearToken();
        setCurrentUser(null);
        setUserDisplayName("");
        setUserInitials("U");
        setUserDropdownOpen(false);
        setMobileUserOpen(false);
        setMobileMenuOpen(false);

        // Dispatch custom event for other components
        window.dispatchEvent(new Event('authChange'));

        // Redirect to home page
        navigate("/");
    };

    const getDashboardRoute = () => {
        const role = getUserRole();
        switch (role) {
            case 'admin':
                return '/admin-dashboard';
            case 'tutor':
                return '/tutor-dashboard';
            case 'student':
                return '/student-dashboard';
            default:
                return '/';
        }
    };

    const getProfileRoute = () => {
        const role = getUserRole();
        switch (role) {
            case 'admin':
                return '/admin-profile';
            case 'tutor':
                return '/tutor-profile-show';
            case 'student':
                return '/student_profile_show';
            default:
                return '/profile';
        }
    };

    // Check if profile option should be shown (hide for admin)
    const shouldShowProfileOption = () => {
        const role = getUserRole();
        return role !== 'admin';
    };

    // Function to check if a route is active
    const isActive = (path) => location.pathname === path;

    // Check if user is logged in
    const isLoggedIn = isAuthenticated() && currentUser;

    // Get user role
    const userRole = getUserRole();

    // Check if user is admin
    const isAdmin = isLoggedIn && userRole === 'admin';

    // Check if user is tutor
    const isTutor = isLoggedIn && userRole === 'tutor';

    // Check if user is student
    const isStudent = isLoggedIn && userRole === 'student';

    // For admin, show all options (like public user)
    const shouldShowFindInstructor = isAdmin || isStudent || !isLoggedIn;
    const shouldShowEnquiries = isAdmin || isTutor || !isLoggedIn;
    const shouldShowTutorSignup = isAdmin || !isLoggedIn;

    return (
        <>
            <nav className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-3 sm:py-4 md:py-5 shadow-sm bg-white flex items-center justify-between font-sans fixed top-0 z-50">
                {/* Logo - Clickable */}
                <div
                    className="text-lg sm:text-xl md:text-2xl font-bold flex items-center cursor-pointer"
                    onClick={handleLogoClick}
                >
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
                    {/* Home - Always visible */}
                    <li
                        className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${isActive("/") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
                            }`}
                        onClick={scrollToHeroSection}
                    >
                        Home
                    </li>

                    {/* Find Instructor - Show for admin, students and non-logged in users, hide for tutors */}
                    {/* {shouldShowFindInstructor && (
                        <li
                            className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${isActive("/find-instructor") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
                                }`}
                            onClick={scrollToFindInstructor}
                        >
                            Find Instructor
                        </li>
                    )}

                    {/* Enquiries - Show for admin, tutors and non-logged in users, hide for students */}
                    {/* {shouldShowEnquiries && (
                        <li
                            className={`px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${isActive("/show-all-enquiries") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
                                }`}
                            onClick={goToEnquiries}
                        >
                            Enquiries
                        </li>
                    )} */} 

                    {/* Signup as Tutor - Show for admin and non-logged in users */}
                    {shouldShowTutorSignup && (
                        <li
                            className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${isActive("/tutorreg") ? "bg-[#E6FAF7] text-[#35BAA3]" : ""
                                }`}
                            onClick={() => navigate("/tutorreg")}
                        >
                            Signup as a Tutor
                        </li>
                    )}

                    {/* Plans Dropdown */}
                    <li className="relative" ref={plansRef}>
                        <div
                            onClick={() => setPlansDropdownOpen(!plansDropdownOpen)}
                            className={`px-3 py-1.5 rounded-md flex items-center cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3] ${isActive("/student-plan") || isActive("/tutor-plan")
                                    ? "bg-[#E6FAF7] text-[#35BAA3]"
                                    : ""
                                }`}
                        >
                            Plans
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                        </div>
                        {plansDropdownOpen && (
                            <ul className="absolute top-full mt-2 w-44 bg-white border shadow-md rounded-md text-left z-20 text-sm md:text-base">
                                {/* Show both plans for admin, otherwise show relevant plan */}
                                {isLoggedIn && !isAdmin ? (
                                    isTutor ? (
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setPlansDropdownOpen(false);
                                                navigate("/tutor-plan");
                                            }}
                                        >
                                            Tutor Plan
                                        </li>
                                    ) : isStudent ? (
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setPlansDropdownOpen(false);
                                                navigate("/student-plan");
                                            }}
                                        >
                                            Student Plan
                                        </li>
                                    ) : (
                                        // For other roles, show both
                                        <>
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
                                        </>
                                    )
                                ) : (
                                    // Show both when not logged in or when admin
                                    <>
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
                                    </>
                                )}
                            </ul>
                        )}
                    </li>

                    {/* User Dropdown (when logged in) or Login Button */}
                    {isLoggedIn ? (
                        <li className="relative" ref={userRef}>
                            <div
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-[#E6FAF7] hover:text-[#35BAA3]"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-[#35BAA3] to-[#4B38EF] text-white rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white shadow-sm">
                                    {userInitials}
                                </div>
                                <span className="text-sm font-medium">{userDisplayName}</span>
                                <ChevronDownIcon className="h-4 w-4" />
                            </div>
                            {userDropdownOpen && (
                                <ul className="absolute top-full right-0 mt-2 w-48 bg-white border shadow-lg rounded-md text-left z-20 text-sm">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            navigate(getDashboardRoute());
                                        }}
                                    >
                                        <HomeIcon className="h-4 w-4" />
                                        <span>Go to Dashboard</span>
                                    </li>

                                    {/* Profile Option - Hidden for Admin */}
                                    {shouldShowProfileOption() && (
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                                            onClick={() => {
                                                setUserDropdownOpen(false);
                                                navigate(getProfileRoute());
                                            }}
                                        >
                                            <UserIcon className="h-4 w-4" />
                                            <span>Profile</span>
                                        </li>
                                    )}

                                    <li className="border-t">
                                        <div
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-red-600"
                                            onClick={handleLogout}
                                        >
                                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                            <span>Log out</span>
                                        </div>
                                    </li>
                                </ul>
                            )}
                        </li>
                    ) : (
                        <li>
                            <button
                                onClick={handleLogin}
                                className={`px-4 py-2 rounded text-sm md:text-base ${isActive("/login")
                                        ? "bg-[#2ba390] text-white"
                                        : "bg-[#35BAA3] hover:bg-[#2ba390] text-white"
                                    }`}
                            >
                                Login
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white shadow-md px-6 py-4 text-base text-gray-700 space-y-3 z-40">
                    {/* Home - Always visible */}
                    <div
                        className={`hover:text-[#35BAA3] cursor-pointer ${isActive("/") ? "text-[#35BAA3]" : ""
                            }`}
                        onClick={scrollToHeroSection}
                    >
                        Home
                    </div>

                    {/* Find Instructor - Show for admin, students and non-logged in users, hide for tutors */}
                    {/* {shouldShowFindInstructor && (
                        <div
                            className={`hover:text-[#35BAA3] cursor-pointer ${isActive("/find-instructor") ? "text-[#35BAA3]" : ""
                                }`}
                            onClick={scrollToFindInstructor}
                        >
                            Find Instructor
                        </div>
                    )} */}

                    {/* Enquiries - Show for admin, tutors and non-logged in users, hide for students */}
                    {/* {shouldShowEnquiries && (
                        <div
                            className={`hover:text-[#35BAA3] cursor-pointer ${isActive("/show-all-enquiries") ? "text-[#35BAA3]" : ""
                                }`}
                            onClick={goToEnquiries}
                        >
                            Enquiries
                        </div>
                    )} */}

                    {/* Plans Dropdown for Mobile */}
                    <div>
                        <div
                            className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
                            onClick={() => setMobilePlansOpen(!mobilePlansOpen)}
                        >
                            <span>Plans</span>
                            <ChevronDownIcon
                                className={`h-4 w-4 transition-transform ${mobilePlansOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                        {mobilePlansOpen && (
                            <div className="ml-4 mt-2 space-y-2">
                                {/* Show both plans for admin, otherwise show relevant plan */}
                                {isLoggedIn && !isAdmin ? (
                                    isTutor ? (
                                        <div
                                            className="hover:text-[#35BAA3] cursor-pointer"
                                            onClick={() => {
                                                navigate("/tutor-plan");
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            Tutor Plan
                                        </div>
                                    ) : isStudent ? (
                                        <div
                                            className="hover:text-[#35BAA3] cursor-pointer"
                                            onClick={() => {
                                                navigate("/student-plan");
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            Student Plan
                                        </div>
                                    ) : (
                                        // For other roles, show both
                                        <>
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
                                        </>
                                    )
                                ) : (
                                    // Show both when not logged in or when admin
                                    <>
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
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Register Dropdown for Mobile - Show for admin and non-logged in users */}
                    {shouldShowTutorSignup && (
                        <div>
                            <div
                                className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
                                onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)}
                            >
                                <span>Register</span>
                                <ChevronDownIcon
                                    className={`h-4 w-4 transition-transform ${mobileRegisterOpen ? "rotate-180" : ""
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
                    )}

                    {/* User Section for Mobile (when logged in) */}
                    {isLoggedIn ? (
                        <div>
                            <div
                                className="flex items-center justify-between hover:text-[#35BAA3] cursor-pointer"
                                onClick={() => setMobileUserOpen(!mobileUserOpen)}
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-[#35BAA3] to-[#4B38EF] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                        {userInitials}
                                    </div>
                                    <span className="font-medium">{userDisplayName}</span>
                                </div>
                                <ChevronDownIcon
                                    className={`h-4 w-4 transition-transform ${mobileUserOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </div>
                            {mobileUserOpen && (
                                <div className="ml-4 mt-2 space-y-2">
                                    <div
                                        className="hover:text-[#35BAA3] cursor-pointer flex items-center space-x-2"
                                        onClick={() => {
                                            navigate(getDashboardRoute());
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <HomeIcon className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </div>

                                    {/* Profile Option - Hidden for Admin in Mobile */}
                                    {shouldShowProfileOption() && (
                                        <div
                                            className="hover:text-[#35BAA3] cursor-pointer flex items-center space-x-2"
                                            onClick={() => {
                                                navigate(getProfileRoute());
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <UserIcon className="h-4 w-4" />
                                            <span>Profile</span>
                                        </div>
                                    )}

                                    <div
                                        className="hover:text-red-600 cursor-pointer flex items-center space-x-2 text-red-600"
                                        onClick={handleLogout}
                                    >
                                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                        <span>Log out</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={handleLogin}
                                className="w-full mt-4 bg-[#35BAA3] hover:bg-[#2ba390] text-white py-2 rounded"
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;