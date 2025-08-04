import React, { useState, useEffect, useRef } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { enquiryRepository } from '../../../../api/repository/enquiry.repository';

function Message() {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [serverError, setServerError] = useState('');
  const pollingRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser?.id;

  // ✅ Fetch all enquiries (sent + received)
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await enquiryRepository.getAll();

        const uniqueMap = new Map();

        [...(data.sent || []), ...(data.received || [])].forEach((item) => {
          const sender = item.sender_id;
          const receiver = item.receiver_id;

          const key = [sender, receiver].sort().join('-');

          if (!uniqueMap.has(key)) {
            const name =
              item.Receiver?.Student?.name ||
              item.Receiver?.Tutor?.name ||
              item.Sender?.Student?.name ||
              item.Sender?.Tutor?.name ||
              item.Receiver?.email ||
              item.Sender?.email ||
              'Unknown';

            uniqueMap.set(key, {
              id: item.id,
              name,
              createdAt: item.createdAt,
              lastMessage: item.description,
              senderId: sender,
              receiverId: receiver,
              messages: [],
            });
          }
        });

        const deduplicatedContacts = Array.from(uniqueMap.values());
        setContacts(deduplicatedContacts);

        if (deduplicatedContacts.length > 0) {
          const firstContact = deduplicatedContacts[0];
          fetchMessages(firstContact);
        }

        setServerError('');
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to fetch enquiries';
        console.error('❌ Error:', msg);
        setServerError(msg);
      }
    };

    fetchEnquiries();
  }, []);

  // ✅ Load messages for a contact (with optional silent mode)
  const fetchMessages = async (contact, options = {}) => {
    try {
      const { data } = await enquiryRepository.getMessages(contact.id);

      const formattedMessages = data.map((msg) => ({
        from: msg.sender_id === currentUserId ? 'me' : 'user',
        text: msg.content,
        time: new Date(msg.created_at).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: msg.created_at,
      }));

      const updatedContact = { ...contact, messages: formattedMessages };

      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? updatedContact : c))
      );

      setSelectedContact(updatedContact);
    } catch (err) {
      if (!options.silent) {
        console.error('❌ Failed to load messages:', err);
        setSelectedContact({ ...contact, messages: [] });
      }
    }
  };

  // ✅ Polling for messages every 5 seconds
  useEffect(() => {
    if (!selectedContact) return;

    const startPolling = () => {
      pollingRef.current = setInterval(() => {
        fetchMessages(selectedContact, { silent: true });
      }, 5000);
    };

    startPolling();

    return () => {
      clearInterval(pollingRef.current);
    };
  }, [selectedContact]);

  // ✅ Send message and reload messages
  const handleSendMessage = async (text) => {
    if (!selectedContact || !text.trim()) return;

    try {
      await enquiryRepository.sendMessage(selectedContact.id, { content: text });
      await fetchMessages(selectedContact);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message';
      console.error('❌ Error:', msg);
      alert(msg);
    }
  };

  // ✅ Filter contacts by name
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 p-2">
      <div className="w-full max-w-6xl mx-auto h-full bg-white rounded-lg shadow-lg flex border border-gray-200 overflow-hidden">
        {serverError && (
          <div className="text-red-600 text-center p-3 bg-red-100 border border-red-300 w-full font-medium">
            {serverError}
          </div>
        )}

        <ChatSidebar
          contacts={filteredContacts}
          onSearch={setSearch}
          onSelect={fetchMessages}
          selectedContact={selectedContact}
        />

        {selectedContact ? (
          <ChatWindow contact={selectedContact} onSendMessage={handleSendMessage} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
