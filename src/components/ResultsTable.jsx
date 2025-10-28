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
  FaAtom
} from "react-icons/fa";
import "./ResultsTable.css";

const ResultsTable = ({ studentExams = [], loading = false }) => {
  const [sortField, setSortField] = React.useState("examDate");
  const [sortDirection, setSortDirection] = React.useState("desc");

  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner"></div>
        <p>Loading results data...</p>
      </div>
    );
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A+", color: "#10b981" };
    if (percentage >= 80) return { grade: "A", color: "#34d399" };
    if (percentage >= 70) return { grade: "B+", color: "#60a5fa" };
    if (percentage >= 60) return { grade: "B", color: "#3b82f6" };
    if (percentage >= 50) return { grade: "C", color: "#f59e0b" };
    if (percentage >= 40) return { grade: "D", color: "#f97316" };
    return { grade: "F", color: "#ef4444" };
  };

  const getSubjectIcon = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'physics': return <FaAtom />;
      case 'chemistry': return <FaFlask />;
      case 'maths': return <FaCalculator />;
      default: return <FaChartLine />;
    }
  };

  if (!studentExams || studentExams.length === 0) {
    return (
      <div className="results-empty">
        <FaExclamationTriangle className="empty-icon" />
        <h3>No Results Available</h3>
        <p>No exam results have been recorded yet.</p>
      </div>
    );
  }

  // Process exam data to match your actual structure
  const processedExams = studentExams.map(exam => {
    // Calculate percentage based on available subject scores
    let percentage = 0;
    let totalScore = 0;
    let maxPossible = 0;

    if (exam.total !== undefined) {
      // For exams with total score (like weekend exams)
      totalScore = exam.total;
      maxPossible = 300; // Assuming 100 per subject for 3 subjects
      percentage = (totalScore / maxPossible) * 100;
    } else if (exam.physics !== undefined) {
      // For subject-specific exams
      totalScore = exam.physics;
      maxPossible = exam.maxPhysics || 100;
      percentage = (totalScore / maxPossible) * 100;
    }

    // Determine the main subject for display
    const mainSubject = exam.Subject || 
                       (exam.physics !== undefined ? 'Physics' : 
                       (exam.chemistry !== undefined ? 'Chemistry' : 
                       (exam.maths !== undefined ? 'Mathematics' : 'General')));

    // Get topic information
    const topic = Array.isArray(exam.topic) ? exam.topic[0] : exam.topic;
    const examName = Array.isArray(exam.examName) ? exam.examName[0] : exam.examName;

    return {
      ...exam,
      id: exam.id,
      examName: examName || topic || "Weekly Test",
      subject: mainSubject,
      topic: topic,
      obtainedMarks: totalScore,
      totalMarks: maxPossible,
      percentage: Math.round(percentage * 100) / 100,
      grade: getGrade(percentage),
      date: exam.examDate,
      physics: exam.physics,
      chemistry: exam.chemistry,
      maths: exam.maths,
      total: exam.total,
      testType: exam.testType?.[0] || 'weekly'
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

  // Calculate statistics based on processed data
  const totalExams = sortedExams.length;
  const averagePercentage = sortedExams.length > 0 
    ? sortedExams.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams 
    : 0;
  
  const highestScore = sortedExams.length > 0 
    ? Math.max(...sortedExams.map(exam => exam.percentage)) 
    : 0;
  
  const lowestScore = sortedExams.length > 0 
    ? Math.min(...sortedExams.map(exam => exam.percentage)) 
    : 0;

  // Calculate subject averages
  const physicsExams = sortedExams.filter(exam => exam.physics !== undefined);
  const chemistryExams = sortedExams.filter(exam => exam.chemistry !== undefined);
  const mathsExams = sortedExams.filter(exam => exam.maths !== undefined);

  const physicsAverage = physicsExams.length > 0 
    ? physicsExams.reduce((sum, exam) => sum + exam.physics, 0) / physicsExams.length 
    : 0;

  const chemistryAverage = chemistryExams.length > 0 
    ? chemistryExams.reduce((sum, exam) => sum + exam.chemistry, 0) / chemistryExams.length 
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
    if (sortField !== field) return <FaSort />;
    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const getPerformanceTrend = (current, previous) => {
    if (!previous) return "neutral";
    return current > previous ? "improving" : current < previous ? "declining" : "neutral";
  };

  const renderSubjectScores = (exam) => {
    const scores = [];
    if (exam.physics !== undefined) {
      scores.push(`P: ${exam.physics}/${exam.maxPhysics || 100}`);
    }
    if (exam.chemistry !== undefined) {
      scores.push(`C: ${exam.chemistry}`);
    }
    if (exam.maths !== undefined && exam.maths > 0) {
      scores.push(`M: ${exam.maths}`);
    }
    if (exam.total !== undefined) {
      scores.push(`Total: ${exam.total}`);
    }
    return scores.join(' | ');
  };

  return (
    <div className="results-table-container">
      {/* Statistics Summary */}
      <div className="results-statistics">
        <div className="stat-card">
          <div className="stat-icon total-exams">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>{totalExams}</h3>
            <p>Total Exams</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon average-score">
            <FaAward />
          </div>
          <div className="stat-info">
            <h3>{averagePercentage.toFixed(1)}%</h3>
            <p>Average Score</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon high-score">
            <FaSortUp />
          </div>
          <div className="stat-info">
            <h3>{highestScore.toFixed(1)}%</h3>
            <p>Highest Score</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon low-score">
            <FaSortDown />
          </div>
          <div className="stat-info">
            <h3>{lowestScore.toFixed(1)}%</h3>
            <p>Lowest Score</p>
          </div>
        </div>
      </div>

      {/* Subject-wise Averages */}
      {(physicsAverage > 0 || chemistryAverage > 0) && (
        <div className="subject-averages">
          <h4>Subject-wise Averages</h4>
          <div className="subject-stats">
            {physicsAverage > 0 && (
              <div className="subject-stat">
                <FaAtom className="physics-icon" />
                <span>Physics: {physicsAverage.toFixed(1)}%</span>
              </div>
            )}
            {chemistryAverage > 0 && (
              <div className="subject-stat">
                <FaFlask className="chemistry-icon" />
                <span>Chemistry: {chemistryAverage.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("examName")}>
                <div className="table-header">
                  Exam & Topic
                  {getSortIcon("examName")}
                </div>
              </th>
              <th onClick={() => handleSort("examDate")}>
                <div className="table-header">
                  Date
                  {getSortIcon("examDate")}
                </div>
              </th>
              <th onClick={() => handleSort("percentage")}>
                <div className="table-header">
                  Scores
                  {getSortIcon("percentage")}
                </div>
              </th>
              <th onClick={() => handleSort("percentage")}>
                <div className="table-header">
                  Percentage
                  {getSortIcon("percentage")}
                </div>
              </th>
              <th>Grade</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {sortedExams.map((exam, index) => {
              const previousExam = index > 0 ? sortedExams[index - 1] : null;
              const trend = getPerformanceTrend(exam.percentage, previousExam?.percentage);
              
              return (
                <tr key={exam.id || index} className="exam-row">
                  <td className="exam-name">
                    <div className="exam-title">
                      {getSubjectIcon(exam.subject)}
                      <strong>{exam.examName}</strong>
                    </div>
                    {exam.topic && exam.topic !== exam.examName && (
                      <div className="exam-topic">{exam.topic}</div>
                    )}
                    <div className="exam-type">{exam.testType}</div>
                  </td>
                  
                  <td className="exam-date">
                    {new Date(exam.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  
                  <td className="exam-scores">
                    <div className="scores-display">
                      {renderSubjectScores(exam)}
                    </div>
                  </td>
                  
                  <td className="exam-percentage">
                    <div className="percentage-display">
                      <span className="percentage-value">{exam.percentage}%</span>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ 
                            width: `${Math.min(exam.percentage, 100)}%`,
                            backgroundColor: exam.grade.color
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="exam-grade">
                    <span 
                      className="grade-badge"
                      style={{ backgroundColor: exam.grade.color }}
                    >
                      {exam.grade.grade}
                    </span>
                  </td>
                  
                  <td className="exam-trend">
                    <div className={`trend-indicator ${trend}`}>
                      {trend === "improving" && "↗"}
                      {trend === "declining" && "↘"}
                      {trend === "neutral" && "→"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Overall Performance Summary */}
      <div className="performance-summary">
        <h4>Performance Analysis</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Overall Average:</span>
            <span className="summary-value">{averagePercentage.toFixed(1)}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Overall Grade:</span>
            <span 
              className="summary-value grade"
              style={{ color: getGrade(averagePercentage).color }}
            >
              {getGrade(averagePercentage).grade}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Exams Count:</span>
            <span className="summary-value">{totalExams}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Performance Level:</span>
            <span className={`summary-value ${
              averagePercentage >= 70 ? "level-excellent" :
              averagePercentage >= 60 ? "level-good" :
              averagePercentage >= 50 ? "level-average" : "level-poor"
            }`}>
              {averagePercentage >= 70 ? "Excellent" :
               averagePercentage >= 60 ? "Good" :
               averagePercentage >= 50 ? "Average" : "Needs Improvement"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;