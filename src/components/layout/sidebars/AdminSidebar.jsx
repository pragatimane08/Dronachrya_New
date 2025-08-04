// import React from "react";
// import {
//   FiHome,
//   FiUsers,
//   FiUser,
//   FiClipboard,
//   FiCheckCircle,
//   FiTag,
//   FiGift,
//   FiSend,
//   FiBarChart2,
//   FiSettings,
//   FiChevronLeft,
//   FiChevronRight,
// } from "react-icons/fi";

// const menuItems = [
//   { icon: <FiHome />, label: "Dashboard", active: true },
//   { icon: <FiUsers />, label: "Manage Tutors" },
//   { icon: <FiUser />, label: "Manage Students" },
//   { icon: <FiClipboard />, label: "Subscriptions" },
//   { icon: <FiCheckCircle />, label: "Verifications", notificationCount: 2 },
//   { icon: <FiTag />, label: "Coupons & Offers" },
//   { icon: <FiGift />, label: "Referral Codes" },
//   { icon: <FiSend />, label: "Send Notifications" },
//   { icon: <FiBarChart2 />, label: "Analytics" },
//   { icon: <FiSettings />, label: "Settings" },
// ];

// const AdminSidebar = ({ isOpen, toggleSidebar }) => {
//   return (
//     <div
//       className={`bg-[#2c3e91] h-full rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col items-center shadow-lg transition-all duration-300
//         ${isOpen ? "w-64" : "w-20"} 
//         flex md:flex`} // mobile + tablet + desktop support
//     >
//       {/* Toggle Button */}
//       <div className="w-full flex justify-end pr-2 mb-4">
//         <button onClick={toggleSidebar} className="text-white">
//           {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
//         </button>
//       </div>

//       {/* Avatar + Info */}
//       <div className="flex flex-col items-center mt-2 mb-4">
//         <div className="w-14 h-14 bg-white text-[#2c3e91] rounded-full flex items-center justify-center text-xl font-bold shadow-md">
//           A
//         </div>
//         {isOpen && (
//           <>
//             <h2 className="mt-2 text-sm font-semibold">Admin</h2>
//             <p className="text-xs text-gray-300">admin@dhronacharya.com</p>
//           </>
//         )}
//       </div>

//       {/* Divider */}
//       <hr className="w-full border-gray-400 my-3" />

//       {/* Menu */}
//       <nav className="w-full flex flex-col gap-2">
//         {menuItems.map((item, index) => (
//           <div
//             key={index}
//             className={`relative flex items-center ${
//               isOpen ? "justify-start" : "justify-center"
//             } gap-3 text-sm px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
//               item.active
//                 ? "bg-white text-[#2c3e91] font-semibold"
//                 : "hover:bg-[#3f51b5]/60"
//             }`}
//           >
//             <span className="text-lg">{item.icon}</span>
//             {isOpen && <span>{item.label}</span>}

//             {item.notificationCount && isOpen && (
//               <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
//                 {item.notificationCount}
//               </span>
//             )}
//           </div>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default AdminSidebar;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiClipboard,
  FiCheckCircle,
  FiTag,
  FiGift,
  FiSend,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,

} from "react-icons/fi";

const menuItems = [
  { icon: <FiHome />, label: "Dashboard", route: "/admin-dashboard" },
  { icon: <FiUsers />, label: "Manage Tutors", route: "/admin_manage_tutor" },
  { icon: <FiUser />, label: "Manage Students", route: "/admin_manage_students" },
  { icon: <FiClipboard />, label: "Subscriptions", route: "/admin_subscriptions" },
 
  { icon: <FiTag />, label: "Coupons & Offers", route: "/admin_coupon_offers" },
  { icon: <FiGift />, label: "Referral Codes", route: "/admin_referral_code" },
  { icon: <FiSend />, label: "Send Notifications", route: "/admin_send_notifications" },
  { icon: <FiBarChart2 />, label: "Analytics", route: "/admin_analysis" },
  { icon: <FiClipboard />, label: "Invoices", route: "/admin_invoices" },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(
      (item) => item.route === location.pathname
    );
    setActiveIndex(currentIndex);
  }, [location.pathname]);

  const handleMenuClick = (index) => {
    const selectedItem = menuItems[index];
    setActiveIndex(index);
    navigate(selectedItem.route);
  };

  return (
    <div
      className={`bg-[#2c3e91] h-full rounded-r-2xl pt-4 pb-2 px-2 text-white flex flex-col items-center shadow-lg transition-all duration-300
        ${isOpen ? "w-64" : "w-20"} 
        flex md:flex`}
    >
      {/* Toggle Button */}
      <div className="w-full flex justify-end pr-2 mb-4">
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Avatar + Info */}
      <div className="flex flex-col items-center mt-2 mb-4">
        <div className="w-14 h-14 bg-white text-[#2c3e91] rounded-full flex items-center justify-center text-xl font-bold shadow-md">
          A
        </div>
        {isOpen && (
          <>
            <h2 className="mt-2 text-sm font-semibold">Admin</h2>
            <p className="text-xs text-gray-300">admin@dronacharya.com</p>
          </>
        )}
      </div>

      {/* Divider */}
      <hr className="w-full border-gray-400 my-3" />

      {/* Menu */}
      <nav className="w-full flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleMenuClick(index)}
            className={`relative flex items-center ${
              isOpen ? "justify-start" : "justify-center"
            } gap-3 text-sm px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
              activeIndex === index
                ? "bg-white text-[#2c3e91] font-semibold"
                : "hover:bg-[#3f51b5]/60"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}

            {item.notificationCount && isOpen && (
              <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {item.notificationCount}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;