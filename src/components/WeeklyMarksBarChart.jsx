// WeeklyMarksTrendGraph.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { useSelector, useDispatch } from "react-redux";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// MARK_SCHEMES (reused from your previous code for subject identification)
const MARK_SCHEMES = {
  JEE: { Maths: 100, Physics: 100, Chemistry: 100 },
  NEET: { Botany: 180, Zoology: 180, Physics: 180, Chemistry: 180 },
  FOUNDATION: { Maths: 15, Physics: 15, Chemistry: 15 },
  BITSAT: { Maths: 120, Physics: 90, Chemistry: 90, English: 30, "Logical Reasoning": 60 },
  CBSE: { Maths: 35, Physics: 35, Chemistry: 35 },
};

// Helper function (reused)
const formatSubjectNameForDisplay = (subjectKey) => {
  if (!subjectKey) return '';
  let formatted = subjectKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
  if (formatted.startsWith('Max')) {
    formatted = formatted.substring(3);
  }
  return formatted.trim();
};

const WeeklyMarksTrendGraph = ({ weeklyMarksData, programType }) => {

  if (!weeklyMarksData || weeklyMarksData.length === 0) {
    return <p>No weekly marks data available to display the trend graph.</p>;
  }

  // 1. Sort the data by date (and then timestamp for stability) to ensure correct chronological order for the line graph
  const sortedData = [...weeklyMarksData].sort((a, b) => {
    const dateA = a.weekDate ? parseISO(a.weekDate).getTime() : 0;
    const dateB = b.weekDate ? parseISO(b.weekDate).getTime() : 0;

    if (dateA === dateB) {
      const timestampA = a.timestamp ? (a.timestamp._seconds * 1000 + a.timestamp._nanoseconds / 1_000_000) : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timestampB = b.timestamp ? (b.timestamp._seconds * 1000 + b.timestamp._nanoseconds / 1_000_000) : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timestampA - timestampB;
    }
    return dateA - dateB;
  });

  // 2. Extract unique labels (dates) for the X-axis (shared across all individual graphs)
  const labels = sortedData.map(entry =>
    entry.weekDate ? format(parseISO(entry.weekDate), 'MMM dd, yyyy') : 'Unknown Date'
  );

  // 3. Determine subjects to track based on programType or dynamically
  let subjectsToTrack = [];
  if (programType && MARK_SCHEMES[programType]) {
    subjectsToTrack = Object.keys(MARK_SCHEMES[programType]).map(s => s.toLowerCase().replace(/\s/g, ""));
  } else {
    const allKeys = new Set();
    sortedData.forEach(entry => {
      for (const key in entry) {
        if (
          key !== 'id' && key !== 'userId' && key !== 'weekDate' &&
          key !== 'recordedBy' && key !== 'timestamp' && key !== 'createdAt' &&
          !key.startsWith('max') && typeof entry[key] === 'number' && entry.hasOwnProperty(`max${key}`)
        ) {
          allKeys.add(key);
        }
      }
    });
    subjectsToTrack = Array.from(allKeys);
  }
    const { user } = useSelector((state) => state.auth);

   const { AllowAll, isPhysics, isChemistry } = user// Destructure with default empty object for safety

  if (AllowAll) {
    // If 'allowAll' is true, show all subjects found for the programType
    subjectsToTrack = subjectsToTrack;
  } else if (isPhysics) {
    // If 'isPhysics' is true, filter for subjects that include 'physics'
    subjectsToTrack = subjectsToTrack.filter(sub => sub.toLowerCase().includes('physics'));
  } else if (isChemistry) {
    // If 'isChemistry' is true, filter for subjects that include 'chemistry'
    subjectsToTrack = subjectsToTrack.filter(sub => sub.toLowerCase().includes('chemistry'));
  } else {
    // Default case: if no specific permission allows any subjects, show none.
    subjectsToTrack = [];
  }

  // Define a set of consistent colors for individual graphs
  const graphColors = [
    'rgba(75, 192, 192, 1)',   // Teal
    'rgba(255, 99, 132, 1)',   // Red
    'rgba(54, 162, 235, 1)',   // Blue
    'rgba(255, 206, 86, 1)',   // Yellow
    'rgba(153, 102, 255, 1)',  // Purple
    'rgba(255, 159, 64, 1)',   // Orange
    'rgba(192, 75, 75, 1)',    // Muted Red
    'rgba(75, 75, 192, 1)',    // Muted Blue
    'rgba(192, 192, 75, 1)',   // Olive
    'rgba(75, 192, 75, 1)',    // Green
  ];

  // 4. Render a separate chart for each subject
  return (
    <div>
      {subjectsToTrack.length === 0 ? (
        <p>No subjects found to display individual trend graphs.</p>
      ) : (
        subjectsToTrack.map((subjectKey, index) => {
          const subjectDisplayName = formatSubjectNameForDisplay(subjectKey);
          const dataForSubject = sortedData.map(entry => entry[subjectKey] !== undefined ? entry[subjectKey] : null);

          // Find the maximum possible score for this subject
          let maxScore = null;
          if (programType && MARK_SCHEMES[programType] && MARK_SCHEMES[programType][subjectDisplayName]) {
              maxScore = MARK_SCHEMES[programType][subjectDisplayName];
          } else {
              // Dynamically find max score from data if programType is 'Others' or specific max key exists
              const maxKey = `max${subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)}`; // e.g., maxMaths
              const relevantMaxScores = sortedData.map(entry => entry[maxKey]).filter(val => typeof val === 'number');
              if (relevantMaxScores.length > 0) {
                  maxScore = Math.max(...relevantMaxScores);
              }
          }

          // Generate data and options for this specific subject's chart
          const chartData = {
            labels: labels,
            datasets: [
              {
                label: `${subjectDisplayName} Marks`,
                data: dataForSubject,
                borderColor: graphColors[index % graphColors.length],
                backgroundColor: graphColors[index % graphColors.length].replace('1)', '0.2)'),
                fill: false,
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false, // Hide legend for individual graphs as title already indicates subject
              },
              title: {
                display: true,
                text: `${subjectDisplayName} Marks Trend`, // Title for individual subject graph
                font: {
                    size: 16, // Slightly larger title for clarity
                },
                color: '#333', // Darker color for title
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  title: function(context) {
                    return `Week: ${context[0].label}`;
                  },
                  label: function(context) {
                    const value = context.raw;
                    const maxPossible = maxScore !== null ? ` / ${maxScore}` : '';
                    return ` ${subjectDisplayName}: ${value !== null ? value : 'N/A'}${maxPossible}`;
                  }
                }
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Week Date',
                  color: '#555',
                },
                ticks: {
                    maxRotation: 45, // Rotate labels if they overlap
                    minRotation: 0,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Marks Obtained',
                  color: '#555',
                },
                max: maxScore !== null ? maxScore : undefined, // Set max y-axis based on subject scheme or detected max
              },
            },
          };

          // Only render chart if there's actual data for this subject (not all nulls)
          const hasValidData = dataForSubject.some(mark => mark !== null);
          if (!hasValidData) {
            return (
              <div key={subjectKey} className="chart-placeholder" style={{marginBottom: '20px'}}>
                <p>No valid data for {subjectDisplayName} to display a trend graph.</p>
              </div>
            );
          }

          return (
            <div key={subjectKey} style={{ width: '100%', height: '350px', marginBottom: '30px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default WeeklyMarksTrendGraph;