import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, GraduationCap, BookOpen } from "lucide-react";
import profileImg from "../../../../../assets/img/Testminonal/Haridarshan.jpg";
import profileImg1 from "../../../../../assets/img/Testminonal/Dushyant.jpg";
import profileImg2 from "../../../../../assets/img/Testminonal/Saurabh.jpg";
import profileImg3 from "../../../../../assets/img/Testminonal/Sayema.jpg";
import profileImg4 from "../../../../../assets/img/Testminonal/Supriya.jpg";

const testimonials = [
  {
    name: "Sayema Ahmed",
    role: "Class 12 Student",
    image: profileImg3,
    text: "I struggled significantly with English grammar and literature comprehension until I discovered this incredible learning platform. My tutor designed personalized sessions that were not only interactive but also deeply engaging, incorporating multimedia resources and real-time feedback. Through consistent practice and targeted exercises, I've dramatically improved my writing structure, vocabulary, and speaking confidence. The progress tracking feature helped me visualize my improvement week by week.",
    rating: 5,
    type: "student"
  },
  {
    name: "Haridarshan Mishra",
    role: "Physics Teacher",
    image: profileImg,
    text: "Teaching advanced Physics concepts on this platform has been an exceptionally rewarding experience. The comprehensive suite of educational tools for scheduling, session recording, and student performance analytics makes conducting both theoretical and practical Physics sessions remarkably seamless and professional. I can easily share complex diagrams, mathematical equations, and interactive simulations that bring abstract concepts to life for my students.",
    rating: 5,
    type: "teacher"
  },
  {
    name: "Dushyant Yadav",
    role: "NEET UG Student",
    image: profileImg1,
    text: "This innovative learning platform has completely transformed my NEET preparation journey. I can access specialized medical tutors from across the country, attempt customized mock tests that adapt to my learning pace, meticulously track my performance across all subjects, and clear doubts instantly through the integrated communication features. The organized study planner and revision reminders ensure I stay on track with the vast syllabus while focusing on my weaker areas systematically.",
    rating: 5,
    type: "student"
  },
  {
    name: "Saurabh Bharti",
    role: "Biology Teacher",
    image: profileImg2,
    text: "Through this dynamic educational platform, I've connected with numerous dedicated and curious students who share a genuine passion for biological sciences. The intuitive interface, combined with advanced digital whiteboards and multimedia integration, allows me to focus entirely on delivering complex concepts like genetic inheritance, human physiology, and ecological systems with exceptional clarity. The ability to share 3D models and microscopic images has made my sessions particularly impactful and memorable.",
    rating: 5,
    type: "teacher"
  },
  {
    name: "Supriya Sharma",
    role: "Social Science Teacher",
    image: profileImg4,
    text: "This platform provides me with an extraordinary opportunity to transform Social Studies into a captivating and interactive learning experience for students across different age groups. By incorporating rich visual timelines, historical documentaries, interactive maps, gamified quizzes, and concept-based explanatory videos, I can make subjects like History, Geography, and Civics come alive. The discussion forums and collaborative projects enable students to develop critical thinking and analytical skills while exploring diverse perspectives.",
    rating: 5,
    type: "teacher"
  }
];

const TestimonialCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('next');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-16 mt-2 bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 rounded-full mb-4">
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            What Our Clients Say
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Us
          </h2>
          <div className="mt-4 w-24 h-1.5 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
            <div className="grid lg:grid-cols-3 gap-0">
              {/* Left Section - Profile */}
              <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-purple-50 p-8 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full opacity-20 -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  {/* Profile Image with Badge */}
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="relative w-44 h-44 object-cover rounded-2xl border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Icon Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 p-3.5 rounded-xl shadow-lg">
                      {testimonial.type === 'student' ? (
                        <GraduationCap className="w-6 h-6 text-white" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-base text-blue-600 font-medium">
                      {testimonial.role}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="flex gap-1 justify-center pt-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>

                    {/* Type Badge */}
                    <div className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
                      testimonial.type === 'student' 
                        ? 'bg-blue-200 text-blue-700'
                        : 'bg-purple-200 text-purple-700'
                    }`}>
                      {testimonial.type === 'student' ? '🎓 Student' : '👨‍🏫 Educator'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Quote */}
              <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center bg-white relative">
                {/* Large Quote Icon */}
                <Quote className="w-16 h-16 text-blue-200 mb-6" />
                
                {/* Testimonial Text */}
                <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                  {testimonial.text}
                </blockquote>

                {/* Decorative Line */}
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

                {/* Decorative Corner Element */}
                <div className="absolute bottom-8 right-8 w-24 h-24 border-4 border-blue-100 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white hover:bg-blue-50 p-4 rounded-full shadow-xl border-2 border-blue-100 transition-all duration-300 hover:scale-110 z-10 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white hover:bg-blue-50 p-4 rounded-full shadow-xl border-2 border-blue-100 transition-all duration-300 hover:scale-110 z-10 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      
      </div>
    </section>
  );
};

export default TestimonialCard;