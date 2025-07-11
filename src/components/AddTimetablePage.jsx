import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarPlus,
  FaUserTie,
  FaClock,
  FaBook,
  FaArrowLeft,
  FaSave,
  FaExclamationCircle,
  FaCalendarAlt,
  FaUserGraduate,
  FaLightbulb,
} from "react-icons/fa";
import {
  format,
  isValid,
  parseISO,
  startOfDay,
  addHours,
  isToday,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import "./AddTimetablePage.css";
import {
  MuiSelect,
  MuiDatePicker,
  MuiTimePicker,
} from "../components/customcomponents/MuiCustomFormFields";
import { topicOptions } from "../mockdata/Options";
import {
  fetchStudents,
  fetchEmployees,
  addTimetableEntry,
} from "../redux/actions/index";
// Define all possible subjects
const allSubjects = [
  "Physics",
  "Chemistry",
  "Maths",
  "Biology",
  "Zoology",
  "English",
  "History",
  "Computer Science",
];

// Define faculty-specific roles for filtering (these are the 'subjects' they teach)
const facultySubjectRoles = allSubjects;

const AddTimetablePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data and loading states from Redux
  const { user, loading: userLoading } = useSelector((state) => state.auth);
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useSelector((state) => state.employees);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);

  // Combined loading state for the form itself
  const isLoadingInitialData =
    userLoading || employeesLoading || studentsLoading;

  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    facultyId: "",
    fromTime: null,
    toTime: null,
    subject: "",
    topic: "",
    student: "",
  });

  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });
  const [formError, setFormError] = useState("");
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // New state for animation


  // State for Select options and disability based on user roles
  const [computedFacultyOptions, setComputedFacultyOptions] = useState([]);
  const [isFacultySelectDisabled, setIsFacultySelectDisabled] = useState(false);

  const [computedStudentOptions, setComputedStudentOptions] = useState([]);
  const [isStudentSelectDisabled, setIsStudentSelectDisabled] = useState(false);

  const [computedSubjectOptions, setComputedSubjectOptions] = useState([]);
  const [isSubjectSelectDisabled, setIsSubjectSelectDisabled] = useState(false);

  // UseMemo for filtered topics (depends on formData.subject)
  const filteredTopicOptions = useMemo(() => {
    if (!formData.subject) {
        return [{ value: "", label: "Select Topic" }];
    }

    const filtered = topicOptions.filter(
        (topicObj) => topicObj.subject === formData.subject
    );

    // Sort the filtered topics alphabetically by their 'topic' property
    const sortedFiltered = [...filtered].sort((a, b) => {
        return a.topic.localeCompare(b.topic);
    });

    const options = sortedFiltered.map((topicObj) => ({
        value: topicObj.topic,
        label: topicObj.topic,
    }));

    // Handle initial "Select Topic" or "No Topics Available"
    if (options.length > 0 && !options.some((opt) => opt.value === "")) {
        options.unshift({ value: "", label: "Select Topic" });
    } else if (options.length === 0) {
        return [{ value: "", label: "No Topics Available" }];
    }

    return options;
}, [formData.subject, topicOptions]); // Add topicOptions to dependency array if it can change

  // useEffect for resetting topic if subject changes and current topic is invalid
  useEffect(() => {
    if (
      formData.topic &&
      !filteredTopicOptions.slice(1).some((opt) => opt.value === formData.topic)
    ) {
      setFormData((prev) => ({ ...prev, topic: "" }));
    }
  }, [formData.subject, formData.topic, filteredTopicOptions]);

  // useEffect for fetching employees and students (runs once on mount)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchEmployees());
    dispatch(fetchStudents());
  }, [dispatch, navigate]);

  // Handle Redux errors for initial data fetching and submission
  useEffect(() => {
    if (employeesError) {
      setFormError(`Error loading faculty: ${employeesError}`);
    } else if (studentsError) {
      setFormError(`Error loading students: ${studentsError}`);
    } else {
      setFormError(""); // Clear general form error if no data errors
    }
  }, [employeesError, studentsError]);

  // Faculty Options (Logic based on user roles)
  useEffect(() => {
    if (!employees || employees.length === 0 || !user) {
      setComputedFacultyOptions([{ value: "", label: "No Faculty Available" }]);
      setIsFacultySelectDisabled(true);
      // Don't auto-clear formData here, let user make a choice if options become available later
      return;
    }

    let filteredByRoleEmployees = [];
    let defaultFacultyId = null;
    let disableSelect = false;

    if (user.AllowAll) {
      filteredByRoleEmployees = employees.filter(
        (emp) => emp.role && facultySubjectRoles.includes(emp.role.trim())
      );
    } else if (user.isPhysics) {
      filteredByRoleEmployees = employees.filter(
        (emp) => emp.role && emp.role.trim() === "Physics"
      );
      if (filteredByRoleEmployees.length === 1) {
        defaultFacultyId = String(filteredByRoleEmployees[0].id);
        disableSelect = true;
      }
    } else if (user.isChemistry) {
      filteredByRoleEmployees = employees.filter(
        (emp) => emp.role && emp.role.trim() === "Chemistry"
      );
      if (filteredByRoleEmployees.length === 1) {
        defaultFacultyId = String(filteredByRoleEmployees[0].id);
        disableSelect = true;
      }
    } else {
      filteredByRoleEmployees = employees.filter(
        (emp) => emp.role && facultySubjectRoles.includes(emp.role.trim())
      );
    }

    let options = filteredByRoleEmployees.map((emp) => ({
      value: String(emp.id),
      label: emp.name,
    }));

    if (!disableSelect && options.length > 0) {
      options.unshift({ value: "", label: "Select Faculty" });
    } else if (options.length === 0) {
      options.unshift({ value: "", label: "No Faculty Available" });
      disableSelect = true;
    }

    setComputedFacultyOptions(options);
    setIsFacultySelectDisabled(disableSelect || options.length <= 1);

    // REVISED LOGIC: Set formData.facultyId only if currently empty or invalid
    // AND a default value is determined by user role.
    if (defaultFacultyId !== null) {
      if (formData.facultyId !== defaultFacultyId) {
        setFormData((prev) => ({ ...prev, facultyId: defaultFacultyId }));
      }
    } else {
      // If no default applies, and the current facultyId isn't found in options, clear it
      // This handles cases where a previously selected faculty becomes unavailable
      const currentFacultyIdExists = options.some(
        (opt) => opt.value === formData.facultyId
      );
      if (formData.facultyId !== "" && !currentFacultyIdExists) {
        setFormData((prev) => ({ ...prev, facultyId: "" }));
      }
    }
  }, [employees, user, formData.facultyId]); // formData.facultyId is still a dependency to re-evaluate if it changes

  // Student Options (Logic based on user roles and selected faculty/subject)
  useEffect(() => {
    if (!students || students.length === 0 || !user) {
      setComputedStudentOptions([{ value: "", label: "No Student Available" }]);
      setIsStudentSelectDisabled(true);
      return;
    }

    let filteredByRoleStudents = [];
    let defaultStudentId = null;
    let disableSelect = false;

    if (user.AllowAll) {
      filteredByRoleStudents = students;
    } else if (user.isPhysics) {
      filteredByRoleStudents = students.filter(
        (stu) => stu.Subject && stu.Subject.trim() === "Physics"
      );
      if (filteredByRoleStudents.length === 1) {
        defaultStudentId = String(filteredByRoleStudents[0].id);
        disableSelect = true;
      }
    } else if (user.isChemistry) {
      filteredByRoleStudents = students.filter(
        (stu) => stu.Subject && stu.Subject.trim() === "Chemistry"
      );
      if (filteredByRoleStudents.length === 1) {
        defaultStudentId = String(filteredByRoleStudents[0].id);
        disableSelect = true;
      }
    } else {
      filteredByRoleStudents = students;
    }
   const sortedStudents = [...filteredByRoleStudents].sort((a, b) => {
        // Ensure 'Name' exists and is a string for comparison
        const nameA = a.Name ? String(a.Name).toUpperCase() : '';
        const nameB = b.Name ? String(b.Name).toUpperCase() : '';
        return nameA.localeCompare(nameB);
    });
    let options = sortedStudents.map((stu) => ({
      value: String(stu.id),
      label: stu.Name,
    }));

    if (!disableSelect && options.length > 0) {
      options.unshift({ value: "", label: "Select Student" });
    } else if (options.length === 0) {
      options.unshift({ value: "", label: "No Student Available" });
      disableSelect = true;
    }

    setComputedStudentOptions(options);
    setIsStudentSelectDisabled(disableSelect || options.length <= 1);

    // REVISED LOGIC: Set formData.student only if currently empty or invalid
    // AND a default value is determined by user role.
    if (defaultStudentId !== null) {
      if (formData.student !== defaultStudentId) {
        setFormData((prev) => ({ ...prev, student: defaultStudentId }));
      }
    } else {
      // If no default applies, and the current student isn't found in options, clear it
      const currentStudentIdExists = options.some(
        (opt) => opt.value === formData.student
      );
      if (formData.student !== "" && !currentStudentIdExists) {
        setFormData((prev) => ({ ...prev, student: "" }));
      }
    }
  }, [students, user, formData.student]); // formData.student is still a dependency

  // Subject Options (Logic based on user roles)
  useEffect(() => {
    let options = [];
    let defaultSubject = null;
    let disableSelect = false;

    if (!user) {
      options = allSubjects.map((sub) => ({ value: sub, label: sub }));
    } else if (user.AllowAll) {
      options = allSubjects.map((sub) => ({ value: sub, label: sub }));
    } else if (user.isPhysics) {
      options = [{ value: "Physics", label: "Physics" }];
      defaultSubject = "Physics";
      disableSelect = true;
    } else if (user.isChemistry) {
      options = [{ value: "Chemistry", label: "Chemistry" }];
      defaultSubject = "Chemistry";
      disableSelect = true;
    } else {
      options = allSubjects.map((sub) => ({ value: sub, label: sub }));
    }

    if (!disableSelect && options.length > 0) {
      options.unshift({ value: "", label: "Select Subject" });
    } else if (options.length === 0) {
      options.unshift({ value: "", label: "No Subjects Available" });
      disableSelect = true;
    }

    setComputedSubjectOptions(options);
    setIsSubjectSelectDisabled(disableSelect || options.length <= 1);

    // REVISED LOGIC: Set formData.subject only if currently empty or invalid
    // AND a default value is determined by user role.
    if (defaultSubject !== null) {
      if (formData.subject !== defaultSubject) {
        setFormData((prev) => ({ ...prev, subject: defaultSubject }));
      }
    } else {
      // If no default applies, and the current subject isn't found in options, clear it
      const currentSubjectExists = options.some(
        (opt) => opt.value === formData.subject
      );
      if (formData.subject !== "" && !currentSubjectExists) {
        setFormData((prev) => ({ ...prev, subject: "" }));
      }
    }
  }, [user, formData.subject]); // formData.subject is still a dependency

  // Calculate minTime for 'Time From' picker
  const minTimeForFromPicker = useMemo(() => {
    const selectedDate = parseISO(formData.date);
    const now = new Date();

    if (isValid(selectedDate) && isToday(selectedDate)) {
      let minimumTime = now;
      const currentMinute = now.getMinutes();

      if (currentMinute > 30) {
        minimumTime = addHours(setMinutes(now, 0), 1);
      } else if (currentMinute > 0) {
        minimumTime = setMinutes(now, 30);
      }
      minimumTime = setSeconds(setMilliseconds(minimumTime, 0), 0);
      return minimumTime;
    }
    return startOfDay(parseISO(formData.date));
  }, [formData.date]);

  const handleTimeChange = (name, newDateObject) => {
    setFormData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: newDateObject,
      };

      if (name === "fromTime" && newDateObject && isValid(newDateObject)) {
        if (
          !prevData.toTime ||
          newDateObject.getTime() >= prevData.toTime.getTime()
        ) {
          const oneHourLater = addHours(newDateObject, 1);
          updatedData.toTime = oneHourLater;
        }
      }
      return updatedData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { date, facultyId, fromTime, toTime, subject, topic, student } =
      formData;

    if (
      !date ||
      !facultyId ||
      facultyId === "" ||
      !subject ||
      subject === "" ||
      !topic ||
      topic === "" ||
      !student ||
      student === ""
    ) {
      setFormError("All fields are required.");
      return false;
    }

    if (!fromTime || !toTime) {
      setFormError("Both start and end times are required.");
      return false;
    }

    if (fromTime.getTime() >= toTime.getTime()) {
      setFormError("End time must be after start time.");
      return false;
    }

    if (isToday(parseISO(date))) {
      const now = new Date();
      const selectedFromTimeComparable = setSeconds(
        setMilliseconds(
          setMinutes(
            setHours(new Date(), fromTime.getHours()),
            fromTime.getMinutes()
          ),
          0
        ),
        0
      );
      const currentTimeComparable = setSeconds(
        setMilliseconds(
          setMinutes(setHours(new Date(), now.getHours()), now.getMinutes()),
          0
        ),
        0
      );

      if (
        selectedFromTimeComparable.getTime() < currentTimeComparable.getTime()
      ) {
        setFormError("For today's date, 'Time From' must be in the future.");
        return false;
      }
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setShowSuccessAnimation(false); // Reset animation state before new submission

    setSubmitMessage({ type: "", message: "" }); // Clear previous messages

    const selectedFaculty = employees.find(
      (emp) => String(emp.id) === formData.facultyId
    );
    const facultyName = selectedFaculty
      ? selectedFaculty.name
      : "Unknown Faculty";

    const selectedStudent = students.find(
      (stu) => String(stu.id) === formData.student
    );
    const studentName = selectedStudent
      ? selectedStudent.Name
      : "Unknown Student";

    const formattedStartTime = formData.fromTime
      ? format(formData.fromTime, "hh:mm a")
      : "";
    const formattedEndTime = formData.toTime
      ? format(formData.toTime, "hh:mm a")
      : "";
    const timeRange = `${formattedStartTime} to ${formattedEndTime}`;

    const dateObject = parseISO(formData.date);
    const formattedDate = format(dateObject, "dd/MM/yyyy");

    const payload = {
      Day: formattedDate,
      Faculty: facultyName,
      Subject: formData.subject,
      Time: timeRange,
      Topic: formData.topic,
      Student: studentName,
    };

    console.log("Payload being sent:", payload);

    try {
      await dispatch(addTimetableEntry(payload));

      setSubmitMessage({
        type: "success",
        message: "Timetable entry added successfully!",
      });
              setShowSuccessAnimation(true); // Trigger animation on success (even simulated)

      setFormData((prev) => ({
        ...prev,
        date: format(new Date(), "yyyy-MM-dd"),
        facultyId: isFacultySelectDisabled ? prev.facultyId : "", // Retain if disabled and pre-selected
        fromTime: null,
        toTime: null,
        subject: isSubjectSelectDisabled ? prev.subject : "", // Retain if disabled and pre-selected
        topic: "",
        student: isStudentSelectDisabled ? prev.student : "", // Retain if disabled and pre-selected
      }));
      setTimeout(() => {
        setSubmitMessage({ type: "", message: "" }); // Clear message
        setShowSuccessAnimation(false); // Reset animation state
        navigate("/timetable");
      }, 1500); // This delay is for the message and redirection
    } catch (err) {
      console.error("Error during dispatch of addTimetableEntry:", err);
            setShowSuccessAnimation(false); // Ensure animation is off for errors

    }
  };

  if (isLoadingInitialData) {
    return (
      <div className="ats-loading-message">
        <div className="spinner"></div>
        Loading Form Data...
      </div>
    );
  }

  if (employeesError || studentsError) {
    return (
      <div className="ats-error-message">
        <FaExclamationCircle /> {employeesError || studentsError}
        <button
          onClick={() => navigate("/timetable")}
          className="ats-back-button"
        >
          <FaArrowLeft /> Back
        </button>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="ats-page-container">
        <div className="ats-header-card">
          <button
            onClick={() => navigate("/timetable")}
            className="ats-back-button"
          >
            <FaArrowLeft /> Back to Timetable
          </button>
          <h1 className="ats-form-title">
            <FaCalendarPlus className="ats-title-icon" /> Create New Timetable
            Entry
          </h1>
          <p className="ats-form-subtitle">
            Fill in the details for the new class.
          </p>
        </div>
        <div className="ats-form-card">
          <form onSubmit={handleSubmit} className="ats-form">
            <h3>Schedule New Class</h3>
            {formError && (
              <div className="ats-form-error">
                <FaExclamationCircle /> {formError}
              </div>
            )}
            {submitMessage.message && (
              <div
                className={`ats-submit-message ${
                  submitMessage.type === "success"
                    ? "ats-submit-success"
                    : "ats-submit-error"
                }`}
              >
                {submitMessage.type === "error" && <FaExclamationCircle />}{" "}
                {submitMessage.message}
              </div>
            )}
            <div className="ats-form-grid">
              {/* Date */}
              <MuiDatePicker
                label="Date"
                icon={FaCalendarAlt}
                name="date"
                value={formData.date}
                onChange={(dateString) =>
                  handleInputChange({
                    target: {
                      name: "date",
                      value: format(dateString, "yyyy-MM-dd"),
                    },
                  })
                }
                minDate={startOfDay(new Date())}
                required
              />

              {/* Faculty */}
              {!isFacultySelectDisabled && (
                <MuiSelect
                  label="Faculty"
                  icon={FaUserTie}
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleInputChange}
                  options={computedFacultyOptions}
                  required
                  disabled={isFacultySelectDisabled}
                />
              )}

              {/* Student */}
              <MuiSelect
                label="Student"
                icon={FaUserGraduate}
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                options={computedStudentOptions}
                required
                disabled={isStudentSelectDisabled}
              />

              {/* Subject (before Topic) */}
              {!isFacultySelectDisabled && (
                <MuiSelect
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  options={computedSubjectOptions}
                  required
                  disabled={isSubjectSelectDisabled}
                />
              )}

              {/* Topic (depends on Subject) */}
              <MuiSelect
                label="Topic"
                icon={FaLightbulb}
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                options={filteredTopicOptions}
                required
                disabled={!formData.subject || filteredTopicOptions.length <= 1}
              />

              {/* Time From */}
              <MuiTimePicker
                label="Time From"
                icon={FaClock}
                name="fromTime"
                value={formData.fromTime}
                onChange={handleTimeChange}
                minTime={minTimeForFromPicker}
                required
              />

              {/* Time To */}
              <MuiTimePicker
                label="Time To"
                icon={FaClock}
                name="toTime"
                value={formData.toTime}
                onChange={handleTimeChange}
                minTime={
                  formData.fromTime || startOfDay(parseISO(formData.date))
                }
                required
              />
            </div>

            <div className="add-student-button-group">
              <button type="submit" className="add-student-primary-button">
                <FaSave /> {"Schedule Class"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/timetable")}
                className="add-student-secondary-button"
              >
                <FaArrowLeft /> Cancel
              </button>
            </div>
          </form>
        </div>
          {submitMessage.message && (
              <div
                className={`ats-submit-message ${
                  submitMessage.type === "success"
                    ? "ats-submit-success"
                    : "ats-submit-error"
                } ${showSuccessAnimation ? 'ats-success-animate' : ''}`} 
              >
                {submitMessage.type === "error" && <FaExclamationCircle />}{" "}
                {submitMessage.message}
              </div>
            )}
      </div>
    </LocalizationProvider>
  );
};

export default AddTimetablePage;
