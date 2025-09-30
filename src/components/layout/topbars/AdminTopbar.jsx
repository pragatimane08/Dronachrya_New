import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "../../../components/common/Topbar";

const AdminTopbar = ({ onMenuClick }) => {
  const [userData, setUserData] = useState({ firstName: "", fullName: "", role: "admin" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const firstName = user?.profile?.name?.split(" ")[0] || "";
        const fullName = user?.profile?.name || "";
        setUserData({ role: "admin", firstName, fullName });
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
        role="admin"
        userData={userData}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
      />
      <ToastContainer />
    </>
  );
};

export default AdminTopbar;