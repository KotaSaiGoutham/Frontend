import { useRef, useState, useEffect } from "react";
import "./FacultyList.css";

const FacultyShowcase = () => {
  const facultyList = [
    {
      name: "K.V.S.R.Raju",
      photo: "/faculty3.jpeg",
      subject: "Maths",
      experience: "25 yrs",
    },
    {
      name: "Vamshi Krishna Dulam",
      photo: "/faculty2.jpeg",
      subject: "Physics",
      experience: "16 yrs",
    },
    {
      name: "Karunakar Reddy Bollam",
      photo: "/faculty1.jpeg",
      subject: "Chemistry",
      experience: "15 yrs",
    },
  ];

  // useRef to store all the DOM node references without causing re-renders
  const cardRefs = useRef([]);
  // Clear refs on each render to ensure we only have current DOM nodes
  cardRefs.current = [];

  // State to store which cards are visible
  const [visibleCards, setVisibleCards] = useState({});

  // Effect to set up and tear down the Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleCards = { ...visibleCards }; // Create a mutable copy
        entries.forEach((entry) => {
          // Update the visibility state based on intersection
          if (entry.isIntersecting) {
            newVisibleCards[entry.target.id] = true;
          } else {
            // Optional: Set to false if you want cards to disappear on scroll out
            // newVisibleCards[entry.target.id] = false;
          }
        });
        // Only update state if there are actual changes to prevent unnecessary re-renders
        // This check is important for performance with Intersection Observer
        if (JSON.stringify(newVisibleCards) !== JSON.stringify(visibleCards)) {
             setVisibleCards(newVisibleCards);
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px",
      }
    );

    // Observe all current card refs
    cardRefs.current.forEach((cardRef) => {
      if (cardRef) {
        observer.observe(cardRef);
      }
    });

    // Cleanup function: disconnect observer when component unmounts or dependencies change
    return () => {
      observer.disconnect();
    };
  }, [visibleCards]); // Dependency on visibleCards is okay here for re-evaluation,
                     // but you might want to adjust if you observe many elements frequently.
                     // Often, you might not even need it if the logic is self-contained.
                     // For simpler cases, an empty dependency array `[]` would be used
                     // if the observer doesn't need to re-initialize based on state.
                     // Let's remove it for now to be safe, and add back if needed.
                     // The logic here is that we update visibleCards, which itself does not
                     // trigger a re-observation of new elements.
                     // The observer is created ONCE.
  // Re-thinking dependency: The observer itself needs to be stable across renders for performance.
  // If `visibleCards` is a dependency, the observer will re-initialize on every `setVisibleCards` call,
  // which is exactly what we want to avoid for performance.
  // The correct pattern is to use a functional update for `setVisibleCards` or use `useCallback` for the observer.
  // Let's go with the functional update approach for `setVisibleCards` to keep the observer stable.
  // The `useEffect` should ideally only run once or when the *elements being observed* change.

  // REVISED useEffect for better performance and correctness:
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Use a functional update for setVisibleCards to avoid `visibleCards`
        // as a dependency of this useEffect, preventing re-creation of observer.
        setVisibleCards((prevVisibleCards) => {
          let updated = false;
          const newVisibleCards = { ...prevVisibleCards };
          entries.forEach((entry) => {
            if (entry.isIntersecting && !newVisibleCards[entry.target.id]) {
              newVisibleCards[entry.target.id] = true;
              updated = true;
            }
            // If you want cards to disappear when scrolled out, uncomment this:
            // else if (!entry.isIntersecting && newVisibleCards[entry.target.id]) {
            //   newVisibleCards[entry.target.id] = false;
            //   updated = true;
            // }
          });
          return updated ? newVisibleCards : prevVisibleCards;
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px",
      }
    );

    // Observe all current card refs
    cardRefs.current.forEach((cardRef) => {
      if (cardRef) {
        observer.observe(cardRef);
      }
    });

    // Cleanup function: disconnect observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array: Observer is created once on mount

  // Helper to add ref to the array
  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) { // Ensure no duplicates are added
      cardRefs.current.push(el);
    }
  };


  // Helper to determine the animation type based on index (or other logic)
  const getAnimationType = (index) => {
    // Example: alternate between left and right
    if (index % 3 === 0) return 'slide-in-left';
    if (index % 3 === 1) return 'slide-in-right';
    return 'slide-in-bottom'; // Default for every third card
    // You could also add more complex logic, e.g.,
    // if (index === 0) return 'slide-in-top-left';
    // if (index === 1) return 'slide-in-top-right';
    // if (index === 2) return 'slide-in-bottom-left';
  };


  return (
    <section className="faculty-showcase">
      <div className="faculty-title-wrapper">
        <h2 className="faculty-title">Meet Our Expert Faculty</h2>
      </div>

      <div className="faculty-slider-wrapper">
        <div className="faculty-track">
          {facultyList.map((faculty, index) => {
            const cardId = `faculty-card-${index}`;
            const animationType = getAnimationType(index);
            const isCardVisible = visibleCards[cardId];

            return (
              <div
                id={cardId} // Assign a unique ID for Intersection Observer
                // Conditionally apply animation class, ensuring initial visibility for unseen cards
                className={`faculty-card ${isCardVisible ? animationType : ''}`}
                ref={addCardRef} // Use the helper function for ref
                style={{
                  // Stagger effect for cards as they become visible
                  animationDelay: isCardVisible ? `${(index % 3) * 0.15}s` : '0s',
                }}
                key={faculty.name}
              >
                <img src={faculty.photo} alt={faculty.name} />
                <h4>{faculty.name}</h4>
                <p className="faculty-subject">{faculty.subject}</p>
                <p className="faculty-exp">{faculty.experience}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FacultyShowcase;