// src/components/SubjectCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './SubjectCard.css'; // Create this CSS file for styling

const SubjectCard = ({ title, description, imageSrc, altText, redirectPath, delayClass }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleClick = () => {
    navigate(redirectPath); // Redirect to the specified path on click
  };

  return (
    <div className={`subject-card ${delayClass}`} onClick={handleClick}>
      <img src={imageSrc} alt={altText} />
      <h3>{title}</h3>
      <blockquote>{description}</blockquote>
    </div>
  );
};

export default SubjectCard;