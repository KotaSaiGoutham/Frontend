import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addStudentExam,
  addWeeklyMarks,
  updateStudentExam,
} from "../redux/actions";
import {
  MuiInput,
  MuiSelect,
  MuiDatePicker,
  MuiMultiSelectChip,
} from "./customcomponents/MuiCustomFormFields";
import { Box, FormControlLabel, Checkbox, Radio } from "@mui/material";
import {
  FaUser,
  FaGraduationCap,
  FaBook,
  FaSave,
  FaArrowLeft,
  FaCalendarAlt,
  FaLightbulb,
  FaCheckSquare,
  FaUniversity,
} from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfDay, format } from "date-fns";
import { topicOptions, MARK_SCHEMES } from "../mockdata/Options";
import { useSnackbar } from "./customcomponents/SnackbarContext";
import { useNavigate, useLocation } from "react-router-dom";

const StudentExamFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();

  // Get exam data from navigation state, if it exists
  const examToEdit = useMemo(
    () => location.state?.examToEdit || null,
    [location.state]
  );

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    subject: user?.isPhysics ? "Physics" : user?.isChemistry ? "Chemistry" : "",
    stream: "",
    marks: {},
    outOf: 0,
    total: 0,
    examDate: format(new Date(), "yyyy-MM-dd"),
    status: "Present",
    topic: [],
    testType: [], // For revision program students
    examType: "E-EA", // New field: E-EA (Exam by EA) or CA (College Exam)
  });

  // Check if selected student is a revision program student
  const isRevisionStudent = useMemo(() => {
    if (!formData.studentId) return false;
    const selectedStudent = students.find((s) => s.id === formData.studentId);
    return selectedStudent?.isRevisionProgramJEEMains2026Student === true;
  }, [formData.studentId, students]);

  useEffect(() => {
    if (examToEdit) {
      const initialMarks = {};
      let totalOutOf = 0;

      const subjects = ["Physics", "Chemistry", "Maths"];
      subjects.forEach((subject) => {
        const maxKey = `max${subject}`;
        const marksKey = subject.toLowerCase();

        if (
          examToEdit.hasOwnProperty(marksKey) &&
          examToEdit.hasOwnProperty(maxKey)
        ) {
          initialMarks[subject] = examToEdit[marksKey];
          totalOutOf += examToEdit[maxKey];
        }
      });

      // Determine exam type for existing records
      let examType = "E-EA"; // Default for existing records
      if (examToEdit.examType) {
        examType = examToEdit.examType;
      }

      setFormData({
        studentId: examToEdit.studentId,
        studentName: examToEdit.studentName,
        subject: examToEdit.subject,
        stream: examToEdit.stream,
        marks: initialMarks,
        outOf: user.isPhysics
          ? examToEdit?.maxPhysics
          : examToEdit?.maxChemistry,
        total: examToEdit.total,
        examDate: format(new Date(examToEdit.examDate), "yyyy-MM-dd"),
        status: examToEdit.status,
        topic: Array.isArray(examToEdit.topic)
          ? examToEdit.topic
          : [examToEdit.topic],
        testType: examToEdit.testType || [],
        examType: examType, // Set exam type
      });
    } else {
      setFormData({
        studentId: "",
        studentName: "",
        subject: user?.isPhysics
          ? "Physics"
          : user?.isChemistry
          ? "Chemistry"
          : "",
        stream: "",
        marks: {},
        outOf: 0,
        total: 0,
        examDate: format(new Date(), "yyyy-MM-dd"),
        status: "Present",
        topic: [],
        testType: [],
        examType: "E-EA", // Default to E-EA for new exams
      });
    }
  }, [examToEdit, user]);

  const sortedStudents = [...students].sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const selectedStudent = sortedStudents.find((s) => s.id === studentId);
    const stream = selectedStudent?.Stream || "";
    const scheme = MARK_SCHEMES[stream] || {};

    let allowedSubjects = Object.keys(scheme);
    if (!user?.AllowAll) {
      if (user?.isPhysics) allowedSubjects = ["Physics"];
      else if (user?.isChemistry) allowedSubjects = ["Chemistry"];
      else if (user?.isMaths) allowedSubjects = ["Maths"];
      else allowedSubjects = [];
    }

    const outOf = allowedSubjects.reduce(
      (sum, subj) => sum + (scheme[subj] || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      studentId,
      studentName: selectedStudent?.Name || "",
      subject: selectedStudent?.Subject || prev.subject,
      stream,
      marks: {},
      outOf,
      total: 0,
      testType: [], // Reset test type when student changes
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let updatedName = name;

    if (Array.isArray(value) && name === undefined) {
      updatedName = "topic";
    }

    setFormData((prev) => ({ ...prev, [updatedName]: updatedValue }));
  };

  // Handle exam type change
  const handleExamTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, examType: e.target.value }));
  };

  // Handle test type checkbox changes (for revision program students)
  const handleTestTypeChange = (testType) => {
    // Since only one can be selected, we just set the value directly.
    setFormData((prev) => ({ ...prev, testType: [testType] }));
  };

  const handleDatePickerChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      examDate: date,
    }));
  };

  const handleChange = (e, subject) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedMarks = {
        ...prev.marks,
        [subject]: value === "" ? "" : Number(value),
      };
      const total = Object.values(updatedMarks).reduce(
        (sum, m) => sum + (Number(m) || 0),
        0
      );
      return { ...prev, marks: updatedMarks, total };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalMarks = Object.values(formData.marks).reduce(
      (sum, mark) => sum + (Number(mark) || 0),
      0
    );

    if (totalMarks > formData.outOf) {
      showSnackbar(
        "Total marks cannot be more than the 'Out Of' value.",
        "error"
      );
      return;
    }

    const userId = localStorage.getItem("userId");
    const studentExamData = {
      userId: userId,
      studentId: formData.studentId,
      studentName: formData.studentName,
      stream: formData.stream,
      examDate: new Date(formData.examDate).toISOString(),
      examName: formData.topic,
      recordedBy: user.id,
      status: formData.status,
      topic: formData.topic,
      Subject: user.isPhysics
        ? "Physics"
        : user.isChemistry
        ? "Chemistry"
        : "Any",
      testType: formData.testType,
      examType: formData.examType, // Add exam type to backend data
      isRevisionProgramJEEMains2026Student: isRevisionStudent,
    };

    if (MARK_SCHEMES[formData.stream]) {
      Object.keys(MARK_SCHEMES[formData.stream]).forEach((subject) => {
        if (user.AllowAll || user[`is${subject}`]) {
          studentExamData[subject.toLowerCase()] =
            Number(formData.marks[subject]) || 0;
          studentExamData[
            `max${subject.charAt(0).toUpperCase() + subject.slice(1)}`
          ] = MARK_SCHEMES[formData.stream][subject];
        }
      });
    }

    try {
      if (examToEdit) {
        await dispatch(
          updateStudentExam({ ...studentExamData, id: examToEdit.id })
        );
        showSnackbar("Exam data updated successfully!", "success");
      } else {
        const weeklyMarksData = {
          ...studentExamData,
          Date: new Date().toLocaleDateString("en-GB"),
        };
        await dispatch(addStudentExam(studentExamData));
        showSnackbar("Exam data saved successfully!", "success");
      }

      setTimeout(() => {
        navigate("/student-exams");
      }, 1500);
    } catch (error) {
      console.error("Failed to save/update exam data:", error);
      showSnackbar(
        "Failed to save/update exam data. Please try again.",
        "error"
      );
    }
  };

  const subjects = MARK_SCHEMES[formData.stream]
    ? Object.keys(MARK_SCHEMES[formData.stream])
    : [];

  const filteredSubjects = subjects.filter((subj) => {
    if (user?.isPhysics && subj !== "Physics") return false;
    if (user?.isChemistry && subj !== "Chemistry") return false;
    if (user?.isMaths && subj !== "Maths") return false;
    return true;
  });

  const filteredTopicOptions = useMemo(() => {
    const subject = user.subject;
    if (!subject) return [];
    const filtered = topicOptions.filter((t) => t.subject === subject);
    if (filtered.length === 0)
      return [{ value: "No Topics Available", label: "No Topics Available" }];
    return filtered
      .sort((a, b) => a.topic.localeCompare(b.topic))
      .map((t) => ({
        value: t.topic,
        label: t.topic,
      }));
  }, [user.subject]);

  const isEditMode = !!examToEdit;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="ats-page-container">

        <div className="ats-form-card">
          <form onSubmit={handleSubmit} className="ats-form">
            <h3 style={{ paddingBottom: 20 }}>
              {isEditMode
                ? `Edit Exam for ${formData.studentName}`
                : "Add Student Exam"}
            </h3>

            {/* ---------------------------------------------------------------------- */}
            {/* ## STEP 1: Student & Exam Type Selection */}
            {/* ---------------------------------------------------------------------- */}
            <div className="add-student-form-section-title">
              1. Student & Exam Type
            </div>
            <div className="ats-form-grid" style={{ marginBottom: 20 }}>
              <MuiSelect
                label="Select Student"
                icon={FaUser}
                name="studentId"
                value={formData.studentId || ""}
                onChange={handleStudentSelect}
                options={sortedStudents.map((s) => ({
                  value: s.id,
                  label: s.Name,
                }))}
                required
              />
              <MuiInput
                label="Stream"
                icon={FaGraduationCap}
                name="stream"
                value={formData.stream}
                disabled
              />
            </div>

            {/* Exam Type Checkboxes */}
            <div
              style={{
                marginTop: 0,
                background: "#f0f8ff",
                padding: "15px",
                borderRadius: "8px",
                borderLeft: "4px solid #1976d2",
                marginBottom: 20,
                paddingBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: "1.0rem",
                  fontWeight: "600",
                  color: "#292551",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaUniversity style={{ marginRight: 8 }} />
                Select Exam Origin
              </div>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.examType === "E-EA"}
                      onChange={() =>
                        handleExamTypeChange({ target: { value: "E-EA" } })
                      }
                      name="examType"
                      value="E-EA"
                      sx={{
                        p: 0.5,
                        color: "#1976d2",
                        "&.Mui-checked": {
                          color: "#1976d2",
                        },
                      }}
                    />
                  }
                  label={<span>Exam by EA</span>}
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                      fontWeight: "500",
                    },
                    border:
                      formData.examType === "E-EA"
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor:
                      formData.examType === "E-EA" ? "#e3f2fd" : "white",
                    p: 0.5,
                    minWidth: "160px",
                    "&:hover": {
                      borderColor: "#1976d2",
                      backgroundColor: "#f5f9ff",
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.examType === "CA"}
                      onChange={() =>
                        handleExamTypeChange({ target: { value: "CA" } })
                      }
                      name="examType"
                      value="CA"
                      sx={{
                        p: 0.5,
                        color: "#d32f2f",
                        "&.Mui-checked": {
                          color: "#d32f2f",
                        },
                      }}
                    />
                  }
                  label={<span>College Exam (CA)</span>}
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                      fontWeight: "500",
                    },
                    border:
                      formData.examType === "CA"
                        ? "2px solid #d32f2f"
                        : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor:
                      formData.examType === "CA" ? "#ffebee" : "white",
                    p: 0.5,
                    minWidth: "160px",
                    "&:hover": {
                      borderColor: "#d32f2f",
                      backgroundColor: "#fff5f5",
                    },
                  }}
                />
              </Box>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* ## STEP 2: Exam Details */}
            {/* ---------------------------------------------------------------------- */}
            <div
              className="add-student-form-section-title"
              style={{ marginTop: 20 }}
            >
              2. Exam Date & Topic
            </div>
            <div className="ats-form-grid" style={{ marginBottom: 20 }}>
              <MuiDatePicker
                label="Exam Date"
                icon={FaCalendarAlt}
                name="examDate"
                value={formData.examDate}
                onChange={handleDatePickerChange}
                required
              />
              <MuiSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: "Present", label: "Present" },
                  { value: "Absent", label: "Absent" },
                  { value: "Pending", label: "Pending" },
                  { value: "Rescheduled", label: "Rescheduled" },
                ]}
                required
              />
              <MuiMultiSelectChip
                label="Topic"
                icon={FaLightbulb}
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                options={filteredTopicOptions}
                required
              />
            </div>

            {/* Test Type Checkboxes - Only for Revision Program Students */}
            <div
              style={{
                marginTop: 0,
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                borderLeft: "4px solid #7b1fa2",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: "1.0rem",
                  fontWeight: "600",
                  color: "#292551",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaCheckSquare style={{ marginRight: 8 }} />
                Revision Test Type
              </div>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* Weekend Test Radio */}
                {/* General Exam Radio */}
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.testType.includes("generalExam")}
                      onChange={() => handleTestTypeChange("generalExam")}
                      name="testType"
                      value="generalExam"
                      sx={{
                        p: 0.5,
                        color: "#ed6c02", // Orange color
                        "&.Mui-checked": { color: "#ed6c02" },
                      }}
                    />
                  }
                  label="General Exam"
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                      fontWeight: "500",
                    },
                    border: formData.testType.includes("generalExam")
                      ? "2px solid #ed6c02"
                      : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: formData.testType.includes("generalExam")
                      ? "#fff3e0" // Light orange background
                      : "white",
                    p: 0.5,
                    minWidth: "140px",
                    "&:hover": {
                      borderColor: "#ed6c02",
                      backgroundColor: "#fff8f0",
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.testType.includes("weekendTest")}
                      onChange={() => handleTestTypeChange("weekendTest")}
                      name="testType" // Important: All must share the same name
                      value="weekendTest"
                      sx={{
                        p: 0.5,
                        color: "#1976d2",
                        "&.Mui-checked": { color: "#1976d2" },
                      }}
                    />
                  }
                  label="Weekend Test"
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                      fontWeight: "500",
                    },
                    border: formData.testType.includes("weekendTest")
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: formData.testType.includes("weekendTest")
                      ? "#e3f2fd"
                      : "white",
                    p: 0.5,
                    minWidth: "140px",
                    "&:hover": {
                      borderColor: "#1976d2",
                      backgroundColor: "#f5f9ff",
                    },
                  }}
                />

                {/* Cumulative Test Radio */}
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.testType.includes("cumulativeTest")}
                      onChange={() => handleTestTypeChange("cumulativeTest")}
                      name="testType" // Important: All must share the same name
                      value="cumulativeTest"
                      sx={{
                        p: 0.5,
                        color: "#7b1fa2",
                        "&.Mui-checked": { color: "#7b1fa2" },
                      }}
                    />
                  }
                  label="Cumulative Test"
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                      fontWeight: "500",
                    },
                    border: formData.testType.includes("cumulativeTest")
                      ? "2px solid #7b1fa2"
                      : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: formData.testType.includes(
                      "cumulativeTest"
                    )
                      ? "#f3e5f5"
                      : "white",
                    p: 0.5,
                    minWidth: "140px",
                    "&:hover": {
                      borderColor: "#7b1fa2",
                      backgroundColor: "#f9f5ff",
                    },
                  }}
                />

                {/* Grand Test Radio */}
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.testType.includes("grandTest")}
                      onChange={() => handleTestTypeChange("grandTest")}
                      name="testType" // Important: All must share the same name
                      value="grandTest"
                      sx={{
                        p: 0.5,
                        color: "#2e7d32",
                        "&.Mui-checked": { color: "#2e7d32" },
                      }}
                    />
                  }
                  label="Grand Test"
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      color: "#4a4a4a",
                      fontWeight: "500",
                    },
                    border: formData.testType.includes("grandTest")
                      ? "2px solid #2e7d32"
                      : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: formData.testType.includes("grandTest")
                      ? "#e8f5e9"
                      : "white",
                    p: 0.5,
                    minWidth: "140px",
                    "&:hover": {
                      borderColor: "#2e7d32",
                      backgroundColor: "#f5fff5",
                    },
                  }}
                />
              </Box>
            </div>
            {/* ---------------------------------------------------------------------- */}
            {/* ## STEP 3: Marks Entry */}
            {/* ---------------------------------------------------------------------- */}
            <div className="add-student-form-section-title">3. Marks Entry</div>
            <div className="ats-form-grid">
              {filteredSubjects.map((subject) => (
                <MuiInput
                  key={subject}
                  label={`${subject} (Max: ${
                    MARK_SCHEMES[formData.stream]?.[subject]
                  })`}
                  icon={FaBook}
                  name={subject}
                  type="number"
                  value={formData.marks[subject] || ""}
                  onChange={(e) => handleChange(e, subject)}
                  placeholder={`${subject} marks`}
                  inputProps={{
                    min: 0,
                    max: MARK_SCHEMES[formData.stream]?.[subject],
                  }}
                />
              ))}
              <MuiInput
                label="Out Of"
                icon={FaBook}
                name="outOf"
                type="number"
                value={formData.outOf}
                disabled
              />
            </div>

            {/* Buttons */}
            <div className="add-student-button-group">
              <button type="submit" className="add-student-primary-button">
                <FaSave /> {isEditMode ? "Save Changes" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/student-exams")}
                className="add-student-secondary-button"
              >
                <FaArrowLeft /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default StudentExamFormPage;
