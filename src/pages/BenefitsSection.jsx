import React, { useRef, useEffect } from 'react';
// Remove these imports as you won't be using react-feather icons anymore
// import { UserRoundCog, Globe, Timer, DollarSign, Users, ClipboardCheck } from 'lucide-react'; // Or 'react-feather' if that's what you're using
import './BenefitsSection.css'; // Assuming you have a CSS file for these benefits cards

const Benefits = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the item is visible
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, []);

  return (
    <section className="benefits">
      <h2>Why Choose Electron Academy?</h2>
      <div className="benefit-cards">
        {/* Card 1: One-on-One Learning */}
        <div className="card" ref={el => cardsRef.current[0] = el}>
          <div className="icon-container">
            <div className="value-icon">🧑‍🏫</div> {/* One-on-One Learning */}
          </div>
          <div className="card-content">
            <h3>One-on-One Learning</h3>
            <p>Personalized attention to address each student's learning style, pace, and needs.</p>
          </div>
        </div>

        {/* Card 2: Convenience from Anywhere */}
        <div className="card" ref={el => cardsRef.current[1] = el}>
          <div className="icon-container">
            <div className="value-icon">🌐</div> {/* Globe for Convenience */}
          </div>
          <div className="card-content">
            <h3>Convenience from Anywhere</h3>
            <p>Attend classes from home, saving travel time and ensuring a safe learning environment.</p>
          </div>
        </div>

        {/* Card 3: Save Time */}
        <div className="card" ref={el => cardsRef.current[2] = el}>
          <div className="icon-container">
            <div className="value-icon">⏱️</div> {/* Timer for Save Time */}
          </div>
          <div className="card-content">
            <h3>Save Time</h3>
            <p>No commuting, no waiting—just focused learning at scheduled slots that suit you.</p>
          </div>
        </div>

        {/* Card 4: Save Money */}
        <div className="card" ref={el => cardsRef.current[3] = el}>
          <div className="icon-container">
            <div className="value-icon">💰</div> {/* Money Bag for Save Money */}
          </div>
          <div className="card-content">
            <h3>Save Money</h3>
            <p>Affordable tuition plans without the need for expensive coaching centers or transport.</p>
          </div>
        </div>

        {/* Card 5: Parents Can Join */}
        <div className="card" ref={el => cardsRef.current[4] = el}>
          <div className="icon-container">
            <div className="value-icon">👨‍👩‍👧‍👦</div> {/* Family for Parents Can Join */}
          </div>
          <div className="card-content">
            <h3>Parents Can Join</h3>
            <p>Parents can attend classes with their children and monitor progress in real-time from anywhere.</p>
          </div>
        </div>

        {/* Card 6: Customized Micro Schedule & Tests */}
        <div className="card" ref={el => cardsRef.current[5] = el}>
          <div className="icon-container">
            <div className="value-icon">📝</div> {/* Memo/Clipboard for Schedule & Tests */}
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