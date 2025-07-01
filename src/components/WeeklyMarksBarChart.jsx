// WeeklyMarksTrendGraph.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";

import PdfDownloadButton from "./customcomponents/PdfDownloadButton";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the datalabels plugin
);

// MARK_SCHEMES (reused from your previous code for subject identification)
const MARK_SCHEMES = {
  JEE: { Maths: 100, Physics: 100, Chemistry: 100 },
  NEET: { Botany: 180, Zoology: 180, Physics: 180, Chemistry: 180 },
  FOUNDATION: { Maths: 15, Physics: 15, Chemistry: 15 },
  BITS: {
    Maths: 120,
    Physics: 90,
    Chemistry: 90,
    English: 30,
    "Logical Reasoning": 60,
  },
  CBSE: { Maths: 35, Physics: 35, Chemistry: 35 },
};

// Helper function (reused)
const formatSubjectNameForDisplay = (subjectKey) => {
  if (!subjectKey) return "";
  let formatted = subjectKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
  if (formatted.startsWith("Max")) {
    formatted = formatted.substring(3);
  }
  return formatted.trim();
};

/**
 * Determines a color (Red, Yellow, Green, or Gray) based on the mark's percentage.
 * @param {number} mark - The actual mark obtained.
 * @param {number} maxScore - The maximum possible score.
 * @param {number} [baseAlpha=0.7] - Alpha value for the background color.
 * @param {number} [borderAlpha=1] - Alpha value for the border color.
 * @returns {{bgColor: string, borderColor: string}} An object containing background and border color strings.
 */
const getColorByPercentage = (
  mark,
  maxScore,
  baseAlpha = 0.7,
  borderAlpha = 1
) => {
  if (mark === null || maxScore === null || maxScore === 0) {
    // Return a neutral/gray color for missing or invalid data
    return {
      bgColor: `rgba(180, 180, 180, ${baseAlpha})`, // Light gray
      borderColor: `rgba(100, 100, 100, ${borderAlpha})`, // Darker gray
    };
  }

  const percentage = (mark / maxScore) * 100;

  let r, g, b; // RGB components

  if (percentage < 50) {
    // Red for less than 50%
    r = 255;
    g = 99;
    b = 132; // Standard Chart.js red
  } else if (percentage >= 50 && percentage < 80) {
    // Yellow for 50-79%
    r = 255;
    g = 206;
    b = 86; // Standard Chart.js yellow
  } else {
    // percentage >= 80
    // Green for 80% and above
    r = 40;
    g = 167;
    b = 69; // Vibrant green
  }

  return {
    bgColor: `rgba(${r}, ${g}, ${b}, ${baseAlpha})`,
    borderColor: `rgba(${r}, ${g}, ${b}, ${borderAlpha})`,
  };
};

const WeeklyMarksTrendGraph = ({ weeklyMarksData, programType, studentData }) => {
  if (!weeklyMarksData || weeklyMarksData.length === 0) {
    return <p>No weekly marks data available to display the trend graph.</p>;
  }

  const { user } = useSelector((state) => state.auth);
  const AllowAll = user?.AllowAll || false;
  const isPhysics = user?.isPhysics || false;
  const isChemistry = user?.isChemistry || false;

  // 1. Sort the data by date (and then timestamp for stability) to ensure correct chronological order
  const sortedData = [...weeklyMarksData].sort((a, b) => {
    const dateA = a.weekDate ? parseISO(a.weekDate).getTime() : 0;
    const dateB = b.weekDate ? parseISO(b.weekDate).getTime() : 0;

    // Primary sort by date
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    // Secondary sort by timestamp if dates are identical (for consistent order)
    const timestampA = a.timestamp
      ? a.timestamp._seconds * 1000 + a.timestamp._nanoseconds / 1_000_000
      : a.createdAt
      ? new Date(a.createdAt).getTime()
      : 0;
    const timestampB = b.timestamp
      ? b.timestamp._seconds * 1000 + b.timestamp._nanoseconds / 1_000_000
      : b.createdAt
      ? new Date(b.createdAt).getTime()
      : 0;
    return timestampA - timestampB;
  });

  // 2. Extract unique labels (dates) for the X-axis (shared across all individual graphs)
  const labels = sortedData.map((entry) =>
    entry.weekDate
      ? format(parseISO(entry.weekDate), "MMM dd,yyyy")
      : "Unknown Date"
  );

  // 3. Determine subjects to track based on programType or dynamically
  let subjectsToTrack = [];
  const effectiveProgramType = studentData?.Stream || programType; // Use studentData.Stream if available

  if (effectiveProgramType && MARK_SCHEMES[effectiveProgramType]) {
    subjectsToTrack = Object.keys(MARK_SCHEMES[effectiveProgramType]).map((s) =>
      s.toLowerCase().replace(/\s/g, "")
    );
  } else {
    const allKeys = new Set();
    sortedData.forEach((entry) => {
      for (const key in entry) {
        if (
          key !== "id" &&
          key !== "userId" &&
          key !== "weekDate" &&
          key !== "recordedBy" &&
          key !== "timestamp" &&
          key !== "createdAt" &&
          !key.startsWith("max") &&
          typeof entry[key] === "number" &&
          entry.hasOwnProperty(
            `max${key.charAt(0).toUpperCase() + key.slice(1)}`
          )
        ) {
          allKeys.add(key);
        }
      }
    });
    subjectsToTrack = Array.from(allKeys);
  }

  // Filter subjects based on user permissions
  if (!AllowAll) {
    if (isPhysics) {
      subjectsToTrack = subjectsToTrack.filter((sub) =>
        sub.toLowerCase().includes("physics")
      );
    } else if (isChemistry) {
      subjectsToTrack = subjectsToTrack.filter((sub) =>
        sub.toLowerCase().includes("chemistry")
      );
    } else {
      subjectsToTrack = [];
    }
  }

  // --- Prepare Data for PDF Table ---
  const headerRow = [
    "Week Date",
    ...subjectsToTrack.map((s) => formatSubjectNameForDisplay(s)),
  ];

  const maxRow = ["Max"];
  subjectsToTrack.forEach((subKey) => {
    const display = formatSubjectNameForDisplay(subKey);
    const maxScore =
      effectiveProgramType && MARK_SCHEMES[effectiveProgramType]?.[display] != null
        ? MARK_SCHEMES[effectiveProgramType][display]
        : null;
    maxRow.push(maxScore ?? "—");
  });

  const bodyRows = sortedData.map((entry) => {
    const row = [
      entry.weekDate ? format(parseISO(entry.weekDate), "dd/MM/yyyy") : "N/A",
    ];
    subjectsToTrack.forEach((key) => row.push(entry[key] ?? "N/A"));
    return row;
  });

  // --- NEW: Prepare Data for Overall Performance Bar Graph for PDF ---
  let overallChartDataForPdf = null;
  let overallChartOptionsForPdf = null;

  if (subjectsToTrack.length > 0) {
    // Calculate total marks for each week
    const totalMarksPerWeek = sortedData.map(entry => {
      let weekTotal = 0;
      let maxWeekTotal = 0;
      subjectsToTrack.forEach(subjectKey => {
        const mark = entry[subjectKey];
        const display = formatSubjectNameForDisplay(subjectKey);
        const maxScoreForSubject = effectiveProgramType && MARK_SCHEMES[effectiveProgramType]?.[display] != null
          ? MARK_SCHEMES[effectiveProgramType][display]
          : null;

        if (typeof mark === 'number' && maxScoreForSubject !== null) {
          weekTotal += mark;
          maxWeekTotal += maxScoreForSubject;
        }
      });
      return { total: weekTotal, maxTotal: maxWeekTotal };
    });

    const marksData = totalMarksPerWeek.map(item => item.total);
    const maxMarksData = totalMarksPerWeek.map(item => item.maxTotal);

    // Get background/border colors based on overall performance percentage
    const backgroundColors = marksData.map((mark, idx) =>
      getColorByPercentage(mark, maxMarksData[idx], 0.7, 1).bgColor
    );
    const borderColors = marksData.map((mark, idx) =>
      getColorByPercentage(mark, maxMarksData[idx], 0.7, 1).borderColor
    );


    overallChartDataForPdf = {
      labels: labels,
      datasets: [
        {
          label: 'Total Marks',
          data: marksData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          datalabels: { // Add datalabels plugin configuration here
            anchor: "end",
            align: "top",
            offset: 4,
            color: "#444",
            font: {
              weight: "bold",
              size: 12,
            },
            formatter: function (value, context) {
              return value !== null ? value.toFixed(0) : "";
            },
            display: function (context) {
              return (
                context.dataset.data[context.dataIndex] !== null &&
                context.dataset.data[context.dataIndex] > 0
              );
            },
          },
        },
      ],
    };

    // Determine the maximum possible total score to set the Y-axis max
    const overallMaxScoreForChart = Math.max(...maxMarksData.filter(val => val > 0)); // Determine overall max for chart scale

    overallChartOptionsForPdf = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Week Date",
          },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Total Marks Obtained",
          },
          // Set max to the overall maximum possible score across all weeks, plus a small buffer
          max: overallMaxScoreForChart > 0 ? overallMaxScoreForChart * 1.1 : undefined,
          ticks: {
            callback: function (value) {
              if (Number.isInteger(value)) {
                return value;
              }
              return null;
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Overall Weekly Performance Trend',
          font: { size: 16, weight: 'bold' },
          color: '#333'
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const value = context.raw;
                    const maxPossible = maxMarksData[context.dataIndex]; // Use maxMarksData for specific week
                    return `Total: ${value} / ${maxPossible}`;
                }
            }
        },
        datalabels: {
            display: true
        }
      },
    };
  }
  // --- END NEW: Prepare Data for Overall Performance Bar Graph for PDF ---


  return (
    <div className="weekly-marks-trend-container">
      {/* Download PDF Button */}
      {subjectsToTrack.length > 0 && (
        <div style={{ textAlign: "right", marginBottom: 20, paddingRight: 15 }}>
          <PdfDownloadButton
            title="Weekly Marks Report"
            headers={headerRow}
            rows={bodyRows}
            summaryRow={maxRow}
            buttonLabel="Download Marks Report (PDF)"
            studentData={studentData}
            weekDate={
              sortedData.length > 0
                ? parseISO(sortedData[sortedData.length - 1].weekDate)
                : new Date()
            }
            chartData={overallChartDataForPdf}
            chartOptions={overallChartOptionsForPdf}
          />
        </div>
      )}

      {subjectsToTrack.length === 0 ? (
        <p>
          No subjects found to display individual trend graphs based on your
          permissions.
        </p>
      ) : (
        subjectsToTrack.map((subjectKey, index) => {
          const subjectDisplayName = formatSubjectNameForDisplay(subjectKey);
          const dataForSubject = sortedData.map((entry) =>
            entry[subjectKey] !== undefined ? entry[subjectKey] : null
          );

          let maxScore = null;
          if (
            effectiveProgramType &&
            MARK_SCHEMES[effectiveProgramType] &&
            MARK_SCHEMES[effectiveProgramType][subjectDisplayName]
          ) {
            maxScore = MARK_SCHEMES[effectiveProgramType][subjectDisplayName];
          } else {
            const maxKey = `max${
              subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)
            }`;
            const relevantMaxScores = sortedData
              .map((entry) => entry[maxKey])
              .filter((val) => typeof val === "number");
            if (relevantMaxScores.length > 0) {
              maxScore = Math.max(...relevantMaxScores);
            }
          }

          const backgroundColors = dataForSubject.map(
            (mark) => getColorByPercentage(mark, maxScore, 0.7, 1).bgColor
          );
          const borderColors = dataForSubject.map(
            (mark) => getColorByPercentage(mark, maxScore, 0.7, 1).borderColor
          );
          const hoverBackgroundColors = dataForSubject.map(
            (mark) => getColorByPercentage(mark, maxScore, 1, 1).bgColor
          );
          const hoverBorderColors = dataForSubject.map(
            (mark) => getColorByPercentage(mark, maxScore, 1, 1).borderColor
          );

          const chartData = {
            labels: labels,
            datasets: [
              {
                label: `${subjectDisplayName}`,
                data: dataForSubject,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                hoverBackgroundColor: hoverBackgroundColors,
                hoverBorderColor: hoverBorderColors,
                borderSkipped: false,
                datalabels: {
                  anchor: "end",
                  align: "top",
                  offset: 4,
                  color: "#444",
                  font: {
                    weight: "bold",
                    size: 12,
                  },
                  formatter: function (value, context) {
                    return value !== null ? value.toFixed(0) : "";
                  },
                  display: function (context) {
                    return (
                      context.dataset.data[context.dataIndex] !== null &&
                      context.dataset.data[context.dataIndex] > 0
                    );
                  },
                },
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `${subjectDisplayName} Marks Trend`,
                font: {
                  size: 18,
                  weight: "bold",
                },
                color: "#333",
              },
              tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                  title: function (context) {
                    return `Week: ${context[0].label}`;
                  },
                  label: function (context) {
                    const value = context.raw;
                    const maxPossible =
                      maxScore !== null ? ` / ${maxScore}` : "";
                    return ` ${subjectDisplayName}: ${
                      value !== null ? value : "N/A"
                    }${maxPossible}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Week Date",
                  color: "#555",
                  font: {
                    weight: "bold",
                  },
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 0,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Marks Obtained",
                  color: "#555",
                  font: {
                    weight: "bold",
                  },
                },
                max: maxScore !== null ? maxScore : undefined,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  callback: function (value) {
                    if (Number.isInteger(value)) {
                      return value;
                    }
                    return null;
                  },
                },
              },
            },
          };

          const hasValidData = dataForSubject.some((mark) => mark !== null);
          if (!hasValidData) {
            return (
              <div
                key={subjectKey}
                className="chart-placeholder"
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                  padding: "20px",
                  border: "1px dashed #ccc",
                  borderRadius: "8px",
                  color: "#666",
                }}
              >
                <p>
                  No valid data for {subjectDisplayName} to display a trend
                  graph.
                </p>
              </div>
            );
          }

          return (
            <div
              key={subjectKey}
              style={{
                width: "100%",
                height: "350px",
                marginBottom: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
              }}
            >
              <Bar data={chartData} options={chartOptions} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default WeeklyMarksTrendGraph;