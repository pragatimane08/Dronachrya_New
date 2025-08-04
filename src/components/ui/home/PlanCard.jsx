import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const PlanCard = ({ name, price, features, color, highlight, period }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onClick={() => setIsClicked(!isClicked)}
      className={`w-full max-w-md rounded-2xl border bg-white shadow-sm overflow-hidden cursor-pointer transition-all duration-300 relative
        ${isClicked ? 'border-[#35BAA3] scale-105' : 'border-gray-200'}
        hover:scale-105 hover:border-[#35BAA3]`}
    >
      {/* Ribbon for Highlighted Plan */}
{highlight && (
  <div className="absolute top-2 -right-12 w-40 transform rotate-45 bg-[#35BAA3] text-white text-xs font-bold text-center py-1 shadow-md z-10">
    POPULAR
  </div>
)}


      {/* Header */}
      <div className="bg-gray-50 px-6 py-6">
        <h3 className="text-center text-xl font-semibold text-gray-900">{name} Plan</h3>
        <p className="text-center text-5xl font-bold text-black mt-2">
          ₹{price}
          <span className="text-base font-medium text-gray-500">{period}</span>
        </p>
      </div>

      {/* Horizontal line */}
      <div className="border-t border-gray-200" />

      {/* Features */}
      <div className="px-6 pt-6 pb-7">
        <ul className="space-y-4 text-sm text-gray-900 font-medium">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-[#35BAA3]" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Button */}
        <button
          className="mt-8 w-full text-white text-sm font-medium py-3 rounded-lg transition hover:brightness-95"
          style={{ backgroundColor: color }}
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
