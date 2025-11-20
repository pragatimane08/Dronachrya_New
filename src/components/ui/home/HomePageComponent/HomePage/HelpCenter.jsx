import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, User, UserCheck, Send } from 'lucide-react';

const HelpCenter = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    question: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const faqData = [
    {
      id: 1,
      question: "How do I get a tutor match?",
      answer: "Getting a tutor match: 1) Go to the Book a Demo section, 2) Fill out the enquiry form with your subjects and preferences, 3) Submit the form to get matched with the best tutor for you."
    },
    {
      id: 2,
      question: "How do I find the right tutor for my subject?",
      answer: "Finding the right tutor: 1) Use the search bar to enter your subject, 2) Filter tutors by experience, rating, and price range, 3) Read tutor profiles and reviews, 4) Check availability and schedule, 5) Book a trial session to ensure compatibility."
    },
    {
      id: 3,
      question: "How do I become a tutor on the platform?",
      answer: "To become a tutor: 1) Apply through 'SignUp as Tutor' section, 2) Submit your qualifications and certifications, 3) Complete the verification process, 4) Set your hourly rates and availability, 5) Create an engaging profile with your expertise areas."
    },
    {
      id: 4,
      question: "How does the payment system work?",
      answer: "Payment process: 1) Students pay upfront for sessions, 2) Funds are held securely until session completion, 3) Tutors receive payment after successful session delivery, 4) Refunds available within 24 hours if session doesn't occur, 5) Multiple payment methods accepted including cards and digital wallets."
    },
    {
      id: 5,
      question: "What if I need to cancel or reschedule a session?",
      answer: "Cancellation policy: 1) Free cancellation up to 4 hours before session, 2) Contact your tutor directly for rescheduling, 3) Emergency cancellations handled case-by-case, 4) Frequent cancellations may affect your account status, 5) Use the messaging system to communicate changes."
    },
    {
      id: 6,
      question: "How do I report issues with a session or user?",
      answer: "Reporting issues: 1) Go to 'Report' section in your dashboard, 2) Select the type of issue (technical, behavioral, payment), 3) Provide detailed description and evidence, 4) Submit timestamps for session-related issues, 5) Our support team will investigate within 24 hours."
    },
    {
      id: 7,
      question: "How can I improve my profile visibility as a tutor?",
      answer: "Boosting visibility: 1) Complete 100% of your profile information, 2) Add a professional photo and detailed bio, 3) Collect positive reviews from students, 4) Maintain high response rates to messages, 5) Offer competitive pricing and flexible scheduling."
    },
    {
      id: 8,
      question: "What technical requirements do I need for online sessions?",
      answer: "Technical requirements: 1) Stable internet connection (minimum 5 Mbps), 2) Computer or tablet with camera and microphone, 3) Updated web browser (Chrome, Firefox, Safari), 4) Quiet environment for clear communication, 5) Optional: Digital whiteboard or screen sharing tools."
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.role && formData.question) {
      // Here you would typically send the data to your backend
      console.log('Submitted question:', formData);
      setSubmitted(true);
      setFormData({ name: '', role: '', question: '' });
      setTimeout(() => {
        setSubmitted(false);
        setShowCustomForm(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions for both students and tutors. Get the support you need to make the most of our platform.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Click on any question below to view the answer</p>
          </div>

          <div className="divide-y divide-gray-100">
            {faqData.map((faq) => (
              <div key={faq.id} className="transition-all duration-200">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                >
                  <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  )}
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Question Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Can't find what you're looking for?</h2>
            <p className="text-gray-600">Submit your own question and we'll get back to you as soon as possible</p>
          </div>

          <div className="p-6">
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                Ask a Custom Question
              </button>
            ) : (
              <div className="space-y-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Question Submitted!</h3>
                    <p className="text-gray-600">Thank you for your question. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Role *
                        </label>
                        <div className="relative">
                          <UserCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                          >
                            <option value="">Select your role</option>
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Question *
                      </label>
                      <textarea
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Please describe your question or issue in detail..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Send className="w-4 h-4" />
                        Submit Question
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Still need help? Contact our support team</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@platform.com" className="text-blue-600 hover:text-blue-700 font-medium">
              support@platform.com
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="text-gray-600">Response time: Within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
<<<<<<< HEAD

=======
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
