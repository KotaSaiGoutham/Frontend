import React from "react";
import { 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaChartLine, 
  FaAward,
  FaExclamationTriangle
} from "react-icons/fa";
import "./ResultsTable.css";

const ResultsTable = ({ studentExams = [], loading = false }) => {
  const [sortField, setSortField] = React.useState("date");
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

  if (!studentExams || studentExams.length === 0) {
    return (
      <div className="results-empty">
        <FaExclamationTriangle className="empty-icon" />
        <h3>No Results Available</h3>
        <p>No exam results have been recorded yet.</p>
      </div>
    );
  }

  // Process and sort exam data
  const processedExams = studentExams.map(exam => {
    const totalMarks = exam.totalMarks || 100; // Default to 100 if not provided
    const obtainedMarks = exam.marks || 0;
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    
    return {
      ...exam,
      obtainedMarks,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      grade: getGrade(percentage),
      date: exam.examDate || exam.date || new Date().toISOString()
    };
  });

  // Sort exams
  const sortedExams = [...processedExams].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "date") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Calculate statistics
  const totalExams = sortedExams.length;
  const averagePercentage = sortedExams.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams;
  const highestScore = Math.max(...sortedExams.map(exam => exam.percentage));
  const lowestScore = Math.min(...sortedExams.map(exam => exam.percentage));

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

      {/* Results Table */}
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("examName")}>
                <div className="table-header">
                  Exam Name
                  {getSortIcon("examName")}
                </div>
              </th>
              <th onClick={() => handleSort("date")}>
                <div className="table-header">
                  Date
                  {getSortIcon("date")}
                </div>
              </th>
              <th onClick={() => handleSort("obtainedMarks")}>
                <div className="table-header">
                  Marks
                  {getSortIcon("obtainedMarks")}
                </div>
              </th>
              <th onClick={() => handleSort("percentage")}>
                <div className="table-header">
                  Percentage
                  {getSortIcon("percentage")}
                </div>
              </th>
              <th>Grade</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {sortedExams.map((exam, index) => {
              const previousExam = index > 0 ? sortedExams[index - 1] : null;
              const trend = getPerformanceTrend(exam.percentage, previousExam?.percentage);
              
              return (
                <tr key={exam.id || index} className="exam-row">
                  <td className="exam-name">
                    <strong>{exam.examName || "Weekly Test"}</strong>
                    {exam.subject && <span className="exam-subject">{exam.subject}</span>}
                  </td>
                  
                  <td className="exam-date">
                    {new Date(exam.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  
                  <td className="exam-marks">
                    <div className="marks-display">
                      <span className="obtained-marks">{exam.obtainedMarks}</span>
                      <span className="total-marks">/{exam.totalMarks}</span>
                    </div>
                  </td>
                  
                  <td className="exam-percentage">
                    <div className="percentage-display">
                      <span className="percentage-value">{exam.percentage}%</span>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ 
                            width: `${exam.percentage}%`,
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
                      {trend === "improving" && "↗ Improving"}
                      {trend === "declining" && "↘ Declining"}
                      {trend === "neutral" && "→ Stable"}
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
        <h4>Overall Performance Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Average Performance:</span>
            <span className="summary-value">{averagePercentage.toFixed(1)}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Grade Average:</span>
            <span className="summary-value">
              {getGrade(averagePercentage).grade}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Exams Taken:</span>
            <span className="summary-value">{totalExams}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Performance Trend:</span>
            <span className={`summary-value ${
              sortedExams.length > 1 ? 
                sortedExams[sortedExams.length - 1].percentage > averagePercentage ? 
                  "trend-up" : "trend-down" 
                : "trend-neutral"
            }`}>
              {sortedExams.length > 1 ? 
                sortedExams[sortedExams.length - 1].percentage > averagePercentage ? 
                  "Improving" : "Needs Improvement" 
                : "Baseline Established"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;