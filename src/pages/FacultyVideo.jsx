import React, { useEffect, useRef } from 'react';
import './FacultyList.css'; // Ensure your CSS file is correctly linked

const FacultyList = ({ faculties }) => {
  const facultyRefs = useRef([]); // Create a ref to hold all faculty item DOM nodes

  useEffect(() => {
    // Intersection Observer to add fade-in-up class when elements are in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before it's fully in view
      }
    );

    facultyRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      // Cleanup: disconnect the observer when the component unmounts
      facultyRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
      observer.disconnect();
    };
  }, [faculties]); // Re-run effect if faculties data changes

  return (
    <section className="faculty-list-section">
      <h2 className="faculty-heading">Our Founders & Faculty</h2>

      {faculties.map((faculty, index) => {
        const isKarunakar = faculty.name === "Karunakar Reddy Bollam";

        return (
          <div
            key={faculty.id}
            ref={(el) => (facultyRefs.current[index] = el)} // Assign ref to each item
            className={`faculty-item ${
              isKarunakar ? "faculty-layout-reverse" : "faculty-layout-normal"
            }`}
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

            <div className="faculty-video-wrapper">
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
  );
};

export default FacultyList;