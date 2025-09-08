import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  Tooltip,
  Slide,
} from "@mui/material";
import { FaListAlt } from "react-icons/fa";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import ScienceIcon from "@mui/icons-material/Science";
import ClassIcon from "@mui/icons-material/Class";

// Assuming these are local imports
import { topicOptions } from "../mockdata/Options";
import { MuiMultiSelectChip } from "./customcomponents/MuiCustomFormFields";
import { updateWeeklySyllabus, fetchStudentExams } from "../redux/actions";

// Keyframes for the fade-in animation
const fadeIn = `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`;

const WeekSyllabusPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const {
    studentExams,
    loading: examsLoading,
    error: examsError,
  } = useSelector((state) => state.studentExams);

  const [selectedLessons, setSelectedLessons] = useState({});
  const timeoutRef = useRef({});

  // Sync state with students data when fetched
  useEffect(() => {
    if (students && students.length > 0) {
      const initialLessons = {};
      students.forEach((student) => {
        if (student.lessons) {
          initialLessons[student.id] = student.lessons.map(String);
        }
      });
      setSelectedLessons(initialLessons);
    }
  }, [students]);

  // Fetch exams data when component mounts
  useEffect(() => {
    dispatch(fetchStudentExams());
  }, [dispatch]);

  const handleUpdateSyllabus = useCallback(
    (studentId, lessons) => {
      const lessonsToUpdate = topicOptions
        .filter((topic) => lessons.includes(String(topic.id)))
        .map((topic) => ({ id: topic.id, topic: topic.topic }));
      dispatch(updateWeeklySyllabus(studentId, lessonsToUpdate));
    },
    [dispatch]
  );

  const handleLessonChange = useCallback(
    (event, studentId) => {
      const {
        target: { value },
      } = event;
      const newLessons = typeof value === "string" ? value.split(",") : value.map(String);
      setSelectedLessons((prevLessons) => ({
        ...prevLessons,
        [studentId]: newLessons,
      }));
      if (timeoutRef.current[studentId]) {
        clearTimeout(timeoutRef.current[studentId]);
      }
      timeoutRef.current[studentId] = setTimeout(() => {
        handleUpdateSyllabus(studentId, newLessons);
      }, 500);
    },
    [handleUpdateSyllabus]
  );

  const { user } = useSelector((state) => state.auth);

  // Filter topics based on the user's selected subject (Physics, Chemistry, or All)
  const filteredTopics = topicOptions.filter((topic) => {
    const isPhysicsUser = user.isPhysics;
    const isChemistryUser = user.isChemistry;
    const topicSubject = topic.subject;

    if (!isPhysicsUser && !isChemistryUser) {
      return true; // Show all topics if the user is not specifically a Physics or Chemistry teacher
    }
    if (isPhysicsUser && (topicSubject === "Physics" || topicSubject === "All")) {
      return true;
    }
    if (isChemistryUser && (topicSubject === "Chemistry" || topicSubject === "All")) {
      return true;
    }
    return false;
  });

  const formattedTopicOptions = filteredTopics
    .map((topic) => ({
      value: String(topic.id),
      label: topic.topic,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  if (studentsLoading || examsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (studentsError || examsError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{studentsError || examsError}</Alert>
      </Box>
    );
  }

  // Logic to separate and sort students
  const studentsTakingExamsIds = new Set(studentExams.map((exam) => exam.studentId));
  const activeStudents = students.filter((student) => student.isActive);

  const studentsWithExams = activeStudents
    .filter((student) => studentsTakingExamsIds.has(student.id))
    .sort((a, b) => {
      const aIsPaid = a["Payment Status"] === "Paid";
      const bIsPaid = b["Payment Status"] === "Paid";
      if (aIsPaid && !bIsPaid) return -1;
      if (!aIsPaid && bIsPaid) return 1;
      return (b.classDateandTime?.length || 0) - (a.classDateandTime?.length || 0);
    });

  const studentsWithoutExams = activeStudents.filter(
    (student) => !studentsTakingExamsIds.has(student.id)
  );

  const renderStudentTable = (studentList, title, badgeCount) => (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: theme.palette.primary.dark, fontWeight: "bold" }}
        >
          {title}
        </Typography>
        <Chip 
          label={badgeCount} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>
      
      {studentList.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Table sx={{ minWidth: 750 }} aria-label="week syllabus table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eef7ff" }}>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: theme.palette.primary.main,
                    py: 1.5,
                    borderBottom: "2px solid #ddd",
                    width: "60px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <SchoolIcon fontSize="small" sx={{ verticalAlign: "bottom", mr: 0.5 }} /> Sl No
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: theme.palette.primary.main,
                    py: 1.5,
                    borderBottom: "2px solid #ddd",
                    width: "180px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <PersonIcon fontSize="small" sx={{ verticalAlign: "bottom", mr: 0.5 }} /> Student Name
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: theme.palette.primary.main,
                    py: 1.5,
                    borderBottom: "2px solid #ddd",
                    width: "120px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <ScienceIcon fontSize="small" sx={{ verticalAlign: "bottom", mr: 0.5 }} /> Stream
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: theme.palette.primary.main,
                    py: 1.5,
                    borderBottom: "2px solid #ddd",
                    width: "100%",
                  }}
                >
                  <ClassIcon fontSize="small" sx={{ verticalAlign: "bottom", mr: 0.5 }} /> Name of the Lesson
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentList.map((student, index) => (
                <TableRow
                  key={student.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fbfcfd" },
                    "&:hover": {
                      backgroundColor: "#eef7ff",
                      transform: "scale(1.01)",
                      transition: "all 0.3s ease-in-out",
                      boxShadow: theme.shadows[4],
                    },
                    "&:not(:hover)": {
                      transform: "scale(1)",
                      transition: "all 0.3s ease-in-out",
                    },
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <TableCell align="center" sx={{ p: 1.5, width: "60px", whiteSpace: "nowrap" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1.5, width: "180px", whiteSpace: "nowrap" }}>
                    <Tooltip title={`Click to view details for ${student.Name}`}>
                      <Link
                        to={`/student/${student.id}`}
                        state={{ studentData: student }}
                        style={{
                          fontWeight: 500,
                          color: "#34495e",
                          textDecoration: "none",
                          transition: "color 0.2s ease, text-decoration 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#2980b9";
                          e.currentTarget.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#34495e";
                          e.currentTarget.style.textDecoration = "none";
                        }}
                      >
                        {student.Name}
                      </Link>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1.5, width: "120px", whiteSpace: "nowrap" }}>
                    {student.Stream}
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1.5, width: "100%" }}>
                    <MuiMultiSelectChip
                      label="Lesson"
                      name={`lesson-${student.id}`}
                      value={selectedLessons[student.id] || []}
                      onChange={(e) => handleLessonChange(e, student.id)}
                      options={formattedTopicOptions}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
          No student records found in this category.
        </Alert>
      )}
    </>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        ...{
          animation: `${fadeIn} 0.8s ease-in-out`,
        },
      }}
    >
      <Slide
        direction="down"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={500}
      >
        <Paper
          elevation={12}
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            borderRadius: "16px",
            boxShadow: theme.shadows[12],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FaListAlt
              style={{
                marginRight: "15px",
                fontSize: "3rem",
                color: "#1976d2",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "#292551", fontWeight: 700, mb: 0.5 }}
              >
                Week Syllabus 📚
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Assign weekly lessons to your students.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Slide>

      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={12}
          sx={{
            p: 3,
            overflowX: "auto",
            borderRadius: "16px",
            boxShadow: theme.shadows[12],
          }}
        >
          {/* Students with Exams Section */}
          {renderStudentTable(studentsWithExams, "Students with Upcoming Exams", studentsWithExams.length)}
          
          <Divider sx={{ my: 4 }} />
          
          {/* Students Without Exams Section */}
          {renderStudentTable(studentsWithoutExams, "Students Without Exams", studentsWithoutExams.length)}
        </Paper>
      </Slide>
    </Box>
  );
};

export default WeekSyllabusPage;