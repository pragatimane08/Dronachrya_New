// src/components/ui/Student/FindTutorShow.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FindFilterSidebar from "./FindFilterSidebar";
import TutorCard from "./TutorCard";
import { searchTutors, recommendedTutors } from "../../../../api/services/tutorService";
import subjectsData from "../../home/HomePageComponent/HomePage/subjectsData";

const initialFiltersFromYou = {
  name: "",
  subjects: [],
  classes: [],
  board: [],
  availability: [],
  languages: [],
  teaching_modes: [],
  experience: "",
  budgetMin: "",
  budgetMax: "",
  location: "",
  gender: "Any",
};

export default function FindTutorShow() {
  const [filters, setFilters] = useState(initialFiltersFromYou);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usingRecommended, setUsingRecommended] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const [demoFilters, setDemoFilters] = useState(null);
  const [preloadedTutors, setPreloadedTutors] = useState([]);
  const [fromOnlineClasses, setFromOnlineClasses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have preloaded tutors from Online_Classes
    if (location.state?.preloadedTutors) {
      setPreloadedTutors(location.state.preloadedTutors);
      setTutors(location.state.preloadedTutors);
      setFromOnlineClasses(location.state.fromOnlineClasses || false);
      window.history.replaceState({}, document.title);
    } else if (location.state?.demoFilters) {
      const demoData = location.state.demoFilters;
      setDemoFilters(demoData);
      setFilters(demoData);
      runSearch(demoData);
      window.history.replaceState({}, document.title);
    } else {
      runSearch(filters);
    }
  }, [location.state]);

  const runSearch = async (f) => {
    // If we have preloaded tutors, use them instead of making API call
    if (preloadedTutors.length > 0 && fromOnlineClasses) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await searchTutors(f);
      setTutors(data);
      setUsingRecommended(false);
    } catch (e) {
      console.error("Search error:", e);
      setError(e?.response?.data?.message || e.message || "Failed to fetch tutors");
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const runRecommended = async (f) => {
    setLoading(true);
    setError("");
    try {
      const data = await recommendedTutors(f);
      setTutors(data);
      setUsingRecommended(true);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to fetch recommended tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("demoFilters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFilters(parsed);
      setDemoFilters(parsed);
      runSearch(parsed);
      localStorage.removeItem("demoFilters");
    }
  }, []);

  const onApplyFilters = (next) => {
    setFilters(next);
    setDemoFilters(null);
    
    // If we have preloaded tutors, filter them locally first
    if (preloadedTutors.length > 0 && fromOnlineClasses) {
      const filtered = filterTutorsLocally(preloadedTutors, next);
      setTutors(filtered);
    } else {
      runSearch(next);
    }
  };

  const onClearFilters = (cleared) => {
    setFilters(cleared);
    setDemoFilters(null);
    
    // If we have preloaded tutors, show all of them
    if (preloadedTutors.length > 0 && fromOnlineClasses) {
      setTutors(preloadedTutors);
    } else {
      runSearch(cleared);
    }
  };

  // Enhanced local filtering function for preloaded tutors
  const filterTutorsLocally = (tutorsList, filters) => {
    return tutorsList.filter(tutor => {
      // Filter by name
      if (filters.name && !tutor.name?.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Filter by subjects
      if (filters.subjects && filters.subjects.length > 0) {
        const tutorSubjects = Array.isArray(tutor.subjects) ? tutor.subjects : [];
        const hasMatchingSubject = filters.subjects.some(subject => 
          tutorSubjects.some(tutorSubject => 
            tutorSubject.toLowerCase().includes(subject.toLowerCase())
          )
        );
        if (!hasMatchingSubject) return false;
      }

      // Filter by classes
      if (filters.classes && filters.classes.length > 0) {
        const tutorClasses = Array.isArray(tutor.classes) ? tutor.classes : [];
        const hasMatchingClass = filters.classes.some(cls => 
          tutorClasses.some(tutorClass => 
            tutorClass.toLowerCase().includes(cls.toLowerCase())
          )
        );
        if (!hasMatchingClass) return false;
      }

      // Filter by board
      if (filters.board && filters.board.length > 0) {
        const tutorBoard = Array.isArray(tutor.board) ? tutor.board : [tutor.board].filter(Boolean);
        const hasMatchingBoard = filters.board.some(board => 
          tutorBoard.some(tutorBoardItem => 
            tutorBoardItem.toLowerCase().includes(board.toLowerCase())
          )
        );
        if (!hasMatchingBoard) return false;
      }

      // Filter by teaching modes
      if (filters.teaching_modes && filters.teaching_modes.length > 0) {
        const tutorModes = Array.isArray(tutor.teaching_modes) ? tutor.teaching_modes : [];
        const hasMatchingMode = filters.teaching_modes.some(mode => 
          tutorModes.includes(mode)
        );
        if (!hasMatchingMode) return false;
      }

      // Filter by languages
      if (filters.languages && filters.languages.length > 0) {
        const tutorLanguages = Array.isArray(tutor.languages) ? tutor.languages : [];
        const hasMatchingLanguage = filters.languages.some(language => 
          tutorLanguages.some(tutorLang => {
            if (typeof tutorLang === 'string') return tutorLang.toLowerCase().includes(language.toLowerCase());
            if (typeof tutorLang === 'object') return tutorLang.name?.toLowerCase().includes(language.toLowerCase());
            return false;
          })
        );
        if (!hasMatchingLanguage) return false;
      }

      // Filter by experience
      if (filters.experience && (tutor.experience < parseInt(filters.experience) || !tutor.experience)) {
        return false;
      }

      // Filter by budget
      const tutorPrice = parseInt(tutor.pricing_per_hour) || 0;
      if (filters.budgetMin && tutorPrice < parseInt(filters.budgetMin)) {
        return false;
      }
      if (filters.budgetMax && tutorPrice > parseInt(filters.budgetMax)) {
        return false;
      }

      // Filter by location
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        const tutorLocation = tutor.Location || {};
        const hasMatchingLocation = 
          tutorLocation.city?.toLowerCase().includes(locationLower) ||
          tutorLocation.state?.toLowerCase().includes(locationLower) ||
          tutorLocation.country?.toLowerCase().includes(locationLower) ||
          tutorLocation.address?.toLowerCase().includes(locationLower) ||
          tutor.location?.toLowerCase().includes(locationLower);
        
        if (!hasMatchingLocation) return false;
      }

      // Filter by gender
      if (filters.gender && filters.gender !== "Any") {
        if (tutor.gender !== filters.gender) {
          return false;
        }
      }

      // Filter by availability
      if (filters.availability && filters.availability.length > 0) {
        const tutorAvailability = Array.isArray(tutor.availability) ? tutor.availability : [];
        const hasMatchingAvailability = filters.availability.some(availability => 
          tutorAvailability.includes(availability)
        );
        if (!hasMatchingAvailability) return false;
      }

      return true;
    });
  };

  const handleBackToOnlineClasses = () => {
    navigate("/student-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10"> 
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Back to Online Classes button (only show when from online classes) */}
        {fromOnlineClasses && (
          <div className="mb-6">
            <button
              onClick={handleBackToOnlineClasses}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              ← Back to Available Tutors
            </button>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80">
            <FindFilterSidebar
              defaultFilters={initialFiltersFromYou}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
              subjectsData={subjectsData}
              demoData={demoFilters}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {loading ? "Loading…" : `${tutors.length} ${fromOnlineClasses ? 'Instructors' : 'Tutors'} Found`}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {fromOnlineClasses
                      ? "All available instructors matching your filters"
                      : demoFilters
                        ? "Based on your demo preferences"
                        : usingRecommended
                          ? "Based on your saved profile"
                          : "Matching your filters"
                    }
                  </p>
                </div>
                
                {/* Active Filters Summary */}
                {(filters.subjects.length > 0 || filters.classes.length > 0 || filters.teaching_modes.length > 0 || filters.location || filters.experience) && (
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500 text-right">Active filters applied</p>
                  </div>
                )}
              </div>

              {/* Active Filters Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.subjects.map(subject => (
                  <span key={subject} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                    Subject: {subject}
                  </span>
                ))}
                {filters.classes.map(cls => (
                  <span key={cls} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Class: {cls}
                  </span>
                ))}
                {filters.teaching_modes.map(mode => (
                  <span key={mode} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Mode: {mode}
                  </span>
                ))}
                {filters.location && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Location: {filters.location}
                  </span>
                )}
                {filters.experience && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Min Exp: {filters.experience} years
                  </span>
                )}
                {(filters.budgetMin || filters.budgetMax) && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Budget: ₹{filters.budgetMin || "0"}-{filters.budgetMax || "∞"}
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 mb-4">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              {!loading && tutors.length === 0 && !error && (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No {fromOnlineClasses ? 'instructors' : 'tutors'} found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {fromOnlineClasses 
                      ? "No instructors available matching your current filters" 
                      : "Try adjusting your filters or clearing some filters to see more results"
                    }
                  </p>
                  <button
                    onClick={onClearFilters}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {tutors.map((t) => (
                <TutorCard key={t.user_id || t.id} tutor={t} />
              ))}

              {loading && (
                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-3"></div>
                  <p className="text-gray-600">
                    {fromOnlineClasses ? 'Loading instructors…' : 'Fetching tutors…'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
