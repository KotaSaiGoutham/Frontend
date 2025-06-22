import React, { useState, useEffect, useRef } from 'react';
import CountUpNumber from './CountUpNumber'; // Make sure the path is correct

// Assuming yearsOfExcellence is calculated somewhere, e.g.:
const calculateYearsOfExcellence = () => {
  const foundationYear = 2020; // Example: Set your academy's foundation year
  const currentYear = new Date().getFullYear();
  return currentYear - foundationYear;
};

function StatsSection() { // Or whatever your parent component is called (e.g., Home, App)
  const [startCount, setStartCount] = useState(false);
  const statsRef = useRef(null); // Create a ref to attach to the section

  // Calculate years of excellence dynamically
  const yearsOfExcellence = calculateYearsOfExcellence();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is in view, start the count
            setStartCount(true);
            // Stop observing once it's in view and the animation should start
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    // Cleanup function: disconnect observer when component unmounts
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <section className="stats" ref={statsRef}> {/* Attach the ref here */}
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
          <div className="stat-icon">🤝</div>{" "}
          {/* Parent Satisfaction - Handshake for trust/agreement */}
          <h3>
            <CountUpNumber end={500} start={startCount} />
          </h3>
          <p>Parent Satisfaction</p>
        </div>
        <div className="stat">
          <div className="stat-icon">🧑‍🏫</div>{" "}
          {/* Expert Tutors - Teacher emoji */}
          <h3>
            <CountUpNumber end={30} start={startCount} />
          </h3>
          <p>Expert Tutors</p>
        </div>
        <div className="stat">
          <div className="stat-icon">📚</div>{" "}
          {/* Subjects Offered - Books emoji */}
          <h3>
            <CountUpNumber end={6} start={startCount} />
          </h3>
          <p>Subjects Offered</p>
        </div>
        <div className="stat">
          <div className="stat-icon">🏅</div>{" "}
          {/* Years of Excellence - Medal emoji */}
          <h3>
            <CountUpNumber end={yearsOfExcellence} start={startCount} />
          </h3>
          <p>Years of Excellence</p>
        </div>
      </div>
    </section>
  );
}

export default StatsSection; // Export your component