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
import ShowAllEnquiries from "../../../home/HomePageComponent/HomePage/ShowEnquiry"; // Already imported

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
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location) => {
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Student Enquiries
          </h1>
          <p className="text-gray-600 text-lg">
            Browse and connect with students looking for tutors
          </p>

          {/* Show All Button */}
          <div className="mt-6">
            <button
              onClick={handleShowAll}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5 mr-2" />
              Show All Enquiries ({enquiries.length})
            </button>
          </div>

        </div>

        {/* Preview Enquiries */}
        {enquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No enquiries found
            </h3>
            <p className="text-gray-600">
              There are no student enquiries at the moment
            </p>
          </div>
        ) : (
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

           
            
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnquiries;
