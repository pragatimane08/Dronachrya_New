import React, { useEffect, useState } from "react";
import Layout from "../layout/MainLayout";

export default function PrivacyPolicy() {
  const [showToc, setShowToc] = useState(true);
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    try {
      return localStorage.getItem("pp_cookie_accepted") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    function handleResize() {
      setShowToc(window.innerWidth >= 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function acceptCookies() {
    try {
      localStorage.setItem("pp_cookie_accepted", "true");
    } catch (e) {
      console.error("Failed to save cookie preference:", e);
    }
    setCookieAccepted(true);
  }

  // Smooth scroll for TOC links
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 100; // Account for fixed header
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
          
          // Update URL without jumping
          window.history.pushState(null, null, href);
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  const tocSections = [
    "Information We Collect",
    "How We Use Your Information",
    "Sharing of Information",
    "Data Retention",
    "Data Security",
    "Children's Privacy",
    "Your Rights and Choices",
    "International Data Transfers",
    "Third-Party Services",
    "Updates to This Policy",
    "Contact Us"
  ];

  const sharingInfo = [
    {
      title: "Service Providers",
      description: "With trusted third-party partners who assist in operating our Services (e.g., payment processors, hosting providers, analytics tools).",
      icon: "👥"
    },
    {
      title: "Legal Compliance",
      description: "When required by law, regulation, or court order.",
      icon: "⚖️"
    },
    {
      title: "Business Transfers",
      description: "In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction.",
      icon: "🔄"
    },
    {
      title: "With Your Consent",
      description: "When you explicitly authorize sharing your information with another party (e.g., for certification or internship programs).",
      icon: "✅"
    }
  ];

  const dataRights = [
    "Access and obtain a copy of your data",
    "Correct or update inaccurate information",
    "Request deletion of your account or data",
    "Restrict or object to certain data processing activities",
    "Withdraw consent for marketing communications",
    "Export your data in a portable format"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#B8C9FF]/20 to-[#B8C9FF]/10 text-gray-800">
        {/* HEADER */}
        <section className="bg-gradient-to-r from-[#2F4380] to-[#1E2F5C] text-white py-12 lg:py-16 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-full backdrop-blur-sm mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-[#B8C9FF] font-light leading-relaxed">
              Learn how Dronacharya Learning Solutions LLP collects, uses, and protects your personal data.
            </p>
            <div className="mt-4 text-sm text-[#B8C9FF]">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* TOC - Mobile Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowToc(!showToc)}
              className="w-full flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-[#2F4380]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Table of Contents
              </span>
              <svg 
                className={`w-4 h-4 text-[#2F4380] transition-transform duration-200 ${showToc ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* TOC */}
          {(showToc || window.innerWidth >= 1024) && (
            <aside className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 lg:sticky lg:top-28">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-[#2F4380]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <h2 className="text-sm font-semibold text-[#2F4380] uppercase tracking-wide">On this page</h2>
                </div>
                <nav>
                  <ul className="space-y-2 text-sm">
                    {tocSections.map((item) => (
                      <li key={item}>
                        <a 
                          href={`#${item.toLowerCase().replace(/\s+/g, '').replace(/[’']/g, '')}`}
                          className="block py-1.5 px-3 rounded-lg text-gray-600 hover:text-[#2F4380] hover:bg-[#B8C9FF]/20 transition-all duration-200 border-l-2 border-transparent hover:border-[#2F4380]"
                          onClick={() => window.innerWidth < 1024 && setShowToc(false)}
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}

          {/* CONTENT */}
          <section className="lg:col-span-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <article className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              
              {/* Introduction */}
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-[#B8C9FF]/20 to-[#B8C9FF]/30 rounded-xl border border-[#2F4380]/20">
                <p className="text-base sm:text-lg leading-relaxed">
                  Welcome to <strong className="text-[#2F4380]">Dronacharya Learning Solutions LLP</strong> ("we," "our," or "us").  
                  Your privacy is important to us. This Privacy Policy explains how we collect, use,
                  disclose, and protect your personal information when you use our website, mobile application,
                  and other online learning services (collectively, the "Services").
                </p>
                <p className="text-base sm:text-lg leading-relaxed mt-3 sm:mt-4">
                  By accessing or using our Services, you agree to the collection and use of your
                  information in accordance with this Privacy Policy.
                </p>
              </div>

              {/* Information We Collect */}
              <article id="informationwecollect" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">1</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Information We Collect</h2>
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6">We collect information to provide and improve our Services. This includes:</p>

                <div className="space-y-4 sm:space-y-6">
                  <section className="p-3 sm:p-4 bg-white rounded-lg border border-[#2F4380]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-[#2F4380] mb-2 sm:mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Personal Information
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">When you register or interact with our Services, we may collect:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-gray-700">
                      {["Full name", "Email address", "Phone number", "Date of birth", "Account login details", "Payment or billing information (processed via secure third-party payment gateways)"].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 bg-[#2F4380] rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="p-3 sm:p-4 bg-white rounded-lg border border-[#2F4380]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-[#2F4380] mb-2 sm:mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" />
                      </svg>
                      Usage Information
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">We automatically collect data on how you use our Services, such as:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-gray-700">
                      {["IP address", "Device type and operating system", "Browser type and language", "Access times and pages viewed", "Course progress and activity logs"].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 bg-[#2F4380] rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="p-3 sm:p-4 bg-white rounded-lg border border-[#2F4380]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-[#2F4380] mb-2 sm:mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                      Cookies and Tracking Technologies
                    </h3>
                    <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">We use cookies and similar technologies to:</p>
                    <ul className="space-y-1 sm:space-y-2 text-gray-700 mb-3">
                      {["Remember your preferences", "Track your usage patterns", "Improve platform performance"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 bg-[#2F4380] rounded-full flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs sm:text-sm text-gray-600 bg-[#B8C9FF]/10 p-2 sm:p-3 rounded-lg border border-[#2F4380]/10">
                      You can disable cookies in your browser settings, but some features may not function properly.
                    </div>
                  </section>
                </div>
              </article>

              {/* How We Use Your Information */}
              <article id="howweuseyourinformation" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">2</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">How We Use Your Information</h2>
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">We use your information to:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-700 mb-4 sm:mb-6">
                  {[
                    "Create and manage your account",
                    "Deliver online courses and educational content",
                    "Process payments and subscriptions",
                    "Communicate updates, offers, and notifications",
                    "Personalize your learning experience",
                    "Analyze and improve our Services",
                    "Ensure security, prevent fraud, and comply with legal obligations"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
                      <div className="w-1.5 h-1.5 bg-[#2F4380] rounded-full mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-[#B8C9FF]/20 border border-[#2F4380]/20 rounded-xl p-3 sm:p-4">
                  <p className="text-[#2F4380] font-semibold flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    We will never sell your personal data to third parties.
                  </p>
                </div>
              </article>

              {/* Sharing of Information */}
              <article id="sharingofinformation" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">3</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Sharing of Information</h2>
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">We may share your data only in the following cases:</p>
                <div className="space-y-3 sm:space-y-4">
                  {sharingInfo.map((item, index) => (
                    <div key={item.title} className="flex items-start gap-3 p-3 sm:p-4 bg-[#B8C9FF]/10 rounded-xl border border-[#2F4380]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#2F4380] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white">{item.icon}</span>
                      </div>
                      <div className="text-sm sm:text-base">
                        <strong className="text-[#2F4380]">{item.title}:</strong> {item.description}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-[#B8C9FF]/10 rounded-lg border border-[#2F4380]/20">
                  <p className="text-sm text-[#2F4380] font-medium">
                    All partners are bound by confidentiality and data protection obligations.
                  </p>
                </div>
              </article>

              {/* Data Retention */}
              <article id="dataretention" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Data Retention</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                    We retain your personal data only as long as necessary to:
                  </p>
                  <ul className="space-y-2 mb-4">
                    {[
                      "Provide Services and fulfill legitimate business purposes,",
                      "Comply with legal obligations, and",
                      "Resolve disputes and enforce our agreements."
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                        <div className="w-1.5 h-1.5 bg-[#2F4380] rounded-full mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 bg-[#B8C9FF]/10 rounded-lg border border-[#2F4380]/10">
                    <p className="text-sm text-[#2F4380] font-medium">
                      You may request deletion of your account or personal data at any time (see Section 7).
                    </p>
                  </div>
                </div>
              </article>

              {/* Data Security */}
              <article id="datasecurity" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">5</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Data Security</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                    We use administrative, technical, and physical safeguards to protect your data, including:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                    <div className="p-3 bg-[#B8C9FF]/10 rounded-lg border border-[#2F4380]/10">
                      <strong className="text-[#2F4380]">Encryption:</strong> Encryption of sensitive information
                    </div>
                    <div className="p-3 bg-[#B8C9FF]/10 rounded-lg border border-[#2F4380]/10">
                      <strong className="text-[#2F4380]">Secure Infrastructure:</strong> Secure server infrastructure
                    </div>
                    <div className="p-3 bg-[#B8C9FF]/10 rounded-lg border border-[#2F4380]/10">
                      <strong className="text-[#2F4380]">Monitoring:</strong> Regular system monitoring
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      However, no online service can guarantee complete security. You use our Services at your own risk.
                    </p>
                  </div>
                </div>
              </article>

              {/* Children's Privacy */}
              <article id="childrensprivacy" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">6</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Children's Privacy</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 text-sm sm:text-base">
                    Our Services are intended for users aged 13 years and older (or as required by local law).
                    We do not knowingly collect personal data from children under this age. If we learn that a child's data has been collected without parental consent, we will promptly delete it.
                  </p>
                </div>
              </article>

              {/* Your Rights and Choices */}
              <article id="yourrightsandchoices" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">7</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Your Rights and Choices</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    Depending on your jurisdiction, you may have rights to:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {dataRights.map((right) => (
                      <div key={right} className="flex items-center gap-3 p-2 sm:p-3 bg-[#B8C9FF]/10 rounded-lg border border-[#2F4380]/10">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#2F4380] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm sm:text-base">{right}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-[#B8C9FF]/20 rounded-lg border border-[#2F4380]/20">
                    <p className="text-[#2F4380] text-sm">
                      To exercise these rights, please contact us at{" "}
                      <a href="mailto:privacy@dronacharyatutorials.com" className="font-semibold underline text-[#2F4380]">
                        privacy@dronacharyatutorials.com
                      </a>
                    </p>
                  </div>
                </div>
              </article>

              {/* International Data Transfers */}
              <article id="internationaldatatransfers" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">8</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">International Data Transfers</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 text-sm sm:text-base">
                    If you access our Services from outside India, your information may be transferred to and processed in other countries where data protection laws may differ. We ensure appropriate safeguards are in place for such transfers.
                  </p>
                </div>
              </article>

              {/* Third-Party Services */}
              <article id="thirdpartyservices" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">9</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Third-Party Services</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 text-sm sm:text-base">
                    Our Services may contain links to third-party websites or tools.
                    We are not responsible for the privacy practices or content of such third parties. Please review their privacy policies before providing any personal data.
                  </p>
                </div>
              </article>

              {/* Updates to This Policy */}
              <article id="updatestothispolicy" className="scroll-mt-20 sm:scroll-mt-24 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">10</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Updates to This Policy</h2>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#2F4380]/10">
                  <p className="text-gray-700 text-sm sm:text-base">
                    We may update this Privacy Policy from time to time to reflect changes in technology, law, or our practices. The latest version will always be posted on this page with the updated date. Continued use of our Services constitutes your acceptance of the revised policy.
                  </p>
                </div>
              </article>

              {/* Contact Us */}
              <article id="contactus" className="scroll-mt-20 sm:scroll-mt-24 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center border border-[#2F4380]/20">
                    <span className="text-sm font-semibold text-[#2F4380]">11</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2F4380]">Contact Us</h2>
                </div>
                <div className="bg-gradient-to-r from-[#B8C9FF]/20 to-[#B8C9FF]/30 p-4 sm:p-6 rounded-xl border border-[#2F4380]/20">
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#2F4380]/10">
                      <svg className="w-4 h-4 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-[#2F4380]">privacy@dronacharyatutorials.com</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#2F4380]/10">
                      <svg className="w-4 h-4 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="text-[#2F4380]">109 MANAS SQUARE SUGAMAU CIMAP INDIRA NAGAR LUCKNOW/LESA LUCKNOW UP 226016 IND</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Utilities */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#2F4380]/20 flex flex-col sm:flex-row flex-wrap items-center gap-3">
                <a
                  href="/contactus"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#2F4380] text-white rounded-xl text-sm font-medium hover:bg-[#1E2F5C] transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </a>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-[#2F4380]/20 text-[#2F4380] rounded-xl text-sm font-medium hover:bg-[#B8C9FF]/10 transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Policy
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-[#2F4380]/20 text-[#2F4380] rounded-xl text-sm font-medium hover:bg-[#B8C9FF]/10 transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center sm:ml-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Back to Top
                </button>
              </div>
            </article>
          </section>
        </main>

        {/* Cookie Banner */}
        {!cookieAccepted && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-3xl w-full px-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white border border-[#2F4380]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 backdrop-blur-sm bg-white/95">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#B8C9FF]/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#2F4380]/20">
                  <svg className="w-3 h-3 text-[#2F4380]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs sm:text-sm text-gray-700">
                  <strong className="text-[#2F4380]">We use cookies</strong> to improve your experience. By continuing, you accept our use of cookies.
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={acceptCookies}
                  className="px-4 sm:px-5 py-2 bg-[#2F4380] text-white rounded-xl text-sm font-medium hover:bg-[#1E2F5C] transition-colors duration-200 shadow-sm hover:shadow-md flex-1 sm:flex-none"
                >
                  Accept
                </button>
                <a 
                  href="#cookies" 
                  className="px-4 sm:px-5 py-2 bg-white border border-[#2F4380]/20 text-[#2F4380] rounded-xl text-sm font-medium hover:bg-[#B8C9FF]/10 transition-colors duration-200 flex-1 sm:flex-none text-center"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}