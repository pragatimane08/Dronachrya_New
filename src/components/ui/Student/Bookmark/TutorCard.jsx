// src/components/ui/Student/Bookmark/TutorCard.jsx
import React from "react";
import { FiUser, FiBookmark } from "react-icons/fi";

const TutorCard = ({ tutor, toggleBookmark }) => {
  return (
    <div className="flex items-start bg-white p-4 rounded-lg shadow-sm  mb-4 relative">
      <img
        src={tutor.image}
        alt={tutor.name}
        className="w-50 h-50  object-cover"
      />

      <div className="flex-1 ml-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          {tutor.name}
          {tutor.verified && (
            <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Experience:</span> {tutor.experience}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Classes:</span> {tutor.classes}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Subjects:</span> {tutor.subjects.join(", ")}
        </p>

        <div className="flex gap-3 mt-4">
          <button className="flex items-center gap-1 bg-teal-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-teal-700">
            <FiUser size={16} />
            View Contact
          </button>
          <button className="border px-4 py-1.5 rounded-md text-sm hover:bg-gray-100">
            Raise Enquiry
          </button>
        </div>
      </div>

      <button
        onClick={() => toggleBookmark(tutor.id)}
        className={`absolute right-4 top-4 flex items-center gap-1 px-3 py-1.5 rounded-md text-white text-sm ${
          tutor.bookmarked ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-500"
        }`}
      >
        <FiBookmark size={16} />
        {tutor.bookmarked ? "Remove BookMark" : "BookMark"}
      </button>
    </div>
  );
};

export default TutorCard;
