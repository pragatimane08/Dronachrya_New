// src/components/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-md flex items-center cursor-pointer hover:bg-[#E6FAF7] hover:text-[#35BAA3] transition"
      >
        {label}
        <ChevronDownIcon className="h-4 w-4 ml-1" />
      </div>

      {open && (
        <ul className="absolute top-full mt-2 w-44 bg-white border shadow-md rounded-md text-left z-10 text-sm md:text-base">
          {items.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setOpen(false);
                if (item.onClick) item.onClick();
                else if (item.path) navigate(item.path);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
