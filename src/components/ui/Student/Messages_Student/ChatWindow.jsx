


import React from 'react';
import ChatInput from './ChatInput';

const ChatWindow = ({ contact, onSendMessage }) => {
  // Format current time
  const now = new Date();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = now.toLocaleTimeString('en-US', options);

  return (
    <div className="flex flex-col w-full h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center border-b px-4 py-2">
        <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm uppercase mr-3">
          {contact.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
         <p className="text-sm font-semibold">{contact.tutorName}</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Dynamic Timestamp */}
      <div className="text-center text-sm text-gray-500 py-2">
        Today, {formattedTime}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
        {contact.messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-4 py-2 rounded-full text-sm max-w-[75%] ${
                msg.from === 'me' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput enquiryId={contact.id} onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
