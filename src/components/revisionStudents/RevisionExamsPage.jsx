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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button as MuiButton,
} from "@mui/material";
import { absentReasons } from "../../mockdata/mockdata";
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

// New styled components for fixed header and scrollable body
const ScrollableTableContainer = styled(TableContainer)(({ theme }) => ({
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  background: "white",
  overflow: "auto",
  height: "calc(100vh - 300px)", // Adjust height as needed
  position: "relative",
}));

const StickyTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 10,
  "& th": {
    position: "sticky",
    top: 0,
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
  const [markAbsentDialog, setMarkAbsentDialog] = useState({
    open: false,
    examItem: null,
    student: null,
    subject: null,
  });
  const [absentReason, setAbsentReason] = useState("");
  const getTodayDate = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  const todayDate = getTodayDate();
  const handleMarkAbsentClick = (examItem, student, subject) => {
    setMarkAbsentDialog({
      open: true,
      examItem,
      student,
      subject,
    });
    setAbsentReason("");
  };
const handleMarkAbsent = async () => {
  const { examItem, student, subject } = markAbsentDialog;

  if (!absentReason) {
    setSaveMessage({
      text: "Please select an absent reason",
      severity: "error",
    });
    return;
  }

  const examDataToSave = {
    classId: examItem.id,
    studentId: student.id,
    studentName: student.studentName,
    originalStudentName: student.originalName,
    examDate: new Date(
      examItem.date.split(".").reverse().join("-")
    ).toISOString(),
    examName: examItem.exam || "Revision Exam",
    status: "Absent",
    absentReason: `${subject.toUpperCase()}: ${absentReason}`,
    topic: [examItem.exam || "General"],
    testType: getTestTypeFromExam(examItem.exam),
    isRevisionProgramJEEMains2026Student: true,
    Subject: "General", // Always set to General
    isCommonStudent: student.isCommonStudent,
    stream: student.Stream,
  };

  try {
    const absentKey = getSubjectKey(examItem.id, student, `${subject}_absent`);
    setSavingState((prev) => ({
      ...prev,
      [absentKey]: true,
    }));

    const result = await dispatch(addStudentExam(examDataToSave));

    if (result) {
      // Update the local examData state with absent information
      const examKey = getExamKey(examItem.id, student);
      const existingExam = examData[examKey] || {};

      setExamData((prev) => ({
        ...prev,
        [examKey]: {
          ...existingExam, // Keep existing data
          examRecordId:
            result.exam?.id ||
            result.exam?.examRecordId ||
            existingExam.examRecordId,
          status: "Absent",
          absentReason: `${subject.toUpperCase()}: ${absentReason}`,
          isAbsent: true,
          studentName: student.studentName,
          studentId: student.id,
          // Only clear the specific subject that was marked absent
          [subject]: 0,
          // Update total by subtracting the specific subject's marks
          total: (existingExam.total || 0) - (existingExam[subject] || 0),
        },
      }));

      setSaveMessage({
        text: `Student marked absent for ${subject} successfully!`,
        severity: "success",
      });
    }

    // Close dialog and reset state
    setMarkAbsentDialog({
      open: false,
      examItem: null,
      student: null,
      subject: null,
    });
    setAbsentReason("");

    // Then refresh the data to ensure consistency
    setTimeout(() => {
      handleRefresh();
    }, 500);

    setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 2000);
  } catch (error) {
    console.error("Error marking student absent:", error);
    setSaveMessage({
      text: "Failed to mark student absent",
      severity: "error",
    });

    // Close dialog even on error
    setMarkAbsentDialog({
      open: false,
      examItem: null,
      student: null,
      subject: null,
    });
    setAbsentReason("");

    setTimeout(() => setSaveMessage({ text: "", severity: "info" }), 4000);
  } finally {
    setSavingState((prev) => {
      const newState = { ...prev };
      delete newState[`${examItem.id}_${student.id}_absent`];
      return newState;
    });
  }
};
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
        Stream: matchedStudent?.Stream,
      };
    });
  }, [allStudents, studentConfig]);

  const { weekendExams, cumulativeExams, grandTestExams, allExams } =
    useMemo(() => {
      const weekend = exams?.filter((exam) => exam.exam?.includes("Weekend"));
      const cumulative = exams?.filter((exam) =>
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

  // Calculate averages from exam data - ONLY COUNT VALID MARKS
  Object.keys(examData).forEach((examKey) => {
    // --- FIX START: Handle names with spaces (which become underscores) correctly ---
    const firstUnderscoreIndex = examKey.indexOf("_");
    if (firstUnderscoreIndex === -1) return;

    const examId = examKey.substring(0, firstUnderscoreIndex);
    const studentNameFromKey = examKey.substring(firstUnderscoreIndex + 1);
    // --- FIX END ---

    const examRecord = examData[examKey];
    const examItem = exams.find((e) => e.id === examId);

    if (!examItem || !examRecord) return;

    const examType = getExamType(examItem.exam);
    
    // Find student using the correctly extracted name string
    const student = revisionStudents.find(
      (s) => s.studentName.replace(/\s+/g, "_") === studentNameFromKey
    );

    if (!student) return;

    const studentId = student.id;

    // Check if student is absent for this exam
    const isAbsent = examRecord.status === "Absent" || examRecord.isAbsent;

    // Only count marks that are actually entered (greater than 0) and student is not absent
    const hasValidPhysicsMarks = (examRecord.physics || 0) > 0 && !isAbsent;
    const hasValidChemistryMarks = (examRecord.chemistry || 0) > 0 && !isAbsent;
    const hasValidTotal = (examRecord.total || 0) > 0 && !isAbsent;

    // Add to specific exam type average only if valid marks exist
    if (examType === "weekend" && averages.weekend[studentId]) {
      if (hasValidPhysicsMarks) {
        averages.weekend[studentId].physics += examRecord.physics;
      }
      if (hasValidChemistryMarks) {
        averages.weekend[studentId].chemistry += examRecord.chemistry;
      }
      if (hasValidTotal) {
        averages.weekend[studentId].total += examRecord.total;
        averages.weekend[studentId].count += 1;
      }
    } else if (examType === "cumulative" && averages.cumulative[studentId]) {
      if (hasValidPhysicsMarks) {
        averages.cumulative[studentId].physics += examRecord.physics;
      }
      if (hasValidChemistryMarks) {
        averages.cumulative[studentId].chemistry += examRecord.chemistry;
      }
      if (hasValidTotal) {
        averages.cumulative[studentId].total += examRecord.total;
        averages.cumulative[studentId].count += 1;
      }
    } else if (examType === "grand" && averages.grand[studentId]) {
      if (hasValidPhysicsMarks) {
        averages.grand[studentId].physics += examRecord.physics;
      }
      if (hasValidChemistryMarks) {
        averages.grand[studentId].chemistry += examRecord.chemistry;
      }
      if (hasValidTotal) {
        averages.grand[studentId].total += examRecord.total;
        averages.grand[studentId].count += 1;
      }
    }

    // Add to overall average only if valid marks exist
    if (averages.overall[studentId]) {
      if (hasValidPhysicsMarks) {
        averages.overall[studentId].physics += examRecord.physics;
      }
      if (hasValidChemistryMarks) {
        averages.overall[studentId].chemistry += examRecord.chemistry;
      }
      if (hasValidTotal) {
        averages.overall[studentId].total += examRecord.total;
        averages.overall[studentId].count += 1;
      }
    }
  });

  // Calculate final averages
  Object.keys(averages).forEach((examType) => {
    Object.keys(averages[examType]).forEach((studentId) => {
      const studentAvg = averages[examType][studentId];

      // Only calculate averages if we have valid data points
      if (studentAvg.count > 0) {
        const targetStudent = revisionStudents.find((s) => s.id === studentId);
        const targetNameKey = targetStudent
          ? targetStudent.studentName.replace(/\s+/g, "_")
          : "";

        // Calculate subject averages only if we have data for those subjects
        if (studentAvg.physics > 0) {
          const physicsCount = Math.max(
            studentAvg.count,
            Object.keys(examData).filter((key) => {
              // --- FIX START: Use indexOf logic here as well ---
              const idx = key.indexOf("_");
              if (idx === -1) return false;
              const eId = key.substring(0, idx);
              const sNameKey = key.substring(idx + 1);
              // --- FIX END ---

              const record = examData[key];
              const examItem = exams.find((e) => e.id === eId);
              
              return (
                sNameKey === targetNameKey && // Match parsed name against target
                (record.physics || 0) > 0 &&
                !(record.status === "Absent" || record.isAbsent) &&
                getExamType(examItem?.exam) ===
                  (examType === "overall" ? getExamType(examItem?.exam) : examType)
              );
            }).length
          );
          studentAvg.physics = Math.round(studentAvg.physics / physicsCount);
        }

        if (studentAvg.chemistry > 0) {
          const chemistryCount = Math.max(
            studentAvg.count,
            Object.keys(examData).filter((key) => {
               // --- FIX START: Use indexOf logic here as well ---
              const idx = key.indexOf("_");
              if (idx === -1) return false;
              const eId = key.substring(0, idx);
              const sNameKey = key.substring(idx + 1);
              // --- FIX END ---

              const record = examData[key];
              const examItem = exams.find((e) => e.id === eId);
              
              return (
                sNameKey === targetNameKey && // Match parsed name against target
                (record.chemistry || 0) > 0 &&
                !(record.status === "Absent" || record.isAbsent) &&
                getExamType(examItem?.exam) ===
                  (examType === "overall" ? getExamType(examItem?.exam) : examType)
              );
            }).length
          );
          studentAvg.chemistry = Math.round(
            studentAvg.chemistry / chemistryCount
          );
        }

        studentAvg.total = Math.round(studentAvg.total / studentAvg.count);
      }
    });
  });

  return averages;
}, [examData, exams, revisionStudents]);
const calculateExpectedMarks = useMemo(() => {
  const expected = {};

  revisionStudents.forEach((student) => {
    const weekendAvg = calculateAverages.weekend[student.id];
    const cumulativeAvg = calculateAverages.cumulative[student.id];
    const grandAvg = calculateAverages.grand[student.id];
    const overallAvg = calculateAverages.overall[student.id];

    // Get the most relevant average that has actual data
    const currentAvg =
      grandAvg.count > 0
        ? grandAvg
        : cumulativeAvg.count > 0
        ? cumulativeAvg
        : weekendAvg.count > 0
        ? weekendAvg
        : overallAvg.count > 0
        ? overallAvg
        : null;

    if (currentAvg && currentAvg.count > 0) {
      if (student.isCommonStudent) {
        // For common students: Physics (100) + Chemistry (100) = Total 200
        const predictedPhysics = Math.round((currentAvg.physics / 100) * 100);
        const predictedChemistry = Math.round(
          (currentAvg.chemistry / 100) * 100
        );
        const predictedTotal = predictedPhysics + predictedChemistry;

        expected[student.id] = {
          predictedTotal,
          predictedPhysics,
          predictedChemistry,
          currentAverage: currentAvg.total,
          currentPercentage: Math.round((currentAvg.total / 200) * 100),
          improvementNeeded: 200 - predictedTotal,
          progressPercentage: Math.round((predictedTotal / 200) * 100),
        };
      } else {
        // For single subject students: Total 100 only
        const predictedTotal = Math.round((currentAvg.physics / 100) * 100);

        expected[student.id] = {
          predictedTotal,
          predictedPhysics: predictedTotal,
          predictedChemistry: 0,
          currentAverage: currentAvg.physics,
          currentPercentage: Math.round(currentAvg.physics),
          improvementNeeded: 100 - predictedTotal,
          progressPercentage: Math.round((predictedTotal / 100) * 100),
        };
      }
    } else {
      // No valid data available
      expected[student.id] = {
        predictedTotal: 0,
        predictedPhysics: 0,
        predictedChemistry: 0,
        currentAverage: 0,
        currentPercentage: 0,
        improvementNeeded: student.isCommonStudent ? 200 : 100,
        progressPercentage: 0,
        noData: true, // Flag to indicate no valid data
      };
    }
  });

  return expected;
}, [calculateAverages, revisionStudents]);

 const handleEditExam = (examId, student, subject, existingData = null) => {
  if (!globalEditMode) return;

  const subjectKey = getSubjectKey(examId, student, subject);
  setEditingExam((prev) => ({ ...prev, [subjectKey]: true }));

  if (existingData) {
    setExamMarks((prev) => ({
      ...prev,
      [subjectKey]: {
        [subject]: existingData[subject] || "",
      },
    }));
  } else {
    setExamMarks((prev) => ({
      ...prev,
      [subjectKey]: {
        [subject]: "",
      },
    }));
  }
};

const handleExamMarkChange = (examId, student, subject, value) => {
  const subjectKey = getSubjectKey(examId, student, subject);
  const validatedValue = Math.min(100, Math.max(0, Number(value) || 0));
  setExamMarks((prev) => ({
    ...prev,
    [subjectKey]: {
      [subject]: validatedValue,
    },
  }));
};

const handleSaveExam = async (examItem, student, subject) => {
  console.log("student", student);
  const examKey = getExamKey(examItem.id, student);
  const subjectKey = getSubjectKey(examItem.id, student, subject);
  const cellKey = getSubjectKey(examItem.id, student, subject);
  
  const marks = examMarks[subjectKey] || {};
  const subjectMark = Number(marks[subject]) || 0;
  const existingExam = examData[examKey];

  // Get current marks for ALL subjects from the existing exam data
  const currentPhysics = existingExam?.physics || 0;
  const currentChemistry = existingExam?.chemistry || 0;
  const currentMaths = existingExam?.maths || 0;

  // Only update the subject that's being edited, keep others as they are
  let physicsMarks = currentPhysics;
  let chemistryMarks = currentChemistry;
  let mathsMarks = currentMaths;

  // Update only the specific subject that's being edited
  if (subject === "physics") {
    physicsMarks = subjectMark;
  } else if (subject === "chemistry") {
    chemistryMarks = subjectMark;
  } else if (subject === "maths") {
    mathsMarks = subjectMark;
  }

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
    Subject: "General", // Always set to General
    total: total,
    physics: physicsMarks,
    chemistry: chemistryMarks,
    maths: mathsMarks,
    isCommonStudent: student.isCommonStudent,
    stream: student.Stream,
  };
  console.log("examDataToSave", examDataToSave);

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
        subject: "General",
        studentName: student.studentName,
        studentId: student.id,
        status: "Present",
        isAbsent: false,
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


const handleCancelExam = (examId, student, subject) => {
  const subjectKey = getSubjectKey(examId, student, subject);

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
const getExamKey = (examId, student) => `${examId}_${student.studentName.replace(/\s+/g, '_')}`;
const getSubjectKey = (examId, student, subject) => `${examId}_${student.studentName.replace(/\s+/g, '_')}_${subject}`;
const renderSubjectMarks = (examItem, student, subject) => {
  const examKey = getExamKey(examItem.id, student);
  const subjectKey = getSubjectKey(examItem.id, student, subject);
  const cellKey = getSubjectKey(examItem.id, student, subject);
  
  const isEditing = editingExam[subjectKey];
  const marks = examMarks[subjectKey] || {};
  const savedExam = examData[examKey];
  const isSaving = savingState[cellKey];
  const examType = getExamType(examItem.exam);

  // Check if student is absent for this specific subject
  const isAbsent =
    savedExam?.status === "Absent" &&
    savedExam?.absentReason?.includes(subject.toUpperCase());
  const absentReasonText = savedExam?.absentReason;

  // Check if marks are already entered for this subject
  const hasMarksEntered = (savedExam?.[subject] || 0) > 0;
  
  // Check if it's a future exam (date is after today)
  const isFutureExam = () => {
    const examDate = examItem.date.split('.').reverse().join('-');
    const today = new Date();
    const exam = new Date(examDate);
    return exam > today;
  };


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
              student,
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
          sx={{ width: "70px", "& .MuiInputBase-root": { height: "36px" } }}
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
              onClick={() => handleCancelExam(examItem.id, student, subject)}
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
        flexDirection: "column",
      }}
    >
      {isAbsent ? (
        <Tooltip
          title={`Absent for ${subject}: ${
            absentReasonText?.replace(`${subject.toUpperCase()}: `, "") ||
            "No reason provided"
          }`}
          arrow
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#dc2626",
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              ABSENT
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontSize: "0.7rem",
                textAlign: "center",
                maxWidth: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {absentReasonText?.replace(`${subject.toUpperCase()}: `, "") ||
                "Absent"}
            </Typography>
          </Box>
        </Tooltip>
      ) : (
        <>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              minWidth: "25px",
              textAlign: "center",
              color: (savedExam?.[subject] || 0) > 0 ? "#1e293b" : "#64748b",
            }}
          >
            {(savedExam?.[subject] || 0) > 0 ? savedExam[subject] : "-"}
          </Typography>
          {globalEditMode && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title={`Edit ${subject} marks`}>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleEditExam(
                      examItem.id,
                      student,
                      subject,
                      savedExam
                    )
                  }
                  sx={{ color: "#3b82f6", padding: "2px" }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              {!hasMarksEntered && !isFutureExam() && (
                <Tooltip title={`Mark ${subject} absent`}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleMarkAbsentClick(examItem, student, subject)
                    }
                    sx={{ color: "#dc2626", padding: "2px" }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
  const renderMarkAbsentDialog = () => (
    <Dialog
      open={markAbsentDialog.open}
      onClose={() =>
        setMarkAbsentDialog({
          open: false,
          examItem: null,
          student: null,
          subject: null,
        })
      }
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Mark Student Absent</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Absent Reason</InputLabel>
            <Select
              value={absentReason}
              label="Absent Reason"
              onChange={(e) => setAbsentReason(e.target.value)}
            >
              {absentReasons.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {markAbsentDialog.student && (
            <Typography variant="body2" sx={{ mt: 2, color: "#64748b" }}>
              Marking <strong>{markAbsentDialog.student.studentName}</strong> as
              absent for <strong>{markAbsentDialog.examItem?.exam}</strong> on{" "}
              <strong>{markAbsentDialog.examItem?.date}</strong>
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <MuiButton
          onClick={() =>
            setMarkAbsentDialog({
              open: false,
              examItem: null,
              student: null,
              subject: null,
            })
          }
        >
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleMarkAbsent}
          variant="contained"
          color="error"
          disabled={!absentReason}
        >
          Mark Absent
        </MuiButton>
      </DialogActions>
    </Dialog>
  );

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
            <Typography variant="caption" sx={{ color: "#64748b", ml: 1 }}>
              (Based on entered marks only)
            </Typography>
          </Box>
        </FooterCell>
        {revisionStudents.map((student) => {
          const studentAvg = averages[student.id];
          const hasValidData = studentAvg?.count > 0;
          
          return student.isCommonStudent ? (
            <React.Fragment key={student.id}>
              <FooterCell>
                {hasValidData ? `${studentAvg.physics}P` : "No data"}
              </FooterCell>
              <FooterCell>
                {hasValidData ? `${studentAvg.chemistry}C` : "No data"}
              </FooterCell>
            </React.Fragment>
          ) : (
            <FooterCell key={student.id}>
              {hasValidData ? `${studentAvg.physics}P` : "No data"}
            </FooterCell>
          );
        })}
      </TableRow>
    </TableFooter>
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
        <ScrollableTableContainer>
          <Table size="small" stickyHeader>
            <StickyTableHead>
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
            </StickyTableHead>
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
          </Table>
        </ScrollableTableContainer>
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
          // Find the matching student by name
          const matchedStudent = revisionStudents.find(student => 
            student.studentName === examRecord.studentName || 
            student.originalName === examRecord.studentName ||
            student.originalName === examRecord.originalStudentName
          );

          if (matchedStudent) {
            const examKey = getExamKey(examItem.id, matchedStudent);
            
            // Check if student is absent
            const isAbsent = examRecord.status === "Absent" || examRecord.isAbsent;

            // Merge data for the same student (same name, different IDs)
            examDataMap[examKey] = {
              ...examDataMap[examKey],
              examRecordId: examRecord.id || examDataMap[examKey]?.examRecordId,
              physics: examRecord.physics !== undefined ? examRecord.physics : (examDataMap[examKey]?.physics || 0),
              chemistry: examRecord.chemistry !== undefined ? examRecord.chemistry : (examDataMap[examKey]?.chemistry || 0),
              maths: examRecord.maths !== undefined ? examRecord.maths : (examDataMap[examKey]?.maths || 0),
              total: examRecord.total !== undefined ? examRecord.total : (examDataMap[examKey]?.total || 0),
              subject: "General",
              studentName: matchedStudent.studentName,
              studentId: matchedStudent.id,
              status: examRecord.status || examDataMap[examKey]?.status || "Present",
              absentReason: examRecord.absentReason || examDataMap[examKey]?.absentReason || "",
              isAbsent: isAbsent || examDataMap[examKey]?.isAbsent || false,
            };
          }
        });
      }
    });

    console.log("Final loaded exam data map:", examDataMap);
    setExamData(examDataMap);
  };

  loadExamData();
}, [exams, revisionStudents]);

  useEffect(() => {
    if (exams.length === 0 && !loading) {
      handleRefresh();
    }
  }, [dispatch, exams.length, loading]);

  return (
    <Fade in timeout={800}>
      <StyledPaper sx={{ p: 3 }}>
        {renderMarkAbsentDialog()}
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