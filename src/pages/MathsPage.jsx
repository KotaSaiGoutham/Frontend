// src/pages/MathsPage.jsx
import React from 'react';
import './SubjectDetailPage.css'; // Assuming a shared CSS file for detail pages

const MathsPage = () => {
  return (
    <div className="subject-detail-page">
      <h1>Mathematics: Master the Language of Numbers and Logic</h1>
      <p>
        Mathematics is the study of quantity, structure, space, and change. It is an
        essential tool in many fields, including natural science, engineering, medicine,
        finance, and the social sciences. Our goal is to empower students with logical
        thinking and robust problem-solving skills.
      </p>
      <h2>What We Teach in Mathematics:</h2>
      <ul>
        <li>Algebra (Equations, Inequalities, Polynomials)</li>
        <li>Calculus (Differential Calculus, Integral Calculus, Applications)</li>
        <li>Geometry (Coordinate Geometry, Vectors, 3D Geometry)</li>
        <li>Trigonometry (Identities, Equations, Inverse Functions)</li>
        <li>Probability and Statistics</li>
        <li>Advanced topics for JEE/NEET/Boards and various Olympiads</li>
      </ul>
      <p>
        We focus on conceptual clarity and rigorous practice, transforming challenging
        mathematical problems into understandable and solvable steps for our students.
      </p>
      {/* Add more specific content, example problems, or diagrams here */}
    </div>
  );
};

export default MathsPage;