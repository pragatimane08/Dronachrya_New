import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiClock,
  FiMapPin,
  FiMonitor,
  FiHome,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";

const EnquiryCard = ({
  id,
  name,
  subject,
  className,
  time,
  location,
  learningMode,
  status,
  onRespond,
}) => {
  const [resolvedLocation, setResolvedLocation] = useState("Resolving...");

  useEffect(() => {
    if (typeof location === "object" && location !== null) {
      const { city, state, country } = location;
      const formatted = [city, state, country].filter(Boolean).join(", ");
      setResolvedLocation(formatted || "Location not specified");
    } else {
      setResolvedLocation("Location not specified");
    }
  }, [location]);

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-teal-100 text-teal-600 p-2 rounded-full mt-1">
          <FiUser size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-sm text-gray-600 font-medium truncate">{subject}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600 mb-4 pl-2">
        <div className="flex items-center gap-2">
          <FiBookOpen size={16} className="text-gray-500" />
          <span>Class {className || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          {learningMode === "online" ? (
            <>
              <FiMonitor size={16} className="text-gray-500" />
              <span>Online Classes</span>
            </>
          ) : (
            <>
              <FiHome size={16} className="text-gray-500" />
              <span>Offline Classes</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin size={16} className="text-gray-500" />
          <span>{resolvedLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock size={16} className="text-gray-500" />
          <span>{new Date(time).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onRespond}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          <FiMessageSquare size={16} /> Respond
        </button>
      </div>
    </div>
  );
};

export default EnquiryCard;