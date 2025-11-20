import React from 'react';
import FindInstructor from '../../components/ui/Student/FindInstructor/FindTutorShow';
import Mainlayout from '../../components/layout/MainLayout';

const StudentFindTutor = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
           Find Instructor
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Get started by finding the perfect instructor for your learning needs.
        </p>

        {/* Learning Needs Card */}
        <FindInstructor />
      </div>
    </Mainlayout>
  );
};

export default StudentFindTutor;
