import React, { useRef, useState, useEffect } from 'react';
import './Testimonials.css';

// No longer need to import individual image files

const Testimonials = () => {
  const testimonialsRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Helper function to get initials
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
      return parts[0][0].toUpperCase();
    }
    return ''; // Return empty string for empty names
  };

  const testimonialData = [
    {
      name: "Mrs. Rao",
      location: "Hyderabad",
      quote: "My daughter was struggling with math, but with dedicated one-on-one help, her confidence has absolutely soared. This academy truly makes a difference!",
      emphasis:true
    },
    {
      name: "Mr. Sharma",
      location: "Viajayawada",
      quote: "As a working parent, the flexibility to join sessions from my office and track my son's learning progress has been invaluable. A perfect fit for our busy schedule."
    },
    {
      name: "Mrs. Gupta",
      location: "Karimnagar",
      quote: "The teachers here are exceptional – incredibly patient and engaging. My child now genuinely looks forward to study time!",
      
    },
    {
      name: "Mrs. Patel",
      location: "Hyderabad",
      quote: "The personalized attention my son receives has made a profound difference in his academic progress. I cannot recommend this academy enough!"
    },
    {
      name: "Mr. Singh",
      location: "Chennai",
      quote: "Flexible schedules and patient tutors make Electron Academy the clear best choice for our family. Learning has never been this stress-free."
    },
    {
      name: "Mrs. Kumar",
      location: "Mumbai",
      quote: "My daughter’s grades have improved dramatically since she joined, and the best part is, she truly enjoys every single class now.",
            emphasis:true

    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  return (
    <section className="testimonials-section" ref={testimonialsRef}>
      <h2>What Parents Say About Us</h2>
      <div className="testimonial-grid">
        {testimonialData.map((testimonial, index) => (
          <div
            className={`testimonial-block ${isInView ? 'fade-in-up' : ''} ${testimonial.emphasis ? 'emphasis-block' : ''}`}
            key={index}
            style={{ animationDelay: isInView ? `${index * 0.1}s` : '0s' }}
          >
            <div className="quote-content">
              <p className="testimonial-quote">{testimonial.quote}</p>
            </div>
            <div className="author-info">
              {/* Replaced img with a div for initials */}
              <div className="author-initials">
                {getInitials(testimonial.name)}
              </div>
              <div className="author-details">
                <p className="author-name"><strong>{testimonial.name}</strong></p>
                <p className="author-location">{testimonial.location}</p>
                <div className="testimonial-rating">
                  <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span className="score">5.0/5</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;