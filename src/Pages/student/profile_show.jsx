import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Whole_Profile_student from '../../components/ui/Student/account/Profile/Whole_Profile_Student';

const Profile_show = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Student Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>

        <Whole_Profile_student />
      </div>
    </Mainlayout>
  );
};

export default Profile_show;
