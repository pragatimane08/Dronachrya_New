// src/pages/Home.js
import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Layout from "../home/layout/MainLayout"; // ✅ use Layout (it has Navbar + Footer)
import HeroSection from "./HeroSection";
import HowitWorks_tutor from "./HowItWorks_tutor";
import HowitWorks_student from "./HowItWorks_student";
import ExploreCategories from "./ExploreCategories";
import RecentEnquiry from "./RecentEnquiry";
import LookingToTeach from "./LookingToTeach";
import TestimonialCard from "./TestimonialCard";

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
    <Layout>
      {/* ✅ only your page-specific sections remain here */}
      <HeroSection />
      <HowitWorks_tutor />
      <ExploreCategories />
      <HowitWorks_student />
      <RecentEnquiry />
      <LookingToTeach />
      <TestimonialCard />
    </Layout>
  );
};

export default Home;
