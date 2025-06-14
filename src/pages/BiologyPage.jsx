import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SubjectDetailPage.css'; // Assuming a shared CSS file for detail pages
import { Link } from "react-router-dom";

const BiologyPage = () => {
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
        Biology: Discover the Science of Life and Living Organisms
      </motion.h1>
      <motion.p className="intro-text" variants={itemVariants}>
        Biology is the natural science that studies life and living organisms, including
        their physical structure, chemical processes, molecular interactions, physiological
        mechanisms, development, and evolution. It encompasses all forms of life, from the
        smallest microbes to the largest animals.
      </motion.p>

      <div className="section-separator" />

      <motion.h2 className="section-heading" variants={itemVariants}>
        Why Master Biology with Our One-on-One Classes?
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        In a rapidly evolving world, a strong biology foundation is crucial for future success.
        Our one-on-one online classes bring the complexities of life sciences to life,
        offering personalized attention and immediate doubt resolution.
      </motion.p>
      <motion.ul className="feature-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Personalized Learning Path',
            desc: 'Custom study plans tailored to your pace, strengths, and areas for improvement in biology.',
          },
          {
            title: 'Expert & Engaging Tutors',
            desc: 'Learn from passionate biology educators who make complex biological concepts relatable with real-world examples.',
          },
          {
            title: 'Deep Conceptual Clarity',
            desc: 'Focus on understanding fundamental biological principles to apply them confidently in diverse scenarios.',
          },
          {
            title: 'Targeted Exam Preparation',
            desc: 'Curriculum aligned for top scores in Boards, NEET, or other medical entrance exams, focusing on both theory and application.',
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
        What We Teach in Biology
      </motion.h2>
      <motion.p className="section-description" variants={itemVariants}>
        Our comprehensive biology curriculum ensures a holistic understanding and strong analytical skills across all branches of life science.
      </motion.p>
      <motion.ul className="curriculum-list one-column" variants={containerVariants}>
        {[
          {
            title: 'Cell Biology and Genetics',
            desc: 'Structure and function of cells, cell division, molecular basis of inheritance, Mendelian genetics, and genetic disorders.',
          },
          {
            title: 'Plant Physiology and Diversity',
            desc: 'Photosynthesis, respiration in plants, plant growth and hormones, transport in plants, and an overview of plant kingdom diversity.',
          },
          {
            title: 'Human Physiology and Anatomy',
            desc: 'Detailed study of human body systems (digestive, respiratory, circulatory, nervous, excretory, endocrine, reproductive) and their functions.',
          },
          {
            title: 'Ecology and Environment',
            desc: 'Ecosystems, biodiversity and conservation, environmental issues, population interactions, and adaptations.',
          },
          {
            title: 'Evolution and Classification of Organisms',
            desc: 'Theories of evolution, evidence for evolution, mechanisms of evolution, and the principles of biological classification.',
          },
          {
            title: 'Comprehensive Exam Preparation',
            desc: 'Strategies and techniques for excelling in competitive exams like NEET, focusing on concept application and critical thinking.',
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
        Our expert biology tutors use engaging visuals, interactive simulations, and real-world examples
        to simplify complex biological processes, ensuring students develop a deep understanding and
        strong critical thinking skills.
      </motion.p>

      <motion.div
        className="learning-card"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2 className="card-title">Ready to Excel in Biology?</h2>
        <p className="card-subtext">
          Explore the wonders of life with expert-led sessions and personalized guidance.
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

export default BiologyPage;