import React, { useState, useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import profileImg from "../../../assets/img/review.png";
import profileImg1 from "../../../assets/img/review1.png";
import profileImg2 from "../../../assets/img/review3.png";

const testimonials = [
  {
    name: "Manish Raina",
    role: "Tutor",
    image: profileImg,
    text: "I've noticed that students enjoy your class discussions, although not all take part.",
    rating: 3,
  },
  {
    name: "Neha Sharma",
    role: "Student",
    image: profileImg2,
    text: "This platform helped me find the best tutor for my needs. Super helpful and friendly.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Student",
    image: profileImg1,
    text: "I'm really impressed with the support and communication from tutors here.",
    rating: 4,
  },
];

const TestimonialCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-12 mt-[10px] bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="p-6 md:p-12">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              What Our Client Say
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mt-1">
              about US ?
            </h2>
            <div className="mt-3 w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Profile Image */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-40 h-40 object-cover rounded-xl border shadow-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {testimonial.name}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {testimonial.role}
                </p>
              </div>
            </div>

            {/* Quote & Rating */}
            <div className="w-full md:w-2/3">
              <div className="flex items-start gap-3">
                <FaQuoteLeft className="text-blue-500 text-xl mt-1" />
                <p className="text-base md:text-lg text-gray-700 italic">
                  {testimonial.text}
                </p>
              </div>

              {/* Stars */}
              <div className="flex mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hover:text-blue-600 transition"
        >
          <MdArrowBackIos />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hover:text-blue-600 transition"
        >
          <MdArrowForwardIos />
        </button>
      </div>
    </section>
  );
};

export default TestimonialCard;
