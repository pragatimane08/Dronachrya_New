import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../../components/common/Topbar";

const StudentTopbar = ({ onMenuClick }) => {
  const [userData, setUserData] = useState({ firstName: "", fullName: "", role: "student" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const firstName = user?.profile?.name?.split(" ")[0] || "";
        const fullName = user?.profile?.name || "";
        setUserData({ role: "student", firstName, fullName });
      } catch (e) {
        console.error("Error parsing user from storage:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!", { autoClose: 2000 });
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <>
      <Topbar
        role="student"
        userData={userData}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
        showDropdown
        onProfileClick={() => navigate("/student_profile_show")}
      />
      <ToastContainer />
    </>
  );
};

export default StudentTopbar;