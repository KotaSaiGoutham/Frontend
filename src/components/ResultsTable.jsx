import React, { useState, useEffect, useMemo } from "react";
import {
  FaFlask,
  FaCalculator,
  FaAtom,
  FaClipboardList,
  FaPlus,
  FaBookOpen,
  FaRegChartBar,
  FaCalendarAlt,
  FaTrophy
} from "react-icons/fa";
import {
  CalendarToday,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevisionExamConsolidation } from "../redux/actions";
import { isoToDDMMYYYY } from "../mockdata/function";
import AddExamDialog from "./student-portfolio/AddExamDialog";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from "@mui/material";

// --- Styled Components ---
const ScrollableTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 600,
  '&::-webkit-scrollbar': { width: 8, height: 8 },
  '&::-webkit-scrollbar-track': { backgroundColor: '#f1f5f9' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 4 },
}));

const StickyTableHead = styled(TableHead)(({ theme }) => ({
  '& th': { backgroundColor: '#f8fafc', zIndex: 10 },
}));

// Replaced imported HeaderCell to ensure full control over width/styling here
const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  color: "#475569",
  backgroundColor: "#f8fafc",
  borderBottom: "2px solid #e2e8f0",
  fontSize: "0.85rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
}));

// --- Helpers ---
const formatTestType = (typeInput) => {
  if (!typeInput) return "Weekly Test";
  const typeStr = Array.isArray(typeInput) ? typeInput[0] : typeInput;
  if (!typeStr) return "Weekly Test";
  const result = typeStr.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const getGrade = (percentage) => {
  if (percentage >= 90) return { grade: "A+", color: "#059669", bgColor: "#ecfdf5", label: "Outstanding" };
  if (percentage > 80) return { grade: "A", color: "#10b981", bgColor: "#d1fae5", label: "Excellent" };
  if (percentage > 70) return { grade: "B+", color: "#2563eb", bgColor: "#dbeafe", label: "Very Good" };
  if (percentage > 60) return { grade: "B", color: "#3b82f6", bgColor: "#eff6ff", label: "Good" };
  if (percentage > 50) return { grade: "C", color: "#d97706", bgColor: "#fef3c7", label: "Average" };
  if (percentage >= 40) return { grade: "D", color: "#f97316", bgColor: "#ffedd5", label: "Needs Imp." };
  return { grade: "F", color: "#dc2626", bgColor: "#fee2e2", label: "Fail" };
};

// --- Sub-Components ---

const EmptyState = ({ onAdd }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    height: "60vh", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    borderRadius: "24px", border: "2px dashed #e2e8f0", padding: "20px"
  }}>
    <div style={{
      width: "80px", height: "80px", borderRadius: "50%", background: "#eef2ff",
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
      boxShadow: "0 0 0 8px #f5f3ff"
    }}>
      <FaClipboardList style={{ fontSize: "32px", color: "#6366f1" }} />
    </div>
    <h3 style={{ fontSize: "20px", color: "#1e293b", fontWeight: "800", marginBottom: "8px", textAlign: "center" }}>
      No Exam Records Found
    </h3>
    <button
      onClick={onAdd}
      style={{
        padding: "12px 24px", background: "#4f46e5", color: "white", border: "none",
        borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "8px", marginTop: "20px",
        boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
      }}
    >
      <FaPlus /> Add First Exam
    </button>
  </div>
);

// --- Enhanced Mobile Card ---
const ExamCard = ({ exam, shouldShowPhysics, shouldShowChemistry, shouldShowMaths }) => {
  const grade = exam.gradeInfo;

  return (
    <Card sx={{
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      border: "1px solid #f1f5f9",
      mb: 2,
      overflow: "visible"
    }}>
      <CardContent sx={{ p: "16px !important" }}>

        {/* Top: Date & Badge */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="caption" sx={{ color: "#64748b", display: "flex", alignItems: "center", gap: 0.5, fontSize: "11px", fontWeight: 600, textTransform: 'uppercase' }}>
            <FaCalendarAlt size={10} /> {exam.displayDate}
          </Typography>

        </Box>

        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "15px", mb: 2 }}>
          {exam.displayType}
        </Typography>

        {/* Marks Row */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-around", // Distribute evenly
          alignItems: "center",
          bgcolor: "#f8fafc",
          p: 1.5,
          borderRadius: "12px",
          border: "1px solid #e2e8f0"
        }}>
          {/* Physics */}
          {shouldShowPhysics && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "9px", fontWeight: 700, display: "block" }}>PHY</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: "#3b82f6" }}>{exam.physics || "-"}</Typography>
            </Box>
          )}

          {shouldShowPhysics && shouldShowChemistry && <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center', borderColor: '#cbd5e1' }} />}

          {/* Chemistry */}
          {shouldShowChemistry && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "9px", fontWeight: 700, display: "block" }}>CHEM</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: "#10b981" }}>{exam.chemistry || "-"}</Typography>
            </Box>
          )}

          {shouldShowChemistry && shouldShowMaths && <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center', borderColor: '#cbd5e1' }} />}

          {/* Maths */}
          {shouldShowMaths && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "9px", fontWeight: 700, display: "block" }}>MATH</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: "#f97316" }}>{exam.maths || "-"}</Typography>
            </Box>
          )}
        </Box>


      </CardContent>
    </Card>
  );
};

const ResultsTable = ({
  studentExams = [],
  loading = false,
  studentData = {},
  chartData = [],
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentStudent = useSelector((state) => state.auth?.currentStudent) || studentData;
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);

  const { exams: consolidatedExams } = useSelector((state) => state.revisionExams.examConsolidation);

  useEffect(() => {
    dispatch(fetchRevisionExamConsolidation());
  }, [dispatch]);

  // --- Data Processing ---
  const processedData = useMemo(() => {
    const rawExams = studentData?.isRevisionProgramJEEMains2026Student
      ? studentExams.filter((exam) => exam.isRevisionProgramJEEMains2026Student === true)
      : studentExams;

    const mapped = rawExams.map((exam) => {
      let physicsMarks = exam.physics || 0;
      let chemistryMarks = exam.chemistry || 0;
      let mathsMarks = exam.maths || 0;
      const isRevisionStudent = exam.isRevisionProgramJEEMains2026Student;
      const isCommonStudent = exam.isCommonStudent;

      let maxPhysics = 100, maxChemistry = 100, maxMaths = 100;
      if (isRevisionStudent) {
        if (isCommonStudent) { maxPhysics = 100; maxChemistry = 100; maxMaths = 0; }
        else { maxPhysics = 100; maxChemistry = 0; maxMaths = 0; }
      }

      const totalObtained = physicsMarks + chemistryMarks + mathsMarks;
      const totalMaximum = maxPhysics + maxChemistry + maxMaths;
      const percentage = totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;
      const examDateFormatted = isoToDDMMYYYY(exam.examDate);
      const consolidatedExam = consolidatedExams?.find(c => c.examDate === examDateFormatted);

      let finalDisplayTestType = formatTestType(exam.testType);
      let finalTopics = Array.isArray(exam.topic) ? exam.topic : exam.topic ? [exam.topic] : [];

      if (isRevisionStudent && consolidatedExam) {
        finalDisplayTestType = formatTestType(consolidatedExam.testType || consolidatedExam.type);
        finalTopics = consolidatedExam.uniqueTopics || [];
      }

      return {
        ...exam,
        dateObj: new Date(exam.examDate),
        displayDate: isoToDDMMYYYY(exam.examDate),
        displayType: finalDisplayTestType,
        displayTopics: finalTopics,
        totalObtained,
        totalMarks: totalMaximum,
        percentage: Math.round(percentage * 100) / 100,
        gradeInfo: getGrade(percentage),
      };
    });

    return mapped.sort((a, b) => b.dateObj - a.dateObj);
  }, [studentExams, studentData, consolidatedExams]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading...</div>;

  if (processedData.length === 0) {
    return (
      <>
        <EmptyState onAdd={() => setIsAddExamOpen(true)} />
        <AddExamDialog open={isAddExamOpen} onClose={() => setIsAddExamOpen(false)} currentStudent={currentStudent} />
      </>
    );
  }

  // --- Statistics ---
  const chartDisplayData = processedData.slice(0, 10).reverse().map(item => ({
    date: item.displayDate.substring(0, 5),
    subjectMarks: item.percentage
  }));

  const shouldShowPhysics = processedData.some(e => e.physics > 0);
  const shouldShowChemistry = processedData.some(e => e.chemistry > 0);
  const shouldShowMaths = processedData.some(e => e.maths > 0);

  // Dynamic Column Width Calculation for Desktop
  let visibleSubjectsCount = 0;
  if (shouldShowPhysics) visibleSubjectsCount++;
  if (shouldShowChemistry) visibleSubjectsCount++;
  if (shouldShowMaths) visibleSubjectsCount++;

  // Distribute remaining 45% width among visible subjects
  const subjectColumnWidth = visibleSubjectsCount > 0 ? `${45 / visibleSubjectsCount}%` : "auto";

  const avgPhysics = shouldShowPhysics ? processedData.reduce((sum, e) => sum + (e.physics || 0), 0) / processedData.filter(e => e.physics > 0).length : 0;
  const avgChemistry = shouldShowChemistry ? processedData.reduce((sum, e) => sum + (e.chemistry || 0), 0) / processedData.filter(e => e.chemistry > 0).length : 0;
  const avgMaths = shouldShowMaths ? processedData.reduce((sum, e) => sum + (e.maths || 0), 0) / processedData.filter(e => e.maths > 0).length : 0;
console.log('studentData',studentData)
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'Inter', sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: 'wrap', gap: 2 }}>
        <div>
          <h2 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: "800", color: "#1e293b", margin: 0, letterSpacing: "-0.5px" }}>Academic Performance</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>Tracking records for <span style={{ fontWeight: "600", color: "#4f46e5" }}>{studentData.Name}</span></p>
        </div>
        <button
          onClick={() => setIsAddExamOpen(true)}
          style={{
            padding: "10px 20px", background: "#4f46e5", color: "white", border: "none",
            borderRadius: "10px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)", transition: "all 0.2s"
          }}
        >
          <FaPlus /> New Entry
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "20px", alignItems: "flex-start" }}>

        {/* LEFT: Detailed Table or Grid (Flex 2) */}
        <div style={{ flex: 2, width: '100%', minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>

          {isMobile ? (
            <Box>
              <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: "700", color: "#334155", mb: 2, display: "flex", alignItems: "center", gap: "8px" }}>
                <FaBookOpen style={{ color: "#6366f1" }} /> Recent Exams
              </Typography>

              {/* List of Mobile Cards */}
              {processedData.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  shouldShowPhysics={shouldShowPhysics}
                  shouldShowChemistry={shouldShowChemistry}
                  shouldShowMaths={shouldShowMaths}
                />
              ))}

              {/* Mobile Averages Summary (Bottom) */}
              <Card sx={{ bgcolor: "#1e293b", color: "white", borderRadius: "16px", mt: 2, boxShadow: "0 8px 20px rgba(30, 41, 59, 0.25)" }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FaTrophy style={{ color: "#fbbf24" }} />
                    <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 700 }}>Overall Performance</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {shouldShowPhysics && (
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>Avg Phy</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{avgPhysics.toFixed(1)}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {shouldShowChemistry && (
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>Avg Chem</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{avgChemistry.toFixed(1)}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {shouldShowMaths && (
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>Avg Math</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{avgMaths.toFixed(1)}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Paper sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", width: '100%' }}>
              {/* Desktop Table View */}
              <Box sx={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#ffffff" }}>
                <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: "700", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaBookOpen style={{ color: "#6366f1" }} /> Exam Records
                </Typography>
              </Box>

              <ScrollableTableContainer>
                <Table size="small" stickyHeader sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <StickyTableHead>
                    <TableRow>
                      <StyledHeaderCell rowSpan={2} sx={{ width: "8%", textAlign: "center", verticalAlign: "middle" }}>S.No.</StyledHeaderCell>
                      <StyledHeaderCell rowSpan={2} sx={{ width: "22%", textAlign: "center", verticalAlign: "middle" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 16 }} />
                          <span>Date</span>
                        </Box>
                      </StyledHeaderCell>
                      <StyledHeaderCell rowSpan={2} sx={{ width: "25%", textAlign: "center", verticalAlign: "middle" }}>Type</StyledHeaderCell>

                      {/* Dynamic Widths to fill remaining space (45%) */}
                      {shouldShowPhysics && <StyledHeaderCell sx={{ width: subjectColumnWidth, textAlign: "center" }}>Physics</StyledHeaderCell>}
                      {shouldShowChemistry && <StyledHeaderCell sx={{ width: subjectColumnWidth, textAlign: "center" }}>Chemistry</StyledHeaderCell>}
                      {shouldShowMaths && <StyledHeaderCell sx={{ width: subjectColumnWidth, textAlign: "center" }}>Maths</StyledHeaderCell>}
                    </TableRow>
                  </StickyTableHead>
                  <TableBody>
                    {processedData.map((exam, index) => (
                      <TableRow key={exam.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ textAlign: "center", padding: "8px 6px", borderRight: "1px solid #f1f5f9" }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "#475569", fontSize: "0.9rem" }}>{index + 1}</Typography>
                        </TableCell >
                        <TableCell sx={{ textAlign: "center", padding: "8px 6px", borderRight: "1px solid #f1f5f9" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>{exam.displayDate}</Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>{exam.dateObj.toLocaleDateString('en-US', { weekday: 'long' })}</Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "8px 6px", borderRight: "1px solid #f1f5f9" }}>
                          <Typography sx={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", textTransform: "uppercase" }}>{exam.displayType}</Typography>
                        </TableCell>

                        {shouldShowPhysics && (
                          <TableCell sx={{ textAlign: "center", padding: "8px 6px", borderRight: "1px solid #f1f5f9" }}>
                            {exam.physics > 0 ? <Box component="span" display="flex" alignItems="center" justifyContent="center" gap={0.5}>{exam.physics}</Box> : "-"}
                          </TableCell>
                        )}
                        {shouldShowChemistry && (
                          <TableCell sx={{ textAlign: "center", padding: "8px 6px", borderRight: "1px solid #f1f5f9" }}>
                            {exam.chemistry > 0 ? <Box component="span" display="flex" alignItems="center" justifyContent="center" gap={0.5}>{exam.chemistry}</Box> : "-"}
                          </TableCell>
                        )}
                        {shouldShowMaths && (
                          <TableCell sx={{ textAlign: "center", padding: "8px 6px", borderRight: "1px solid #f1f5f9" }}>
                            {exam.maths > 0 ? <Box component="span" display="flex" alignItems="center" justifyContent="center" gap={0.5}>{exam.maths}</Box> : "-"}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableBody sx={{ position: "sticky", bottom: 0, bgcolor: "#f8fafc", borderTop: "2px solid #e2e8f0", zIndex: 10 }}>
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "right", fontWeight: "700", textTransform: "uppercase", fontSize: "12px", color: "#64748b" }}>Average Scores:</TableCell>
                      {shouldShowPhysics && <TableCell sx={{ textAlign: "center", fontWeight: "700" }}>{avgPhysics.toFixed(1)}</TableCell>}
                      {shouldShowChemistry && <TableCell sx={{ textAlign: "center", fontWeight: "700" }}>{avgChemistry.toFixed(1)}</TableCell>}
                      {shouldShowMaths && <TableCell sx={{ textAlign: "center", fontWeight: "700" }}>{avgMaths.toFixed(1)}</TableCell>}
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollableTableContainer>
            </Paper>
          )}
        </div>

        {/* RIGHT: Charts & Summaries (Flex 1) */}
        <div style={{ flex: 1, width: '100%', minWidth: isMobile ? '100%' : "320px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Chart Card */}
          {chartData.length > 0 && (
            <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaRegChartBar style={{ color: "#4f46e5" }} /> Trend Analysis
              </h4>
              <div style={{ width: "100%", height: "250px" }}>
                <BarChart
                  dataset={chartDisplayData}
                  xAxis={[{ scaleType: "band", dataKey: "date", label: "Exam Date", tickLabelStyle: { fontSize: 10, fill: '#94a3b8' } }]}
                  series={[{ dataKey: "subjectMarks", label: "Percentage", color: "#4f46e5", radius: [4, 4, 0, 0] }]}
                  margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                  height={250}
                  borderRadius={4}
                  grid={{ horizontal: true }}
                  slotProps={{ legend: { hidden: true } }}
                />
              </div>
            </div>
          )}

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