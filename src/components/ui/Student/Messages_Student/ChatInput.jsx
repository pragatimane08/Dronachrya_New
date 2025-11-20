
// src/components/ChatInput.js
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { FaSmile } from 'react-icons/fa';

const ChatInput = ({ enquiryId, onSend }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !enquiryId) return;
    
    setLoading(true);
    try {
      await onSend(message);
      setMessage('');
    } catch (err) {
      console.error('Message send failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center px-6 py-4 border-t bg-white">
      {/* Emoji Icon */}
      <button className="text-gray-400 hover:text-gray-600 text-xl mr-3 transition-colors">
        <FaSmile />
      </button>

      {/* Input Field */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading}
        className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-full outline-none placeholder-gray-500 focus:bg-gray-200 focus:ring-2 focus:ring-teal-500 transition-all"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className={`ml-3 p-3 rounded-full transition-colors ${
          loading || !message.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-teal-500 hover:bg-teal-600 text-white'
        }`}
      >
        <FiSend className="text-lg" />
      </button>
    </div>
  );
};

export default ChatInput;
