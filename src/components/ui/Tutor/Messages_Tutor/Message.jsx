// import React, { useState, useEffect, useRef } from "react"; // ✅ Added useRef
// import { useSearchParams, useNavigate } from "react-router-dom";
// import ChatSidebar from "./ChatSidebar";
// import ChatWindow from "./ChatWindow";
// import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
// import { formatDistanceToNow } from "date-fns";
// import { toast } from "react-toastify"; // ✅ Add this if not already

// const Message = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const enquiryIdParam = searchParams.get("id");
//   const senderParam = searchParams.get("sender");
//   const receiverParam = searchParams.get("receiver");

//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

//   const hasLoadedOnce = useRef(false); // ✅ Track initial load

//   const fetchEnquiries = async () => {
//     try {
//       setIsLoading(true);
//       const res = await enquiryRepository.getAll();
//       const allEnquiries = res?.data?.enquiries || [];

//       const uniqueMap = new Map();

//       allEnquiries.forEach((enquiry) => {
//         const isSender = enquiry.sender?.id === currentUserId;
//         const otherUser = isSender ? enquiry.receiver : enquiry.sender;

//         const key = [enquiry.sender?.id, enquiry.receiver?.id]
//           .filter((id) => id !== currentUserId)
//           .join("-");

//         if (!uniqueMap.has(key) && otherUser?.id !== currentUserId) {
//           uniqueMap.set(key, {
//             id: enquiry.id,
//             senderId: enquiry.sender?.id,
//             receiverId: enquiry.receiver?.id,
//             displayName: otherUser?.name || "Unknown",
//             messages: [],
//             lastMessage: "",
//             createdAt: enquiry.created_at,
//             isUnread: false,
//           });
//         }
//       });

//       setContacts([...uniqueMap.values()]);
//     } catch (error) {
//       console.error("❌ Failed to fetch enquiries:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchMessages = async (contact) => {
//     try {
//       const { data } = await enquiryRepository.getMessages(contact.id);
//       const formatted = data.map((msg) => ({
//         id: msg.id,
//         from: msg.sender_id === currentUserId ? "me" : "user",
//         text: msg.content,
//         time: formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }),
//         createdAt: msg.created_at,
//       }));

//       const lastMsg = formatted.at(-1);

//       setContacts((prev) =>
//         prev.map((c) =>
//           c.id === contact.id
//             ? {
//                 ...c,
//                 messages: formatted,
//                 lastMessage: lastMsg?.text || "",
//                 createdAt: lastMsg?.createdAt || c.createdAt,
//                 isUnread: false,
//               }
//             : c
//         )
//       );

//       setSelectedContact((prev) =>
//         prev && prev.id === contact.id
//           ? {
//               ...prev,
//               messages: formatted,
//               lastMessage: lastMsg?.text || "",
//               isUnread: false,
//             }
//           : prev
//       );

//       // ✅ Show success toast only once
//       if (!hasLoadedOnce.current) {
//         toast.success("Class loaded successfully");
//         hasLoadedOnce.current = true;
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch messages:", error);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (selectedContact) fetchMessages(selectedContact);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [selectedContact]);

//   useEffect(() => {
//     fetchEnquiries();
//   }, []);

//   useEffect(() => {
//     if (!contacts.length || selectedContact || isLoading) return;

//     let matched = contacts.find((c) => c.id?.toString() === enquiryIdParam);

//     if (!matched && senderParam && receiverParam) {
//       matched = contacts.find((c) => {
//         const matchForward =
//           c.senderId?.toString() === senderParam &&
//           c.receiverId?.toString() === receiverParam;
//         const matchReverse =
//           c.senderId?.toString() === receiverParam &&
//           c.receiverId?.toString() === senderParam;
//         return matchForward || matchReverse;
//       });
//     }

//     if (!matched && contacts.length > 0) matched = contacts[0];

//     if (matched) {
//       setSelectedContact(matched);
//       fetchMessages(matched);
//       navigate(
//         `?id=${matched.id}&sender=${matched.senderId}&receiver=${matched.receiverId}`,
//         { replace: true }
//       );
//     }
//   }, [contacts, enquiryIdParam, senderParam, receiverParam, selectedContact, isLoading]);

//   const handleSelect = (contact) => {
//     setSelectedContact(contact);
//     fetchMessages(contact);
//     navigate(`?id=${contact.id}&sender=${contact.senderId}&receiver=${contact.receiverId}`);
//   };

//   const handleSendMessage = async (messageText) => {
//     if (!selectedContact || !messageText.trim()) return;

//     const tempMessage = {
//       id: Date.now(),
//       from: "me",
//       text: messageText,
//       time: "Just now",
//       createdAt: new Date().toISOString(),
//     };

//     setSelectedContact((prev) => ({
//       ...prev,
//       messages: [...prev.messages, tempMessage],
//     }));

//     try {
//       await enquiryRepository.sendMessage(selectedContact.id, { content: messageText });
//       fetchMessages(selectedContact);
//     } catch (error) {
//       console.error("❌ Failed to send message:", error);
//       setSelectedContact((prev) => ({
//         ...prev,
//         messages: prev.messages.filter((m) => m.id !== tempMessage.id),
//       }));
//     }
//   };

//   return (
//     <div className="flex h-[calc(100vh-80px)] bg-white border shadow-md mx-4 my-4 rounded-lg overflow-hidden">
//       <ChatSidebar
//         contacts={contacts}
//         onSelect={handleSelect}
//         selectedContact={selectedContact}
//         isLoading={isLoading}
//       />
//       <div className="flex-1">
//         {isLoading ? (
//           <div className="flex h-full items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : !selectedContact ? (
//           <div className="flex h-full items-center justify-center text-gray-500 text-lg">
//             {contacts.length === 0
//               ? "No conversations found"
//               : "Select a conversation to start chatting"}
//           </div>
//         ) : (
//           <ChatWindow contact={selectedContact} onSendMessage={handleSendMessage} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Message;



import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
import { format, isToday, isYesterday, isThisWeek, formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const Message = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enquiryIdParam = searchParams.get("id");
  const senderParam = searchParams.get("sender");
  const receiverParam = searchParams.get("receiver");
 
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
 
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.role;
 
  const hasLoadedOnce = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact?.messages]);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const res = await enquiryRepository.getAll();
      const allEnquiries = res?.data?.enquiries || [];

      const uniqueMap = new Map();
      allEnquiries.forEach((enquiry) => {
        const isSender = enquiry.sender?.id === currentUserId;
        const otherUser = isSender ? enquiry.receiver : enquiry.sender;
       
        const key = [enquiry.sender?.id, enquiry.receiver?.id]
          .filter((id) => id !== currentUserId)
          .join("-");

        if (!uniqueMap.has(key) && otherUser?.id !== currentUserId) {
          uniqueMap.set(key, {
            id: enquiry.id,
            senderId: enquiry.sender?.id,
            receiverId: enquiry.receiver?.id,
            senderRole: enquiry.sender?.role,
            receiverRole: enquiry.receiver?.role,
            displayName: otherUser?.name || "Unknown",
            userRole: otherUser?.role,
            avatar: otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || "User")}&background=0D8ABC&color=fff`,
            messages: [],
            lastMessage: "",
            lastMessageFrom: "",
            lastMessageTime: enquiry.created_at,
            unreadCount: 0,
            isOnline: Math.random() > 0.5,
            createdAt: enquiry.created_at,
          });
        }
      });

      setContacts([...uniqueMap.values()]);
    } catch (error) {
      console.error("❌ Failed to fetch enquiries:", error);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (contact) => {
    try {
      const { data } = await enquiryRepository.getMessages(contact.id);
     
      const formatted = data.map((msg) => ({
        id: msg.id,
        from: msg.sender_id === currentUserId ? "me" : "user",
        text: msg.content,
        time: formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }),
        timestamp: new Date(msg.created_at),
        createdAt: msg.created_at,
      }));

      const lastMessage = formatted.at(-1);
     
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                messages: formatted,
                lastMessage: lastMessage?.text || "",
                lastMessageFrom: lastMessage?.from || "",
                lastMessageTime: lastMessage?.createdAt || c.createdAt,
                unreadCount: 0,
              }
            : c
        )
      );

      setSelectedContact((prev) =>
        prev && prev.id === contact.id
          ? {
              ...prev,
              messages: formatted,
              lastMessage: lastMessage?.text || "",
              lastMessageFrom: lastMessage?.from || "",
              unreadCount: 0,
            }
          : prev
      );

      if (!hasLoadedOnce.current) {
        toast.success("Conversations loaded successfully");
        hasLoadedOnce.current = true;
      }
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedContact) fetchMessages(selectedContact);
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedContact]);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    if (!contacts.length || selectedContact || isLoading) return;

    let matched = contacts.find((c) => c.id?.toString() === enquiryIdParam);
   
    if (!matched && senderParam && receiverParam) {
      matched = contacts.find((c) => {
        const matchForward = c.senderId?.toString() === senderParam && c.receiverId?.toString() === receiverParam;
        const matchReverse = c.senderId?.toString() === receiverParam && c.receiverId?.toString() === senderParam;
        return matchForward || matchReverse;
      });
    }

    const roleFilteredContacts = contacts.filter(contact => {
      if (currentUserRole === 'tutor') {
        return contact.userRole === 'student';
      } else if (currentUserRole === 'student') {
        return contact.userRole === 'tutor';
      }
      return true;
    });

    if (!matched && roleFilteredContacts.length > 0) matched = roleFilteredContacts[0];

    if (matched) {
      setSelectedContact(matched);
      fetchMessages(matched);
      navigate(`?id=${matched.id}&sender=${matched.senderId}&receiver=${matched.receiverId}`, { replace: true });
    }
  }, [contacts, enquiryIdParam, senderParam, receiverParam, selectedContact, isLoading, currentUserRole]);

  const handleSelect = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact);
    setIsSidebarOpen(false);
    navigate(`?id=${contact.id}&sender=${contact.senderId}&receiver=${contact.receiverId}`);
  };

  const handleSendMessage = async (messageText) => {
    if (!selectedContact || !messageText.trim()) return;
   
    try {
      await enquiryRepository.sendMessage(selectedContact.id, { content: messageText });
      fetchMessages(selectedContact);
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredContacts = contacts.filter(contact => {
    const roleFilter = currentUserRole === 'tutor'
      ? contact.userRole === 'student'
      : currentUserRole === 'student'
      ? contact.userRole === 'tutor'
      : true;

    const searchFilter = contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        contact.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    return roleFilter && searchFilter;
  });

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border shadow-md mx-0 sm:mx-4 my-0 sm:my-4 rounded-none sm:rounded-lg overflow-hidden relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-4 left-4 z-30 bg-teal-500 text-white p-2 rounded-md shadow-lg hover:bg-teal-600 transition-colors"
        style={{ margin: '10px' }}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        transition-transform duration-300 ease-in-out
        fixed lg:relative z-30 lg:z-auto
        w-4/5 sm:w-80 lg:w-96 h-full
        bg-white border-r border-gray-200
        flex flex-col
        shadow-xl lg:shadow-none
      `}>
        <ChatSidebar
          contacts={filteredContacts}
          onSelect={handleSelect}
          selectedContact={selectedContact}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 relative">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : !selectedContact ? (
          <WelcomeScreen
            onToggleSidebar={toggleSidebar}
            currentUserRole={currentUserRole}
            hasContacts={filteredContacts.length > 0}
          />
        ) : (
          <ChatWindow
            contact={selectedContact}
            onSendMessage={handleSendMessage}
            onToggleSidebar={toggleSidebar}
            messagesEndRef={messagesEndRef}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        )}
      </div>
    </div>
  );
};

// Chat Sidebar Component
const ChatSidebar = ({ contacts, onSelect, selectedContact, isLoading, searchTerm, onSearchChange, currentUserId, currentUserRole, onToggleSidebar }) => {
  const getSidebarTitle = () => {
    if (currentUserRole === 'tutor') return 'Student Messages';
    if (currentUserRole === 'student') return 'Tutor Messages';
    return 'Chats';
  };

  const getEmptyMessage = () => {
    if (currentUserRole === 'tutor') return 'No student messages yet';
    if (currentUserRole === 'student') return 'No tutor messages yet';
    return 'No conversations found';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-teal-50 relative">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden absolute right-3 top-3 text-gray-600 hover:text-gray-800 p-1"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-gray-800 pr-10">{getSidebarTitle()}</h2>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {searchTerm ? "No conversations found" : getEmptyMessage()}
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onSelect={onSelect}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Contact Item Component
const ContactItem = ({ contact, isSelected, onSelect, currentUserId, currentUserRole }) => {
  const getPreviewText = () => {
    if (!contact.lastMessage) return "No messages yet";
    return contact.lastMessage;
  };

  const previewText = getPreviewText();

  return (
    <div
      onClick={() => onSelect(contact)}
      className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-teal-50 border-teal-200'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="relative">
        <img
          src={contact.avatar}
          alt={contact.displayName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {contact.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 truncate">
            {contact.displayName}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(contact.lastMessageTime))}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm truncate flex-1 text-gray-600">
            {previewText}
          </p>
          {contact.unreadCount > 0 && (
            <span className="bg-teal-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center ml-2">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Welcome Screen Component
const WelcomeScreen = ({ onToggleSidebar, currentUserRole, hasContacts }) => {
  const getWelcomeTitle = () => {
    if (currentUserRole === 'tutor') return 'Student Messages';
    if (currentUserRole === 'student') return 'Tutor Messages';
    return 'Messages';
  };

  const getWelcomeMessage = () => {
    if (currentUserRole === 'tutor') return 'Select a conversation to view student messages and respond to enquiries.';
    if (currentUserRole === 'student') return 'Select a conversation to view tutor messages.';
    return 'Select a conversation to start chatting.';
  };

  const getButtonText = () => {
    if (currentUserRole === 'tutor') return 'View Student Messages';
    if (currentUserRole === 'student') return 'View Tutor Messages';
    return 'View Conversations';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4 text-center">
      <div className="max-w-md">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getWelcomeTitle()}
        </h2>
        <p className="text-gray-600 mb-6">
          {getWelcomeMessage()}
        </p>
        <button
          onClick={onToggleSidebar}
          className="lg:hidden bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

// Chat Window Component - FIXED MESSAGE ALIGNMENT
const ChatWindow = ({ contact, onSendMessage, onToggleSidebar, messagesEndRef, currentUserId, currentUserRole }) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const getPlaceholderText = () => {
    if (currentUserRole === 'tutor') return 'Type your response to student...';
    if (currentUserRole === 'student') return 'Type your message to tutor...';
    return 'Type a message...';
  };

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
          <button
            onClick={onToggleSidebar}
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.displayName}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
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

      {/* Chat Area - FIXED MESSAGE ALIGNMENT */}
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

              // My messages (sent) - RIGHT side
              if (item.from === 'me') {
                return (
                  <div key={item.id} className="flex justify-end mb-3">
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

              // Other person's messages (received) - LEFT side
              return (
                <div key={item.id} className="flex justify-start mb-3">
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
            <div ref={messagesEndRef} />
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
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={getPlaceholderText()}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
