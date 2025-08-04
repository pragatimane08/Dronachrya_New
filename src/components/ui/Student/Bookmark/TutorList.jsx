// src/components/ui/Student/Bookmark/TutorList.jsx
import React, { useState } from "react";
import { tutors as tutorsData } from "./Data";
import TutorCard from "./TutorCard";

const TutorList = () => {
  const [tutors, setTutors] = useState(tutorsData);

  const toggleBookmark = (id) => {
    const updated = tutors.map((tutor) =>
      tutor.id === id ? { ...tutor, bookmarked: !tutor.bookmarked } : tutor
    );
    setTutors(updated);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-xl">
      {/* <h2 className="text-2xl font-bold mb-6">Free Online Classes</h2> */}
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} toggleBookmark={toggleBookmark} />
      ))}
    </div>
  );
};

export default TutorList;
