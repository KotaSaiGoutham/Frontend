import React, { useRef, useEffect, useCallback } from 'react';
import './BenefitsSection.css'; // Make sure to import your CSS

// Import specific icons from lucide-react
import {
  UserRoundCog,      // For personalized/one-on-one learning
  Globe,             // NOW USING GLOBE for convenience from anywhere / global access
  Timer,             // For saving time / efficiency
  DollarSign,        // For saving money
  Users,             // For parents can join / community
  ClipboardCheck     // For customized schedules & tests / progress
} from 'lucide-react';

const Benefits = () => {
  const cardsRef = useRef([]);

  const observerCallback = useCallback((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    });

    cardsRef.current.forEach(card => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach(card => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, [observerCallback]);

  return (
    <section className="benefits">
      <h2>Why Choose Electron Academy?</h2>
      <div className="benefit-cards">
        {/* Card 1: One-on-One Learning */}
        <div className="card" ref={el => cardsRef.current[0] = el}>
          <div className="icon-container">
            <UserRoundCog size={48} strokeWidth={1.5} />
          </div>
          <div className="card-content">
            <h3>One-on-One Learning</h3>
            <p>Personalized attention to address each student's learning style, pace, and needs.</p>
          </div>
        </div>

        {/* Card 2: Convenience from Anywhere - ICON CHANGED TO GLOBE */}
        <div className="card" ref={el => cardsRef.current[1] = el}>
          <div className="icon-container">
            <Globe size={48} strokeWidth={1.5} /> {/* Changed from <Cloud /> */}
          </div>
          <div className="card-content">
            <h3>Convenience from Anywhere</h3>
            <p>Attend classes from home, saving travel time and ensuring a safe learning environment.</p>
          </div>
        </div>

        {/* Card 3: Save Time */}
        <div className="card" ref={el => cardsRef.current[2] = el}>
          <div className="icon-container">
            <Timer size={48} strokeWidth={1.5} />
          </div>
          <div className="card-content">
            <h3>Save Time</h3>
            <p>No commuting, no waiting—just focused learning at scheduled slots that suit you.</p>
          </div>
        </div>

        {/* Card 4: Save Money */}
        <div className="card" ref={el => cardsRef.current[3] = el}>
          <div className="icon-container">
            <DollarSign size={48} strokeWidth={1.5} />
          </div>
          <div className="card-content">
            <h3>Save Money</h3>
            <p>Affordable tuition plans without the need for expensive coaching centers or transport.</p>
          </div>
        </div>

        {/* Card 5: Parents Can Join */}
        <div className="card" ref={el => cardsRef.current[4] = el}>
          <div className="icon-container">
            <Users size={48} strokeWidth={1.5} />
          </div>
          <div className="card-content">
            <h3>Parents Can Join</h3>
            <p>Parents can attend classes with their children and monitor progress in real-time from anywhere.</p>
          </div>
        </div>

        {/* Card 6: Customized Micro Schedule & Tests */}
        <div className="card" ref={el => cardsRef.current[5] = el}>
          <div className="icon-container">
            <ClipboardCheck size={48} strokeWidth={1.5} />
          </div>
          <div className="card-content">
            <h3>Customized Micro Schedule & Tests</h3>
            <p>Personalized small-step schedules and regular tests to ensure steady progress.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;