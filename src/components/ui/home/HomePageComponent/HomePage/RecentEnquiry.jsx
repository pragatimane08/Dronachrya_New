import React, { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  BookOpen,
  User,
  Monitor,
  Building,
  Calendar,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { apiClient } from "../../../../../api/apiclient"; 
=======
import ShowAllEnquiries from "../../../home/HomePageComponent/HomePage/ShowEnquiry"; // Already imported
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed

const StudentEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await apiClient.get("/public/students");
      
      // Handle different response structures
      let enquiriesData = [];
      
      if (Array.isArray(response.data)) {
        // If response.data is already an array
        enquiriesData = response.data;
      } else if (response.data && Array.isArray(response.data.enquiries)) {
        // If response.data has an enquiries array
        enquiriesData = response.data.enquiries;
      } else if (response.data && Array.isArray(response.data.students)) {
        // If response.data has a students array
        enquiriesData = response.data.students;
      } else if (response.data && Array.isArray(response.data.data)) {
        // If response.data has a data array
        enquiriesData = response.data.data;
      } else {
        // If it's an object or something else, log for debugging
        console.warn("Unexpected API response structure:", response.data);
        enquiriesData = [];
      }
      
      setEnquiries(enquiriesData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load enquiries: ${err.response?.data?.message || err.message}`);
      setEnquiries([]); // Ensure enquiries is always an array
=======
      const response = await fetch(
        "http://15.206.81.98:3000/api/public/students"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEnquiries(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load enquiries: ${err.message}`);
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location) => {
<<<<<<< HEAD
    if (!location) return "Location not specified";
    
    // Handle both object and string locations
    if (typeof location === 'object') {
      const { city, state } = location;
      if (!city && !state) return "Location not specified";
      return `${city || ""}${city && state ? ", " : ""}${state || ""}`;
    }
    
    // If location is a string
    return location || "Location not specified";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleShowAll = () => {
    navigate("/show-all-enquiries");
  };

  // Safe array access for rendering
  const displayEnquiries = Array.isArray(enquiries) ? enquiries.slice(0, 3) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
=======
    return `${location.city}, ${location.state}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleShowAll = () => {
    navigate("/show-all-tutors");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
=======
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
              onClick={fetchEnquiries}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Student Enquiries
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
=======
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Student Enquiries
          </h1>
          <p className="text-gray-600 text-lg">
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
            Browse and connect with students looking for tutors
          </p>

          {/* Show All Button */}
<<<<<<< HEAD
          <div className="mt-3 sm:mt-4">
            <button
              onClick={handleShowAll}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow hover:shadow-md text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
=======
          <div className="mt-6">
            <button
              onClick={handleShowAll}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5 mr-2" />
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
              Show All Enquiries ({enquiries.length})
            </button>
          </div>

        </div>

        {/* Preview Enquiries */}
<<<<<<< HEAD
        {displayEnquiries.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border shadow-sm mx-2">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No enquiries found
            </h3>
            <p className="text-gray-600 text-sm">
=======
        {enquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No enquiries found
            </h3>
            <p className="text-gray-600">
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
              There are no student enquiries at the moment
            </p>
          </div>
        ) : (
<<<<<<< HEAD
          <div className="px-1 sm:px-0">
            {/* Count Info */}
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-gray-600 text-xs sm:text-sm">
                Showing {displayEnquiries.length} of {enquiries.length} enquiries
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {displayEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id || enquiry._id || Math.random()}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow flex-shrink-0">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {enquiry.name || "Unknown Student"}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(enquiry.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-1">
                      {(enquiry.subjects || []).slice(0, 3).map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          <BookOpen className="w-2 h-2 mr-1" />
                          {subject}
                        </span>
                      ))}
                      {(enquiry.subjects || []).length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{(enquiry.subjects || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1">
                    {/* Class and Board */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500 flex-shrink-0" />
                        <span className="font-medium truncate text-xs sm:text-sm">
                          {enquiry.class || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-orange-500 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {enquiry.board || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Class Mode and Price */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <Monitor className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {(enquiry.class_modes || []).length > 0
                            ? enquiry.class_modes.join(", ")
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-700">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500 flex-shrink-0" />
                        <span className="font-semibold text-green-700 whitespace-nowrap text-xs sm:text-sm">
                          ₹{parseFloat(enquiry.hourly_charges || 0).toFixed(0)}/hour
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-700">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-red-500 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">
                        {formatLocation(enquiry.location)}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-700">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-indigo-500 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">
                        Starts: {enquiry.start_timeline || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
=======
          <div>
            {/* Count Info */}
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                Showing {Math.min(3, enquiries.length)} of {enquiries.length}{" "}
                enquiries
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enquiries.slice(0, 3).map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {enquiry.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {enquiry.user?.status || "Active"}
                            </span> */}
                            <span className="text-xs text-gray-500">
                              {formatDate(enquiry.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-1">
                      {enquiry.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    {/* Class and Board */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Building className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="font-medium">{enquiry.class}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
                        <span>{enquiry.board}</span>
                      </div>
                    </div>

                    {/* Class Mode and Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Monitor className="w-4 h-4 mr-2 text-blue-500" />
                        <span>
                          {enquiry.class_modes.length > 0
                            ? enquiry.class_modes.join(", ")
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-semibold text-green-700">
                          ₹{parseFloat(enquiry.hourly_charges).toFixed(0)}/hour
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span>{formatLocation(enquiry.location)}</span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>Starts: {enquiry.start_timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

           
            
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnquiries;
