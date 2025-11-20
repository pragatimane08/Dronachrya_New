
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
import { formatDistanceToNow } from "date-fns";
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
            senderName: enquiry.sender?.name || "Unknown",
            receiverName: enquiry.receiver?.name || "Unknown",
            displayName: otherUser?.name || "Unknown",
            userRole: otherUser?.role,
            avatar:
              otherUser?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                otherUser?.name || "User"
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
      const formatted = data.map((msg) => ({
        id: msg.id,
        from: msg.sender_id === currentUserId ? "me" : "user",
        text: msg.content,
        time: formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }),
        timestamp: new Date(msg.created_at),
        createdAt: msg.created_at,
        senderId: msg.sender_id,
        senderName: msg.sender_id === contact.senderId ? contact.senderName : contact.receiverName,
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

    // Filter contacts to show only students in sidebar
    const roleFilteredContacts = contacts.filter((contact) => {
      return contact.userRole === "student";
    });

    if (!matched && roleFilteredContacts.length > 0)
      matched = roleFilteredContacts[0];

    if (matched) {
      setSelectedContact(matched);
      fetchMessages(matched);
      navigate(`?id=${matched.id}&sender=${matched.senderId}&receiver=${matched.receiverId}`, { replace: true });
    }
  }, [
    contacts,
    enquiryIdParam,
    senderParam,
    receiverParam,
    selectedContact,
    isLoading,
    currentUserRole,
  ]);

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

  // Filter contacts to show only students in sidebar
  const filteredContacts = contacts.filter((contact) => {
    const roleFilter = contact.userRole === "student";
    const searchFilter =
      contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    return "Student Messages";
  };

  const getEmptyMessage = () => {
    return "No student messages yet";
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
            placeholder="Search student conversations..."
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
          <div className="text-center text-gray-500 mt-8">
            {searchTerm ? "No student conversations found" : getEmptyMessage()}
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

const ContactItem = ({ contact, isSelected, onSelect }) => {
  const getPreviewText = () => {
    if (!contact.lastMessage) return "No messages yet";
    return contact.lastMessage;
  };

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

const WelcomeScreen = ({ onToggleSidebar, currentUserRole, hasContacts }) => {
  const getWelcomeTitle = () => {
    return "Student Messages";
  };

  const getWelcomeMessage = () => {
    return "Select a conversation to view student messages and respond to enquiries.";
  };

  const getButtonText = () => {
    return "View Student Messages";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4 text-center">
      <div className="max-w-md">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getWelcomeTitle()}
        </h2>
        <p className="text-gray-600 mb-6">{getWelcomeMessage()}</p>
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
    return "Type your response to student...";
  };

  const getEmptyMessage = () => {
    return "No messages yet. Start the conversation!";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center pl-16 lg:pl-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden mr-3 text-gray-600 hover:text-gray-800 absolute left-4"
        >
          ←
        </button>

        <img
          src={contact.avatar}
          alt={contact.displayName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800">{contact.displayName}</h3>
          <p className="text-sm text-gray-500">
            {contact.isOnline ? "Online" : "Last seen recently"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {!contact.messages || contact.messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {getEmptyMessage()}
          </div>
        ) : (
          <div className="space-y-3">
            {contact.messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                currentUserId={currentUserId}
                contact={contact}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

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
            className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="transform rotate-45 block">➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ FIXED MessageBubble with proper error handling
const MessageBubble = ({ message, currentUserId, contact }) => {
  // Add safety checks for undefined message
  if (!message) {
    return null; // or return a placeholder
  }

  const isMe = message.from === "me";
  
  // Determine the sender name with safety checks
  const getSenderName = () => {
    if (isMe) {
      return "You";
    } else {
      // If message sender is the original sender of the enquiry
      if (message.senderId === contact?.senderId) {
        return contact?.senderName || "Unknown";
      } else {
        return contact?.receiverName || "Unknown";
      }
    }
  };

  const senderName = getSenderName();

  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs sm:max-w-md ${isMe ? "text-right" : "text-left"}`}>
        {!isMe && (
          <p className="text-xs text-gray-600 mb-1 ml-1 font-medium">
            {senderName}
          </p>
        )}
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm ${
            isMe
              ? "bg-teal-500 text-white rounded-br-none"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
          }`}
        >
          <p className="text-sm break-words">{message.text || "Message content unavailable"}</p>
          <p
            className={`text-xs mt-1 ${isMe ? "text-teal-100 text-right" : "text-gray-500 text-right"}`}
          >
            {message.time || "Just now"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
