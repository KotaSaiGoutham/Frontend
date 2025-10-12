import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Tooltip,
  IconButton,
  Fade,
  Button,
  TextField,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Refresh,
  Edit,
  Check,
  Close,
  NavigateBefore,
  NavigateNext,
  CalendarToday,
} from "@mui/icons-material";
import {
  fetchRevisionExams,
  addStudentExam,
  updateStudentExam,
} from "../../redux/actions";

// --- Styled Components ---

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.9rem", // Slightly reduced
  borderRight: "1px solid #475569",
  padding: "10px 8px", // Slightly reduced
  textAlign: "center",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
  },
  "&:last-child": {
    borderTopRightRadius: "8px",
    borderRight: "none",
  },
}));

const SubjectHeaderCell = styled(HeaderCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  minWidth: "70px", // Slightly reduced
  fontSize: "0.8rem", // Slightly reduced
}));

const StudentHeaderGroup = styled(TableRow)(({ theme }) => ({
  "& > th": {
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    borderRight: "1px solid #475569",
    padding: "6px", // Slightly reduced
  },
}));

// Updated ExamRow with different colors based on exam type
const ExamRow = styled(TableRow)(({ istoday, examtype }) => {
  // Define background colors based on exam type
  const getBackgroundColor = () => {
    if (istoday) return "#fff3cd"; // Highlight today's exams

    switch (examtype) {
      case "weekend":
        return "#f0f9ff"; // Light blue for weekend tests
      case "cumulative":
        return "#f0fdf4"; // Light green for cumulative tests
      case "grand":
        return "#fef7ff"; // Light purple for grand tests
      default:
        return "#fff"; // White for others
    }
  };

  const getBorderColor = () => {
    if (istoday) return "#3b82f6"; // Blue border for today

    switch (examtype) {
      case "weekend":
        return "#0ea5e9"; // Blue border for weekend
      case "cumulative":
        return "#10b981"; // Green border for cumulative
      case "grand":
        return "#8b5cf6"; // Purple border for grand
      default:
        return "none";
    }
  };

  return {
    backgroundColor: getBackgroundColor(),
    borderLeft: istoday ? `4px solid ${getBorderColor()}` : "none",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.3s ease-in-out",
    animation: istoday ? "pulseHighlight 2s ease-in-out infinite" : "none",
    "&:hover": {
      backgroundColor: istoday
        ? "#ffeaa7"
        : examtype === "weekend"
        ? "#e0f2fe"
        : examtype === "cumulative"
        ? "#dcfce7"
        : examtype === "grand"
        ? "#f3e8ff"
        : "#f8f9fa",
    },
    "@keyframes pulseHighlight": {
      "0%": {
        boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.3)",
      },
      "70%": {
        boxShadow: "0 0 0 6px rgba(59, 130, 246, 0)",
      },
      "100%": {
        boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
      },
    },
  };
});

// Styled cell for subject marks with exam type colors
const SubjectCell = styled(TableCell)(({ examtype, isediting }) => {
  const getCellBackgroundColor = () => {
    switch (examtype) {
      case "weekend":
        return isediting ? "#e0f2fe" : "#f0f9ff"; // Light blue
      case "cumulative":
        return isediting ? "#dcfce7" : "#f0fdf4"; // Light green
      case "grand":
        return isediting ? "#f3e8ff" : "#fef7ff"; // Light purple
      default:
        return isediting ? "#f1f5f9" : "#fff"; // Default
    }
  };

  const getBorderColor = () => {
    switch (examtype) {
      case "weekend":
        return "#bae6fd"; // Light blue border
      case "cumulative":
        return "#bbf7d0"; // Light green border
      case "grand":
        return "#e9d5ff"; // Light purple border
      default:
        return "#f1f5f9"; // Default border
    }
  };

  return {
    textAlign: "center",
    padding: "6px", // Slightly reduced
    borderRight: `1px solid ${getBorderColor()}`,
    backgroundColor: getCellBackgroundColor(),
    transition: "all 0.2s ease-in-out",
    minHeight: "50px", // Slightly reduced
  };
});

const StudentBadge = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
  border: "1px solid #f59e0b",
  borderRadius: "6px", // Slightly reduced
  padding: "6px 4px", // Slightly reduced
  textAlign: "center",
}));

// Badge for exam type in the exam name cell
const ExamTypeBadge = styled(Box)(({ examtype }) => {
  const getBadgeStyle = () => {
    switch (examtype) {
      case "weekend":
        return {
          background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
          color: "#0369a1",
          border: "1px solid #bae6fd",
        };
      case "cumulative":
        return {
          background: "linear-gradient(135deg, #dcfce7, #f0fdf4)",
          color: "#047857",
          border: "1px solid #bbf7d0",
        };
      case "grand":
        return {
          background: "linear-gradient(135deg, #f3e8ff, #faf5ff)",
          color: "#7c3aed",
          border: "1px solid #e9d5ff",
        };
      default:
        return {
          background: "linear-gradient(135deg, #f1f5f9, #f8fafc)",
          color: "#475569",
          border: "1px solid #e2e8f0",
        };
    }
  };

  const style = getBadgeStyle();

  return {
    ...style,
    borderRadius: "6px", // Slightly reduced
    padding: "3px 10px", // Slightly reduced
    display: "inline-block",
    fontSize: "0.8rem", // Slightly reduced
    fontWeight: 600,
    marginLeft: "10px", // Slightly reduced
  };
});

const RevisionExamsPage = () => {
  const [savingState, setSavingState] = useState({});
  const [saveMessage, setSaveMessage] = useState({
    text: "",
    severity: "info",
  });
  const [editingExam, setEditingExam] = useState({});
  const [examMarks, setExamMarks] = useState({});
  const [examData, setExamData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [globalEditMode, setGlobalEditMode] = useState(false); // Global edit mode state

  const dispatch = useDispatch();
  const { exams, loading, error } = useSelector((state) => state.revisionExams);

  const { students: allStudents } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const getTodayDate = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  const todayDate = getTodayDate();

  // Student configuration based on your screenshot
  const studentConfig = useMemo(
    () => [
      {
        id: "gagan",
        name: "Gagan",
        shortName: "Gagan",
        initials: "G",
        isCommon: true,
      },
      {
        id: "amal",
        name: "Amal",
        shortName: "Amal",
        initials: "A",
        isCommon: true,
      },
      {
        id: "sriya",
        name: "Sriya JEE",
        shortName: "Sriya",
        initials: "S",
        isCommon: true,
      },
      {
        id: "ananya",
        name: "Ananya",
        shortName: "Ananya",
        initials: "A",
        isCommon: true,
      },

      {
        id: "nithya",
        name: "Nithya",
        shortName: "Nithya",
        initials: "N",
        isCommon: false,
      },
      {
        id: "navya",
        name: "Navya",
        shortName: "Navya",
        initials: "N",
        isCommon: false,
      },
    ],
    []
  );

  const revisionStudents = useMemo(() => {
    return studentConfig.map((config) => {
      const matchedStudent = allStudents.find((student) => {
        const studentName = student.Name || student.studentName || "";
        return studentName.toLowerCase().includes(config.name.toLowerCase());
      });

      return {
        id: matchedStudent?.id || config.id,
        studentName: config.name,
        shortName: config.shortName,
        initials: config.initials,
        isCommonStudent: config.isCommon,
        originalName:
          matchedStudent?.Name || matchedStudent?.studentName || config.name,
      };
    });
  }, [allStudents, studentConfig]);

  const { weekendExams, cumulativeExams, grandTestExams, allExams } =
    useMemo(() => {
      const weekend = exams.filter((exam) => exam.exam?.includes("Weekend"));
      const cumulative = exams.filter((exam) =>
        exam.exam?.includes("Cumulative")
      );
      const grand = exams.filter((exam) => exam.exam?.includes("Grand"));
      const all = [...exams]; // All exams combined

      return {
        weekendExams: weekend,
        cumulativeExams: cumulative,
        grandTestExams: grand,
        allExams: all,
      };
    }, [exams]);

  // Helper function to determine exam type
  const getExamType = (examName) => {
    if (!examName) return "other";
    if (examName.includes("Weekend")) return "weekend";
    if (examName.includes("Cumulative")) return "cumulative";
    if (examName.includes("Grand")) return "grand";
    return "other";
  };

  const handleEditExam = (examId, studentId, subject, existingData = null) => {
    if (!globalEditMode) return; // Only allow editing if global edit mode is enabled

    const examKey = `${examId}_${studentId}_${subject}`;
    setEditingExam((prev) => ({ ...prev, [examKey]: true }));

    if (existingData) {
      setExamMarks((prev) => ({
        ...prev,
        [examKey]: {
          [subject]: existingData[subject] || "",
        },
      }));
    } else {
      setExamMarks((prev) => ({
        ...prev,
        [examKey]: {
          [subject]: "",
        },
      }));
    }
  };

  const handleExamMarkChange = (examId, studentId, subject, value) => {
    const examKey = `${examId}_${studentId}_${subject}`;
    // Ensure value is between 0 and 100
    const validatedValue = Math.min(100, Math.max(0, Number(value) || 0));
    setExamMarks((prev) => ({
      ...prev,
      [examKey]: {
        [subject]: validatedValue,
      },
    }));
  };

  const handleSaveExam = async (examItem, student, subject) => {
    const examKey = `${examItem.id}_${student.id}`;
    const subjectKey = `${examItem.id}_${student.id}_${subject}`;
    const marks = examMarks[subjectKey] || {};
    const cellKey = `${examItem.id}_${student.id}_${subject}`;

    const subjectMark = Number(marks[subject]) || 0;

    // Get existing exam data to preserve other subject marks
    const existingExam = examData[examKey];
    const currentPhysics = existingExam?.physics || 0;
    const currentChemistry = existingExam?.chemistry || 0;
    const currentMaths = existingExam?.maths || 0;

    let physicsMarks = currentPhysics;
    let chemistryMarks = currentChemistry;
    let mathsMarks = currentMaths;

    // Update the specific subject mark
    if (subject === "physics") physicsMarks = subjectMark;
    if (subject === "chemistry") chemistryMarks = subjectMark;
    if (subject === "maths") mathsMarks = subjectMark;

    const total = physicsMarks + chemistryMarks + mathsMarks;

    const examDataToSave = {
      classId: examItem.id,
      studentId: student.id,
      studentName: student.studentName,
      originalStudentName: student.originalName,
      examDate: new Date(
        examItem.date.split(".").reverse().join("-")
      ).toISOString(),
      examName: examItem.exam || "Revision Exam",
      status: "Present",
      topic: [examItem.exam || "General"],
      testType: getTestTypeFromExam(examItem.exam),
      isRevisionProgramJEEMains2026Student: true,
      Subject: user?.isPhysics
        ? "Physics"
        : user?.isChemistry
        ? "Chemistry"
        : user?.isMaths
        ? "Maths"
        : "General",
      total: total,
      physics: physicsMarks,
      chemistry: chemistryMarks,
      maths: mathsMarks,
      isCommonStudent: student.isCommonStudent,
    };

    try {
      setSavingState((prev) => ({ ...prev, [cellKey]: true }));

      let result;

      // Check if we have an existing exam record ID
      const hasExistingRecord = existingExam && existingExam.examRecordId;

      if (hasExistingRecord) {
        // Update existing exam
        examDataToSave.id = existingExam.examRecordId;
        result = await dispatch(updateStudentExam(examDataToSave));
      } else {
        // Add new exam
        result = await dispatch(addStudentExam(examDataToSave));
      }

      // CRITICAL FIX: Immediately exit editing mode and show marks + edit icon
      if (result) {
        const updatedExamData = {
          examRecordId:
            result.exam?.id ||
            result.exam?.examRecordId ||
            existingExam?.examRecordId,
          physics: physicsMarks,
          chemistry: chemistryMarks,
          maths: mathsMarks,
          total: total,
          subject: examDataToSave.Subject,
          studentName: student.studentName,
          studentId: student.id,
        };

        // Update local state immediately
        setExamData((prev) => ({
          ...prev,
          [examKey]: updatedExamData,
        }));

        // Show success message
        setSaveMessage({
          text: `${subject.charAt(0).toUpperCase() + subject.slice(1)} marks ${
            hasExistingRecord ? "updated" : "saved"
          } successfully!`,
          severity: "success",
        });
      }

      // FIXED: Immediately exit editing mode regardless of result
      setEditingExam((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      // Clear the marks input
      setExamMarks((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
    } catch (error) {
      console.error("Error saving exam:", error);
      setSaveMessage({ text: "Failed to save exam marks", severity: "error" });

      // FIXED: Also exit editing mode on error
      setEditingExam((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 4000);
    } finally {
      // FIXED: Clear saving state
      setSavingState((prev) => {
        const newState = { ...prev };
        delete newState[cellKey];
        return newState;
      });
    }
  };

  const handleCancelExam = (examId, studentId, subject) => {
    const examKey = `${examId}_${studentId}_${subject}`;

    // FIXED: Immediately exit editing mode and show marks + edit icon
    setEditingExam((prev) => {
      const newState = { ...prev };
      delete newState[examKey];
      return newState;
    });

    setExamMarks((prev) => {
      const newState = { ...prev };
      delete newState[examKey];
      return newState;
    });
  };

  const getTestTypeFromExam = (examName) => {
    if (!examName) return [];
    if (examName.includes("Weekend")) return ["weekendTest"];
    if (examName.includes("Cumulative")) return ["cumulativeTest"];
    if (examName.includes("Grand")) return ["grandTest"];
    return [];
  };

  const handleRefresh = async () => {
    await dispatch(fetchRevisionExams());
  };

  // Toggle global edit mode
  const handleGlobalEditToggle = () => {
    setGlobalEditMode(!globalEditMode);
    // Clear all editing states when turning off edit mode
    if (globalEditMode) {
      setEditingExam({});
      setExamMarks({});
    }
  };

  useEffect(() => {
    const loadExamData = () => {
      if (!exams || exams.length === 0) return;

      const examDataMap = {};
      console.log("Loading exam data from exams:", exams);

      exams.forEach((examItem) => {
        if (examItem.examData && Array.isArray(examItem.examData)) {
          examItem.examData.forEach((examRecord) => {
            const examKey = `${examItem.id}_${examRecord.studentId}`;

            // Use the exam record's 'id' field as examRecordId
            examDataMap[examKey] = {
              examRecordId: examRecord.id, // This is the key field
              physics: examRecord.physics || 0,
              chemistry: examRecord.chemistry || 0,
              maths: examRecord.maths || 0,
              total: examRecord.total || 0,
              subject: examRecord.subject,
              studentName: examRecord.studentName,
              studentId: examRecord.studentId,
            };
          });
        }
      });

      console.log("Final loaded exam data map:", examDataMap);
      setExamData(examDataMap);
    };

    loadExamData();
  }, [exams]);

  useEffect(() => {
    if (exams.length === 0 && !loading) {
      handleRefresh();
    }
  }, [dispatch, exams.length, loading]);

  const renderSubjectMarks = (examItem, student, subject) => {
    const examKey = `${examItem.id}_${student.id}`;
    const subjectKey = `${examItem.id}_${student.id}_${subject}`;
    const isEditing = editingExam[subjectKey];
    const marks = examMarks[subjectKey] || {};
    const savedExam = examData[examKey];
    const cellKey = `${examItem.id}_${student.id}_${subject}`;
    const isSaving = savingState[cellKey];
    const examType = getExamType(examItem.exam);

    // Get the saved mark for this subject
    const subjectMark = savedExam ? savedExam[subject] || 0 : 0;

    if (isEditing) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
          <TextField
            size="small"
            type="number"
            value={marks[subject] || ""}
            onChange={(e) =>
              handleExamMarkChange(
                examItem.id,
                student.id,
                subject,
                e.target.value
              )
            }
            inputProps={{
              min: 0,
              max: 100,
              style: {
                fontSize: "0.9rem", // Slightly reduced
                padding: "6px", // Slightly reduced
                width: "50px", // Slightly reduced
                textAlign: "center",
              },
            }}
            sx={{
              width: "70px", // Slightly reduced
              "& .MuiInputBase-root": { height: "36px" }, // Slightly reduced
            }}
            autoFocus
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={() => handleSaveExam(examItem, student, subject)}
                disabled={isSaving}
                sx={{ color: "#10b981", padding: "3px" }} // Slightly reduced
              >
                {isSaving ? (
                  <CircularProgress size={18} /> // Slightly reduced
                ) : (
                  <Check fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={() =>
                  handleCancelExam(examItem.id, student.id, subject)
                }
                disabled={isSaving}
                sx={{ color: "#ef4444", padding: "3px" }} // Slightly reduced
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      );
    }

    // Show marks and edit icon when NOT in editing mode (only if global edit mode is enabled)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          p: 0.5,
          minHeight: "45px", // Slightly reduced
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: "1rem", // Slightly reduced
            minWidth: "25px", // Slightly reduced
            textAlign: "center",
            color: subjectMark > 0 ? "#1e293b" : "#64748b",
          }}
        >
          {subjectMark > 0 ? subjectMark : "-"}
        </Typography>
        {globalEditMode && (
          <Tooltip title={`Edit ${subject} marks`}>
            <IconButton
              size="small"
              onClick={() =>
                handleEditExam(examItem.id, student.id, subject, savedExam)
              }
              sx={{ color: "#3b82f6", padding: "3px" }} // Slightly reduced
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  const renderExamTable = (examsList, title) => {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: "#1e293b" }}
        >
          {title} ({examsList.length})
        </Typography>
        <TableContainer
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "white",
            overflow: "auto",
          }}
        >
          <Table size="small">
            <TableHead>
              {/* First header row - Student names spanning both P and C columns */}
              <StudentHeaderGroup>
                <HeaderCell sx={{ width: "70px", textAlign: "center" }}>
                  S.No.
                </HeaderCell>
                <HeaderCell sx={{ width: "180px", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 16 }} />{" "}
                    {/* Slightly reduced */}
                    <span>Date & Day</span>
                  </Box>
                </HeaderCell>
                <HeaderCell sx={{ width: "220px", textAlign: "center" }}>
                  Type of Exam
                </HeaderCell>
                {revisionStudents.map((student) => (
                  <HeaderCell
                    key={student.id}
                    colSpan={student.isCommonStudent ? 2 : 1}
                    sx={{
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    }}
                  >
                    <StudentBadge>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 900,
                          color: "#78350f",
                          fontSize: "0.95rem", // Slightly reduced
                        }}
                      >
                        {student.shortName}
                      </Typography>
                    </StudentBadge>
                  </HeaderCell>
                ))}
              </StudentHeaderGroup>

              {/* Second header row - Subject columns (P and C) for each student */}
              <TableRow>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                <HeaderCell
                  sx={{
                    background:
                      "linear-gradient(135deg, #334155 0%, #475569 100%)",
                  }}
                ></HeaderCell>
                {revisionStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    {student.isCommonStudent ? (
                      <>
                        <SubjectHeaderCell>P</SubjectHeaderCell>
                        <SubjectHeaderCell>C</SubjectHeaderCell>
                      </>
                    ) : (
                      <SubjectHeaderCell>P</SubjectHeaderCell>
                    )}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {examsList.length > 0 ? (
                examsList.map((examItem, index) => {
                  const isToday = examItem.date === todayDate;
                  const examType = getExamType(examItem.exam);

                  return (
                    <ExamRow
                      key={examItem.id}
                      istoday={isToday}
                      examtype={examType}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px 6px", // Slightly reduced
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#475569",
                            fontSize: "0.9rem", // Slightly reduced
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px 6px", // Slightly reduced
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: isToday ? "#1e40af" : "#1e293b",
                              fontSize: "0.9rem", // Slightly reduced
                              display: "block",
                            }}
                          >
                            {examItem.date}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isToday ? "#1e40af" : "#64748b",
                              fontWeight: isToday ? 600 : 400,
                              fontSize: "0.8rem", // Slightly reduced
                              display: "block",
                            }}
                          >
                            {examItem.dayOfWeek}
                            {isToday && " • Today"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 6px", // Slightly reduced
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "0.9rem", // Slightly reduced
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            {examItem.exam}
                          </Typography>
                          <ExamTypeBadge examtype={examType}>
                            {examType.charAt(0).toUpperCase() +
                              examType.slice(1)}
                          </ExamTypeBadge>
                        </Box>
                      </TableCell>
                      {revisionStudents.map((student) => (
                        <React.Fragment key={student.id}>
                          {student.isCommonStudent ? (
                            <>
                              <SubjectCell
                                examtype={examType}
                                isediting={
                                  editingExam[
                                    `${examItem.id}_${student.id}_physics`
                                  ]
                                }
                              >
                                {renderSubjectMarks(
                                  examItem,
                                  student,
                                  "physics"
                                )}
                              </SubjectCell>
                              <SubjectCell
                                examtype={examType}
                                isediting={
                                  editingExam[
                                    `${examItem.id}_${student.id}_chemistry`
                                  ]
                                }
                              >
                                {renderSubjectMarks(
                                  examItem,
                                  student,
                                  "chemistry"
                                )}
                              </SubjectCell>
                            </>
                          ) : (
                            <SubjectCell
                              examtype={examType}
                              isediting={
                                editingExam[
                                  `${examItem.id}_${student.id}_physics`
                                ]
                              }
                            >
                              {renderSubjectMarks(examItem, student, "physics")}
                            </SubjectCell>
                          )}
                        </React.Fragment>
                      ))}
                    </ExamRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      3 +
                      revisionStudents.reduce(
                        (total, student) =>
                          total + (student.isCommonStudent ? 2 : 1),
                        0
                      )
                    }
                    sx={{ py: 4, textAlign: "center" }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: "#64748b", fontSize: "0.9rem" }} // Slightly reduced
                    >
                      No {title.toLowerCase()} found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Fade in timeout={800}>
      <StyledPaper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
            >
              Revision Program Exams
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "0.9rem" }} // Slightly reduced
            >
              Today: {todayDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Global Edit Mode Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={globalEditMode}
                  onChange={handleGlobalEditToggle}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography
                  variant="body1"
                  sx={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  {globalEditMode ? "Edit Mode ON" : "Edit Mode OFF"}
                </Typography>
              }
              sx={{ mr: 2 }}
            />
            <Tooltip title="Refresh Exams" arrow>
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                size="medium"
                sx={{
                  background: "#f1f5f9",
                  "&:hover": { background: "#e2e8f0" },
                  padding: "8px",
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {saveMessage.text && (
          <Alert
            severity={saveMessage.severity}
            sx={{ mb: 2, borderRadius: "8px", fontSize: "0.9rem" }} // Slightly reduced
          >
            {saveMessage.text}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={50} sx={{ color: "#3b82f6" }} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ borderRadius: "8px", fontSize: "0.9rem" }}
          >
            {" "}
            // Slightly reduced Error loading exams: {error}
          </Alert>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "0.9rem", // Slightly reduced
                  textTransform: "none",
                  minWidth: "auto",
                  px: 3,
                  py: 1,
                },
              }}
            >
              <Tab label={`All Exams (${allExams.length})`} />
              <Tab label={`Weekend Exams (${weekendExams.length})`} />
              <Tab label={`Cumulative Exams (${cumulativeExams.length})`} />
              <Tab label={`Grand Tests (${grandTestExams.length})`} />
            </Tabs>

            {activeTab === 0 && renderExamTable(allExams, "All Exams")}
            {activeTab === 1 && renderExamTable(weekendExams, "Weekend Exams")}
            {activeTab === 2 &&
              renderExamTable(cumulativeExams, "Cumulative Exams")}
            {activeTab === 3 && renderExamTable(grandTestExams, "Grand Tests")}
          </>
        )}
      </StyledPaper>
    </Fade>
  );
};

export default RevisionExamsPage;
