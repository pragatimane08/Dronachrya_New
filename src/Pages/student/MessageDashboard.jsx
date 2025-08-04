import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Message from '../../components/ui/Student/Messages_Student/Message';
const MessageDashboard = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
         Messages
        </h1>
        <Message/>
      </div>
    </Mainlayout>
  );
};

export default MessageDashboard;
