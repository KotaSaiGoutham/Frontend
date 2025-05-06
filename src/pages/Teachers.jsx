import React from 'react';
import './teachers.css';

const teachersData = [
  {
    name: "Vamshi Krishna",
    subject: "Science",
    experience: "15+ years at Sri Chaitanya Jr. College",
    specialties: "NEET & JEE Mains Expert",
    avatar: "https://ui-avatars.com/api/?name=Vamshi+Krishna&background=a0a0a0"
  },
  {
    name: "Popuri Kaveri",
    subject: "Mathematics",
    experience: "12+ years in reputed institutes",
    specialties: "Boards, IIT Foundation, Conceptual Learning",
    avatar: "https://ui-avatars.com/api/?name=Popuri+Kaveri&background=a0a0a0"
  },
  {
    name: "Kota Goutham",
    subject: "Chemistry",
    experience: "8+ years in academic coaching",
    specialties: "NEET, JEE, Concept Clarity",
    avatar: "https://ui-avatars.com/api/?name=Kota+Goutham&background=a0a0a0"
  }
];

const Teachers = () => {
  return (
    <div className="teachers-page">
      <h1>Meet Our Expert Teachers</h1>
      <div className="teacher-grid">
        {teachersData.map((teacher, index) => (
          <div className="teacher-card" key={index}>
            <img src={teacher.avatar} alt={teacher.name} />
            <h3>{teacher.name}</h3>
            <p><strong>Subject:</strong> {teacher.subject}</p>
            <p><strong>Experience:</strong> {teacher.experience}</p>
            <p><strong>Specialties:</strong> {teacher.specialties}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
