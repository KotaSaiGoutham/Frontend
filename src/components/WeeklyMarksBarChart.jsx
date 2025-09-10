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
import { MARK_SCHEMES } from "../mockdata/Options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

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

const getColorByPercentage = (
  mark,
  maxScore,
  baseAlpha = 0.7,
  borderAlpha = 1
) => {
  if (mark === null || maxScore === null || maxScore === 0) {
    return {
      bgColor: `rgba(180, 180, 180, ${baseAlpha})`,
      borderColor: `rgba(100, 100, 100, ${borderAlpha})`,
    };
  }

  const percentage = (mark / maxScore) * 100;

  let r, g, b;

  if (percentage < 50) {
    r = 220;
    g = 53;
    b = 69;
  } else if (percentage >= 50 && percentage < 75) {
    r = 255;
    g = 193;
    b = 7;
  } else {
    r = 40;
    g = 167;
    b = 69;
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
  const AllowAll = user?.AllowAll || user.role === "student";
  const isPhysics = user?.isPhysics || false;
  const isChemistry = user?.isChemistry || false;

  // 1. Sort the data by examDate and createdAt (which replaces weekDate and timestamp)
  const sortedData = [...weeklyMarksData].sort((a, b) => {
    // Primary sort by examDate
    const dateA = a.examDate ? parseISO(a.examDate).getTime() : 0;
    const dateB = b.examDate ? parseISO(b.examDate).getTime() : 0;
    if (dateA !== dateB) {
      return dateA - dateB;
    }

    // Secondary sort by createdAt timestamp for consistency
    const timestampA = a.createdAt?.seconds
      ? a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1_000_000
      : 0;
    const timestampB = b.createdAt?.seconds
      ? b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1_000_000
      : 0;
    return timestampA - timestampB;
  });

  // 2. Extract unique labels (exam dates) for the X-axis
  const labels = sortedData.map((entry) =>
    entry.examDate
      ? format(parseISO(entry.examDate), "MMM dd, yyyy")
      : "Unknown Date"
  );

  // 3. Determine subjects to track based on programType or dynamically
  let subjectsToTrack = [];
  const effectiveProgramType = studentData?.Stream || programType;

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
          key !== "examDate" &&
          key !== "recordedBy" &&
          key !== "createdAt" &&
          key !== "studentId" && // Exclude these specific keys
          key !== "studentName" &&
          key !== "topic" &&
          key !== "status" &&
          key !== "stream" &&
          key !== "Subject" &&
          key !== "examName" &&
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
    "Exam Name",
    "Exam Date",
    ...subjectsToTrack.map((s) => formatSubjectNameForDisplay(s)),
  ];

  const bodyRows = sortedData.map((entry) => {
    const row = [
      entry.examName || "N/A",
      entry.examDate ? format(parseISO(entry.examDate), "dd/MM/yyyy") : "N/A",
    ];
    subjectsToTrack.forEach((key) => row.push(entry[key] ?? "N/A"));
    return row;
  });

  // --- Prepare Array of Chart Data and Options for PDF (Subject-wise) ---
  const pdfCharts = [];

  subjectsToTrack.forEach((subjectKey) => {
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

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: `${subjectDisplayName} Marks`,
          data: dataForSubject,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          datalabels: {
            anchor: "end",
            align: "top",
            offset: 4,
            color: "#444",
            font: {
              weight: "bold",
              size: 10,
            },
            formatter: function (value) {
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
      animation: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Exam Date",
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
            text: "Marks Obtained",
          },
          max: maxScore !== null ? maxScore * 1.1 : undefined,
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
          text: `${subjectDisplayName} Marks Trend`,
          font: { size: 14, weight: 'bold' },
          color: '#333'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const maxPossible = maxScore !== null ? ` / ${maxScore}` : "";
              return ` ${subjectDisplayName}: ${
                value !== null ? value : "N/A"
              }${maxPossible}`;
            },
          },
        },
        datalabels: {
          display: true,
        },
      },
    };

    const hasValidData = dataForSubject.some((mark) => mark !== null);
    if (hasValidData) {
      pdfCharts.push({ chartData, chartOptions, title: `${subjectDisplayName} Marks Trend` });
    }
  });

  return (
    <div className="weekly-marks-trend-container">
      {subjectsToTrack.length > 0 && (
        <div style={{ textAlign: "right", marginBottom: 20, paddingRight: 15 }}>
          <PdfDownloadButton
            title="Weekly Marks Report"
            headers={headerRow}
            rows={bodyRows}
            buttonLabel="Download Marks Report (PDF)"
            studentData={studentData}
            weekDate={
              sortedData.length > 0
                ? parseISO(sortedData[sortedData.length - 1].examDate)
                : new Date()
            }
            charts={pdfCharts}
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
            (mark) => getColorByPercentage(mark, maxScore, 0.8, 1).bgColor
          );
          const borderColors = dataForSubject.map(
            (mark) => getColorByPercentage(mark, maxScore, 0.8, 1).borderColor
          );

          const chartData = {
            labels: labels,
            datasets: [
              {
                label: `${subjectDisplayName} Marks`,
                data: dataForSubject,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderSkipped: false,
                datalabels: {
                  anchor: "end",
                  align: "top",
                  offset: 4,
                  color: "#444",
                  font: {
                    weight: "bold",
                    size: 14,
                  },
                  formatter: function (value) {
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
                color: '#333',
              },
              tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                  title: function (context) {
                    return `Exam Date: ${context[0].label}`;
                  },
                  label: function (context) {
                    const value = context.raw;
                    const maxPossible = maxScore !== null ? ` / ${maxScore}` : "";
                    return ` ${subjectDisplayName}: ${
                      value !== null ? value : "N/A"
                    }${maxPossible}`;
                  },
                },
              },
              datalabels: {
                display: true,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Exam Date",
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