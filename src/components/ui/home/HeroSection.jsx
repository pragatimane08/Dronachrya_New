// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import bgImage from "../../../assets/img/background.jpeg";
// import subjectsData from "./subjectsData";

// const HeroSection = () => {
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [error, setError] = useState("");
//   const [classDropdownOpen, setClassDropdownOpen] = useState(false);
//   const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

//   const classDropdownRef = useRef(null);
//   const subjectDropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const availableClasses = subjectsData.map((item) => item.class);
//   const availableSubjects =
//     subjectsData.find((item) => item.class === selectedClass)?.subjects || [];

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
//         setClassDropdownOpen(false);
//       }
//       if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
//         setSubjectDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleClassSelect = (cls) => {
//     setSelectedClass(cls);
//     setSelectedSubject("");
//     setError("");
//     setClassDropdownOpen(false);
//   };

//   const handleSubjectSelect = (subject) => {
//     setSelectedSubject(subject);
//     setError("");
//     setSubjectDropdownOpen(false);
//   };

//   const handleBookDemo = () => {
//     if (!selectedClass || !selectedSubject) {
//       setError("Please select both class and subject before booking a demo.");
//       return;
//     }
//     setError("");
//     navigate("/book-demo", {
//       state: { class: selectedClass, subject: selectedSubject },
//     });
//   };

//   return (
//     <section
//       className="relative bg-cover bg-center bg-no-repeat text-white min-h-screen flex items-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-blue-900/80"></div>

//       {/* Content wrapper - Adjusted padding to position form higher */}
//       <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
//             Expert Tutoring, Tailored to Your Child's Success
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 leading-relaxed">
//             One-on-one lessons with qualified tutors — at your home or online.
//             Personalized support for all subjects, all grades.
//           </p>

//           {/* Selection Container with more space below */}
//           <div className="mb-16">
//             {/* Compact Selection Bar */}
//             <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row items-stretch overflow-visible max-w-3xl mx-auto">
//               {/* Class Dropdown */}
//               <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200" ref={classDropdownRef}>
//                 <button
//                   onClick={() => {
//                     setClassDropdownOpen(!classDropdownOpen);
//                     setSubjectDropdownOpen(false);
//                   }}
//                   className="w-full p-4 text-gray-700 text-base bg-white focus:outline-none cursor-pointer rounded-t-lg md:rounded-t-none md:rounded-l-lg text-left flex items-center justify-between"
//                 >
//                   <span className={selectedClass ? "text-gray-700" : "text-gray-500"}>
//                     {selectedClass || "Select Class/Course"}
//                   </span>
//                   <svg 
//                     className={`h-4 w-4 transition-transform duration-200 ${classDropdownOpen ? 'rotate-180' : ''}`} 
//                     fill="currentColor" 
//                     viewBox="0 0 20 20"
//                   >
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
                
//                 {/* Class Dropdown Menu */}
//                 {classDropdownOpen && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
//                     {availableClasses.map((cls, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleClassSelect(cls)}
//                         className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
//                       >
//                         {cls}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Subject Dropdown */}
//               <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200" ref={subjectDropdownRef}>
//                 <button
//                   onClick={() => {
//                     if (selectedClass) {
//                       setSubjectDropdownOpen(!subjectDropdownOpen);
//                       setClassDropdownOpen(false);
//                     }
//                   }}
//                   disabled={!selectedClass}
//                   className="w-full p-4 text-gray-700 text-base bg-white focus:outline-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-left flex items-center justify-between"
//                 >
//                   <span className={selectedSubject ? "text-gray-700" : "text-gray-500"}>
//                     {selectedSubject || "Select Subject"}
//                   </span>
//                   <svg 
//                     className={`h-4 w-4 transition-transform duration-200 ${subjectDropdownOpen ? 'rotate-180' : ''}`} 
//                     fill="currentColor" 
//                     viewBox="0 0 20 20"
//                   >
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
                
//                 {/* Subject Dropdown Menu */}
//                 {subjectDropdownOpen && selectedClass && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
//                     {availableSubjects.map((subj, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleSubjectSelect(subj)}
//                         className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
//                       >
//                         {subj}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Book Demo Button */}
//               <button
//                 onClick={handleBookDemo}
//                 className="px-6 py-4 text-white text-base font-semibold transition-all bg-[#564FC6] hover:bg-[#453bb5] rounded-b-lg md:rounded-b-none md:rounded-r-lg"
//               >
//                 Book Demo
//               </button>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded-md max-w-3xl mx-auto">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <p>{error}</p>
//                 </div>
//               </div>
//             )}

//             {/* Success indicator */}
//             {selectedClass && selectedSubject && !error && (
//               <div className="flex items-center justify-center text-green-500 text-sm mt-4 max-w-3xl mx-auto">
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 13l4 4L19 7"
//                   ></path>
//                 </svg>
//                 <span>Great! You're ready to book your demo.</span>
//               </div>
//             )}
//           </div>

//           {/* Info text */}
//           <p className="text-gray-300 max-w-md mx-auto">
//             Select your class and subject to book a free demo session with one
//             of our expert tutors.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../assets/img/background.jpeg";
import subjectsData from "./subjectsData";

const HeroSection = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const classDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);
  const navigate = useNavigate();

  const availableClasses = subjectsData.map((item) => item.class);
  const availableSubjects =
    subjectsData.find((item) => item.class === selectedClass)?.subjects || [];

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
    <section
      className="relative bg-cover bg-center bg-no-repeat text-white min-h-screen flex items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900/80"></div>

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Expert Tutoring, Tailored to Your Child's Success
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 leading-relaxed">
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
                >
                  <span
                    className={
                      selectedClass ? "text-gray-700" : "text-gray-500"
                    }
                  >
                    {selectedClass || "Select Class/Course"}
                  </span>
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
                </button>

                {/* Class Dropdown Menu */}
                {classDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {availableClasses.map((cls, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleClassSelect(cls)}
                        className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject Dropdown (only appears after class is chosen) */}
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
                      {availableSubjects.map((subj, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSubjectSelect(subj)}
                          className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        >
                          {subj}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Book Demo Button (always active-looking) */}
              <button
                onClick={handleBookDemo}
                className="px-6 py-4 text-white text-base font-semibold transition-all bg-[#564FC6] hover:bg-[#453bb5] rounded-b-lg md:rounded-b-none md:rounded-r-lg"
              >
                Book Demo
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

            {/* Success indicator */}
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
                <span>Great! You're ready to book your demo.</span>
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
