// src/pages/ChemistryPage.jsx
import React from 'react';
import './SubjectDetailPage.css'; // Assuming a shared CSS file for detail pages

const ChemistryPage = () => {
  return (
    <div className="subject-detail-page">
      <h1>Chemistry: Understanding Matter and Its Transformations</h1>
      <p>
        Chemistry is the scientific study of the properties and behavior of matter.
        It is a natural science that covers the elements that make up matter to the
        compounds composed of atoms, molecules, and ions: their composition, structure,
        properties, behavior, and the changes they undergo during reactions with other substances.
      </p>
      <h2>What We Teach in Chemistry:</h2>
      <ul>
        <li>Physical Chemistry (Atomic Structure, Chemical Bonding, States of Matter)</li>
        <li>Inorganic Chemistry (Periodic Properties, Chemical Reactions)</li>
        <li>Organic Chemistry (Hydrocarbons, Functional Groups, Reaction Mechanisms)</li>
        <li>Analytical Chemistry (Qualitative and Quantitative Analysis)</li>
        <li>Problem-solving strategies for JEE/NEET/Boards and competitive exams</li>
      </ul>
      <p>
        Our experienced chemistry tutors simplify complex concepts, making chemical reactions
        and molecular structures easy to grasp, ensuring students build a strong foundation.
      </p>
      {/* Add more specific content, diagrams, or examples here */}
    </div>
  );
};

export default ChemistryPage;