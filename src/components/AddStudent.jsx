import React, { useState, useEffect, useRef } from "react"; // Added useRef
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
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import {
  MuiInput,
  MuiSelect,
  MuiDatePicker,
} from "./customcomponents/MuiCustomFormFields";
import "./AddStudent.css";
import {
  streamOptions,
  paymentStatusOptions,
  genderOptions,
  sourceOptions,
} from "../mockdata/Options";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, clearAddStudentStatus } from "../redux/actions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { state } = useLocation();
  const passedStudentData = state?.studentData;
  console.log("passedStudentData",passedStudentData)

  // Using useRef to store initialStudentData so it doesn't cause useEffect re-renders
  // if it's passed as a dependency, and its reference changes.
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
  });

  const [studentData, setStudentData] = useState(initialStudentData.current);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // We no longer directly watch addStudentSuccess/addStudentError here
  // because we will handle the promise resolution in handleSubmit.
  // However, we still need `addingStudent` to disable the button.
  const { addingStudent } = useSelector((state) => state.students);
  const isEditMode = !!studentData.id;

  useEffect(() => {
  if (passedStudentData) {
    const mappedData = {
      id: passedStudentData.id,
      Name: passedStudentData.studentName || "",
      ContactNumber: passedStudentData.contactNo || "",
      Gender: passedStudentData.gender || "",
      Stream: passedStudentData.course || "",
      College: passedStudentData.collegeName || "",
      Source: passedStudentData.source || "",
      Year: passedStudentData.year || "",
      "Monthly Fee": "", // fill this if available
      "Payment Status": "Unpaid", // or map from passedStudentData
      "Group ": passedStudentData.course === "JEE" ? "MPC" :
                passedStudentData.course === "NEET" ? "BiPC" : "",
      MotherContactNumber: "",
      FatherContactNumber: "",
    Subject: user.isPhysics ? "Physics" : user.isChemistry ? "Chemistry" : "",
    };

    initialStudentData.current = mappedData;
    setStudentData(mappedData);
  }
}, [passedStudentData, user]);
console.log("studentdata",studentData)

  // Cleanup only for the snackbar state on unmount
  useEffect(() => {
    // This cleanup runs when the component unmounts
    return () => {
      setSnackbarOpen(false); // Close snackbar
      setSnackbarMessage(""); // Clear message
      // Ensure Redux state is also cleared on unmount
      dispatch(clearAddStudentStatus());
    };
  }, [dispatch]); // Dependency on dispatch to ensure cleanup always has it

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
        } else if (value === "") {
          newData["Group "] = "BiPC";
        } else {
          newData["Group "] = "";
        }
      }
      return newData;
    });
  };

  const handleDateChange = (name, dateString) => {
    setStudentData((prevData) => ({
      ...prevData,
      [name]: dateString,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbarOpen(false); // Close any existing snackbar before new submission
    setSnackbarMessage("");

    console.log("Attempting to add student with data:", studentData);

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
      // Dispatch the action and await its resolution
      await dispatch(addStudent(studentData));

      // If the dispatch above resolves (i.e., ADD_STUDENT_SUCCESS was dispatched)
      setSnackbarSeverity("success");
      setSnackbarMessage("Student added successfully!");
      setSnackbarOpen(true);

      setStudentData(initialStudentData.current); // Clear the form

      // Wait a bit, then navigate
      setTimeout(() => {
        navigate("/students");
      }, 2500); // Navigate 2.5 seconds after success
    } catch (error) {
      // If the dispatch above rejects (i.e., ADD_STUDENT_FAILURE was dispatched)
      // The error object here will be the payload from the rejected promise in the action.
      let errorMessage = "An unknown error occurred.";
      if (typeof error === "string") {
        errorMessage = error; // If the action rejected with a string message
      } else if (error && error.message) {
        errorMessage = error.message; // If the action rejected with an Error object
      }

      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      console.error(
        "Error during student submission (caught in component):",
        error
      );

      // Special handling for authentication errors, as before
      if (
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("Session expired") ||
        (error && (error.status === 401 || error.status === 403)) // If the error object has status
      ) {
        dispatch({
          type: "SET_AUTH_ERROR", // Ensure this is correctly imported/defined
          payload: errorMessage,
        });
        navigate("/login");
      }
    }
    // We don't need to manually clear addStudentStatus here
    // because the action already does it on request or success/failure.
    // The main cleanup is on component unmount in useEffect.
  };

  const showSubjectColumn = user?.AllowAll;

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
            {/* Student Name */}
            <MuiInput
              label="Student Name"
              icon={FaUserCircle}
              name="Name"
              value={studentData.Name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              required
            />

            {/* Gender */}
            <MuiSelect
              label="Gender"
              icon={FaTransgender}
              name="Gender"
              value={studentData.Gender}
              onChange={handleChange}
              options={genderOptions}
              required
            />

            {/* Student's Contact Number (Now optional) */}
            <MuiInput
              label="Student Contact Number"
              icon={FaPhone}
              name="ContactNumber"
              value={studentData.ContactNumber}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
            />

            {/* Mother's Contact Number (New and optional) */}
            <MuiInput
              label="Mother Contact Number"
              icon={FaPhone}
              name="MotherContactNumber"
              value={studentData.MotherContactNumber}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
            />

            {/* Father's Contact Number (New and optional) */}
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
            {/* Primary Subject */}
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

            {/* Stream */}
            <MuiSelect
              label="Stream"
              icon={FaGraduationCap}
              name="Stream"
              value={studentData.Stream}
              onChange={handleChange}
              options={streamOptions}
              required
            />

            {/* College/School */}
            <MuiInput
              label="College/School"
              icon={FaUniversity}
              name="College"
              value={studentData.College}
              onChange={handleChange}
              placeholder="Enter college/school name"
              required
            />

            {/* Group */}
            <MuiInput
              label="Group"
              icon={FaUsers}
              name="Group "
              value={studentData["Group "]}
              onChange={handleChange}
              placeholder="e.g., MPC, BiPC, CEC"
            />

            {/* Year */}
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
            {/* Monthly Fee */}
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

            {/* Payment Status */}
            <MuiSelect
              label="Payment Status"
              icon={FaCreditCard}
              name="Payment Status"
              value={studentData["Payment Status"]}
              onChange={handleChange}
              options={paymentStatusOptions}
              required
            />

            {/* Source */}
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

          <div className="add-student-button-group">
            <button
              type="submit"
              className="add-student-primary-button"
              disabled={addingStudent}
            >
              <FaPlus /> {addingStudent ? "Adding Student..." : "Add Student"}
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
