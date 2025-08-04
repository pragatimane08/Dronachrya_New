import React from "react";

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Create Account",
      text: "Sign up as a student or tutor.",
      color: "bg-[#35BAA3]",
    },
    {
      step: 2,
      title: "Complete Profile",
      text: "Fill your preferences and qualifications.",
      color: "bg-[#564FC6]",
    },
    {
      step: 3,
      title: "Choose Plan",
      text: "Pick a subscription plan.",
      color: "bg-[#2F4380]",
    },
    {
      step: 4,
      title: "Connect",
      text: "Start connecting with tutors or students.",
      color: "bg-[#35BAA3]",
    },
  ];

  return (
    <section className="w-full bg-white py-10 px-4 mb-20 mt-[10px]">
      <div className="bg-gray-100 p-10 shadow-lg rounded-xl max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It Works For Tutor
          </h2>
          <p className="text-base md:text-lg text-gray-600 mt-2">
            Getting started with Dronacharya is simple and straightforward.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {steps.map(({ step, title, text, color }) => (
            <div
              key={step}
              className="bg-white rounded-xl p-6 min-h-[180px] shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300"
            >
              <div
                className={`${color} text-white w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-3`}
              >
                {step}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-1">
                {title}
              </h3>
              <p className="text-sm md:text-base text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
