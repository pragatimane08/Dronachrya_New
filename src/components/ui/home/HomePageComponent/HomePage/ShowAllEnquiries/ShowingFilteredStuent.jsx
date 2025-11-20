import React from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import StudentCard from "./StudentCard";

const ShowingFilteredStudents = ({ 
  filteredEnquiries, 
  currentPage, 
  enquiriesPerPage, 
  onPageChange,
  onRefresh,
  filters,
  onClearFilters 
}) => {
  // Pagination logic
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1">
      {/* Active Filters Display */}
      {Object.values(filters).some(val => 
        Array.isArray(val) ? val.length > 0 : val && val !== "Any"
      ) && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#35BAA3] bg-opacity-10 rounded-lg border border-[#35BAA3] border-opacity-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#35BAA3]">Active Filters:</span>
            <button
              onClick={onClearFilters}
              className="text-xs text-[#35BAA3] hover:text-[#2da892] font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.name && (
              <span className="inline-flex items-center px-2 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                Name: {filters.name}
              </span>
            )}
            {filters.subjects.map(subject => (
              <span key={subject} className="inline-flex items-center px-2 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                Subject: {subject}
              </span>
            ))}
            {filters.class.map(grade => (
              <span key={grade} className="inline-flex items-center px-2 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                Class: {grade}
              </span>
            ))}
            {filters.location && (
              <span className="inline-flex items-center px-2 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                Location: {filters.location}
              </span>
            )}
            {(filters.hourly_charges_min || filters.hourly_charges_max) && (
              <span className="inline-flex items-center px-2 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                Budget: ₹{filters.hourly_charges_min || '0'} - ₹{filters.hourly_charges_max || '∞'}
              </span>
            )}
            {filters.gender !== "Any" && (
              <span className="inline-flex items-center px-2 py-1 bg-white text-[#35BAA3] rounded-full text-xs border border-[#35BAA3] border-opacity-30">
                Gender: {filters.gender}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Enquiries Grid */}
      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border shadow-sm mx-2">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            No enquiries found
          </h3>
          <p className="text-gray-600 text-sm">
            {filteredEnquiries.length === 0 && "No students match your current filters."}
          </p>
          <button
            onClick={onClearFilters}
            className="mt-3 bg-[#35BAA3] hover:bg-[#2da892] text-white px-4 py-2 rounded text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="px-1 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {currentEnquiries.map((enquiry) => (
                <StudentCard key={enquiry.id} enquiry={enquiry} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    currentPage === index + 1
                      ? "bg-[#35BAA3] text-white border-[#35BAA3]"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Refresh Button */}
      {filteredEnquiries.length > 0 && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh List
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowingFilteredStudents;

