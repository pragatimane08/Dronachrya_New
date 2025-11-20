import React, { useState } from "react";

function AllClassesData({ classes, onUpdateClass, userRole }) {
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const itemsPerPage = 10;

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
        <p className="text-gray-500">You don't have any scheduled classes yet.</p>
      </div>
    );
  }

  // Calculate pagination values
  const totalItems = classes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = classes.slice(startIndex, endIndex);

  const handleCancelClass = async (classId, reason = "User requested cancellation") => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
    
    try {
      await onUpdateClass(classId, { 
        status: 'cancelled',
        cancellation_reason: reason 
      });
      // Close modal after successful cancellation
      setShowCancelModal(false);
      setSelectedClass(null);
      setCancellationReason("");
    } catch (error) {
      console.error('Failed to cancel class:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  const handleConfirmClass = async (classId) => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
    
    try {
      await onUpdateClass(classId, { status: 'scheduled' });
    } catch (error) {
      console.error('Failed to confirm class:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  const handleCompleteClass = async (classId) => {
    setLoadingStates(prev => ({ ...prev, [classId]: true }));
    
    try {
      await onUpdateClass(classId, { 
        status: 'completed'
      });
    } catch (error) {
      console.error('Failed to mark as completed:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [classId]: false }));
    }
  };

  const openCancelModal = (cls) => {
    setSelectedClass(cls);
    setCancellationReason("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedClass(null);
    setCancellationReason("");
  };

  const canModifyClass = (cls, action) => {
    const { id: userId, role } = userRole;
    
    if (role === 'admin') return true;
    if (role === 'tutor' && cls.tutor_id === userId) return true;
    if (role === 'student' && cls.student_id === userId) return true;
    
    return false;
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Cancel Class Modal */}
      {showCancelModal && selectedClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-red-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Cancel Class</h2>
              <button
                onClick={closeCancelModal}
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
            <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to cancel the class <strong>"{selectedClass.title || selectedClass.name || "Class"}"</strong>?
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm resize-none"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Keep Class
                </button>
                <button
                  onClick={() => handleCancelClass(selectedClass.id, cancellationReason || "User requested cancellation")}
                  disabled={loadingStates[selectedClass.id]}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
                >
                  {loadingStates[selectedClass.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

      {/* Pagination Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{" "}
          <span className="font-medium">{totalItems}</span> classes
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-1 text-sm font-medium border rounded-md transition-colors ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : page === '...'
                    ? 'text-gray-400 border-transparent cursor-default'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Classes Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Class Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Tutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Meeting Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentClasses.map((cls) => (
              <tr key={cls.id} className="hover:bg-indigo-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                      cls.type === "demo" 
                        ? "bg-orange-100" 
                        : cls.type === "group"
                        ? "bg-green-100" 
                        : "bg-blue-100"
                    }`}>
                      <span className={`font-medium text-xs ${
                        cls.type === "demo" 
                          ? "text-orange-700" 
                          : cls.type === "group"
                          ? "text-green-700" 
                          : "text-blue-700"
                      }`}>
                        {cls.type === "demo" ? "D" : cls.type === "group" ? "G" : "S"}
                      </span>
                    </div>
                    {cls.title || cls.name || "Class"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cls.type === "demo" 
                      ? "bg-orange-100 text-orange-800"
                      : cls.type === "group"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {cls.type === "demo" ? "Demo" : cls.type === "group" ? "Group" : "Single"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-green-700 font-medium text-xs">
                        {cls.tutor_name ? cls.tutor_name.charAt(0).toUpperCase() : 
                         cls.Tutor?.name ? cls.Tutor.name.charAt(0).toUpperCase() : "T"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {cls.tutor_name || cls.Tutor?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cls.Tutor?.email || "-"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-purple-700 font-medium text-xs">
                        {cls.student_name ? cls.student_name.charAt(0).toUpperCase() : 
                         cls.Student?.name ? cls.Student.name.charAt(0).toUpperCase() : "S"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {cls.student_name || cls.Student?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cls.Student?.email || "-"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.subject || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(cls.date_time).toLocaleString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata"
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
                  {cls.meeting_link && cls.mode === "online" ? (
                    <a
                      href={cls.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Join
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2 min-w-[120px]">
                    {/* Complete Class Button - for scheduled classes */}
                    {cls.status === "scheduled" && canModifyClass(cls, 'complete') && (
                      <button
                        onClick={() => handleCompleteClass(cls.id)}
                        disabled={loadingStates[cls.id]}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Mark as Completed"
                      >
                        {loadingStates[cls.id] ? (
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        Complete
                      </button>
                    )}

                    {/* Cancel Class Button - for scheduled classes */}
                    {cls.status === "scheduled" && canModifyClass(cls, 'cancel') && (
                      <button
                        onClick={() => openCancelModal(cls)}
                        disabled={loadingStates[cls.id]}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel Class
                      </button>
                    )}
                    
                    {/* Reschedule Button - for cancelled classes */}
                    {cls.status === "cancelled" && canModifyClass(cls, 'confirm') && (
                      <button
                        onClick={() => handleConfirmClass(cls.id)}
                        disabled={loadingStates[cls.id]}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingStates[cls.id] ? (
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        Reschedule
                      </button>
                    )}
                    
                    {/* Status Display for Completed Classes */}
                    {cls.status === "completed" && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                        Completed
                      </span>
                    )}

                    {/* No actions for completed classes */}
                    {cls.status === "completed" && !canModifyClass(cls, 'any') && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded-md">
                        No Actions
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-medium">{totalItems}</span> classes
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-1 text-sm font-medium border rounded-md transition-colors ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : page === '...'
                    ? 'text-gray-400 border-transparent cursor-default'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllClassesData;