import React from 'react';
const ChatInput = ({ enquiryId, onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 text-sm"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-teal-500 text-white rounded-full">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
