import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import FindStudentShow from '../../components/ui/Tutor/FindStudent/FindStudentShow';

const Student_Filter = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Find Students
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Browse and connect with students matching your criteria
        </p>
        <FindStudentShow />
      </div>
    </Mainlayout>
  );
};

export default Student_Filter;
