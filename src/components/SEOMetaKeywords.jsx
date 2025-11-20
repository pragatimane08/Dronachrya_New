// src/components/SEOMetaKeywords.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { keywordsData } from "../Data/keywordsData";

const SEOMetaKeywords = () => {
  const getOptimizedKeywords = () => {
    // Priority high-value keywords
    const priorityKeywords = [
      "home tutor",
      "home tuition",
      "private tutor",
      "maths tuition",
      "science tuition",
      "online tuition",
      "tutors near me",
      "home tutoring services",
      "personal tutor",
      "cbse tuition",
      "icse tuition",
      "neet coaching",
      "jee coaching",
      "english tuition",
      "physics tuition",
      "chemistry tuition",
    ];

    // Merge priority + keywordsData, remove duplicates
    const allKeywords = [...new Set([...priorityKeywords, ...keywordsData])];

    // Keep within SEO-friendly limit (max ~50 keywords)
    return allKeywords.slice(0, 50).join(", ");
  };

  const metaKeywords = getOptimizedKeywords();

  return (
    <Helmet>
      {/* Keywords Meta */}
      <meta name="keywords" content={metaKeywords} />

      {/* SEO Description */}
      <meta
        name="description"
        content="Find qualified home tutors for all subjects and classes. Best private tuition services for CBSE, ICSE, JEE, NEET, and competitive exams. Experienced tutors near you."
      />

      {/* Open Graph Tags */}
      <meta
        property="og:title"
        content="Home Tutoring Services - Find Qualified Tutors Near You"
      />
      <meta
        property="og:description"
        content="Connect with certified home tutors for academic success. Personalized tuition for all classes and subjects."
      />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEOMetaKeywords;