import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SubjectDetailPage.css';
import { Link } from "react-router-dom";

const PhysicsPage = () => {
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
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
        Physics: The Fundamental Laws of the Universe
      </motion.h1>
      <motion.p className="intro-text" variants={itemVariants}>
        Physics is the natural science that studies matter, its fundamental constituents,
        its motion and behavior through space and time, and the related entities of
        energy and force. It is one of the most fundamental scientific disciplines,
        aiming to understand how the universe behaves.
      </motion.p>

      <div className="section-separator" />

      <motion.h2 className="section-heading" variants={itemVariants}>
        Why Master Physics with Our One-on-One Classes?
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        In a world driven by innovation, a strong physics foundation is invaluable.
        Our one-on-one online classes transform complex concepts into clear knowledge
        through personalized attention and immediate doubt resolution.
      </motion.p>
      <motion.ul className="feature-list one-column" variants={containerVariants}> {/* Added one-column class */}
        {[
          {
            title: 'Personalized Learning Path',
            desc: 'Custom study plans tailored to your pace, strengths, and areas for improvement.',
          },
          {
            title: 'Expert & Engaging Tutors',
            desc: 'Learn from passionate educators who make physics relatable with real-world examples.',
          },
          {
            title: 'Deep Conceptual Clarity',
            desc: 'Focus on understanding fundamental principles to apply them confidently.',
          },
          {
            title: 'Targeted Exam Preparation',
            desc: 'Curriculum aligned for top scores in Boards, JEE, or NEET.',
          },
        ].map((item, index) => (
          <motion.li
            key={index}
            className="feature-item-row" // New class for row-wise content
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
        What We Teach in Physics
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        Our comprehensive curriculum ensures a holistic understanding and strong problem-solving skills.
      </motion.p>
      <motion.ul className="curriculum-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Classical Mechanics',
            desc: 'Foundations of motion, forces, energy, and momentum, including Newton’s Laws and rotational dynamics.',
          },
          {
            title: 'Electromagnetism',
            desc: 'Electricity and magnetism, covering circuits, electric fields, and electromagnetic induction.',
          },
          {
            title: 'Thermodynamics',
            desc: 'Principles of heat, temperature, and energy transfer in physical and chemical processes.',
          },
          {
            title: 'Optics',
            desc: 'Behavior of light, including reflection, refraction, and wave optics phenomena.',
          },
          {
            title: 'Modern Physics',
            desc: 'Quantum Mechanics and Relativity, exploring the very small and very fast.',
          },
          {
            title: 'Advanced Problem-Solving',
            desc: 'Strategies and shortcuts for complex numerical problems in JEE/NEET/Boards.',
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
        Our expert tutors build strong conceptual foundations through interactive sessions,
        real-time doubt clearing, and regular assessments for an enriching experience.
      </motion.p>

      <motion.div
        className="learning-card"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2 className="card-title">Ready to Excel in Physics?</h2>
        <p className="card-subtext">
          Build a strong foundation with expert-led sessions and personalized guidance.
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

export default PhysicsPage;