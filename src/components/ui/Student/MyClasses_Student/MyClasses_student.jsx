import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { classRepository } from "../../../../api/repository/class.repository";
import { groupService } from "../../../../api/repository/groupService.repository";
import AddClassForm from "../MyClasses_Student/AddClassForm_student";
import AllClassesData from "./Getdataofstudents/AllClassData";
import BookdemoData from "./Getdataofstudents/BookdemoData";
import GroupClassData from "./Getdataofstudents/GroupClassData";
import SingleClassData from "./Getdataofstudents/SingleClassData";

const MyClasses = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // Inline message state

  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // New state for class type toggle - default to "all"
  const [classType, setClassType] = useState("all"); // "all", "group", "single", "demo"

  // Raw classes data for the components
  const [rawClassesData, setRawClassesData] = useState([]);

  // Mock user data - replace with actual user context
  const [currentUser] = useState({
    id: 1, // This should come from your auth context
    role: "student" // or "tutor" or "admin"
  });

  // FIXED: Timezone-aware date formatting
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      // Use Indian timezone for display
      return date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // FIXED: Timezone-aware time formatting
  const formatTimeForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      // Use Indian timezone for display
      return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "N/A";
    }
  };

  // FIXED: Get date only for calendar (timezone aware)
  const getDateOnlyForCalendar = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      // Convert to YYYY-MM-DD in local timezone for calendar display
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error parsing date for calendar:", error);
      return null;
    }
  };

  // Enhanced show inline message with better positioning and auto-hide
  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    // Auto hide after appropriate time based on message type
    const hideTime = type === "loading" ? 0 : 4000; // Don't auto-hide loading messages
    if (hideTime > 0) {
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, hideTime);
    }
  };

  // Clear message manually
  const clearMessage = () => {
    setMessage({ text: "", type: "" });
  };

  // Fetch both individual and group classes
  const fetchClassesFromAPI = async () => {
    try {
      setLoadingClasses(true);
      showMessage("Loading your classes...", "loading");

      // Fetch both individual classes and group classes
      const [individualClassesResponse, groupClassesResponse] = await Promise.all([
        classRepository.getMyClasses(),
        groupService.getScheduledClasses() // This fetches group classes for students
      ]);

      const individualClasses = individualClassesResponse?.data?.classes || [];
      const groupClasses = groupClassesResponse?.data?.classes || groupClassesResponse?.classes || [];

      // Combine both individual and group classes for raw data
      const allRawClasses = [...individualClasses, ...groupClasses];
      setRawClassesData(allRawClasses);

      // Format individual classes for calendar
      const formattedIndividualClasses = individualClasses.map((cls, index) => {
        const isDemo = cls.type === "demo" || cls.is_demo || cls.isDemo;

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

        // FIXED: Improved mode detection with better fallback logic
        const classMode = cls.mode && cls.mode !== "undefined" && cls.mode !== "null" 
          ? cls.mode 
          : (cls.meeting_link ? "online" : "offline");

        // FIXED: Better meeting link handling based on mode
        let meetingLink = null;
        let meetingLinkDisplay = "No meeting link available";

        if (classMode === "offline") {
          meetingLinkDisplay = "Offline Class - No meeting link required";
        } else {
          // For online classes, check if meeting link exists and is valid
          const potentialLinks = [cls.meeting_link, cls.zoom_link, cls.link, cls.meetingLink].filter(Boolean);
          const validLink = potentialLinks.find(l =>
            l &&
            l !== "https://zoom.us/j/your_meeting_id" &&
            l !== "#" &&
            typeof l === "string" &&
            l.trim() !== ""
          );
          if (validLink) {
            meetingLink = validLink;
            meetingLinkDisplay = validLink;
          } else {
            meetingLinkDisplay = "Meeting link will be provided soon";
          }
        }

        // FIXED: Use timezone-aware date functions
        const dateOnly = getDateOnlyForCalendar(cls.date_time);
        const displayDate = formatDateForDisplay(cls.date_time);
        const displayTime = formatTimeForDisplay(cls.date_time);

        return {
          id: cls.id ? String(cls.id) : `class-${index}-${dateOnly || index}`,
          title: isDemo ? "Demo Class" : `${classMode === "offline" ? "📍 " : "💻 "}Regular Class`,
          date: dateOnly,
          backgroundColor: isDemo ? "#f59e0b" : (classMode === "offline" ? "#6b7280" : "#3b82f6"),
          borderColor: isDemo ? "#d97706" : (classMode === "offline" ? "#4b5563" : "#2563eb"),
          textColor: "#ffffff",
          extendedProps: {
            classId: cls.id,
            name: cls.title || cls.name || "Class",
            tutor: tutorName,
            student: studentName,
            subject: cls.subject || cls.title || "N/A",
            status: cls.status || "Scheduled",
            type: isDemo ? "demo" : "regular",
            classType: "individual",
            zoomLink: meetingLink,
            meetingLinkDisplay: meetingLinkDisplay,
            mode: classMode,
            isGroupClass: false,
            isDemo: isDemo,
            time: displayTime,
            date: displayDate,
            rawDateTime: cls.date_time, // Keep original for reference
            location: cls.location || "Location will be provided soon", // Added location field
          },
        };
      });

      // Format group classes for calendar
      const formattedGroupClasses = groupClasses.map((cls, index) => {
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

        // FIXED: Improved mode detection for group classes with better fallback logic
        const classMode = cls.mode && cls.mode !== "undefined" && cls.mode !== "null"
          ? cls.mode 
          : (cls.meeting_link ? "online" : "offline");

        // FIXED: Better meeting link handling for group classes based on mode
        let meetingLink = null;
        let meetingLinkDisplay = "No meeting link available";

        if (classMode === "offline") {
          meetingLinkDisplay = "Offline Class - No meeting link required";
        } else {
          const potentialLinks = [cls.meeting_link, cls.zoom_link, cls.link, cls.meetingLink].filter(Boolean);
          const validLink = potentialLinks.find(l =>
            l &&
            l !== "https://zoom.us/j/your_meeting_id" &&
            l !== "#" &&
            typeof l === "string" &&
            l.trim() !== ""
          );
          if (validLink) {
            meetingLink = validLink;
            meetingLinkDisplay = validLink;
          } else {
            meetingLinkDisplay = "Meeting link will be provided soon";
          }
        }

        // FIXED: Use timezone-aware date functions for group classes
        const classDate = getDateOnlyForCalendar(cls.date_time);
        const displayDate = formatDateForDisplay(cls.date_time);
        const displayTime = formatTimeForDisplay(cls.date_time);

        return {
          id: cls.id ? String(cls.id) : `group-class-${index}-${classDate || index}`,
          title: `${classMode === "offline" ? "📍 " : "💻 "}${groupName}`,
          date: classDate,
          backgroundColor: classMode === "offline" ? "#6b7280" : "#10b981",
          borderColor: classMode === "offline" ? "#4b5563" : "#059669",
          textColor: "#ffffff",
          className: "group-class",
          extendedProps: {
            classId: cls.id,
            name: cls.title || cls.name || groupName,
            tutor: tutorName,
            student: groupName,
            subject: cls.subject || cls.title || "N/A",
            status: cls.status || "Scheduled",
            type: "group",
            classType: "group",
            groupId: cls.group_id || cls.Group?.id,
            zoomLink: meetingLink,
            meetingLinkDisplay: meetingLinkDisplay,
            mode: classMode,
            isGroupClass: true,
            isDemo: false,
            time: displayTime,
            date: displayDate,
            rawDateTime: cls.date_time, // Keep original for reference
            location: cls.location || "Location will be provided soon", // Added location field
          },
        };
      });

      // Combine both individual and group classes
      const allEvents = [...formattedIndividualClasses, ...formattedGroupClasses];

      setEvents(allEvents);
      setFilteredEvents(allEvents);
      
      if (allEvents.length === 0) {
        showMessage("No classes found. You can book a demo class to get started.", "info");
      } else {
        showMessage(`Successfully loaded ${allEvents.length} classes`, "success");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      showMessage("Failed to load your classes. Please try refreshing the page.", "error");
    } finally {
      setLoadingClasses(false);
    }
  };

  // Filter events based on class type
  useEffect(() => {
    if (classType === "all") {
      setFilteredEvents(events);
    } else if (classType === "group") {
      setFilteredEvents(events.filter(event => event.extendedProps?.isGroupClass));
    } else if (classType === "single") {
      setFilteredEvents(events.filter(event => !event.extendedProps?.isGroupClass && !event.extendedProps?.isDemo));
    } else if (classType === "demo") {
      setFilteredEvents(events.filter(event => event.extendedProps?.isDemo));
    }
  }, [classType, events]);

  useEffect(() => {
    fetchClassesFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle class updates (cancel, reschedule, etc.)
  const handleUpdateClass = async (classId, updates) => {
    const loadingMessage = "Updating class...";
    showMessage(loadingMessage, "loading");
    
    try {
      // Call your API to update the class
      const response = await fetch(`/api/classes/${classId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update class");
      }

      const updatedClass = await response.json();

      // Update the class in local state
      setRawClassesData(prevClasses =>
        prevClasses.map(cls =>
          cls.id === classId ? { ...cls, ...(updatedClass.data || updatedClass) } : cls
        )
      );

      // Also update events
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.extendedProps?.classId === classId
            ? {
                ...event,
                backgroundColor: updates.status === "cancelled" ? "#ef4444" : event.backgroundColor,
                extendedProps: {
                  ...event.extendedProps,
                  status: updates.status || event.extendedProps.status,
                  mode: updates.mode || event.extendedProps.mode, // FIXED: Update mode in extendedProps
                },
              }
            : event
        )
      );

      if (updates.status === "cancelled") {
        showMessage("Class cancelled successfully!", "success");
      } else if (updates.status === "scheduled") {
        showMessage("Class rescheduled successfully!", "success");
      } else {
        showMessage("Class updated successfully!", "success");
      }

      return updatedClass;
    } catch (error) {
      console.error("Error updating class:", error);
      showMessage("Failed to update class. Please try again.", "error");
      throw error;
    }
  };

  // Handle event click
  const handleEventClick = (info) => {
    // info.event.extendedProps contains our extendedProps
    setSelectedEvent(info.event.extendedProps || null);
  };

  // Handle Book Demo
  const handleBookDemo = () => {
    setClassType("demo");
    setShowAddClassForm(true);
    showMessage("Book a demo class to get started with your learning journey", "info");
  };

  // Enhanced filter function for classes data
  const getFilteredClassesData = () => {
    if (!rawClassesData || rawClassesData.length === 0) return [];

    switch (classType) {
      case "all":
        return rawClassesData;
      case "group":
        return rawClassesData.filter(cls =>
          Boolean(cls.group_id || cls.Group?.id || cls.is_group_class || cls.isGroupClass)
        );
      case "single":
        return rawClassesData.filter(cls =>
          !(cls.group_id || cls.Group?.id || cls.is_group_class || cls.isGroupClass) &&
          !(cls.type === "demo" || cls.is_demo || cls.isDemo)
        );
      case "demo":
        return rawClassesData.filter(cls =>
          cls.type === "demo" || cls.is_demo || cls.isDemo
        );
      default:
        return rawClassesData;
    }
  };

  const filteredClassesData = getFilteredClassesData();

  // Handle class type change with inline message
  const handleClassTypeChange = (type) => {
    setClassType(type);
    const typeNames = {
      all: "All Classes",
      demo: "Book Demo Classes",
      group: "Group Classes",
      single: "Single Classes",
    };
    showMessage(`Now showing: ${typeNames[type]}`, "info");
  };

  // Get page title based on class type
  const getPageTitle = () => {
    switch (classType) {
      case "all": return "My Classes Calendar";
      case "demo": return "Book Demo Classes";
      case "group": return "Group Classes";
      case "single": return "Single Classes";
      default: return "My Classes Calendar";
    }
  };

  // Get data section title based on class type
  const getDataSectionTitle = () => {
    switch (classType) {
      case "all": return "All Classes";
      case "demo": return "Book Demo Classes";
      case "group": return "Group Classes";
      case "single": return "Single Classes";
      default: return "All Classes";
    }
  };

  // Get data section description based on class type
  const getDataSectionDescription = () => {
    switch (classType) {
      case "all": return `Viewing all ${filteredClassesData.length} scheduled classes`;
      case "demo": return `Viewing ${filteredClassesData.length} demo classes`;
      case "group": return `Viewing ${filteredClassesData.length} group classes`;
      case "single": return `Viewing ${filteredClassesData.length} single student classes`;
      default: return `Viewing all ${filteredClassesData.length} scheduled classes`;
    }
  };

  // Check if we should show calendar
  const shouldShowCalendar = () => {
    return classType === "all";
  };

  // Get message styles based on type
  const getMessageStyles = () => {
    switch (message.type) {
      case "success":
        return "bg-green-50 border border-green-200 text-green-800 shadow-lg";
      case "error":
        return "bg-red-50 border border-red-200 text-red-800 shadow-lg";
      case "loading":
        return "bg-blue-50 border border-blue-200 text-blue-800 shadow-lg";
      case "info":
        return "bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-lg";
      default:
        return "bg-blue-50 border border-blue-200 text-blue-800 shadow-lg";
    }
  };

  // Get message icon based on type
  const getMessageIcon = () => {
    switch (message.type) {
      case "success":
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case "loading":
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current flex-shrink-0"></div>
        );
      case "info":
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen relative">
      {/* Enhanced Inline Message Display - Fixed below the top with proper spacing */}
      {message.text && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 rounded-xl px-6 py-4 transition-all duration-300 ${getMessageStyles()} max-w-md w-[90%] mx-auto shadow-xl border-2`}>
          <div className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3">
              {getMessageIcon()}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
            <button
              onClick={clearMessage}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              aria-label="Close message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-8 border border-gray-100 mt-4">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{getPageTitle()}</h2>
              <p className="text-sm text-gray-600">Manage and view all your scheduled classes</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter Classes:</span>
              <div className="flex flex-wrap bg-gray-100 rounded-xl p-1.5 gap-1 w-full sm:w-auto justify-center">
                <button
                  onClick={() => handleClassTypeChange("all")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[90px] justify-center ${
                    classType === "all"
                      ? "bg-white text-indigo-700 shadow-md border border-indigo-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${classType === "all" ? "bg-indigo-500" : "bg-gray-400"}`}></div>
                  All Classes
                </button>
                <button
                  onClick={() => handleClassTypeChange("demo")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[90px] justify-center ${
                    classType === "demo"
                      ? "bg-white text-orange-700 shadow-md border border-orange-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${classType === "demo" ? "bg-orange-500" : "bg-gray-400"}`}></div>
                  Book Demo
                </button>
                <button
                  onClick={() => handleClassTypeChange("group")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[90px] justify-center ${
                    classType === "group"
                      ? "bg-white text-green-700 shadow-md border border-green-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${classType === "group" ? "bg-green-500" : "bg-gray-400"}`}></div>
                  Group Classes
                </button>
                <button
                  onClick={() => handleClassTypeChange("single")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[90px] justify-center ${
                    classType === "single"
                      ? "bg-white text-blue-700 shadow-md border border-blue-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${classType === "single" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  Single Classes
                </button>
              </div>
            </div>
          </div>
        </div>

        {shouldShowCalendar() && (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            height="auto"
            eventClick={handleEventClick}
            customButtons={{
              bookDemo: {
                text: "Add Class",
                click: handleBookDemo,
              },
            }}
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev today next bookDemo",
            }}
            buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
            dayHeaderClassNames="bg-gray-100 text-gray-700 font-medium"
            dayCellClassNames="hover:bg-gray-50 transition-colors"
            eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
            timeZone="local" // FIXED: Use local timezone
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-8 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {getDataSectionTitle()}
          </h2>
          <p className="text-sm text-gray-600">
            {getDataSectionDescription()}
          </p>
        </div>

        {loadingClasses ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredClassesData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-500">
              {classType === "all" && "You don't have any scheduled classes yet."}
              {classType === "demo" && "You don't have any demo classes scheduled."}
              {classType === "group" && "You don't have any group classes scheduled."}
              {classType === "single" && "You don't have any single student classes scheduled."}
            </p>
          </div>
        ) : (
          <>
            {classType === "all" && (
              <AllClassesData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                userRole={currentUser}
              />
            )}
            {classType === "demo" && (
              <BookdemoData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                userRole={currentUser}
              />
            )}
            {classType === "group" && (
              <GroupClassData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                userRole={currentUser}
              />
            )}
            {classType === "single" && (
              <SingleClassData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                userRole={currentUser}
              />
            )}
          </>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
            <div className={`p-4 sm:p-5 text-white flex justify-between items-center ${
              selectedEvent.isDemo ? "bg-orange-600" :
              selectedEvent.isGroupClass ? "bg-green-600" :
              selectedEvent.mode === "offline" ? "bg-gray-600" : "bg-blue-600"
            }`}>
              <h2 className="text-lg sm:text-xl font-semibold truncate">
                {selectedEvent.isGroupClass ? "Group Class Details" : "Class Details"}
              </h2>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  showMessage("Class details closed", "info");
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
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Class Type:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedEvent.isDemo
                      ? "bg-orange-100 text-orange-800"
                      : selectedEvent.isGroupClass
                      ? "bg-green-100 text-green-800"
                      : selectedEvent.mode === "offline"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedEvent.isDemo ? "Demo Class" : selectedEvent.isGroupClass ? "Group Class" : "Single Class"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Class:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">
                    {selectedEvent.isGroupClass ? "Group:" : "Student:"}
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedEvent.mode === "offline"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {selectedEvent.mode === "offline" ? "📍 Offline" : "💻 Online"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Date:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.date}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px]">Time:</span>
                  <span className="text-gray-900 break-words">{selectedEvent.time}</span>
                </div>

                {/* FIXED: Only show meeting link section for online classes */}
                {selectedEvent.mode === "online" && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px] sm:mt-1">
                      Meeting Link:
                    </span>
                    {selectedEvent.zoomLink ? (
                      <a
                        href={selectedEvent.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline break-all hover:text-indigo-800 transition-colors"
                        onClick={() => showMessage("Opening meeting...", "info")}
                      >
                        Join Meeting
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">{selectedEvent.meetingLinkDisplay}</span>
                    )}
                  </div>
                )}

                {/* FIXED: Show location info for offline classes */}
                {selectedEvent.mode === "offline" && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px] sm:mt-1">
                      Location:
                    </span>
                    <span className="text-gray-900 break-words">
                      {selectedEvent.location || "Location will be provided soon"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddClassForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-center min-h-full">
              <AddClassForm
                onClose={() => {
                  setShowAddClassForm(false);
                  navigate("/student_classes");
                }}
                onSuccess={() => {
                  setShowAddClassForm(false);
                  fetchClassesFromAPI();
                  showMessage("Demo class request submitted successfully!", "success");
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