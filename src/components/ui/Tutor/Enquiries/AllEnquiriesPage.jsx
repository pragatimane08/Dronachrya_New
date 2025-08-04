// src/pages/AllEnquiriesPage.jsx
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
  FiBook,
  FiDollarSign
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EnquiryCard = ({
  name, subject, location, time, learningMode,
  email, phone, grade, budget, onRespond
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all border border-gray-100 w-full h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {learningMode === "online" ? <FiMonitor size={16} /> : <FiHome size={16} />}
              <span>{learningMode === "online" ? "Online Classes" : "Offline Classes"}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2">
                <FiMapPin size={16} />
                <span>{location}</span>
              </div>
            )}
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
          <FiMail className="inline-block mr-2" size={16} />
          Respond
        </button>
      </div>
    </div>
  );
};


const AllEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const res = await enquiryRepository.getAll();
      const { sent = [], received = [] } = res.data;
      const role = localStorage.getItem("role");
      const data = role === "tutor" ? received : sent;
      setEnquiries(data);
    } catch (error) {
      toast.error("Failed to load enquiries");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRespond = (id) => {
    navigate(`/message_tutor/${id}`);
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manage Enquiries</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={() => fetchAll()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
            >
              <FiClock size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enquiries.length > 0 ? (
            enquiries.map((enquiry) => {
              const isTutor = localStorage.getItem("role") === "tutor";
              const sender = enquiry?.Sender?.Student || enquiry?.Sender?.Tutor;
              const receiver = enquiry?.Receiver?.Tutor || enquiry?.Receiver?.Student;

              return (
                <EnquiryCard
                  key={enquiry.id}
                  name={isTutor ? sender?.name || "Unknown Student" : receiver?.name || "Unknown Tutor"}
                  subject={enquiry.subject || "No Subject"}
                  location={enquiry?.location || "Location not specified"}
                  time={new Date(enquiry.createdAt).toLocaleString()}
                  learningMode={enquiry?.learningMode || "offline"}
                  email={sender?.email}
                  phone={sender?.phone}
                  grade={enquiry?.gradeLevel}
                  budget={enquiry?.budget}
                  onRespond={() => handleRespond(enquiry.id)}
                />
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center">
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