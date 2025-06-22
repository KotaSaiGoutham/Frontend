// WeeklyMarksTrendGraph.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // Required for line charts
  LineElement,  // Required for line charts
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import Line component for line charts
import { format, parseISO } from 'date-fns'; // For date formatting

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
  console.log("WeeklyMarksTrendGraph: received weeklyMarksData (array):", weeklyMarksData);
  console.log("WeeklyMarksTrendGraph: received programType:", programType);

  if (!weeklyMarksData || weeklyMarksData.length === 0) {
    console.warn("WeeklyMarksTrendGraph: 'weeklyMarksData' prop is empty or null. Cannot render trend graph.");
    return <p>No weekly marks data available to display the trend graph.</p>;
  }

  // 1. Sort the data by date (and then timestamp for stability) to ensure correct chronological order for the line graph
  const sortedData = [...weeklyMarksData].sort((a, b) => {
    const dateA = a.weekDate ? parseISO(a.weekDate).getTime() : 0;
    const dateB = b.weekDate ? parseISO(b.weekDate).getTime() : 0;

    // Fallback to timestamp if weekDate is identical or missing, for finer sorting
    if (dateA === dateB) {
        // Handle Firestore Timestamps and regular Date strings
        const timestampA = a.timestamp ? (a.timestamp._seconds * 1000 + a.timestamp._nanoseconds / 1_000_000) : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timestampB = b.timestamp ? (b.timestamp._seconds * 1000 + b.timestamp._nanoseconds / 1_000_000) : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timestampA - timestampB; // Ascending order by exact time
    }
    return dateA - dateB; // Ascending order by weekDate
  });

  // 2. Extract unique labels (dates) for the X-axis
  const labels = sortedData.map(entry =>
    entry.weekDate ? format(parseISO(entry.weekDate), 'MMM dd, yyyy') : 'Unknown Date'
  );

  // 3. Determine subjects to track based on programType or dynamically
  let subjectsToTrack = [];
  if (programType && MARK_SCHEMES[programType]) {
    // Get subjects from the predefined scheme
    subjectsToTrack = Object.keys(MARK_SCHEMES[programType]).map(s => s.toLowerCase().replace(/\s/g, ""));
    console.log("WeeklyMarksTrendGraph: Subjects from scheme:", subjectsToTrack);
  } else {
    // For 'Others' or any unspecified programType, dynamically find all mark-related keys
    const allKeys = new Set();
    sortedData.forEach(entry => {
      for (const key in entry) {
        // Exclude metadata fields and 'max' fields, ensure it's a number, and has a corresponding max score
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
    console.log("WeeklyMarksTrendGraph: Dynamically found subjects for 'Others' or fallback:", subjectsToTrack);
  }


  // 4. Create datasets for each subject
  const datasets = subjectsToTrack.map((subjectKey, index) => {
    // Generate a consistent color for each subject for visual distinction
    const colors = [
      'rgba(75, 192, 192, 1)',  // Teal
      'rgba(255, 99, 132, 1)',  // Red
      'rgba(54, 162, 235, 1)',  // Blue
      'rgba(255, 206, 86, 1)',  // Yellow
      'rgba(153, 102, 255, 1)', // Purple
      'rgba(255, 159, 64, 1)',  // Orange
      'rgba(192, 192, 75, 1)',  // Olive (add more if you have many subjects)
    ];
    const borderColor = colors[index % colors.length];

    return {
      label: formatSubjectNameForDisplay(subjectKey), // Display formatted subject name
      data: sortedData.map(entry => entry[subjectKey] !== undefined ? entry[subjectKey] : null), // Use null for missing data points for smooth line breaks
      borderColor: borderColor,
      backgroundColor: borderColor.replace('1)', '0.2)'), // Lighter fill for the area under the line
      fill: false, // Do not fill the area under the line to emphasize trend
      tension: 0.3, // Adds a slight curve to the lines
      pointRadius: 5, // Make individual data points visible
      pointHoverRadius: 7, // Enlarge points on hover
    };
  });

  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Weekly Marks Trend for ${programType || 'All Subjects'}`,
      },
      tooltip: {
        mode: 'index', // Show all dataset values for the hovered X-point
        intersect: false, // Tooltip shows even if not directly on a point
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week Date',
        },
        type: 'category', // Treat labels as distinct categories (dates)
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Marks Obtained',
        },
      },
    },
  };

  // Final check before rendering the chart
  if (labels.length === 0 || subjectsToTrack.length === 0 || datasets.every(ds => ds.data.every(d => d === null))) {
    return <p>No sufficient data to display the trend graph (dates, subjects, or valid marks missing).</p>;
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default WeeklyMarksTrendGraph;