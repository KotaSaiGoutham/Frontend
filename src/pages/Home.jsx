import React, { useRef, useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, UserCheck, LineChart } from "lucide-react";
import Footer from "../components/Footer";
import { FaSmile, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import PhoneDialer from "./PhoneDailer";
import { ChevronDown, ChevronUp } from "lucide-react";
import FacultyVideo from "./FacultyVideo";
import FlashBanner from "./FlashPlayer";
import FacultyShowcase from "./FacultyList";
import Testimonials from "./Testimonial";
import FacultyList from "./FacultyVideo";
import FAQSection from "./FAQSection";
const faculties = [
  {
    id: 1,
    name: "Vamshi Krishna Dulam",
    subject: "Physics",
    experience: 16,
    videoUrl:
      "https://www.youtube.com/embed/i_OE2PcGzBE?controls=1&modestbranding=1&rel=0",
    description:
      "Expert in Physics with 16 years of NEET,JEE and BITSAT teaching experience. Known for simplifying complex topics and boosting student confidence.",
    syllabus: "Covers Mechanics, Thermodynamics, Optics, Modern Physics.",
    teachingStyle:
      "Interactive sessions with concept clarity, problem-solving, and regular doubt clearing.",
  },
  {
    id: 2,
    name: "Karunakar Reddy Bollam",
    subject: "Chemistry",
    experience: 15,
    videoUrl:
      "https://www.youtube.com/embed/W8-lgVDTxCM?controls=1&modestbranding=1&rel=0",
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
console.log("faqs",faqs)
const facultyList = [
  {
    name: "Karunakar Reddy Bollam",
    photo: "/faculty1.jpeg",
    subject: "Physics",
    experience: "10+ yrs",
  },
  {
    name: "Vamshi Krishna Dulam",
    photo: "/faculty2.jpeg",
    subject: "Chemistry",
    experience: "8+ yrs",
  },
  {
    name: "K.V.S.R.Raju",
    photo: "/faculty3.jpeg",
    subject: "Maths",
    experience: "9+ yrs",
  },
  {
    name: "Mr. Sameer Khan",
    photo: "/faculty4.jpg",
    subject: "Physics",
    experience: "7 yrs",
  },
  {
    name: "Mrs. Anjali Das",
    photo: "/faculty5.jpg",
    subject: "Chemistry",
    experience: "6 yrs",
  },
  {
    name: "Mr. Arjun Rao",
    photo: "/faculty6.jpg",
    subject: "Maths",
    experience: "5 yrs",
  },
];
const Home = () => {
  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);
  const [selectedId, setSelectedId] = useState(faculties[0].id);
  const [openIndex, setOpenIndex] = useState(null);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowAll(true), 3000);
  //   return () => clearTimeout(timer);
  // }, []);
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
  
 // useRef to store all the DOM node references for steps
  const stepRefs = useRef([]);
  stepRefs.current = []; // Clear refs on each render to ensure we only have current DOM nodes

  // State to store which steps are visible
  const [visibleSteps, setVisibleSteps] = useState({});

  // Effect to set up and tear down the Intersection Observer for steps
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSteps((prevVisibleSteps) => {
          let updated = false;
          const newVisibleSteps = { ...prevVisibleSteps };
          entries.forEach((entry) => {
            if (entry.isIntersecting && !newVisibleSteps[entry.target.id]) {
              newVisibleSteps[entry.target.id] = true;
              updated = true;
            }
          });
          return updated ? newVisibleSteps : prevVisibleSteps;
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px",
      }
    );

    // Observe all current step refs
    stepRefs.current.forEach((stepRef) => {
      if (stepRef) {
        observer.observe(stepRef);
      }
    });

    // Cleanup function: disconnect observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array: Observer is created once on mount

  // Helper to add ref to the array
  const addStepRef = (el) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };

  // Helper to determine the animation type based on index
  const getStepAnimationType = (index) => {
    // We'll use different animations for each step for variety
    if (index === 0) return 'fade-in-up';     // First step fades up
    if (index === 1) return 'zoom-in';       // Second step zooms in
    if (index === 2) return 'slide-in-right'; // Third step slides from right
    return 'fade-in-up'; // Default, though we only have 3 steps here
  };


  return (
    <div className="home">
      <PhoneDialer />
      {/* Hero Section */}
      <FlashBanner />
<section className="subjects">
  <h2>Subjects We Teach</h2>
  <div className="subject-list">
    <div className="subject-card delay-1">
      <img
        src="https://www.svgrepo.com/show/3679/physics.svg"
        alt="Physics Icon"
      />
      <h3>Physics</h3>
      <blockquote>Explore the fundamental laws of the universe</blockquote>
    </div>

    <div className="subject-card delay-2">
      <img
        src="https://www.svgrepo.com/show/62122/chemistry.svg"
        alt="Chemistry Icon"
      />
      <h3>Chemistry</h3>
      <blockquote>Understand matter and its transformations</blockquote>
    </div>

    <div className="subject-card delay-3">
      <img
        src="/maths-icon.png" // adjust path if needed
        alt="Math Icon"
      />
      <h3>Maths</h3>
      <blockquote>Master the language of numbers and logic</blockquote>
    </div>

    <div className="subject-card delay-4">
      <img
        src="/biology-icon.png" // update to your image path
        alt="Biology Icon"
      />
      <h3>Biology</h3>
      <blockquote>Discover the science of life and living organisms</blockquote>
    </div>
  </div>
</section>





      <FacultyShowcase />

      <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps">
        {/* Map over the steps to dynamically add refs and classes */}
        {[1, 2, 3].map((stepNum, index) => { // Using a simple array for mapping as the content is hardcoded
          const stepId = `how-it-works-step-${index}`;
          const animationType = getStepAnimationType(index);
          const isStepVisible = visibleSteps[stepId];

          return (
            <div
              key={stepId}
              id={stepId}
              className={`step ${isStepVisible ? animationType : ''}`}
              ref={addStepRef}
              style={{
                // Stagger the animation of steps as they become visible
                animationDelay: isStepVisible ? `${index * 0.2}s` : '0s',
              }}
            >
              <div className="step-header">
                {/* Icons can be passed as props or determined by index */}
                <span className="icon">
                  {index === 0 && '📅'}
                  {index === 1 && '👩‍🏫'}
                  {index === 2 && '📈'}
                </span>
                <h3>
                  {index === 0 && 'Book a Free Demo'}
                  {index === 1 && 'Meet Your Tutor'}
                  {index === 2 && 'Learn & Track Progress'}
                </h3>
              </div>
              <p>
                {index === 0 && 'Schedule a trial class to see how one-on-one learning fits your child.'}
                {index === 1 && 'We assign a subject expert based on your needs and learning goals.'}
                {index === 2 && 'Attend sessions via Zoom. Parents get progress updates weekly.'}
              </p>
            </div>
          );
        })}
      </div>
    </section>

      <section className="benefits">
        <h2>Why Choose Electron Academy?</h2>
        <div className="benefit-cards">
          <div className="card">
            <div className="icon-avatar">
              {/* Teacher Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 21a6.5 6.5 0 0113 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>One-on-One Learning</h3>
            <p>
              Personalized attention to address each student's learning style,
              pace, and needs.
            </p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Globe Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="2"
                  y1="12"
                  x2="22"
                  y2="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2a15.3 15.3 0 010 20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2a15.3 15.3 0 000 20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Convenience from Anywhere</h3>
            <p>
              Attend classes from home, saving travel time and ensuring a safe
              learning environment.
            </p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Clock Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="12 6 12 12 16 14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Save Time</h3>
            <p>
              No commuting, no waiting—just focused learning at scheduled slots
              that suit you.
            </p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Money Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="10"
                  rx="2"
                  ry="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11v2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 9h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 15h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Save Money</h3>
            <p>
              Affordable tuition plans without the need for expensive coaching
              centers or transport.
            </p>
          </div>
          <div className="card">
            <div className="icon-avatar">
              {/* Family Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="9"
                  cy="7"
                  r="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="18"
                  cy="7"
                  r="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 21v-2a4 4 0 014-4h12a4 4 0 014 4v2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Parents Can Join</h3>
            <p>
              Parents can attend classes with their children and monitor
              progress in real-time from anywhere.
            </p>
          </div>

          {/* New Customized Micro Schedule & Tests card */}
          <div className="card">
            <div className="icon-avatar">
              {/* Calendar + Test Icon (combined) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14h8M8 18h8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Customized Micro Schedule & Tests</h3>
            <p>
              Personalized small-step schedules and regular tests to ensure
              steady progress.
            </p>
          </div>
        </div>
      </section>

   <FacultyVideo faculties={faculties}/>

      <section className="stats" ref={statsRef}>
        <h2>Trusted by Hundreds of Families</h2>
        <div className="stat-grid">
          <div className="stat">
            <FaSmile className="stat-icon" />
            <h3>
              <CountUpNumber end={500} start={startCount} />
            </h3>
            <p>Happy Students</p>
          </div>
          <div className="stat">
            <FaUsers className="stat-icon" />
            <h3>
              <CountUpNumber end={500} start={startCount} />
            </h3>
            <p>Parent Satisfaction</p>
          </div>
          <div className="stat">
            <FaChalkboardTeacher className="stat-icon" />
            <h3>
              <CountUpNumber end={30} start={startCount} />
            </h3>
            <p>Expert Tutors</p>
          </div>
        </div>
      </section>

  <Testimonials/>
<FAQSection/>

      {/* Call to Action */}
      <section className="cta">
        <h3>Ready to start?</h3>
        <Link to="/book-demo" className="book-btn">
          Book Your Free Demo Now
        </Link>
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
