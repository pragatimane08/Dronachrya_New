import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import LocationSearch from "./LocationSearch";

const SUBJECT_OPTIONS = ["Maths", "Science", "English", "Physics", "Chemistry"];
const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu"];
const MODE_OPTIONS = ["Online", "Offline"];
const GENDER_OPTIONS = ["Any", "Male", "Female", "Other"];

const DropdownSection = ({ title, isOpen, toggleOpen, children }) => (
  <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
    <button
      type="button"
      onClick={toggleOpen}
      className="w-full flex justify-between items-center p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
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
    {isOpen && <div className="p-2 sm:p-3 bg-white">{children}</div>}
  </div>
);

export default function FindFilterSidebar({
  defaultFilters,
  onApplyFilters,
  onClearFilters,
  subjectsData,
  demoData,
}) {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...(demoData || {}),
  });

  const [subjectInput, setSubjectInput] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (demoData) {
      setFilters((prev) => ({ ...prev, ...demoData }));
    }
  }, [demoData]);

  useEffect(() => {
    if (selectedCategory) {
      const classes = [
        ...new Set(
          subjectsData
            .filter((item) => item.category === selectedCategory)
            .map((item) => item.class)
        ),
      ];
      setFilteredClasses(classes);
    } else {
      setFilteredClasses([...new Set(subjectsData.map((item) => item.class))]);
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

  const apply = () => {
    setError("");
    onApplyFilters?.(filters);
    setMobileOpen(false);
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

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden flex justify-end mb-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium"
        >
          <FaFilter className="inline mr-2" /> Filters
        </button>
      </div>

      {/* Sidebar (desktop) */}
      <div className="hidden sm:block w-full bg-white rounded-2xl shadow-md p-5 h-fit sticky top-5">
        <SidebarContent
          filters={filters}
          setField={setField}
          toggleInArray={toggleInArray}
          clear={clear}
          apply={apply}
          error={error}
          subjectInput={subjectInput}
          setSubjectInput={setSubjectInput}
          addSubject={addSubject}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredClasses={filteredClasses}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          demoData={demoData}
        />
      </div>

      {/* Drawer (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
          <div className="bg-white w-full sm:w-96 p-4 h-full overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-600 hover:text-gray-900 text-lg"
              >
                ✕
              </button>
            </div>
            <SidebarContent
              filters={filters}
              setField={setField}
              toggleInArray={toggleInArray}
              clear={clear}
              apply={apply}
              error={error}
              subjectInput={subjectInput}
              setSubjectInput={setSubjectInput}
              addSubject={addSubject}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              filteredClasses={filteredClasses}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              demoData={demoData}
            />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  filters,
  setField,
  toggleInArray,
  clear,
  apply,
  error,
  subjectInput,
  setSubjectInput,
  addSubject,
  selectedCategory,
  setSelectedCategory,
  filteredClasses,
  activeDropdown,
  toggleDropdown,
  demoData,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Filters</h2>
        <button
          onClick={clear}
          className="text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          Clear All
        </button>
      </div>

      {demoData && (
        <div className="bg-teal-50 border border-teal-200 text-teal-700 px-3 py-2 rounded-lg mb-4 text-sm">
          Showing tutors based on your demo preferences
        </div>
      )}

      {/* Scrollable Section */}
      <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
        {/* Name */}
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700">Tutor Name</label>
          <input
            type="text"
            value={filters.name || ""}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Search by name..."
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700">Location</label>
          <LocationSearch
            value={filters.location || ""}
            onSelect={(place) => setField("location", place.city || place.name)}
          />
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700">Budget (₹/hr)</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              min={100}
              value={filters.budgetMin || ""}
              onChange={(e) => setField("budgetMin", e.target.value)}
              placeholder="Min (≥100)"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              value={filters.budgetMax || ""}
              onChange={(e) => setField("budgetMax", e.target.value)}
              placeholder="Max"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700">Gender Preference</label>
          <select
            value={filters.gender || "Any"}
            onChange={(e) => setField("gender", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700">
            Min Experience (years)
          </label>
          <input
            type="number"
            min={0}
            value={filters.experience || ""}
            onChange={(e) => setField("experience", e.target.value)}
            placeholder="e.g., 3"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Classes */}
        <DropdownSection
          title="Classes"
          isOpen={activeDropdown === "classes"}
          toggleOpen={() => toggleDropdown("classes")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {filteredClasses.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={filters.classes && filters.classes.includes(c)}
                  onChange={() => toggleInArray("classes", c)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                {c}
              </label>
            ))}
          </div>
        </DropdownSection>

        {/* Subjects */}
        <DropdownSection
          title="Subjects"
          isOpen={activeDropdown === "subjects"}
          toggleOpen={() => toggleDropdown("subjects")}
        >
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Type subject..."
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
              onKeyPress={(e) => e.key === "Enter" && addSubject()}
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {SUBJECT_OPTIONS.map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50"
              >
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

        {/* Board */}
        <DropdownSection
          title="Education Board"
          isOpen={activeDropdown === "board"}
          toggleOpen={() => toggleDropdown("board")}
        >
          {BOARD_OPTIONS.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={filters.board && filters.board.includes(b)}
                onChange={() => toggleInArray("board", b)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              {b}
            </label>
          ))}
        </DropdownSection>

        {/* Languages */}
        <DropdownSection
          title="Languages"
          isOpen={activeDropdown === "languages"}
          toggleOpen={() => toggleDropdown("languages")}
        >
          {LANGUAGE_OPTIONS.map((l) => (
            <label
              key={l}
              className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={filters.languages && filters.languages.includes(l)}
                onChange={() => toggleInArray("languages", l)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              {l}
            </label>
          ))}
        </DropdownSection>

        {/* Modes */}
        <DropdownSection
          title="Teaching Mode"
          isOpen={activeDropdown === "teaching_modes"}
          toggleOpen={() => toggleDropdown("teaching_modes")}
        >
          {MODE_OPTIONS.map((m) => (
            <label
              key={m}
              className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={filters.teaching_modes && filters.teaching_modes.includes(m)}
                onChange={() => toggleInArray("teaching_modes", m)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              {m}
            </label>
          ))}
        </DropdownSection>

        {error && (
          <p className="text-red-600 text-sm mb-2 p-2 bg-red-50 rounded-lg">{error}</p>
        )}

        <button
          onClick={apply}
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
