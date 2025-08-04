import React, { useState, useEffect } from "react";
import NotificationForm from "./NotificationForm";
import { notificationRepository } from "../../../../api/repository/admin/notificationApi";
import { 
  FiSend, 
  FiPlus, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiX
} from "react-icons/fi";

const SendNotification = () => {
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const entriesPerPage = 15;

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleOpenMessage = (message) => setSelectedMessage(message);
  const handleCloseMessage = () => setSelectedMessage(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const list = await notificationRepository.getAll();
      setNotifications(list);
      setCurrentPage(1);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = notifications.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Sent
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1" /> Failed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiLoader className="mr-1 animate-spin" /> Pending
          </span>
        );
      default:
        return "-";
    }
  };

  return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Manage and send notifications to users
            </p>
          </div>
          <button
            onClick={handleOpenForm}
            className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <FiPlus className="mr-2" />
            Send New Notification
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-50 text-teal-600">
                <FiSend size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sent</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {notifications.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <FiCheckCircle size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Successful</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {notifications.filter(n => n.status?.toLowerCase() === 'sent').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <FiXCircle size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {notifications.filter(n => n.status?.toLowerCase() === 'failed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                <FiLoader size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {notifications.filter(n => n.status?.toLowerCase() === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiMail className="mr-2" /> Template
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiUser className="mr-2" /> Recipient
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent By
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiClock className="mr-2" /> Sent At
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                      </div>
                      <p className="mt-2 text-gray-600">Loading notifications...</p>
                    </td>
                  </tr>
                ) : currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No notifications found. Send your first notification!
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.template_name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {item.type || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.recipient || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {item.sent_by || "System"}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <button 
                          onClick={() => handleOpenMessage(item.content)}
                          className="text-sm text-gray-900 text-left hover:text-teal-600 transition-colors w-full"
                        >
                          <div className="truncate max-w-[150px]">
                            {item.content?.message 
                              ? `${item.content.message.substring(0, 30)}${item.content.message.length > 30 ? '...' : ''}`
                              : "No message content"}
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.sent_at ? (
                            <>
                              <div>{new Date(item.sent_at).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(item.sent_at).toLocaleTimeString()}
                              </div>
                            </>
                          ) : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstEntry + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastEntry, notifications.length)}</span> of{' '}
                <span className="font-medium">{notifications.length}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 
                    'text-gray-400 cursor-not-allowed' : 
                    'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="First page"
                >
                  <FiChevronsLeft className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 
                    'text-gray-400 cursor-not-allowed' : 
                    'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Previous page"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0 ? 
                    'text-gray-400 cursor-not-allowed' : 
                    'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Next page"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0 ? 
                    'text-gray-400 cursor-not-allowed' : 
                    'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Last page"
                >
                  <FiChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-semibold text-gray-800">Full Message Content</h3>
                <button 
                  onClick={handleCloseMessage}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded">
                  {typeof selectedMessage === 'object' ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {JSON.stringify(selectedMessage, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-gray-800">{selectedMessage}</p>
                  )}
                </div>
              </div>
              <div className="border-t p-4 flex justify-end">
                <button
                  onClick={handleCloseMessage}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Form Modal */}
        {showForm && (
          <NotificationForm
            onClose={handleCloseForm}
            onSuccess={() => {
              handleCloseForm();
              loadNotifications();
            }}
          />
        )}
      </div>
  );
};

export default SendNotification;