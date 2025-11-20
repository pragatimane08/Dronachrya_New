import React from 'react';
import LearningNeedCard from '../../components/ui/Student/dashbaord/learning_needs';
import OnlineClass from '../../components/ui/Student/dashbaord/online_classes';
import Mainlayout from '../../components/layout/MainLayout';
import SubscriptionDaysRemainingStudent from '../../components/ui/Student/dashbaord/SubscriptionDaysRemainingStudent';

const Studentdashboard = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Student Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>
 <SubscriptionDaysRemainingStudent />
        {/* Learning Needs Card */}
        <LearningNeedCard />

        {/* Online Classes Card */}
        <OnlineClass />
      </div>
    </Mainlayout>
  );
};

export default Studentdashboard;
