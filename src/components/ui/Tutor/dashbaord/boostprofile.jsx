import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoostProfile = () => {
  const navigate = useNavigate();

  const handleBoostClick = () => {
    navigate('/tutor-profile'); // Replace '/boost' with your actual route
  };

  return (
    <div className="bg-[#e9edff] p-4 md:p-6 rounded-xl mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">


          
          {/* Heading with text-2xl (large heading) */}
          <strong className="block text-2xl font-semibold">
            Get More Students!
          </strong>
          {/* Subheading with text-base (name size) */}
          <p className="mt-1 text-base text-gray-700">
            Boost your profile to appear at the top of search results
          </p>
        </div>
        <button
          onClick={handleBoostClick}
          className="
            bg-[#37d6ae]
            text-white
            rounded-xl
            py-2 px-5
            whitespace-nowrap
            hover:bg-[#2bb997]
            transition-colors
            text-sm md:text-base
            cursor-pointer
          "
        >
          Boost Profile Now
        </button>
      </div>
    </div>
  );
};

export default BoostProfile;
