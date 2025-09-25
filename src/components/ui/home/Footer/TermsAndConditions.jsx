import React, { useEffect, useState } from "react";
import Layout from "../layout/MainLayout"; 

export default function TermsAndConditions() {
  const [showToc, setShowToc] = useState(true);
  const [agreed, setAgreed] = useState(() => {
    try {
      return localStorage.getItem("tc_agreed") === "true";
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

  function handleAgree() {
    try {
      localStorage.setItem("tc_agreed", "true");
    } catch (e) {}
    setAgreed(true);
  }

  function handleRevoke() {
    try {
      localStorage.removeItem("tc_agreed");
    } catch (e) {}
    setAgreed(false);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        {/* PAGE HEADER */}
        <section className="bg-[#2F4380] text-white py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-lg max-w-2xl mx-auto text-[#B8C9FF]">
            Please review the following terms carefully before using our
            services.
          </p>
        </section>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {showToc && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-semibold mb-3">On this page</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#acceptance" className="block hover:text-gray-900">
                      Acceptance
                    </a>
                  </li>
                  <li>
                    <a href="#eligibility" className="block hover:text-gray-900">
                      Eligibility
                    </a>
                  </li>
                  <li>
                    <a href="#accounts" className="block hover:text-gray-900">
                      Accounts
                    </a>
                  </li>
                  <li>
                    <a
                      href="#use-of-service"
                      className="block hover:text-gray-900"
                    >
                      Use of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#intellectual-property"
                      className="block hover:text-gray-900"
                    >
                      IP & Content
                    </a>
                  </li>
                  <li>
                    <a href="#payment" className="block hover:text-gray-900">
                      Payments & Refunds
                    </a>
                  </li>
                  <li>
                    <a href="#liability" className="block hover:text-gray-900">
                      Limitation of Liability
                    </a>
                  </li>
                  <li>
                    <a
                      href="#termination"
                      className="block hover:text-gray-900"
                    >
                      Termination
                    </a>
                  </li>
                  <li>
                    <a href="#changes" className="block hover:text-gray-900">
                      Changes
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="block hover:text-gray-900">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          )}

          <section className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <article id="acceptance" className="prose max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using <strong>Your Company</strong> ("the
                Service"), you agree to be bound by these Terms & Conditions
                ("Terms"). If you do not agree to these Terms, do not use the
                Service.
              </p>
            </article>

            <article id="eligibility" className="prose max-w-none mt-6">
              <h2>2. Eligibility</h2>
              <p>
                You must be at least 13 years old (or the minimum age in your
                country) to use the Service. By using the Service you represent
                and warrant that you meet the eligibility requirements.
              </p>
            </article>

            <article id="accounts" className="prose max-w-none mt-6">
              <h2>3. Accounts</h2>
              <ul>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account and password.
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account.
                </li>
                <li>
                  We may suspend or terminate accounts that violate these Terms.
                </li>
              </ul>
            </article>

            <article id="use-of-service" className="prose max-w-none mt-6">
              <h2>4. Use of the Service</h2>
              <p>
                You agree to use the Service only for lawful purposes and in a
                way that does not infringe the rights of others or restrict
                their use of the Service.
              </p>
              <h3>Prohibited Conduct</h3>
              <ul>
                <li>
                  Unauthorized access, scraping, or interference with the
                  Service.
                </li>
                <li>Uploading harmful or illegal content.</li>
                <li>Impersonation or misrepresentation of identity.</li>
              </ul>
            </article>

            <article id="intellectual-property" className="prose max-w-none mt-6">
              <h2>5. Intellectual Property</h2>
              <p>
                All content provided on the Service (text, graphics, logos,
                images) is owned or licensed by us. You may not reproduce,
                distribute, or create derivative works without prior written
                permission.
              </p>
            </article>

            <article id="payment" className="prose max-w-none mt-6">
              <h2>6. Payments & Refunds</h2>
              <p>
                If the Service offers paid features, you agree to the pricing
                and billing terms presented at the time of purchase. Refunds, if
                any, will be handled according to the published refund policy.
              </p>
            </article>

            <article id="liability" className="prose max-w-none mt-6">
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, we are not liable for
                indirect, incidental, special, consequential, or punitive
                damages arising from your use of the Service.
              </p>
            </article>

            <article id="termination" className="prose max-w-none mt-6">
              <h2>8. Termination</h2>
              <p>
                We may suspend or terminate your access for violations of these
                Terms or for any reason with notice where required by law.
                Termination does not relieve you of obligations that accrued
                prior to termination.
              </p>
            </article>

            <article id="changes" className="prose max-w-none mt-6">
              <h2>9. Changes to Terms</h2>
              <p>
                We may modify these Terms from time to time. When we make
                material changes, we will notify you (for example via email or
                in-app notice) and update the "Last updated" date below.
                Continued use after changes constitutes acceptance of the new
                Terms.
              </p>
            </article>

            <article id="contact" className="prose max-w-none mt-6">
              <h2>10. Contact</h2>
              <p>
                If you have questions about these Terms, contact us at:{" "}
                <span className="font-medium">legal@yourcompany.com</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: September 9, 2025
              </p>
            </article>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                Print
              </button>

              {!agreed ? (
                <button
                  onClick={handleAgree}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  I Agree
                </button>
              ) : (
                <button
                  onClick={handleRevoke}
                  className="px-4 py-2 border rounded-md text-sm"
                >
                  Revoke Agreement
                </button>
              )}

              <a
                href="/contactus"
                className="inline-block px-4 py-2 bg-gray-100 border rounded-md text-sm hover:bg-gray-50"
              >
                Contact Us
              </a>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
