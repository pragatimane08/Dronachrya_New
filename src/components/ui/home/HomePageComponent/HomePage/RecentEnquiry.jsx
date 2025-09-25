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
      const response = await fetch(
        'http://15.206.81.98:3000/api/enquiries/recent'
      );
      const data = await response.json();

      if (response.ok) {
        setEnquiries(data.enquiries || []);
      } else {
        setError(data.message || 'Failed to fetch enquiries');
      }
    } catch (err) {
      setError('Network error: Unable to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
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
    const classNum = parseInt(className);
    let color = 'bg-purple-100 text-purple-800';
    if (classNum > 5 && classNum <= 10)
      color = 'bg-orange-100 text-orange-800';
    if (classNum > 10) color = 'bg-red-100 text-red-800';

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${color} border`}
      >
        Class {className}
      </span>
    );
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

  const EnquiryCard = ({ enquiry, index }) => (
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
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-gray-900 text-sm truncate">
                {enquiry.sender?.name}
              </h4>
              <div className="flex items-center space-x-1 flex-wrap gap-1 mt-1">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(
                    enquiry.sender?.role
                  )}`}
                >
                  {enquiry.sender?.role}
                </span>
                {getClassBadge(enquiry.class)}
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
          {enquiry.subject}
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

        {/* Subjects - Improved Display */}
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
      </div>

      {/* Receiver */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="text-xs text-gray-600 font-semibold flex-shrink-0 bg-gray-200 px-2 py-1 rounded">To:</div>
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {enquiry.receiver?.profile_photo ? (
                <img
                  src={enquiry.receiver.profile_photo}
                  alt={enquiry.receiver.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-gray-800 text-sm truncate block">
                  {enquiry.receiver?.name}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${getRoleColor(
                    enquiry.receiver?.role
                  )} mt-1 inline-block`}
                >
                  {enquiry.receiver?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );

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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Recent Enquiries
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
                    ? 'All'
                    : role === 'student'
                    ? 'Students'
                    : 'Tutors'}
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
                <EnquiryCard key={enquiry.id} enquiry={enquiry} index={index} />
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