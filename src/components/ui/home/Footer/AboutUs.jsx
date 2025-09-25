import React from "react";
import { motion } from "framer-motion";
import Layout from "../layout/MainLayout";

const stats = [
  { label: "Years of Experience", value: "12+" },
  { label: "Trusted Tutors", value: "1,200+" },
  { label: "Students Helped", value: "45,000+" },
  { label: "Cities", value: "85+" },
];

const team = [
  {
    name: "Ananya Rao",
    role: "Founder & CEO",
    bio: "Education entrepreneur, former teacher and edtech builder.",
    img: "https://source.unsplash.com/collection/888146/400x400?sig=1",
  },
  {
    name: "Rohit Kulkarni",
    role: "Head of Product",
    bio: "Designing delightful learning experiences.",
    img: "https://source.unsplash.com/collection/888146/400x400?sig=2",
  },
  {
    name: "Meera Singh",
    role: "Lead Tutor",
    bio: "Math wizard who loves student success stories.",
    img: "https://source.unsplash.com/collection/888146/400x400?sig=3",
  },
];

const timeline = [
  { year: 2015, title: "Company founded", desc: "Started as a small tutoring cooperative." },
  { year: 2017, title: "First 1,000 students", desc: "Reached first milestones in student growth." },
  { year: 2020, title: "Online platform launch", desc: "Launched platform and remote classes." },
  { year: 2023, title: "Scaling up", desc: "Expanded to 50+ cities and built partnerships." },
];

function StatCard({ stat }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 flex-1 shadow-sm text-center sm:text-left">
      <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2F4380]">{stat.value}</div>
      <div className="text-xs sm:text-sm mt-1 sm:mt-2 text-slate-700">{stat.label}</div>
    </div>
  );
}

function TeamCard({ person }) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
      <img
        src={person.img}
        alt={`${person.name} photo`}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0"
      />
      <div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">{person.name}</h3>
        <p className="text-xs sm:text-sm md:text-base text-slate-600">{person.role}</p>
        <p className="mt-2 text-sm sm:text-base md:text-base text-slate-700">{person.bio}</p>
      </div>
    </article>
  );
}

export default function AboutUs() {
  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {/* PAGE HEADER */}
        <section className="bg-[#2F4380] text-white py-12 sm:py-16 md:py-20 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-3 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-[#B8C9FF] font-normal">
            Learn more about our mission, journey, and the team behind Dronachrya.
          </p>
        </section>

        {/* HERO */}
        <section className="max-w-6xl mx-auto px-4 py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight text-[#2F4380]"
              >
                We build meaningful learning experiences
              </motion.h1>
              <motion.p
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-700"
              >
                Our mission is to connect passionate tutors with curious learners across India and beyond —
                offering personalised lessons, verified profiles and measurable learning outcomes.
              </motion.p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-3 bg-[#35BAA3] text-white font-semibold shadow hover:brightness-90 transition"
                >
                  Contact Us
                </a>
                <a
                  href="#team"
                  className="inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-3 border border-[#2F4380] text-[#2F4380] font-medium hover:bg-[#B8C9FF]/30 transition"
                >
                  Meet the team
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((s) => (
                  <StatCard key={s.label} stat={s} />
                ))}
              </div>
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd"
                  alt="students learning"
                  className="w-full h-56 sm:h-64 md:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VALUES */}
        <section className="border-t py-10 sm:py-12 md:py-16 bg-[#B3EDE3]/40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2F4380]">Our mission</h2>
                <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-700">
                  To democratise high-quality tutoring and make learning flexible, affordable and outcome-focused.
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Student-first", desc: "We design every decision around measurable student progress." },
                  { title: "Trust & Safety", desc: "All tutors are verified and student feedback shapes the platform." },
                  { title: "Accessible", desc: "Hybrid learning — choose online or in-person classes." },
                  { title: "Continuous improvement", desc: "We iterate quickly using learner analytics and feedback loops." },
                ].map((val, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h3 className="font-semibold text-[#2F4380] text-sm sm:text-base md:text-lg">{val.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="py-10 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2F4380]">Meet the team</h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2">
              A small, focused group building with clarity and care.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {team.map((p) => (
                <TeamCard key={p.name} person={p} />
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-white to-[#AACBF8]/40">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2F4380]">Our journey</h2>
            <div className="mt-6 space-y-4">
              {timeline.map((t) => (
                <div
                  key={t.year}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start bg-white rounded-2xl p-4 sm:p-6 shadow-sm"
                >
                  <div className="w-full sm:w-28 flex-shrink-0 text-[#35BAA3] font-bold text-base sm:text-lg md:text-xl">
                    {t.year}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg">{t.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section id="contact" className="py-10 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2F4380]">
              Want to partner or learn with us?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2">
              Drop your email and we'll get back within 24-48 hours.
            </p>

            <form className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                aria-label="email"
                type="email"
                placeholder="your@email.com"
                className="col-span-2 rounded-full px-4 py-2 sm:py-3 text-sm sm:text-base md:text-base border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B8C9FF]"
              />
              <button
                type="submit"
                className="rounded-full px-5 sm:px-6 py-2 sm:py-3 bg-[#35BAA3] text-white text-sm sm:text-base md:text-base font-semibold hover:brightness-90 transition"
              >
                Get in touch
              </button>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 sm:py-12 md:py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2F4380]">Frequently asked questions</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: "How do I become a tutor?",
                  a: "Apply through our tutor registration — we'll verify your documents and run a short demo class.",
                },
                {
                  q: "What are class modes?",
                  a: "We support both online, offline and hybrid classes. You can filter tutors by preferred mode.",
                },
                {
                  q: "How do you ensure quality?",
                  a: "Tutor verification, student feedback and a ratings system help maintain quality.",
                },
                {
                  q: "Can I get a refund?",
                  a: "Refunds depend on the subscription and trial terms. Contact support for details.",
                },
              ].map((faq, idx) => (
                <details key={idx} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
                  <summary className="font-medium text-sm sm:text-base md:text-base">{faq.q}</summary>
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
