// src/pages/tutor/ReferTutor.jsx
import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import ReferralDashboard from '../../components/ui/Tutor/ReferTutor/ReferralDashboard';

const ReferTutor = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Refer a Tutor or Student
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Here you can refer a tutor or student and earn rewards.
        </p>
        <ReferralDashboard />
      </div>
    </Mainlayout>
  );
};

export default ReferTutor;
