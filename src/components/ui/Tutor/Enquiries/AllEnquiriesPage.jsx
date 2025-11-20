import React, { useEffect, useState } from "react";
import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiMonitor,
  FiHome,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiDollarSign,
  FiBook,
  FiMessageSquare,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ✅ Reusable EnquiryCard
const EnquiryCard = ({
  name,
  subject,
  className,
  location,
  time,
  learningMode,
  email,
  phone,
  grade,
  budget,
  onRespond,
}) => {
  const formatLocation = () => {
    if (typeof location === "object" && location !== null) {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(", ") || "Location not specified";
    }
    return location || "Location not specified";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition-all w-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Name + Subject */}
        <div className="flex items-start gap-4">
          <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
            <FiUser size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <FiBook size={14} />
              <span className="truncate">{subject}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FiBookOpen size={16} />
              <span>Class: {className || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              {learningMode === "online" ? <FiMonitor size={16} /> : <FiHome size={16} />}
              <span>{learningMode === "online" ? "Online Classes" : "Offline Classes"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin size={16} />
              <span>{formatLocation()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock size={16} />
              <span>{time}</span>
            </div>
          </div>

          <div className="space-y-2">
            {email && (
              <div className="flex items-center gap-2">
                <FiMail size={16} />
                <span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <FiPhone size={16} />
                <span>{phone}</span>
              </div>
            )}
            {grade && (
              <div className="flex items-center gap-2">
                <FiBook size={16} />
                <span>Grade: {grade}</span>
              </div>
            )}
            {budget && (
              <div className="flex items-center gap-2">
                <FiDollarSign size={16} />
                <span>Budget: {budget}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={onRespond}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
        >
          <FiMessageSquare className="inline-block mr-2" size={16} />
          Respond Now
        </button>
      </div>
    </div>
  );
};

// ✅ Main Page
const AllEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const res = await enquiryRepository.getAll();
      const allEnquiries = res?.data?.enquiries || [];

      const role = localStorage.getItem("role")?.toLowerCase();
      const userId = localStorage.getItem("user_id");

      // ✅ Filter enquiries for logged-in user
      const filtered = allEnquiries.filter((enquiry) =>
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
          location: user?.location || null,
          time: new Date(enquiry.created_at).toLocaleString(),
          learningMode: enquiry.learning_mode || "offline",
          email: user?.email,
          phone: user?.phone,
          grade: enquiry.gradeLevel,
          budget: enquiry.budget,
          sender_id: enquiry.sender?.id,
          receiver_id: enquiry.receiver?.id,
        };
      });

      setEnquiries(processed);
    } catch (error) {
      toast.error("Failed to load enquiries");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRespond = (enquiry) => {
    navigate(`/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`);
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {localStorage.getItem("role")?.toLowerCase() === "tutor"
              ? "All Student Enquiries"
              : "All Tutor Enquiries"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={fetchAll}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
            >
              <FiClock size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Enquiries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enquiries.length > 0 ? (
            enquiries.map((enquiry) => (
              <EnquiryCard
                key={enquiry.id}
                {...enquiry}
                onRespond={() => handleRespond(enquiry)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries found</h3>
                <p className="text-gray-500">You don't have any enquiries yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEnquiriesPage;
