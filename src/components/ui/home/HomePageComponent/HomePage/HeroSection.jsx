
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../../../../../assets/img/her_video.mp4";
import { apiClient } from "../../../../../api/apiclient";

const HeroSection = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const classDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch classes from API on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/subjects");
        setClasses(response.data.classes || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

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

  // Get available subjects for the selected class
  const availableSubjects =
    classes.find((cls) => cls.name === selectedClass)?.subjects || [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target)
      ) {
        setClassDropdownOpen(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target)
      ) {
        setSubjectDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSelectedSubject("");
    setError("");
    setClassDropdownOpen(false);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setError("");
    setSubjectDropdownOpen(false);
  };

  const handleBookDemo = () => {
    if (!selectedClass || !selectedSubject) {
      setError("Please select both class and subject before booking a demo.");
      return;
    }
    setError("");
    navigate("/book-demo", {
      state: { class: selectedClass, subject: selectedSubject },
    });
  };

  return (
    <section className="relative text-white min-h-screen flex items-center overflow-hidden">
      {/* Background Video (blurred) */}
      <video
        className="absolute inset-0 w-full h-full object-cover blur-[2px] brightness-98"
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            Expert Tutoring, Tailored to Your Child&apos;s Success
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 leading-relaxed drop-shadow-md">
            One-on-one lessons with qualified tutors — at your home or online.
            Personalized support for all subjects, all grades.
          </p>

          {/* Selection Container */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row items-stretch overflow-visible max-w-3xl mx-auto">
              {/* Class Dropdown */}
              <div
                className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200"
                ref={classDropdownRef}
              >
                <button
                  onClick={() => {
                    setClassDropdownOpen(!classDropdownOpen);
                    setSubjectDropdownOpen(false);
                  }}
                  className="w-full p-4 text-gray-700 text-base bg-white focus:outline-none cursor-pointer rounded-t-lg md:rounded-t-none md:rounded-l-lg text-left flex items-center justify-between"
                  disabled={loading}
                >
                  <span
                    className={
                      selectedClass ? "text-gray-700" : "text-gray-500"
                    }
                  >
                    {loading
                      ? "Loading classes..."
                      : selectedClass || "Select Class/Course"}
                  </span>
                  {!loading && (
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${
                        classDropdownOpen ? "rotate-180" : ""
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
                  )}
                </button>

                {/* Class Dropdown Menu with Categories */}
                {classDropdownOpen && !loading && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {sortedCategories.map((category) => (
                      <div key={category}>
                        {/* Category Header */}
                        <div className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-semibold uppercase tracking-wide border-b border-gray-200 sticky top-0">
                          {category}
                        </div>
                        {/* Class Items */}
                        {groupedClasses[category].map((cls) => (
                          <button
                            key={cls.id}
                            onClick={() => handleClassSelect(cls.name)}
                            className="w-full p-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                          >
                            {cls.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject Dropdown */}
              {selectedClass && (
                <div
                  className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200"
                  ref={subjectDropdownRef}
                >
                  <button
                    onClick={() => {
                      setSubjectDropdownOpen(!subjectDropdownOpen);
                      setClassDropdownOpen(false);
                    }}
                    className="w-full p-4 text-gray-700 text-base bg-white focus:outline-none cursor-pointer text-left flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedSubject ? "text-gray-700" : "text-gray-500"
                      }
                    >
                      {selectedSubject || "Select Subject"}
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${
                        subjectDropdownOpen ? "rotate-180" : ""
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

                  {/* Subject Dropdown Menu */}
                  {subjectDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {availableSubjects.map((subj) => (
                        <button
                          key={subj.id}
                          onClick={() => handleSubjectSelect(subj.name)}
                          className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        >
                          {subj.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Book Demo Button */}
              <button
                onClick={handleBookDemo}
                className="px-6 py-4 text-white text-base font-semibold transition-all bg-[#564FC6] hover:bg-[#453bb5] rounded-b-lg md:rounded-b-none md:rounded-r-lg"
              >
                Book a Free Demo
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded-md max-w-3xl mx-auto">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Success Indicator */}
            {selectedClass && selectedSubject && !error && (
              <div className="flex items-center justify-center text-green-500 text-sm mt-4 max-w-3xl mx-auto">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Great! You&apos;re ready to book your demo.</span>
              </div>
            )}
          </div>

          {/* Info text */}
          <p className="text-gray-300 max-w-md mx-auto">
            Select your class and subject to book a free demo session with one
            of our expert tutors.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
