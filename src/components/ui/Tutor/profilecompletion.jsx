import React from 'react';

const ProfileCompletion = () => {
  const completion = 75;

  return (
    <div className="bg-[#e9edff] p-3 sm:p-4 rounded-xl mb-4 sm:mb-6">
      {/* Mobile: stacked & centered; Desktop: side-by-side */}
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center mb-2 text-center sm:text-left gap-1 sm:gap-0">
        <strong className="text-xl sm:text-2xl font-semibold">
          Complete your profile to get more students
        </strong>
        <span className="text-sm sm:text-base font-medium">
          {completion}% Complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 sm:h-3 bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-[#99a7ff]"
          style={{ width: `${completion}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
