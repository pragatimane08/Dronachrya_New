// src/pages/student/classes/MyClasses.jsx

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { classRepository } from "../../../../api/repository/class.repository";
import { groupService } from "../../../../api/repository/groupService.repository";
import AddClassForm from "../MyClasses_Student/AddClassForm_student";

const MyClasses = () => {
  const [events, setEvents] = useState([]);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch both individual and group classes
  const fetchClassesFromAPI = async () => {
    try {
      // Fetch both individual classes and group classes
      const [individualClassesResponse, groupClassesResponse] = await Promise.all([
        classRepository.getMyClasses(),
        groupService.getScheduledClasses() // This fetches group classes for students
      ]);

      const individualClasses = individualClassesResponse?.data?.classes || [];
      const groupClasses = groupClassesResponse?.data?.classes || groupClassesResponse?.classes || [];

      console.log("Raw individual classes:", individualClasses);
      console.log("Raw group classes:", groupClasses);

      // Format individual classes
      const formattedIndividualClasses = individualClasses.map((cls, index) => {
        const isDemo = cls.type === "demo";
        
        // Get tutor name from multiple possible sources
        let tutorName = "Tutor not assigned";
        if (cls.tutor_name) {
          tutorName = cls.tutor_name;
        } else if (cls.Tutor && cls.Tutor.name) {
          tutorName = cls.Tutor.name;
        }

        // Get student name - for students, it should show their own name or "You"
        let studentName = "You";
        if (cls.student_name) {
          studentName = cls.student_name;
        } else if (cls.Student && cls.Student.name) {
          studentName = cls.Student.name;
        }

        // Handle zoom/meeting links
        let meetingLink = "#";
        if (cls.meeting_link && cls.meeting_link !== "https://zoom.us/j/your_meeting_id") {
          meetingLink = cls.meeting_link;
        } else if (cls.zoom_link && cls.zoom_link !== "https://zoom.us/j/your_meeting_id") {
          meetingLink = cls.zoom_link;
        }
        
        return {
          id: cls.id || `class-${index}-${cls.date_time}`,
          title: isDemo ? "Demo Class" : "Regular Class",
          date: cls.date_time?.split("T")[0],
          extendedProps: {
            classId: cls.id,
            name: cls.title || cls.name || "Class",
            tutor: tutorName,
            student: studentName,
            subject: cls.subject || cls.title || "N/A",
            status: cls.status || "Scheduled",
            type: isDemo ? "demo" : "regular",
            classType: "individual", // Add identifier for individual class
            zoomLink: meetingLink,
            mode: cls.mode || "online",
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

      // Format group classes
      const formattedGroupClasses = groupClasses.map((cls, index) => {
        console.log("Processing group class:", cls);
        
        // Get tutor name from multiple possible sources
        let tutorName = "Tutor not assigned";
        if (cls.tutor_name) {
          tutorName = cls.tutor_name;
        } else if (cls.Tutor && cls.Tutor.name) {
          tutorName = cls.Tutor.name;
        } else if (cls.createdBy && cls.createdBy.name) {
          tutorName = cls.createdBy.name;
        }

        // For group classes, show group name instead of individual student
        let groupName = "Group Class";
        if (cls.group_name) {
          groupName = cls.group_name;
        } else if (cls.Group && cls.Group.name) {
          groupName = cls.Group.name;
        }

        // Handle zoom/meeting links
        let meetingLink = "#";
        if (cls.meeting_link && cls.meeting_link !== "https://zoom.us/j/your_meeting_id") {
          meetingLink = cls.meeting_link;
        } else if (cls.zoom_link && cls.zoom_link !== "https://zoom.us/j/your_meeting_id") {
          meetingLink = cls.zoom_link;
        }

        // Handle date parsing for group classes
        let classDate = cls.date_time?.split("T")[0];
        if (!classDate && cls.scheduled_date) {
          classDate = new Date(cls.scheduled_date).toISOString().split("T")[0];
        }

        // Handle time formatting for group classes
        let classTime = "N/A";
        if (cls.date_time) {
          classTime = new Date(cls.date_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (cls.scheduled_time) {
          classTime = cls.scheduled_time;
        }

        let displayDate = "N/A";
        if (cls.date_time) {
          displayDate = new Date(cls.date_time).toLocaleDateString();
        } else if (cls.scheduled_date) {
          displayDate = new Date(cls.scheduled_date).toLocaleDateString();
        }
        
        return {
          id: cls.id || `group-class-${index}-${cls.date_time || cls.scheduled_date}`,
          title: groupName, // Use group name as title
          date: classDate,
          className: "group-class", // Add CSS class for styling
          extendedProps: {
            classId: cls.id,
            name: cls.title || cls.name || groupName,
            tutor: tutorName,
            student: groupName, // Show group name instead of student name
            subject: cls.subject || cls.title || "N/A",
            status: cls.status || "Scheduled",
            type: "group",
            classType: "group", // Add identifier for group class
            groupId: cls.group_id || cls.Group?.id,
            zoomLink: meetingLink,
            mode: cls.mode || "online",
            time: classTime,
            date: displayDate,
          },
        };
      });

      // Combine both individual and group classes
      const allEvents = [...formattedIndividualClasses, ...formattedGroupClasses];

      console.log("Formatted individual classes:", formattedIndividualClasses); 
      console.log("Formatted group classes:", formattedGroupClasses); 
      console.log("All events:", allEvents); 
      
      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load your classes. Please try refreshing the page.");
    }
  };

  useEffect(() => {
    fetchClassesFromAPI();
  }, []);

  // Handle event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
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

      {/* Enhanced Responsive CSS for FullCalendar */}
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
        
        .fc-addClass-button {
          background-color: #0d9488 !important;
          border-color: #0d9488 !important;
          color: white !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: background-color 0.2s ease !important;
        }
        
        .fc-addClass-button:hover {
          background-color: #0f766e !important;
          border-color: #0f766e !important;
        }

        /* Group class specific styling */
        .fc-event.group-class {
          background-color: #7c3aed !important;
          border-color: #7c3aed !important;
        }

        .fc-event.group-class:hover {
          background-color: #6d28d9 !important;
          border-color: #6d28d9 !important;
        }

        /* Mobile and tablet responsive styles */
        @media (max-width: 768px) {
          .fc-header-toolbar {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 8px !important;
          }
          
          .fc-toolbar-chunk {
            display: flex !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          
          .fc-button {
            padding: 6px 10px !important;
            font-size: 12px !important;
            min-height: 32px !important;
            min-width: auto !important;
            flex: 0 0 auto !important;
          }
          
          .fc-button-group {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 4px !important;
            justify-content: center !important;
          }
          
          .fc-button-group .fc-button {
            border-radius: 6px !important;
            margin: 0 !important;
          }
          
          .fc-title-container {
            text-align: center !important;
            margin: 8px 0 !important;
          }
          
          .fc-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #1f2937 !important;
          }
          
          /* Custom button responsiveness */
          .fc-addClass-button {
            min-width: 120px !important;
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
          }
          
          .fc-title {
            font-size: 14px !important;
          }
          
          .fc-addClass-button {
            min-width: 110px !important;
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

        /* Tablet landscape optimizations */
        @media (min-width: 769px) and (max-width: 1024px) {
          .fc-button {
            padding: 7px 14px !important;
            font-size: 13px !important;
            min-height: 34px !important;
          }
          
          .fc-title {
            font-size: 18px !important;
          }
        }`}</style>

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
              click: () => {
                setShowAddClassForm(true);
                toast.info("Opening demo class request form");
              },
            },
          }}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev today next addClass",
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
              <h2 className="text-lg sm:text-xl font-semibold truncate">
                {selectedEvent.classType === "group" ? "Group Class Details" : "Class Details"}
              </h2>
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
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">
                    {selectedEvent.classType === "group" ? "Group:" : "Student:"}
                  </span>
                  <span className="text-gray-900 break-words">{selectedEvent.student}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Tutor:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.tutor}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Subject:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.subject}</span>
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
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Mode:</span>
                  <span className="text-gray-900 break-words capitalize">{selectedEvent.mode}</span>
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
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px] sm:mt-1">Meeting Link:</span>
                  {selectedEvent.zoomLink && selectedEvent.zoomLink !== "#" ? (
                    <a
                      href={selectedEvent.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline break-all hover:text-indigo-800 transition-colors"
                      onClick={() => toast.success("Opening meeting...")}
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">No meeting link available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Form Modal - Enhanced Responsive */}
      {showAddClassForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-center min-h-full">
              <AddClassForm
                onSuccess={() => {
                  setShowAddClassForm(false);
                  fetchClassesFromAPI(); // refresh after adding new class
                  toast.success("Demo class request submitted successfully!");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;