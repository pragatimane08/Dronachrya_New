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
    const handleResize = () => setShowToc(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAgree = () => {
    try {
      localStorage.setItem("tc_agreed", "true");
    } catch (e) {}
    setAgreed(true);
  };

  const handleRevoke = () => {
    try {
      localStorage.removeItem("tc_agreed");
    } catch (e) {}
    setAgreed(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB] text-gray-800 flex flex-col">
        {/* HEADER */}
        <section className="bg-[#2F4380] text-white py-20 text-center shadow-lg">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-[#B8C9FF] max-w-2xl mx-auto">
            Last Updated: October 27, 2025
          </p>
        </section>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fadeIn">
          {/* TABLE OF CONTENTS */}
          {showToc && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-semibold text-[#2F4380] mb-4">
                  On this page
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    "Eligibility and General Use",
                    "Account Registration and Security",
                    "Use Restrictions and Prohibited Conduct",
                    "Intellectual Property",
                    "Payments, Pricing, and Refunds",
                    "Third-Party Links and Content",
                    "Termination of Access",
                    "Limitation of Liability",
                    "Disclaimer of Warranties",
                    "Privacy",
                    "Governing Law and Jurisdiction",
                    "Changes to These Terms",
                    "Contact Us",
                  ].map((title, i) => (
                    <li key={i}>
                      <a
                        href={`#${title
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/&/g, "and")}`}
                        className="block hover:text-[#35BAA3] transition"
                      >
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* TERMS CONTENT */}
          <section className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-8 shadow-md leading-relaxed">
            <article className="text-gray-700 text-[17px] space-y-6">
              <p>
                Welcome to{" "}
                <strong className="text-[#2F4380]">
                  Dronacharya Learning Solutions LLP
                </strong>{" "}
                (“we,” “our,” or “us”). These Terms and Conditions (“Terms”)
                govern your access to and use of our website, mobile
                application, online/offline courses, learning materials, and any
                related services (collectively referred to as the “Services”).
              </p>
              <p>
                By accessing or using our Services, you agree to be bound by
                these Terms. If you do not agree, you must refrain from using
                our Services.
              </p>
            </article>

            {/* SECTIONS */}
            {[
              {
                id: "eligibility-and-general-use",
                title: "1. Eligibility and General Use",
                content: (
                  <>
                    <p>To use our Services, you must:</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        Be at least 13 years of age (or the minimum age of
                        digital consent in your country).
                      </li>
                      <li>
                        Have the legal capacity to enter into a binding
                        agreement.
                      </li>
                      <li>
                        Use the Services only for lawful purposes and in
                        accordance with these Terms.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                id: "account-registration-and-security",
                title: "2. Account Registration and Security",
                content: (
                  <>
                    <p>
                      Certain features of our Services require you to create an
                      account.
                    </p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        You agree to provide accurate, current, and complete
                        information during registration and to keep it updated
                        at all times.
                      </li>
                      <li>
                        You are solely responsible for maintaining the
                        confidentiality of your login credentials and ensuring
                        your password is strong and secure.
                      </li>
                      <li>
                        You are responsible for all activities that occur under
                        your account.
                      </li>
                      <li>
                        You must notify us immediately at{" "}
                        <strong>support@dronacharyatutorials.com</strong> if you
                        suspect or become aware of any unauthorized access.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                id: "use-restrictions-and-prohibited-conduct",
                title: "3. Use Restrictions and Prohibited Conduct",
                content: (
                  <>
                    <h3 className="font-semibold text-[#2F4380]">
                      A. Permitted Use
                    </h3>
                    <p>
                      You may access and use the Services solely for personal,
                      educational, and non-commercial purposes.
                    </p>

                    <h3 className="font-semibold text-[#2F4380]">
                      B. Prohibited Activities
                    </h3>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        Reproduce, share, sell, or modify any course materials
                        without prior written consent.
                      </li>
                      <li>
                        Engage in any activity that disrupts or damages the
                        Services, including hacking or virus distribution.
                      </li>
                      <li>
                        Use the Services for fraudulent, abusive, or unlawful
                        purposes.
                      </li>
                      <li>
                        Reverse engineer or attempt to decompile software
                        components of the Services.
                      </li>
                      <li>
                        Scrape, crawl, or use bots to collect data from the
                        Services without permission.
                      </li>
                    </ul>

                    <h3 className="font-semibold text-[#2F4380]">
                      C. User-Generated Content (UGC)
                    </h3>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        You are responsible for any content you post and confirm
                        you hold necessary rights to submit it.
                      </li>
                      <li>
                        UGC must not be illegal, defamatory, obscene, or
                        infringe on third-party rights.
                      </li>
                      <li>
                        You grant us a worldwide, non-exclusive, royalty-free,
                        perpetual license to use and distribute your UGC in
                        connection with our Services.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                id: "intellectual-property",
                title: "4. Intellectual Property",
                content: (
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      All text, images, videos, and materials are owned by
                      Dronacharya Learning Solutions LLP or its partners.
                    </li>
                    <li>
                      You are granted a limited, non-transferable license for
                      personal, educational use only.
                    </li>
                    <li>
                      You may not copy, modify, or create derivative works
                      without written permission.
                    </li>
                    <li>
                      Trademarks and logos remain property of their respective
                      owners.
                    </li>
                  </ul>
                ),
              },
              {
                id: "payments-pricing-and-refunds",
                title: "5. Payments, Pricing, and Refunds",
                content: (
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Some Services are paid; all fees and terms are displayed
                      before purchase.
                    </li>
                    <li>
                      We reserve the right to revise pricing or payment methods
                      with notice.
                    </li>
                    <li>
                      All payments are non-refundable unless specified in our
                      official Refund Policy.
                    </li>
                    <li>
                      Prices exclude applicable taxes such as GST, which may be
                      added at checkout.
                    </li>
                  </ul>
                ),
              },
              {
                id: "third-party-links-and-content",
                title: "6. Third-Party Links and Content",
                content: (
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Our Services may contain links to third-party websites or
                      resources.
                    </li>
                    <li>
                      We do not control or endorse third-party content or
                      assume responsibility for any resulting damage or loss.
                    </li>
                  </ul>
                ),
              },
              {
                id: "termination-of-access",
                title: "7. Termination of Access",
                content: (
                  <>
                    <p>
                      We may suspend or terminate access to the Services without
                      prior notice if:
                    </p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>You violate these Terms.</li>
                      <li>You engage in fraudulent or illegal conduct.</li>
                      <li>We discontinue or modify our Services.</li>
                    </ul>
                    <p className="mt-2">
                      Upon termination, your right to use our Services ceases
                      immediately. We are not required to retain your data.
                    </p>
                  </>
                ),
              },
              {
                id: "limitation-of-liability",
                title: "8. Limitation of Liability",
                content: (
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      We are not liable for indirect, incidental, or
                      consequential damages.
                    </li>
                    <li>
                      We are not responsible for loss of data, profits, or
                      goodwill.
                    </li>
                    <li>
                      Our total liability is limited to the amount paid by you
                      in the six months preceding the claim.
                    </li>
                  </ul>
                ),
              },
              {
                id: "disclaimer-of-warranties",
                title: "9. Disclaimer of Warranties",
                content: (
                  <>
                    <p>
                      Our Services are provided “as is” and “as available”
                      without any warranties.
                    </p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>
                        We do not guarantee uninterrupted or error-free
                        operation.
                      </li>
                      <li>
                        No warranty on the accuracy or reliability of any
                        content.
                      </li>
                      <li>
                        We disclaim implied warranties of merchantability or
                        fitness for a specific purpose.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                id: "privacy",
                title: "10. Privacy",
                content: (
                  <p>
                    Your use of the Services is governed by our Privacy Policy,
                    which explains how we collect, use, and protect your
                    personal data.
                  </p>
                ),
              },
              {
                id: "governing-law-and-jurisdiction",
                title: "11. Governing Law and Jurisdiction",
                content: (
                  <p>
                    These Terms are governed by Indian law. Disputes will be
                    subject to the exclusive jurisdiction of courts in Lucknow,
                    Uttar Pradesh, India.
                  </p>
                ),
              },
              {
                id: "changes-to-these-terms",
                title: "12. Changes to These Terms",
                content: (
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      We may update these Terms periodically and post updates on
                      this page.
                    </li>
                    <li>
                      Material changes may be communicated via email or in-app
                      notice.
                    </li>
                    <li>
                      Continued use of our Services implies acceptance of the
                      revised Terms.
                    </li>
                  </ul>
                ),
              },
              {
                id: "contact-us",
                title: "13. Contact Us",
                content: (
                  <>
                    <p>
                      For questions, concerns, or feedback, contact us at:
                    </p>
                    <div className="ml-6 mt-2">
                      <p>
                        <strong>📧 Email:</strong>{" "}
                        support@dronacharyatutorials.com
                      </p>
                      <p>
                        <strong>🏢 Address:</strong> 109 Manas Square, Sugamau
                        Cimap, Indira Nagar (Lesa), Lucknow, Uttar Pradesh –
                        226016, India
                      </p>
                      <p>
                        <strong>Grievance Officer:</strong> (Insert name and
                        contact details as per Indian IT rules)
                      </p>
                    </div>
                  </>
                ),
              },
            ].map(({ id, title, content }) => (
              <article id={id} key={id} className="mt-10 space-y-3">
                <h2 className="text-2xl font-semibold text-[#2F4380]">
                  {title}
                </h2>
                <div className="text-[16px] text-gray-700">{content}</div>
              </article>
            ))}

            {/* ACTION BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 shadow-sm"
              >
                Print
              </button>

              {!agreed ? (
                <button
                  onClick={handleAgree}
                  className="px-5 py-2 bg-[#35BAA3] text-white rounded-md text-sm font-medium hover:bg-[#2F4380] shadow-md transition"
                >
                  I Agree
                </button>
              ) : (
                <button
                  onClick={handleRevoke}
                  className="px-5 py-2 border border-[#35BAA3] text-[#35BAA3] rounded-md text-sm font-medium hover:bg-[#B3EDE3] shadow-sm transition"
                >
                  Revoke Agreement
                </button>
              )}

              <a
                href="/contactus"
                className="px-5 py-2 bg-[#F3F4F6] text-gray-800 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 shadow-sm"
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

