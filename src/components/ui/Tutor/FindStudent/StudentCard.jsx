// 

import React from "react";
import { MapPin, Bookmark, Star, Clock } from "lucide-react";

const StudentCard = ({ student }) => {
  const subjects = Array.isArray(student.subjects)
    ? student.subjects.join(", ")
    : student.subjects;

  const classLabel = student.class;
  const location = student.Location
    ? `${student.Location.city}, ${student.Location.state}, ${student.Location.country}`
    : "N/A";

  return (
    <div className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-5 gap-5 w-full">
      {/* Profile Photo */}
      <div className="w-full sm:w-40 flex-shrink-0">
        <img
          src={student.profile_photo || "/default-user.png"}
          alt={student.name}
          className="w-full h-40 object-cover rounded-lg border"
        />
      </div>

      {/* Info */}
      <div className="flex-1 w-full">
        {/* Top Section: Name & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {location}
            </div>
          </div>

          {/* Verified + Bookmark */}
          <div className="flex items-center gap-2">
            {student.User?.is_active && (
              <span className="flex items-center text-xs bg-emerald-100 text-teal-600 px-2 py-1 rounded-full font-medium">
                <Star className="w-3 h-3 mr-1" />
                Verified
              </span>
            )}
            <button className="text-gray-400 hover:text-gray-600">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Class:</span> {classLabel}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Subjects:</span> {subjects}
            </p>
          </div>

          <div>
            {student.startPlan && (
              <p className="text-sm text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span className="font-medium">Start Plan:</span> {student.startPlan}
              </p>
            )}
            {student.classType && (
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">Class Type:</span> {student.classType}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto">
            View Contact
          </button>
          <button className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto">
            Connect
          </button>
          <button className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
