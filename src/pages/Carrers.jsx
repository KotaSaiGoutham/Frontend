// JobOpenings.jsx

import React, { useEffect, useRef } from 'react';
import './Careers.css'; // Import the CSS file

// Define the Google Form URL here
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeeRvYmM0ZpCmPYxFHJp_FdxF_RZHfGCHzE70BNX0x5JMpS_Q/viewform?usp=preview"; // <--- REPLACE THIS

const JobCard = ({ title, experience, skills, salary, location, jobType, gradientClass, animationClass }) => {
  const shareContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareContainerRef.current && !shareContainerRef.current.contains(event.target)) {
        shareContainerRef.current.classList.remove('active');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleShareOptions = (event) => {
    event.stopPropagation();
    if (shareContainerRef.current) {
      shareContainerRef.current.classList.toggle('active');
    }
  };

  // Function to handle "Apply Now" click
  const handleApplyClick = () => {
    window.open(GOOGLE_FORM_URL, '_blank'); // Opens the Google Form in a new tab
  };

  return (
    <div className={`job-card ${animationClass}`}>
      <div className={`card-background-gradient ${gradientClass}`}></div>
      <h3 className="job-title">{title}</h3>
      <p className="job-subtitle"><strong>Required Experience:</strong> {experience}</p>
      <p className="job-subtitle"><strong>Required Skills:</strong> {skills}</p>
      <div className="job-info">
        {salary && <span className="info-item"><strong>Salary:</strong> {salary}</span>}
        {location && <span className="info-item"><strong>Location:</strong> {location}</span>}
        {jobType && <span className="info-item"><strong>Job Type:</strong> {jobType}</span>}
      </div>
      <div className="card-actions">
        {/* Attach the handler to the button */}
        <button className="apply-button" onClick={handleApplyClick}>Apply Now</button>
        <div className="share-container" ref={shareContainerRef}>
          <button className="share-button" onClick={toggleShareOptions}>
            <i className="fas fa-share-alt"></i>
          </button>
          <div className="social-share-options">
            <a href="#" className="social-icon facebook" aria-label="Share on Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon whatsapp" aria-label="Share on WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="#" className="social-icon linkedin" aria-label="Share on LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="social-icon twitter" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (rest of JobOpenings.jsx remains the same) ...

const Careers = () => {
  const jobListingsRef = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2 // Trigger when 20% of the card is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Determine animation direction based on index of the actual element in the DOM
          const elementIndex = Array.from(entry.target.parentNode.children).indexOf(entry.target);
          if (elementIndex % 2 === 0) {
            entry.target.classList.add('slide-in-left');
          } else {
            entry.target.classList.add('slide-in-right');
          }
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    jobListingsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      jobListingsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

const jobs = [
    {
    title: "Physics Tutor",
    experience: "5+ years, strong track record",
    skills: "JEE/NEET Prep, Zoom teaching, Concept clarity, Student engagement",
    salary: "Based on experience",
    location: "Remote",
    jobType: "Part-time / Full-time",
  },
  
  {
    title: "Chemistry Tutor",
    experience: "4+ years, proven teaching success",
    skills: "JEE/NEET Prep, Online teaching tools, Practical examples, Doubt resolution",
    salary: "Based on experience",
    location: "Remote",
    jobType: "Part-time",
  },
    {
    title: "Maths Tutor",
    experience: "5+ years, expertise in competitive exams",
    skills: "JEE/NEET/Boards Prep, Interactive online sessions, Problem-solving techniques",
    salary: "Based on experience",
    location: "Remote",
    jobType: "Part-time / Full-time",
  },
   {
    title: "Botany Tutor",
    experience: "3+ years, expertise in plant science",
    skills: "NEET/Boards Prep, Online diagrams, Specimen explanation, Concept visualization",
    salary: "Based on experience",
    location: "Remote",
    jobType: "Part-time / Full-time",
  },
{
  title: "Zoology Tutor",
  experience: "4+ years, strong foundation in animal biology and physiology",
  skills: "University Level/Competitive Exams, Animal classification, Human anatomy, Ecological studies",
  salary: "Based on experience",
  location: "Remote",
    jobType: "Part-time / Full-time",
},
  {
    title: "Typist",
    experience: "1–2 years",
    skills: "Fast typing, MS Word, Accuracy, Data Entry",
    salary: "Competitive",
    location: "Remote",
    jobType: "Full-time",
  },
  {
    title: "Student Counselor / Administrator",
    experience: "2-4 years in education administration or counseling",
    skills: "Student data management, Communication, CRM software, Demo class coordination, Guidance",
    salary: "Negotiable",
    location: "Remote",
    jobType: "Full-time",
  },


  {
    title: "Student Enrollment Specialist", 
    experience: "1-3 years in student recruitment or admissions",
    skills: "Lead management, Student onboarding, Communication, CRM, Goal-oriented",
    salary: "Competitive + Incentives",
    location: "Remote",
    jobType: "Full-time",
  },
  {
    title: "Demo Class Coordinator", 
    experience: "2+ years in scheduling or educational coordination",
    skills: "Scheduling, Communication, CRM, Student follow-up, Technical coordination (Zoom/Google Meet)",
    salary: "Negotiable",
    location: "Remote",
    jobType: "Full-time",
  },
 
];

// Define the array of gradient classes to cycle through
const gradientClasses = [
  'gradient-1', // Dark Indigo
  'gradient-2', // Deep Magenta
  'gradient-3', // Orange
  'gradient-4', // Slate Gray
  'gradient-5', // Golden Yellow
  'gradient-6', // Hot Pink
  'gradient-1', // Cycle back or add new ones like 'gradient-7', 'gradient-8' if defined
  'gradient-2'
  // Add more if you define more .gradient-X classes in CSS
];

  return (
    <section className="careers-section">
      <h2 className="section-title">Careers at Electron Academy</h2>
      <p className="section-description">
        Join our innovative team and help us shape the future of education! We're always looking for passionate
        individuals to contribute to our mission. Explore our current openings below.
      </p>
      <div className="job-listings-container">
        {jobs.map((job, index) => {
          // Calculate the gradient class index, ensuring it wraps around
          // and trying to avoid immediate repeats in a short sequence
          const colorIndex = index % gradientClasses.length;
          const assignedGradientClass = gradientClasses[colorIndex];

          return (
            <div
              key={index}
              ref={el => jobListingsRef.current[index] = el}
              className="job-card-wrapper" // Wrapper for individual card for observer
            >
              <JobCard
                title={job.title}
                experience={job.experience}
                skills={job.skills}
                salary={job.salary}
                location={job.location}
                jobType={job.jobType}
                gradientClass={assignedGradientClass}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Careers;