import React, { useRef, useState, useEffect } from 'react';
import "./Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, UserCheck, LineChart } from "lucide-react";
import Footer from "../components/Footer";
import { FaSmile, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import PhoneDialer from './PhoneDailer';
import { ChevronDown, ChevronUp } from "lucide-react";

const faculties = [
  {
    id: 1,
    name: "Dulam Vamshi Krishna",
    subject: "Physics",
    experience: 15,
    videoUrl: "https://www.youtube.com/embed/i_OE2PcGzBE?controls=1&modestbranding=1&rel=0",
    description:
      "Expert in Physics with 15 years of NEET & JEE teaching experience. Known for simplifying complex topics and boosting student confidence.",
    syllabus: "Covers Mechanics, Thermodynamics, Optics, Modern Physics.",
    teachingStyle:
      "Interactive sessions with concept clarity, problem-solving, and regular doubt clearing.",
  },
  {
    id: 2,
    name: "Karunakar",
    subject: "Chemistry",
    experience: 12,
    videoUrl: "https://www.youtube.com/embed/W8-lgVDTxCM?controls=1&modestbranding=1&rel=0",
    description:
      "Specialist in Organic Chemistry with focus on application-based learning. Excels in helping students ace exams.",
    syllabus:
      "Organic Chemistry, Physical Chemistry, Inorganic Chemistry, Reaction Mechanisms.",
    teachingStyle:
      "Hands-on examples, real-life applications, and formula memorization techniques.",
  },
];
const faqs = [
  {
    question: "What are the different timing options for the classes?",
    answer:
      "We offer flexible scheduling throughout the day, including early mornings and evenings, to suit school and coaching hours.",
  },
  {
    question:
      "Would I be able to ask doubts from my coaching exercises or my reference physics books?",
    answer:
      "Yes, we encourage students to bring doubts from coaching material (FIITJEE, Allen) and reference books like HC Verma, BM Sharma (Cengage), Irodov, and Pathfinder.",
  },
  {
    question:
      "Can I request help with revision for my upcoming JEE Main or Advanced level mock tests?",
    answer:
      "Absolutely. We assist in structured revision sessions, mock paper discussions, and pinpointing weak topics to improve performance.",
  },
  {
    question: "What is the effectiveness of these specialized physics classes?",
    answer:
      "Our one-to-one sessions ensure full attention, custom pacing, and focused learning, leading to better understanding and exam confidence.",
  },
  {
    question: "What qualifications do the faculty have?",
    answer:
      "Our tutors are NEET/JEE experts with 10–20 years of experience and hold degrees from top institutions like IITs/NITs.",
  },
  {
    question: "Can I choose my faculty?",
    answer:
      "Yes, after your demo session, you can continue with the same tutor or request a different one based on your comfort.",
  },
  {
    question: "How do I pay for the classes?",
    answer:
      "You can pay monthly or quarterly via UPI, bank transfer, or card. Invoices are provided for every transaction.",
  },
  {
    question: "Will I get class notes or practice material?",
    answer:
      "Yes, all classes come with digital notes and curated problem sets aligned to JEE/NEET syllabus.",
  },
  {
    question: "Are trial/demo classes available before enrollment?",
    answer:
      "Yes, we offer free demo sessions to help you evaluate the teaching quality and comfort with the tutor.",
  },
  {
    question: "Is there a performance tracking system?",
    answer:
      "We provide monthly progress reports and conduct regular mock tests to ensure you're on the right track.",
  },
];

const Home = () => {
  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);
  const [selectedId, setSelectedId] = useState(faculties[0].id);
  const selectedFaculty = faculties.find((f) => f.id === selectedId);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold: 0.5 } // triggers when half visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <div className="home">
      <PhoneDialer />
      {/* Hero Section */}
 <section className="flash-banner">
  <img
    src="/intro-banner.jpeg"
    alt="Electron Academy Highlights"
    className="flash-image slide-in-banner"
  />
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
            <div className="step-header">
              <span className="icon">📅</span>
              <h3>Book a Free Demo</h3>
            </div>
            <p>Schedule a trial class to see how one-on-one learning fits your child.</p>
          </div>
          <div className="step">
            <div className="step-header">
              <span className="icon">👩‍🏫</span>
              <h3>Meet Your Tutor</h3>
            </div>
            <p>We assign a subject expert based on your needs and learning goals.</p>
          </div>
          <div className="step">
            <div className="step-header">
              <span className="icon">📈</span>
              <h3>Learn & Track Progress</h3>
            </div>
            <p>Attend sessions via Zoom. Parents get progress updates weekly.</p>
          </div>
        </div>
      </section>


      <section className="benefits">
        <h2>Why Choose Electron Academy?</h2>
        <div className="benefit-cards">
          <div className="card">
            <div className="icon-avatar">
              {/* Teacher Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 21a6.5 6.5 0 0113 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>One-on-One Learning</h3>
            <p>Personalized attention to address each student's learning style, pace, and needs.</p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Globe Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2a15.3 15.3 0 010 20" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2a15.3 15.3 0 000 20" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Convenience from Anywhere</h3>
            <p>Attend classes from home, saving travel time and ensuring a safe learning environment.</p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Clock Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Save Time</h3>
            <p>No commuting, no waiting—just focused learning at scheduled slots that suit you.</p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Money Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="10" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11v2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 9h4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 15h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Save Money</h3>
            <p>Affordable tuition plans without the need for expensive coaching centers or transport.</p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Family Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="7" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="7" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 21v-2a4 4 0 014-4h12a4 4 0 014 4v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Parents Can Join</h3>
            <p>Parents can attend classes with their children and monitor progress in real-time from anywhere.</p>
          </div>
        </div>
      </section>

      <section className="faculty-list-section">
        <h2 className="faculty-heading">Our Faculty</h2>

        {faculties.map((faculty, index) => {
          const isKarunakar = faculty.name === "Karunakar";

          return (
            <div
              key={faculty.id}
              className={`faculty-item ${isKarunakar ? "video-left" : "video-right"}`}
            >
              <div className="faculty-content">
                <h3>{faculty.name}</h3>
                <p className="subject-exp">
                  <strong>{faculty.subject}</strong> | {faculty.experience} years experience
                </p>
                <p>{faculty.description}</p>
                <p>
                  <strong>Syllabus Covered:</strong> {faculty.syllabus}
                </p>
                <p>
                  <strong>Teaching Style:</strong> {faculty.teachingStyle}
                </p>
              </div>

              <div className="faculty-video">
                <iframe
                  width="100%"
                  height="320"
                  src={faculty.videoUrl}
                  title={`${faculty.name} ${faculty.subject} Lecture`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          );
        })}
      </section>


      <section className="stats" ref={statsRef}>
        <h2>Trusted by Hundreds of Families</h2>
        <div className="stat-grid">
          <div className="stat">
            <FaSmile className="stat-icon" />
            <h3><CountUpNumber end={500} start={startCount} /></h3>
            <p>Happy Students</p>
          </div>
          <div className="stat">
            <FaUsers className="stat-icon" />
            <h3><CountUpNumber end={100} start={startCount} /></h3>
            <p>Parent Satisfaction</p>
          </div>
          <div className="stat">
            <FaChalkboardTeacher className="stat-icon" />
            <h3><CountUpNumber end={10} start={startCount} /></h3>
            <p>Expert Tutors</p>
          </div>
        </div>
      </section>


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

          {/* New Testimonials */}

          <div className="testimonial-card">
            <img src="https://ui-avatars.com/api/?name=Anjali+Patel&background=a0a0a0&color=fff" alt="Mrs. Patel" className="testimonial-avatar" />
            <div>
              <p>"The personalized attention has made a huge difference in my son's progress. Highly recommend!"</p>
              <strong>– Mrs. Patel, Mumbai</strong>
            </div>
          </div>

          <div className="testimonial-card">
            <img src="https://ui-avatars.com/api/?name=Rohan+Singh&background=a0a0a0&color=fff" alt="Mr. Singh" className="testimonial-avatar" />
            <div>
              <p>"Flexible schedules and patient tutors make Electron Academy the best choice for our family."</p>
              <strong>– Mr. Singh, Chennai</strong>
            </div>
          </div>

          <div className="testimonial-card">
            <img src="https://ui-avatars.com/api/?name=Neha+Kumar&background=a0a0a0&color=fff" alt="Mrs. Kumar" className="testimonial-avatar" />
            <div>
              <p>"My daughter’s grades improved significantly after joining, and she enjoys every class."</p>
              <strong>– Mrs. Kumar, Pune</strong>
            </div>
          </div>
        </div>
      </section>
   <section className="faq-section">
      <h2>
        Frequently Asked <span>Questions</span>
      </h2>
      <div className="faq-wrapper">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-card ${openIndex === index ? "open" : ""} ${
              index % 2 === 0 ? "slide-left" : "slide-right"
            }`}
          >
            <div className="faq-question" onClick={() => toggle(index)}>
              {faq.question}
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>


      {/* Call to Action */}
      <section className="cta">
        <h3>Ready to start?</h3>
        <Link to="/book-demo" className="book-btn">Book Your Free Demo Now</Link>
      </section>
      <Footer />

    </div>
  );
};

export default Home;
// CountUpNumber.jsx

function CountUpNumber({ end, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTimestamp = null;
    const duration = 1500; // animation duration in ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, end]);

  return <>{count}</>;
}


