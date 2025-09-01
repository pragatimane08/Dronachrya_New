import React, { useState } from "react";
import SidebarFilters from "./FindFilterSidebar";
import TutorCard from "./TutorCard";

const FindTutorShow = () => {
  // Sample Tutors Data
  const tutorsData = [
    {
      name: "Aditya Pratap Singh",
      image: "https://via.placeholder.com/120",
      rating: 4.9,
      reviews: 48,
      experience: 4,
      students: 24,
      mode: "Online / Offline",
      location: "Lucknow",
      city: "Ashiyana, Lucknow",
      subjects: "Mathematics, Science, Hindi, Social Studies",
      about:
        "I have 4 years of experience in online edtech. I create personalized lessons for Class 1–5 students with interactive learning methods and regular progress tracking.",
      priceRange: "₹350 - ₹450",
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      teachingTypes: ["Online", "Offline", "Student Place", "Tutor Place"],
    },
    {
      name: "Priya Sharma",
      image: "https://via.placeholder.com/120",
      rating: 4.7,
      reviews: 30,
      experience: 6,
      students: 40,
      mode: "Offline Classes",
      location: "Delhi",
      city: "Connaught Place, Delhi",
      subjects: "English, History, Political Science",
      about:
        "Dedicated to improving student communication and writing skills with interactive lessons and personalized feedback sessions.",
      priceRange: "₹500 - ₹700",
      availability: ["Mon", "Wed", "Fri", "Sat"],
      teachingTypes: ["Offline", "Tutor Place"],
    },
    {
      name: "Rohit Kumar",
      image: "https://via.placeholder.com/120",
      rating: 4.5,
      reviews: 20,
      experience: 3,
      students: 15,
      mode: "Online Classes",
      location: "Mumbai",
      city: "Andheri, Mumbai",
      subjects: "Physics, Chemistry, Mathematics",
      about:
        "Focused on conceptual clarity and practical problem solving with real-world examples and application-based learning.",
      priceRange: "₹400 - ₹600",
      availability: ["Tue", "Thu", "Sat", "Sun"],
      teachingTypes: ["Online", "Student Place"],
    },
  ];

  // State to hold filtered tutors
  const [filteredTutors, setFilteredTutors] = useState(tutorsData);
  const [showFilters, setShowFilters] = useState(false);

  // Apply Filters
  const handleApplyFilters = (filters) => {
    let results = tutorsData;

    // Name filter
    if (filters.name) {
      results = results.filter((t) =>
        t.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      results = results.filter((t) =>
        t.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // More Filters → Online / Offline
    if (filters.moreFilter === "online") {
      results = results.filter((t) => t.mode.toLowerCase().includes("online"));
    } else if (filters.moreFilter === "offline") {
      results = results.filter((t) => t.mode.toLowerCase().includes("offline"));
    } else if (filters.moreFilter === "experience") {
      results = results.filter((t) => t.experience >= 5);
    }

    // Budget filter
    if (filters.budgetMin || filters.budgetMax) {
      results = results.filter((t) => {
        const priceRange = t.priceRange.replace("₹", "").split(" - ");
        const min = parseInt(priceRange[0]);
        const max = parseInt(priceRange[1]);

        const filterMin = filters.budgetMin ? parseInt(filters.budgetMin) : 0;
        const filterMax = filters.budgetMax
          ? parseInt(filters.budgetMax)
          : Infinity;

        return min >= filterMin && max <= filterMax;
      });
    }

    // Sort By
    if (filters.sortBy === "Rating") {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "Experience") {
      results = [...results].sort((a, b) => b.experience - a.experience);
    } else if (filters.sortBy === "Price Low → High") {
      results = [...results].sort((a, b) => {
        const aMin = parseInt(a.priceRange.replace("₹", "").split(" - ")[0]);
        const bMin = parseInt(b.priceRange.replace("₹", "").split(" - ")[0]);
        return aMin - bMin;
      });
    } else if (filters.sortBy === "Price High → Low") {
      results = [...results].sort((a, b) => {
        const aMin = parseInt(a.priceRange.replace("₹", "").split(" - ")[0]);
        const bMin = parseInt(b.priceRange.replace("₹", "").split(" - ")[0]);
        return bMin - aMin;
      });
    }

    setFilteredTutors(results);
    setShowFilters(false); // Hide filters on mobile after applying
  };

  // Clear Filters
  const handleClearFilters = () => {
    setFilteredTutors(tutorsData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Tutor
          </h1>
          <p className="text-gray-600">
            Browse through our verified tutors and find the best match for your
            learning needs
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-center mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-md text-teal-600 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Hidden on mobile unless toggled */}
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <SidebarFilters
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Tutors List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredTutors.length} Tutors Available
              </h2>
              <p className="text-gray-600 text-sm">
                {filteredTutors.length === tutorsData.length
                  ? "Browse all our qualified tutors"
                  : "Matching your criteria"}
              </p>
            </div>

            <div className="grid gap-6">
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor, index) => (
                  <TutorCard key={index} tutor={tutor} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No tutors found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to find more results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTutorShow;
