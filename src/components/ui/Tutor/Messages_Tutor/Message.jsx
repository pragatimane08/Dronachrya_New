import React, { useState, useEffect, useRef } from "react"; // ✅ Added useRef
import { useSearchParams, useNavigate } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify"; // ✅ Add this if not already

const Message = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enquiryIdParam = searchParams.get("id");
  const senderParam = searchParams.get("sender");
  const receiverParam = searchParams.get("receiver");

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  const hasLoadedOnce = useRef(false); // ✅ Track initial load

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
            displayName: otherUser?.name || "Unknown",
            messages: [],
            lastMessage: "",
            createdAt: enquiry.created_at,
            isUnread: false,
          });
        }
      });

      setContacts([...uniqueMap.values()]);
    } catch (error) {
      console.error("❌ Failed to fetch enquiries:", error);
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
        createdAt: msg.created_at,
      }));

      const lastMsg = formatted.at(-1);

      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                messages: formatted,
                lastMessage: lastMsg?.text || "",
                createdAt: lastMsg?.createdAt || c.createdAt,
                isUnread: false,
              }
            : c
        )
      );

      setSelectedContact((prev) =>
        prev && prev.id === contact.id
          ? {
              ...prev,
              messages: formatted,
              lastMessage: lastMsg?.text || "",
              isUnread: false,
            }
          : prev
      );

      // ✅ Show success toast only once
      if (!hasLoadedOnce.current) {
        toast.success("Class loaded successfully");
        hasLoadedOnce.current = true;
      }
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
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

    if (!matched && contacts.length > 0) matched = contacts[0];

    if (matched) {
      setSelectedContact(matched);
      fetchMessages(matched);
      navigate(
        `?id=${matched.id}&sender=${matched.senderId}&receiver=${matched.receiverId}`,
        { replace: true }
      );
    }
  }, [contacts, enquiryIdParam, senderParam, receiverParam, selectedContact, isLoading]);

  const handleSelect = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact);
    navigate(`?id=${contact.id}&sender=${contact.senderId}&receiver=${contact.receiverId}`);
  };

  const handleSendMessage = async (messageText) => {
    if (!selectedContact || !messageText.trim()) return;

    const tempMessage = {
      id: Date.now(),
      from: "me",
      text: messageText,
      time: "Just now",
      createdAt: new Date().toISOString(),
    };

    setSelectedContact((prev) => ({
      ...prev,
      messages: [...prev.messages, tempMessage],
    }));

    try {
      await enquiryRepository.sendMessage(selectedContact.id, { content: messageText });
      fetchMessages(selectedContact);
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      setSelectedContact((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== tempMessage.id),
      }));
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border shadow-md mx-4 my-4 rounded-lg overflow-hidden">
      <ChatSidebar
        contacts={contacts}
        onSelect={handleSelect}
        selectedContact={selectedContact}
        isLoading={isLoading}
      />
      <div className="flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !selectedContact ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-lg">
            {contacts.length === 0
              ? "No conversations found"
              : "Select a conversation to start chatting"}
          </div>
        ) : (
          <ChatWindow contact={selectedContact} onSendMessage={handleSendMessage} />
        )}
      </div>
    </div>
  );
};

export default Message;