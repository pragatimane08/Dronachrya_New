import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMapPin } from "react-icons/fi";
import { PiChalkboardTeacherDuotone } from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import { BiBookBookmark } from "react-icons/bi";
import { getStudentProfile } from "../../../../api/repository/LearningNeed.repository";

const LearningProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    subjects: [],
    class_modes: [],
    location: null,
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { subjects, class_modes, location } = await getStudentProfile();
        setStudentInfo({ subjects, class_modes, location });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Could not load student profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleBookDemo = () => {
    toast.success("Redirecting to demo booking form...");
    setTimeout(() => navigate("/add_class-form_student"), 1200);
  };

  return (
    <div className="min-h-[50vh] bg-[#c2d0ff] p-3 md:p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-4">
        {/* Profile Left Section */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-900">My Learning Profile</h2>
              <p className="text-sm text-gray-500">Your personalized learning preferences</p>
            </div>
            <span className="text-green-600 text-xs md:text-sm font-medium bg-green-100 px-3 py-1 rounded-full">
              ● Active Profile
            </span>
          </div>

          {/* Subjects */}
          <div className="mb-2 border border-blue-100 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-blue-900 font-medium">Subjects</h3>
              <span className="text-xs text-blue-500">{studentInfo.subjects.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentInfo.subjects.length ? (
                studentInfo.subjects.map((subj, idx) => (
                  <span key={idx} className="text-sm text-blue-700 bg-blue-100 rounded-full px-3 py-1 flex items-center gap-1">
                    <BiBookBookmark className="text-base" />
                    {subj}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-sm">No subjects selected yet</span>
              )}
            </div>
          </div>

          {/* Learning Modes */}
          <div className="mb-2 border border-green-100 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-green-800 font-medium">Learning Modes</h3>
              <span className="text-xs text-green-600">{studentInfo.class_modes.length} available</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentInfo.class_modes.length ? (
                studentInfo.class_modes.map((mode, idx) => (
                  <span key={idx} className="text-sm text-green-800 bg-green-100 rounded-full px-3 py-1 flex items-center gap-1">
                    <PiChalkboardTeacherDuotone className="text-base" />
                    {mode} Class
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-sm">No class mode selected yet</span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="border border-orange-100 rounded-xl p-3">
            <h3 className="text-orange-700 font-medium mb-1">Location</h3>
            {studentInfo.location?.city ? (
              <span className="text-sm text-orange-700 bg-orange-100 rounded-full px-3 py-1 inline-flex items-center gap-1">
                <FiMapPin />
                {studentInfo.location.city}, {studentInfo.location.state}
              </span>
            ) : (
              <span className="text-gray-500 italic text-sm">Location not selected yet</span>
            )}
          </div>
        </div>

        {/* CTA Section - Right */}
        {/* CTA Section - Right */}
        <div className="w-full md:w-1/3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl p-4 mt-8 text-center shadow-md self-start">
          <h4 className="text-base font-semibold mb-2">Ready to Start?</h4>
          <p className="text-sm mb-3">
            Book your free demo class and experience personalized learning
          </p>
          <button
            onClick={handleBookDemo}
            className="bg-white text-teal-700 font-medium rounded-lg px-4 py-2 shadow hover:bg-gray-50 transition text-sm"
          >
            <LuCalendarDays className="inline mr-2" />
            Book Free Demo
          </button>
          <div className="mt-3 text-sm">
            ⭐ 4.9/5 Rating
            <br />
            <span className="text-xs">No commitment • Cancel anytime • 100% Free trial</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningProfilePage;
