// src/components/BookdemoData.js
import React, { useState } from "react";
import { groupService } from "../../../../../api/repository/groupService.repository";

function BookdemoData({ classes, onUpdate, userRole }) {
  const [loadingStates, setLoadingStates] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [rescheduleData, setRescheduleData] = useState({
    date_time: "",
    meeting_link: "",
    mode: "online"
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [rescheduleError, setRescheduleError] = useState(null);

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No demo classes found</h3>
        <p className="text-gray-500">You don't have any demo classes scheduled yet.</p>
      </div>
    );
  }

  // ✅ CANCEL Class
  const handleCancelClass = async (classId, reason = "User requested cancellation") => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
   
    try {
      await groupService.cancelIndividualClass(classId, reason);
      setShowCancelModal(false);
      setSelectedClass(null);
      setCancellationReason("");
      setActiveDropdown(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to cancel class:', error);
      alert('Failed to cancel class: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  // ✅ COMPLETE Class
  const handleCompleteClass = async (classId) => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
   
    try {
      await groupService.updateIndividualClass(classId, { status: 'completed' });
      setShowCompleteModal(false);
      setSelectedClass(null);
      setActiveDropdown(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to mark as completed:', error);
      alert('Failed to complete class: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  // ✅ DELETE Class
  const handleDeleteClass = async (classId) => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
    setDeleteError(null);
   
    try {
      await groupService.deleteIndividualClass(classId);
      setShowDeleteModal(false);
      setSelectedClass(null);
      setActiveDropdown(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to delete class:', error);
      setDeleteError(error.response?.data?.message || error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  // ✅ RESCHEDULE Class
  const handleRescheduleClass = async (classId, data) => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
    setRescheduleError(null);
   
    try {
      await groupService.updateIndividualClass(classId, data);
      setShowRescheduleModal(false);
      setSelectedClass(null);
      setRescheduleData({ date_time: "", meeting_link: "", mode: "online" });
      setActiveDropdown(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to reschedule class:', error);
      setRescheduleError(error.response?.data?.message || error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  // Modal handlers
  const openCancelModal = (cls) => {
    setSelectedClass(cls);
    setCancellationReason("");
    setShowCancelModal(true);
    setActiveDropdown(null);
  };

  const openCompleteModal = (cls) => {
    setSelectedClass(cls);
    setShowCompleteModal(true);
    setActiveDropdown(null);
  };

  const openDeleteModal = (cls) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
    setDeleteError(null);
    setActiveDropdown(null);
  };

  const openRescheduleModal = (cls) => {
    setSelectedClass(cls);
    setRescheduleData({
      date_time: cls.date_time ? new Date(cls.date_time).toISOString().slice(0, 16) : "",
      meeting_link: cls.meeting_link || "",
      mode: cls.mode || "online"
    });
    setRescheduleError(null);
    setShowRescheduleModal(true);
    setActiveDropdown(null);
  };

  const closeModals = () => {
    setShowCancelModal(false);
    setShowDeleteModal(false);
    setShowCompleteModal(false);
    setShowRescheduleModal(false);
    setSelectedClass(null);
    setCancellationReason("");
    setRescheduleData({ date_time: "", meeting_link: "", mode: "online" });
    setDeleteError(null);
    setRescheduleError(null);
  };

  const toggleDropdown = (classId) => {
    setActiveDropdown(activeDropdown === classId ? null : classId);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getAvailableActions = (cls) => {
    const actions = [];

    if (cls.status === 'scheduled') {
      actions.push(
        {
          label: 'Complete',
          action: () => openCompleteModal(cls),
          type: 'success',
          description: 'Mark this demo as completed',
          icon: '✓'
        },
        {
          label: 'Reschedule',
          action: () => openRescheduleModal(cls),
          type: 'info',
          description: 'Change date/time of this demo',
          icon: '↻'
        },
        {
          label: 'Cancel',
          action: () => openCancelModal(cls),
          type: 'warning',
          description: 'Cancel this demo class',
          icon: '✕'
        },
        {
          label: 'Delete Permanently',
          action: () => openDeleteModal(cls),
          type: 'danger',
          description: 'Permanently delete this demo',
          icon: '🗑️'
        }
      );
    }
    else if (cls.status === 'cancelled' || cls.status === 'completed') {
      actions.push(
        {
          label: 'Delete Permanently',
          action: () => openDeleteModal(cls),
          type: 'danger',
          description: 'Permanently delete this demo',
          icon: '🗑️'
        }
      );
    }

    return actions;
  };

  return (
    <div className="space-y-4">
      {/* Complete Demo Modal */}
      {showCompleteModal && selectedClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Complete Demo Class</h2>
              <button onClick={closeModals} className="text-white hover:text-gray-200 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to mark the demo class <strong>"{selectedClass.title || selectedClass.name || "Demo Class"}"</strong> as completed?
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={closeModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Keep Scheduled
                </button>
                <button
                  onClick={() => handleCompleteClass(selectedClass.id)}
                  disabled={loadingStates[selectedClass.id]}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {loadingStates[selectedClass.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing...
                    </>
                  ) : "Mark as Completed"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Demo Modal */}
      {showCancelModal && selectedClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-orange-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Cancel Demo Class</h2>
              <button onClick={closeModals} className="text-white hover:text-gray-200 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel the demo class <strong>"{selectedClass.title || selectedClass.name || "Demo Class"}"</strong>?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Reason (Optional)
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Enter reason for cancellation..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={closeModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Keep Demo
                </button>
                <button
                  onClick={() => handleCancelClass(selectedClass.id, cancellationReason || "User requested cancellation")}
                  disabled={loadingStates[selectedClass.id]}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {loadingStates[selectedClass.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Demo Modal */}
      {showRescheduleModal && selectedClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Reschedule Demo Class</h2>
              <button onClick={closeModals} className="text-white hover:text-gray-200 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-4">
                Reschedule the demo class <strong>"{selectedClass.title || selectedClass.name || "Demo Class"}"</strong>
              </p>
              
              {rescheduleError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">{rescheduleError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={rescheduleData.date_time}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, date_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Mode
                  </label>
                  <select
                    value={rescheduleData.mode}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, mode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                {rescheduleData.mode === 'online' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Link *
                    </label>
                    <input
                      type="url"
                      value={rescheduleData.meeting_link}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, meeting_link: e.target.value }))}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      required={rescheduleData.mode === 'online'}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button onClick={closeModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Cancel
                </button>
                <button
                  onClick={() => handleRescheduleClass(selectedClass.id, rescheduleData)}
                  disabled={loadingStates[selectedClass.id] || !rescheduleData.date_time || (rescheduleData.mode === 'online' && !rescheduleData.meeting_link)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {loadingStates[selectedClass.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rescheduling...
                    </>
                  ) : "Reschedule Class"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Demo Modal */}
      {showDeleteModal && selectedClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-red-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Delete Demo Class</h2>
              <button onClick={closeModals} className="text-white hover:text-gray-200 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to permanently delete the demo class <strong>"{selectedClass.title || selectedClass.name || "Demo Class"}"</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ This action cannot be undone. The demo class will be permanently removed.
                </p>
              </div>
              {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700 font-medium">{deleteError}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={closeModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Keep Demo
                </button>
                <button
                  onClick={() => handleDeleteClass(selectedClass.id)}
                  disabled={loadingStates[selectedClass.id]}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {loadingStates[selectedClass.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Demo Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Tutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Meeting Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => {
              const availableActions = getAvailableActions(cls);
              const hasActions = availableActions.length > 0;
              
              return (
                <tr key={cls.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-orange-700 font-medium text-xs">D</span>
                      </div>
                      {cls.title || cls.name || "Demo Class"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-700 font-medium text-xs">
                          {cls.tutor_name ? cls.tutor_name.charAt(0).toUpperCase() : "T"}
                        </span>
                      </div>
                      {cls.tutor_name || cls.Tutor?.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-700 font-medium text-xs">
                          {cls.student_name ? cls.student_name.charAt(0).toUpperCase() : "S"}
                        </span>
                      </div>
                      {cls.student_name || cls.Student?.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(cls.date_time).toLocaleString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cls.mode === "online" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {cls.mode || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cls.status === "scheduled" 
                        ? "bg-yellow-100 text-yellow-800"
                        : cls.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : cls.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {cls.status || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.meeting_link || cls.zoom_link ? (
                      <a
                        href={cls.meeting_link || cls.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Join Demo
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="dropdown-container relative">
                      {hasActions ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(cls.id)}
                            disabled={loadingStates[cls.id]}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loadingStates[cls.id] ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-700" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                Actions
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            )}
                          </button>

                          {activeDropdown === cls.id && (
                            <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu">
                                {availableActions.map((action, index) => (
                                  <button
                                    key={index}
                                    onClick={action.action}
                                    disabled={loadingStates[cls.id]}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-start space-x-2 ${
                                      action.type === 'danger' ? 'text-red-700' :
                                      action.type === 'success' ? 'text-green-700' :
                                      action.type === 'warning' ? 'text-orange-700' :
                                      action.type === 'info' ? 'text-blue-700' :
                                      'text-gray-700'
                                    } ${index !== availableActions.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    role="menuitem"
                                  >
                                    <span className="text-base flex-shrink-0">{action.icon}</span>
                                    <div className="flex-1">
                                      <div className="font-medium">{action.label}</div>
                                      <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded-md">
                          No Actions
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookdemoData;