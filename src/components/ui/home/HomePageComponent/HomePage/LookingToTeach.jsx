import React from "react";
import { useNavigate } from "react-router-dom";
import Tutor from "../../../../../assets/img/teacher2.jpg"; 

const LookingToTeach = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Pass the current section as reference
    navigate("/tutorreg", { state: { fromLookingToTeach: true } });
  };

  return (
    <section id="looking-to-teach" className="bg-blue-100 rounded-xl py-10 px-4 sm:px-6 lg:px-8 mx-4 my-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Looking to Teach?
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-6">
            Join Dronachrya and connect with more than 55 Lakh students on the
            platform. Create a strong profile and grow your network.
          </p>
          <button
            onClick={handleClick}
            style={{ backgroundColor: "#35BAA3" }}
            className="hover:brightness-90 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Get Started Now
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={Tutor}
            alt="Teaching"
            className="rounded-md shadow-md w-full max-w-sm h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default LookingToTeach;
