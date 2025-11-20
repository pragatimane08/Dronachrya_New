import React from 'react';

const ChatSidebar = ({ contacts, onSelect, selectedContact }) => {
  return (
    <div className="w-72 border-r bg-white overflow-y-auto">
      <div className="p-4 text-lg font-semibold">Messages</div>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`cursor-pointer p-4 hover:bg-gray-100 border-b ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''}`}
          >
            <div className="font-medium text-sm">{contact.displayName}</div>
            <div className="text-xs text-gray-500 truncate">
              {contact.lastMessage || 'No messages yet'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
