import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import MyPlanUpgrader_Student from '../../components/ui/Student/account/Upgrade_Plan/Upgrade_now_student';

const StudentSubscriptionPlan = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Subscription Plan
        </h1>

        <MyPlanUpgrader_Student />
      </div>
    </Mainlayout>
  );
};

export default StudentSubscriptionPlan;
