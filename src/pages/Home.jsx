import React, { useRef, useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, UserCheck, LineChart } from "lucide-react";
import Footer from "../components/Footer";
import { FaSmile, FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaVideo } from 'react-icons/fa';
import PhoneDialer from "./PhoneDailer";
import { ChevronDown, ChevronUp } from "lucide-react";
import FacultyVideo from "./FacultyVideo";
import FlashBanner from "./FlashPlayer";
import FacultyShowcase from "./FacultyList";
import Testimonials from "./Testimonial";
import FacultyList from "./FacultyVideo";
import FAQSection from "./FAQSection";
import SubjectCard from "./SubjectCard";
import BenefitsSection from "./BenefitsSection";
import Benefits from "./BenefitsSection";
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
const getYearsOfExcellence = () => {
  const baseDate = new Date('2019-06-15'); // set your real start date
  const today = new Date();
  
  let years = today.getFullYear() - baseDate.getFullYear();

  // Check if current date is before June 15 of the current year
  const currentYearJune15 = new Date(today.getFullYear(), 5, 15); // Month is 0-based

  if (today < currentYearJune15) {
    years -= 1;
  }

  return years;
};

const yearsOfExcellence = getYearsOfExcellence();
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
  <h2>Explore Our Academic Subjects</h2>

  <div className="subject-list">
    <SubjectCard
      title="Physics"
      description="Unravel the laws that govern the universe"
      imageSrc="https://www.svgrepo.com/show/3679/physics.svg"
      altText="Physics Icon"
      redirectPath="/subjects/physics"
      delayClass="delay-1"
    />

    <SubjectCard
      title="Chemistry"
      description="Dive deep into the science of substances"
      imageSrc="https://www.svgrepo.com/show/62122/chemistry.svg"
      altText="Chemistry Icon"
      redirectPath="/subjects/chemistry"
      delayClass="delay-2"
    />

    <SubjectCard
      title="Mathematics"
      description="Develop logical reasoning & analytical skills"
      imageSrc="/maths-icon.png"
      altText="Math Icon"
      redirectPath="/subjects/maths"
      delayClass="delay-3"
    />

    <SubjectCard
      title="Biology"
      description="Understand life, organisms, and ecosystems"
      imageSrc="/biology-icon.png"
      altText="Biology Icon"
      redirectPath="/subjects/biology"
      delayClass="delay-4"
    />
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

    <Benefits/>

   <FacultyVideo faculties={faculties}/>

   <section className="stats" ref={statsRef}>
      <h2>Trusted by Hundreds of Families</h2>
      <div className="stat-grid">
        <div className="stat">
          <div className="stat-icon">😄</div> {/* Happy Students */}
          <h3>
            <CountUpNumber end={500} start={startCount} />
          </h3>
          <p>Happy Students</p>
        </div>
        <div className="stat">
          <div className="stat-icon">🤝</div> {/* Parent Satisfaction - Handshake for trust/agreement */}
          <h3>
            <CountUpNumber end={500} start={startCount} />
          </h3>
          <p>Parent Satisfaction</p>
        </div>
        <div className="stat">
          <div className="stat-icon">🧑‍🏫</div> {/* Expert Tutors - Teacher emoji */}
          <h3>
            <CountUpNumber end={30} start={startCount} />
          </h3>
          <p>Expert Tutors</p>
        </div>
        <div className="stat">
          <div className="stat-icon">📚</div> {/* Subjects Offered - Books emoji */}
          <h3><CountUpNumber end={6} start={startCount} /></h3>
          <p>Subjects Offered</p>
        </div>
        <div className="stat">
          <div className="stat-icon">🏅</div> {/* Years of Excellence - Medal emoji */}
          <h3><CountUpNumber end={yearsOfExcellence} start={startCount} /></h3>
          <p>Years of Excellence</p>
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
