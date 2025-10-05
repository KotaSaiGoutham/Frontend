import React from 'react';
import './RevisionProgramDetails.css';
import { useNavigate } from 'react-router-dom';

const RevisionProgramDetails = () => {
  // In a real application, you would use a navigation hook, e.g.,
  const navigate = useNavigate();
  const handleEnrollClick = () => {
    navigate('/revision-program/register');
  };

  return (
    <div className="program-container">
      <div className="program-card">
        <header className="program-header">
          <h1 className="program-title">90-Day Online Revision Program</h1>
          <p className="program-subtitle">
            <span className="icon">📅</span> Duration: 6th October 2025 – 21st January 2026
          </p>
          <p className="program-subtitle">
            <span className="icon">🎯</span> Target: JEE Main 2026
          </p>
        </header>

        <section className="program-section">
          <h2 className="section-title">🔑 Why Join?</h2>
          <ul className="program-list">
            <li>
              <strong>Personalized 1-on-1 Classes</strong> – 100% focus on you, no distractions.
            </li>
            <li>
              <strong>Instant Doubt Resolution</strong> – Ask anytime, get answers immediately.
            </li>
            <li>
              <strong>Customized Study Plan</strong> – Learn according to your strengths & weaknesses.
            </li>
          </ul>
        </section>

        <section className="program-section">
          <h2 className="section-title">📚 Program Highlights</h2>
          <div className="highlight-grid">
            <div className="highlight-item">
              <h3 className="highlight-title">1️⃣ One-on-One Learning</h3>
              <ul className="program-list">
                <li>Expert faculty dedicated only to you.</li>
                <li>Teaching adapted to your learning style.</li>
              </ul>
            </div>
            <div className="highlight-item">
              <h3 className="highlight-title">2️⃣ Daily Consistency</h3>
              <ul className="program-list">
                <li>
                  <strong>1 Hour Classes (Mon–Sat)</strong>
                </li>
                <li>Smooth, structured revision without stress.</li>
              </ul>
            </div>
            <div className="highlight-item">
              <h3 className="highlight-title">3️⃣ Testing & Analysis</h3>
              <ul className="program-list">
                <li>
                  <strong>Daily Mini Tests</strong> – Reinforce concepts.
                </li>
                <li>
                  <strong>Weekly Subject Tests</strong> – Master entire topics.
                </li>
                <li>
                  <strong>Monthly Grand Tests</strong> – Full JEE Main simulation.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="program-section">
          <h2 className="section-title">💰 Fee Particulars</h2>
          <ul className="program-list">
            <li>
              <strong>Each Subject:</strong> ₹70,000
            </li>
            <li>
              <strong>1st Payment:</strong> 1st October 2025
            </li>
            <li>
              <strong>2nd Payment:</strong> 15th November 2025
            </li>
          </ul>
        </section>

        <section className="program-section">
          <h2 className="section-title">📝 Exams Info</h2>
          <div className="exams-grid">
            <div className="exams-item">
              <h3 className="highlight-title">🔹 Weekend Test Schedule</h3>
              <ul className="program-list">
                <li>
                  <strong>10 Weekend Exams</strong>
                </li>
                <li>Dates: 12th October 2025 – 28th December 2025</li>
                <li>Every Sunday</li>
              </ul>
            </div>
            <div className="exams-item">
              <h3 className="highlight-title">🔹 Cumulative Test Schedule</h3>
              <ul className="program-list">
                <li>
                  <strong>3 Cumulative Exams</strong>
                </li>
                <li>Dates: 9th November 2025, 7th December 2025, 4th January 2026</li>
                <li>Every Sunday</li>
              </ul>
            </div>
            <div className="exams-item">
              <h3 className="highlight-title">🔹 Grand Test Schedule</h3>
              <ul className="program-list">
                <li>
                  <strong>6 Grand Tests</strong>
                </li>
                <li>Dates: 8th January 2026 – 21st January 2026</li>
                <li>Conducted across multiple days (Thu, Sun, Wed, Sat, Mon, Wed)</li>
              </ul>
            </div>
          </div>
          <p className="total-exams">
            ✅ <strong>Total Exams: 19</strong> (10 Weekend + 3 Cumulative + 6 Grand Tests)
          </p>
        </section>

        <section className="program-section outcome-section">
          <h2 className="section-title">🚀 Outcome</h2>
          <ul className="program-list">
            <li>Strengthen weak areas.</li>
            <li>Improve problem-solving speed.</li>
            <li>Build confidence for JEE Main 2026.</li>
          </ul>
        </section>
        <div className="enroll-section">
          <button className="enroll-button" onClick={handleEnrollClick}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionProgramDetails;