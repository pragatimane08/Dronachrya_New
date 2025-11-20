// src/components/ChatSidebar.js
import React from 'react';

const ChatSidebar = ({ contacts, onSearch, onSelect, selectedContact, isLoading }) => {
  return (
    <div className="w-1/3 md:w-1/4 border-r border-gray-200 p-4 bg-white">
      <input
        type="text"
        placeholder="Search conversations..."
        className="w-full p-2 mb-4 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        onChange={(e) => onSearch(e.target.value)}
        disabled={isLoading}
      />
      
      <div className="space-y-2 overflow-y-auto h-[calc(100vh-160px)] pr-1">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">
            No conversations found
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                selectedContact?.id === contact.id 
                  ? 'bg-teal-50 border-teal-200' 
                  : 'border-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(contact)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {contact.tutorName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Student: {contact.studentName}
                  </p>
                  <p className="text-xs text-gray-600 truncate mt-2">
                    {contact.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    contact.status === 'accepted' 
                      ? 'bg-green-100 text-green-800'
                      : contact.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(contact.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
