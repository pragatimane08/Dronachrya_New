import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

// MessageBubble Component integrated directly
const MessageBubble = ({ message, currentUserRole }) => {
  // Add safety checks to prevent undefined errors
  if (!message) {
    console.warn("MessageBubble: message prop is undefined");
    return null;
  }

  const isMe = message.isMe;

  return (
    <div className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl ${isMe ? "ml-12" : "mr-12"}`}>
        {/* Sender Name - Only show for received messages (left side) */}
        {!isMe && (
          <div className="flex items-center mb-1 ml-1">
            <span className="text-xs font-medium text-gray-600">
              {message.senderName || "Unknown"}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {message.senderRole || "User"}
            </span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm ${
              isMe
                ? "bg-teal-500 text-white rounded-br-none"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }`}
          >
            <p className="text-sm break-words whitespace-pre-wrap">
              {message.text || "Message content unavailable"}
            </p>
          </div>
        </div>

        {/* Time Stamp */}
        <div className={`flex ${isMe ? "justify-end" : "justify-start"} mt-1`}>
          <span
            className={`text-xs ${
              isMe ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {message.time || "Just now"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Message Component
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

        // Create a unique key for each conversation
        const key = [enquiry.sender?.id, enquiry.receiver?.id].sort().join("-");

        if (!uniqueMap.has(key) && otherUser?.id !== currentUserId) {
          // Determine tutor and student names based on roles
          const tutorUser = enquiry.sender?.role === "tutor" ? enquiry.sender : enquiry.receiver;
          const studentUser = enquiry.sender?.role === "student" ? enquiry.sender : enquiry.receiver;

          const tutorName = tutorUser?.name || "Tutor";
          const studentName = studentUser?.name || "Student";

          uniqueMap.set(key, {
            id: enquiry.id,
            senderId: enquiry.sender?.id,
            receiverId: enquiry.receiver?.id,
            senderRole: enquiry.sender?.role,
            receiverRole: enquiry.receiver?.role,
            tutorName: tutorName,
            studentName: studentName,
            tutorId: tutorUser?.id,
            studentId: studentUser?.id,
            // For display purposes, show tutor name in sidebar
            displayName: tutorName,
            userRole: tutorUser?.role,
            avatar:
              tutorUser?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                tutorName
              )}&background=0D8ABC&color=fff`,
            studentAvatar: studentUser?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                studentName
              )}&background=0D8ABC&color=fff`,
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

      // Add validation to ensure messages are properly formatted
      const formatted = (data || []).map((msg, index) => {
        if (!msg) return null; // Skip null messages
        
        // FIXED: Proper isMe calculation
        const isMe = msg.sender_id === currentUserId;
        
        // FIXED: Proper sender info calculation
        let senderName = "Unknown";
        let senderRole = "user";
        
        if (isMe) {
          senderName = "You";
          senderRole = currentUserRole;
        } else {
          // Determine if sender is tutor or student
          if (msg.sender_id === contact.tutorId) {
            senderName = contact.tutorName;
            senderRole = "tutor";
          } else if (msg.sender_id === contact.studentId) {
            senderName = contact.studentName;
            senderRole = "student";
          }
        }

        return {
          id: msg.id || `temp-${index}`,
          from: isMe ? "me" : "other",
          senderId: msg.sender_id,
          text: msg.content || "",
          time: msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : "Just now",
          timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
          createdAt: msg.created_at || new Date().toISOString(),
          senderName: senderName,
          senderRole: senderRole,
          isMe: isMe // This should now work correctly
        };
      }).filter(msg => msg !== null); // Remove null messages

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
        const matchForward =
          c.senderId?.toString() === senderParam &&
          c.receiverId?.toString() === receiverParam;
        const matchReverse =
          c.senderId?.toString() === receiverParam &&
          c.receiverId?.toString() === senderParam;
        return matchForward || matchReverse;
      });
    }

    // Get contacts filtered by role
    const roleFilteredContacts = contacts.filter((contact) => {
      if (currentUserRole === "student") {
        return contact.userRole === "tutor"; // Students see tutors
      } else if (currentUserRole === "tutor") {
        return contact.userRole === "student"; // Tutors see students
      }
      return true;
    });

    // If no match found, select first contact from role-filtered list
    if (!matched && roleFilteredContacts.length > 0) {
      matched = roleFilteredContacts[0];
    }

    if (matched) {
      setSelectedContact(matched);
      fetchMessages(matched);
      navigate(
        `?id=${matched.id}&sender=${matched.senderId}&receiver=${matched.receiverId}`,
        { replace: true }
      );
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

  const filteredContacts = contacts.filter((contact) => {
    // Fix the role filtering logic
    const roleFilter =
      currentUserRole === "student"
        ? contact.userRole === "tutor" // Student should see tutors
        : currentUserRole === "tutor"
        ? contact.userRole === "student" // Tutor should see students
        : true;

    const searchFilter =
      contact.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    return roleFilter && searchFilter;
  });

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border shadow-md mx-0 sm:mx-4 my-0 sm:my-4 rounded-none sm:rounded-lg overflow-hidden relative">
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-4 left-4 z-30 bg-teal-500 text-white p-2 rounded-md shadow-lg hover:bg-teal-600 transition-colors"
        style={{ margin: "10px" }}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          transition-transform duration-300 ease-in-out
          fixed lg:relative z-30 lg:z-auto
          w-4/5 sm:w-80 lg:w-96 h-full
          bg-white border-r border-gray-200
          flex flex-col
          shadow-xl lg:shadow-none
        `}
      >
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

// ChatSidebar Component
const ChatSidebar = ({
  contacts,
  onSelect,
  selectedContact,
  isLoading,
  searchTerm,
  onSearchChange,
  currentUserId,
  currentUserRole,
  onToggleSidebar,
}) => {
  const getSidebarTitle = () => {
    if (currentUserRole === "student") return "Your Tutors";
    if (currentUserRole === "tutor") return "Your Students";
    return "Chats";
  };

  const getEmptyMessage = () => {
    if (currentUserRole === "student") return "No tutors found";
    if (currentUserRole === "tutor") return "No students found";
    return "No conversations found";
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
        <h2 className="text-xl font-semibold text-gray-800 pr-10">
          {getSidebarTitle()}
        </h2>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder={`Search ${currentUserRole === "student" ? "tutors" : "students"}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 px-4">
            {searchTerm ? "No conversations found" : getEmptyMessage()}
            <p className="text-sm text-gray-400 mt-2">
              {currentUserRole === "student" 
                ? "You don't have any tutor conversations yet."
                : "You don't have any student conversations yet."}
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onSelect={onSelect}
              currentUserRole={currentUserRole}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ContactItem Component
const ContactItem = ({ contact, isSelected, onSelect, currentUserRole }) => {
  const getPreviewText = () => {
    if (!contact.lastMessage) return "No messages yet";
    
    const preview = contact.lastMessage.length > 35 
      ? contact.lastMessage.substring(0, 35) + '...' 
      : contact.lastMessage;
    
    return preview;
  };

  const getRoleBadge = () => {
    if (currentUserRole === "student") {
      return "Tutor";
    } else if (currentUserRole === "tutor") {
      return "Student";
    }
    return contact.userRole;
  };

  const getDisplayInfo = () => {
    if (currentUserRole === "student") {
      // Students see tutor name as main and student name as secondary
      return {
        mainName: contact.tutorName,
        secondaryName: `Student: ${contact.studentName}`,
        avatar: contact.avatar
      };
    } else if (currentUserRole === "tutor") {
      // Tutors see student name as main and tutor name as secondary
      return {
        mainName: contact.studentName,
        secondaryName: `Tutor: ${contact.tutorName}`,
        avatar: contact.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.studentName)}&background=0D8ABC&color=fff`
      };
    }
    return {
      mainName: contact.displayName,
      secondaryName: contact.userRole,
      avatar: contact.avatar
    };
  };

  const displayInfo = getDisplayInfo();
  const previewText = getPreviewText();

  return (
    <div
      onClick={() => onSelect(contact)}
      className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors ${
        isSelected ? "bg-teal-50 border-teal-200" : "hover:bg-gray-50"
      }`}
    >
      <div className="relative">
        <img
          src={displayInfo.avatar}
          alt={displayInfo.mainName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {contact.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-800 truncate">
              {displayInfo.mainName}
            </h3>
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {getRoleBadge()}
            </span>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(contact.lastMessageTime))}
          </span>
        </div>

        <p className="text-xs text-gray-600 mt-1 truncate">
          {displayInfo.secondaryName}
        </p>

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

// WelcomeScreen Component
const WelcomeScreen = ({ onToggleSidebar, currentUserRole, hasContacts }) => {
  const getWelcomeTitle = () => {
    if (currentUserRole === "student") return "Tutor Messages";
    if (currentUserRole === "tutor") return "Student Messages";
    return "Messages";
  };

  const getWelcomeMessage = () => {
    if (currentUserRole === "student")
      return "Select a tutor to view messages and respond to enquiries.";
    if (currentUserRole === "tutor")
      return "Select a student to view messages and help with their learning.";
    return "Select a conversation to start chatting.";
  };

  const getButtonText = () => {
    if (currentUserRole === "student") return "View Tutors";
    if (currentUserRole === "tutor") return "View Students";
    return "View Conversations";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4 text-center">
      <div className="max-w-md">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getWelcomeTitle()}
        </h2>
        <p className="text-gray-600 mb-6">{getWelcomeMessage()}</p>
        {hasContacts && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

// ChatWindow Component
const ChatWindow = ({
  contact,
  onSendMessage,
  onToggleSidebar,
  messagesEndRef,
  currentUserId,
  currentUserRole,
}) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const getPlaceholderText = () => {
    if (currentUserRole === "student") return "Type your message to tutor...";
    if (currentUserRole === "tutor") return "Type your message to student...";
    return "Type a message...";
  };

  const getEmptyMessage = () => {
    if (currentUserRole === "student") return "No messages yet. Start the conversation with your tutor!";
    if (currentUserRole === "tutor")
      return "No messages yet. Send a message to get started!";
    return "No messages yet.";
  };

  const getContactRole = () => {
    // Always show the role of the person you're chatting with
    if (currentUserRole === "student") {
      return "Tutor";
    } else if (currentUserRole === "tutor") {
      return "Student";
    }
    return contact.userRole;
  };

  const getContactName = () => {
    // Always show the name of the person you're chatting with
    if (currentUserRole === "student") {
      return contact.tutorName; // Students see tutor name
    } else if (currentUserRole === "tutor") {
      return contact.studentName; // Tutors see student name
    }
    return contact.displayName;
  };

  const getContactAvatar = () => {
    // Always show the avatar of the person you're chatting with
    if (currentUserRole === "student") {
      return contact.avatar; // Students see tutor avatar
    } else if (currentUserRole === "tutor") {
      return contact.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.studentName)}&background=0D8ABC&color=fff`;
    }
    return contact.avatar;
  };

  const getSecondaryInfo = () => {
    // Show the other person's name as secondary info
    if (currentUserRole === "student") {
      return `Student: ${contact.studentName}`;
    } else if (currentUserRole === "tutor") {
      return `Tutor: ${contact.tutorName}`;
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center pl-16 lg:pl-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden mr-3 text-gray-600 hover:text-gray-800 absolute left-4"
        >
          ←
        </button>

        <img
          src={getContactAvatar()}
          alt={getContactName()}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800">{getContactName()}</h3>
          <p className="text-sm text-gray-500">
            {getContactRole()} • {contact.isOnline ? "Online" : "Offline"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {getSecondaryInfo()}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {contact.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4 text-gray-300">💬</div>
            <p className="text-gray-500 text-lg">{getEmptyMessage()}</p>
            <p className="text-gray-400 text-sm mt-2">
              {currentUserRole === "student" 
                ? "Ask your tutor about courses, schedules, or any questions you have."
                : "Help your student with their learning journey."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contact.messages.map((message) => (
              message && <MessageBubble 
                key={message.id} 
                message={message} 
                currentUserRole={currentUserRole}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 transform rotate-45 -mr-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;