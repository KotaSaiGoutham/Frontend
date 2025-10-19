// RevisionStudentsPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  CircularProgress,
  Alert,
  Slide,
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Collapse,
  Fade,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Payment,
  School,
  CalendarMonth,
  Grade,
  Class,
  CurrencyRupee,
  HowToReg 
} from "@mui/icons-material";
import { keyframes, styled } from "@mui/material/styles";
import {
  revisionStudentsColumns,
  revisionStudentStatusConfig,
  revisionStudentspaymentStatusConfig,
} from "../../mockdata/Options";
import {
  fetchRevisionStudents,
  deleteRevisionStudent,
  updatePaymentStatus,
  updateStudentStatus,
} from "../../redux/actions";
import StudentsTable from "../StudentsTable";
import TimetablePage from "../TimetablePage";
import StudentExamPage from "../StudentExam";
import RevisionClassesPage from "./RevisionClassesPage";
import RevisionRegistratedStudents from "./RevisionRegistratedStudents";
import RevisionExamsPage from "./RevisionExamsPage";
import RevisionFeeManagement from "./RevisionFeeManagement";
const GlowPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  overflow: "hidden",
}));

// Styled Navigation Button
const NavButton = styled(MuiButton)(({ theme, isActive }) => ({
  background: isActive 
    ? "linear-gradient(145deg, #DB1A66 100%)"
    : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.7))",
  boxShadow: isActive 
    ? `0 4px 20px rgba(219, 26, 102, 0.6),
       0 2px 8px rgba(41, 37, 81, 0.4),
       inset 0 1px 0 rgba(255, 255, 255, 0.2)`
    : "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: isActive 
    ? "1px solid rgba(251, 191, 36, 0.3)"
    : "1px solid rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  textTransform: "none",
  padding: "8px 16px",
  color: isActive ? "#fbbf24" : "#292551",
  transform: isActive ? "translateY(-2px) scale(1.02)" : "none",
  fontWeight: isActive ? 700 : 500,
  "&:hover": {
    background: isActive 
      ? "linear-gradient(145deg, #23204A 0%, #C21658 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.8))",
    border: isActive 
      ? "1px solid rgba(251, 191, 36, 0.3)"
      : "1px solid rgba(219, 26, 102, 0.3)",
    color: isActive ? "#fbbf24" : "#DB1A66",
    transform: "translateY(-2px) scale(1.02)",
  },
  "& .MuiSvgIcon-root": {
    color: isActive ? "#fbbf24" : "inherit",
  }
}));

const navItems = [
{ id: "students", label: "Students", icon: <School /> },
{ id: "timetables", label: "Timetables", icon: <CalendarMonth /> },
{ id: "classes", label: "Classes", icon: <Class /> },
{ id: "marks", label: "Marks", icon: <Grade /> }, // Best option
{ id: "fee_details", label: "Fee Details", icon: <CurrencyRupee /> },
  // { id: "registered_students", label: "Registered Students", icon: <HowToReg  /> },

];

const RevisionStudentsPage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector(
    (state) => state.studentprogram
  );

  useEffect(() => {
    dispatch(fetchRevisionStudents());
  }, [dispatch]);

  // Render different components based on active tab with revision flag
  const renderActiveComponent = () => {
    const revisionFlag = true; // Always true for RevisionStudentsPage

    switch (activeTab) {
      case "students":
        return <StudentsTable isRevisionProgramJEEMains2026Student={revisionFlag} />;
      case "timetables":
        return <TimetablePage isRevisionProgramJEEMains2026Student={revisionFlag} />;
      case "marks":
        return <RevisionExamsPage />;
      case "classes":
               return <RevisionClassesPage isRevisionProgramJEEMains2026Student={revisionFlag} />;
      case "fee_details":
        return (
          <RevisionFeeManagement/>
        );
        case "registered_students":
        return <RevisionRegistratedStudents />;
      default:
        return <StudentsTable isRevisionProgramJEEMains2026Student={revisionFlag} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: 3,
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Custom Navigation Bar */}
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={500}>
        <GlowPaper
          sx={{
            p: 3,
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            {/* Title Section */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    color: "#292551",
                    fontWeight: 700,
                    mb: 0.5,
                    background: "linear-gradient(45deg, #292551, #3b82f6)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  JEE Mains 2026 Revision Program
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage revision program students, timetable, marks, and more.
                </Typography>
              </Box>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: 'wrap' }}>
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  startIcon={item.icon}
                  onClick={() => setActiveTab(item.id)}
                  isActive={item.id === activeTab}
                >
                  <Typography 
                    variant="body1" 
                    sx={{
                      textShadow: item.id === activeTab ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none",
                      letterSpacing: item.id === activeTab ? "0.5px" : "normal",
                    }}
                  >
                    {item.label}
                  </Typography>
                </NavButton>
              ))}
            </Box>
          </Box>
        </GlowPaper>
      </Slide>

      {/* Content Area */}
      <Box>
        {renderActiveComponent()}
      </Box>
    </Box>
  );
};

// Add the missing keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default RevisionStudentsPage;