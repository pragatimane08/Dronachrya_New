import React from 'react';

const ChatMessage = ({ text, from }) => {
  const isMe = from === 'me';
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-4 py-2 max-w-xs rounded-full text-sm ${
          isMe ? 'bg-teal-500 text-white' : 'bg-white border'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
