import React, { useState, useEffect } from 'react'; // Added useEffect for token retrieval example
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus, FaUserCircle, FaTransgender, FaPhone, FaEnvelope, FaBookOpen,
    FaDollarSign, FaCreditCard, FaGraduationCap, FaUniversity, FaUsers,
    FaSearchDollar, FaCalendarAlt, FaLayerGroup, FaPlus, FaTimesCircle, FaCheckCircle
} from 'react-icons/fa';
import { MuiInput, MuiSelect, MuiDatePicker } from './MuiCustomFormFields';
import './AddStudent.css';
import { streamOptions,paymentStatusOptions,genderOptions,sourceOptions  } from '../mockdata/Options';

const AddStudent = () => {
    const navigate = useNavigate();

    // Initial state for the new student form
    const initialStudentData = {
        Name: '',
        Gender: '',
        ContactNumber: '',
        Subject: '',
        "Monthly Fee": '',
        "Payment Status": 'Unpaid',
        Stream: '',
        College: '',
        "Group ": '',
        Source: '',
        Year: ''
    };

    const [studentData, setStudentData] = useState(initialStudentData);
    const [successMessage, setSuccessMessage] = useState(null);
    const [token, setToken] = useState(null); // State to store the authentication token

    // Example of how to get the token (replace with your actual token retrieval logic)
    useEffect(() => {
        // In a real app, you'd get this from localStorage, sessionStorage, or a context API
       const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        } else {
            // If no token, maybe redirect to login or show an error
            // navigate('/login');
            console.warn("No authentication token found. API calls might fail.");
        }
    }, []);

    // Handle input changes
  // Assuming studentData is your state object, e.g., const [studentData, setStudentData] = useState({});

const handleChange = (e) => {
    const { name, value } = e.target;

    setStudentData(prevData => {
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
        setSuccessMessage(null);
        console.log("Attempting to add student with data:", studentData);

        if (!token) {
            alert("Authentication required. Please log in.");
            navigate('/login'); // Redirect to login if no token
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/data/addStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- ADDED AUTHORIZATION HEADER HERE
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Check for specific error codes like 401 (Unauthorized) or 403 (Forbidden)
                if (response.status === 401 || response.status === 403) {
                    alert("Authentication failed or session expired. Please log in again.");
                    navigate('/login'); // Redirect to login on auth failure
                }
                throw new Error(errorData.message || `Failed to add student (Status: ${response.status}).`);
            }

            const result = await response.json();
            console.log("API Response:", result);

            setSuccessMessage("1 student added successfully!");
            setStudentData(initialStudentData); // Clear the form
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

        } catch (error) {
            console.error("Error adding student:", error.message);
            alert(`Error adding student: ${error.message}`);
        }
    };
 // Options for your select fields


    return (
         <div className="add-student-page-container dashboard-container">
            <div className="dashboard-card add-student-form-card">

                {successMessage && (
                    <div className="add-student-success-message">
                        <FaCheckCircle /> {successMessage}
                    </div>
                )}
      <h2><FaUserPlus /> Add New Student</h2>      <form onSubmit={handleSubmit} className="add-student-form">
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
          <MuiInput
            label="Primary Subject"
            icon={FaBookOpen}
            name="Subject"
            value={studentData.Subject}
            onChange={handleChange}
            placeholder="e.g., Physics, Maths"
            required
          />

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
        <div className="add-student-form-section-title">Financial Details</div>
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
          </div>

    </div>
    );
};

export default AddStudent;