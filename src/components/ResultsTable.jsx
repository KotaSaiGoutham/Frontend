import React from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChartLine,
  FaAward,
  FaExclamationTriangle,
  FaFlask,
  FaCalculator,
  FaAtom,
  FaRocket,
  FaCalendarAlt,
  FaGraduationCap,
  FaTrophy,
  FaBook,
  FaClipboardList,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaRegChartBar,
  FaUserGraduate,
  FaMedal,
  FaBullseye,
  FaLightbulb,
  FaCrown,
} from "react-icons/fa";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRevisionClasses,
  fetchRevisionExamConsolidation,
} from "../redux/actions";
import { isoToDDMMYYYY } from "../mockdata/function";

const ResultsTable = ({
  studentExams = [],
  loading = false,
  studentData = {},
  chartData = [],
}) => {
  const dispatch = useDispatch();
  const [sortField, setSortField] = React.useState("examDate");
  const [sortDirection, setSortDirection] = React.useState("desc");
  const {
    exams: consolidatedExams,
    summary,
    error,
  } = useSelector((state) => state.revisionExams.examConsolidation);
  console.log("consolidatedExams", consolidatedExams);

  useEffect(() => {
    dispatch(fetchRevisionExamConsolidation());
  }, [dispatch]);

  // Enhanced loading component
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 40px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          margin: "20px 0",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <h3
          style={{
            margin: "0 0 12px 0",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Loading Performance Data
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          Preparing your academic insights...
        </p>
      </div>
    );
  }

  // Filter exams for revision program students
  const filteredExams = studentData?.isRevisionProgramJEEMains2026Student
    ? studentExams.filter(
        (exam) => exam.isRevisionProgramJEEMains2026Student === true
      )
    : studentExams;

  // Enhanced grade system with emojis
  const getGrade = (percentage) => {
    if (percentage >= 90)
      return {
        grade: "A+",
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.15)",
        icon: "🏆",
        label: "Outstanding",
      };
    if (percentage > 80)
      return {
        grade: "A",
        color: "#34d399",
        bgColor: "rgba(52, 211, 153, 0.15)",
        icon: "⭐",
        label: "Excellent",
      };
    if (percentage > 70)
      return {
        grade: "B+",
        color: "#60a5fa",
        bgColor: "rgba(96, 165, 250, 0.15)",
        icon: "🔥",
        label: "Very Good",
      };
    if (percentage > 60)
      return {
        grade: "B",
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.15)",
        icon: "📈",
        label: "Good",
      };
    if (percentage > 50)
      return {
        grade: "C",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.15)",
        icon: "📚",
        label: "Average",
      };
    if (percentage >= 40)
      return {
        grade: "D",
        color: "#f97316",
        bgColor: "rgba(249, 115, 22, 0.15)",
        icon: "⚠️",
        label: "Needs Improvement",
      };
    return {
      grade: "F",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.15)",
      icon: "🎯",
      label: "Focus Required",
    };
  };

  const getSubjectIcon = (subject) => {
    switch (subject?.toLowerCase()) {
      case "physics":
        return <FaAtom style={{ color: "#ef4444", fontSize: "16px" }} />;
      case "chemistry":
        return <FaFlask style={{ color: "#3b82f6", fontSize: "16px" }} />;
      case "maths":
        return <FaCalculator style={{ color: "#8b5cf6", fontSize: "16px" }} />;
      default:
        return <FaBook style={{ color: "#6b7280", fontSize: "16px" }} />;
    }
  };

  // Enhanced empty state
  if (!filteredExams || filteredExams.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 40px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          margin: "20px 0",
          color: "white",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            backdropFilter: "blur(10px)",
          }}
        >
          <FaExclamationTriangle style={{ fontSize: "40px", color: "white" }} />
        </div>
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          No Results Available
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            opacity: 0.9,
            maxWidth: "400px",
            margin: "0 auto 30px",
            lineHeight: "1.6",
          }}
        >
          {studentData?.isRevisionProgramJEEMains2026Student
            ? "No revision program exam results recorded yet. Results will appear here once available."
            : "No exam results have been recorded yet. Your performance data will be displayed here."}
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            padding: "12px 24px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <FaClipboardList style={{ fontSize: "16px" }} />
          <span style={{ fontWeight: "600" }}>Awaiting Assessment Data</span>
        </div>
      </div>
    );
  }

  // Process exam data
  const processedExams = filteredExams.map((exam) => {
    let physicsMarks = exam.physics || 0;
    let chemistryMarks = exam.chemistry || 0;
    let mathsMarks = exam.maths || 0;

    const isRevisionStudent = exam.isRevisionProgramJEEMains2026Student;
    const isCommonStudent = exam.isCommonStudent;

    let maxPhysics = 100;
    let maxChemistry = 100;
    let maxMaths = 100;

    if (isRevisionStudent) {
      if (isCommonStudent) {
        maxPhysics = 100;
        maxChemistry = 100;
        maxMaths = 0;
      } else {
        maxPhysics = 100;
        maxChemistry = 0;
        maxMaths = 0;
      }
    }

    const totalObtained = physicsMarks + chemistryMarks + mathsMarks;
    const totalMaximum = maxPhysics + maxChemistry + maxMaths;
    const percentage =
      totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;

    const mainSubject =
      exam.Subject ||
      (physicsMarks > 0
        ? "Physics"
        : chemistryMarks > 0
        ? "Chemistry"
        : mathsMarks > 0
        ? "Mathematics"
        : "General");

    const topic = Array.isArray(exam.topic) ? exam.topic[0] : exam.topic;
    const examName = Array.isArray(exam.examName)
      ? exam.examName[0]
      : exam.examName;

    const gradeInfo = getGrade(percentage);

    return {
      ...exam,
      id: exam.id,
      examName: examName || topic || "Weekly Test",
      subject: mainSubject,
      topic: topic,
      obtainedMarks: totalObtained,
      totalMarks: totalMaximum,
      percentage: Math.round(percentage * 100) / 100,
      grade: gradeInfo,
      date: exam.examDate,
      physics: physicsMarks,
      chemistry: chemistryMarks,
      maths: mathsMarks,
      maxPhysics: maxPhysics,
      maxChemistry: maxChemistry,
      maxMaths: maxMaths,
      testType: exam.testType?.[0] || "weekly",
      isRevisionProgram: exam.isRevisionProgramJEEMains2026Student,
      isCommonStudent: exam.isCommonStudent,
    };
  });

  // Sort exams
  const sortedExams = [...processedExams].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "date" || sortField === "examDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
console.log("sortedExams",sortedExams)
  // Enhanced statistics calculation
  const totalExams = sortedExams.length;
  const averagePercentage =
    sortedExams.length > 0
      ? sortedExams.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams
      : 0;

// Calculate highest and lowest scores in actual marks
const highestScore = Math.max(
  ...sortedExams.map((exam) => exam.obtainedMarks)
);
const lowestScore = Math.min(
  ...sortedExams.map((exam) => exam.obtainedMarks)
);

// You can also get subject-wise highest and lowest scores
const highestPhysics = Math.max(
  ...sortedExams.map((exam) => exam.physics || 0)
);
const lowestPhysics = Math.min(
  ...sortedExams.map((exam) => exam.physics || 0)
);

const highestChemistry = Math.max(
  ...sortedExams.map((exam) => exam.chemistry || 0)
);
const lowestChemistry = Math.min(
  ...sortedExams.map((exam) => exam.chemistry || 0)
);
  const improvement =
    sortedExams.length > 1
      ? sortedExams[sortedExams.length - 1].percentage -
        sortedExams[0].percentage
      : 0;

  // Enhanced subject-wise analysis
  const physicsExams = sortedExams.filter(
    (exam) => exam.physics !== undefined && exam.maxPhysics > 0
  );
  const chemistryExams = sortedExams.filter(
    (exam) => exam.chemistry !== undefined && exam.maxChemistry > 0
  );
  const mathsExams = sortedExams.filter(
    (exam) => exam.maths !== undefined && exam.maxMaths > 0
  );

  const physicsAvg =
    physicsExams.length > 0
      ? physicsExams.reduce((sum, exam) => sum + exam.physics, 0) /
        physicsExams.length
      : 0;
  const chemistryAvg =
    chemistryExams.length > 0
      ? chemistryExams.reduce((sum, exam) => sum + exam.chemistry, 0) /
        chemistryExams.length
      : 0;
  const mathsAvg =
    mathsExams.length > 0
      ? mathsExams.reduce((sum, exam) => sum + exam.maths, 0) /
        mathsExams.length
      : 0;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field)
      return <FaSort style={{ color: "#9ca3af", fontSize: "10px" }} />;
    return sortDirection === "asc" ? (
      <FaSortUp style={{ color: "#4f46e5", fontSize: "12px" }} />
    ) : (
      <FaSortDown style={{ color: "#4f46e5", fontSize: "12px" }} />
    );
  };

  const getPerformanceTrend = (current, previous) => {
    if (!previous) return "neutral";
    return current > previous
      ? "improving"
      : current < previous
      ? "declining"
      : "neutral";
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <FaArrowUp style={{ color: "#10b981", fontSize: "12px" }} />;
      case "declining":
        return <FaArrowDown style={{ color: "#ef4444", fontSize: "12px" }} />;
      default:
        return <FaMinus style={{ color: "#6b7280", fontSize: "10px" }} />;
    }
  };

  const renderSubjectScores = (exam) => {
    const scores = [];

    if (exam.physics !== undefined && exam.maxPhysics > 0) {
      scores.push(
        <div
          key="physics"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            minWidth: "100px",
          }}
        >
          <FaAtom style={{ color: "#ef4444", fontSize: "14px" }} />
          <div>
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}
            >
              {exam.physics}/{exam.maxPhysics}
            </div>
          </div>
        </div>
      );
    }

    if (exam.chemistry !== undefined && exam.maxChemistry > 0) {
      scores.push(
        <div
          key="chemistry"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            minWidth: "100px",
          }}
        >
          <FaFlask style={{ color: "#3b82f6", fontSize: "14px" }} />
          <div>
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}
            >
              {exam.chemistry}/{exam.maxChemistry}
            </div>
          </div>
        </div>
      );
    }

    if (exam.maths !== undefined && exam.maxMaths > 0) {
      const mathsPercentage = (exam.maths / exam.maxMaths) * 100;
      scores.push(
        <div
          key="maths"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            minWidth: "100px",
          }}
        >
          <FaCalculator style={{ color: "#8b5cf6", fontSize: "14px" }} />
          <div>
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}
            >
              {exam.maths}/{exam.maxMaths}
            </div>
            <div
              style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: "600" }}
            >
              {Math.round(mathsPercentage)}%
            </div>
          </div>
        </div>
      );
    }

    return <div style={{ display: "flex", gap: "8px" }}>{scores}</div>;
  };

  // Enhanced progress bar with animation
  const ProgressBar = ({ percentage, color, height = 6 }) => (
    <div
      style={{
        width: "100%",
        height: `${height}px`,
        background: "rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(percentage, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: "8px",
          transition: "width 0.8s ease-in-out",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            animation: "shimmer 2s infinite",
          }}
        ></div>
      </div>
    </div>
  );

  // Prepare data for bar charts
  const performanceData = sortedExams.slice(-6).map((exam, index) => ({
    label: `Test ${index + 1}`,
    value: exam.percentage,
  }));

  const subjectData = [
    { label: "Physics", value: Math.round(physicsAvg) },
    { label: "Chemistry", value: Math.round(chemistryAvg) },
    { label: "Maths", value: Math.round(mathsAvg) },
  ].filter((item) => item.value > 0);

  // Prepare chart series data
  const dates = chartData.map((item) => item.date);
  const excellentSeries = chartData.map((item) =>
    item.percentage > 90 ? item.subjectMarks : null
  );
  const goodSeries = chartData.map((item) =>
    item.percentage > 65 && item.percentage < 90 ? item.subjectMarks : null
  );
  const averageSeries = chartData.map((item) =>
    item.percentage > 50 && item.percentage < 65 ? item.subjectMarks : null
  );
  const poorSeries = chartData.map((item) =>
    item.percentage < 50 ? item.subjectMarks : null
  );

  const renderExamTable = (examsList) => {
    console.log("consolidatedExam", consolidatedExams);
    console.log("examsList", examsList);

    return (
      <div style={{ marginBottom: "25px" }}>
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "white",
            overflow: "auto",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "18px 8px",
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    fontWeight: "700",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  S.No.
                </th>
                <th
                  style={{
                    padding: "18px 8px",
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    fontWeight: "700",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  Date & Day
                </th>
                <th
                  style={{
                    padding: "18px 8px",
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    fontWeight: "700",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  Type of Exam
                </th>
                <th
                  style={{
                    padding: "18px 8px",
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    fontWeight: "700",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  Topics Covered
                </th>
                <th
                  style={{
                    padding: "18px 8px",
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    fontWeight: "700",
                    color: "#f59e0b",
                    fontSize: "16px",
                  }}
                >
                  Physics
                </th>
                <th
                  style={{
                    padding: "18px 8px",
                    textAlign: "center",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    fontWeight: "700",
                    color: "#10b981",
                    fontSize: "16px",
                  }}
                >
                  Chemistry
                </th>
              </tr>
            </thead>
            <tbody>
              {examsList.map((exam, index) => {
                const examDate = new Date(exam.date);
                const dayOfWeek = examDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                });
                const formattedDate = examDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                // Convert exam ISO date to DD.MM.YYYY format for comparison
                const examDateFormatted = isoToDDMMYYYY(exam.date);

                // Find matching consolidated exam data
                const consolidatedExam = consolidatedExams?.find(
                  (consolidated) => consolidated.examDate === examDateFormatted
                );

                // Debug logging for each exam
                console.log(`Exam ${index}:`, {
                  examDate: exam.date,
                  examDateFormatted,
                  consolidatedExamDate: consolidatedExam?.examDate,
                  match: consolidatedExam?.examDate === examDateFormatted,
                  uniqueTopics: consolidatedExam?.uniqueTopics,
                });

                // Get unique topics for this exam
                const uniqueTopics = consolidatedExam?.uniqueTopics || [];

                return (
                  <tr
                    key={exam.id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 8px",
                        textAlign: "center",
                        fontSize: "16px",
                        color: "#475569",
                        fontWeight: "700",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "16px 8px",
                        textAlign: "center",
                        fontSize: "15px",
                        color: "#1e293b",
                        fontWeight: "600",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                          {formattedDate}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#64748b",
                            fontWeight: "500",
                          }}
                        >
                          {dayOfWeek}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 8px",
                        fontSize: "15px",
                        color: "#475569",
                        fontWeight: "600",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        textAlign: "center",
                      }}
                    >
                      {exam.examName}
                    </td>
                    <td
                      style={{
                        padding: "16px 8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        textAlign: "left",
                        maxWidth: "300px",
                      }}
                    >
                      {uniqueTopics.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                          }}
                        >
                          {uniqueTopics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              style={{
                                padding: "2px 6px",
                                background:
                                  consolidatedExam?.type === "weekend"
                                    ? "rgba(59, 130, 246, 0.1)"
                                    : consolidatedExam?.type === "cumulative"
                                    ? "rgba(139, 92, 246, 0.1)"
                                    : "rgba(16, 185, 129, 0.1)",
                                borderRadius: "4px",
                                border:
                                  consolidatedExam?.type === "weekend"
                                    ? "1px solid rgba(59, 130, 246, 0.2)"
                                    : consolidatedExam?.type === "cumulative"
                                    ? "1px solid rgba(139, 92, 246, 0.2)"
                                    : "1px solid rgba(16, 185, 129, 0.2)",
                                fontSize: "11px",
                                fontWeight: "500",
                                color:
                                  consolidatedExam?.type === "weekend"
                                    ? "#1e40af"
                                    : consolidatedExam?.type === "cumulative"
                                    ? "#7c3aed"
                                    : "#047857",
                                whiteSpace: "nowrap",
                                lineHeight: "1.2",
                              }}
                            >
                              {topic}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "#9ca3af",
                            fontStyle: "italic",
                            fontSize: "12px",
                          }}
                        >
                          No topics data
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px 8px",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "#f59e0b",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                      }}
                    >
                      {exam.physics || 0}
                    </td>
                    <td
                      style={{
                        padding: "16px 8px",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "#10b981",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                      }}
                    >
                      {exam.chemistry || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <div style={{ padding: "0" }}>
      {/* Table and Charts Side by Side - 70% Table, 30% Chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70% 28%",
          gap: "2%",
          marginBottom: "25px",
        }}
      >
        {/* Exam Table - 70% width */}
        <div>{renderExamTable(sortedExams)}</div>

        {/* Bar Charts Section - 30% width */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Performance Trend Chart */}
          {chartData.length > 0 && (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                height: "fit-content",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaRegChartBar style={{ color: "#4f46e5", fontSize: "14px" }} />
                Performance Trend
              </h4>
              <div className="test-marks-chart">
                <BarChart
                  width={370}
                  height={350}
                  layout="vertical"
                  series={[
                    {
                      data: excellentSeries,
                      label: "Excellent Performance",
                      id: "excellent",
                      color: "#10b981",
                    },
                    {
                      data: goodSeries,
                      label: "Good Performance",
                      id: "good",
                      color: "#3b82f6",
                    },
                    {
                      data: averageSeries,
                      label: "Average Performance",
                      id: "average",
                      color: "#f59e0b",
                    },
                    {
                      data: poorSeries,
                      label: "Needs Improvement",
                      id: "poor",
                      color: "#ef4444",
                    },
                  ]}
                  xAxis={[
                    {
                      data: dates,
                      scaleType: "band",
                      label: "Exam Date",
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Marks",
                      min: 0,
                      max: 100,
                    },
                  ]}
                  slotProps={{
                    bar: {
                      onClick: (event, data) => {
                        console.log("Bar clicked:", data);
                      },
                      width: 30,
                    },
                  }}
                  margin={{ top: 30, right: 20, bottom: 10, left: 20 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
          padding: "35px",
          borderRadius: "20px",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(30, 64, 175, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: "250px",
            height: "250px",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            width: "180px",
            height: "180px",
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  width: "70px",
                  height: "70px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <FaGraduationCap
                  style={{ color: "#ffffff", fontSize: "28px" }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "18px",
                    opacity: 0.9,
                    marginBottom: "6px",
                    fontWeight: "500",
                  }}
                >
                  Overall Performance
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #ffffff, #e0e7ff)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {averagePercentage >= 85
                    ? "Exceptional Performance! 🎉"
                    : averagePercentage >= 75
                    ? "Outstanding Work! 🌟"
                    : averagePercentage >= 65
                    ? "Great Progress! 👍"
                    : averagePercentage >= 55
                    ? "Good Effort! 💪"
                    : averagePercentage >= 45
                    ? "Keep Working! 📚"
                    : "Focus on Improvement! 🎯"}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "18px",
                  opacity: 0.9,
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                Average Score
              </div>
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  color: getGrade(averagePercentage).color,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                {averagePercentage.toFixed(1)}%
                <FaCrown style={{ color: "#fbbf24", fontSize: "32px" }} />
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                padding: "20px",
                borderRadius: "15px",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                Highest Score
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#86efac",
                  textShadow: "0 2px 8px rgba(22, 163, 74, 0.3)",
                }}
              >
      {highestScore} marks
              </div>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                padding: "20px",
                borderRadius: "15px",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                Lowest Score
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#fca5a5",
                  textShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
                }}
              >
      {lowestScore} marks
              </div>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                padding: "20px",
                borderRadius: "15px",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                Total Improvement
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: improvement >= 0 ? "#86efac" : "#fca5a5",
                  textShadow:
                    improvement >= 0
                      ? "0 2px 8px rgba(22, 163, 74, 0.3)"
                      : "0 2px 8px rgba(220, 38, 38, 0.3)",
                }}
              >
                {improvement >= 0 ? "+" : ""}
                {improvement.toFixed(1)}%
              </div>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                padding: "20px",
                borderRadius: "15px",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                Success Rate
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#93c5fd",
                  textShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                }}
              >
                {(
                  (sortedExams.filter((exam) => exam.percentage >= 40).length /
                    totalExams) *
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
