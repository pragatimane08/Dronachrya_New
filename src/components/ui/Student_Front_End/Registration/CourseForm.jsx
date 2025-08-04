import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseOption = ({ label, selected, onSelect }) => {
  return (
    <label className="flex justify-between items-center py-2 cursor-pointer text-gray-800">
      <span className="text-base md:text-lg">{label}</span>
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="w-5 h-5 accent-teal-600"
      />
    </label>
  );
};

const CourseForm = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const courseOptions = [
    'IIT JEE Advanced Coaching',
    'IIT JEE Crash Course',
    'IIT JEE Foundation Course',
    'IIT JEE Mains Coaching',
    'IIT JEE Integrated Coaching',
  ];

  const handleSelect = (label) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((item) => item !== label)
        : [...prevSelected, label]
    );
  };

  const handleNext = () => {
    if (selectedCourses.length > 0) {
      toast.success(`Selected: ${selectedCourses.join(', ')}`, {
        position: 'top-right',
      });
    } else {
      toast.error('No courses selected', {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mx-auto">
      <ToastContainer />
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        For which of the following exams do you need a tutor?
      </h2>

      <div className="space-y-2">
        {courseOptions.map((course) => (
          <CourseOption
            key={course}
            label={course}
            selected={selectedCourses.includes(course)}
            onSelect={() => handleSelect(course)}
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          className="bg-blue-600 text-white text-base md:text-lg px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseForm;
