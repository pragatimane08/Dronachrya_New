
import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { apiClient } from "../../../../../../api/apiclient";
import LocationSearch from "../../../../../common/LocationSearch";

const EnquiryFilterSidebar = ({
  filters,
  onApplyFilters,
  onClearFilters,
  isOpen,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [budgetError, setBudgetError] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classSearch, setClassSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [locationError, setLocationError] = useState("");

  const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
  const MODE_OPTIONS = ["Online", "Offline", "Both"];

  // Define custom order for categories
  const categoryOrder = [
    "School Tuition",
    "Pre-Primary",
    "Primary School (1-5)",
    "Secondary School (6-10)",
    "Higher Secondary - Science (11-12)",
    "Higher Secondary - Commerce (11-12)",
    "Higher Secondary - Arts (11-12)",
    "Engineering - Computer Science",
    "Engineering - Mechanical",
    "Engineering - Electrical",
    "Engineering - Civil",
    "Medical - MBBS",
    "Medical - BDS",
    "Medical - Nursing",
    "Commerce - B.Com",
    "Management - MBA",
    "Arts - English Literature",
    "Law - LLB",
    "IT Certifications",
    "Programming Languages",
    "Web Technologies",
    "Database Technologies",
    "Cloud & DevOps",
    "Foreign Languages",
    "Indian Languages",
    "Competitive Exams - Engineering",
    "Competitive Exams - Medical",
    "Competitive Exams - Management",
    "Government Exams",
    "Vocational Courses",
    "Soft Skills"
  ];

  // Fetch classes from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/subjects");
        setClasses(response.data.classes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleInArray = (key, value) => {
    setLocalFilters((f) => {
      const arr = new Set(f[key] || []);
      arr.has(value) ? arr.delete(value) : arr.add(value);
      return { ...f, [key]: Array.from(arr) };
    });
  };

  const setField = (key, value) => {
    setLocalFilters((f) => ({ ...f, [key]: value }));
  };

  const handleClassSelect = (className) => {
    // Toggle class selection
    toggleInArray("class", className);
    // Clear subjects when class changes
    setField("subjects", []);
    setSubjectSearch("");
  };

  const handleBudgetChange = (type, value) => {
    const numValue = value === "" ? "" : parseInt(value);

    if (type === "hourly_charges_min") {
      if (numValue !== "" && numValue < 100) {
        setBudgetError("Minimum budget must be at least ₹100");
      } else {
        setBudgetError("");
      }
      setField("hourly_charges_min", numValue);
    } else {
      setField("hourly_charges_max", numValue);
    }
  };

  const handleLocationSelect = (locationData) => {
    if (locationData) {
      setLocationError("");
      // Store the location object with city, state, country details
      setField("location", locationData);
    } else {
      setField("location", "");
    }
  };

  const handleApply = () => {
    // Validate minimum budget
    if (localFilters.hourly_charges_min && localFilters.hourly_charges_min < 100) {
      setBudgetError("Minimum budget must be at least ₹100");
      return;
    }

    // Validate max is greater than min if both are provided
    if (localFilters.hourly_charges_min && localFilters.hourly_charges_max) {
      if (localFilters.hourly_charges_max < localFilters.hourly_charges_min) {
        setBudgetError("Maximum budget must be greater than minimum budget");
        return;
      }
    }

    setBudgetError("");
    onApplyFilters(localFilters);
    onClose(); // Close sidebar on apply for mobile
  };

  const handleClear = () => {
    const clearedFilters = {
      name: "",
      subjects: [],
      class: [],
      board: [],
      class_modes: [],
      location: "",
      hourly_charges_min: "",
      hourly_charges_max: "",
    };
    setLocalFilters(clearedFilters);
    setBudgetError("");
    setLocationError("");
    setClassSearch("");
    setSubjectSearch("");
    onClearFilters(clearedFilters);
  };

  // Group classes by category
  const groupedClasses = classes.reduce((acc, cls) => {
    const category = cls.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(cls);
    return acc;
  }, {});

  // Sort grouped classes according to custom order
  const sortedCategories = categoryOrder.filter(cat => groupedClasses[cat]);

  // Filter classes based on search
  const filteredGroupedClasses = sortedCategories.reduce((acc, category) => {
    const filteredClasses = groupedClasses[category].filter(cls =>
      cls.name?.toLowerCase().includes(classSearch.toLowerCase())
    );
    if (filteredClasses.length > 0) {
      acc[category] = filteredClasses;
    }
    return acc;
  }, {});

  // Get available subjects for selected classes
  const getAvailableSubjects = () => {
    const allSubjects = new Set();
    classes.forEach(cls => {
      if (localFilters.class?.includes(cls.name) && cls.subjects) {
        cls.subjects.forEach(subj => {
          if (subj.name) allSubjects.add(subj.name);
        });
      }
    });
    return Array.from(allSubjects).sort();
  };

  const availableSubjects = getAvailableSubjects();

  // Filter subjects based on search
  const filteredSubjects = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const DropdownSection = ({ title, isOpen, toggleOpen, children, searchValue, onSearchChange, searchPlaceholder }) => (
    <div className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800">{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="bg-white">
          {/* Search Input */}
          {onSearchChange && (
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'fixed inset-0' : 'hidden'} 
        lg:block lg:sticky lg:top-4 
        w-full lg:w-64 
        h-full lg:h-auto 
        bg-white z-50 lg:z-auto 
        overflow-y-auto 
        lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-4">
          {/* Name Search */}
          <div>
            <label className="text-sm font-medium block mb-2 text-gray-700">Student Name</label>
            <input
              type="text"
              value={localFilters.name || ""}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Search by name..."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
            />
          </div>

          {/* Location Search with Google Maps */}
          <div>
            <label className="text-sm font-medium block mb-2 text-gray-700">Location</label>
            <LocationSearch
              onSelect={handleLocationSelect}
              value={typeof localFilters.location === 'string' ? localFilters.location : localFilters.location?.name || ""}
              placeholder="Enter city or postal code..."
              hasError={!!locationError}
              allowedCountries={["IN"]} // Restrict to India only
            />
            {locationError && (
              <p className="text-red-500 text-xs mt-1">{locationError}</p>
            )}
          </div>

          {/* Budget Range - Stacked Layout */}
          <div>
            <label className="text-sm font-medium block mb-2 text-gray-700">Budget Range (₹/hr)</label>
            <div className="space-y-2">
              <div>
                <input
                  type="number"
                  min="100"
                  value={localFilters.hourly_charges_min || ""}
                  onChange={(e) => handleBudgetChange("hourly_charges_min", e.target.value)}
                  placeholder="Minimum price (₹100 minimum)"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: ₹100</p>
              </div>
              <input
                type="number"
                min={localFilters.hourly_charges_min || "0"}
                value={localFilters.hourly_charges_max || ""}
                onChange={(e) => handleBudgetChange("hourly_charges_max", e.target.value)}
                placeholder="Maximum price (optional)"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#35BAA3] focus:border-transparent"
              />
            </div>
            {budgetError && (
              <p className="text-red-500 text-xs mt-2">{budgetError}</p>
            )}
          </div>

          {/* Class with Search and Categories */}
          <DropdownSection
            title="Class/Grade"
            isOpen={activeDropdown === "class"}
            toggleOpen={() => toggleDropdown("class")}
            searchValue={classSearch}
            onSearchChange={setClassSearch}
            searchPlaceholder="Search classes..."
          >
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#35BAA3] border-t-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">Loading classes...</p>
              </div>
            ) : Object.keys(filteredGroupedClasses).length > 0 ? (
              <div>
                {Object.entries(filteredGroupedClasses).map(([category, categoryClasses]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-semibold uppercase tracking-wide border-b border-gray-200 sticky top-0">
                      {category}
                    </div>
                    {/* Class Items */}
                    {categoryClasses.map((cls) => (
                      <label key={cls.id} className="flex items-center gap-2 text-sm p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={localFilters.class?.includes(cls.name) || false}
                          onChange={() => handleClassSelect(cls.name)}
                          className="rounded text-[#35BAA3] focus:ring-[#35BAA3]"
                        />
                        {cls.name}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                {classSearch ? "No classes found" : "No classes available"}
              </p>
            )}
          </DropdownSection>

          {/* Subjects with Search (only shown when classes are selected) */}
          {localFilters.class && localFilters.class.length > 0 && (
            <DropdownSection
              title="Subjects"
              isOpen={activeDropdown === "subjects"}
              toggleOpen={() => toggleDropdown("subjects")}
              searchValue={subjectSearch}
              onSearchChange={setSubjectSearch}
              searchPlaceholder="Search subjects..."
            >
              {filteredSubjects.length > 0 ? (
                <div className="space-y-2 p-3">
                  {filteredSubjects.map((subject) => (
                    <label key={subject} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters.subjects?.includes(subject) || false}
                        onChange={() => toggleInArray("subjects", subject)}
                        className="rounded text-[#35BAA3] focus:ring-[#35BAA3]"
                      />
                      {subject}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  {subjectSearch ? "No subjects found" : "No subjects available for selected classes"}
                </p>
              )}
            </DropdownSection>
          )}

          {/* Educational Board */}
          <DropdownSection
            title="Educational Board"
            isOpen={activeDropdown === "board"}
            toggleOpen={() => toggleDropdown("board")}
          >
            <div className="space-y-2 p-3">
              {BOARD_OPTIONS.map((board) => (
                <label key={board} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localFilters.board?.includes(board) || false}
                    onChange={() => toggleInArray("board", board)}
                    className="rounded text-[#35BAA3] focus:ring-[#35BAA3]"
                  />
                  {board}
                </label>
              ))}
            </div>
          </DropdownSection>

          {/* Class Modes */}
          <DropdownSection
            title="Class Mode"
            isOpen={activeDropdown === "class_modes"}
            toggleOpen={() => toggleDropdown("class_modes")}
          >
            <div className="space-y-2 p-3">
              {MODE_OPTIONS.map((mode) => (
                <label key={mode} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localFilters.class_modes?.includes(mode) || false}
                    onChange={() => toggleInArray("class_modes", mode)}
                    className="rounded text-[#35BAA3] focus:ring-[#35BAA3]"
                  />
                  {mode}
                </label>
              ))}
            </div>
          </DropdownSection>

          {/* Action Buttons - Stacked Layout */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={!!budgetError}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${budgetError
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#35BAA3] text-white hover:bg-[#2da892]"
                }`}
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default EnquiryFilterSidebar;
