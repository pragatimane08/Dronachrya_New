// src/pages/ContactUs.jsx
import React, { useState } from "react";
import Layout from "../layout/MainLayout";
import { apiClient } from "../../../../api/apiclient"; // Import your API client

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: "", type: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const showPopup = (message, type) => {
        setPopup({ show: true, message, type });
        setTimeout(() => {
            setPopup({ show: false, message: "", type: "" });
        }, 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await apiClient.post("/contact", formData);

            if (response.status === 200 || response.status === 201) {
                showPopup("Your message has been sent successfully!", "success");
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                showPopup(response.data?.message || "Failed to send your message.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showPopup(
                error.response?.data?.message || 
                "An error occurred while sending your message.", 
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="bg-gradient-to-b from-slate-50 to-white text-slate-900 min-h-screen">
                {/* PAGE HEADER - Responsive */}
                <section className="bg-[#2F4380] text-white py-12 md:py-16 lg:py-20 text-center px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                            Contact Us
                        </h1>
                        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-[#B8C9FF] font-normal">
                            Have questions or feedback? We're here to help!
                        </p>
                    </div>
                </section>

                {/* CONTACT FORM & INFO - Responsive Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {/* Form Section */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 lg:p-10">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
                                Send us a message
                            </h2>
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Your phone number"
                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="How can we help you?"
                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors resize-vertical"
                                        required
                                    ></textarea>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full rounded-full px-6 py-3 sm:py-4 bg-sky-700 text-white font-semibold text-sm sm:text-base shadow transition-all duration-200 ${
                                        isSubmitting 
                                            ? "opacity-70 cursor-not-allowed" 
                                            : "hover:bg-sky-800 hover:shadow-md transform hover:-translate-y-0.5"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <i className="fas fa-spinner fa-spin mr-2 sm:mr-3"></i>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info Section */}
                        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                            {/* Head Office */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-map-marker-alt text-sky-600 text-sm sm:text-base"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                                            Head Office
                                        </h3>
                                        <p className="mt-2 text-slate-700 text-sm sm:text-base leading-relaxed">
                                            109, Manas Square, Sugamau Road, Indira Nagar<br />
                                            Lucknow, Uttar Pradesh 226016<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-envelope text-sky-600 text-sm sm:text-base"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                                            Contact
                                        </h3>
                                        <p className="mt-2 text-slate-700 text-sm sm:text-base leading-relaxed">
                                            Email: care@dronacharyatutorials.com
                                            <br />
                                            Phone: +91 98765 43210
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-clock text-sky-600 text-sm sm:text-base"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                                            Working Hours
                                        </h3>
                                        <p className="mt-2 text-slate-700 text-sm sm:text-base leading-relaxed">
                                            Mon – Fri: 9:00 AM – 7:00 PM <br />
                                            Sat: 10:00 AM – 4:00 PM <br />
                                            Sun: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-share-alt text-sky-600 text-sm sm:text-base"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                                            Follow Us
                                        </h3>
                                        <div className="flex space-x-3 sm:space-x-4">
                                            <a
                                                href="https://www.facebook.com/DronacharyaTutorialsindia"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Facebook"
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sky-50 transition-all duration-200 transform hover:scale-110"
                                            >
                                                <i className="fab fa-facebook-f text-gray-600 hover:text-[#1877F2] text-base sm:text-lg" />
                                            </a>
                                            <a
                                                href="https://www.instagram.com/dronacharyatutorialsindia"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Instagram"
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sky-50 transition-all duration-200 transform hover:scale-110"
                                            >
                                                <i className="fab fa-instagram text-gray-600 hover:text-[#E4405F] text-base sm:text-lg" />
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/company/dlsllp"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="LinkedIn"
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sky-50 transition-all duration-200 transform hover:scale-110"
                                            >
                                                <i className="fab fa-linkedin-in text-gray-600 hover:text-[#0A66C2] text-base sm:text-lg" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MAP - Responsive */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
                    <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-96 lg:h-[500px]">
                        <iframe
                            title="Dronacharya Tutorials Location - Manas Square, Indira Nagar, Lucknow"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7116.149910241286!2d80.99689910869144!3d26.901116181545444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3999597a04ec8a59%3A0xa343d5fddd761eb1!2sMANAS%20SQUARE!5e0!3m2!1sen!2sin!4v1762426715331!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>

                {/* POPUP - Responsive */}
                {popup.show && (
                    <div
                        className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-4 sm:max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
                            popup.type === "success" ? "border-green-500" : "border-red-500"
                        } p-4 z-50 transform transition-transform duration-300 ease-in-out`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4
                                    className={`font-semibold text-sm sm:text-base ${
                                        popup.type === "success" ? "text-green-800" : "text-red-800"
                                    }`}
                                >
                                    {popup.type === "success" ? "Success" : "Error"}
                                </h4>
                                <p className="text-slate-700 mt-1 text-xs sm:text-sm">{popup.message}</p>
                            </div>
                            <button
                                onClick={() => setPopup({ show: false, message: "", type: "" })}
                                className="text-slate-400 hover:text-slate-600 ml-2 sm:ml-4 transition-colors"
                                aria-label="Close notification"
                            >
                                <i className="fas fa-times text-sm sm:text-base"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
