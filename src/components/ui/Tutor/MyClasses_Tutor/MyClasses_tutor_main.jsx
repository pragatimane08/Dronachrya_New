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
import AllClassesData from "./Getdataofstudents/AllClassData";
import BookdemoData from "./Getdataofstudents/BookdemoData";
import GroupClassData from "./Getdataofstudents/GroupClassData";
import SingleClassData from "./Getdataofstudents/SingleClassData";

// Import your auth utilities
import { getToken, getUser, isAuthenticated, getUserRole } from "../../../../api/apiclient";

const MyClasses = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

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
 
  // New state for class type toggle - default to "all"
  const [classType, setClassType] = useState("all"); // "all", "group", "single", "demo"

  // Raw classes data for the components
  const [rawClassesData, setRawClassesData] = useState([]);

  // Get current user using your auth utilities
  const getCurrentUser = () => {
    try {
      const userData = getUser();
      const token = getToken();
      const role = getUserRole();
     
      if (userData && token) {
        return {
          ...userData,
          token: token,
          role: role
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Inline message state
  const [inlineMessage, setInlineMessage] = useState({ text: "", type: "" });

  // Show inline message
  const showInlineMessage = (text, type = "info") => {
    setInlineMessage({ text, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setInlineMessage({ text: "", type: "" });
    }, 3000);
  };

  // Get message style based on type
  const getMessageStyle = () => {
    const baseStyle = "p-3 rounded-lg mb-4 transition-all duration-300";
    switch (inlineMessage.type) {
      case "success":
        return `${baseStyle} bg-green-100 border border-green-300 text-green-800`;
      case "error":
        return `${baseStyle} bg-red-100 border border-red-300 text-red-800`;
      case "warning":
        return `${baseStyle} bg-yellow-100 border border-yellow-300 text-yellow-800`;
      case "info":
      default:
        return `${baseStyle} bg-blue-100 border border-blue-300 text-blue-800`;
    }
  };

  // Check authentication status
  const checkAuthentication = () => {
    const authenticated = isAuthenticated();
    if (!authenticated) {
      showInlineMessage("Please log in to access your classes", "error");
      return false;
    }
    return true;
  };

  // Fetch scheduled classes
  const fetchClassesFromAPI = async () => {
    try {
      setLoadingClasses(true);
     
      // Check authentication
      if (!checkAuthentication()) {
        setLoadingClasses(false);
        return;
      }

      const res = await groupService.getScheduledClasses();
      const groupData = res?.classes || [];
     
      // Store raw data for components
      setRawClassesData(groupData);

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
          // Add color property for different class types
          backgroundColor: isDemo ? '#f59e0b' : (isGroupClass ? '#10b981' : '#3b82f6'), // Orange for demo, green for group, blue for single
          borderColor: isDemo ? '#d97706' : (isGroupClass ? '#059669' : '#2563eb'),
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
            status: cls.status || "scheduled",
            type: isDemo ? "demo" : "regular",
            zoomLink: cls.zoom_link || cls.meeting_link || "#",
            mode: cls.mode || "online",
            isGroupClass: isGroupClass,
            isDemo: isDemo,
            time: cls.date_time
              ? new Date(cls.date_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            date: cls.date_time
              ? new Date(cls.date_time).toLocaleDateString()
              : "N/A",
            // Add user IDs for permission checking
            tutor_id: cls.tutor_id || cls.Tutor?.id,
            student_id: cls.student_id || cls.Student?.id,
          },
        };
      });

      setEvents(formatted);
      setFilteredEvents(formatted); // Initially show all events
    } catch (error) {
      console.error("Error fetching classes:", error);
      showInlineMessage("Failed to load classes. Please try refreshing the page.", "error");
    } finally {
      setLoadingClasses(false);
    }
  };

  // Filter events based on class type
  useEffect(() => {
    if (classType === "all") {
      setFilteredEvents(events);
    } else if (classType === "group") {
      setFilteredEvents(events.filter(event => event.extendedProps.isGroupClass));
    } else if (classType === "single") {
      setFilteredEvents(events.filter(event => !event.extendedProps.isGroupClass && !event.extendedProps.isDemo));
    } else if (classType === "demo") {
      setFilteredEvents(events.filter(event => event.extendedProps.isDemo));
    }
  }, [classType, events]);

  // Fetch groups
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
     
      // Check authentication
      if (!checkAuthentication()) {
        setLoadingGroups(false);
        return;
      }
     
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
      showInlineMessage("Failed to load groups. Please try refreshing the page.", "error");
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    // Check authentication on component mount
    if (isAuthenticated()) {
      fetchClassesFromAPI();
      fetchGroups();
    } else {
      setLoadingClasses(false);
      setLoadingGroups(false);
    }
  }, []);

  // Handle class updates (cancel, reschedule, etc.) using repository
  const handleUpdateClass = async (classId, updates) => {
    try {
      showInlineMessage("Updating class...", "info");
     
      // Check authentication
      if (!checkAuthentication()) {
        throw new Error("Authentication required");
      }

      // Use repository method for updating class
      const updatedClass = await groupService.updateClass(classId, updates);
     
      // Update the class in local state
      setRawClassesData(prevClasses =>
        prevClasses.map(cls =>
          cls.id === classId ? { ...cls, ...updatedClass.data } : cls
        )
      );

      // Also update events
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.extendedProps.classId === classId
            ? {
                ...event,
                backgroundColor: updates.status === 'cancelled' ? '#ef4444' : event.backgroundColor,
                extendedProps: {
                  ...event.extendedProps,
                  status: updates.status || event.extendedProps.status
                }
              }
            : event
        )
      );

      if (updates.status === 'cancelled') {
        showInlineMessage("Class cancelled successfully!", "success");
      } else if (updates.status === 'scheduled') {
        showInlineMessage("Class rescheduled successfully!", "success");
      } else if (updates.status === 'completed') {
        showInlineMessage("Class marked as completed!", "success");
      } else {
        showInlineMessage("Class updated successfully!", "success");
      }

      return updatedClass;
    } catch (error) {
      console.error('Error updating class:', error);
      showInlineMessage("Failed to update class. Please try again.", "error");
      throw error;
    }
  };

  // Handle class deletion using repository
  const handleDeleteClass = async (classId) => {
    try {
      showInlineMessage("Deleting class...", "info");
     
      // Check authentication
      if (!checkAuthentication()) {
        throw new Error("Authentication required");
      }

      // Use repository method for permanent deletion
      const result = await groupService.deleteClassPermanently(classId);
     
      // Remove the class from local state
      setRawClassesData(prevClasses => prevClasses.filter(cls => cls.id !== classId));
      setEvents(prevEvents => prevEvents.filter(event => event.extendedProps.classId !== classId));

      showInlineMessage("Class deleted successfully!", "success");
      return result;
    } catch (error) {
      console.error('Error deleting class:', error);
      showInlineMessage(error.message || "Failed to delete class. Please try again.", "error");
      throw error;
    }
  };

  // Create Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      showInlineMessage("Group name is required", "error");
      return;
    }
    if (!groupType) {
      showInlineMessage("Please select a group type", "error");
      return;
    }
   
    try {
      setLoadingGroupCreate(true);
      showInlineMessage("Creating group...", "info");
     
      await groupService.createGroup({ name: groupName, type: groupType });
      showInlineMessage(`Group "${groupName}" created successfully!`, "success");
     
      setShowCreateGroupModal(false);
      setGroupName("");
      setGroupType("");
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create group";
      showInlineMessage(errorMessage, "error");
    } finally {
      setLoadingGroupCreate(false);
    }
  };

  // Update Group
  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showInlineMessage("Group name is required", "error");
      return;
    }
    if (!editType) {
      showInlineMessage("Please select a group type", "error");
      return;
    }

    try {
      showInlineMessage("Updating group...", "info");
     
      await groupService.updateGroup(editingGroup.id, { name: editName, type: editType });
      showInlineMessage(`Group "${editName}" updated successfully!`, "success");
     
      setEditingGroup(null);
      setEditName("");
      setEditType("");
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update group";
      showInlineMessage(errorMessage, "error");
    }
  };

  // Delete Group
  const handleDeleteGroup = async (groupId) => {
    const group = groups.find(g => g.id === groupId);
    const groupName = group?.name || "this group";
   
    if (window.confirm(`Are you sure you want to delete "${groupName}"? This action cannot be undone.`)) {
      try {
        showInlineMessage("Deleting group...", "info");
       
        await groupService.deleteGroup(groupId);
        showInlineMessage(`Group "${groupName}" deleted successfully!`, "success");
       
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        setEvents((prev) => prev.filter((ev) => ev.extendedProps.groupId !== groupId));
      } catch (error) {
        console.error("Error deleting group:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete group";
        showInlineMessage(errorMessage, "error");
      }
    }
  };

  // Remove Member
  const handleRemoveMember = async (groupId, userId) => {
    const group = groups.find(g => g.id === groupId);
    const member = group?.members.find(m => m.id === userId);
    const memberName = member?.name || "this member";
   
    if (window.confirm(`Are you sure you want to remove "${memberName}" from the group?`)) {
      try {
        showInlineMessage("Removing member...", "info");
       
        await groupService.removeMember(groupId, userId);
        showInlineMessage(`"${memberName}" removed from group successfully!`, "success");
       
        fetchGroups();
      } catch (error) {
        console.error("Error removing member:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to remove member";
        showInlineMessage(errorMessage, "error");
      }
    }
  };

  // Handle modal close
  const handleCloseCreateModal = () => {
    if (groupName.trim() || groupType) {
      if (window.confirm("Are you sure you want to close? Your changes will be lost.")) {
        setShowCreateGroupModal(false);
        setGroupName("");
        setGroupType("");
      }
    } else {
      setShowCreateGroupModal(false);
    }
  };

  const handleCloseEditModal = () => {
    if (editName !== editingGroup?.name || editType !== editingGroup?.type) {
      if (window.confirm("Are you sure you want to close? Your changes will be lost.")) {
        setEditingGroup(null);
        setEditName("");
        setEditType("");
      }
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

  // Handle Add Class - navigate to add class form
  const handleAddClass = () => {
    navigate("/add-class-form-tutor");
  };

  // Handle Create Group - now filters to show group classes
  const handleCreateGroupButton = () => {
    setClassType("group");
    setShowCreateGroupModal(true);
    showInlineMessage("Showing Group Classes and opening create group form", "info");
  };

  // Enhanced filter function for classes data
  const getFilteredClassesData = () => {
    if (!rawClassesData || rawClassesData.length === 0) return [];

    switch (classType) {
      case "all":
        return rawClassesData;
      case "group":
        return rawClassesData.filter(cls =>
          cls.group_id || cls.Group?.id || cls.is_group_class
        );
      case "single":
        return rawClassesData.filter(cls =>
          !(cls.group_id || cls.Group?.id || cls.is_group_class) &&
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
      "all": "All Classes",
      "demo": "Book Demo Classes",
      "group": "Group Classes",
      "single": "Single Classes"
    };
    showInlineMessage(`Showing ${typeNames[type]}`, "info");
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

  // Check if we should show calendar and groups
  const shouldShowCalendarAndGroups = () => {
    return classType === "all"; // Only show for "all", hide for "demo", "group", and "single"
  };

  // Check if we should show groups section
  const shouldShowGroupsSection = () => {
    return classType === "all"; // Only show groups for "all" class type
  };

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your classes.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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

      {/* Inline Message Display */}
      {inlineMessage.text && (
        <div className={getMessageStyle()}>
          <div className="flex justify-between items-center">
            <span>{inlineMessage.text}</span>
            <button
              onClick={() => setInlineMessage({ text: "", type: "" })}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Calendar and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-8 border border-gray-100">
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

        {/* Conditionally render calendar section */}
        {shouldShowCalendarAndGroups() && (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            height="auto"
            eventClick={handleEventClick}
            customButtons={{
              addClass: {
                text: "Add Class",
                click: handleAddClass,
              },
              createGroup: {
                text: "Create Group",
                click: handleCreateGroupButton,
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
        )}
      </div>

      {/* Classes Data Section - Always visible but with different content based on filter */}
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
            {/* Render appropriate component based on class type */}
            {classType === "all" && (
              <AllClassesData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                onDeleteClass={handleDeleteClass}
                userRole={currentUser}
              />
            )}
            {classType === "demo" && (
              <BookdemoData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                onDeleteClass={handleDeleteClass}
                userRole={currentUser}
              />
            )}
            {classType === "group" && (
              <GroupClassData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                onDeleteClass={handleDeleteClass}
                userRole={currentUser}
              />
            )}
            {classType === "single" && (
              <SingleClassData
                classes={filteredClassesData}
                onUpdateClass={handleUpdateClass}
                onDeleteClass={handleDeleteClass}
                userRole={currentUser}
              />
            )}
          </>
        )}
      </div>

      {/* Conditionally render groups section */}
      {shouldShowGroupsSection() && (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
            <div className={`p-4 sm:p-5 text-white flex justify-between items-center ${
              selectedEvent.isDemo ? 'bg-orange-600' :
              selectedEvent.isGroupClass ? 'bg-green-600' : 'bg-blue-600'
            }`}>
              <h2 className="text-lg sm:text-xl font-semibold truncate">Class Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
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
                      ? 'bg-orange-100 text-orange-800'
                      : selectedEvent.isGroupClass
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedEvent.isDemo ? 'Demo Class' : selectedEvent.isGroupClass ? 'Group Class' : 'Single Class'}
                  </span>
                </div>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedEvent.status === "scheduled"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedEvent.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : selectedEvent.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedEvent.status}
                  </span>
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
               
                {/* Only show Zoom link for online classes */}
                {selectedEvent.mode === "online" && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <span className="font-medium text-gray-700 min-w-0 sm:min-w-[80px] sm:mt-1">Meeting Link:</span>
                    <a
                      href={selectedEvent.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline break-all hover:text-indigo-800 transition-colors"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
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

      {/* Update Group Modal */}
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
          onClose={() => setShowAddMemberModal(false)}
          onMembersAdded={(addedCount) => {
            fetchGroups();
            if (addedCount) {
              showInlineMessage(`${addedCount} member(s) added successfully!`, "success");
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
          onClose={() => setShowScheduleModal(false)}
          onClassScheduled={(className) => {
            fetchClassesFromAPI();
            if (className) {
              showInlineMessage(`Class "${className}" scheduled successfully!`, "success");
            } else {
              showInlineMessage("Class scheduled successfully!", "success");
            }
          }}
        />
      )}
    </div>
  );
};

export default MyClasses;