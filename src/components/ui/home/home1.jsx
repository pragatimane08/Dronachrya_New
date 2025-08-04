// Home.js
import React, { useState, useEffect } from 'react';
import Loader from './Loader'; // <== Add this
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import HowitWorks_tutor from './HowItWorks_tutor';
import HowitWorks_student from './HowItWorks_student';
import ExploreCategories from './ExploreCategories';
import RecentEnquiry from './RecentEnquiry';
import LookingToTeach from './LookingToTeach';
import TestimonialCard from './TestimonialCard';
import Footer from './footer';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <HeroSection />
      <HowitWorks_tutor />
      <ExploreCategories />
      <HowitWorks_student />
      <RecentEnquiry />
      <LookingToTeach />
      <TestimonialCard />
      <Footer />
    </div>
  );
};

export default Home;
