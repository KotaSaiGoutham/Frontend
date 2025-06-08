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
            {/* Mission Icon: Shield with Checkmark (Source: Material Icons - check_circle_outline simplified for viewBox) */}
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8.01l-9 9z"/>
            </svg>
          </div>
          <h2>Our Mission</h2>
          <p>
            To empower students across the globe with high-quality, affordable education by connecting them with experienced tutors in real-time from the comfort of their homes.
          </p>
        </div>

        <div className="mission-vision-card">
          <div className="icon-container">
            {/* Vision Icon: Lightbulb (Source: Material Icons - lightbulb_outline simplified for viewBox) */}
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19c-3.87 0-7 3.13-7 7 0 2.59 1.34 4.88 3.33 6.13.3.19.67.29 1.05.29h.62c.28 0 .54-.11.74-.31l1.41-1.41c.2-.2.31-.46.31-.74V9c0-1.65 1.35-3 3-3s3 1.35 3 3v6.59l.7-.7c.2-.2.46-.31.74-.31h.62c.38 0 .75-.1.99-.3 1.99-1.25 3.33-3.54 3.33-6.13C22 6.13 18.87 2 15 2h-3zM15 9V5l3 3-3 3z"/>
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