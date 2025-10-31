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
  FaUserGraduate
} from "react-icons/fa";

const ResultsTable = ({ studentExams = [], loading = false, studentData = {} }) => {
  const [sortField, setSortField] = React.useState("examDate");
  const [sortDirection, setSortDirection] = React.useState("desc");

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        margin: '20px 0'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(59, 130, 246, 0.1)',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '500',
          background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Loading Results...</p>
      </div>
    );
  }

  // Filter exams for revision program students
  const filteredExams = studentData?.isRevisionProgramJEEMains2026Student 
    ? studentExams.filter(exam => exam.isRevisionProgramJEEMains2026Student === true)
    : studentExams;

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A+", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" };
    if (percentage >= 80) return { grade: "A", color: "#34d399", bgColor: "rgba(52, 211, 153, 0.1)" };
    if (percentage >= 70) return { grade: "B+", color: "#60a5fa", bgColor: "rgba(96, 165, 250, 0.1)" };
    if (percentage >= 60) return { grade: "B", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" };
    if (percentage >= 50) return { grade: "C", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)" };
    if (percentage >= 40) return { grade: "D", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.1)" };
    return { grade: "F", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)" };
  };

  const getSubjectIcon = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'physics': return <FaAtom style={{ color: '#ef4444', fontSize: '16px' }} />;
      case 'chemistry': return <FaFlask style={{ color: '#3b82f6', fontSize: '16px' }} />;
      case 'maths': return <FaCalculator style={{ color: '#8b5cf6', fontSize: '16px' }} />;
      default: return <FaBook style={{ color: '#6b7280', fontSize: '16px' }} />;
    }
  };

  const getTestTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'weekly': return <FaClipboardList style={{ color: '#8b5cf6' }} />;
      case 'monthly': return <FaRegChartBar style={{ color: '#3b82f6' }} />;
      case 'mock': return <FaRocket style={{ color: '#f59e0b' }} />;
      default: return <FaStar style={{ color: '#6b7280' }} />;
    }
  };

  if (!filteredExams || filteredExams.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        margin: '20px 0'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <FaExclamationTriangle style={{ fontSize: '32px', color: 'white' }} />
        </div>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          color: '#1f2937',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          No Results Available
        </h3>
        <p style={{ 
          margin: 0, 
          fontSize: '14px',
          color: '#6b7280',
          maxWidth: '300px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>
          {studentData?.isRevisionProgramJEEMains2026Student 
            ? "No revision program exam results recorded yet."
            : "No exam results have been recorded yet."
          }
        </p>
      </div>
    );
  }

  // Process exam data
  const processedExams = filteredExams.map(exam => {
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
    const percentage = totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;

    const mainSubject = exam.Subject || 
                       (physicsMarks > 0 ? 'Physics' : 
                       (chemistryMarks > 0 ? 'Chemistry' : 
                       (mathsMarks > 0 ? 'Mathematics' : 'General')));

    const topic = Array.isArray(exam.topic) ? exam.topic[0] : exam.topic;
    const examName = Array.isArray(exam.examName) ? exam.examName[0] : exam.examName;

    return {
      ...exam,
      id: exam.id,
      examName: examName || topic || "Weekly Test",
      subject: mainSubject,
      topic: topic,
      obtainedMarks: totalObtained,
      totalMarks: totalMaximum,
      percentage: Math.round(percentage * 100) / 100,
      grade: getGrade(percentage),
      date: exam.examDate,
      physics: physicsMarks,
      chemistry: chemistryMarks,
      maths: mathsMarks,
      maxPhysics: maxPhysics,
      maxChemistry: maxChemistry,
      maxMaths: maxMaths,
      testType: exam.testType?.[0] || 'weekly',
      isRevisionProgram: exam.isRevisionProgramJEEMains2026Student,
      isCommonStudent: exam.isCommonStudent
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

  // Calculate statistics
  const totalExams = sortedExams.length;
  const averagePercentage = sortedExams.length > 0 
    ? sortedExams.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams 
    : 0;

  // Calculate subject-wise scores
  const physicsExams = sortedExams.filter(exam => exam.physics !== undefined && exam.maxPhysics > 0);
  const chemistryExams = sortedExams.filter(exam => exam.chemistry !== undefined && exam.maxChemistry > 0);
  const mathsExams = sortedExams.filter(exam => exam.maths !== undefined && exam.maxMaths > 0);

  const physicsHighest = physicsExams.length > 0 ? Math.max(...physicsExams.map(exam => exam.physics)) : 0;
  const physicsLowest = physicsExams.length > 0 ? Math.min(...physicsExams.map(exam => exam.physics)) : 0;
  const chemistryHighest = chemistryExams.length > 0 ? Math.max(...chemistryExams.map(exam => exam.chemistry)) : 0;
  const chemistryLowest = chemistryExams.length > 0 ? Math.min(...chemistryExams.map(exam => exam.chemistry)) : 0;
  const mathsHighest = mathsExams.length > 0 ? Math.max(...mathsExams.map(exam => exam.maths)) : 0;
  const mathsLowest = mathsExams.length > 0 ? Math.min(...mathsExams.map(exam => exam.maths)) : 0;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort style={{ color: '#9ca3af', fontSize: '12px' }} />;
    return sortDirection === "asc" ? <FaSortUp style={{ color: '#3b82f6', fontSize: '14px' }} /> : <FaSortDown style={{ color: '#3b82f6', fontSize: '14px' }} />;
  };

  const getPerformanceTrend = (current, previous) => {
    if (!previous) return "neutral";
    return current > previous ? "improving" : current < previous ? "declining" : "neutral";
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving": return <FaArrowUp style={{ color: '#10b981', fontSize: '12px' }} />;
      case "declining": return <FaArrowDown style={{ color: '#ef4444', fontSize: '12px' }} />;
      default: return <FaMinus style={{ color: '#6b7280', fontSize: '10px' }} />;
    }
  };

  const renderSubjectScores = (exam) => {
    const scores = [];
    
    if (exam.physics !== undefined && exam.maxPhysics > 0) {
      scores.push(
        <div key="physics" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          <FaAtom style={{ color: '#ef4444', fontSize: '12px' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
            {exam.physics}/{exam.maxPhysics}
          </span>
        </div>
      );
    }
    if (exam.chemistry !== undefined && exam.maxChemistry > 0) {
      scores.push(
        <div key="chemistry" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          <FaFlask style={{ color: '#3b82f6', fontSize: '12px' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
            {exam.chemistry}/{exam.maxChemistry}
          </span>
        </div>
      );
    }
    if (exam.maths !== undefined && exam.maxMaths > 0) {
      scores.push(
        <div key="maths" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(139, 92, 246, 0.1)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          <FaCalculator style={{ color: '#8b5cf6', fontSize: '12px' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
            {exam.maths}/{exam.maxMaths}
          </span>
        </div>
      );
    }
    
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {scores}
      </div>
    );
  };

  return (
    <div style={{ padding: '0' }}>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaClipboardList style={{ color: '#3b82f6', fontSize: '18px' }} />
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Exams</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>{totalExams}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>All attempts</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaChartLine style={{ color: '#10b981', fontSize: '18px' }} />
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Average Score</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>{averagePercentage.toFixed(1)}%</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Overall performance</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaAward style={{ color: '#f59e0b', fontSize: '18px' }} />
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Current Grade</div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: getGrade(averagePercentage).color,
            marginBottom: '4px' 
          }}>
            {getGrade(averagePercentage).grade}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Based on average</div>
        </div>
      </div>

      {/* Subject Performance */}
      {(physicsHighest > 0 || chemistryHighest > 0 || mathsHighest > 0) && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FaTrophy style={{ color: '#f59e0b', fontSize: '16px' }} />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              Subject Performance
            </h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {physicsHighest > 0 && (
              <div style={{
                background: '#fef2f2',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FaAtom style={{ color: '#ef4444', fontSize: '16px' }} />
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Physics</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Highest</div>
                    <div style={{ fontSize: '16px', color: '#10b981', fontWeight: '700' }}>{physicsHighest}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Lowest</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: '700' }}>{physicsLowest}</div>
                  </div>
                </div>
              </div>
            )}
            
            {chemistryHighest > 0 && (
              <div style={{
                background: '#eff6ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #dbeafe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FaFlask style={{ color: '#3b82f6', fontSize: '16px' }} />
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Chemistry</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Highest</div>
                    <div style={{ fontSize: '16px', color: '#10b981', fontWeight: '700' }}>{chemistryHighest}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Lowest</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: '700' }}>{chemistryLowest}</div>
                  </div>
                </div>
              </div>
            )}
            
            {mathsHighest > 0 && (
              <div style={{
                background: '#faf5ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e9d5ff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FaCalculator style={{ color: '#8b5cf6', fontSize: '16px' }} />
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Mathematics</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Highest</div>
                    <div style={{ fontSize: '16px', color: '#10b981', fontWeight: '700' }}>{mathsHighest}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Lowest</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: '700' }}>{mathsLowest}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#f8fafc',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUserGraduate style={{ color: '#4f46e5', fontSize: '18px' }} />
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Exam Results History
            </h3>
          </div>
        </div>

        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th onClick={() => handleSort("examName")} style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaBook style={{ color: '#6b7280', fontSize: '12px' }} />
                  Exam
                  {getSortIcon("examName")}
                </div>
              </th>
              <th onClick={() => handleSort("examDate")} style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCalendarAlt style={{ color: '#6b7280', fontSize: '12px' }} />
                  Date
                  {getSortIcon("examDate")}
                </div>
              </th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaChartLine style={{ color: '#6b7280', fontSize: '12px' }} />
                  Scores
                </div>
              </th>
              <th onClick={() => handleSort("percentage")} style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Percentage
                  {getSortIcon("percentage")}
                </div>
              </th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaAward style={{ color: '#6b7280', fontSize: '12px' }} />
                  Grade
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedExams.map((exam, index) => {
              const previousExam = index > 0 ? sortedExams[index - 1] : null;
              const trend = getPerformanceTrend(exam.percentage, previousExam?.percentage);
              
              return (
                <tr key={exam.id || index} style={{
                  borderBottom: index === sortedExams.length - 1 ? 'none' : '1px solid #f3f4f6',
                  background: index % 2 === 0 ? 'white' : '#fafafa',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginBottom: '4px' 
                        }}>
                          <strong style={{ color: '#1f2937', fontSize: '14px' }}>
                            {exam.examName}
                          </strong>
                          {getTrendIcon(trend)}
                        </div>
                        {exam.topic && exam.topic !== exam.examName && (
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280'
                          }}>
                            {exam.topic}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px 20px', color: '#374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaCalendarAlt style={{ color: '#9ca3af', fontSize: '12px' }} />
                      {new Date(exam.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </div>
                  </td>
    
                  
                  <td style={{ padding: '16px 20px' }}>
                    {renderSubjectScores(exam)}
                  </td>
                  
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        minWidth: '45px'
                      }}>
                        {exam.percentage}%
                      </span>
                      <div style={{
                        width: '80px',
                        height: '6px',
                        background: '#e5e7eb',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            height: '100%',
                            width: `${Math.min(exam.percentage, 100)}%`,
                            background: exam.grade.color,
                            borderRadius: '3px'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px 20px' }}>
                    <div 
                      style={{ 
                        background: exam.grade.bgColor,
                        color: exam.grade.color,
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-block',
                        border: `1px solid ${exam.grade.color}20`
                      }}
                    >
                      {exam.grade.grade}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Performance Summary */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#f0f9ff',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaGraduationCap style={{ color: '#0ea5e9', fontSize: '20px' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Overall Performance</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                {averagePercentage >= 70 ? "Excellent Performance! 🎉" :
                 averagePercentage >= 60 ? "Good Progress! 👍" :
                 averagePercentage >= 50 ? "Keep Improving! 💪" : "Focus on Studies! 📚"}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Average Score</div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: getGrade(averagePercentage).color
            }}>
              {averagePercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;