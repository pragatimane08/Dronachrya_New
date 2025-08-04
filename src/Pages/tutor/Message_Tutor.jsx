import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Tutor_Message from '../../components/ui/Tutor/Messages_Tutor/Message';
const Message_Tutor = () => {
  return (
    <Mainlayout role="tutor">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          My Messages
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Here are your messages.
        </p>
        <Tutor_Message/>
      </div>
    </Mainlayout>
  );
};

export default Message_Tutor;
