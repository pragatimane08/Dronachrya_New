import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Billing_History_Component from '../../components/ui/Tutor/TutorAccount/Billing_History/Billing_History';

const  Billing_History = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Billing History
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Here are your  Billing History.
        </p>
        <Billing_History_Component />
      </div>
    </Mainlayout>
  );
};

export default Billing_History;
