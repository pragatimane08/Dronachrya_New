import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { enquiryRepository } from "../../../../api/repository/enquiry.repository";
import { formatDistanceToNow } from "date-fns";

const Message = () => {
  const [searchParams] = useSearchParams();
  const enquiryIdParam = searchParams.get("id");
  const senderParam = searchParams.get("sender");
  const receiverParam = searchParams.get("receiver");

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  // ⏱ Auto-refresh messages every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedContact) fetchMessages(selectedContact);
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedContact]);

  // 📦 Load all enquiries and merge into contact list
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await enquiryRepository.getAll();
        const combined = [...(data.sent || []), ...(data.received || [])];

        const contactMap = new Map();

        combined.forEach((item) => {
          const pairKey = [item.sender_id, item.receiver_id].sort().join("-");
          if (!contactMap.has(pairKey)) {
            const name =
              item.Receiver?.Student?.name ||
              item.Receiver?.Tutor?.name ||
              item.Sender?.Student?.name ||
              item.Sender?.Tutor?.name ||
              item.Receiver?.email ||
              item.Sender?.email ||
              "Unknown";

            contactMap.set(pairKey, {
              id: item.id,
              name,
              lastMessage: item.description || "",
              createdAt: item.created_at,
              senderId: item.sender_id,
              receiverId: item.receiver_id,
              messages: [],
            });
          }
        });

        const contactList = Array.from(contactMap.values());
        setContacts(contactList);
      } catch (error) {
        console.error("❌ Failed to fetch enquiries:", error);
      }
    };

    fetchEnquiries();
  }, []);

  // 🎯 Auto-select contact from URL (id + sender/receiver)
  useEffect(() => {
    if (!contacts.length || selectedContact) return;

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

    if (!matched && contacts.length > 0) {
      matched = contacts[0];
    }

    if (matched) {
      setSelectedContact(matched);
    }
  }, [contacts, enquiryIdParam, senderParam, receiverParam, selectedContact]);

  // 📨 Fetch messages for selected contact
  const fetchMessages = async (contact) => {
    try {
      const { data } = await enquiryRepository.getMessages(contact.id);

      const formatted = data.map((msg) => ({
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
              }
            : c
        )
      );

      setSelectedContact((prev) =>
        prev && prev.id === contact.id ? { ...prev, messages: formatted } : prev
      );
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    }
  };

  // ⏬ Fetch only if not already loaded
  useEffect(() => {
    if (selectedContact && selectedContact.messages.length === 0) {
      fetchMessages(selectedContact);
    }
  }, [selectedContact]);

  // 🎯 Manual select handler (from sidebar)
  const handleSelect = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact);
  };

  // 📨 Send message
  const handleSendMessage = async (messageText) => {
    if (!selectedContact || !messageText.trim()) return;

    try {
      await enquiryRepository.sendMessage(selectedContact.id, {
        content: messageText,
      });
      fetchMessages(selectedContact);
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100">
      <ChatSidebar
        contacts={contacts}
        onSearch={() => {}}
        onSelect={handleSelect}
        selectedContact={selectedContact}
      />
      <div className="flex-1">
        {!selectedContact ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-lg">
            Select a conversation to start chatting.
          </div>
        ) : (
          <ChatWindow contact={selectedContact} onSendMessage={handleSendMessage} />
        )}
      </div>
    </div>
  );
};

export default Message;
