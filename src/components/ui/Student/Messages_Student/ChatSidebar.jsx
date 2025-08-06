// import React from 'react';

// const ChatSidebar = ({ contacts, onSearch, onSelect, selectedContact }) => {
//   return (
//     <div className="w-1/3 md:w-1/4 border-r border-gray-200 p-4 bg-white">
//       <input
//         type="text"
//         placeholder="Search name..."
//         className="w-full p-2 mb-4 border rounded text-sm focus:outline-none"
//         onChange={(e) => onSearch(e.target.value)}
//       />
//       <div className="space-y-2 overflow-y-auto h-[calc(100vh-160px)] pr-1">
//         {contacts.map((contact) => (
//           <div
//             key={contact.id}
//             className={`cursor-pointer p-2 rounded ${
//               selectedContact?.id === contact.id ? 'bg-teal-100' : 'hover:bg-gray-100'
//             }`}
//             onClick={() => onSelect(contact)}
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-semibold text-sm">{contact.name}</p>
//                 <p className="text-xs text-gray-600 truncate">{contact.lastMessage}</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 {new Date(contact.createdAt).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;

import React from 'react';

const ChatSidebar = ({ contacts, onSearch, onSelect, selectedContact }) => {
  return (
    <div className="w-1/3 md:w-1/4 border-r border-gray-200 p-4 bg-white">
      <input
        type="text"
        placeholder="Search name..."
        className="w-full p-2 mb-4 border rounded text-sm focus:outline-none"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="space-y-2 overflow-y-auto h-[calc(100vh-160px)] pr-1">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`cursor-pointer p-2 rounded ${
              selectedContact?.id === contact.id ? 'bg-teal-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelect(contact)}
          >
            <div className="flex justify-between items-center">
              <div>
                {/* Show tutor and student names */}
                <p className="font-semibold text-sm text-teal-800">{contact.tutorName}</p>
                <p className="text-xs text-gray-500">Student: {contact.studentName}</p>
                <p className="text-xs text-gray-600 truncate mt-1">{contact.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(contact.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
