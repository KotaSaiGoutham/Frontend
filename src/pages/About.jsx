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
            {/* Mission Icon: Trophy or Target for achievement/goal */}
            <div className="mission-vision-icon">🏆</div>
          </div>
          <h2>Our Mission</h2>
          <p>
            To empower students across the globe with high-quality, affordable education by connecting them with experienced tutors in real-time from the comfort of their homes.
          </p>
        </div>

        <div className="mission-vision-card">
          <div className="icon-container">
            {/* Vision Icon: Crystal Ball or Rocket for future/aspirations */}
            <div className="mission-vision-icon">🚀</div>
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