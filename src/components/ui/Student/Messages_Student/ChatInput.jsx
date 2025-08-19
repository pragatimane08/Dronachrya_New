import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';  // ✅ Send icon
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
      alert('Message send failed');
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
    <div className="flex items-center px-4 py-3 border-t bg-white">
      {/* Emoji Icon */}
      <FaSmile className="text-teal-500 text-xl mr-2" />

      {/* Input Field */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-full outline-none placeholder-white"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="ml-2 bg-teal-500 hover:bg-teal-600 p-3 rounded-full text-white"
      >
        <FiSend className="text-xl" />
      </button>
    </div>
  );
};

export default ChatInput;
