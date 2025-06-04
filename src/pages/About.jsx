import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1 className="about-title">About Electron Academy</h1>
        <p className="about-subtitle">
          Personalized 1-on-1 online tutoring through Zoom, helping students achieve academic excellence with convenience, flexibility, and expert guidance.
        </p>
      </header>

      <div className="mission-vision-container">
        <div className="mission-vision-card">
          <div className="icon-container">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
            </svg>
          </div>
          <h2>Our Mission</h2>
          <p>
            To empower students across the globe with high-quality, affordable education by connecting them with experienced tutors in real-time from the comfort of their homes.
          </p>
        </div>

        <div className="mission-vision-card">
          <div className="icon-container">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
            </svg>
          </div>
          <h2>Our Vision</h2>
          <p>
            To become a trusted global leader in personalized online tutoring and make education accessible and enjoyable for every learner.
          </p>
        </div>
      </div>

      <div className="values-section">
        <h2 className="values-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">🎯</div>
            <h3>Personalized Learning</h3>
            <p>Tailored instruction to meet each student's unique needs and learning style.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🌐</div>
            <h3>Accessibility for All</h3>
            <p>Breaking geographical barriers to provide quality education worldwide.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">💡</div>
            <h3>Continuous Improvement</h3>
            <p>Constantly evolving our methods to deliver the best educational experience.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🤝</div>
            <h3>Parent Involvement</h3>
            <p>Keeping families informed and engaged in the learning process.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">📈</div>
            <h3>Student Success</h3>
            <p>Our ultimate measure of achievement is your child's academic growth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;