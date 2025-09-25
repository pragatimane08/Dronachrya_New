// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { groupService } from "../../../../api/repository/groupService.repository";
// import AddMembersModal from "./Groups/AddMembersModal";
// import ScheduleGroupClass from "./Groups/ScheduleGroupClass";

// const MyClasses = () => {
//   const navigate = useNavigate();

//   const [events, setEvents] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [loadingGroups, setLoadingGroups] = useState(true);

//   const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
//   const [groupName, setGroupName] = useState("");
//   const [groupType, setGroupType] = useState("");
//   const [loadingGroupCreate, setLoadingGroupCreate] = useState(false);

//   const [showAddMemberModal, setShowAddMemberModal] = useState(false);
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [selectedGroupId, setSelectedGroupId] = useState(null);
//   const [selectedGroupType, setSelectedGroupType] = useState(null);
//   const [selectedGroupName, setSelectedGroupName] = useState(null);

//   const [editingGroup, setEditingGroup] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [editType, setEditType] = useState("");

//   const [selectedEvent, setSelectedEvent] = useState(null);

//   // Fetch scheduled classes
//   const fetchClassesFromAPI = async () => {
//     try {
//       const res = await groupService.getScheduledClasses();
//       const groupData = res?.classes || [];

//       const formatted = groupData.map((cls, index) => {
//         const isDemo = cls.type === "demo" || (!!cls.Student || !!cls.student_name);
//         const groupName = cls.Group?.name || cls.group_name || "";
//         const titlePrefix = groupName ? `${groupName} - ` : "";
        
//         // Handle group class students
//         const isGroupClass = !!cls.group_id || !!cls.Group?.id;
//         let studentNames = "N/A";
        
//         if (isGroupClass) {
//           // For group classes, try to get student names from various sources
//           if (cls.Students && Array.isArray(cls.Students)) {
//             studentNames = cls.Students.map(s => s.name || s.User?.name).filter(Boolean).join(", ");
//           } else if (cls.GroupMembers && Array.isArray(cls.GroupMembers)) {
//             const students = cls.GroupMembers.filter(m => m.role === 'student');
//             studentNames = students.map(s => s.User?.name || s.name).filter(Boolean).join(", ");
//           } else if (cls.Group && cls.Group.Members) {
//             const students = cls.Group.Members.filter(m => m.role === 'student');
//             studentNames = students.map(s => s.User?.name || s.name).filter(Boolean).join(", ");
//           }
//           if (studentNames === "") studentNames = "No students assigned";
//         } else {
//           // For individual classes
//           studentNames = cls.Student?.name || cls.student_name || "N/A";
//         }

//         return {
//           id: cls.id || `class-${index}-${cls.date_time}`,
//           title: `${titlePrefix}${isDemo ? "Demo Class" : "Regular Class"}`,
//           date: cls.date_time?.split("T")[0],
//           // Add color property for group classes
//           backgroundColor: isGroupClass ? '#10b981' : '#3b82f6', // Green for group classes, blue for individual
//           borderColor: isGroupClass ? '#059669' : '#2563eb',
//           textColor: '#ffffff',
//           extendedProps: {
//             classId: cls.id,
//             groupId: cls.group_id || cls.Group?.id || null,
//             name: cls.name || cls.title || "Class",
//             studentId: cls.student_id || cls.Student?.id || "N/A",
//             student: studentNames,
//             tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
//             group: groupName || "Personal",
//             subject: cls.subject || "N/A",
//             status: cls.status || "Scheduled",
//             type: isDemo ? "demo" : "regular",
//             zoomLink: cls.zoom_link || cls.meeting_link || "#",
//             mode: cls.mode || "online",
//             isGroupClass: isGroupClass,
//             time: cls.date_time
//               ? new Date(cls.date_time).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })
//               : "N/A",
//             date: cls.date_time
//               ? new Date(cls.date_time).toLocaleDateString()
//               : "N/A",
//           },
//         };
//       });

//       setEvents(formatted);
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//       toast.error("Failed to load classes. Please try refreshing the page.");
//     }
//   };

//   // Fetch groups
//   const fetchGroups = async () => {
//     try {
//       setLoadingGroups(true);
      
//       const res = await groupService.getUserGroups();
//       const groupsData = res?.groups || [];

//       const normalized = groupsData.map((g, index) => ({
//         ...g,
//         key: `${g.id}-${index}`,
//         members: (g.Members || []).map((m) => ({
//           id: m.User?.id,
//           role: m.role,
//           name: m.User?.name || "Unnamed",
//           email: m.User?.email || "",
//         })),
//       }));

//       setGroups(normalized);
//     } catch (error) {
//       console.error("Error fetching groups:", error);
//       toast.error("Failed to load groups. Please try refreshing the page.");
//     } finally {
//       setLoadingGroups(false);
//     }
//   };

//   useEffect(() => {
//     fetchClassesFromAPI();
//     fetchGroups();
//   }, []);

//   // Create Group
//   const handleCreateGroup = async (e) => {
//     e.preventDefault();
//     if (!groupName.trim()) {
//       toast.error("Group name is required");
//       return;
//     }
//     if (!groupType) {
//       toast.error("Please select a group type");
//       return;
//     }
    
//     try {
//       setLoadingGroupCreate(true);
//       toast.dismiss(); // Clear any existing toasts
//       toast.loading("Creating group...");
      
//       await groupService.createGroup({ name: groupName, type: groupType });
//       toast.dismiss(); // Clear loading toast
//       toast.success(`Group "${groupName}" created successfully!`);
      
//       setShowCreateGroupModal(false);
//       setGroupName("");
//       setGroupType("");
//       fetchGroups();
//     } catch (error) {
//       console.error("Error creating group:", error);
//       toast.dismiss(); // Clear loading toast
//       const errorMessage = error.response?.data?.message || error.message || "Failed to create group";
//       toast.error(errorMessage);
//     } finally {
//       setLoadingGroupCreate(false);
//     }
//   };

//   // Update Group
//   const handleUpdateGroup = async (e) => {
//     e.preventDefault();
//     if (!editName.trim()) {
//       toast.error("Group name is required");
//       return;
//     }
//     if (!editType) {
//       toast.error("Please select a group type");
//       return;
//     }

//     try {
//       toast.dismiss(); // Clear any existing toasts
//       toast.loading("Updating group...");
      
//       await groupService.updateGroup(editingGroup.id, { name: editName, type: editType });
//       toast.dismiss(); // Clear loading toast
//       toast.success(`Group "${editName}" updated successfully!`);
      
//       setEditingGroup(null);
//       setEditName("");
//       setEditType("");
//       fetchGroups();
//     } catch (error) {
//       console.error("Error updating group:", error);
//       toast.dismiss(); // Clear loading toast
//       const errorMessage = error.response?.data?.message || error.message || "Failed to update group";
//       toast.error(errorMessage);
//     }
//   };

//   // Delete Group
//   const handleDeleteGroup = async (groupId) => {
//     const group = groups.find(g => g.id === groupId);
//     const groupName = group?.name || "this group";
    
//     // Custom confirmation toast instead of window.confirm
//     const confirmDelete = () => {
//       toast.dismiss(); // Clear any existing toasts
      
//       toast((t) => (
//         <div className="flex flex-col gap-3">
//           <div>
//             <p className="font-semibold">Delete Group</p>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to delete "{groupName}"? This action cannot be undone.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 performDelete();
//               }}
//               className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//             >
//               Delete
//             </button>
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 toast.info("Delete cancelled");
//               }}
//               className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ), {
//         duration: Infinity,
//         position: 'top-center',
//       });
//     };

//     const performDelete = async () => {
//       try {
//         toast.loading("Deleting group...");
        
//         await groupService.deleteGroup(groupId);
//         toast.dismiss(); // Clear loading toast
//         toast.success(`Group "${groupName}" deleted successfully!`);
        
//         setGroups((prev) => prev.filter((g) => g.id !== groupId));
//         setEvents((prev) => prev.filter((ev) => ev.extendedProps.groupId !== groupId));
//       } catch (error) {
//         console.error("Error deleting group:", error);
//         toast.dismiss(); // Clear loading toast
//         const errorMessage = error.response?.data?.message || error.message || "Failed to delete group";
//         toast.error(errorMessage);
//       }
//     };

//     confirmDelete();
//   };

//   // Remove Member
//   const handleRemoveMember = async (groupId, userId) => {
//     const group = groups.find(g => g.id === groupId);
//     const member = group?.members.find(m => m.id === userId);
//     const memberName = member?.name || "this member";
    
//     // Custom confirmation toast
//     const confirmRemove = () => {
//       toast.dismiss(); // Clear any existing toasts
      
//       toast((t) => (
//         <div className="flex flex-col gap-3">
//           <div>
//             <p className="font-semibold">Remove Member</p>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to remove "{memberName}" from the group?
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 performRemove();
//               }}
//               className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//             >
//               Remove
//             </button>
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 toast.info("Remove cancelled");
//               }}
//               className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ), {
//         duration: Infinity,
//         position: 'top-center',
//       });
//     };

//     const performRemove = async () => {
//       try {
//         toast.loading("Removing member...");
        
//         await groupService.removeMember(groupId, userId);
//         toast.dismiss(); // Clear loading toast
//         toast.success(`"${memberName}" removed from group successfully!`);
        
//         fetchGroups();
//       } catch (error) {
//         console.error("Error removing member:", error);
//         toast.dismiss(); // Clear loading toast
//         const errorMessage = error.response?.data?.message || error.message || "Failed to remove member";
//         toast.error(errorMessage);
//       }
//     };

//     confirmRemove();
//   };

//   // Handle modal close with custom toast confirmation
//   const handleCloseCreateModal = () => {
//     if (groupName.trim() || groupType) {
//       toast.dismiss(); // Clear any existing toasts
      
//       toast((t) => (
//         <div className="flex flex-col gap-3">
//           <div>
//             <p className="font-semibold">Unsaved Changes</p>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to close? Your changes will be lost.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 setShowCreateGroupModal(false);
//                 setGroupName("");
//                 setGroupType("");
//                 toast.info("Group creation cancelled");
//               }}
//               className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//             >
//               Close
//             </button>
//             <button
//               onClick={() => toast.dismiss(t.id)}
//               className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
//             >
//               Continue Editing
//             </button>
//           </div>
//         </div>
//       ), {
//         duration: Infinity,
//         position: 'top-center',
//       });
//     } else {
//       setShowCreateGroupModal(false);
//     }
//   };

//   const handleCloseEditModal = () => {
//     if (editName !== editingGroup?.name || editType !== editingGroup?.type) {
//       toast.dismiss(); // Clear any existing toasts
      
//       toast((t) => (
//         <div className="flex flex-col gap-3">
//           <div>
//             <p className="font-semibold">Unsaved Changes</p>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to close? Your changes will be lost.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 setEditingGroup(null);
//                 setEditName("");
//                 setEditType("");
//                 toast.info("Edit cancelled");
//               }}
//               className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//             >
//               Close
//             </button>
//             <button
//               onClick={() => toast.dismiss(t.id)}
//               className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
//             >
//               Continue Editing
//             </button>
//           </div>
//         </div>
//       ), {
//         duration: Infinity,
//         position: 'top-center',
//       });
//     } else {
//       setEditingGroup(null);
//       setEditName("");
//       setEditType("");
//     }
//   };

//   // Handle event click
//   const handleEventClick = (info) => {
//     setSelectedEvent(info.event.extendedProps);
//   };

//   // Handle Add Class navigation
//   const handleAddClass = () => {
//     navigate("/add-class-form-tutor");
//   };

//   return (
//     <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
//       <ToastContainer 
//         position="top-right" 
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       {/* Enhanced Responsive CSS for FullCalendar */}
//       <style>{`
//         /* Desktop styles */
//         .fc-button {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           color: white !important;
//           font-weight: 500 !important;
//           padding: 8px 16px !important;
//           border-radius: 8px !important;
//           transition: background-color 0.2s ease !important;
//           font-size: 14px !important;
//           min-height: 36px !important;
//         }
        
//         .fc-button:hover {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }
        
//         .fc-button:focus {
//           box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2) !important;
//         }
        
//         .fc-button:disabled {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           opacity: 0.6 !important;
//         }
        
//         .fc-today-button.fc-button-active {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }
        
//         .fc-today-button {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           color: white !important;
//         }
        
//         .fc-today-button:hover {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }
        
//         .fc-addClass-button,
//         .fc-createGroup-button {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           color: white !important;
//           font-weight: 500 !important;
//           padding: 8px 16px !important;
//           border-radius: 8px !important;
//           transition: background-color 0.2s ease !important;
//         }
        
//         .fc-addClass-button:hover,
//         .fc-createGroup-button:hover {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }

//         /* Mobile and tablet responsive styles */
//         @media (max-width: 768px) {
//           .fc-header-toolbar {
//             flex-direction: column !important;
//             gap: 12px !important;
//             padding: 8px !important;
//           }
          
//           .fc-toolbar-chunk {
//             display: flex !important;
//             justify-content: center !important;
//             flex-wrap: wrap !important;
//             gap: 6px !important;
//           }
          
//           .fc-button {
//             padding: 6px 10px !important;
//             font-size: 12px !important;
//             min-height: 32px !important;
//             min-width: auto !important;
//             flex: 0 0 auto !important;
//           }
          
//           .fc-button-group {
//             display: flex !important;
//             flex-wrap: wrap !important;
//             gap: 4px !important;
//             justify-content: center !important;
//           }
          
//           .fc-button-group .fc-button {
//             border-radius: 6px !important;
//             margin: 0 !important;
//           }
          
//           .fc-title-container {
//             text-align: center !important;
//             margin: 8px 0 !important;
//           }
          
//           .fc-title {
//             font-size: 16px !important;
//             font-weight: 600 !important;
//             color: #1f2937 !important;
//           }
          
//           /* Custom button responsiveness */
//           .fc-addClass-button {
//             min-width: 80px !important;
//           }
          
//           .fc-createGroup-button {
//             min-width: 95px !important;
//           }
          
//           /* Calendar grid responsiveness */
//           .fc-daygrid-day {
//             min-height: 60px !important;
//           }
          
//           .fc-daygrid-day-number {
//             padding: 4px !important;
//             font-size: 14px !important;
//           }
          
//           .fc-event-title {
//             font-size: 11px !important;
//             padding: 2px 4px !important;
//             overflow: hidden !important;
//             text-overflow: ellipsis !important;
//             white-space: nowrap !important;
//           }
          
//           .fc-daygrid-event {
//             margin: 1px 2px !important;
//             border-radius: 4px !important;
//           }
          
//           /* Day header styling for mobile */
//           .fc-col-header-cell {
//             padding: 4px 2px !important;
//           }
          
//           .fc-col-header-cell-cushion {
//             font-size: 12px !important;
//             font-weight: 600 !important;
//             padding: 4px !important;
//           }
//         }

//         /* Extra small screens */
//         @media (max-width: 480px) {
//           .fc-button {
//             padding: 5px 8px !important;
//             font-size: 11px !important;
//             min-height: 28px !important;
//           }
          
//           .fc-title {
//             font-size: 14px !important;
//           }
          
//           .fc-addClass-button {
//             min-width: 70px !important;
//           }
          
//           .fc-createGroup-button {
//             min-width: 80px !important;
//           }
          
//           .fc-daygrid-day {
//             min-height: 50px !important;
//           }
          
//           .fc-event-title {
//             font-size: 10px !important;
//           }
          
//           .fc-col-header-cell-cushion {
//             font-size: 11px !important;
//           }
//         }

//         /* Tablet landscape optimizations */
//         @media (min-width: 769px) and (max-width: 1024px) {
//           .fc-button {
//             padding: 7px 14px !important;
//             font-size: 13px !important;
//             min-height: 34px !important;
//           }
          
//           .fc-title {
//             font-size: 18px !important;
//           }
//         }
//       `}</style>

//       <div className="bg-white rounded-xl shadow-md p-2 sm:p-4 md:p-6 mb-8 border border-gray-100">
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           height="auto"
//           eventClick={handleEventClick}
//           customButtons={{
//             addClass: {
//               text: "Add Class",
//               click: handleAddClass,
//             },
//             createGroup: {
//               text: "Create Group",
//               click: () => {
//                 setShowCreateGroupModal(true);
//                 toast.info("Opening create group form");
//               },
//             },
//           }}
//           headerToolbar={{
//             left: "title",
//             center: "",
//             right: "prev today next addClass createGroup",
//           }}
//           buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
//           dayHeaderClassNames="bg-gray-100 text-gray-700 font-medium"
//           dayCellClassNames="hover:bg-gray-50 transition-colors"
//           eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
//         />
//       </div>

//       {/* Event Details Modal - Enhanced Responsive */}
//       {selectedEvent && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
//             <div className="bg-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center">
//               <h2 className="text-lg sm:text-xl font-semibold truncate">Class Details</h2>
//               <button
//                 onClick={() => {
//                   setSelectedEvent(null);
//                   toast.info("Class details closed");
//                 }}
//                 className="text-white hover:text-gray-200 flex-shrink-0 ml-2"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="p-4 sm:p-6 space-y-3 overflow-y-auto max-h-[calc(90vh-80px)]">
//               <div className="grid gap-3">
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Class:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.name}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Student{selectedEvent.isGroupClass ? 's' : ''}:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.student}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Tutor:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.tutor}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Group:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.group}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Status:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.status}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Type:</span>
//                   <span className="text-gray-900 break-words capitalize">{selectedEvent.type}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Date:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.date}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Time:</span>
//                   <span className="text-gray-900 break-words">{selectedEvent.time}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
//                   <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px] sm:mt-1">Zoom Link:</span>
//                   <a
//                     href={selectedEvent.zoomLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-indigo-600 underline break-all hover:text-indigo-800 transition-colors"
//                     onClick={() => toast.success("Opening Zoom meeting...")}
//                   >
//                     Join Meeting
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Groups Section - Enhanced Responsive */}
//       <div className="mt-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">My Groups</h2>
//         </div>
        
//         {loadingGroups ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : groups.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//             </svg>
//             <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
//             <p className="text-gray-500">Create your first group to get started</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {groups.map((group, index) => (
//               <div
//                 key={`${group.id}-${index}`}
//                 className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
//               >
//                 <div className="p-4 sm:p-5 border-b border-gray-100">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{group.name}</h3>
//                       <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
//                         {group.type}
//                       </span>
//                     </div>
//                     <div className="flex space-x-1 sm:space-x-2 ml-2 flex-shrink-0">
//                       <button
//                         onClick={() => {
//                           setEditingGroup(group);
//                           setEditName(group.name);
//                           setEditType(group.type);
//                           toast.info("Opening edit form");
//                         }}
//                         className="text-gray-500 hover:text-indigo-600 transition-colors p-1"
//                         title="Edit group"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
//                           <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => handleDeleteGroup(group.id)}
//                         className="text-gray-500 hover:text-red-600 transition-colors p-1"
//                         title="Delete group"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-4 sm:p-5">
//                   <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//                     </svg>
//                     Members ({group.members.length})
//                   </h4>
//                   {group.members.length > 0 ? (
//                     <ul className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
//                       {group.members.map((m) => (
//                         <li key={`${group.id}-${m.id}`} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
//                           <div className="flex-1 min-w-0">
//                             <span className="text-sm font-medium text-gray-800 block truncate">{m.name}</span>
//                             <span className="text-xs text-gray-500 capitalize">{m.role}</span>
//                           </div>
//                           <button
//                             onClick={() => handleRemoveMember(group.id, m.id)}
//                             className="text-red-500 hover:text-red-700 transition-colors text-xs flex items-center ml-2 flex-shrink-0 p-1"
//                             title="Remove member"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM9 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                             <span className="hidden sm:inline ml-1">Remove</span>
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-gray-400 text-sm italic">No members yet</p>
//                   )}
//                 </div>

//                 <div className="p-4 sm:p-5 bg-gray-50 flex flex-col sm:flex-row gap-2">
//                   <button
//                     onClick={() => {
//                       setSelectedGroupId(group.id);
//                       setSelectedGroupType(group.type);
//                       setSelectedGroupName(group.name);
//                       setShowAddMemberModal(true);
//                       toast.info("Opening add members form");
//                     }}
//                     className="flex-1 bg-white text-indigo-600 border border-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
//                     </svg>
//                     <span className="hidden xs:inline">Add Members</span>
//                     <span className="xs:hidden">Add</span>
//                   </button>

//                   <button
//                     onClick={() => {
//                       setSelectedGroupId(group.id);
//                       setSelectedGroupType(group.type);
//                       setSelectedGroupName(group.name);
//                       setShowScheduleModal(true);
//                       toast.info("Opening schedule class form");
//                     }}
//                     className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//                     </svg>
//                     <span className="hidden xs:inline">Schedule Class</span>
//                     <span className="xs:hidden">Schedule</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Create Group Modal - Enhanced Responsive */}
//       {showCreateGroupModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
//             <div className="bg-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center">
//               <h2 className="text-lg sm:text-xl font-semibold">Create Group</h2>
//               <button
//                 onClick={handleCloseCreateModal}
//                 className="text-white hover:text-gray-200 transition-colors focus:outline-none flex-shrink-0 ml-2"
//                 aria-label="Close"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 sm:h-6 sm:w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleCreateGroup} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(90vh-80px)]">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
//                 <input
//                   type="text"
//                   value={groupName}
//                   onChange={(e) => setGroupName(e.target.value)}
//                   placeholder="Enter group name"
//                   className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
//                 <select
//                   value={groupType}
//                   onChange={(e) => setGroupType(e.target.value)}
//                   className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
//                 >
//                   <option value="">Select Type</option>
//                   <option value="tutor">Tutor Group</option>
//                   <option value="student">Student Group</option>
//                 </select>
//               </div>
//               <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseCreateModal}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base order-2 sm:order-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loadingGroupCreate}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
//                 >
//                   {loadingGroupCreate ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Creating...
//                     </>
//                   ) : "Create Group"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Update Group Modal - Enhanced Responsive */}
//       {editingGroup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
//             <div className="bg-yellow-500 p-4 sm:p-5 text-white flex justify-between items-center">
//               <h2 className="text-lg sm:text-xl font-semibold">Update Group</h2>
//               <button
//                 onClick={handleCloseEditModal}
//                 className="text-white hover:text-gray-200 transition-colors focus:outline-none flex-shrink-0 ml-2"
//                 aria-label="Close"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 sm:h-6 sm:w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleUpdateGroup} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(90vh-80px)]">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
//                 <input
//                   type="text"
//                   value={editName}
//                   onChange={(e) => setEditName(e.target.value)}
//                   placeholder="Enter group name"
//                   className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
//                 <select
//                   value={editType}
//                   onChange={(e) => setEditType(e.target.value)}
//                   className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
//                 >
//                   <option value="">Select Type</option>
//                   <option value="tutor">Tutor Group</option>
//                   <option value="student">Student Group</option>
//                 </select>
//               </div>
//               <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseEditModal}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base order-2 sm:order-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base order-1 sm:order-2"
//                 >
//                   Update Group
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add Members Modal */}
//       {showAddMemberModal && (
//         <AddMembersModal
//           groupId={selectedGroupId}
//           groupType={selectedGroupType}
//           onClose={() => {
//             setShowAddMemberModal(false);
//             toast.info("Add members form closed");
//           }}
//           onMembersAdded={(addedCount) => {
//             fetchGroups();
//             if (addedCount) {
//               toast.success(`${addedCount} member(s) added successfully!`);
//             }
//           }}
//         />
//       )}

//       {/* Schedule Class Modal */}
//       {showScheduleModal && (
//         <ScheduleGroupClass
//           groupId={selectedGroupId}
//           groupType={selectedGroupType}
//           groupName={selectedGroupName}
//           onClose={() => {
//             setShowScheduleModal(false);
//             toast.info("Schedule class form closed");
//           }}
//           onClassScheduled={(className) => {
//             fetchClassesFromAPI();
//             if (className) {
//               toast.success(`Class "${className}" scheduled successfully!`);
//             } else {
//               toast.success("Class scheduled successfully!");
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // In your MyClasses component, replace the existing <style> block with this:

//       {/* Enhanced Responsive CSS for FullCalendar - Fixed Overlapping Issue */}
//       <style>{`
//         /* Desktop styles */
//         .fc-button {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           color: white !important;
//           font-weight: 500 !important;
//           padding: 8px 16px !important;
//           border-radius: 8px !important;
//           transition: background-color 0.2s ease !important;
//           font-size: 14px !important;
//           min-height: 36px !important;
//           white-space: nowrap !important;
//           margin: 2px !important;
//         }
        
//         .fc-button:hover {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }
        
//         .fc-button:focus {
//           box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2) !important;
//         }
        
//         .fc-button:disabled {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           opacity: 0.6 !important;
//         }
        
//         .fc-today-button.fc-button-active {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }
        
//         .fc-today-button {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           color: white !important;
//         }
        
//         .fc-today-button:hover {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }
        
//         .fc-addClass-button,
//         .fc-createGroup-button {
//           background-color: #0d9488 !important;
//           border-color: #0d9488 !important;
//           color: white !important;
//           font-weight: 500 !important;
//           padding: 8px 16px !important;
//           border-radius: 8px !important;
//           transition: background-color 0.2s ease !important;
//         }
        
//         .fc-addClass-button:hover,
//         .fc-createGroup-button:hover {
//           background-color: #0f766e !important;
//           border-color: #0f766e !important;
//         }

//         /* Fixed header toolbar layout */
//         .fc-header-toolbar {
//           display: flex !important;
//           justify-content: space-between !important;
//           align-items: center !important;
//           flex-wrap: wrap !important;
//           gap: 8px !important;
//           padding: 12px 8px !important;
//         }

//         .fc-toolbar-chunk {
//           display: flex !important;
//           align-items: center !important;
//           gap: 4px !important;
//           flex-wrap: nowrap !important;
//         }

//         /* Ensure title has enough space */
//         .fc-toolbar-title {
//           font-size: 18px !important;
//           font-weight: 600 !important;
//           color: #1f2937 !important;
//           margin: 0 8px !important;
//           white-space: nowrap !important;
//           overflow: hidden !important;
//           text-overflow: ellipsis !important;
//         }

//         /* Button group styling */
//         .fc-button-group {
//           display: flex !important;
//           gap: 2px !important;
//           flex-wrap: nowrap !important;
//         }

//         .fc-button-group .fc-button {
//           border-radius: 6px !important;
//           margin: 0 !important;
//         }

//         /* Mobile and tablet responsive styles */
//         @media (max-width: 768px) {
//           .fc-header-toolbar {
//             flex-direction: column !important;
//             gap: 12px !important;
//             padding: 8px !important;
//           }
          
//           .fc-toolbar-chunk {
//             justify-content: center !important;
//             flex-wrap: wrap !important;
//             gap: 6px !important;
//           }
          
//           .fc-button {
//             padding: 6px 10px !important;
//             font-size: 12px !important;
//             min-height: 32px !important;
//             min-width: 70px !important;
//             flex: 0 0 auto !important;
//           }
          
//           .fc-toolbar-title {
//             font-size: 16px !important;
//             text-align: center !important;
//             margin: 4px 0 !important;
//             max-width: 100% !important;
//           }
          
//           /* Stack navigation and action buttons on mobile */
//           .fc-toolbar-chunk:first-child {
//             order: 2;
//             width: 100%;
//             justify-content: center;
//           }
          
//           .fc-toolbar-chunk:nth-child(2) {
//             order: 1;
//             width: 100%;
//             justify-content: center;
//           }
          
//           .fc-toolbar-chunk:last-child {
//             order: 3;
//             width: 100%;
//             justify-content: center;
//           }
          
//           .fc-addClass-button {
//             min-width: 80px !important;
//           }
          
//           .fc-createGroup-button {
//             min-width: 95px !important;
//           }
          
//           /* Calendar grid responsiveness */
//           .fc-daygrid-day {
//             min-height: 60px !important;
//           }
          
//           .fc-daygrid-day-number {
//             padding: 4px !important;
//             font-size: 14px !important;
//           }
          
//           .fc-event-title {
//             font-size: 11px !important;
//             padding: 2px 4px !important;
//             overflow: hidden !important;
//             text-overflow: ellipsis !important;
//             white-space: nowrap !important;
//           }
          
//           .fc-daygrid-event {
//             margin: 1px 2px !important;
//             border-radius: 4px !important;
//           }
          
//           /* Day header styling for mobile */
//           .fc-col-header-cell {
//             padding: 4px 2px !important;
//           }
          
//           .fc-col-header-cell-cushion {
//             font-size: 12px !important;
//             font-weight: 600 !important;
//             padding: 4px !important;
//           }
//         }

//         /* Extra small screens */
//         @media (max-width: 480px) {
//           .fc-button {
//             padding: 5px 8px !important;
//             font-size: 11px !important;
//             min-height: 28px !important;
//             min-width: 65px !important;
//           }
          
//           .fc-toolbar-title {
//             font-size: 14px !important;
//           }
          
//           .fc-addClass-button {
//             min-width: 70px !important;
//           }
          
//           .fc-createGroup-button {
//             min-width: 80px !important;
//           }
          
//           .fc-daygrid-day {
//             min-height: 50px !important;
//           }
          
//           .fc-event-title {
//             font-size: 10px !important;
//           }
          
//           .fc-col-header-cell-cushion {
//             font-size: 11px !important;
//           }
//         }

//         /* Tablet landscape optimizations */
//         @media (min-width: 769px) and (max-width: 1024px) {
//           .fc-button {
//             padding: 7px 14px !important;
//             font-size: 13px !important;
//             min-height: 34px !important;
//           }
          
//           .fc-toolbar-title {
//             font-size: 18px !important;
//           }
//         }

//         /* Large screens - ensure proper spacing */
//         @media (min-width: 1025px) {
//           .fc-header-toolbar {
//             padding: 16px 12px !important;
//           }
          
//           .fc-toolbar-chunk {
//             gap: 8px !important;
//           }
          
//           .fc-button {
//             padding: 10px 18px !important;
//             font-size: 14px !important;
//             min-height: 38px !important;
//           }
          
//           .fc-toolbar-title {
//             font-size: 20px !important;
//             margin: 0 16px !important;
//           }
//         }
//       `}</style>
      
// export default MyClasses;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { groupService } from "../../../../api/repository/groupService.repository";
import AddMembersModal from "./Groups/AddMembersModal";
import ScheduleGroupClass from "./Groups/ScheduleGroupClass";

const MyClasses = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [loadingGroupCreate, setLoadingGroupCreate] = useState(false);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupType, setSelectedGroupType] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);

  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch scheduled classes
  const fetchClassesFromAPI = async () => {
    try {
      const res = await groupService.getScheduledClasses();
      const groupData = res?.classes || [];

      const formatted = groupData.map((cls, index) => {
        const isDemo = cls.type === "demo" || (!!cls.Student || !!cls.student_name);
        const groupName = cls.Group?.name || cls.group_name || "";
        const titlePrefix = groupName ? `${groupName} - ` : "";
       
        // Handle group class students
        const isGroupClass = !!cls.group_id || !!cls.Group?.id;
        let studentNames = "N/A";
       
        if (isGroupClass) {
          // For group classes, try to get student names from various sources
          if (cls.Students && Array.isArray(cls.Students)) {
            studentNames = cls.Students.map(s => s.name || s.User?.name).filter(Boolean).join(", ");
          } else if (cls.GroupMembers && Array.isArray(cls.GroupMembers)) {
            const students = cls.GroupMembers.filter(m => m.role === 'student');
            studentNames = students.map(s => s.User?.name || s.name).filter(Boolean).join(", ");
          } else if (cls.Group && cls.Group.Members) {
            const students = cls.Group.Members.filter(m => m.role === 'student');
            studentNames = students.map(s => s.User?.name || s.name).filter(Boolean).join(", ");
          }
          if (studentNames === "") studentNames = "No students assigned";
        } else {
          // For individual classes
          studentNames = cls.Student?.name || cls.student_name || "N/A";
        }

        return {
          id: cls.id || `class-${index}-${cls.date_time}`,
          title: `${titlePrefix}${isDemo ? "Demo Class" : "Regular Class"}`,
          date: cls.date_time?.split("T")[0],
          // Add color property for group classes
          backgroundColor: isGroupClass ? '#10b981' : '#3b82f6', // Green for group classes, blue for individual
          borderColor: isGroupClass ? '#059669' : '#2563eb',
          textColor: '#ffffff',
          extendedProps: {
            classId: cls.id,
            groupId: cls.group_id || cls.Group?.id || null,
            name: cls.name || cls.title || "Class",
            studentId: cls.student_id || cls.Student?.id || "N/A",
            student: studentNames,
            tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
            group: groupName || "Personal",
            subject: cls.subject || "N/A",
            status: cls.status || "Scheduled",
            type: isDemo ? "demo" : "regular",
            zoomLink: cls.zoom_link || cls.meeting_link || "#",
            mode: cls.mode || "online",
            isGroupClass: isGroupClass,
            time: cls.date_time
              ? new Date(cls.date_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            date: cls.date_time
              ? new Date(cls.date_time).toLocaleDateString()
              : "N/A",
          },
        };
      });

      setEvents(formatted);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes. Please try refreshing the page.");
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
     
      const res = await groupService.getUserGroups();
      const groupsData = res?.groups || [];

      const normalized = groupsData.map((g, index) => ({
        ...g,
        key: `${g.id}-${index}`,
        members: (g.Members || []).map((m) => ({
          id: m.User?.id,
          role: m.role,
          name: m.User?.name || "Unnamed",
          email: m.User?.email || "",
        })),
      }));

      setGroups(normalized);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups. Please try refreshing the page.");
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchClassesFromAPI();
    fetchGroups();
  }, []);

  // Create Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (!groupType) {
      toast.error("Please select a group type");
      return;
    }
   
    try {
      setLoadingGroupCreate(true);
      toast.dismiss(); // Clear any existing toasts
      toast.loading("Creating group...");
     
      await groupService.createGroup({ name: groupName, type: groupType });
      toast.dismiss(); // Clear loading toast
      toast.success(`Group "${groupName}" created successfully!`);
     
      setShowCreateGroupModal(false);
      setGroupName("");
      setGroupType("");
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.dismiss(); // Clear loading toast
      const errorMessage = error.response?.data?.message || error.message || "Failed to create group";
      toast.error(errorMessage);
    } finally {
      setLoadingGroupCreate(false);
    }
  };

  // Update Group
  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (!editType) {
      toast.error("Please select a group type");
      return;
    }

    try {
      toast.dismiss(); // Clear any existing toasts
      toast.loading("Updating group...");
     
      await groupService.updateGroup(editingGroup.id, { name: editName, type: editType });
      toast.dismiss(); // Clear loading toast
      toast.success(`Group "${editName}" updated successfully!`);
     
      setEditingGroup(null);
      setEditName("");
      setEditType("");
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      toast.dismiss(); // Clear loading toast
      const errorMessage = error.response?.data?.message || error.message || "Failed to update group";
      toast.error(errorMessage);
    }
  };

  // Delete Group
  const handleDeleteGroup = async (groupId) => {
    const group = groups.find(g => g.id === groupId);
    const groupName = group?.name || "this group";
   
    // Custom confirmation toast instead of window.confirm
    const confirmDelete = () => {
      toast.dismiss(); // Clear any existing toasts
     
      toast((t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold">Delete Group</p>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete "{groupName}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDelete();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.info("Delete cancelled");
              }}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    };

    const performDelete = async () => {
      try {
        toast.loading("Deleting group...");
       
        await groupService.deleteGroup(groupId);
        toast.dismiss(); // Clear loading toast
        toast.success(`Group "${groupName}" deleted successfully!`);
       
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        setEvents((prev) => prev.filter((ev) => ev.extendedProps.groupId !== groupId));
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.dismiss(); // Clear loading toast
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete group";
        toast.error(errorMessage);
      }
    };

    confirmDelete();
  };

  // Remove Member
  const handleRemoveMember = async (groupId, userId) => {
    const group = groups.find(g => g.id === groupId);
    const member = group?.members.find(m => m.id === userId);
    const memberName = member?.name || "this member";
   
    // Custom confirmation toast
    const confirmRemove = () => {
      toast.dismiss(); // Clear any existing toasts
     
      toast((t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold">Remove Member</p>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove "{memberName}" from the group?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performRemove();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Remove
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.info("Remove cancelled");
              }}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    };

    const performRemove = async () => {
      try {
        toast.loading("Removing member...");
       
        await groupService.removeMember(groupId, userId);
        toast.dismiss(); // Clear loading toast
        toast.success(`"${memberName}" removed from group successfully!`);
       
        fetchGroups();
      } catch (error) {
        console.error("Error removing member:", error);
        toast.dismiss(); // Clear loading toast
        const errorMessage = error.response?.data?.message || error.message || "Failed to remove member";
        toast.error(errorMessage);
      }
    };

    confirmRemove();
  };

  // Handle modal close with custom toast confirmation
  const handleCloseCreateModal = () => {
    if (groupName.trim() || groupType) {
      toast.dismiss(); // Clear any existing toasts
     
      toast((t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold">Unsaved Changes</p>
            <p className="text-sm text-gray-600">
              Are you sure you want to close? Your changes will be lost.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setShowCreateGroupModal(false);
                setGroupName("");
                setGroupType("");
                toast.info("Group creation cancelled");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Close
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
            >
              Continue Editing
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    } else {
      setShowCreateGroupModal(false);
    }
  };

  const handleCloseEditModal = () => {
    if (editName !== editingGroup?.name || editType !== editingGroup?.type) {
      toast.dismiss(); // Clear any existing toasts
     
      toast((t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold">Unsaved Changes</p>
            <p className="text-sm text-gray-600">
              Are you sure you want to close? Your changes will be lost.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setEditingGroup(null);
                setEditName("");
                setEditType("");
                toast.info("Edit cancelled");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Close
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
            >
              Continue Editing
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    } else {
      setEditingGroup(null);
      setEditName("");
      setEditType("");
    }
  };

  // Handle event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
  };

  // Handle Add Class navigation
  const handleAddClass = () => {
    navigate("/add-class-form-tutor");
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Enhanced Responsive CSS for FullCalendar - Fixed Overlapping Issue */}
      <style>{`
        /* Desktop styles */
        .fc-button {
          background-color: #0d9488 !important;
          border-color: #0d9488 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: background-color 0.2s ease !important;
          font-size: 14px !important;
          min-height: 36px !important;
          white-space: nowrap !important;
          margin: 2px !important;
          box-sizing: border-box !important;
        }
       
        .fc-button:hover {
          background-color: #0f766e !important;
          border-color: #0f766e !important;
        }
       
        .fc-button:focus {
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2) !important;
        }
       
        .fc-button:disabled {
          background-color: #0d9488 !important;
          border-color: #0d9488 !important;
          opacity: 0.6 !important;
        }
       
        .fc-today-button.fc-button-active {
          background-color: #0f766e !important;
          border-color: #0f766e !important;
        }
       
        .fc-today-button {
          background-color: #0d9488 !important;
          border-color: #0d9488 !important;
          color: white !important;
        }
       
        .fc-today-button:hover {
          background-color: #0f766e !important;
          border-color: #0f766e !important;
        }
       
        .fc-addClass-button,
        .fc-createGroup-button {
          background-color: #0d9488 !important;
          border-color: #0d9488 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: background-color 0.2s ease !important;
        }
       
        .fc-addClass-button:hover,
        .fc-createGroup-button:hover {
          background-color: #0f766e !important;
          border-color: #0f766e !important;
        }

        /* Fixed header toolbar layout */
        .fc-header-toolbar {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          padding: 12px 8px !important;
          min-height: 60px !important;
        }

        .fc-toolbar-chunk {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          flex-wrap: nowrap !important;
          flex-shrink: 0 !important;
        }

        /* Ensure title has enough space */
        .fc-toolbar-title {
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 0 8px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          flex-shrink: 1 !important;
          min-width: 0 !important;
        }

        /* Button group styling */
        .fc-button-group {
          display: flex !important;
          gap: 2px !important;
          flex-wrap: nowrap !important;
          flex-shrink: 0 !important;
        }

        .fc-button-group .fc-button {
          border-radius: 6px !important;
          margin: 0 !important;
        }

        /* Tablet specific fixes for overlapping */
        @media (min-width: 768px) and (max-width: 1024px) {
          .fc-header-toolbar {
            padding: 8px !important;
            min-height: 80px !important;
            justify-content: center !important;
            align-items: stretch !important;
          }
         
          .fc-toolbar-chunk {
            margin: 4px 0 !important;
            justify-content: center !important;
            gap: 6px !important;
          }
         
          .fc-toolbar-chunk:first-child {
            order: 2;
            flex: 1 1 100% !important;
            justify-content: center !important;
          }
         
          .fc-toolbar-chunk:nth-child(2) {
            order: 1;
            flex: 1 1 100% !important;
            justify-content: center !important;
          }
         
          .fc-toolbar-chunk:last-child {
            order: 3;
            flex: 1 1 100% !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
         
          .fc-button {
            padding: 6px 12px !important;
            font-size: 13px !important;
            min-height: 34px !important;
            flex-shrink: 0 !important;
          }
         
          .fc-toolbar-title {
            font-size: 18px !important;
            margin: 4px 0 !important;
            text-align: center !important;
          }
         
          .fc-addClass-button {
            min-width: 90px !important;
          }
         
          .fc-createGroup-button {
            min-width: 110px !important;
          }
        }

        /* Mobile responsive styles */
        @media (max-width: 767px) {
          .fc-header-toolbar {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 8px !important;
            min-height: 120px !important;
          }
         
          .fc-toolbar-chunk {
            justify-content: center !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
            width: 100% !important;
          }
         
          .fc-button {
            padding: 6px 10px !important;
            font-size: 12px !important;
            min-height: 32px !important;
            min-width: 70px !important;
            flex: 0 0 auto !important;
          }
         
          .fc-toolbar-title {
            font-size: 16px !important;
            text-align: center !important;
            margin: 4px 0 !important;
            max-width: 100% !important;
          }
         
          .fc-toolbar-chunk:first-child {
            order: 2;
          }
         
          .fc-toolbar-chunk:nth-child(2) {
            order: 1;
          }
         
          .fc-toolbar-chunk:last-child {
            order: 3;
          }
         
          .fc-addClass-button {
            min-width: 80px !important;
          }
         
          .fc-createGroup-button {
            min-width: 95px !important;
          }
         
          /* Calendar grid responsiveness */
          .fc-daygrid-day {
            min-height: 60px !important;
          }
         
          .fc-daygrid-day-number {
            padding: 4px !important;
            font-size: 14px !important;
          }
         
          .fc-event-title {
            font-size: 11px !important;
            padding: 2px 4px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
         
          .fc-daygrid-event {
            margin: 1px 2px !important;
            border-radius: 4px !important;
          }
         
          /* Day header styling for mobile */
          .fc-col-header-cell {
            padding: 4px 2px !important;
          }
         
          .fc-col-header-cell-cushion {
            font-size: 12px !important;
            font-weight: 600 !important;
            padding: 4px !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .fc-button {
            padding: 5px 8px !important;
            font-size: 11px !important;
            min-height: 28px !important;
            min-width: 65px !important;
          }
         
          .fc-toolbar-title {
            font-size: 14px !important;
          }
         
          .fc-addClass-button {
            min-width: 70px !important;
          }
         
          .fc-createGroup-button {
            min-width: 80px !important;
          }
         
          .fc-daygrid-day {
            min-height: 50px !important;
          }
         
          .fc-event-title {
            font-size: 10px !important;
          }
         
          .fc-col-header-cell-cushion {
            font-size: 11px !important;
          }
        }

        /* Large screens - ensure proper spacing */
        @media (min-width: 1025px) {
          .fc-header-toolbar {
            padding: 16px 12px !important;
          }
         
          .fc-toolbar-chunk {
            gap: 8px !important;
          }
         
          .fc-button {
            padding: 10px 18px !important;
            font-size: 14px !important;
            min-height: 38px !important;
          }
         
          .fc-toolbar-title {
            font-size: 20px !important;
            margin: 0 16px !important;
          }
        }

        /* iPad Mini specific (768px x 1024px) */
        @media (width: 768px) and (height: 1024px) {
          .fc-header-toolbar {
            min-height: 90px !important;
          }
         
          .fc-toolbar-chunk:last-child .fc-button {
            margin: 2px !important;
          }
        }

        /* iPad Pro specific (1024px x 1366px) */
        @media (width: 1024px) and (height: 1366px) {
          .fc-header-toolbar {
            min-height: 70px !important;
            gap: 12px !important;
          }
         
          .fc-toolbar-chunk {
            gap: 8px !important;
          }
        }

        /* Nest Hub specific (1024px x 600px) */
        @media (width: 1024px) and (height: 600px) {
          .fc-header-toolbar {
            flex-direction: row !important;
            min-height: 60px !important;
            justify-content: space-between !important;
          }
         
          .fc-toolbar-chunk:first-child {
            order: 1;
            flex: 0 0 auto !important;
          }
         
          .fc-toolbar-chunk:nth-child(2) {
            order: 2;
            flex: 1 1 auto !important;
            justify-content: center !important;
          }
         
          .fc-toolbar-chunk:last-child {
            order: 3;
            flex: 0 0 auto !important;
            gap: 6px !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-md p-2 sm:p-4 md:p-6 mb-8 border border-gray-100">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventClick={handleEventClick}
          customButtons={{
            addClass: {
              text: "Add Class",
              click: handleAddClass,
            },
            createGroup: {
              text: "Create Group",
              click: () => {
                setShowCreateGroupModal(true);
                toast.info("Opening create group form");
              },
            },
          }}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev today next addClass createGroup",
          }}
          buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
          dayHeaderClassNames="bg-gray-100 text-gray-700 font-medium"
          dayCellClassNames="hover:bg-gray-50 transition-colors"
          eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
        />
      </div>

      {/* Event Details Modal - Enhanced Responsive */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold truncate">Class Details</h2>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  toast.info("Class details closed");
                }}
                className="text-white hover:text-gray-200 flex-shrink-0 ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Class:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Student{selectedEvent.isGroupClass ? 's' : ''}:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.student}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Tutor:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.tutor}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Group:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.group}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Status:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.status}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Type:</span>
                  <span className="text-gray-900 break-words capitalize">{selectedEvent.type}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Date:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.date}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Time:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.time}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px] sm:mt-1">Zoom Link:</span>
                  <a
                    href={selectedEvent.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline break-all hover:text-indigo-800 transition-colors"
                    onClick={() => toast.success("Opening Zoom meeting...")}
                  >
                    Join Meeting
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Groups Section - Enhanced Responsive */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Groups</h2>
        </div>
       
        {loadingGroups ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
            <p className="text-gray-500">Create your first group to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {groups.map((group, index) => (
              <div
                key={`${group.id}-${index}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{group.name}</h3>
                      <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
                        {group.type}
                      </span>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 ml-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingGroup(group);
                          setEditName(group.name);
                          setEditType(group.type);
                          toast.info("Opening edit form");
                        }}
                        className="text-gray-500 hover:text-indigo-600 transition-colors p-1"
                        title="Edit group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1"
                        title="Delete group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Members ({group.members.length})
                  </h4>
                  {group.members.length > 0 ? (
                    <ul className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                      {group.members.map((m) => (
                        <li key={`${group.id}-${m.id}`} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800 block truncate">{m.name}</span>
                            <span className="text-xs text-gray-500 capitalize">{m.role}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(group.id, m.id)}
                            className="text-red-500 hover:text-red-700 transition-colors text-xs flex items-center ml-2 flex-shrink-0 p-1"
                            title="Remove member"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM9 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline ml-1">Remove</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm italic">No members yet</p>
                  )}
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setSelectedGroupType(group.type);
                      setSelectedGroupName(group.name);
                      setShowAddMemberModal(true);
                      toast.info("Opening add members form");
                    }}
                    className="flex-1 bg-white text-indigo-600 border border-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    <span className="hidden xs:inline">Add Members</span>
                    <span className="xs:hidden">Add</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setSelectedGroupType(group.type);
                      setSelectedGroupName(group.name);
                      setShowScheduleModal(true);
                      toast.info("Opening schedule class form");
                    }}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden xs:inline">Schedule Class</span>
                    <span className="xs:hidden">Schedule</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal - Enhanced Responsive */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Create Group</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-white hover:text-gray-200 transition-colors focus:outline-none flex-shrink-0 ml-2"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                >
                  <option value="">Select Type</option>
                  <option value="tutor">Tutor Group</option>
                  <option value="student">Student Group</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingGroupCreate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
                >
                  {loadingGroupCreate ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Group Modal - Enhanced Responsive */}
      {editingGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-yellow-500 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Update Group</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-white hover:text-gray-200 transition-colors focus:outline-none flex-shrink-0 ml-2"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateGroup} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                >
                  <option value="">Select Type</option>
                  <option value="tutor">Tutor Group</option>
                  <option value="student">Student Group</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base order-1 sm:order-2"
                >
                  Update Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMemberModal && (
        <AddMembersModal
          groupId={selectedGroupId}
          groupType={selectedGroupType}
          onClose={() => {
            setShowAddMemberModal(false);
            toast.info("Add members form closed");
          }}
          onMembersAdded={(addedCount) => {
            fetchGroups();
            if (addedCount) {
              toast.success(`${addedCount} member(s) added successfully!`);
            }
          }}
        />
      )}

      {/* Schedule Class Modal */}
      {showScheduleModal && (
        <ScheduleGroupClass
          groupId={selectedGroupId}
          groupType={selectedGroupType}
          groupName={selectedGroupName}
          onClose={() => {
            setShowScheduleModal(false);
            toast.info("Schedule class form closed");
          }}
          onClassScheduled={(className) => {
            fetchClassesFromAPI();
            if (className) {
              toast.success(`Class "${className}" scheduled successfully!`);
            } else {
              toast.success("Class scheduled successfully!");
            }
          }}
        />
      )}
    </div>
  );
};

export default MyClasses;
