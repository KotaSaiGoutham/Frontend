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
  Slide,
  Chip,
  useTheme,
  Tooltip 
} from "@mui/material";
import { FaListAlt } from "react-icons/fa";
import { topicOptions } from "../mockdata/Options";
import { MuiMultiSelectChip } from "./customcomponents/MuiCustomFormFields";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import ScienceIcon from "@mui/icons-material/Science";
import ClassIcon from "@mui/icons-material/Class";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import format from "date-fns/format";

import { updateWeeklySyllabus } from "../redux/actions";

// Define keyframes for the fade-in animation
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

  const [selectedLessons, setSelectedLessons] = useState({});

  // Use a single debounce ref for all students
  const timeoutRef = useRef({});

  // Format Firestore Timestamp or Date object
  const formatLessonDate = (date) => {
    if (!date) return "N/A";
    // Check if the date is a Firestore Timestamp
    if (date.toDate) {
      try {
        return format(date.toDate(), "dd-MM-yy");
      } catch (e) {
        console.error("Failed to convert Firestore Timestamp:", e);
        return "N/A";
      }
    }
    // Check if the date is a string (old format)
    if (typeof date === "string") {
      const parts = date.split("-");
      if (parts.length === 3) {
        return date;
      }
    }
    return "N/A";
  };

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

      // Ensure the value is always an array of strings
      const newLessons =
        typeof value === "string" ? value.split(",") : value.map(String);

      setSelectedLessons((prevLessons) => ({
        ...prevLessons,
        [studentId]: newLessons,
      }));

      // Clear any existing debounce timer for this student
      if (timeoutRef.current[studentId]) {
        clearTimeout(timeoutRef.current[studentId]);
      }

      // Set a new debounce timer
      timeoutRef.current[studentId] = setTimeout(() => {
        handleUpdateSyllabus(studentId, newLessons);
      }, 500); // 500ms debounce
    },
    [handleUpdateSyllabus]
  );

  // Sync state with students data when fetched
  useEffect(() => {
    if (students && students.length > 0) {
      const initialLessons = {};
      students.forEach((student) => {
        if (student.lessons) {
          // Ensure lessons are stored as an array of strings
          initialLessons[student.id] = student.lessons.map(String);
        }
      });
      setSelectedLessons(initialLessons);
    }
  }, [students]);

  const { user } = useSelector((state) => state.auth);

  const filteredTopics = topicOptions.filter((topic) => {
    if (!user.isPhysics && !user.isChemistry) return true;
    if (
      user.isPhysics &&
      (topic.subject === "Physics" || topic.subject === "All")
    ) {
      return true;
    }
    if (
      user.isChemistry &&
      (topic.subject === "Chemistry" || topic.subject === "All")
    ) {
      return true;
    }
    return false;
  });

  const formattedTopicOptions = filteredTopics
    .map((topic) => ({
      value: String(topic.id), // Ensure values are strings for consistency
      label: topic.topic,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  if (studentsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (studentsError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{studentsError}</Alert>
      </Box>
    );
  }

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

      {/* Active Students Table */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={700}>
        <Paper
          elevation={12}
          sx={{
            p: 2,
            overflowX: "auto",
            borderRadius: "16px",
            boxShadow: theme.shadows[12],
          }}
        >
          {students.filter((student) => student.isActive).length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                overflow: "hidden", // Ensures border-radius is applied correctly
              }}
            >
              <Table sx={{ minWidth: 750 }} aria-label="week syllabus table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#eef7ff" }}>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: theme.palette.primary.main,
                        py: 2,
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <SchoolIcon
                        fontSize="small"
                        sx={{ verticalAlign: "bottom", mr: 0.5 }}
                      />{" "}
                      Sl No
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: theme.palette.primary.main,
                        py: 2,
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <PersonIcon
                        fontSize="small"
                        sx={{ verticalAlign: "bottom", mr: 0.5 }}
                      />{" "}
                      Student Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: theme.palette.primary.main,
                        py: 2,
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <ScienceIcon
                        fontSize="small"
                        sx={{ verticalAlign: "bottom", mr: 0.5 }}
                      />{" "}
                      Stream
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: theme.palette.primary.main,
                        py: 2,
                        borderBottom: "2px solid #ddd",
                        minWidth: 280,
                      }}
                    >
                      <ClassIcon
                        fontSize="small"
                        sx={{ verticalAlign: "bottom", mr: 0.5 }}
                      />{" "}
                      Name of the Lesson
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students
                    .filter((student) => student.isActive)
                    .map((student, index) => (
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
                        <TableCell
                          align="center"
                          sx={{ p: 0, fontSize: "1rem" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ p: 2, fontSize: "1rem" }}
                        >
                          <Tooltip
                            title={`Click to view details for ${student.Name}`}
                          >
                            <Link
                              to={`/student/${student.id}`}
                              state={{ studentData: student }}
                              style={{
                                fontWeight: 500,
                                color: "#34495e",
                                textDecoration: "none",
                                transition:
                                  "color 0.2s ease, text-decoration 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#2980b9";
                                e.currentTarget.style.textDecoration =
                                  "underline";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#34495e";
                                e.currentTarget.style.textDecoration = "none";
                              }}
                            >
                              {student.Name}
                            </Link>
                          </Tooltip>
                        </TableCell>{" "}
                        <TableCell
                          align="center"
                          sx={{ p: 0, fontSize: "1rem" }}
                        >
                          {student.Stream}
                        </TableCell>
                        <TableCell align="center" sx={{ p: 0, minWidth: 280 }}>
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
            <Alert severity="info" sx={{ mt: 2 }}>
              No active student records found.
            </Alert>
          )}
        </Paper>
      </Slide>
    </Box>
  );
};

export default WeekSyllabusPage;
