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
  TableFooter,
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
  Card,
  CardContent,
  Grid,
  LinearProgress,
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
  TrendingUp,
  School,
  EmojiEvents,
} from "@mui/icons-material";
import {
  fetchRevisionExams,
  addStudentExam,
  updateStudentExam,
} from "../../redux/actions";

const getExamType = (examName) => {
  if (!examName) return "other";
  if (examName.includes("Weekend")) return "weekend";
  if (examName.includes("Cumulative")) return "cumulative";
  if (examName.includes("Grand")) return "grand";
  return "other";
};

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
  fontSize: "0.9rem",
  borderRight: "1px solid #475569",
  padding: "10px 8px",
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
  minWidth: "70px",
  fontSize: "1.2rem",
}));

const FooterCell = styled(TableCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  fontWeight: 700,
  fontSize: "0.9rem",
  borderTop: "2px solid #e2e8f0",
  borderRight: "1px solid #e2e8f0",
  padding: "12px 8px",
  textAlign: "center",
  color: "#1e293b",
}));

const StudentHeaderGroup = styled(TableRow)(({ theme }) => ({
  "& > th": {
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    borderRight: "1px solid #475569",
    padding: "6px",
  },
}));

// Updated ExamRow with different colors based on exam type
const ExamRow = styled(TableRow)(({ istoday, examtype }) => {
  const getBackgroundColor = () => {
    if (istoday) return "#fff3cd";

    switch (examtype) {
      case "weekend":
        return "#f0f9ff";
      case "cumulative":
        return "#f0fdf4";
      case "grand":
        return "#fef7ff";
      default:
        return "#fff";
    }
  };

  const getBorderColor = () => {
    if (istoday) return "#3b82f6";

    switch (examtype) {
      case "weekend":
        return "#0ea5e9";
      case "cumulative":
        return "#10b981";
      case "grand":
        return "#8b5cf6";
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
        return isediting ? "#e0f2fe" : "#f0f9ff";
      case "cumulative":
        return isediting ? "#dcfce7" : "#f0fdf4";
      case "grand":
        return isediting ? "#f3e8ff" : "#fef7ff";
      default:
        return isediting ? "#f1f5f9" : "#fff";
    }
  };

  const getBorderColor = () => {
    switch (examtype) {
      case "weekend":
        return "#bae6fd";
      case "cumulative":
        return "#bbf7d0";
      case "grand":
        return "#e9d5ff";
      default:
        return "#f1f5f9";
    }
  };

  return {
    textAlign: "center",
    padding: "6px",
    borderRight: `1px solid ${getBorderColor()}`,
    backgroundColor: getCellBackgroundColor(),
    transition: "all 0.2s ease-in-out",
    minHeight: "50px",
  };
});

const StudentBadge = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
  border: "1px solid #f59e0b",
  borderRadius: "6px",
  padding: "6px 4px",
  textAlign: "center",
}));

// Prediction Row Component
const PredictionRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fff7ed",
  borderTop: "3px solid #fdba74",
  "&:hover": {
    backgroundColor: "#ffedd5",
  },
}));

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
  const [globalEditMode, setGlobalEditMode] = useState(false);

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

  // Student configuration
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
        Stream:matchedStudent?.Stream
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
      const all = [...exams];

      return {
        weekendExams: weekend,
        cumulativeExams: cumulative,
        grandTestExams: grand,
        allExams: all,
      };
    }, [exams]);

  // Calculate average marks for each student and exam type
  const calculateAverages = useMemo(() => {
    const averages = {
      weekend: {},
      cumulative: {},
      grand: {},
      overall: {},
    };

    // Initialize student averages
    revisionStudents.forEach((student) => {
      averages.weekend[student.id] = {
        physics: 0,
        chemistry: 0,
        total: 0,
        count: 0,
      };
      averages.cumulative[student.id] = {
        physics: 0,
        chemistry: 0,
        total: 0,
        count: 0,
      };
      averages.grand[student.id] = {
        physics: 0,
        chemistry: 0,
        total: 0,
        count: 0,
      };
      averages.overall[student.id] = {
        physics: 0,
        chemistry: 0,
        total: 0,
        count: 0,
      };
    });

    // Calculate averages from exam data
    Object.keys(examData).forEach((examKey) => {
      const [examId, studentId] = examKey.split("_");
      const examRecord = examData[examKey];
      const examItem = exams.find((e) => e.id === examId);

      if (!examItem || !examRecord) return;

      const examType = getExamType(examItem.exam);
      const student = revisionStudents.find((s) => s.id === studentId);

      if (!student) return;

      // Add to specific exam type average
      if (examType === "weekend" && averages.weekend[studentId]) {
        averages.weekend[studentId].physics += examRecord.physics || 0;
        averages.weekend[studentId].chemistry += examRecord.chemistry || 0;
        averages.weekend[studentId].total += examRecord.total || 0;
        averages.weekend[studentId].count += 1;
      } else if (examType === "cumulative" && averages.cumulative[studentId]) {
        averages.cumulative[studentId].physics += examRecord.physics || 0;
        averages.cumulative[studentId].chemistry += examRecord.chemistry || 0;
        averages.cumulative[studentId].total += examRecord.total || 0;
        averages.cumulative[studentId].count += 1;
      } else if (examType === "grand" && averages.grand[studentId]) {
        averages.grand[studentId].physics += examRecord.physics || 0;
        averages.grand[studentId].chemistry += examRecord.chemistry || 0;
        averages.grand[studentId].total += examRecord.total || 0;
        averages.grand[studentId].count += 1;
      }

      // Add to overall average
      if (averages.overall[studentId]) {
        averages.overall[studentId].physics += examRecord.physics || 0;
        averages.overall[studentId].chemistry += examRecord.chemistry || 0;
        averages.overall[studentId].total += examRecord.total || 0;
        averages.overall[studentId].count += 1;
      }
    });

    // Calculate final averages
    Object.keys(averages).forEach((examType) => {
      Object.keys(averages[examType]).forEach((studentId) => {
        const studentAvg = averages[examType][studentId];
        if (studentAvg.count > 0) {
          studentAvg.physics = Math.round(
            studentAvg.physics / studentAvg.count
          );
          studentAvg.chemistry = Math.round(
            studentAvg.chemistry / studentAvg.count
          );
          studentAvg.total = Math.round(studentAvg.total / studentAvg.count);
        }
      });
    });

    return averages;
  }, [examData, exams, revisionStudents]);
// Calculate expected marks for finals (240 target) - FIXED FOR JEE
const calculateExpectedMarks = useMemo(() => {
  const expected = {};
  
  revisionStudents.forEach((student) => {
    const weekendAvg = calculateAverages.weekend[student.id];
    const cumulativeAvg = calculateAverages.cumulative[student.id];
    const grandAvg = calculateAverages.grand[student.id];
    const overallAvg = calculateAverages.overall[student.id];

    // Get the most relevant average
    const currentAvg = grandAvg.count > 0 ? grandAvg : 
                      cumulativeAvg.count > 0 ? cumulativeAvg : 
                      weekendAvg.count > 0 ? weekendAvg : 
                      overallAvg;

    if (currentAvg.count > 0) {
      if (student.isCommonStudent) {
        // For common students: Physics (120) + Chemistry (120) = Total 240
        const predictedPhysics = Math.round((currentAvg.physics / 100) * 120);
        const predictedChemistry = Math.round((currentAvg.chemistry / 100) * 120);
        const predictedTotal = predictedPhysics + predictedChemistry;

        expected[student.id] = {
          predictedTotal,
          predictedPhysics,
          predictedChemistry,
          currentAverage: currentAvg.total,
          currentPercentage: Math.round((currentAvg.total / 200) * 100),
          improvementNeeded: 240 - predictedTotal,
          progressPercentage: Math.round((predictedTotal / 240) * 100),
        };
      } else {
        // For single subject students: Total 120 only
        const predictedTotal = Math.round((currentAvg.physics / 100) * 120);
        
        expected[student.id] = {
          predictedTotal,
          predictedPhysics: predictedTotal,
          predictedChemistry: 0,
          currentAverage: currentAvg.physics,
          currentPercentage: Math.round(currentAvg.physics),
          improvementNeeded: 120 - predictedTotal,
          progressPercentage: Math.round((predictedTotal / 120) * 100),
        };
      }
    } else {
      // No data available
      expected[student.id] = {
        predictedTotal: 0,
        predictedPhysics: 0,
        predictedChemistry: 0,
        currentAverage: 0,
        currentPercentage: 0,
        improvementNeeded: student.isCommonStudent ? 240 : 120,
        progressPercentage: 0,
      };
    }
  });

  return expected;
}, [calculateAverages, revisionStudents]);

  const handleEditExam = (examId, studentId, subject, existingData = null) => {
    if (!globalEditMode) return;

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
    const validatedValue = Math.min(100, Math.max(0, Number(value) || 0));
    setExamMarks((prev) => ({
      ...prev,
      [examKey]: {
        [subject]: validatedValue,
      },
    }));
  };

  const handleSaveExam = async (examItem, student, subject) => {
    console.log("student",student)
    const examKey = `${examItem.id}_${student.id}`;
    const subjectKey = `${examItem.id}_${student.id}_${subject}`;
    const marks = examMarks[subjectKey] || {};
    const cellKey = `${examItem.id}_${student.id}_${subject}`;

    const subjectMark = Number(marks[subject]) || 0;

    const existingExam = examData[examKey];
    const currentPhysics = existingExam?.physics || 0;
    const currentChemistry = existingExam?.chemistry || 0;
    const currentMaths = existingExam?.maths || 0;

    let physicsMarks = currentPhysics;
    let chemistryMarks = currentChemistry;
    let mathsMarks = currentMaths;

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
      stream:student.Stream
    };
    console.log("examDataToSave",examDataToSave)

    try {
      setSavingState((prev) => ({ ...prev, [cellKey]: true }));

      let result;

      const hasExistingRecord = existingExam && existingExam.examRecordId;

      if (hasExistingRecord) {
        examDataToSave.id = existingExam.examRecordId;
        result = await dispatch(updateStudentExam(examDataToSave));
      } else {
        result = await dispatch(addStudentExam(examDataToSave));
      }

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

        setExamData((prev) => ({
          ...prev,
          [examKey]: updatedExamData,
        }));

        setSaveMessage({
          text: `${subject.charAt(0).toUpperCase() + subject.slice(1)} marks ${
            hasExistingRecord ? "updated" : "saved"
          } successfully!`,
          severity: "success",
        });
      }

      setEditingExam((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      setExamMarks((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
    } catch (error) {
      console.error("Error saving exam:", error);
      setSaveMessage({ text: "Failed to save exam marks", severity: "error" });

      setEditingExam((prev) => {
        const newState = { ...prev };
        delete newState[subjectKey];
        return newState;
      });

      setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 4000);
    } finally {
      setSavingState((prev) => {
        const newState = { ...prev };
        delete newState[cellKey];
        return newState;
      });
    }
  };

  const handleCancelExam = (examId, studentId, subject) => {
    const examKey = `${examId}_${studentId}_${subject}`;

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

  const handleGlobalEditToggle = () => {
    setGlobalEditMode(!globalEditMode);
    if (globalEditMode) {
      setEditingExam({});
      setExamMarks({});
    }
  };

  const renderSubjectMarks = (examItem, student, subject) => {
    const examKey = `${examItem.id}_${student.id}`;
    const subjectKey = `${examItem.id}_${student.id}_${subject}`;
    const isEditing = editingExam[subjectKey];
    const marks = examMarks[subjectKey] || {};
    const savedExam = examData[examKey];
    const cellKey = `${examItem.id}_${student.id}_${subject}`;
    const isSaving = savingState[cellKey];
    const examType = getExamType(examItem.exam);

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
                fontSize: "0.9rem",
                padding: "6px",
                width: "50px",
                textAlign: "center",
              },
            }}
            sx={{
              width: "70px",
              "& .MuiInputBase-root": { height: "36px" },
            }}
            autoFocus
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={() => handleSaveExam(examItem, student, subject)}
                disabled={isSaving}
                sx={{ color: "#10b981", padding: "3px" }}
              >
                {isSaving ? (
                  <CircularProgress size={18} />
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
                sx={{ color: "#ef4444", padding: "3px" }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          p: 0.5,
          minHeight: "45px",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            minWidth: "25px",
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
              sx={{ color: "#3b82f6", padding: "3px" }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  // Render table footer with averages
  const renderTableFooter = (examsList, examType) => {
    const averages = calculateAverages[examType] || calculateAverages.overall;

    return (
      <TableFooter>
        <TableRow>
          <FooterCell colSpan={3} sx={{ textAlign: "left", fontWeight: 700 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp sx={{ fontSize: 18, color: "#3b82f6" }} />
              Average Marks (
              {examType.charAt(0).toUpperCase() + examType.slice(1)})
            </Box>
          </FooterCell>
          {revisionStudents.map((student) => {
            const studentAvg = averages[student.id];
            return student.isCommonStudent ? (
              <React.Fragment key={student.id}>
                <FooterCell>
                  {studentAvg?.count > 0 ? `${studentAvg.physics}P` : "-"}
                </FooterCell>
                <FooterCell>
                  {studentAvg?.count > 0 ? `${studentAvg.chemistry}C` : "-"}
                </FooterCell>
              </React.Fragment>
            ) : (
              <FooterCell key={student.id}>
                {studentAvg?.count > 0 ? `${studentAvg.physics}P` : "-"}
              </FooterCell>
            );
          })}
        </TableRow>
      </TableFooter>
    );
  };

const renderPredictionsRow = () => {
  return (
    <PredictionRow>
      <TableCell colSpan={3} sx={{ textAlign: 'left', fontWeight: 700, padding: '16px 8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEvents sx={{ fontSize: 20, color: '#f59e0b' }} />
          Final JEE Predictions (Target: {revisionStudents.some(s => !s.isCommonStudent) ? '120 (Single) / 240 (Common)' : '240'})
          <Typography variant="caption" sx={{ color: '#64748b', ml: 1 }}>
            Based on current performance
          </Typography>
        </Box>
      </TableCell>
      {revisionStudents.map((student) => {
        const prediction = calculateExpectedMarks[student.id];
        return student.isCommonStudent ? (
          <React.Fragment key={student.id}>
            <TableCell sx={{ textAlign: 'center', padding: '16px 8px', fontWeight: 600 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {prediction?.predictedPhysics || 0}/120
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {Math.round((prediction?.predictedPhysics / 120) * 100)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={prediction ? Math.min(100, (prediction.predictedPhysics / 120) * 100) : 0}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    mt: 0.5,
                    backgroundColor: '#fecaca',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: prediction?.predictedPhysics >= 90 ? '#10b981' : 
                                      prediction?.predictedPhysics >= 70 ? '#3b82f6' : '#dc2626'
                    }
                  }} 
                />
              </Box>
            </TableCell>
            <TableCell sx={{ textAlign: 'center', padding: '16px 8px', fontWeight: 600 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {prediction?.predictedChemistry || 0}/120
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {Math.round((prediction?.predictedChemistry / 120) * 100)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={prediction ? Math.min(100, (prediction.predictedChemistry / 120) * 100) : 0}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    mt: 0.5,
                    backgroundColor: '#fecaca',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: prediction?.predictedChemistry >= 90 ? '#10b981' : 
                                      prediction?.predictedChemistry >= 70 ? '#3b82f6' : '#dc2626'
                    }
                  }} 
                />
              </Box>
            </TableCell>
          </React.Fragment>
        ) : (
          <TableCell key={student.id} sx={{ textAlign: 'center', padding: '16px 8px', fontWeight: 600 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                {prediction?.predictedTotal || 0}/120
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {prediction?.currentPercentage || 0}% current
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={prediction?.progressPercentage || 0}
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  mt: 0.5,
                  backgroundColor: '#fecaca',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: prediction?.progressPercentage >= 85 ? '#10b981' : 
                                    prediction?.progressPercentage >= 70 ? '#3b82f6' : '#dc2626'
                  }
                }} 
              />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                Need: +{prediction?.improvementNeeded || 120}
              </Typography>
            </Box>
          </TableCell>
        );
      })}
    </PredictionRow>
  );
};
  const renderExamTable = (examsList, title, examType = "overall") => {
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
              <StudentHeaderGroup>
                <HeaderCell
                  rowSpan={2}
                  sx={{
                    width: "70px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  S.No.
                </HeaderCell>
                <HeaderCell
                  rowSpan={2}
                  sx={{
                    width: "180px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 16 }} />
                    <span>Date & Day</span>
                  </Box>
                </HeaderCell>
                <HeaderCell
                  rowSpan={2}
                  sx={{
                    width: "220px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
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
                          fontSize: "0.95rem",
                        }}
                      >
                        {student.shortName}
                      </Typography>
                    </StudentBadge>
                  </HeaderCell>
                ))}
              </StudentHeaderGroup>

              <TableRow>
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
                          padding: "8px 6px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#475569",
                            fontSize: "0.9rem",
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px 6px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: isToday ? "#1e40af" : "#1e293b",
                              fontSize: "0.9rem",
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
                              fontSize: "0.8rem",
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
                          padding: "8px 6px",
                          borderRight: "1px solid #f1f5f9",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            {examItem.exam}
                          </Typography>
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
                      sx={{ color: "#64748b", fontSize: "0.9rem" }}
                    >
                      No {title.toLowerCase()} found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {/* Averages Footer */}
            {renderTableFooter(examsList, examType)}
            {renderPredictionsRow()}

            {/* Final Predictions Row */}
          </Table>
        </TableContainer>
      </Box>
    );
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

            examDataMap[examKey] = {
              examRecordId: examRecord.id,
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
              sx={{ color: "#64748b", fontSize: "0.9rem" }}
            >
              Today: {todayDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
            sx={{ mb: 2, borderRadius: "8px", fontSize: "0.9rem" }}
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
            Error loading exams: {error}
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
                  fontSize: "0.9rem",
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

            {activeTab === 0 &&
              renderExamTable(allExams, "All Exams", "overall")}
            {activeTab === 1 &&
              renderExamTable(weekendExams, "Weekend Exams", "weekend")}
            {activeTab === 2 &&
              renderExamTable(
                cumulativeExams,
                "Cumulative Exams",
                "cumulative"
              )}
            {activeTab === 3 &&
              renderExamTable(grandTestExams, "Grand Tests", "grand")}
          </>
        )}
      </StyledPaper>
    </Fade>
  );
};

export default RevisionExamsPage;
