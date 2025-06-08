// src/pages/BiologyPage.jsx
import React from 'react';
import './SubjectDetailPage.css'; // Assuming a shared CSS file for detail pages

const BiologyPage = () => {
  return (
    <div className="subject-detail-page">
      <h1>Biology: Discover the Science of Life and Living Organisms</h1>
      <p>
        Biology is the natural science that studies life and living organisms, including
        their physical structure, chemical processes, molecular interactions, physiological
        mechanisms, development, and evolution. It encompasses all forms of life, from the
        smallest microbes to the largest animals.
      </p>
      <h2>What We Teach in Biology:</h2>
      <ul>
        <li>Cell Biology and Genetics</li>
        <li>Plant Physiology and Diversity</li>
        <li>Human Physiology and Anatomy</li>
        <li>Ecology and Environment</li>
        <li>Evolution and Classification of Organisms</li>
        <li>Comprehensive preparation for NEET/Boards and other medical entrance exams</li>
      </ul>
      <p>
        Our biology curriculum is designed to foster a deep understanding of life sciences,
        using engaging visuals and real-world examples to bring complex biological processes to life.
      </p>
      {/* Add more specific content, images of biological systems, or diagrams here */}
    </div>
  );
};

export default BiologyPage;