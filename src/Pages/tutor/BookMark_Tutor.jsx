import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Bookmark from '../../components/ui/Tutor/TutorAccount/Bookmark/Bookmark';

const  Bookmark_Tutor = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Bookmark
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Here are your Bookmarked Students.
        </p>
        <Bookmark/>
      </div>
    </Mainlayout>
  );
};

export default Bookmark_Tutor;
