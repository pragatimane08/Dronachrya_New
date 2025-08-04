import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import TutorProfile from '../../components/ui/Tutor/TutorAccount/Profile_Tutor/Whole_Profile_tutor';

const TutorProfileShow = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Tutor Profile
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>
        <TutorProfile />
      </div>
    </Mainlayout>
  );
};

export default TutorProfileShow;
