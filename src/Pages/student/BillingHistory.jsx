import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import MyPlanUpgrader_Student from '../../components/ui/Student/account/Billing_History/MyPlan_Student';

const BillingHistory = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Billing History
        </h1>

        <MyPlanUpgrader_Student />
      </div>
    </Mainlayout>
  );
};

export default BillingHistory;
