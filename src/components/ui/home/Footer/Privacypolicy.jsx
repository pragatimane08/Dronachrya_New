
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
    } catch (e) {}
    setCookieAccepted(true);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* PAGE HEADER */}
        <section className="bg-[#2F4380] text-white py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Privacy & Policy</h1>
          <p className="mt-3 text-lg max-w-2xl mx-auto text-[#B8C9FF] font-normal">
            Learn how we handle your data, protect your privacy, and respect
            your rights.
          </p>
        </section>

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of contents (left column on large screens) */}
          {showToc && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-semibold mb-3">On this page</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#introduction" className="block hover:text-gray-900">Introduction</a></li>
                  <li><a href="#data-collected" className="block hover:text-gray-900">Data We Collect</a></li>
                  <li><a href="#how-used" className="block hover:text-gray-900">How We Use Data</a></li>
                  <li><a href="#sharing" className="block hover:text-gray-900">Sharing & Third Parties</a></li>
                  <li><a href="#cookies" className="block hover:text-gray-900">Cookies</a></li>
                  <li><a href="#security" className="block hover:text-gray-900">Data Security</a></li>
                  <li><a href="#children" className="block hover:text-gray-900">Children</a></li>
                  <li><a href="#your-rights" className="block hover:text-gray-900">Your Rights</a></li>
                  <li><a href="#contact" className="block hover:text-gray-900">Contact</a></li>
                </ul>
              </div>
            </aside>
          )}

          {/* Content column */}
          <section className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <article id="introduction" className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                This Privacy Policy explains how <strong>Your Company</strong>{" "}
                ("we", "us", "our") collects, uses, discloses, and protects
                information when you use our website and services. By using
                our services you agree to the collection and use of information
                in accordance with this policy.
              </p>
            </article>

            <article id="data-collected" className="prose max-w-none mt-6">
              <h2>2. Data We Collect</h2>
              <p>
                We may collect several different types of information for
                various purposes to provide and improve our Service to you.
              </p>

              <h3>2.1 Personal Information</h3>
              <ul>
                <li>Name, email address, phone number.</li>
                <li>Profile photo and other profile data you provide.</li>
              </ul>

              <h3>2.2 Usage Data</h3>
              <p>
                Automatically collected data when you interact with the service
                — e.g., pages visited, IP address, device and browser
                information, and usage patterns.
              </p>

              <h3>2.3 Payment Information</h3>
              <p>
                If you make purchases, we use third-party payment processors and
                do not store complete payment card details on our servers. We
                may retain transaction records required for accounting and fraud
                detection.
              </p>
            </article>

            <article id="how-used" className="prose max-w-none mt-6">
              <h2>3. How We Use Your Data</h2>
              <p>We use information for purposes including:</p>
              <ul>
                <li>To provide, maintain, and improve our services.</li>
                <li>To communicate with you (e.g., account updates, support).</li>
                <li>
                  To detect, prevent and address technical issues or fraud.
                </li>
                <li>To personalize your experience and content.</li>
              </ul>
            </article>

            <article id="sharing" className="prose max-w-none mt-6">
              <h2>4. Sharing & Third Parties</h2>
              <p>We may share your personal information with:</p>
              <ul>
                <li>
                  Service providers who perform services on our behalf (hosting,
                  analytics, payment providers).
                </li>
                <li>When required by law, or to protect our rights.</li>
                <li>
                  In connection with a business transfer such as a merger or
                  acquisition.
                </li>
              </ul>
            </article>

            <article id="cookies" className="prose max-w-none mt-6">
              <h2>5. Cookies & Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our Service and store certain information. You can
                manage cookie preferences in your browser settings. For many
                features, cookies are optional but help improve your experience.
              </p>
            </article>

            <article id="security" className="prose max-w-none mt-6">
              <h2>6. Data Security</h2>
              <p>
                We take reasonable measures to protect information. However, no
                method of transmission or storage is 100% secure. If you believe
                your data has been compromised, contact us right away.
              </p>
            </article>

            <article id="children" className="prose max-w-none mt-6">
              <h2>7. Children's Privacy</h2>
              <p>
                Our service is not directed to children under 13 (or the
                equivalent minimum age in your country). We do not knowingly
                collect personal information from children. If you believe we
                have collected data from a child, contact us for deletion.
              </p>
            </article>

            <article id="your-rights" className="prose max-w-none mt-6">
              <h2>8. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have rights such as
                access, correction, deletion, portability, and objection to
                certain processing. To exercise these rights contact us at the
                address below. We may need to verify your identity before
                honoring requests.
              </p>
            </article>

            <article id="contact" className="prose max-w-none mt-6">
              <h2>9. Contact</h2>
              <p>
                If you have questions or requests regarding this Privacy Policy,
                please contact us at:
              </p>
              <p className="font-medium">privacy@yourcompany.com</p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: September 9, 2025
              </p>
            </article>

            {/* Small utilities */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="/contactus"
                className="inline-block px-4 py-2 bg-gray-100 border rounded-md text-sm hover:bg-gray-50"
              >
                Contact Us
              </a>
              <button
                onClick={() => window.print()}
                className="inline-block px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                Print
              </button>
            </div>
          </section>
        </main>

        {/* Cookie banner */}
        {!cookieAccepted && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 max-w-3xl w-full px-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                We use cookies to improve your experience. By continuing, you
                accept our use of cookies.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={acceptCookies}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  Accept
                </button>
                <a
                  href="#cookies"
                  className="px-4 py-2 border rounded-md text-sm"
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
