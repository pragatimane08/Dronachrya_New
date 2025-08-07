import React from "react";
import { FiUser, FiUsers, FiMessageSquare, FiFileText } from "react-icons/fi";

// Single card component
const DashboardCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-between w-full mb-4">
      <div className="mr-3">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
        <div className="text-lg">{icon}</div>
      </div>
    </div>
  );
};

// Main component with dashboard cards using props
const AdminCard = ({ totalStudents = 0, totalTutors = 0, totalEnquiries = 0, totalSubscriptions = 0 }) => {
  return (
    <div className="p-1 sm:p-4 grid gap-4 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
      <DashboardCard
        title="Active Students"
        value={totalStudents}
        icon={<FiUser className="text-emerald-600" />}
        bgColor="bg-emerald-100"
      />
      <DashboardCard
        title="Active Tutors"
        value={totalTutors}
        icon={<FiUsers className="text-purple-600" />}
        bgColor="bg-purple-100"
      />
      <DashboardCard
        title="New Enquiries"
        value={totalEnquiries}
        icon={<FiMessageSquare className="text-indigo-600" />}
        bgColor="bg-indigo-100"
      />
      <DashboardCard
        title="Active Subscriptions"
        value={totalSubscriptions}
        icon={<FiFileText className="text-green-600" />}
        bgColor="bg-green-100"
      />
    </div>
  );
};

export default AdminCard;
