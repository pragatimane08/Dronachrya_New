import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiBookBookmark } from "react-icons/bi";
import { PiChalkboardTeacherDuotone } from "react-icons/pi";
import { FiMapPin } from "react-icons/fi";
import { getStudentProfile } from "../../../../api/repository/LearningNeed.repository";
import AddClassForm from "../../Student/MyClasses_Student/AddClassForm_student";

const LearningProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddClassForm, setShowAddClassForm] = useState(false);
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

  return (
    <div className="min-h-[50vh] bg-[#c2d0ff] p-3 md:p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-3 md:p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-blue-900">
              My Learning Profile
            </h2>
            <p className="text-sm text-gray-500">
              Your personalized learning preferences
            </p>
          </div>
          <span className="text-green-600 text-xs md:text-sm font-medium bg-green-100 px-3 py-1 rounded-full">
            ● Active Profile
          </span>
        </div>

        {/* Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subjects Section */}
          <div className="border border-blue-100 rounded-xl p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BiBookBookmark className="text-xl text-blue-600" />
                <h3 className="text-blue-900 font-semibold text-base">Subjects</h3>
              </div>
              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                {studentInfo.subjects.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentInfo.subjects.length ? (
                studentInfo.subjects.map((subj, idx) => (
                  <span
                    key={idx}
                    className="text-sm text-blue-700 bg-white rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm border border-blue-200"
                  >
                    <BiBookBookmark className="text-base" />
                    {subj}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-sm">
                  No subjects selected yet
                </span>
              )}
            </div>
          </div>

          {/* Learning Modes Section */}
          <div className="border border-green-100 rounded-xl p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PiChalkboardTeacherDuotone className="text-xl text-green-600" />
                <h3 className="text-green-800 font-semibold text-base">Learning Modes</h3>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                {studentInfo.class_modes.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentInfo.class_modes.length ? (
                studentInfo.class_modes.map((mode, idx) => (
                  <span
                    key={idx}
                    className="text-sm text-green-800 bg-white rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm border border-green-200"
                  >
                    <PiChalkboardTeacherDuotone className="text-base" />
                    {mode} Class
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-sm">
                  No class mode selected yet
                </span>
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className="border border-orange-100 rounded-xl p-4 bg-orange-50 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-xl text-orange-600" />
              <h3 className="text-orange-700 font-semibold text-base">Location</h3>
            </div>
            {studentInfo.location?.city ? (
              <span className="text-sm text-orange-700 bg-white rounded-full px-3 py-1.5 inline-flex items-center gap-1 shadow-sm border border-orange-200">
                <FiMapPin />
                {studentInfo.location.city}, {studentInfo.location.state}
              </span>
            ) : (
              <span className="text-gray-500 italic text-sm">
                Location not selected yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup for AddClassForm */}
      {showAddClassForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-4">
            <AddClassForm
              onSuccess={() => {
                setShowAddClassForm(false);
                toast.success("Demo class request submitted successfully!");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProfilePage;
