import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import My_Classes_Tutor_Folder from '../../components/ui/Tutor/MyClasses_Tutor/MyClasses_tutor_main';

const My_Classes_Tutor = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          My Classes
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Here are your scheduled classes.
        </p>
        <My_Classes_Tutor_Folder/>
      </div>
    </Mainlayout>
  );
};

export default My_Classes_Tutor;
