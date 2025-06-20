import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarPlus,
  FaUserTie,
  FaClock,
  FaBook,
  FaTasks,
  FaArrowLeft,
  FaSave,
  FaExclamationCircle,
} from "react-icons/fa";
import { format, parse } from "date-fns";
import "./AddTimetablePage.css"; // Make sure this path is correct!

const AddTimetablePage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
    const [students, setStudents] = useState([]);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    facultyId: "",
    fromHour: "09",
    fromMinute: "00",
    fromAmPm: "AM",
    toHour: "10",
    toMinute: "00",
    toAmPm: "AM",
    subject: "",
    topic: "",
    student: "",
  });
  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const subjects = [
    "Physics",
    "Chemistry",
    "Maths",
    "Biology",
    "Zoology",
    "English",
    "History",
    "Computer Science",
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // *** CRITICAL CORRECTION: Use the correct backend endpoint /api/employees ***
        const response = await fetch(
          "http://localhost:5000/api/data/empolyees",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employees.");
        }
        const data = await response.json();
        setEmployees(data);
        // Set a default faculty if available and not already set
        if (data.length > 0 && !formData.facultyId) {
          setFormData((prev) => ({ ...prev, facultyId: data[0].id }));
        }
        const studentsResponse = await fetch(
          "http://localhost:5000/api/data/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const studentsData = await studentsResponse.json();
        if (!studentsResponse.ok)
          throw new Error(studentsData.message || "Failed to fetch students.");
        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setSubmitMessage({
          type: "error",
          message: "Failed to load faculty list.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [navigate, formData.facultyId]); // Added formData.facultyId to dependency array for default selection logic

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Specific handling for time inputs to restrict to 2 digits and validate as numbers
    if (["fromHour", "fromMinute", "toHour", "toMinute"].includes(name)) {
      // Allow only digits and limit to 2 characters
      const cleanedValue = value.replace(/\D/g, "").slice(0, 2);

      // Basic validation for hours (1-12) and minutes (0-59)
      if (name.includes("Hour")) {
        const numValue = parseInt(cleanedValue, 10);
        if (
          cleanedValue !== "" &&
          (isNaN(numValue) || numValue < 1 || numValue > 12)
        ) {
          // Optionally, set an error or prevent update, but for now, just apply slice(0,2)
          // We'll rely on the main validateForm for strict numerical checks
        }
      } else if (name.includes("Minute")) {
        const numValue = parseInt(cleanedValue, 10);
        if (
          cleanedValue !== "" &&
          (isNaN(numValue) || numValue < 0 || numValue > 59)
        ) {
          // Same as above, rely on main validateForm for strict checks
        }
      }

      setFormData((prevData) => ({ ...prevData, [name]: cleanedValue }));
    } else {
      // For other inputs, update directly
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateForm = () => {
    const {
      date,
      facultyId,
      fromHour,
      fromMinute,
      fromAmPm,
      toHour,
      toMinute,
      toAmPm,
      subject,
      topic,
      student
    } = formData;
    if (
      !date ||
      !facultyId ||
      !fromHour ||
      !fromMinute ||
      !fromAmPm ||
      !toHour ||
      !toMinute ||
      !toAmPm ||
      !subject ||
      !topic||
            !student

    ) {
      setFormError("All fields are required.");
      return false;
    }

    // Additional numerical validation for time fields after input cleaning
    const numFromHour = parseInt(fromHour, 10);
    const numFromMinute = parseInt(fromMinute, 10);
    const numToHour = parseInt(toHour, 10);
    const numToMinute = parseInt(toMinute, 10);

    if (isNaN(numFromHour) || numFromHour < 1 || numFromHour > 12) {
      setFormError("Start hour must be between 1 and 12.");
      return false;
    }
    if (isNaN(numFromMinute) || numFromMinute < 0 || numFromMinute > 59) {
      setFormError("Start minute must be between 0 and 59.");
      return false;
    }
    if (isNaN(numToHour) || numToHour < 1 || numToHour > 12) {
      setFormError("End hour must be between 1 and 12.");
      return false;
    }
    if (isNaN(numToMinute) || numToMinute < 0 || numToMinute > 59) {
      setFormError("End minute must be between 0 and 59.");
      return false;
    }

    try {
      const parseTime = (hour, minute, ampm) => {
        let h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return h * 60 + m;
      };

      const fromMinutes = parseTime(numFromHour, numFromMinute, fromAmPm); // Use parsed numbers
      const toMinutes = parseTime(numToHour, numToMinute, toAmPm); // Use parsed numbers

      if (fromMinutes >= toMinutes) {
        setFormError("End time must be after start time.");
        return false;
      }
    } catch (e) {
      setFormError(
        "Invalid time format. Please enter valid numbers for hours and minutes."
      );
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
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

    // Ensure hour and minute are two digits
    const startTime = `${formData.fromHour.padStart(
      2,
      "0"
    )}:${formData.fromMinute.padStart(
      2,
      "0"
    )}${formData.fromAmPm.toLowerCase()}`;
    const endTime = `${formData.toHour.padStart(
      2,
      "0"
    )}:${formData.toMinute.padStart(2, "0")}${formData.toAmPm.toLowerCase()}`;
    const timeRange = `${startTime} to ${endTime}`;
    // --- START OF MODIFICATION ---
    // 1. Parse the date from 'yyyy-MM-dd' string (from input type="date") into a Date object
    const dateObject = parse(formData.date, "yyyy-MM-dd", new Date());

    // 2. Format the Date object into 'dd/MM/yyyy' string
    const formattedDate = format(dateObject, "dd/MM/yyyy");
    // --- END OF MODIFICATION ---
    console.log("formData",formData)
    const payload = {
      Day: formattedDate, // YYYY-MM-DD
      Faculty: facultyName,
      Subject: formData.subject,
      Time: timeRange,
      Topic: formData.topic,
      Student:formData.student
    };

    try {
      // *** Backend endpoint for adding timetable is /api/timetable (POST) ***
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
        // Reset form after successful submission
        date: format(new Date(), "yyyy-MM-dd"),
        facultyId: "", // Reset to empty or set a new default
        fromHour: "09",
        fromMinute: "00",
        fromAmPm: "AM",
        toHour: "10",
        toMinute: "00",
        toAmPm: "AM",
        subject: "",
        topic: "",
      });
      setTimeout(() => navigate("/timetable"), 1500); // Redirect after short delay
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

  if (isLoading) {
    return (
      <div className="ats-loading-message">
        {" "}
        {/* Updated class name */}
        <div className="spinner"></div>{" "}
        {/* Ensure .spinner is defined in a global CSS or TimetablePage.css */}
        Loading Form...
      </div>
    );
  }
const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="ats-page-container">
      {" "}
      {/* Updated class name */}
      <div className="ats-header-card">
        {" "}
        {/* Updated class name */}
        <button
          onClick={() => navigate("/timetable")}
          className="ats-back-button"
        >
          {" "}
          {/* Updated class name */}
          <FaArrowLeft /> Back to Timetable
        </button>
        <h1 className="ats-form-title">
          {" "}
          {/* Updated class name */}
          <FaCalendarPlus className="ats-title-icon" />{" "}
          {/* Updated class name */}
          Create New Timetable Entry
        </h1>
        <p className="ats-form-subtitle">
          Fill in the details for the new class.
        </p>{" "}
        {/* Updated class name */}
      </div>
      <div className="ats-form-card">
        {" "}
        {/* Updated class name */}
        <form onSubmit={handleSubmit} className="ats-timetable-form">
          {" "}
          {/* Updated class name */}
          {submitMessage.message && (
            <div className={`ats-form-message ${submitMessage.type}`}>
              {" "}
              {/* Updated class name */}
              {submitMessage.type === "error" && (
                <FaExclamationCircle className="ats-message-icon" />
              )}{" "}
              {/* Updated class name */}
              {submitMessage.message}
            </div>
          )}
          {formError && (
            <div className="ats-form-message error">
              {" "}
              {/* Updated class name */}
              <FaExclamationCircle className="ats-message-icon" />{" "}
              {/* Updated class name */}
              {formError}
            </div>
          )}
          <div className="ats-form-grid">
            {" "}
            {/* Updated class name */}
            <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>
            <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label htmlFor="Stream">Faculty:</label>
              <select
                id="facultyId"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Faculty</option>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No Faculty Available
                  </option>
                )}
              </select>
            </div>
                  <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label htmlFor="Stream">Student:</label>
              <select
                id="student"
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Student</option>
                {students.length > 0 ? (
                  students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.Name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No Faculty Available
                  </option>
                )}
              </select>
            </div>
            <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label>Time From:</label>
              <div className="ats-time-input-group">
                {" "}
                {/* Updated class name */}
                <input
                  type="number"
                  name="fromHour"
                  value={formData.fromHour}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
                <span>:</span>
                <input
                  type="number"
                  name="fromMinute"
                  value={formData.fromMinute}
                  onChange={handleInputChange}
                  min="0"
                  max="59"
                  step="15"
                  required
                />
                <select
                  name="fromAmPm"
                  value={formData.fromAmPm}
                  onChange={handleInputChange}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label>Time To:</label>
              <div className="ats-time-input-group">
                {" "}
                {/* Updated class name */}
                <input
                  type="number"
                  name="toHour"
                  value={formData.toHour}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
                <span>:</span>
                <input
                  type="number"
                  name="toMinute"
                  value={formData.toMinute}
                  onChange={handleInputChange}
                  min="0"
                  max="59"
                  step="15"
                  required
                />
                <select
                  name="toAmPm"
                  value={formData.toAmPm}
                  onChange={handleInputChange}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label htmlFor="Stream">Subject:</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-student-form-group">
              {" "}
              {/* Updated class name */}
              <label htmlFor="topic">Topic:</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Enter class topic"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="ats-submit-button"
            disabled={isSubmitting}
          >
            {" "}
            {/* Updated class name */}
            {isSubmitting ? (
              "Adding..."
            ) : (
              <>
                <FaSave /> Add Timetable Entry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTimetablePage;
