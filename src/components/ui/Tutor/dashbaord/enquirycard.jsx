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
  FiArrowRight,
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

// ✅ EnquiryList component
const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiryRepository.getAll();

      const enquiriesData = res?.data || res || {};
      // console.log("API Response:", res);

      // Get user role
      const role = localStorage.getItem("role")?.toLowerCase();
      // console.log("Current role:", role);

      // Show only student enquiries for tutors
      const filtered = enquiriesData.enquiries
        ? enquiriesData.enquiries.filter((enquiry) => {
            // Only show enquiries where receiver is tutor (student enquiries for tutors)
            return enquiry.receiver?.role === "tutor";
          })
        : [];

      // console.log("Filtered enquiries (student enquiries for tutors):", filtered);

      // Process the enquiries data - only for tutors viewing student enquiries
      const processed = filtered.map((enquiry) => {
        return {
          id: enquiry.id,
          name: enquiry.sender?.name || "Unknown Student",
          subject: enquiry.subject || "N/A",
          className: enquiry.class || "N/A",
          time: enquiry.created_at,
          location: enquiry.sender?.location || null,
          learningMode: enquiry.learning_mode || "offline",
          status: enquiry.status || "pending",
          sender_id: enquiry.sender?.id,
          receiver_id: enquiry.receiver?.id,
        };
      });

      setEnquiries(processed.slice(0, 3));
    } catch (err) {
      console.error("❌ Failed to fetch enquiries", err);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleRespond = async (enquiry) => {
    try {
      // Only tutors can respond to student enquiries
      if (localStorage.getItem("role")?.toLowerCase() === "tutor") {
        await enquiryRepository.updateStatus(enquiry.id, {
          status: "accepted",
          response_message: "Enquiry accepted",
        });
        toast.success("Enquiry accepted successfully");
      }

      navigate(
        `/message_tutor?id=${enquiry.id}&sender=${enquiry.sender_id}&receiver=${enquiry.receiver_id}`
      );
    } catch (error) {
      console.error("Error accepting enquiry:", error);
      toast.error("Failed to accept enquiry");
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Student Enquiries
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm animate-pulse"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gray-200 p-2 rounded-full mt-1 h-10 w-10"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with View All button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Student Enquiries
          </h2>
          {enquiries.length > 0 && (
            <button
              onClick={() => navigate("/view_all_enquires")}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition"
            >
              View All <FiArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Enquiries Grid */}
        {enquiries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {enquiries.map((enquiry) => (
              <EnquiryCard
                key={enquiry.id}
                {...enquiry}
                onRespond={() => handleRespond(enquiry)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiMessageSquare size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No student enquiries found
            </h3>
            <p className="text-gray-500">
              You don't have any student enquiries yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnquiryList;
