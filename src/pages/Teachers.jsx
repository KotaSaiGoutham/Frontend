import React from 'react';
import './teachers.css'; // Link to your CSS file

const teachersData = [
    {
    name: "K.V.S.R.Raju",
    photo: "/faculty3.jpeg",
    subject: "Maths", // Subject is now Maths
    experience: "25+ years at Various Corporate Colleges",
    specialties: "NEET, JEE and BITSAT", // These specialties sound like science, let's adjust the bio
    // Bio updated to match Maths subject
    bio: "A highly experienced Mathematics teacher, K.V.S.R.Raju sir excels in clarifying intricate mathematical concepts, preparing students for both boards and competitive exams with ease."
  },
    {
    name: "Vamshi Krishna Dulam",
    photo: "/faculty2.jpeg",
    subject: "Physics", // Subject is now Chemistry
    experience: "16+ years at Various Corporate Colleges",
    specialties: "NEET, JEE and BITSAT", // These specialties sound like science, let's adjust the bio
    bio: "An accomplished Physics educator, Vamshi sir brings over 16 years of experience, simplifying complex chemical principles and fostering a deep understanding for students."
  },
  {
    name: "Karunakar Reddy Bollam",
    photo: "/faculty1.jpeg",
    subject: "Chemistry",
    experience: "15+ years at Various Corporate Colleges",
    specialties: "NEET, JEE and BITSAT", // These specialties sound like science, let's adjust the bio
    bio: "With over 15 years of experience, Karunakar Reddy Bollam is a distinguished Chemistry educator known for his ability to demystify complex chemical principles and foster a comprehensive understanding in students preparing for NEET, JEE, and BITSAT."
  },
];

const Teachers = () => {
  return (
    <div className="teachers-page">
      <h1 className="page-title">Meet Our Expert Faculty</h1>
      <div className="teacher-grid">
        {teachersData.map((teacher, index) => (
          <div className="teacher-card" key={index}>
            <div className="teacher-photo-frame">
              <img src={teacher.photo} alt={teacher.name} className="teacher-photo" />
            </div>
            <h3 className="teacher-name">{teacher.name}</h3>
            <p className="teacher-subject"><strong>Subject:</strong> {teacher.subject}</p>
            <p className="teacher-experience"><strong>Experience:</strong> {teacher.experience}</p>
            <p className="teacher-bio">{teacher.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;