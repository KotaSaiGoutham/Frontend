// src/components/StudentPortfolio.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import './StudentPortfolio.css'; // Import the new CSS file

const StudentPortfolio = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/data/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch student details.');
        }

        setStudentData(data);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError(err.message || 'Could not load student data.');
        if (err.message.includes('authorized')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId, navigate]);

  if (isLoading) {
    return (
      <div className="loading-message">
        Loading Student Portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button
          onClick={() => navigate('/students')}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="not-found-message">
        Student not found.
        <button
          onClick={() => navigate('/students')}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Prepare marks data for Recharts
  const formattedMarksData = studentData.marks?.map(mark => ({
    name: mark.examName,
    Score: mark.score,
    Max: mark.maxScore,
  })) || [];

  // Prepare payments data for Recharts
  const formattedPaymentsData = studentData.payments?.map(payment => ({
    name: payment.month, // Use month name for X-axis
    Amount: payment.amount,
  })) || [];


  return (
    <div className="portfolio-container">
      {/* Header and Back Button */}
      <div className="portfolio-card portfolio-header">
        <h1>
          {studentData.name}'s Portfolio
        </h1>
        <button
          onClick={() => navigate('/students')}
          className="back-button"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Student Personal Details */}
      <div className="portfolio-card details-section">
        <h2>Personal Details</h2>
        <div className="details-grid">
          <p><span>Name:</span> {studentData.name}</p>
          <p><span>Gender:</span> {studentData.gender}</p>
          <p><span>Subject:</span> {studentData.subject}</p>
          <p><span>Total Classes Attended:</span> {studentData.totalClasses}</p>
          <p><span>Monthly Payment:</span> ₹{studentData.monthlyPayment}</p>
          <p>
            <span>Payment Status:</span>
            <span className={`payment-status-badge ${studentData.paymentStatus.toLowerCase()}`}>
              {studentData.paymentStatus}
            </span>
          </p>
          <p><span>Next Class:</span> {studentData.nextClass ? format(parseISO(studentData.nextClass), 'MMM dd, p') : 'N/A'}</p>
        </div>
      </div>

      {/* Marks Bar Graph Section */}
      <div className="portfolio-card graph-section">
        <h2>Marks Performance</h2>
        {formattedMarksData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={formattedMarksData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: 'var(--slate-gray)' }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--slate-gray)' }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Score" fill="var(--hot-pink)" name="Student Score" />
              <Bar dataKey="Max" fill="var(--bright-yellow)" name="Max Score" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data-message">No marks data available for this student.</p>
        )}
      </div>

      {/* Payments Bar Graph Section */}
      <div className="portfolio-card graph-section">
        <h2>Payment History</h2>
        {formattedPaymentsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={formattedPaymentsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: 'var(--slate-gray)' }} />
              <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fill: 'var(--slate-gray)' }} />
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']}/>
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Amount" fill="var(--dark-indigo)" name="Payment Amount" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data-message">No payment data available for this student.</p>
        )}
      </div>
    </div>
  );
};

export default StudentPortfolio;