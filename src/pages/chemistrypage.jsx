import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SubjectDetailPage.css'; // Assuming a shared CSS file for detail pages
import { Link } from "react-router-dom";

const ChemistryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.15, // Stagger children slightly
        delayChildren: 0.2,    // Delay the start of children animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="subject-detail-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="main-heading" variants={itemVariants}>
        Chemistry: Understanding Matter and Its Transformations
      </motion.h1>
      <motion.p className="intro-text" variants={itemVariants}>
        Chemistry is the scientific study of the properties and behavior of matter.
        It is a natural science that covers the elements that make up matter to the
        compounds composed of atoms, molecules, and ions: their composition, structure,
        properties, behavior, and the changes they undergo during reactions with other substances.
      </motion.p>

      <div className="section-separator" />

      <motion.h2 className="section-heading" variants={itemVariants}>
        Why Master Chemistry with Our One-on-One Classes?
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        In a world driven by scientific advancement, a strong chemistry foundation is essential.
        Our one-on-one online classes break down complex chemical concepts into clear knowledge
        through personalized attention and immediate doubt resolution.
      </motion.p>
      <motion.ul className="feature-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Personalized Learning Path',
            desc: 'Custom study plans tailored to your pace, strengths, and areas for improvement in chemistry.',
          },
          {
            title: 'Expert & Engaging Tutors',
            desc: 'Learn from passionate chemistry educators who make complex chemical concepts relatable with real-world applications.',
          },
          {
            title: 'Deep Conceptual Clarity',
            desc: 'Focus on understanding fundamental chemical principles to apply them confidently in diverse scenarios.',
          },
          {
            title: 'Targeted Exam Preparation',
            desc: 'Curriculum aligned for top scores in Boards, JEE, or NEET, focusing on both theoretical and practical problem-solving.',
          },
        ].map((item, index) => (
          <motion.li
            key={index}
            className="feature-item-row"
            variants={itemVariants}
            whileHover={{ backgroundColor: '#e2eaf5' }}
            transition={{ duration: 0.2 }}
          >
            <strong>{item.title}:</strong> {item.desc}
          </motion.li>
        ))}
      </motion.ul>

      <div className="section-separator" />

      <motion.h2 className="section-heading" variants={itemVariants}>
        What We Teach in Chemistry
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        Our comprehensive chemistry curriculum ensures a holistic understanding and strong problem-solving skills across all branches.
      </motion.p>
      <motion.ul className="curriculum-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Physical Chemistry',
            desc: 'Atomic Structure, Chemical Bonding, States of Matter, Thermodynamics, Chemical Kinetics, Electrochemistry.',
          },
          {
            title: 'Inorganic Chemistry',
            desc: 'Periodic Properties, s, p, d, f-block elements, Coordination Compounds, Metallurgy, Environmental Chemistry.',
          },
          {
            title: 'Organic Chemistry',
            desc: 'Hydrocarbons, Alcohols, Phenols, Ethers, Aldehydes, Ketones, Carboxylic Acids, Amines, Biomolecules, Polymers, Reaction Mechanisms.',
          },
          {
            title: 'Analytical Chemistry',
            desc: 'Qualitative and Quantitative Analysis, Stoichiometry, Titrations, Spectroscopic Methods.',
          },
          {
            title: 'Advanced Problem-Solving',
            desc: 'Strategies and shortcuts for complex numerical and conceptual problems in JEE/NEET/Boards, including reasoning-based questions.',
          },
        ].map((item, index) => (
          <motion.li
            key={index}
            className="curriculum-item-row"
            variants={itemVariants}
            whileHover={{ backgroundColor: '#e2eaf5' }}
            transition={{ duration: 0.2 }}
          >
            <strong>{item.title}:</strong> {item.desc}
          </motion.li>
        ))}
      </motion.ul>

      <div className="section-separator" />

      <motion.h2 className="section-heading" variants={itemVariants}>
        Our Teaching Methodology
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        Our expert chemistry tutors simplify complex concepts through interactive sessions,
        real-time doubt clearing, and regular assessments, ensuring a deep understanding
        and strong problem-solving skills for every student.
      </motion.p>

      <motion.div
        className="learning-card"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2 className="card-title">Ready to Excel in Chemistry?</h2>
        <p className="card-subtext">
          Unravel the mysteries of matter with expert-led sessions and personalized guidance.
        </p>
         <Link to="/book-demo">
          <motion.button
            className="card-button"
            whileHover={{ scale: 1.05, backgroundColor: '#e0eaf5' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ChemistryPage;