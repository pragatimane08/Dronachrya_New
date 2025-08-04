import React from 'react';
import FeatureCard from './FeatureCard';
import { AcademicCapIcon, MagnifyingGlassIcon, BoltIcon } from '@heroicons/react/24/outline';

const FeatureCardData= () => {
  return (
    <div className="min-h-50 bg-gray-50 flex items-center justify-center p-15">
      <div className="flex flex-wrap gap-6 justify-center">
        <FeatureCard
          icon={<AcademicCapIcon className="h-6 w-6 text-[#35BAA3]" />}
          title="Verified Tutors"
          description="All our tutors go through a strict verification process to ensure quality teaching standards."
          bgColor="bg-[#E6FAF4]"
        />
        <FeatureCard
          icon={<MagnifyingGlassIcon className="h-6 w-6 text-[#8B5CF6]" />}
          title="Easy Search"
          description="Find the perfect tutor based on subject, class, location, and other preferences with our advanced search."
          bgColor="bg-[#F1EBFF]"
        />
        <FeatureCard
          icon={<BoltIcon className="h-6 w-6 text-[#6366F1]" />}
          title="Quick Connect"
          description="Connect with tutors directly through our platform and start your learning journey immediately."
          bgColor="bg-[#EEF2FF]"
        />
      </div>
    </div>
  );
};

export default FeatureCardData;
