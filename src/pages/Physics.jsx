// src/pages/PhysicsPage.jsx
import React from 'react';
import './SubjectDetailPage.css'; // Create a shared CSS for detail pages

const PhysicsPage = () => {
  return (
    <div className="subject-detail-page">
      <h1>Physics: The Fundamental Laws of the Universe</h1>
      <p>
        Physics is the natural science that studies matter, its fundamental constituents,
        its motion and behavior through space and time, and the related entities of
        energy and force. It is one of the most fundamental scientific disciplines,
        and its main goal is to understand how the universe behaves.
      </p>
      <h2>What We Teach in Physics:</h2>
      <ul>
        <li>Classical Mechanics</li>
        <li>Electromagnetism</li>
        <li>Thermodynamics</li>
        <li>Optics</li>
        <li>Modern Physics (Quantum Mechanics, Relativity)</li>
        <li>Problem-solving techniques for JEE/NEET/Boards</li>
      </ul>
      <p>
        Our expert physics tutors focus on building strong conceptual foundations
        and equipping students with the skills to tackle complex problems.
      </p>
      {/* You can add more content, images, or even components here */}
    </div>
  );
};

export default PhysicsPage;