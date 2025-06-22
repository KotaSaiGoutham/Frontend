import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
} from "date-fns";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import "./AddTimetablePage.css";
import {
  MuiInput,
  MuiSelect,
  MuiDatePicker,
  MuiTimePicker,
} from "../components/MuiCustomFormFields";
import { validRoles, topicOptions } from "../mockdata/Options";

const AddTimetablePage = () => {
  const navigate = useNavigate();

  // --- ALL REACT HOOKS MUST BE DECLARED AT THE TOP LEVEL ---
  const [employees, setEmployees] = useState([]);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"), // Initialize with today's date
    facultyId: "",
    fromTime: null,
    toTime: null,
    subject: "",
    topic: "",
    student: "",
  });

  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // UseMemo for filtered topics
  const filteredTopicOptions = useMemo(() => {
    const filtered = topicOptions.filter((topicObj) => topicObj.subject === formData.subject);
    return filtered.map((topicObj) => ({
      value: topicObj.topic,
      label: topicObj.topic,
    }));
  }, [formData.subject]);

  // useEffect for resetting topic
  useEffect(() => {
    if (formData.topic && !filteredTopicOptions.some(opt => opt.value === formData.topic)) {
      setFormData(prev => ({ ...prev, topic: '' }));
    }
  }, [formData.subject, formData.topic, filteredTopicOptions]);

  // useEffect for fetching dependencies
  useEffect(() => {
    const fetchDependencies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const employeesResponse = await fetch(
          "http://localhost:5000/api/data/empolyees",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!employeesResponse.ok) {
          throw new Error("Failed to fetch employees.");
        }
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
        if (employeesData.length > 0 && !formData.facultyId) {
          setFormData((prev) => ({ ...prev, facultyId: employeesData[0].id }));
        }

        const studentsResponse = await fetch(
          "http://localhost:5000/api/data/students",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const studentsData = await studentsResponse.json();
        if (!studentsResponse.ok) {
          throw new Error(studentsData.message || "Failed to fetch students.");
        }
        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching dependencies:", err);
        setSubmitMessage({
          type: "error",
          message: "Failed to load faculty or student list.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDependencies();
  }, [navigate, formData.facultyId]);

  // >>>>>> MOVED THIS USEMEMO HOOK HERE <<<<<<
  // Calculate minTime for 'Time From' picker
  const minTimeForFromPicker = useMemo(() => {
    const selectedDate = parseISO(formData.date);
    const now = new Date(); // Current date and time (e.g., June 21, 2025, 5:56:35 PM IST)

    if (isToday(selectedDate)) {
      // If the selected date is today, set minTime to the current time (rounded up)
      let minimumTime = now; // Start with current time

      // Round up to the next half-hour or hour
      const currentMinute = now.getMinutes();
      if (currentMinute > 30) {
          // If past half hour, set to next full hour (e.g., 5:56 PM -> 6:00 PM)
          minimumTime = addHours(setMinutes(now, 0), 1);
      } else if (currentMinute > 0) {
          // If before or at half hour, set to current hour and 30 minutes (e.g., 5:10 PM -> 5:30 PM)
          minimumTime = setMinutes(now, 30);
      }
      // If currentMinute is 0, minimumTime remains the current hour, 0 minutes.

      return minimumTime;
    }
    // If it's not today (future date), allow all times (minTime as start of day)
    return startOfDay(selectedDate);
  }, [formData.date]);


  const handleTimeChange = (name, newDateObject) => {
    setFormData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: newDateObject,
      };

      if (name === 'fromTime' && newDateObject && isValid(newDateObject)) {
        // Only auto-set toTime if it's currently null or less than fromTime
        // This prevents overwriting a manually selected toTime if fromTime is adjusted backwards
        if (!prevData.toTime || newDateObject.getTime() >= prevData.toTime.getTime()) {
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
    const {
      date,
      facultyId,
      fromTime,
      toTime,
      subject,
      topic,
      student,
    } = formData;

    if (
      !date ||
      !facultyId ||
      !subject ||
      !topic ||
      !student
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

    // New validation: Check if 'fromTime' is after current time if the date is today
    if (isToday(parseISO(date))) {
        const now = new Date();
        // Create a comparable date object for fromTime on today's date
        // Ensure comparison is only based on time, not date
        const selectedFromTimeComparable = setMinutes(setHours(new Date(), fromTime.getHours()), fromTime.getMinutes());
        const currentTimeComparable = setMinutes(setHours(new Date(), now.getHours()), now.getMinutes());


        if (selectedFromTimeComparable.getTime() <= currentTimeComparable.getTime()) {
            setFormError("For today's date, 'Time From' must be in the future.");
            return false;
        }
    }


    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    console.log("formData",formData)
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: "", message: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const selectedFaculty = employees.find(
      (emp) => emp.id === formData.facultyId
    );
    const facultyName = selectedFaculty
      ? selectedFaculty.name
      : "Unknown Faculty";

    const selectedStudent = students.find(
      (stu) => stu.id === formData.student
    );
    const studentName = selectedStudent
      ? selectedStudent.Name
      : "Unknown Student";

    const formattedStartTime = formData.fromTime ? format(formData.fromTime, "hh:mm a") : '';
    const formattedEndTime = formData.toTime ? format(formData.toTime, "hh:mm a") : '';
    const timeRange = `${formattedStartTime} to ${formattedEndTime}`;

    const dateObject = new Date(formData.date);
    const formattedDate = format(dateObject, "dd/MM/yyyy");

    console.log("Payload being sent:", {
        Day: formattedDate,
        Faculty: facultyName,
        Subject: formData.subject,
        Time: timeRange,
        Topic: formData.topic,
        Student: studentName,
    });

    const payload = {
      Day: formattedDate,
      Faculty: facultyName,
      Subject: formData.subject,
      Time: timeRange,
      Topic: formData.topic,
      Student: studentName,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/data/addTimetable",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add timetable entry.");
      }

      setSubmitMessage({
        type: "success",
        message: "Timetable entry added successfully!",
      });
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        facultyId: "",
        fromTime: null,
        toTime: null,
        subject: "",
        topic: "",
        student: "",
      });
      setTimeout(() => navigate("/timetable"), 1500);
    } catch (err) {
      console.error("Error adding timetable entry:", err);
      setSubmitMessage({
        type: "error",
        message: err.message || "Error adding timetable entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const facultyOptions = employees
    .filter((emp) => emp.role && validRoles.includes(emp.role.trim()))
    .map((emp) => ({
      value: emp.id,
      label: emp.name,
    }));

  const studentOptions = students.map((stu) => ({
    value: stu.id,
    label: stu.Name,
  }));

  const subjects = [
    "Physics", "Chemistry", "Maths", "Biology", "Zoology", "English", "History", "Computer Science",
  ];
  const subjectOptions = subjects.map((sub) => ({ value: sub, label: sub }));


  if (isLoading) {
    return (
      <div className="ats-loading-message">
        <div className="spinner"></div>
        Loading Form...
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
            <FaCalendarPlus className="ats-title-icon" /> Create New Timetable Entry
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
                className={`ats-submit-message ${submitMessage.type === "success" ? "ats-submit-success" : "ats-submit-error"}`}
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
                onChange={handleInputChange}
                minDate={startOfDay(new Date())} // Minimum date is today
                required
              />

              {/* Faculty */}
              <MuiSelect
                label="Faculty"
                icon={FaUserTie}
                name="facultyId"
                value={formData.facultyId}
                onChange={handleInputChange}
                options={facultyOptions}
                required
              />

              {/* Student */}
              <MuiSelect
                label="Student"
                icon={FaUserGraduate}
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                options={studentOptions}
                required
              />

              {/* Subject (before Topic) */}
              <MuiSelect
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                options={subjectOptions} // Using the derived subjectOptions
                required
              />

              {/* Topic (depends on Subject) */}
              <MuiSelect
                label="Topic"
                icon={FaLightbulb}
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                options={filteredTopicOptions}
                required
                disabled={!formData.subject || filteredTopicOptions.length === 0}
              />

              {/* Time From */}
              <MuiTimePicker
                label="Time From"
                icon={FaClock}
                name="fromTime"
                value={formData.fromTime}
                onChange={handleTimeChange}
                minTime={minTimeForFromPicker} // Pass the dynamically calculated minTime
                required
              />

              {/* Time To */}
              <MuiTimePicker
                label="Time To"
                icon={FaClock}
                name="toTime"
                value={formData.toTime}
                onChange={handleTimeChange}
                // minTime for 'toTime' should be at least 'fromTime'
                minTime={formData.fromTime || startOfDay(new Date())}
                required
              />
            </div>

            <div className="add-student-button-group">
              <button
                type="submit"
                className="add-student-primary-button"
                disabled={isSubmitting}
              >
                <FaSave /> {isSubmitting ? "Scheduling..." : "Schedule Class"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/timetable")}
                className="add-student-secondary-button"
                disabled={isSubmitting}
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

export default AddTimetablePage;