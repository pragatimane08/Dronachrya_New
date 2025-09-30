import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../../components/common/Topbar";

const TutorTopbar = ({ onMenuClick }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    fullName: "",
    role: "tutor",
    profileImage: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const fullName = user?.profile?.name || "";
        const firstName = fullName.split(" ")[0] || "";
        const profileImage =
          user?.profile?.profile_image || user?.profile?.profile_photo || null;

        setUserData({ role: "tutor", firstName, fullName, profileImage });
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
        role="tutor"
        userData={userData}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
      />
      <ToastContainer />
    </>
  );
};

export default TutorTopbar;