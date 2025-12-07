import React ,{useState }from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaExclamationTriangle,
  FaFlask,
  FaCalculator,
  FaAtom,
  FaBook,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaRegChartBar,
  FaGraduationCap,
  FaCrown,
  FaPlus 
} from "react-icons/fa";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRevisionExamConsolidation,
} from "../redux/actions";
import { isoToDDMMYYYY } from "../mockdata/function";
import AddExamDialog from "./student-portfolio/AddExamDialog";
const formatTestType = (typeInput) => {
  if (!typeInput) return "Weekly Test";
  const typeStr = Array.isArray(typeInput) ? typeInput[0] : typeInput;
  if (!typeStr) return "Weekly Test";
  const result = typeStr.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const ResultsTable = ({
  studentExams = [],
  loading = false,
  studentData = {},
  chartData = [],
  onAddExam 
}) => {
  const dispatch = useDispatch();
  const currentStudent = useSelector((state) => state.auth?.currentStudent) || studentData;
  // 2. Dialog State
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  // Set default sort to 'date' and 'desc' (Latest First)
  const [sortField, setSortField] = React.useState("date");
  const [sortDirection, setSortDirection] = React.useState("desc");
  
  const { exams: consolidatedExams } = useSelector((state) => state.revisionExams.examConsolidation);

  useEffect(() => {
    dispatch(fetchRevisionExamConsolidation());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>; 

  const filteredExams = studentData?.isRevisionProgramJEEMains2026Student
    ? studentExams.filter((exam) => exam.isRevisionProgramJEEMains2026Student === true)
    : studentExams;

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A+", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.15)", icon: "🏆", label: "Outstanding" };
    if (percentage > 80) return { grade: "A", color: "#34d399", bgColor: "rgba(52, 211, 153, 0.15)", icon: "⭐", label: "Excellent" };
    if (percentage > 70) return { grade: "B+", color: "#60a5fa", bgColor: "rgba(96, 165, 250, 0.15)", icon: "🔥", label: "Very Good" };
    if (percentage > 60) return { grade: "B", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.15)", icon: "📈", label: "Good" };
    if (percentage > 50) return { grade: "C", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.15)", icon: "📚", label: "Average" };
    if (percentage >= 40) return { grade: "D", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.15)", icon: "⚠️", label: "Needs Improvement" };
    return { grade: "F", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.15)", icon: "🎯", label: "Focus Required" };
  };

  const processedExams = filteredExams.map((exam) => {
     let physicsMarks = exam.physics || 0;
     let chemistryMarks = exam.chemistry || 0;
     let mathsMarks = exam.maths || 0;
     const isRevisionStudent = exam.isRevisionProgramJEEMains2026Student;
     const isCommonStudent = exam.isCommonStudent;
     let maxPhysics = 100; let maxChemistry = 100; let maxMaths = 100;
     if (isRevisionStudent) {
       if (isCommonStudent) { maxPhysics = 100; maxChemistry = 100; maxMaths = 0; } 
       else { maxPhysics = 100; maxChemistry = 0; maxMaths = 0; }
     }
     const totalObtained = physicsMarks + chemistryMarks + mathsMarks;
     const totalMaximum = maxPhysics + maxChemistry + maxMaths;
     const percentage = totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;
     const examName = Array.isArray(exam.examName) ? exam.examName[0] : exam.examName;
     const topicsList = Array.isArray(exam.topic) ? exam.topic : exam.topic ? [exam.topic] : [];
     const displayTestType = formatTestType(exam.testType);
     return {
       ...exam,
       id: exam.id,
       examName: examName || topicsList[0] || "Weekly Test",
       topicsList: topicsList, 
       displayTestType: displayTestType,
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
       isRevisionProgram: exam.isRevisionProgramJEEMains2026Student,
       isCommonStudent: exam.isCommonStudent,
     };
  });

  // --- SORTING: Latest Date to Past ---
  const sortedExams = [...processedExams].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    // descending: b - a
    return dateB - dateA;
  });

  const totalExams = sortedExams.length;
  const averagePercentage = sortedExams.length > 0 ? sortedExams.reduce((sum, exam) => sum + exam.percentage, 0) / totalExams : 0;
  const highestScore = Math.max(...sortedExams.map((exam) => exam.obtainedMarks)) || 0;
  const lowestScore = Math.min(...sortedExams.map((exam) => exam.obtainedMarks)) || 0;
  const improvement = sortedExams.length > 1 ? sortedExams[0].percentage - sortedExams[sortedExams.length - 1].percentage : 0;

  const dates = chartData.map((item) => item.date);
  const excellentSeries = chartData.map((item) => item.percentage > 90 ? item.subjectMarks : null);
  const goodSeries = chartData.map((item) => item.percentage > 65 && item.percentage < 90 ? item.subjectMarks : null);
  const averageSeries = chartData.map((item) => item.percentage > 50 && item.percentage < 65 ? item.subjectMarks : null);
  const poorSeries = chartData.map((item) => item.percentage < 50 ? item.subjectMarks : null);

  const renderExamTable = (examsList) => {
    const shouldShowChemistry = examsList.some((exam) => exam.chemistry > 0 || exam.isCommonStudent);
    const physicsExams = examsList.filter(exam => exam.physics > 0);
    const chemistryExams = examsList.filter(exam => exam.chemistry > 0);
    const avgPhysics = physicsExams.length > 0 ? physicsExams.reduce((sum, exam) => sum + exam.physics, 0) / physicsExams.length : 0;
    const avgChemistry = chemistryExams.length > 0 ? chemistryExams.reduce((sum, exam) => sum + exam.chemistry, 0) / chemistryExams.length : 0;

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
           <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>Exam Records</h3>
           <button 
        onClick={() => setIsAddExamOpen(true)} // OPEN DIALOG
             style={{
               display: "flex", alignItems: "center", gap: "8px",
               padding: "8px 16px",
               backgroundColor: "#4f46e5", color: "white",
               border: "none", borderRadius: "8px",
               fontSize: "14px", fontWeight: "600",
               cursor: "pointer", transition: "all 0.2s"
             }}
             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4338ca"}
             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4f46e5"}
           >
             <FaPlus /> Add Exam
           </button>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", flex: 1, overflow: "auto", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ padding: "16px 12px", textAlign: "center", backgroundColor: "#1e293b", color: "white", fontSize: "14px", fontWeight: "600", width: "60px" }}>S.No</th>
                <th style={{ padding: "16px 12px", textAlign: "left", backgroundColor: "#1e293b", color: "white", fontSize: "14px", fontWeight: "600" }}>Date & Day</th>
                <th style={{ padding: "16px 12px", textAlign: "center", backgroundColor: "#1e293b", color: "white", fontSize: "14px", fontWeight: "600" }}>Type</th>
                <th style={{ padding: "16px 12px", textAlign: "left", backgroundColor: "#1e293b", color: "white", fontSize: "14px", fontWeight: "600", minWidth: "200px" }}>Topics</th>
                <th style={{ padding: "16px 12px", textAlign: "center", backgroundColor: "#1e293b", color: "#f59e0b", fontSize: "14px", fontWeight: "600", width: "80px" }}>Physics</th>
                {shouldShowChemistry && <th style={{ padding: "16px 12px", textAlign: "center", backgroundColor: "#1e293b", color: "#10b981", fontSize: "14px", fontWeight: "600", width: "80px" }}>Chem</th>}
              </tr>
            </thead>
            <tbody>
              {examsList.map((exam, index) => {
                const examDate = new Date(exam.date);
                const dayOfWeek = examDate.toLocaleDateString("en-IN", { weekday: "short" });
                const formattedDate = examDate.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "2-digit" });
                
                const examDateFormatted = isoToDDMMYYYY(exam.date);
                const consolidatedExam = consolidatedExams?.find(c => c.examDate === examDateFormatted);
                const isRevisionStudent = studentData?.isRevisionProgramJEEMains2026Student;
                
                let finalDisplayTestType = exam.displayTestType;
                let finalTopicsToDisplay = exam.topicsList;

                if (isRevisionStudent && consolidatedExam) {
                   finalDisplayTestType = formatTestType(consolidatedExam.testType || consolidatedExam.type);
                   finalTopicsToDisplay = consolidatedExam.uniqueTopics || [];
                }

                const isCumulative = finalDisplayTestType.toLowerCase().includes("cumulative");
                const isWeekend = finalDisplayTestType.toLowerCase().includes("weekend");
                const isGeneral = finalDisplayTestType.toLowerCase().includes("general");
                const badgeColor = isCumulative ? "rgba(139, 92, 246, 0.1)" : isWeekend ? "rgba(59, 130, 246, 0.1)" : isGeneral ? "#fff3e0" : "rgba(16, 185, 129, 0.1)";
                const badgeBorder = isCumulative ? "rgba(139, 92, 246, 0.2)" : isWeekend ? "rgba(59, 130, 246, 0.2)" : isGeneral ? "#ed6c02" : "rgba(16, 185, 129, 0.2)";
                const badgeText = isCumulative ? "#7c3aed" : isWeekend ? "#1e40af" : isGeneral ? "#e65100" : "#047857";

                return (
                  <tr key={exam.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>{index + 1}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>{formattedDate}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{dayOfWeek}</div>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                       <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>{finalDisplayTestType}</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {finalTopicsToDisplay.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {finalTopicsToDisplay.map((topic, i) => (
                            <span key={i} style={{ padding: "4px 8px", background: badgeColor, border: `1px solid ${badgeBorder}`, borderRadius: "6px", fontSize: "11px", fontWeight: "500", color: badgeText }}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      ) : <span style={{ color: "#cbd5e1", fontStyle: "italic", fontSize: "12px" }}>No topics</span>}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#f59e0b" }}>{exam.physics || 0}</td>
                    {shouldShowChemistry && <td style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#10b981" }}>{exam.chemistry || 0}</td>}
                  </tr>
                );
              })}
              
              {/* Footer */}
              {(physicsExams.length > 0) && (
                <tr style={{ borderTop: "2px solid #334155" }}>
                  <td colSpan={4} style={{ padding: "16px 8px", textAlign: "right", fontSize: "15px", fontWeight: "700", color: "#1e293b", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>Subject Averages:</td>
                  <td style={{ padding: "16px 8px", textAlign: "center", fontSize: "15px", fontWeight: "700", color: "#f59e0b", backgroundColor: "#fefce8", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "14px", color: "#d97706" }}>Avg: {avgPhysics.toFixed(1)}</div>
                  </td>
                  {shouldShowChemistry && <td style={{ padding: "16px 8px", textAlign: "center", fontSize: "15px", fontWeight: "700", color: "#10b981", backgroundColor: "#f0fdf4", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "14px", color: "#059669" }}>Avg: {avgChemistry.toFixed(1)}</div>
                  </td>}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Top Section: Table (70%) + Chart (30%) */}
      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: "0" }}>
        
        {/* Table Container - Auto Adjusts width */}
        <div style={{ flex: "2", minWidth: "0", display: "flex", flexDirection: "column" }}>
           {renderExamTable(sortedExams)}
        </div>

        {/* Chart Container - Fixed Height to prevent expansion */}
        <div style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column" }}>
           {chartData.length > 0 && (
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", maxHeight: "600px", display: "flex", flexDirection: "column" }}>
              <h4 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaRegChartBar style={{ color: "#4f46e5" }} /> Performance Trend
              </h4>
              <div style={{ flex: 1, minHeight: "0", width: "100%", overflow: "hidden" }}>
                {/* Responsive Chart Container with Fixed Height */}
                <BarChart
                  dataset={chartData} 
                  xAxis={[{ scaleType: "band", dataKey: "date", label: "Exam Date" }]}
                  series={[
                    { dataKey: "subjectMarks", label: "Marks", color: "#4f46e5" } 
                  ]}
                  layout="vertical"
                  margin={{ top: 10, right: 30, bottom: 30, left: 40 }}
                  height={500} // FIXED HEIGHT TO PREVENT EXPANSION
                  slotProps={{ legend: { hidden: true } }} 
                  borderRadius={4}
                />
              </div>
            </div>
           )}
        </div>
      </div>

      {/* Summary Cards Section */}
      <div style={{ background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)", padding: "30px", borderRadius: "16px", color: "white", boxShadow: "0 10px 30px rgba(30, 64, 175, 0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50px", right: "-50px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", width: "200px", height: "200px" }}></div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ background: "rgba(255,255,255,0.15)", width: "60px", height: "60px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
                <FaGraduationCap size={28} color="white" />
              </div>
              <div>
                <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Overall Performance</div>
                <div style={{ fontSize: "24px", fontWeight: "800" }}>{averagePercentage >= 85 ? "Excellent! 🎉" : "Good Job! 👍"}</div>
              </div>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Average Score</div>
              <div style={{ fontSize: "36px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px", color: getGrade(averagePercentage).color }}>
                {averagePercentage.toFixed(1)}% <FaCrown size={24} color="#fbbf24" />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            {[
              { label: "Highest Score", value: `${highestScore} marks`, color: "#86efac" },
              { label: "Lowest Score", value: `${lowestScore} marks`, color: "#fca5a5" },
              { label: "Total Improvement", value: `${improvement >= 0 ? "+" : ""}${improvement.toFixed(1)}%`, color: improvement >= 0 ? "#86efac" : "#fca5a5" },
              { label: "Success Rate", value: `${((sortedExams.filter(e => e.percentage >= 40).length / totalExams) * 100).toFixed(0)}%`, color: "#93c5fd" }
            ].map((stat, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "12px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "8px" }}>{stat.label}</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
<AddExamDialog 
        open={isAddExamOpen} 
        onClose={() => setIsAddExamOpen(false)} 
        currentStudent={currentStudent} 
      />
    </div>
  );
};

export default ResultsTable;