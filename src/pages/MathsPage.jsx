import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SubjectDetailPage.css'; // Assuming a shared CSS file for detail pages
import { Link } from "react-router-dom";

const MathsPage = () => {
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
        Mathematics: Master the Language of Numbers and Logic
      </motion.h1>
      <motion.p className="intro-text" variants={itemVariants}>
        Mathematics is the study of quantity, structure, space, and change. It is an
        essential tool in many fields, including natural science, engineering, medicine,
        finance, and the social sciences. Our goal is to empower students with logical
        thinking and robust problem-solving skills.
      </motion.p>

      <div className="section-separator" />

      <motion.h2 className="section-heading" variants={itemVariants}>
        Why Master Mathematics with Our One-on-One Classes?
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        In a world increasingly driven by data and analytics, a strong mathematics foundation is key.
        Our one-on-one online classes demystify complex mathematical concepts, fostering logical
        thinking and problem-solving abilities through personalized attention and immediate doubt resolution.
      </motion.p>
      <motion.ul className="feature-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Personalized Learning Path',
            desc: 'Custom study plans tailored to your pace, strengths, and areas for improvement in mathematics.',
          },
          {
            title: 'Expert & Engaging Tutors',
            desc: 'Learn from passionate math educators who make abstract concepts relatable with practical examples.',
          },
          {
            title: 'Deep Conceptual Clarity',
            desc: 'Focus on understanding fundamental mathematical principles to apply them confidently in diverse problems.',
          },
          {
            title: 'Targeted Exam Preparation',
            desc: 'Curriculum aligned for top scores in Boards, JEE, NEET, or Olympiads, focusing on both theory and advanced problem-solving.',
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
        What We Teach in Mathematics
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        Our comprehensive mathematics curriculum ensures a holistic understanding and strong analytical skills across all major branches.
      </motion.p>
      <motion.ul className="curriculum-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Algebra',
            desc: 'Equations, Inequalities, Polynomials, Sequences and Series, Complex Numbers, Matrices and Determinants.',
          },
          {
            title: 'Calculus',
            desc: 'Limits, Continuity, Differentiation, Applications of Derivatives, Integration, Differential Equations, Area under Curves.',
          },
          {
            title: 'Coordinate Geometry',
            desc: 'Straight Lines, Circles, Parabola, Ellipse, Hyperbola, and 3D Geometry including Lines and Planes in space.',
          },
          {
            title: 'Trigonometry',
            desc: 'Trigonometric Identities, Equations, Inverse Trigonometric Functions, and Properties of Triangles.',
          },
          {
            title: 'Probability and Statistics',
            desc: 'Basic probability, Conditional probability, Bayes’ Theorem, Binomial Distribution, Measures of Central Tendency and Dispersion.',
          },
          {
            title: 'Vectors',
            desc: 'Vector Algebra, Dot Product, Cross Product, and their applications in geometry and physics.',
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
        Our expert mathematics tutors build strong conceptual foundations through interactive sessions,
        real-time doubt clearing, and rigorous problem-solving practice, ensuring an enriching and effective learning experience.
      </motion.p>

      <motion.div
        className="learning-card"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2 className="card-title">Ready to Excel in Mathematics?</h2>
        <p className="card-subtext">
          Unlock your full potential in numbers and logic with expert-led sessions and personalized guidance.
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

export default MathsPage;