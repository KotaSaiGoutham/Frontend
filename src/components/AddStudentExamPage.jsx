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
import {
  FaUser,
  FaGraduationCap,
  FaBook,
  FaSave,
  FaArrowLeft,
  FaCalendarAlt,
  FaLightbulb,
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
    status: "Pending",
    topic: [],
  });

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

      setFormData({
        studentId: examToEdit.studentId,
        studentName: examToEdit.studentName,
        subject: examToEdit.subject, // This ensures formData.subject is set correctly
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
          : [examToEdit.topic], // Ensure it's always an array
      });
    } else {
      // Logic for adding a new exam
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
        status: "Pending",
        topic: [], // Initialize as an empty array
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
    }));
  };

const handleInputChange = (e) => {
  const { name, value } = e.target;
  let updatedValue = value;
  let updatedName = name;

  // Manual check for the MuiMultiSelectChip
  // The 'value' from a multi-select is an array, but the 'name' is undefined
  if (Array.isArray(value) && name === undefined) {
    updatedName = "topic"; // Hard-code the name for this specific input
  }

  setFormData((prev) => ({ ...prev, [updatedName]: updatedValue }));
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
        <div className="ats-header-card">
          <button
            onClick={() => navigate("/student-exams")}
            className="ats-back-button"
          >
            <FaArrowLeft /> Back to Exams
          </button>
          <h1 className="ats-form-title">
            <FaBook className="ats-title-icon" />{" "}
            {isEditMode ? "Edit Student Exam" : "Add Weekly Student Exam"}
          </h1>
          <p className="ats-form-subtitle">
            {isEditMode
              ? "Modify exam details and marks."
              : "Enter exam details and marks."}
          </p>
        </div>

        <div className="ats-form-card">
          <form onSubmit={handleSubmit} className="ats-form">
            <h3 style={{ paddingBottom: 20 }}>
              {isEditMode
                ? `Edit Exam for ${formData.studentName}`
                : "Add Student Exam"}
            </h3>

            {/* Student & Stream */}
            <div className="ats-form-grid">
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

            {/* Exam Date + Status + Topic */}
            <div className="ats-form-grid" style={{ marginTop: 20 }}>
              <MuiDatePicker
                label="Exam Date"
                icon={FaCalendarAlt}
                name="examDate"
                value={formData.examDate}
                onChange={handleDatePickerChange}
                // minDate={startOfDay(new Date())}
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

            {/* Marks */}
            <div className="add-student-form-section-title">Marks</div>
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
