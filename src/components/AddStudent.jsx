import React, { useState, useEffect } from "react"; // Added useEffect for token retrieval example
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaUserCircle,
  FaTransgender,
  FaPhone,
  FaEnvelope,
  FaBookOpen,
  FaDollarSign,
  FaCreditCard,
  FaGraduationCap,
  FaUniversity,
  FaUsers,
  FaSearchDollar,
  FaCalendarAlt,
  FaLayerGroup,
  FaPlus,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
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
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { addStudent } from "../redux/actions";
const AddStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function
  const { user } = useSelector((state) => state.auth);

  // Initial state for the new student form
  const initialStudentData = {
    Name: "",
    Gender: "",
    ContactNumber: "",
    Subject: user.isPhysics ? "Physics": user.isChemistry?"Chemistry":"",
    "Monthly Fee": "",
    "Payment Status": "Unpaid",
    Stream: "",
    College: "",
    "Group ": "",
    Source: "",
    Year: "",
  };

  const [studentData, setStudentData] = useState(initialStudentData);
  const [successMessage, setSuccessMessage] = useState(null);
  const [token, setToken] = useState(null); // State to store the authentication token
const { 
        addingStudent, 
        addStudentSuccess, 
        addStudentError 
    } = useSelector(state => state.students); // Assuming 'students' is the key for studentReducer in rootReducer
useEffect(() => {
        if (addStudentSuccess) {
            // Only show alert/message if a successful payload is received
            console.log("Student added successfully (from Redux state):", addStudentSuccess);
            alert("1 student added successfully!"); // Use alert or a more sophisticated UI notification
            setStudentData(initialStudentData); // Clear the form

            // Optionally, clear the success state in Redux after showing the message
            // This prevents the alert from showing again if the component re-renders
            // You would need a new action type and case in reducer for this, e.g., CLEAR_ADD_STUDENT_SUCCESS
            // dispatch({ type: 'CLEAR_ADD_STUDENT_SUCCESS' }); 
            
            // If you want to automatically refresh the list of all students after adding one:
            // dispatch(fetchStudents()); 
        }

        if (addStudentError) {
            console.error("Error adding student (from Redux state):", addStudentError);
            alert(`Error adding student: ${addStudentError}`);

            // Check if the error indicates authentication failure
            if (addStudentError.includes("Authentication failed") || addStudentError.includes("Session expired")) {
                // Dispatching SET_AUTH_ERROR again might be redundant if middleware already did it,
                // but ensures the auth state is correctly marked.
                navigate('/login'); // Redirect to login on auth failure
            }
        }
    }, [addStudentSuccess, addStudentError, navigate, dispatch]); // Dependencies
  // Handle input changes
  // Assuming studentData is your state object, e.g., const [studentData, setStudentData] = useState({});
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
  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSuccessMessage(null); // This local state is no longer needed
    console.log("Attempting to add student with data:", studentData);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in.");
      dispatch({
        type: SET_AUTH_ERROR,
        payload: "Authentication required. Please log in.",
      }); // Set auth error in Redux
      navigate("/login"); // Redirect to login if no token
      return;
    }

    // --- THE ONLY API CALL YOU NEED HERE IS THE DISPATCH ---
    // The try-catch block for the API call is now inside the Redux middleware/action.
    // The .then/.catch of the promise returned by dispatch(addStudent(studentData))
    // could be used for specific local component logic if needed,
    // but for general feedback, useEffect watching the store is cleaner.
    dispatch(addStudent(studentData));
  };
  // Options for your select fields

const showSubjectColumn = user?.AllowAll;
  return (
    <div className="add-student-page-container dashboard-container">
      <div className="dashboard-card add-student-form-card">
        {successMessage && (
          <div className="add-student-success-message">
            <FaCheckCircle /> {successMessage}
          </div>
        )}
        <h2>
          <FaUserPlus /> Add New Student
        </h2>{" "}
        <form onSubmit={handleSubmit} className="add-student-form">
          {/* Basic Information */}
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

            {/* Contact Number */}
            <MuiInput
              label="Contact Number"
              icon={FaPhone}
              name="ContactNumber"
              value={studentData.ContactNumber}
              onChange={handleChange}
              placeholder="e.g., +919876543210"
              type="tel"
              required
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
              name="Group " // Keep the space if your backend expects it
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
              options={sourceOptions}
              required
            />
          </div>

          <div className="add-student-button-group">
            <button type="submit" className="add-student-primary-button">
              <FaPlus /> Add Student
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
                {/* Displaying feedback directly from Redux state */}
            {/* You can use conditional rendering for messages based on the Redux state */}
            {addStudentSuccess && <p className="success-message">Student added successfully!</p>}
            {addStudentError && <p className="error-message">{addStudentError}</p>}
      </div>
    </div>
  );
};

export default AddStudent;
