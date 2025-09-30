import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Video,
  Users,
} from 'lucide-react';

const EnquirySection = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEnquiry, setExpandedEnquiry] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    fetchRecentEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    if (filter === 'all') return true;
    return enquiry.sender?.role === filter;
  });

  const cardsPerPage = 3;
  const totalSlides = Math.ceil(filteredEnquiries.length / cardsPerPage);

  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    if (isAutoPlay && filteredEnquiries.length > cardsPerPage) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, currentSlide, filteredEnquiries.length, totalSlides]);

  const fetchRecentEnquiries = async () => {
    try {
      setLoading(true);
      // NOTE: Using the API URL extracted from your previous context
      const response = await fetch(
        'http://15.206.81.98:3000/api/enquiries/recent' 
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.enquiries && Array.isArray(data.enquiries)) {
        // Transform the data to match expected structure
        const transformedEnquiries = data.enquiries.map(enquiry => ({
          ...enquiry,
          sender: transformUserData(enquiry.sender),
          receiver: transformUserData(enquiry.receiver)
        }));

        setEnquiries(transformedEnquiries);
      } else {
        // Fallback for unexpected data structure
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to transform user data structure
  const transformUserData = (user) => {
    if (!user) return null;

    return {
      id: user.id,
      role: user.role,
      name: user.name || 'Unknown',
      class: user.class || null,
      subjects: Array.isArray(user.subjects) ? user.subjects : [],
      profile_photo: user.profile_photo || null,
      location: user.location || null, // ✅ Location included
      modes: Array.isArray(user.modes) ? user.modes : [], // ✅ Modes included
      charges: user.charges || null // ✅ Charges included
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'tutor':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getClassBadge = (className) => {
    if (!className) return null;

    if (isNaN(className)) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          {className}
        </span>
      );
    }

    const classNum = parseInt(className);
    let color = 'bg-purple-100 text-purple-800';
    if (classNum > 5 && classNum <= 10) color = 'bg-orange-100 text-orange-800';
    if (classNum > 10) color = 'bg-red-100 text-red-800';

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color} border`}>
        Class {className}
      </span>
    );
  };

  // Helper function for charges
  const formatCharges = (charges) => {
    if (!charges || charges === '0.00' || charges === '0') return 'Not specified';
    return `₹${parseFloat(charges).toFixed(0)}/hour`;
  };

  // Helper function for location
  const formatLocation = (location) => {
    if (!location) return 'Location not specified';

    if (typeof location === 'string') return location;

    if (typeof location === 'object') {
      const { city, state, country } = location;
      const locationParts = [city, state].filter(Boolean);
      return locationParts.length > 0 ? locationParts.join(', ') : country || 'Location not specified';
    }

    return 'Location not specified';
  };

  // Helper function for mode icon
  const getModeIcon = (mode) => {
    if (!mode) return <Users className="w-3 h-3" />;

    switch (mode.toLowerCase()) {
      case 'online':
        return <Video className="w-3 h-3" />;
      case 'offline':
        return <Users className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  // Helper function for mode color
  const getModeColor = (mode) => {
    if (!mode) return 'bg-gray-100 text-gray-700 border-gray-200';

    switch (mode.toLowerCase()) {
      case 'online':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'offline':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleExpanded = (enquiryId) => {
    setExpandedEnquiry(expandedEnquiry === enquiryId ? null : enquiryId);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    if (isAutoPlay) {
      setIsAutoPlay(false);
      setTimeout(() => setIsAutoPlay(true), 100);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    if (isAutoPlay) {
      setIsAutoPlay(false);
      setTimeout(() => setIsAutoPlay(true), 100);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (isAutoPlay) {
      setIsAutoPlay(false);
      setTimeout(() => setIsAutoPlay(true), 100);
    }
  };

  const getVisibleEnquiries = () => {
    const startIndex = currentSlide * cardsPerPage;
    return filteredEnquiries.slice(startIndex, startIndex + cardsPerPage);
  };

  const EnquiryCard = ({ enquiry, index }) => {
    if (!enquiry) return null;

    const hasSenderModes = enquiry.sender?.modes?.length > 0;
    const hasReceiverModes = enquiry.receiver?.modes?.length > 0;

    return (
      <div
        className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden group h-full flex flex-col transform hover:-translate-y-1"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {enquiry.sender?.profile_photo ? (
                <img
                  src={enquiry.sender.profile_photo}
                  alt={enquiry.sender.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {enquiry.sender?.name || 'Unknown User'}
                </h4>
                <div className="flex items-center space-x-1 flex-wrap gap-1 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(
                      enquiry.sender?.role
                    )}`}
                  >
                    {enquiry.sender?.role || 'unknown'}
                  </span>
                  {getClassBadge(enquiry.class || enquiry.sender?.class)}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center text-gray-500 text-xs space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                <span>{formatDate(enquiry.created_at)}</span>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 text-base line-clamp-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            {enquiry.subject || 'No Subject'}
          </h3>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow">
          {enquiry.description && (
            <div className="mb-4">
              <p
                className={`text-gray-700 text-sm leading-relaxed ${
                  expandedEnquiry === enquiry.id ? '' : 'line-clamp-3'
                }`}
              >
                {enquiry.description}
              </p>
              {enquiry.description.length > 100 && (
                <button
                  onClick={() => toggleExpanded(enquiry.id)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors"
                >
                  {expandedEnquiry === enquiry.id ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      <span>Show less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>Read more</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Subjects */}
          {enquiry.sender?.subjects?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Subjects Interested In
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {enquiry.sender.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-200 hover:border-blue-300 transition-colors whitespace-nowrap"
                    title={subject}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Charges and Location - SENDER DETAILS */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Charges */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center space-x-2 mb-1">
                {/* < className="w-3 h-3 text-amber-600" /> */}
                <span className="text-xs font-semibold text-amber-800">Charges</span>
              </div>
              <p className="text-sm font-bold text-amber-900">
                {formatCharges(enquiry.sender?.charges)} {/* ✅ SENDER CHARGES */}
              </p>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-3 h-3 text-green-600" />
                <span className="text-xs font-semibold text-green-800">Location</span>
              </div>
              <p className="text-sm font-medium text-green-900 truncate" title={formatLocation(enquiry.sender?.location)}>
                {formatLocation(enquiry.sender?.location)} {/* ✅ SENDER LOCATION */}
              </p>
            </div>
          </div>

          {/* Class Modes - SENDER DETAILS - FIXED TO SHOW PLACEHOLDER */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Video className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-gray-700">
                Preferred Modes
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasSenderModes ? ( // Check if modes exist
                enquiry.sender.modes.map((mode, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1 ${getModeColor(mode)}`}
                    title={mode}
                  >
                    {getModeIcon(mode)}
                    <span>{mode}</span>
                  </span>
                ))
              ) : (
                // ✅ This placeholder displays when the array is empty
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-gray-100 text-gray-500 border-gray-300">
                  Not specified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Section (Footer) */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="text-xs text-gray-600 font-semibold flex-shrink-0 bg-gray-200 px-2 py-1 rounded">To:</div>
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                {enquiry.receiver?.profile_photo ? (
                  <img
                    src={enquiry.receiver.profile_photo}
                    alt={enquiry.receiver.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-gray-800 text-sm truncate block">
                    {enquiry.receiver?.name || 'Unknown Receiver'}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${getRoleColor(
                      enquiry.receiver?.role
                    )} mt-1 inline-block`}
                  >
                    {enquiry.receiver?.role || 'unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Receiver Details (Location and Charges) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              {/* <DollarSign className="w-3 h-3" /> */}
              <span className="font-medium">{formatCharges(enquiry.receiver?.charges)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate" title={formatLocation(enquiry.receiver?.location)}>
                {formatLocation(enquiry.receiver?.location)}
              </span>
            </div>
          </div>

          {/* Receiver Modes - FIXED TO SHOW PLACEHOLDER */}
          <div className="flex flex-wrap gap-1 mt-2">
            {hasReceiverModes ? (
              enquiry.receiver.modes.map((mode, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-xs border ${getModeColor(mode)} flex items-center space-x-1`}
                >
                  {getModeIcon(mode)}
                  <span>{mode}</span>
                </span>
              ))
            ) : (
              <span className="px-2 py-0.5 rounded text-xs border bg-gray-100 text-gray-500 border-gray-300">
                  Not specified
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-80 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
          <p className="text-base text-gray-600 font-medium">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-80 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl text-red-500">⚠</span>
            </div>
            <h3 className="text-lg font-bold text-red-800 mb-2">
              Error Loading Enquiries
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRecentEnquiries}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No enquiries state
  if (enquiries.length === 0) {
    return (
      <div className="min-h-80 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-8">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Enquiries Found</h3>
          <p className="text-gray-600 mb-4">There are no recent enquiries to display.</p>
          <button
            onClick={fetchRecentEnquiries}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Recent Enquiries ({enquiries.length})
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Discover latest student-tutor connections and academic collaborations
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-lg p-1 shadow-md border border-gray-200">
            <div className="flex space-x-1">
              {['all', 'student', 'tutor'].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setFilter(role);
                    setCurrentSlide(0);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    filter === role
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {role === 'all'
                    ? `All (${enquiries.length})`
                    : role === 'student'
                    ? `Students (${enquiries.filter(e => e.sender?.role === 'student').length})`
                    : `Tutors (${enquiries.filter(e => e.sender?.role === 'tutor').length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slider Container */}
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-md border border-gray-200">
              <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                No enquiries found
              </h3>
              <p className="text-gray-500 text-sm">Try changing your filter settings</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {filteredEnquiries.length > cardsPerPage && (
              <>
                <button
                  onClick={prevSlide}
                  className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-300 hover:bg-gray-50 transition-all"
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-300 hover:bg-gray-50 transition-all"
                  disabled={currentSlide === totalSlides - 1}
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getVisibleEnquiries().map((enquiry, index) => (
                <EnquiryCard
                  key={enquiry.id || index}
                  enquiry={enquiry}
                  index={index}
                />
              ))}
            </div>

            {/* Mobile Navigation Buttons */}
            {filteredEnquiries.length > cardsPerPage && (
              <div className="lg:hidden flex justify-center items-center mt-4 space-x-3">
                <button
                  onClick={prevSlide}
                  className="bg-white rounded-full p-2 shadow-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-all"
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <span className="text-sm text-gray-700 font-medium bg-white px-3 py-1 rounded-full border border-gray-300">
                  {currentSlide + 1} of {totalSlides}
                </span>
                <button
                  onClick={nextSlide}
                  className="bg-white rounded-full p-2 shadow-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-all"
                  disabled={currentSlide === totalSlides - 1}
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            )}

            {/* Slide Indicators */}
            {totalSlides > 1 && (
              <div className="flex flex-col items-center mt-4">
                {isAutoPlay && (
                  <div className="w-32 h-1 bg-gray-300 rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                      style={{
                        width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'bg-blue-600 w-4'
                          : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquirySection;