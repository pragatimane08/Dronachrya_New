import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook
import bgImage from "../../../assets/img/background.jpeg";
import subjectsData from "./subjectsData";

const HeroSection = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // ✅ initialize navigate

  const allSubjects = subjectsData.flatMap((item) => item.tuition);

  const filteredSubjects = allSubjects.filter((subject) =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-blue-900/80"></div>

      <div className="relative z-0 flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Expert Tutoring, Tailored to Your Child's Success
        </h1>
        <p className="text-sm md:text-lg mb-8 max-w-3xl text-center text-gray-200">
          One-on-one lessons with qualified tutors — at your home or online.
          Personalized support for all subjects, all grades.
        </p>

        {/* Subject Dropdown + Button */}
        <div className="w-full max-w-2xl flex items-stretch justify-center">
          <div className="relative flex-1">
            <Listbox value={selectedSubject} onChange={setSelectedSubject}>
              <div className="relative">
                <Listbox.Button className="w-full p-3 text-left text-gray-700 text-sm md:text-base bg-white font-medium rounded-l-md rounded-r-none shadow-none focus:outline-none h-[42px] md:h-[46px] flex items-center">
                  {selectedSubject || "Search or Select Subject"}
                  <ChevronDownIcon className="w-5 h-5 ml-auto text-gray-500" />
                </Listbox.Button>

                <Listbox.Options className="absolute top-full mt-1 w-full bg-white text-gray-700 shadow-md rounded-md z-50 max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white z-10 p-2 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <svg
                        className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject, index) => (
                      <Listbox.Option
                        key={index}
                        value={subject}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 text-left text-sm ${
                            active ? "bg-teal-100" : ""
                          }`
                        }
                      >
                        {subject}
                      </Listbox.Option>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No subjects found.
                    </div>
                  )}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* ✅ Book Demo button with navigation */}
          <button
            className="bg-[#564FC6] text-white px-6 py-2 text-sm md:text-base font-semibold rounded-r-md rounded-l-none hover:bg-[#453bb5] transition h-[42px] md:h-[46px] flex items-center justify-center whitespace-nowrap"
            onClick={() => navigate("/book-demo")} // ✅ redirect
          >
            Book a Free Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
