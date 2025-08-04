import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import My_Bookmark_Student_Folder from '../../components/ui/Student/Bookmark/Bookmark';

const Profile_show = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Bookmark
        </h1>
  <My_Bookmark_Student_Folder />
      </div>
    </Mainlayout>
  );
};

export default Profile_show;
