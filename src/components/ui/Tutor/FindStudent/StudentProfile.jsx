import React from "react";
import { X, MapPin, BookOpen, School, Languages, Calendar } from "lucide-react";

const StudentProfile = ({ student, onClose }) => {
  if (!student) return null;

  const location = student.Location
    ? `${student.Location.city}, ${student.Location.state}, ${student.Location.country}`
    : "N/A";

  const subjects = Array.isArray(student.subjects)
    ? student.subjects.join(", ")
    : student.subjects;

  const languages = Array.isArray(student.languages)
    ? student.languages.map(lang => lang.language).join(", ")
    : student.languages;

  const classModes = Array.isArray(student.class_modes)
    ? student.class_modes.join(", ")
    : student.class_modes;

  const availability = Array.isArray(student.availability)
    ? student.availability.join(", ")
    : student.availability || "N/A";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-5 relative ml-[250px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column - Profile Image */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <img
              src={student.profile_photo || "/default-avatar.png"}
              alt={student.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-teal-200 mb-3"
            />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">{student.name}</h2>
            <p className="text-sm md:text-base text-gray-600">{student.class}</p>

            {student.User?.is_active && (
              <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-emerald-100 text-teal-600">
                Verified Student
              </span>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="w-full md:w-2/3 space-y-3 text-sm md:text-base">
            {student.User && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Contact Information</h3>
                {student.User.email && <p>Email: <span className="text-teal-600">{student.User.email}</span></p>}
                {student.User.mobile_number && <p>Phone: <span className="text-teal-600">{student.User.mobile_number}</span></p>}
              </div>
            )}

            <div>
              <p><BookOpen className="inline w-4 h-4 text-teal-500 mr-1" /> Subjects: {subjects || "N/A"}</p>
              <p><School className="inline w-4 h-4 text-teal-500 mr-1" /> Board: {student.board || "N/A"}</p>
              <p><Languages className="inline w-4 h-4 text-teal-500 mr-1" /> Languages: {languages || "N/A"}</p>
              <p><MapPin className="inline w-4 h-4 text-teal-500 mr-1" /> Location: {location}</p>
              <p><Calendar className="inline w-4 h-4 text-teal-500 mr-1" /> School: {student.school_name || "N/A"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p>Class Modes: {classModes || "N/A"}</p>
              <p>Availability: {availability}</p>
              {student.start_timeline && <p>Start Timeline: {student.start_timeline}</p>}
              {student.tutor_gender_preference && <p>Tutor Preference: {student.tutor_gender_preference}</p>}
              {student.hourly_charges && <p>Hourly Charges: ₹{student.hourly_charges}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;