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

const ResultsTable = ({
  studentExams = [],
  loading = false,
  studentData = {},
}) => {
  const [sortField, setSortField] = React.useState("examDate");
  const [sortDirection, setSortDirection] = React.useState("desc");

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
    if (percentage >= 80)
      return {
        grade: "A",
        color: "#34d399",
        bgColor: "rgba(52, 211, 153, 0.15)",
        icon: "⭐",
        label: "Excellent",
      };
    if (percentage >= 70)
      return {
        grade: "B+",
        color: "#60a5fa",
        bgColor: "rgba(96, 165, 250, 0.15)",
        icon: "🔥",
        label: "Very Good",
      };
    if (percentage >= 60)
      return {
        grade: "B",
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.15)",
        icon: "📈",
        label: "Good",
      };
    if (percentage >= 50)
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
        return <FaAtom style={{ color: "#ef4444", fontSize: "18px" }} />;
      case "chemistry":
        return <FaFlask style={{ color: "#3b82f6", fontSize: "18px" }} />;
      case "maths":
        return <FaCalculator style={{ color: "#8b5cf6", fontSize: "18px" }} />;
      default:
        return <FaBook style={{ color: "#6b7280", fontSize: "18px" }} />;
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

  // Enhanced statistics calculation
  const totalExams = sortedExams.length;
  const averagePercentage =
    sortedExams.length > 0
      ? sortedExams.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams
      : 0;

  const highestPercentage = Math.max(
    ...sortedExams.map((exam) => exam.percentage)
  );
  const lowestPercentage = Math.min(
    ...sortedExams.map((exam) => exam.percentage)
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
      return <FaSort style={{ color: "#9ca3af", fontSize: "12px" }} />;
    return sortDirection === "asc" ? (
      <FaSortUp style={{ color: "#4f46e5", fontSize: "14px" }} />
    ) : (
      <FaSortDown style={{ color: "#4f46e5", fontSize: "14px" }} />
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
        return <FaArrowUp style={{ color: "#10b981", fontSize: "14px" }} />;
      case "declining":
        return <FaArrowDown style={{ color: "#ef4444", fontSize: "14px" }} />;
      default:
        return <FaMinus style={{ color: "#6b7280", fontSize: "12px" }} />;
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
            gap: "12px",
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            minWidth: "120px",
          }}
        >
          <FaAtom style={{ color: "#ef4444", fontSize: "18px" }} />
          <div>
            <div
              style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}
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
            gap: "12px",
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            minWidth: "120px",
          }}
        >
          <FaFlask style={{ color: "#3b82f6", fontSize: "18px" }} />
          <div>
            <div
              style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}
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
            gap: "12px",
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            minWidth: "120px",
          }}
        >
          <FaCalculator style={{ color: "#8b5cf6", fontSize: "18px" }} />
          <div>
            <div
              style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}
            >
              {exam.maths}/{exam.maxMaths}
            </div>
            <div
              style={{ fontSize: "14px", color: "#8b5cf6", fontWeight: "600" }}
            >
              {Math.round(mathsPercentage)}%
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {scores}
      </div>
    );
  };

  // Enhanced progress bar with animation
  const ProgressBar = ({ percentage, color, height = 8 }) => (
    <div
      style={{
        width: "100%",
        height: `${height}px`,
        background: "rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(percentage, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: "10px",
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

  return (
    <div style={{ padding: "0" }}>
      {/* Enhanced Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Total Exams Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "25px",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaClipboardList />
                Total Exams
              </div>
              <div style={{ fontSize: "32px", fontWeight: "800" }}>
                {totalExams}
              </div>
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "8px" }}>
              All assessments completed
            </div>
          </div>
        </div>

        {/* Average Score Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            padding: "25px",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaChartLine />
                Average Score
              </div>
              <div style={{ fontSize: "32px", fontWeight: "800" }}>
                {averagePercentage.toFixed(1)}%
              </div>
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "8px" }}>
              Overall performance
            </div>
          </div>
        </div>

        {/* Current Grade Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            padding: "25px",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaAward />
                Current Grade
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {getGrade(averagePercentage).grade}
                <span style={{ fontSize: "16px", opacity: 0.8 }}>
                  {getGrade(averagePercentage).icon}
                </span>
              </div>
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "8px" }}>
              {getGrade(averagePercentage).label}
            </div>
          </div>
        </div>

        {/* Performance Trend Card - Different Color */}
        <div
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
            padding: "25px",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaArrowUp />
                Performance Trend
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                }}
              >
                {improvement >= 0 ? "+" : ""}
                {improvement.toFixed(1)}%
              </div>
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "8px" }}>
              Since first exam
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results Table */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            padding: "20px 25px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <FaUserGraduate style={{ fontSize: "22px" }} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                Exam Performance History
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  opacity: 0.9,
                }}
              >
                Detailed analysis of all assessments and progress tracking
              </p>
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th
                  onClick={() => handleSort("examName")}
                  style={{
                    padding: "20px 25px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    cursor: "pointer",
                    userSelect: "none",
                    minWidth: "200px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaBook style={{ color: "#4f46e5", fontSize: "14px" }} />
                    Exam & Topic
                    {getSortIcon("examName")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("examDate")}
                  style={{
                    padding: "20px 25px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    cursor: "pointer",
                    userSelect: "none",
                    minWidth: "120px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaCalendarAlt
                      style={{ color: "#4f46e5", fontSize: "14px" }}
                    />
                    Date
                    {getSortIcon("examDate")}
                  </div>
                </th>
                <th
                  style={{
                    padding: "20px 25px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    minWidth: "250px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaChartLine
                      style={{ color: "#4f46e5", fontSize: "14px" }}
                    />
                    Subject Scores
                  </div>
                </th>
                <th
                  onClick={() => handleSort("percentage")}
                  style={{
                    padding: "20px 25px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    cursor: "pointer",
                    userSelect: "none",
                    minWidth: "150px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    Performance
                    {getSortIcon("percentage")}
                  </div>
                </th>
                <th
                  style={{
                    padding: "20px 25px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    minWidth: "120px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaAward style={{ color: "#4f46e5", fontSize: "14px" }} />
                    Grade
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedExams.map((exam, index) => {
                const previousExam = index > 0 ? sortedExams[index - 1] : null;
                const trend = getPerformanceTrend(
                  exam.percentage,
                  previousExam?.percentage
                );

                return (
                  <tr
                    key={exam.id || index}
                    style={{
                      borderBottom:
                        index === sortedExams.length - 1
                          ? "none"
                          : "1px solid #f3f4f6",
                      background: index % 2 === 0 ? "white" : "#fafafa",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0f9ff";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        index % 2 === 0 ? "white" : "#fafafa";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <td style={{ padding: "20px 25px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            width: "50px",
                            height: "50px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          {index + 1}
                        </div>
 <div>
  <div
    style={{
      display: "flex",
      alignItems: "center", // This ensures vertical centering
      gap: "12px",
      marginBottom: "8px",
    }}
  >
    <strong
      style={{
        color: "#1f2937",
        fontSize: "18px",
        fontWeight: "600",
      }}
    >
      {exam.examName}
    </strong>
    {getTrendIcon(trend)}
  </div>
  {exam.topic && exam.topic !== exam.examName && (
    <div
      style={{
        fontSize: "16px",
        color: "#6b7280",
        background: "#f3f4f6",
        padding: "6px 12px",
        borderRadius: "8px",
        display: "inline-block",
      }}
    >
      {exam.topic}
    </div>
  )}
</div>
                      </div>
                    </td>

                    <td style={{ padding: "20px 25px", color: "#374151" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <FaCalendarAlt
                          style={{ color: "#4f46e5", fontSize: "18px" }}
                        />
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "18px" }}>
                            {new Date(exam.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </div>
                          <div style={{ fontSize: "16px", color: "#9ca3af" }}>
                            {new Date(exam.date).getFullYear()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "20px 25px" }}>
                      {renderSubjectScores(exam)}
                    </td>

                    <td style={{ padding: "20px 25px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <div style={{ textAlign: "center", minWidth: "70px" }}>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: exam.grade.color,
                            }}
                          >
                            {exam.percentage}%
                          </span>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#9ca3af",
                              marginTop: "4px",
                            }}
                          >
                            Score
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <ProgressBar
                            percentage={exam.percentage}
                            color={exam.grade.color}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "14px",
                              color: "#9ca3af",
                              marginTop: "6px",
                            }}
                          >
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "20px 25px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            background: exam.grade.bgColor,
                            color: exam.grade.color,
                            padding: "10px 18px",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontWeight: "800",
                            display: "inline-block",
                            border: `2px solid ${exam.grade.color}30`,
                            textAlign: "center",
                            minWidth: "90px",
                          }}
                        >
                          {exam.grade.grade}
                        </div>
                        <span style={{ fontSize: "18px" }}>
                          {exam.grade.icon}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: exam.grade.color,
                          fontWeight: "600",
                          marginTop: "6px",
                          textAlign: "center",
                        }}
                      >
                        {exam.grade.label}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

 {/* Enhanced Performance Summary */}
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
          <div style={{ 
            fontSize: "26px", 
            fontWeight: "800",
            background: "linear-gradient(135deg, #ffffff, #e0e7ff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
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
          {highestPercentage}%
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
          {lowestPercentage}%
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
            textShadow: improvement >= 0 
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
