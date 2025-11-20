import React from "react";
import { FiMessageSquare } from "react-icons/fi";
import EnquiryCard from "./EnquiryCard";

const FollowUp = ({ enquiries, onRespond }) => {
  // STRICT Filter: Only accepted enquiries with conversation started
  const followUpEnquiries = enquiries.filter(enquiry => {
    const isValid = enquiry.status === "accepted" && enquiry.hasConversationStarted === true;
    
    if (isValid) {
      console.log(`✅ FOLLOW-UP: ${enquiry.name} - ${enquiry.subject} (${enquiry.status})`);
    }
    
    return isValid;
  });

  console.log("🔔 FOLLOW-UP COMPONENT SUMMARY:");
  console.log("Total enquiries received:", enquiries.length);
  console.log("Qualified for follow-up:", followUpEnquiries.length);
  console.log("Follow-up list:", followUpEnquiries.map(e => ({
    id: e.id,
    name: e.name,
    status: e.status,
    subject: e.subject,
    hasConversation: e.hasConversationStarted
  })));

  const displayEnquiries = followUpEnquiries.slice(0, 4);

  if (followUpEnquiries.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FiMessageSquare size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No follow-up enquiries found
        </h3>
        <p className="text-gray-500">
          Enquiries that you've accepted and started conversations will appear here for follow-up.
        </p>
        <div className="mt-4 text-xs text-gray-400">
          <p>Looking for: status = "accepted" AND hasConversationStarted = true</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayEnquiries.map((enquiry) => (
        <EnquiryCard
          key={enquiry.id}
          {...enquiry}
          onRespond={() => onRespond(enquiry)}
          showFollowUpButton={true}
          hasConversationStarted={enquiry.hasConversationStarted}
        />
      ))}
    </div>
  );
};

export default FollowUp;