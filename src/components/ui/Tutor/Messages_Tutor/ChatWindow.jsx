import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

const ChatWindow = ({ contact, onSendMessage }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [contact.messages]);

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg text-gray-600">No conversation selected</p>
          <p className="text-sm text-gray-400 mt-2">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  // Format message time like WhatsApp (HH:MM)
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  // Format date separator like WhatsApp
  const formatDateSeparator = (date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    
    contact.messages?.forEach((message, index) => {
      const messageDate = format(new Date(message.createdAt), 'yyyy-MM-dd');
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          type: 'date',
          date: new Date(message.createdAt),
          id: `date-${messageDate}`
        });
      }
      
      groups.push({
        type: 'message',
        ...message,
        id: message.id || index
      });
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col w-full h-full bg-[#e5ddd5] relative">
      {/* Header - WhatsApp-like */}
      <div className="flex items-center justify-between bg-[#f0f0f0] px-4 py-3 border-b border-gray-300 shadow-sm">
        <div className="flex items-center">
          <button className="lg:hidden mr-4 text-gray-600">
            ←
          </button>
          <div className="relative">
            <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm uppercase mr-3">
              {contact.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{contact.displayName}</p>
            <p className="text-xs text-gray-500">
              {contact.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 bg-[#e5ddd5]">
        {messageGroups.length > 0 ? (
          <div className="space-y-2">
            {messageGroups.map((item) => {
              if (item.type === 'date') {
                return (
                  <div key={item.id} className="flex justify-center my-4">
                    <div className="bg-[#e1f5fe] bg-opacity-90 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                      {formatDateSeparator(item.date)}
                    </div>
                  </div>
                );
              }
              
              // System messages (centered, different style)
              if (item.type === 'system') {
                return (
                  <div key={item.id} className="flex justify-center my-2">
                    <div className="bg-gray-200 bg-opacity-80 px-4 py-2 rounded-lg max-w-[80%]">
                      <p className="text-xs text-gray-600 text-center">{item.text}</p>
                    </div>
                  </div>
                );
              }
              
              // Promotion messages
              if (item.type === 'promotion') {
                return (
                  <div key={item.id} className="flex justify-center my-3">
                    <div className="bg-white border border-gray-300 rounded-lg shadow-sm max-w-[85%] p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                      <div className="space-y-2">
                        {item.options?.map((option, index) => (
                          <button
                            key={index}
                            className="w-full text-left text-xs text-blue-600 hover:text-blue-800 py-1 px-2 bg-blue-50 rounded hover:bg-blue-100"
                          >
                            • {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Sender messages on RIGHT side
              if (item.from === 'me') {
                return (
                  <div key={item.id} className="flex justify-end">
                    <div className="max-w-[70%]">
                      <div className="bg-[#dcf8c6] px-4 py-2 rounded-lg rounded-br-none shadow-sm">
                        <p className="text-sm text-gray-800 break-words">{item.text}</p>
                        <div className="flex justify-end items-center mt-1">
                          <span className="text-xs text-[#667781] mr-1">
                            {formatMessageTime(item.createdAt)}
                          </span>
                          <span className="text-xs text-[#667781]">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Receiver messages on LEFT side
              return (
                <div key={item.id} className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="bg-white px-4 py-2 rounded-lg rounded-bl-none shadow-sm">
                      <p className="text-sm text-gray-800 break-words">{item.text}</p>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-[#667781]">
                          {formatMessageTime(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="bg-white rounded-full p-4 mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Send a message to start the conversation</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f0f0] border-t border-gray-300 p-3">
        <ChatInput enquiryId={contact.id} onSend={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;