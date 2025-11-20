import React from "react";
import { motion } from "framer-motion";
import Layout from "../layout/MainLayout";

export default function AboutUs() {
  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
        {/* PAGE HEADER */}
        <section className="relative bg-gradient-to-r from-[#2F4380] to-[#1E2F6D] text-white py-16 sm:py-20 md:py-24 text-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-blue-100 font-light leading-relaxed">
              Discover our mission, vision, and commitment to excellence at Dronacharya Tutorials
            </p>
          </motion.div>
        </section>

        {/* HERO / ABOUT SECTION */}
        <section className="max-w-6xl mx-auto px-4 py-12 sm:py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#B3EDE3] rounded-full opacity-60 blur-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#2F4380] rounded-full opacity-20 blur-xl"></div>
              
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-[#2F4380] to-[#4F65B0] bg-clip-text text-transparent">
                  Dronacharya Tutorials
                </h2>
                <div className="mt-2 w-20 h-1 bg-gradient-to-r from-[#2F4380] to-[#B3EDE3] rounded-full"></div>
                
                <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
                  At <span className="font-semibold text-[#2F4380]">Dronacharya Tutorials</span>, we believe that every student has unique potential waiting to be unlocked. As a trusted home tutor service provider, we are dedicated to delivering personalized, one-on-one learning experiences that build strong academic foundations and inspire confidence.
                </p>
                <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
                  Our team of qualified and experienced tutors specializes in tailoring lessons to meet each student's individual needs, learning pace, and goals. From school-level subjects to competitive exam preparation, we ensure that students receive the right guidance, clarity, and motivation to excel.
                </p>
                <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
                  With a focus on conceptual understanding, regular practice, and result-oriented teaching, Dronacharya Tutorials stands as a reliable partner in your child's educational journey. We aim not only to improve grades but also to nurture curiosity, discipline, and a love for learning.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B3EDE3] to-[#2F4380] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2F4380]">Personalized Learning</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Our team of qualified and experienced tutors specializes in tailoring lessons to meet each student's individual needs, learning pace, and goals.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B3EDE3] to-[#2F4380] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2F4380]">Comprehensive Support</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  From school-level subjects to competitive exam preparation, we ensure students receive the right guidance, clarity, and motivation to excel.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B3EDE3] to-[#2F4380] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2F4380]">Result-Oriented Approach</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  With focus on conceptual understanding and regular practice, we aim to improve grades while nurturing curiosity and love for learning.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="relative bg-gradient-to-br from-[#2F4380]/5 via-[#B3EDE3]/20 to-[#2F4380]/10 py-16 sm:py-20 md:py-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2F4380] to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#B3EDE3] rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2F4380]">
                Our Core Values
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Guiding principles that shape our educational approach
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#2F4380] to-[#B3EDE3] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200 group-hover:scale-[1.02] transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2F4380] to-[#4F65B0] rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2F4380] mb-4">Our Mission</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    To make quality education accessible and effective through dedicated home tutoring, 
                    fostering an environment where every student can thrive and reach their full potential.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B3EDE3] to-[#2F4380] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200 group-hover:scale-[1.02] transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B3EDE3] to-[#2F4380] rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2F4380] mb-4">Our Vision</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    To empower students with knowledge, skills, and confidence to achieve academic 
                    and personal success, creating lifelong learners who can navigate any challenge.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
