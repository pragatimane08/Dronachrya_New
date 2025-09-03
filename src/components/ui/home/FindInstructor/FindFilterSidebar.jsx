import React, { useEffect, useState } from "react";
import LocationSearch from "./LocationSearch";

const SUBJECT_OPTIONS = ["Maths", "Science", "English", "Physics", "Chemistry"];
const CLASS_OPTIONS = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"];
const MODE_OPTIONS = ["Online", "Offline"];
const GENDER_OPTIONS = ["Any", "Male", "Female", "Other"];

const chipCls = (active) =>
  `px-3 py-1 rounded-lg border text-sm transition-colors ${active ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`;

const DropdownSection = ({ title, isOpen, toggleOpen, children }) => (
  <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
    <button
      type="button"
      onClick={toggleOpen}
      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <span className="text-sm font-medium text-gray-800">{title}</span>
      <svg
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && <div className="p-4 bg-white">{children}</div>}
  </div>
);

export default function FindFilterSidebar({ defaultFilters, onApplyFilters, onClearFilters, subjectsData, demoData }) {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...(demoData || {})
  });

  // Add a useEffect to update filters when demoData changes
  useEffect(() => {
    if (demoData) {
      setFilters(prev => ({ ...prev, ...demoData }));
    }
  }, [demoData]);

  const [subjectInput, setSubjectInput] = useState("");
  const [classInput, setClassInput] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    if (defaultFilters) setFilters((f) => ({ ...f, ...defaultFilters }));
  }, [defaultFilters]);

  useEffect(() => {
    // Filter classes based on selected category
    if (selectedCategory) {
      const classes = [...new Set(subjectsData
        .filter(item => item.category === selectedCategory)
        .map(item => item.class)
      )];
      setFilteredClasses(classes);
    } else {
      setFilteredClasses([...new Set(subjectsData.map(item => item.class))]);
    }
  }, [selectedCategory, subjectsData]);

  const toggleInArray = (key, value) => {
    setFilters((f) => {
      const arr = new Set(f[key] || []);
      arr.has(value) ? arr.delete(value) : arr.add(value);
      return { ...f, [key]: Array.from(arr) };
    });
  };

  const setField = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const addSubject = () => {
    if (subjectInput && !filters.subjects.includes(subjectInput)) {
      setFilters((f) => ({ ...f, subjects: [...f.subjects, subjectInput] }));
    }
    setSubjectInput("");
  };

  const addClass = () => {
    if (classInput && !filters.classes.includes(classInput)) {
      setFilters((f) => ({ ...f, classes: [...f.classes, classInput] }));
    }
    setClassInput("");
  };

  const apply = () => {
    setError("");
    onApplyFilters?.(filters);
  };

  const clear = () => {
    const cleared = {
      name: "",
      subjects: [],
      classes: [],
      board: [],
      availability: [],
      languages: [],
      teaching_modes: [],
      experience: "",
      budgetMin: 100,
      budgetMax: "",
      location: "",
      gender: "Any",
    };
    setFilters(cleared);
    onClearFilters?.(cleared);
  };

  const getSubjectsForClass = (className) => {
    const classData = subjectsData.find(item => item.class === className);
    return classData ? classData.subjects : [];
  };

  const handleClassSelect = (classItem) => {
    toggleInArray("classes", classItem);
    const subjectsForClass = getSubjectsForClass(classItem);
    if (subjectsForClass.length > 0) {
      setFilters((f) => {
        const newSubjects = [...new Set([...f.subjects, ...subjectsForClass.slice(0, 2)])];
        return { ...f, subjects: newSubjects };
      });
    }
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-5 h-fit sticky top-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <button
          onClick={clear}
          className="text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          Clear All
        </button>
      </div>

      {demoData && (
        <div className="bg-teal-50 border border-teal-200 text-teal-700 px-3 py-2 rounded-lg mb-4 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Showing tutors based on your demo preferences</span>
          </div>
        </div>
      )}

      <div className="space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
        {/* Name */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-700">Tutor Name</label>
          <input
            type="text"
            value={filters.name || ""}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Search by name..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-700">Location</label>
          <LocationSearch
            value={filters.location || ""}
            onSelect={(place) => {
              setFilters((f) => ({
                ...f,
                location: place.city || place.name,
                place_id: place.place_id
              }));
            }}
          />
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-700">Budget (₹/hr)</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                min={100}
                value={filters.budgetMin || ""}
                onChange={(e) => setField("budgetMin", e.target.value)}
                placeholder="Min (≥100)"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={filters.budgetMax || ""}
                onChange={(e) => setField("budgetMax", e.target.value)}
                placeholder="Max"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-700">Gender Preference</label>
          <select
            value={filters.gender || "Any"}
            onChange={(e) => setField("gender", e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-700">Min Experience (years)</label>
          <input
            type="number"
            min={0}
            value={filters.experience || ""}
            onChange={(e) => setField("experience", e.target.value)}
            placeholder="e.g., 3"
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Classes dropdown */}
        <DropdownSection
          title="Classes"
          isOpen={activeDropdown === 'classes'}
          toggleOpen={() => toggleDropdown('classes')}
        >
          <div className="mb-3">
            <label className="text-xs font-medium block mb-2 text-gray-600">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value="">All Categories</option>
              {[...new Set(subjectsData.map(item => item.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {filters.classes && filters.classes.map((c) => (
              <span key={c} className={chipCls(true)}>
                {c}
                <button
                  onClick={() => toggleInArray("classes", c)}
                  className="ml-1 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {filteredClasses.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.classes && filters.classes.includes(c)}
                  onChange={() => handleClassSelect(c)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                {c}
              </label>
            ))}
          </div>
        </DropdownSection>

        {/* Subjects dropdown */}
        <DropdownSection
          title="Subjects"
          isOpen={activeDropdown === 'subjects'}
          toggleOpen={() => toggleDropdown('subjects')}
        >
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Type subject..."
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addSubject()}
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {filters.subjects && filters.subjects.map((s) => (
              <span key={s} className={chipCls(true)}>
                {s}
                <button
                  onClick={() => toggleInArray("subjects", s)}
                  className="ml-1 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {SUBJECT_OPTIONS.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.subjects && filters.subjects.includes(s)}
                  onChange={() => toggleInArray("subjects", s)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                {s}
              </label>
            ))}
          </div>
        </DropdownSection>

        {/* Board dropdown */}
        <DropdownSection
          title="Education Board"
          isOpen={activeDropdown === 'board'}
          toggleOpen={() => toggleDropdown('board')}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {filters.board && filters.board.map((b) => (
              <span key={b} className={chipCls(true)}>
                {b}
                <button
                  onClick={() => toggleInArray("board", b)}
                  className="ml-1 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {BOARD_OPTIONS.map((b) => (
              <label key={b} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.board && filters.board.includes(b)}
                  onChange={() => toggleInArray("board", b)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                {b}
              </label>
            ))}
          </div>
        </DropdownSection>

        {/* Languages dropdown */}
        <DropdownSection
          title="Languages"
          isOpen={activeDropdown === 'languages'}
          toggleOpen={() => toggleDropdown('languages')}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {filters.languages && filters.languages.map((l) => (
              <span key={l} className={chipCls(true)}>
                {l}
                <button
                  onClick={() => toggleInArray("languages", l)}
                  className="ml-1 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {LANGUAGE_OPTIONS.map((l) => (
              <label key={l} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.languages && filters.languages.includes(l)}
                  onChange={() => toggleInArray("languages", l)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                {l}
              </label>
            ))}
          </div>
        </DropdownSection>

        {/* Teaching modes dropdown */}
        <DropdownSection
          title="Teaching Mode"
          isOpen={activeDropdown === 'teaching_modes'}
          toggleOpen={() => toggleDropdown('teaching_modes')}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {filters.teaching_modes && filters.teaching_modes.map((m) => (
              <span key={m} className={chipCls(true)}>
                {m}
                <button
                  onClick={() => toggleInArray("teaching_modes", m)}
                  className="ml-1 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {MODE_OPTIONS.map((m) => (
              <label key={m} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.teaching_modes && filters.teaching_modes.includes(m)}
                  onChange={() => toggleInArray("teaching_modes", m)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                {m}
              </label>
            ))}
          </div>
        </DropdownSection>

        {error && <p className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded-lg">{error}</p>}

        {/* Apply Button */}
        <button
          onClick={apply}
          className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}