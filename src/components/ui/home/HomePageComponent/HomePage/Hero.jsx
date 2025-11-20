import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      offset: 500,
      duration: 500,
      easing: "ease-in-sine",
    });
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-[#1F3A93] via-[#4B38EF] to-[#35BAA3] text-white">
      <div
        className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-10"
        data-aos="zoom-in"
      >
        {/* Left Section */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Find The Perfect Tutor <br /> For Your Learning Journey
          </h1>
          <p className="mb-6 text-lg text-gray-100">
            Connect with qualified tutors who can help you excel <br />
            in your studies, or join as a tutor to share your <br /> knowledge
            and grow your teaching business.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-[#1F3A93] font-semibold px-5 py-2 rounded-md hover:bg-[#35BAA3]">
              I'm a Student
            </button>
            <button className="bg-white text-[#1F3A93] font-semibold px-5 py-2 rounded-md hover:bg-[#35BAA3]">
              I'm a Tutor
            </button>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <h1 className="text-lg font-semibold mb-4">Find a Tutor Now</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="subject" className="block mb-1 font-normal">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                placeholder="Select Subject"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
              />
            </div>

            <div>
              <label htmlFor="class" className="block mb-1 font-normal">
                Class/Grade
              </label>
              <input
                type="text"
                id="class"
                placeholder="Select Class"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
              />
            </div>

            <div>
              <label htmlFor="location" className="block mb-1 font-normal">
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter your city"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#35BAA3]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#35BAA3] text-white font-semibold py-2 rounded hover:bg-[#2aa289] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1011.5 3a7.5 7.5 0 005.15 13.65z"
                />
              </svg>
              Search Tutors
            </button>
          </form>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 text-white"
        >
          <path
            d="M0,0V46.29c47.37,22,103.3,29.69,158,17C230.5,44.25,284,11.62,339,6.32c48.18-4.5,95.52,14.22,143,26.41s98.29,18.6,147,1.34c48.94-17.43,95.6-52.59,144-57.53,52.49-5.41,104.51,20.34,157,35.62V0Z"
            fill="#fff"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
