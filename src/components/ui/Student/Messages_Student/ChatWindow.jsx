// src/components/ChatWindow.js
import React from 'react';
import ChatInput from './ChatInput';

const ChatWindow = ({ contact, onSendMessage }) => {
  // Format current time
  const now = new Date();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = now.toLocaleTimeString('en-US', options);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="flex flex-col w-full h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center border-b px-6 py-4 bg-gray-50">
        <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg uppercase mr-4">
          {getInitials(contact.tutorName)}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800">{contact.tutorName}</p>
          <p className="text-sm text-gray-600">Student: {contact.studentName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-green-600">Online</p>
          <p className="text-xs text-gray-500">Enquiry #{contact.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Dynamic Timestamp */}
      <div className="text-center text-sm text-gray-500 py-3 bg-gray-50 border-b">
        Today, {formattedTime}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {contact.messages && contact.messages.length > 0 ? (
          contact.messages.map((msg, index) => (
            <div key={msg.id || index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm max-w-[70%] ${
                  msg.from === 'me' 
                    ? 'bg-teal-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-teal-100' : 'text-gray-500'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-center">
              No messages yet. <br />
              <span className="text-sm">Start the conversation!</span>
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput enquiryId={contact.id} onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;

