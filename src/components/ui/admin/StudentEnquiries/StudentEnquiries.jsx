// StudentEnquiriesApp.js
import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Users, User, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { EnquiryRepository } from '../../../../api/repository/admin/enquiryRepository';

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-gray-50">
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return '✓ Verified';
      case 'pending': return 'Pending';
      default: return 'Not Registered';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

// Enquiry Count Badge Component
const EnquiryCountBadge = ({ enquiryCount, verifiedCount }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1">
      <span className="text-xs font-medium text-gray-600">Total:</span>
      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
        {enquiryCount || 0}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-xs font-medium text-gray-600">Verified:</span>
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
        {verifiedCount || 0}
      </span>
    </div>
  </div>
);

// Contact Info Component
const ContactInfo = ({ enquiry }) => {
  const getEmail = () => {
    return enquiry.user?.email || null;
  };

  const getMobileNumber = () => {
    return enquiry.user?.mobile_number || null;
  };

  const email = getEmail();
  const mobileNumber = getMobileNumber();

  return (
    <div className="mt-1">
      {email && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Mail className="w-3 h-3" />
          {email}
        </div>
      )}
      {mobileNumber && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Phone className="w-3 h-3" />
          {mobileNumber}
        </div>
      )}
      {!email && !mobileNumber && (
        <div className="text-xs text-gray-400">
          No contact information
        </div>
      )}
    </div>
  );
};

// Availability Tags Component
const AvailabilityTags = ({ availability }) => (
  <div className="flex flex-wrap gap-1">
    {availability && availability.map((day, idx) => (
      <span key={idx} className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200">
        <Calendar className="w-3 h-3 mr-1" />
        {day}
      </span>
    ))}
  </div>
);

// Subject Tags Component
const SubjectTags = ({ subjects }) => (
  <div className="flex flex-wrap gap-1">
    {subjects.map((subject, idx) => (
      <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
        {subject}
      </span>
    ))}
  </div>
);

// Class Mode Tags Component
const ClassModeTags = ({ modes }) => (
  <div className="flex flex-wrap gap-1">
    {modes.map((mode, idx) => (
      <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
        {mode}
      </span>
    ))}
  </div>
);

// Helper function to format date for exports - FIXED VERSION
const formatDateForExport = (dateString) => {
  if (!dateString || dateString === '######') return 'N/A';
 
  try {
    const date = new Date(dateString);
   
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
   
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
   
    // Return in YYYY-MM-DD format which is Excel-friendly
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Invalid Date';
  }
};

// Export functionality - Fixed date format
const exportToCSV = (enquiries) => {
  const headers = [
    'Name',
    'Email',
    'Mobile',
    'Class',
    'Subjects',
    'Availability',
    'Location',
    'Timeline',
    'Tutor Preference',
    'Charges',
    'Status',
    'Total Enquiries',
    'Verified Enquiries',
    'Created Date'
  ];
 
  const csvData = enquiries.map(enquiry => [
    enquiry.name || '',
    enquiry.user?.email || '',
    enquiry.user?.mobile_number || '',
    enquiry.class || 'Not specified',
    enquiry.subjects?.join(', ') || '',
    enquiry.availability?.join(', ') || 'Not specified',
    enquiry.location ? `${enquiry.location.city || ''}, ${enquiry.location.state || ''}`.replace(/,$/, '').trim() : 'N/A',
    enquiry.start_timeline || '',
    enquiry.tutor_gender_preference || 'No preference',
    `₹${enquiry.hourly_charges}/hr`,
    enquiry.user?.status || 'not registered',
    enquiry.enquiry_count || 0,
    enquiry.verified_enquiry_count || 0,
    formatDateForExport(enquiry.created_at)
  ]);

  const csvContent = [
    '\uFEFF' + headers.join(','),
    ...csvData.map(row =>
      row.map(field => {
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `student-enquiries-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToExcel = (enquiries) => {
  const headers = [
    'Name',
    'Email',
    'Mobile',
    'Class',
    'Subjects',
    'Availability',
    'Location',
    'Timeline',
    'Tutor Preference',
    'Charges',
    'Status',
    'Total Enquiries',
    'Verified Enquiries',
    'Created Date'
  ];
 
  const excelData = enquiries.map(enquiry => [
    enquiry.name || '',
    enquiry.user?.email || '',
    enquiry.user?.mobile_number || '',
    enquiry.class || 'Not specified',
    enquiry.subjects?.join(', ') || '',
    enquiry.availability?.join(', ') || 'Not specified',
    enquiry.location ? `${enquiry.location.city || ''}, ${enquiry.location.state || ''}`.replace(/,$/, '').trim() : 'N/A',
    enquiry.start_timeline || '',
    enquiry.tutor_gender_preference || 'No preference',
    `₹${enquiry.hourly_charges}/hr`,
    enquiry.user?.status || 'not registered',
    enquiry.enquiry_count || 0,
    enquiry.verified_enquiry_count || 0,
    formatDateForExport(enquiry.created_at)
  ]);

  // Create a proper Excel file with HTML table format and proper date handling
  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Student Enquiries</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:FitToPage/>
                <x:Print>
                  <x:FitWidth>1</x:FitWidth>
                  <x:FitHeight>1</x:FitHeight>
                </x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .date-column {
          mso-number-format: "Short Date";
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${excelData.map(row =>
            `<tr>${row.map((cell, index) =>
              index === headers.length - 1 // Last column is Created Date
                ? `<td class="date-column">${cell}</td>`
                : `<td>${cell}</td>`
            ).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `student-enquiries-${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (enquiries) => {
  const printContent = `
    <html>
      <head>
        <title>Student Enquiries Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.4;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 10px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .summary {
            margin: 15px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
          }
          .timestamp {
            text-align: right;
            font-size: 11px;
            color: #666;
            margin-bottom: 10px;
          }
          .count-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            margin: 1px;
          }
          .total-count { background: #dbeafe; color: #1e40af; }
          .verified-count { background: #d1fae5; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Student Enquiries Report</h1>
          <div class="timestamp">Generated on: ${new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
        </div>
       
        <div class="summary">
          <strong>Report Summary:</strong> Total ${enquiries.length} enquiries found
        </div>
       
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Class</th>
              <th>Subjects</th>
              <th>Availability</th>
              <th>Location</th>
              <th>Timeline</th>
              <th>Tutor Preference</th>
              <th>Charges</th>
              <th>Status</th>
              <th>Enquiry Count</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${enquiries.map(enquiry => {
              const email = enquiry.user?.email || 'N/A';
              const mobile = enquiry.user?.mobile_number || 'N/A';
              const availability = enquiry.availability?.join(', ') || 'Not specified';
             
              return `
              <tr>
                <td>${enquiry.name || 'N/A'}</td>
                <td>${email}</td>
                <td>${mobile}</td>
                <td>${enquiry.class || 'Not specified'}</td>
                <td>${enquiry.subjects?.join(', ') || 'N/A'}</td>
                <td>${availability}</td>
                <td>${enquiry.location ? `${enquiry.location.city || ''}, ${enquiry.location.state || ''}`.replace(/,$/, '').trim() : 'N/A'}</td>
                <td>${enquiry.start_timeline || 'N/A'}</td>
                <td>${enquiry.tutor_gender_preference || 'No preference'}</td>
                <td>₹${enquiry.hourly_charges}/hr</td>
                <td>${enquiry.user?.status || 'not registered'}</td>
                <td>
                  <span class="count-badge total-count">Total: ${enquiry.enquiry_count || 0}</span>
                  <span class="count-badge verified-count">Verified: ${enquiry.verified_enquiry_count || 0}</span>
                </td>
                <td>${formatDateForExport(enquiry.created_at)}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
       
        <div style="margin-top: 20px; font-size: 11px; color: #666; text-align: center;">
          Report generated from Student Enquiries Management System
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
 
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

// Delete Button Component
const DeleteButton = ({ enquiryId, onDelete, loading }) => (
  <button
    onClick={() => onDelete(enquiryId)}
    disabled={loading}
    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    title="Delete enquiry"
  >
    <Trash2 className="w-4 h-4" />
    Delete
  </button>
);

// Main Application Component
export default function StudentEnquiriesApp() {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
 
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    class: 'all',
    location: 'all'
  });
 
  const [sortBy, setSortBy] = useState('newest');
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadEnquiries = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
     
      setError(null);
      const data = await EnquiryRepository.fetchEnquiries();
      setEnquiries(data);
     
    } catch (err) {
      console.error('Component: Load enquiries error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Add delete enquiry handler
  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(enquiryId);
      await EnquiryRepository.deleteEnquiry(enquiryId);
      
      // Remove the deleted enquiry from state
      setEnquiries(prev => prev.filter(enq => enq.id !== enquiryId));
      
      // Show success message
      alert('Enquiry deleted successfully');
    } catch (error) {
      console.error('Delete enquiry error:', error);
      alert('Failed to delete enquiry: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  useEffect(() => {
    if (enquiries.length > 0) {
      let result = EnquiryRepository.filterEnquiries(enquiries, filters);
      result = EnquiryRepository.sortEnquiries(result, sortBy);
      setFilteredEnquiries(result);
      setCurrentPage(1);
    } else {
      setFilteredEnquiries([]);
    }
  }, [enquiries, filters, sortBy]);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  const stats = EnquiryRepository.getStats(enquiries);
  const uniqueLocations = EnquiryRepository.getUniqueLocations(enquiries);
  const uniqueClasses = EnquiryRepository.getUniqueClasses(enquiries);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      class: 'all',
      location: 'all'
    });
    setSortBy('newest');
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  const handleExportPDF = () => {
    exportToPDF(filteredEnquiries);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredEnquiries);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredEnquiries);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error && enquiries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-bold text-lg mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadEnquiries()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadEnquiries(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
           
            {filteredEnquiries.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <div className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={handleExportExcel}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            label="Total Enquiries"
            value={stats.total}
            color="#3B82F6"
          />
          <StatsCard
            icon={User}
            label="Verified"
            value={stats.verified}
            color="#10B981"
          />
          <StatsCard
            icon={Clock}
            label="Pending"
            value={stats.pending}
            color="#F59E0B"
          />
          <StatsCard
            icon={User}
            label="Not Registered"
            value={stats.notRegistered}
            color="#6B7280"
          />
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-yellow-800">
                <strong>Note:</strong> {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-yellow-800 hover:text-yellow-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters & Sorting</h2>
           
            <div className="flex gap-2">
              {(filters.search || filters.status !== 'all' || filters.location !== 'all' || filters.class !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, subject, location..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="not registered">Not Registered</option>
            </select>

            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="charges_high">Charges: High to Low</option>
              <option value="charges_low">Charges: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-800">{filteredEnquiries.length}</span> enquiries
              {filteredEnquiries.length > 0 && (
                <> (Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>)</>
              )}
            </p>
           
            {refreshing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating data...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {enquiries.length === 0 ? 'No Enquiries Available' : 'No Enquiries Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {enquiries.length === 0
                ? 'There are no student enquiries at the moment.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
            {enquiries.length === 0 && (
              <button
                onClick={() => loadEnquiries(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Refresh
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student & Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class & Subjects
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Availability
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timeline & Preference
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Charges & Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enquiry Count
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                              {enquiry.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                              <div className="text-sm text-gray-500">
                                {enquiry.school_name || 'Pending student update'}
                              </div>
                              <ContactInfo enquiry={enquiry} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium mb-1">
                            {enquiry.class || 'Not specified'}
                          </div>
                          <SubjectTags subjects={enquiry.subjects} />
                        </td>
                        <td className="px-6 py-4">
                          <AvailabilityTags availability={enquiry.availability} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {enquiry.location ? (
                              <>
                                <div className="font-medium">{enquiry.location.city}</div>
                                <div className="text-gray-500">{enquiry.location.state}</div>
                              </>
                            ) : (
                              'N/A'
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-1">
                            <span className="font-medium">Start: </span>
                            {enquiry.start_timeline}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Tutor: </span>
                            {enquiry.tutor_gender_preference || 'No preference'}
                          </div>
                          <div className="mt-1">
                            <ClassModeTags modes={enquiry.class_modes} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-green-600 mb-2">
                            ₹{enquiry.hourly_charges}/hr
                          </div>
                          <StatusBadge status={enquiry.user?.status} />
                        </td>
                        <td className="px-6 py-4">
                          <EnquiryCountBadge
                            enquiryCount={enquiry.enquiry_count}
                            verifiedCount={enquiry.verified_enquiry_count}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(enquiry.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <DeleteButton 
                            enquiryId={enquiry.id}
                            onDelete={handleDeleteEnquiry}
                            loading={deletingId === enquiry.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(endIndex, filteredEnquiries.length)}
                      </span> of{' '}
                      <span className="font-medium">{filteredEnquiries.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">First</span>
                        <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                     
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Last</span>
                        <ChevronsRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}