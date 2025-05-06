import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Electron Academy</h1>
        <p>Personalized one-on-one online tuition through Zoom</p>
        <Link to="/book-demo" className="hero-btn">Book a Free Demo</Link>
      </section>
      <section className="subjects">
        <h2>Subjects We Teach</h2>
        <div className="subject-list">
          <div className="subject-card">📘 Math</div>
          <div className="subject-card">🔬 Science</div>
          <div className="subject-card">🧪 Chemistry</div>

        </div>
      </section>
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1️⃣ Book a Free Demo</h3>
            <p>Schedule a trial class to see how one-on-one learning fits your child.</p>
          </div>
          <div className="step">
            <h3>2️⃣ Meet Your Tutor</h3>
            <p>We assign a subject expert based on your needs and learning goals.</p>
          </div>
          <div className="step">
            <h3>3️⃣ Learn & Track Progress</h3>
            <p>Attend sessions via Zoom. Parents get progress updates weekly.</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Why Choose Electron Academy?</h2>
        <div className="benefit-cards">
          <div className="card">
            <span className="icon">🧑‍🏫</span>
            <h3>One-on-One Learning</h3>
            <p>Personalized attention to address each student's learning style, pace, and needs.</p>
          </div>
          <div className="card">
            <span className="icon">🌐</span>
            <h3>Convenience from Anywhere</h3>
            <p>Attend classes from home, saving travel time and ensuring a safe learning environment.</p>
          </div>
          <div className="card">
            <span className="icon">⏱️</span>
            <h3>Save Time</h3>
            <p>No commuting, no waiting—just focused learning at scheduled slots that suit you.</p>
          </div>
          <div className="card">
            <span className="icon">💰</span>
            <h3>Save Money</h3>
            <p>Affordable tuition plans without the need for expensive coaching centers or transport.</p>
          </div>
          <div className="card">
            <span className="icon">👨‍👩‍👧‍👦</span>
            <h3>Parents Can Join</h3>
            <p>Parents can attend classes with their children and monitor progress in real-time from anywhere.</p>
          </div>
        </div>
      </section>
      <section className="stats">
        <h2>Trusted by Hundreds of Families</h2>
        <div className="stat-grid">
          <div className="stat">
            <h3>500+</h3>
            <p>Happy Students</p>
          </div>
          <div className="stat">
            <h3>100%</h3>
            <p>Parent Satisfaction</p>
          </div>
          <div className="stat">
            <h3>10+</h3>
            <p>Expert Tutors</p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="testimonials">
        <h2>Parent Success Stories</h2>
        <div className="testimonial-list">
          <div className="testimonial-card">
            <img src="https://ui-avatars.com/api/?name=Sai+Rao&background=a0a0a0&color=fff" alt="Mrs. Rao" className="testimonial-avatar" />
            <div>
              <p>"My daughter was struggling with math, but with one-on-one help, her confidence has soared."</p>
              <strong>– Mrs. Rao, Hyderabad</strong>
            </div>
          </div>
          <div className="testimonial-card">
            <img src="https://ui-avatars.com/api/?name=Harshitha+Sharma&background=a0a0a0&color=fff" alt="Mr. Sharma" className="testimonial-avatar" />
            <div>
              <p>"As a working parent, I love that I can join the session from my office and track my son's learning."</p>
              <strong>– Mr. Sharma, Bangalore</strong>
            </div>
          </div>
          <div className="testimonial-card">
            <img src="https://ui-avatars.com/api/?name=Vamshi+Gupta&background=a0a0a0&color=fff" alt="Mrs. Gupta" className="testimonial-avatar" />
            <div>
              <p>"Great teachers and flexible timing. My child now looks forward to study time!"</p>
              <strong>– Mrs. Gupta, Delhi</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h4>Q: What grades do you teach?</h4>
          <p>A: We offer personalized tuition for Grades 1 to 12 in various subjects.</p>
        </div>
        <div className="faq-item">
          <h4>Q: Are the classes recorded?</h4>
          <p>A: Yes, we provide class recordings upon request for revision purposes.</p>
        </div>
        <div className="faq-item">
          <h4>Q: Can parents attend classes?</h4>
          <p>A: Absolutely. Parents are welcome to join and observe live sessions.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h3>Ready to start?</h3>
        <Link to="/book-demo" className="book-btn">Book Your Free Demo Now</Link>
      </section>
    </div>
  );
};

export default Home;
