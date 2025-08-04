// 
import React, { useState } from "react";
import LocationSearch from "./LocationSearch";
import { X } from "lucide-react";

const FilterSidebar = ({ onApply }) => {
  const [filters, setFilters] = useState({
    location: null,
    type: "",
    subjects: [],
    class: "",
  });

  const classTypes = ["Online Classes", "Offline Classes"];

  const applyFilters = () => {
    const applied = {
      location: filters.location?.city || null,
      type: filters.type,
      subjects: filters.subjects,
      class: filters.class,
    };
    onApply(applied);
  };

  const resetFilters = () => {
    setFilters({
      location: null,
      type: "",
      subjects: [],
      class: "",
    });
    onApply({});
  };

  return (
    <div className="w-full max-w-full sm:max-w-[280px] mx-auto bg-white rounded-xl shadow border px-4 py-5 sm:px-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-700 text-center sm:text-left">Filter Students</h2>

      {/* Subjects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
        <input
          type="text"
          value={filters.subjects.join(", ")}
          onChange={(e) =>
            setFilters({
              ...filters,
              subjects: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="e.g. Maths, Physics"
          className="w-full border px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Class */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
        <input
          type="text"
          value={filters.class}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
          placeholder="e.g. 8th"
          className="w-full border px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Class Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
        <div className="space-y-1">
          {classTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="classType"
                value={type}
                checked={filters.type === type}
                onChange={() => setFilters({ ...filters, type })}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <LocationSearch
          value={filters.location?.name}
          onSelect={(loc) => setFilters((prev) => ({ ...prev, location: loc }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <X className="w-4 h-4" />
          Clear all
        </button>
        <button
          onClick={applyFilters}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
