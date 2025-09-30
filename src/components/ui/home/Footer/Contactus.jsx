// src/pages/ContactUs.jsx
import React from "react";
import { motion } from "framer-motion";
import Layout from "../layout/MainLayout"; 

export default function ContactUs() {
    return (
        <Layout>
            <div className="bg-gradient-to-b from-slate-50 to-white text-slate-900">
                {/* PAGE HEADER */}
                <section className="bg-[#2F4380] text-white py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Contact Us
                    </h1>
                    <p className="mt-3 text-lg max-w-2xl mx-auto text-[#B8C9FF] font-normal">
                        Have questions or feedback? We're here to help!
                    </p>
                </section>


                {/* HERO
                <section className="max-w-6xl mx-auto px-4 py-12 md:py-24 text-center">
                     <h1 className="text-4xl md:text-5xl font-bold">
                        Get in touch with us
                    </h1>
                    <motion.h1
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-extrabold"
                    >
                        
                    </motion.h1>
                    <motion.p
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-4 text-slate-700 max-w-2xl mx-auto"
                    >
                        Have a question, partnership idea, or just want to say hi? We’d love
                        to hear from you. Fill out the form below or reach us directly.
                    </motion.p>
                </section> */}

                {/* CONTACT FORM */}
                <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                        <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Message
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="How can we help you?"
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="rounded-full px-6 py-3 bg-sky-700 text-white font-semibold shadow hover:bg-sky-800 transition"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold">Head Office</h3>
                            <p className="mt-2 text-slate-700 text-sm">
                                2nd Floor, Knowledge Park
                                <br />
                                Bengaluru, Karnataka, India
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold">Contact</h3>
                            <p className="mt-2 text-slate-700 text-sm">
                                Email: support@dronacharya.com <br />
                                Phone: +91 98765 43210
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold">Working Hours</h3>
                            <p className="mt-2 text-slate-700 text-sm">
                                Mon – Fri: 9:00 AM – 7:00 PM <br />
                                Sat: 10:00 AM – 4:00 PM <br />
                                Sun: Closed
                            </p>
                        </div>
                    </div>
                </section>

                {/* MAP SECTION */}
                <section className="max-w-6xl mx-auto px-4 pb-12">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-72 md:h-96">
                        <iframe
                            title="Google Maps"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.349484385417!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670a94d09af%3A0x1234567890abcdef!2sBengaluru!5e0!3m2!1sen!2sin!4v1633024800000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
