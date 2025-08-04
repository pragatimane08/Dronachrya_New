import React from "react";
import Reading from '../../../assets/img/reading.png';
import Notification from '../../../assets/img/notification.png'; 
import Compare from '../../../assets/img/equal.png';

const steps = [
  {
    title: "Post Free Requirement",
    image: Reading,
  },
  {
    title: "Instant Responses",
    image: Notification,
  },
  {
    title: "Compare, Hire and Learn",
    image: Compare,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-15 px-6 bg-white mt-[15px]">
      <div className="text-center space-y-3">
        {/* Subheading */}
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          How It Works For Student
        </h3>

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Get a Perfect Online Tutor within 30 Minutes
        </h2>
      </div>

      {/* Steps */}
      <div className="mt-14 flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 md:gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-gray-50 shadow-md rounded-xl w-full md:w-[280px] lg:w-[300px] min-h-[240px] transition-transform hover:scale-105"
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-24 h-24 mb-6"
            />
            <p className="text-base md:text-lg font-medium text-gray-800 text-center">
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
