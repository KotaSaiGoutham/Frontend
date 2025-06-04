import React, { useState, useRef, useEffect } from "react";
// Import your CSS file where the styles are defined
// Make sure this path is correct for your project
import "./FacultyList.css";

const faqs = [
  {
    question: "What are the class timings?",
    answer:
      "We offer flexible scheduling throughout the day, including early mornings and evenings, to suit school and coaching hours.",
  },
  {
    question: "Can I ask doubts from coaching materials?",
    answer:
      "Yes, we encourage students to bring doubts from coaching material (FIITJEE, Allen) and reference books like HC Verma, BM Sharma (Cengage), Irodov, and Pathfinder.",
  },
  {
    question: "Do you help with mock test revision?",
    answer:
      "Absolutely. We assist in structured revision sessions, mock paper discussions, and pinpointing weak topics to improve performance.",
  },
  {
    question: "How effective are these physics classes?",
    answer:
      "Our one-to-one sessions ensure full attention, custom pacing, and focused learning, leading to better understanding and exam confidence.",
  },
  {
    question: "What are the faculty qualifications?",
    answer:
      "Our tutors are NEET/JEE experts with 10–20 years of experience and hold degrees from top institutions like IITs/NITs.",
  },
  {
    question: "Can I choose my tutor?",
    answer:
      "Yes, after your demo session, you can continue with the same tutor or request a different one based on your comfort.",
  },
  {
    question: "What subjects do you cover?",
    answer:
      "Currently, we specialize exclusively in Physics for JEE Main, JEE Advanced, and NEET preparations, ensuring deep expertise.",
  },
  {
    question: "Is there a free trial class?",
    answer:
      "Yes, we offer a free demo class so you can experience our teaching methodology and assess the fit before committing.",
  },
];

const FAQSection = () => {
  // State to manage which FAQ card is currently open
  const [openIndex, setOpenIndex] = useState(null);

  // useRef for the main section to detect when it enters the viewport
  const sectionRef = useRef(null);
  // useRef to hold references to each individual FAQ card for Intersection Observer
  const faqCardRefs = useRef([]);
  // Clear refs on each render to ensure we're always working with current DOM elements
  faqCardRefs.current = [];

  // State to control the animation of the main section title
  const [sectionVisible, setSectionVisible] = useState(false);
  // State to control the visibility (and thus animation) of individual FAQ cards
  const [visibleFaqCards, setVisibleFaqCards] = useState({});

  // Function to toggle the open/closed state of an FAQ card
  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Helper function to add a DOM element reference to our faqCardRefs array
  const addFaqCardRef = (el) => {
    if (el && !faqCardRefs.current.includes(el)) {
      faqCardRefs.current.push(el);
    }
  };

  // useEffect hook for observing the main FAQ section
  // This triggers the title animation and enables observation of individual cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the section is intersecting (visible), set sectionVisible to true
        if (entry.isIntersecting) {
          setSectionVisible(true);
          // Disconnect the observer after the first intersection to animate only once
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    // Start observing the section if the ref is available
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup function: disconnect observer when component unmounts
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // useEffect hook for observing individual FAQ cards for staggered animations
  useEffect(() => {
    // Only proceed if the main section is already visible
    if (!sectionVisible) return;

    const cardObserver = new IntersectionObserver(
      (entries) => {
        // Use a functional update for setVisibleFaqCards to ensure latest state
        setVisibleFaqCards((prevVisibleCards) => {
          let updated = false;
          const newVisibleCards = { ...prevVisibleCards }; // Create a copy of previous state
          entries.forEach((entry) => {
            // If a card is intersecting and not yet marked as visible, mark it visible
            if (entry.isIntersecting && !newVisibleCards[entry.target.id]) {
              newVisibleCards[entry.target.id] = true;
              updated = true;
            }
          });
          // Only update state if something changed to prevent unnecessary re-renders
          return updated ? newVisibleCards : prevVisibleCards;
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the card is visible
        rootMargin: "0px", // No extra margin around the viewport
      }
    );

    // Observe each FAQ card
    faqCardRefs.current.forEach((cardRef) => {
      if (cardRef) {
        cardObserver.observe(cardRef);
      }
    });

    // Cleanup function: disconnect observer when component unmounts or sectionVisible changes
    return () => {
      cardObserver.disconnect();
    };
  }, [sectionVisible]); // Rerun this effect when sectionVisible state changes to true

  // Helper function to determine the animation direction (left or right) based on index
  const getCardAnimationClass = (index) => {
    // Even indexed cards slide from the left
    if (index % 2 === 0) {
      return 'slide-in-left';
    } else { // Odd indexed cards slide from the right
      return 'slide-in-right';
    }
  };

  return (
    <section className="faq-section" ref={sectionRef}>
      {/* Apply animation class to the title based on sectionVisible state */}
      <h2 className={sectionVisible ? 'fade-in-slide-up-title' : ''}>
        Frequently Asked <span>Questions</span>
      </h2>
      <div className="faq-wrapper">
        {faqs.map((faq, index) => {
          // Generate a unique ID for each card, important for Intersection Observer
          const cardId = `faq-card-${index}`;
          // Check if the current card is marked as visible by the Intersection Observer
          const isCardVisible = visibleFaqCards[cardId];
          // Get the specific animation class (slide-in-left or slide-in-right)
          const animationClass = getCardAnimationClass(index);

          return (
            <div
              key={cardId} // Unique key for React list rendering
              id={cardId} // Unique ID for Intersection Observer targeting
              // Combine base, open state, and animation classes
              className={`faq-card ${openIndex === index ? "open" : ""} ${isCardVisible ? animationClass : ''}`}
              onClick={() => toggleFAQ(index)} // Handle click to open/close FAQ
              ref={addFaqCardRef} // Assign ref to this card
              style={{
                // Stagger animation delay: increases with index if card is visible
                animationDelay: isCardVisible ? `${0.15 * index}s` : '0s',
                // Set initial opacity and transform based on visibility.
                // This ensures cards are hidden before animation and maintain their state after.
                opacity: isCardVisible ? 1 : 0,
                transform: isCardVisible ? 'none' : (index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)'),
              }}
            >
              <div className="faq-question">
                {faq.question}
                <span>{openIndex === index ? "−" : "+"}</span>
              </div>
              {/* faq-answer-wrapper for smooth height transition */}
              <div
                className="faq-answer-wrapper"
                style={{
                  // Dynamically set maxHeight and opacity for smooth expand/collapse
                  maxHeight: openIndex === index ? '200px' : '0', // Adjust '200px' if answers are longer
                  opacity: openIndex === index ? 1 : 0,
                  transition: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out',
                  overflow: 'hidden', // Hide overflow during transition
                }}
              >
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;