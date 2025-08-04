import React, { useEffect, useState } from "react";
import { enquiryRepository } from "../../../../api/repository/enquiry_tutor.repository";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiClock,
  FiMapPin,
  FiMonitor,
  FiHome,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";

// ✅ EnquiryCard component
const EnquiryCard = ({
  id,
  name,
  subject,
  className,
  time,
  location,
  learningMode,
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-full max-w-[320px] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-teal-100 text-teal-600 p-2 rounded-full mt-1">
          <FiUser size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-sm text-gray-600 font-medium truncate">{subject}</p>
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

// ✅ EnquiryList component
const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  const fetchEnquiries = async () => {
    try {
      const res = await enquiryRepository.getAll();
      const enquiriesData = res?.data?.enquiries || [];

      const role = localStorage.getItem("role")?.toLowerCase();
      const userId = localStorage.getItem("user_id");

      const filtered = enquiriesData.filter((enquiry) =>
        role === "tutor"
          ? enquiry.receiver?.id === userId
          : enquiry.sender?.id === userId
      );

      const processed = filtered.map((enquiry) => {
        const isTutor = role === "tutor";
        const user = isTutor ? enquiry.sender : enquiry.receiver;

        return {
          id: enquiry.id,
          name: user?.name || "Unknown",
          subject: enquiry.subject || "N/A",
          className: enquiry.class || "N/A",
          time: enquiry.created_at,
          location: user?.location || null,
          learningMode: enquiry.learning_mode || "offline",
          sender_id: enquiry.sender?.id,
          receiver_id: enquiry.receiver?.id,
        };
      });

      setEnquiries(processed.slice(0, 3));
    } catch (err) {
      console.error("❌ Failed to fetch enquiries", err);
      toast.error("Failed to load enquiries");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleRespond = (enquiry) => {
  navigate(
    `/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`
  );
};

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {localStorage.getItem("role")?.toLowerCase() === "tutor"
              ? "Student Enquiries"
              : "Your Tutor Enquiries"}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              {...enquiry}
              onRespond={() => handleRespond(enquiry)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnquiryList;
