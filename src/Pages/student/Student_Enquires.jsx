import React from 'react';
import AllEnquiriesPage from '../../components/ui/Student/Enquiries/AllEnquiriesPage';
import Mainlayout from '../../components/layout/MainLayout';

const Student_Enquires = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
         Tutor Enquires
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>

        {/* Learning Needs Card */}
        <AllEnquiriesPage />

       
      </div>
    </Mainlayout>
  );
};

export default Student_Enquires;
