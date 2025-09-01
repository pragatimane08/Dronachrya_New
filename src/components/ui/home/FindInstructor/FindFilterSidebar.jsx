import React, { useState } from "react";

const SidebarFilters = ({ onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    name: "",
    budgetMin: "",
    budgetMax: "",
    language: "Any",
    gender: "",
    location: "",
    sortBy: "Relevance",
    moreFilter: "",
    experience: "",
    education: "",
  });

  // ✅ Added state for toggle
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Handle input changes
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply Filters
  const handleApply = () => {
    onApplyFilters(filters);
  };

  // Clear Filters
  const handleClear = () => {
    const cleared = {
      name: "",
      budgetMin: "",
      budgetMax: "",
      language: "Any",
      gender: "",
      location: "",
      sortBy: "Relevance",
      moreFilter: "",
      experience: "",
      education: "",
    };
    setFilters(cleared);
    onClearFilters();
  };

  return (
    <div className="w-full md:w-72 bg-white shadow-lg p-5 rounded-2xl sticky top-6 h-fit">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-teal-600"
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
        Filters
      </h2>

      {/* Name Search */}
      <div className="mb-5">
        <label className="text-sm font-medium block mb-2 text-gray-700">
          Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Search tutor..."
            className="pl-10 w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>
      </div>

      {/* Budget */}
      <div className="mb-5">
        <label className="text-sm font-medium block mb-2 text-gray-700">
          Budget (₹/hr)
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={filters.budgetMin}
            onChange={(e) => handleChange("budgetMin", e.target.value)}
            placeholder="Min"
            className="flex-1 w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
          <input
            type="number"
            value={filters.budgetMax}
            onChange={(e) => handleChange("budgetMax", e.target.value)}
            placeholder="Max"
            className="flex-1 w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>
      </div>
{/* Language */}
<div className="mb-5">
  <label className="text-sm font-medium block mb-2 text-gray-700">
    Language
  </label>
  <div className="relative">
    <select
      value={filters.language}
      onChange={(e) => handleChange("language", e.target.value)}
      className="w-full border rounded-xl p-3 text-sm appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
    >
      <option>Any</option>
      <option>English</option>
      <option>Hindi</option>
      <option>Arabic</option>
      <option>Bengali</option>
      <option>Punjabi</option>
      <option>German</option>
      <option>Telugu</option>
      <option>Korean</option>
      <option>French</option>
      <option>Marathi</option>
      <option>Tamil</option>
      <option>Urdu</option>
      <option>Gujarati</option>
      <option>Kannada</option>
      <option>Malayalam</option>
      <option>Oriya</option>
      <option>Bhojpuri</option>
      <option>Assamese</option>
      <option>Konkani</option>
      <option>Sanskrit</option>
    </select>
  </div>
</div>

      {/* Gender */}
      <div className="mb-5">
        <label className="text-sm font-medium block mb-2 text-gray-700">
          Gender
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["Male", "Female","Any"].map((g) => (
            <button
              key={g}
              onClick={() => handleChange("gender", g)}
              className={`py-2 text-sm rounded-xl border transition-all ${
                filters.gender === g
                  ? "bg-teal-500 text-white border-teal-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-5">
        <label className="text-sm font-medium block mb-2 text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Enter city..."
          className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
        />
      </div>
{/* Sort By */}
<div className="mb-5">
  <label className="text-sm font-medium block mb-2 text-gray-700">
    Sort By
  </label>
  <div className="relative">
    <select
      value={filters.sortBy}
      onChange={(e) => handleChange("sortBy", e.target.value)}
      className="w-full border rounded-xl p-3 text-sm appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
    >
      <option value="Relevance">Relevance</option>
      <option value="Experience">Experience</option>
      <option value="Student Ratings">Student Ratings</option>
      <option value="Price Low - High">Price Low - High</option>
      <option value="Price High - Low">Price High - Low</option>
    </select>
  </div>
</div>


      {/* More Filters */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2 text-gray-700">
          More Filters
        </label>
        <button
          type="button"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="w-full border rounded-xl p-3 text-sm flex justify-between items-center focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
        >
          {filters.moreFilter ? filters.moreFilter : "Select"}
          <svg
            className={`h-5 w-5 transform transition ${
              showMoreFilters ? "rotate-180" : "rotate-0"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {showMoreFilters && (
          <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg p-4 z-10">
            {/* Experience */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                Minimum Experience in Teaching
              </p>
              <div className="flex flex-wrap gap-2">
                {["1 yr", "3 yr", "5 yr", "7 yr", "10 yr", "15 yr"].map(
                  (exp) => (
                    <button
                      key={exp}
                      onClick={() => handleChange("experience", exp)}
                      className={`px-3 py-1 rounded-lg border text-sm ${
                        filters.experience === exp
                          ? "bg-teal-500 text-white border-teal-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {exp}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <p className="text-sm font-medium mb-2">
                Minimum Education Level
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Pursuing Graduation",
                  "Graduate",
                  "Post Graduate",
                  "Doctorate",
                  "Any",
                ].map((edu) => (
                  <button
                    key={edu}
                    onClick={() => handleChange("education", edu)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      filters.education === edu
                        ? "bg-teal-500 text-white border-teal-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {edu}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleApply}
          className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-all"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SidebarFilters;