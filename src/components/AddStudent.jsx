import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUserPlus,
  FaUserCircle,
  FaTransgender,
  FaPhone,
  FaBookOpen,
  FaDollarSign,
  FaCreditCard,
  FaGraduationCap,
  FaUniversity,
  FaUsers,
  FaSearchDollar,
  FaCalendarAlt,
  FaPlus,
  FaTimesCircle,
  FaClock,
  FaTrash,
} from "react-icons/fa";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import for animations

import { MuiInput, MuiSelect } from "./customcomponents/MuiCustomFormFields";
import "./AddStudent.css";
import {
  streamOptions,
  paymentStatusOptions,
  genderOptions,
  sourceOptions,
  dayOptions,
} from "../mockdata/Options";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, clearAddStudentStatus,updateStudent } from "../redux/actions"; // Import updateStudent action

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { state } = useLocation();
  const passedStudentData = state?.studentData;
  console.log("state",state)

  const initialStudentData = useRef({
    Name: "",
    Gender: "",
    ContactNumber: "",
    MotherContactNumber: "",
    FatherContactNumber: "",
    Subject: user.isPhysics ? "Physics" : user.isChemistry ? "Chemistry" : "",
    "Monthly Fee": "",
    "Payment Status": "Unpaid",
    Stream: "",
    College: "",
    "Group ": "",
    Source: "",
    Year: "",
    classDateandTime: [],
    isActive: true,
  });

  const [studentData, setStudentData] = useState(initialStudentData.current);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [newTimeSlotDay, setNewTimeSlotDay] = useState("");
  const [newTimeSlotTime, setNewTimeSlotTime] = useState("");
  const [timeSlotError, setTimeSlotError] = useState("");

  const { addingStudent } = useSelector((state) => state.students);
  const isEditMode = !!studentData.id;

  useEffect(() => {
  if (passedStudentData) {
    const mappedData = {
      id: passedStudentData.id || "",
      Name: passedStudentData.Name || "",
      Gender: passedStudentData.Gender || "",
      ContactNumber: passedStudentData.ContactNumber || "",
      MotherContactNumber: passedStudentData.MotherContactNumber || "",
      FatherContactNumber: passedStudentData.FatherContactNumber || "",
      // This ensures the Subject from the student data is used,
      // but falls back to user permissions if it's not present.
      Subject: passedStudentData.Subject || (user.isPhysics ? "Physics" : user.isChemistry ? "Chemistry" : ""),
      "Monthly Fee": passedStudentData["Monthly Fee"] || "",
      "Payment Status": passedStudentData["Payment Status"] || "Unpaid",
      Stream: passedStudentData.Stream || "",
      College: passedStudentData.College || "",
      "Group ": passedStudentData["Group "] || "",
      Source: passedStudentData.Source || "",
      Year: passedStudentData.Year || "",
      classDateandTime: passedStudentData.classDateandTime || [],
      isActive:
        passedStudentData.isActive !== undefined
          ? passedStudentData.isActive
          : true,
    };

    initialStudentData.current = mappedData;
    setStudentData(mappedData);
  }
}, [passedStudentData, user]);

  useEffect(() => {
    return () => {
      setSnackbarOpen(false);
      setSnackbarMessage("");
      dispatch(clearAddStudentStatus());
    };
  }, [dispatch]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => {
      let newData = { ...prevData, [name]: value };
      if (name === "Stream") {
        if (value === "JEE") {
          newData["Group "] = "MPC";
        } else if (value === "NEET") {
          newData["Group "] = "BIPC";
        } else {
          newData["Group "] = "";
        }
      }
      return newData;
    });
  };

  const handleAddTimeSlot = () => {
    try {
      if (!newTimeSlotDay || !newTimeSlotTime) {
        setTimeSlotError("Please select both day and time.");
        return;
      }
      const timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)(am|pm)$/i;
      if (!timeRegex.test(newTimeSlotTime)) {
        setTimeSlotError(
          "Please enter time in HH:MMam/pm format (e.g., 04:00pm)."
        );
        return;
      }

      const newSlot = `${newTimeSlotDay}-${newTimeSlotTime.toLowerCase()}`;
      if (studentData.classDateandTime.includes(newSlot)) {
        setTimeSlotError("This time slot already exists.");
        return;
      }

      setStudentData((prevData) => ({
        ...prevData,
        classDateandTime: [...prevData.classDateandTime, newSlot],
      }));

      setNewTimeSlotDay("");
      setNewTimeSlotTime("");
      setTimeSlotError("");
    } catch (err) {
      console.error("Error adding time slot:", err);
      alert("Error adding time slot: " + err.message);
    }
  };

  const handleRemoveTimeSlot = (slotToRemove) => {
    setStudentData((prevData) => ({
      ...prevData,
      classDateandTime: prevData.classDateandTime.filter(
        (slot) => slot !== slotToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbarOpen(false);
    setSnackbarMessage("");

    // Validation for required fields
    if (
      !studentData.Name ||
      !studentData.Gender ||
      !studentData.College ||
      !studentData.Stream ||
      !studentData["Monthly Fee"] ||
      !studentData.Source
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Please fill in all required fields (Name, Gender, College/School, Stream, Monthly Fee, Source)."
      );
      setSnackbarOpen(true);
      return;
    }

    // Validation for time slots - at least one required for new student
    if (!isEditMode && studentData.classDateandTime.length === 0) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please add at least one class time slot.");
      setSnackbarOpen(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Authentication required. Please log in.");
      setSnackbarOpen(true);
      dispatch({
        type: "SET_AUTH_ERROR",
        payload: "Authentication required. Please log in.",
      });
      navigate("/login");
      return;
    }

    try {
      if (isEditMode) {
        // Dispatch the updateStudent action
        await dispatch(updateStudent(studentData.id, studentData));
        setSnackbarSeverity("success");
        setSnackbarMessage("Student updated successfully!");
      } else {
        const dataToSubmit = { ...studentData, isActive: true };
        await dispatch(addStudent(dataToSubmit));
        setSnackbarSeverity("success");
        setSnackbarMessage("Student added successfully!");
      }
      setSnackbarOpen(true);

      // Clear the form after a successful submission
      setStudentData(initialStudentData.current);
      setNewTimeSlotDay("");
      setNewTimeSlotTime("");

      setTimeout(() => {
        navigate("/students");
      }, 2500);
    } catch (error) {
      // Error handling remains the same
      let errorMessage = "An unknown error occurred.";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && error.message) {
        errorMessage = error.message;
      }

      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      console.error(
        "Error during student submission (caught in component):",
        error
      );

      if (
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("Session expired") ||
        (error && (error.status === 401 || error.status === 403))
      ) {
        dispatch({
          type: "SET_AUTH_ERROR",
          payload: errorMessage,
        });
        navigate("/login");
      }
    }
  };

  const showSubjectColumn = user?.AllowAll;
  const timeSlotRefs = useRef({});
  studentData.classDateandTime.forEach((slot, index) => {
    const key = `${slot}-${index}`;
    if (!timeSlotRefs.current[key]) {
      timeSlotRefs.current[key] = React.createRef();
    }
  });

  return (
    <div className="add-student-page-container dashboard-container">
      <div className="dashboard-card add-student-form-card">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaUserPlus />
          {isEditMode ? "Edit Student" : "Add New Student"}
        </h2>

        <form onSubmit={handleSubmit} className="add-student-form">
          {/* Personal Details */}
          <div className="add-student-form-section-title">Personal Details</div>
          <div className="add-student-form-grid">
            <MuiInput
              label="Student Name"
              icon={FaUserCircle}
              name="Name"
              value={studentData.Name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              required
            />
            <MuiSelect
              label="Gender"
              icon={FaTransgender}
              name="Gender"
              value={studentData.Gender}
              onChange={handleChange}
              options={genderOptions}
              required
            />
            <MuiInput
              label="Student Contact Number"
              icon={FaPhone}
              name="ContactNumber"
              value={studentData.ContactNumber}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
            />
            <MuiInput
              label="Mother Contact Number"
              icon={FaPhone}
              name="MotherContactNumber"
              value={studentData.MotherContactNumber}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
            />
            <MuiInput
              label="Father Contact Number"
              icon={FaPhone}
              name="FatherContactNumber"
              value={studentData.FatherContactNumber}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
            />
          </div>

          {/* Academic Information */}
          <div className="add-student-form-section-title">Academic Details</div>
          <div className="add-student-form-grid">
            {showSubjectColumn && (
              <MuiInput
                label="Primary Subject"
                icon={FaBookOpen}
                name="Subject"
                value={studentData.Subject}
                onChange={handleChange}
                placeholder="e.g., Physics, Maths"
                required
              />
            )}
            <MuiSelect
              label="Stream"
              icon={FaGraduationCap}
              name="Stream"
              value={studentData.Stream}
              onChange={handleChange}
              options={streamOptions}
              required
            />
            <MuiInput
              label="College/School"
              icon={FaUniversity}
              name="College"
              value={studentData.College}
              onChange={handleChange}
              placeholder="Enter college/school name"
              required
            />
            <MuiInput
              label="Group"
              icon={FaUsers}
              name="Group "
              value={studentData["Group "]}
              onChange={handleChange}
              placeholder="e.g., MPC, BiPC, CEC"
            />
            <MuiInput
              label="Year"
              icon={FaCalendarAlt}
              name="Year"
              value={studentData.Year}
              onChange={handleChange}
              placeholder="e.g., 1st Year, 2nd Year"
            />
          </div>

          {/* Financial Information */}
          <div className="add-student-form-section-title">
            Financial Details
          </div>
          <div className="add-student-form-grid">
            <MuiInput
              label="Monthly Fee (₹)"
              icon={FaDollarSign}
              name="Monthly Fee"
              value={studentData["Monthly Fee"]}
              onChange={handleChange}
              placeholder="Enter monthly fee"
              type="number"
              required
            />
            <MuiSelect
              label="Payment Status"
              icon={FaCreditCard}
              name="Payment Status"
              value={studentData["Payment Status"]}
              onChange={handleChange}
              options={paymentStatusOptions}
              required
            />
            <MuiSelect
              label="Source"
              icon={FaSearchDollar}
              name="Source"
              value={studentData.Source}
              onChange={handleChange}
              placeholder="How did they find us?"
              options={sourceOptions}
              required
            />
          </div>

          {/* Time Slot Section */}
          <div className="add-student-form-section-title">
            Classes Schedule
          </div>
          <div className="add-student-form-grid time-slot-inputs">
            <MuiSelect
              label="Day"
              icon={FaCalendarAlt}
              name="newTimeSlotDay"
              value={newTimeSlotDay}
              onChange={(e) => setNewTimeSlotDay(e.target.value)}
              options={dayOptions}
            />
            <MuiInput
              label="Time (HH:MMam/pm)"
              icon={FaClock}
              name="newTimeSlotTime"
              value={newTimeSlotTime}
              onChange={(e) => setNewTimeSlotTime(e.target.value)}
              placeholder="e.g., 04:00pm"
            />
            <div className="add-time-slot-button-container">
              <button
                type="button"
                className="add-student-primary-button"
                onClick={handleAddTimeSlot}
              >
                <FaPlus /> Add Slot
              </button>
            </div>
            {timeSlotError && (
              <p
                className="error-message-timeslot"
                style={{ gridColumn: "1 / -1" }}
              >
                {timeSlotError}
              </p>
            )}
          </div>

          <div className="current-time-slots-wrapper">
            {studentData.classDateandTime.length > 0 ? (
              <>
                <p className="current-slots-heading">Current Scheduled Slots:</p>
                <TransitionGroup component="ul" className="time-slot-list">
                  {studentData.classDateandTime.map((slot, index) => {
                    const key = `${slot}-${index}`;
                    const nodeRef = timeSlotRefs.current[key];

                    return (
                      <CSSTransition
                        key={key}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="time-slot-item-anim"
                      >
                        <li ref={nodeRef} className="time-slot-item">
                          <span>{slot}</span>
                          <FaTrash
                            className="delete-time-slot-icon"
                            onClick={() => handleRemoveTimeSlot(slot)}
                            title="Remove time slot"
                          />
                        </li>
                      </CSSTransition>
                    );
                  })}
                </TransitionGroup>
              </>
            ) : (
              <p className="info-message no-slots-message">
                No class slots added yet. Click "Add Slot" to schedule classes.
              </p>
            )}
          </div>

          <div className="add-student-button-group">
            <button
              type="submit"
              className="add-student-primary-button"
              disabled={addingStudent}
            >
              <FaPlus /> {addingStudent ? "Adding Student..." : isEditMode ? "Update Student" : "Add Student"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="add-student-secondary-button"
            >
              <FaTimesCircle /> Cancel
            </button>
          </div>
        </form>
        {addingStudent && <p className="info-message">Adding student...</p>}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddStudent;