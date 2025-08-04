import React from 'react';

const FeatureCard = ({ icon, title, description, bgColor }) => {
  return (
    <div className="flex flex-col items-start gap-4 p-6 border border-gray-200 rounded-xl shadow-sm bg-white 
      transition-all duration-300 transform hover:scale-105 hover:border-gray-400 w-full max-w-sm cursor-pointer">
      
      <div className={`p-2 rounded-md ${bgColor}`}>
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
