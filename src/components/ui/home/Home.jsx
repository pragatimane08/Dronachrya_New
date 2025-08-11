import React from 'react';
import FeatureCardData from './FeatureCardData';
import PlanData from './PlanData';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
const Home = () => {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <Hero />
      {/* Why Choose Us */}
      <section
        id="find-tutors-section"
        className="py-20 bg-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Why Choose Dronacharya?</h2>
          <p className="text-gray-600 mt-2 text-sm">
            We connect students with qualified tutors for the best learning <br /> experience.
          </p>
        </div>
        <FeatureCardData />
      </section>

      <section className="bg-gray-50 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-gray-600 mt-2">
            Getting started with Dronacharya is simple and straightforward.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 text-center">
          {[
            { step: 1, title: 'Create Account', text: 'Sign up as a student or tutor.', color: 'bg-[#35BAA3]' },
            { step: 2, title: 'Complete Profile', text: 'Fill your preferences and qualifications.', color: 'bg-[#564FC6]' },
            { step: 3, title: 'Choose Plan', text: 'Pick a subscription plan.', color: 'bg-[#2F4380]' },
            { step: 4, title: 'Connect', text: 'Start connecting with tutors or students.', color: 'bg-[#35BAA3]' },
          ].map(({ step, title, text, color }) => (
            <div
              key={step}
              className="bg-white rounded-lg p-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg duration-300"
            >
              <div
                className={`${color} text-white w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-4`}
              >
                {step}
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Subscription Plans */}
      <section className="py-16 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Subscription Plans</h2>
          <p className="text-gray-600 mt-2">Choose the perfect plan that suits your needs and budget.</p>
        </div>
        <PlanData />
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-white text-black border border-gray-300 rounded-md font-semibold hover:bg-purple-600 hover:text-white transition duration-200">
            View All Plans
          </button>


        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-600 to-teal-400 py-20 text-center text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg mb-8">
            Register now and connect with the best tutors in your area, or join as a tutor to grow your teaching business.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
              <FaUserGraduate className="text-xl" />
              Join as Student
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#35BAA3] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#2ea38f] transition">
              <FaChalkboardTeacher className="text-xl" />
              Join as Tutor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;