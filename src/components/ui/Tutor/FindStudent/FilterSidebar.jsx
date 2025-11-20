

import React, { useState, useCallback } from "react";
import LocationSearch from "./LocationSearch";
import { X, Search } from "lucide-react";

const FilterSidebar = ({ onApply, isOpen, onClose, isMobile }) => {
  const [filters, setFilters] = useState({
    location: null,
    type: "",
    subjects: [],
    class: "",
    board: "",
    availability: [],
    languages: [],
    tutor_gender_preference: "",
    hourly_charges_min: 100,
    hourly_charges_max: "",
    class_modes: [],
    school_name: "",
    name: "",
  });

  const [languageSearch, setLanguageSearch] = useState("");

  const availabilityOptions = ["Weekdays", "Weekends"];
  const languageOptions = [
    "English",
    "Hindi",
    "Marathi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
  ];
  const boardOptions = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"];
  const genderPreferenceOptions = ["Any", "Male", "Female"];
  const classModeOptions = ["Online", "Offline"];

  const applyFilters = useCallback(() => {
    const applied = {
      location: filters.location?.city || null,
      type: filters.type,
      subjects: filters.subjects,
      class: filters.class,
      board: filters.board,
      availability: filters.availability,
      languages: filters.languages,
      tutor_gender_preference: filters.tutor_gender_preference,
      hourly_charges_min: filters.hourly_charges_min,
      hourly_charges_max: filters.hourly_charges_max,
      class_modes: filters.class_modes,
      school_name: filters.school_name,
      name: filters.name,
    };
    onApply(applied);
    if (isMobile) {
      onClose();
    }
  }, [filters, onApply, isMobile, onClose]);

  const resetFilters = useCallback(() => {
    setFilters({
      location: null,
      type: "",
      subjects: [],
      class: "",
      board: "",
      availability: [],
      languages: [],
      tutor_gender_preference: "",
      hourly_charges_min: 100,
      hourly_charges_max: "",
      class_modes: [],
      school_name: "",
      name: "",
    });
    setLanguageSearch("");
    onApply({});
  }, [onApply]);

  const toggleArrayFilter = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter((item) => item !== value)
        : [...prev[filterName], value],
    }));
  }, []);

  const clearLanguages = useCallback(() => {
    setFilters((prev) => ({ ...prev, languages: [] }));
    setLanguageSearch("");
  }, []);

  const filteredLanguages = languageOptions.filter((lang) =>
    lang.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Mobile overlay and sidebar styles
  const sidebarClass = isMobile
    ? `fixed top-16 left-0 bottom-0 z-50 w-full max-w-[320px] transform transition-transform duration-300 ease-in-out bg-white ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`
    : "relative w-full max-w-full lg:max-w-[340px] h-[calc(100vh-4rem)]";

  const overlayClass =
    isMobile && isOpen
      ? "fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"
      : "hidden";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className={overlayClass} onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarClass} bg-white rounded-xl shadow border border-gray-200 flex flex-col`}
      >
        {/* Fixed Heading with Close Button */}
        <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl flex-shrink-0 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Filter Students</h2>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Name Search */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              placeholder="Search by student name"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div> */}

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects
            </label>
            <input
              type="text"
              value={filters.subjects.join(", ")}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  subjects: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
              placeholder="e.g. Maths, Physics, Chemistry"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Separate multiple subjects with commas
            </p>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class/Grade
            </label>
            <input
              type="text"
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              placeholder="e.g. 8th, 9th, 10th"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Board */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Board
            </label>
            <select
              value={filters.board}
              onChange={(e) => setFilters({ ...filters, board: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Any Board</option>
              {boardOptions.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {availabilityOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(option)}
                    onChange={() => toggleArrayFilter("availability", option)}
                    className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Languages
            </label>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={languageSearch}
                onChange={(e) => setLanguageSearch(e.target.value)}
                placeholder="Search languages..."
                className="w-full border border-gray-300 pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <label
                    key={language}
                    className="flex items-center space-x-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(language)}
                      onChange={() =>
                        toggleArrayFilter("languages", language)
                      }
                      className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
                    />
                    <span className="text-gray-700">{language}</span>
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No matches found
                </p>
              )}
            </div>
            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={clearLanguages}
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 text-xs px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Tutor Gender Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tutor Gender Preference
            </label>
            <select
              value={filters.tutor_gender_preference}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tutor_gender_preference: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {genderPreferenceOptions.map((option) => (
                <option key={option} value={option === "Any" ? "" : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Hourly Charges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Charges (₹)
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.hourly_charges_min}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      hourly_charges_min: Math.max(100, Number(e.target.value)),
                    })
                  }
                  placeholder="Min (100+)"
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min="100"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.hourly_charges_max}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      hourly_charges_max: Math.max(100, Number(e.target.value)),
                    })
                  }
                  placeholder="Max"
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min="100"
                />
              </div>
            </div>
          </div>

          {/* Class Modes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Class Modes
            </label>
            <div className="space-y-2 border border-gray-300 rounded-lg p-3">
              {classModeOptions.map((mode) => (
                <label
                  key={mode}
                  className="flex items-center space-x-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.class_modes.includes(mode)}
                    onChange={() => toggleArrayFilter("class_modes", mode)}
                    className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* School Name */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name
            </label>
            <input
              type="text"
              value={filters.school_name}
              onChange={(e) =>
                setFilters({ ...filters, school_name: e.target.value })
              }
              placeholder="Search by school name"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div> */}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <LocationSearch
              value={filters.location?.name}
              onSelect={(loc) =>
                setFilters((prev) => ({ ...prev, location: loc }))
              }
            />
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="border-t border-gray-200 bg-white p-4 flex flex-col gap-3 flex-shrink-0">
          <button
            onClick={applyFilters}
            className="w-full bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium shadow-sm"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
