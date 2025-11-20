import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
// import ProfileCompletion from '../../components/ui/Tutor/dashbaord/profilecompletion';
import BoostProfile from '../../components/ui/Tutor/dashbaord/boostprofile';
import EnquiryOptions from '../../components/ui/Tutor/dashbaord/Enquiry/EnquiryOptions';
import SubscriptionDaysRemainingTutor from '../../components/ui/Tutor/dashbaord/SubscriptionDaysRemainingTutor';

const Tutordashboard = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Tutorial Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>

        <SubscriptionDaysRemainingTutor />
        {/* <ProfileCompletion /> */}
        <EnquiryOptions />
        <BoostProfile />
      </div>
    </Mainlayout>
  );
};

export default Tutordashboard;


