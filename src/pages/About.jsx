import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-us">
      <h1>About Electron Academy</h1>
      <p className="intro">
        At Electron Academy, we provide personalized 1-on-1 online tutoring through Zoom, helping students achieve academic excellence with convenience, flexibility, and expert guidance.
      </p>

      <div className="about-section mission-vision">
        <div className="card">
          <h2>Our Mission</h2>
          <p>
            To empower students across the globe with high-quality, affordable education by connecting them with experienced tutors in real-time from the comfort of their homes.
          </p>
        </div>
        <div className="card">
          <h2>Our Vision</h2>
          <p>
            To become a trusted global leader in personalized online tutoring and make education accessible and enjoyable for every learner.
          </p>
        </div>
      </div>

      <div className="values">
        <h2>Our Core Values</h2>
        <ul>
          <li>🎯 Personalized Learning</li>
          <li>🌐 Accessibility for All</li>
          <li>💡 Continuous Improvement</li>
          <li>🤝 Parent Involvement</li>
          <li>📈 Student Success</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
