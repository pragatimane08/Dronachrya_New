// // src/components/student/StudentTopbar.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Topbar from "../../../components/common/Topbar";
// import { getUser, getUserRole } from "../../../api/apiclient";

// const StudentTopbar = ({ onMenuClick, isMobile = false }) => {
//   const [userData, setUserData] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadUserData = () => {
//       try {
//         const user = getUser();
//         const role = getUserRole();
        
//         console.log("StudentTopbar - Raw user data:", user);

//         if (user) {
//           setUserData(user);
//         } else {
//           console.log("StudentTopbar - No user found");
//           setUserData({});
//         }
//       } catch (error) {
//         console.error("StudentTopbar - Error loading user data:", error);
//         setUserData({});
//       }
//     };

//     loadUserData();

//     // Listen for auth changes
//     window.addEventListener('authChange', loadUserData);
//     return () => window.removeEventListener('authChange', loadUserData);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     toast.success("Logged out successfully!", { autoClose: 2000 });
    
//     // Dispatch auth change for navbar
//     window.dispatchEvent(new Event('authChange'));
    
//     setTimeout(() => navigate("/"), 2000);
//   };

//   const handleProfileClick = () => {
//     navigate("/student_profile_show");
//   };

//   // Remove handleDashboardClick since we don't want dashboard option

//   return (
//     <>
//       <Topbar
//         role="student"
//         userData={userData}
//         onMenuClick={onMenuClick}
//         onLogout={handleLogout}
//         showDropdown={true}
//         onProfileClick={handleProfileClick}
//         // Remove onDashboardClick prop entirely
//         isMobile={isMobile}
//         showDashboardOption={false} // ✅ Explicitly hide dashboard option
//         showProfileOption={true}
//       />
//       <ToastContainer />
//     </>
//   );
// };

// export default StudentTopbar;

// src/components/student/StudentTopbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../../components/common/Topbar";
import { getUser, getUserRole } from "../../../api/apiclient";

const StudentTopbar = ({ onMenuClick, isMobile = false }) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        const role = getUserRole();
        
        console.log("StudentTopbar - Raw user data:", user);

        if (user) {
          setUserData(user);
        } else {
          console.log("StudentTopbar - No user found");
          setUserData({});
        }
      } catch (error) {
        console.error("StudentTopbar - Error loading user data:", error);
        setUserData({});
      }
    };

    loadUserData();

    // Listen for auth changes
    window.addEventListener('authChange', loadUserData);
    return () => window.removeEventListener('authChange', loadUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully!", { autoClose: 2000 });
    
    // Dispatch auth change for navbar
    window.dispatchEvent(new Event('authChange'));
    
    setTimeout(() => navigate("/"), 2000);
  };

  const handleProfileClick = () => {
    navigate("/student_profile_show");
  };

  const handleDashboardClick = () => {
    navigate("/student-dashboard");
  };

  return (
    <>
      <Topbar
        role="student"
        userData={userData}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
        showDropdown={true}
        onProfileClick={handleProfileClick}
        onDashboardClick={handleDashboardClick}
        isMobile={isMobile}
        showDashboardOption={false} // Remove dashboard option
        showProfileOption={true}
        showUserName={true} // ✅ Show student name in topbar
      />
      <ToastContainer />
    </>
  );
};

export default StudentTopbar;