import React, { useState, useEffect } from 'react'; // Added useEffect for token retrieval example
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus, FaUserCircle, FaTransgender, FaPhone, FaEnvelope, FaBookOpen,
    FaDollarSign, FaCreditCard, FaGraduationCap, FaUniversity, FaUsers,
    FaSearchDollar, FaCalendarAlt, FaLayerGroup, FaPlus, FaTimesCircle, FaCheckCircle
} from 'react-icons/fa';

import './AddStudent.css';

const AddStudent = () => {
    const navigate = useNavigate();

    // Initial state for the new student form
    const initialStudentData = {
        Name: '',
        Gender: '',
        DOB: '',
        ContactNumber: '',
        Email: '',
        Subject: '',
        "Monthly Fee": '',
        "Payment Status": 'Unpaid',
        Stream: '',
        College: '',
        "Group ": '',
        Source: '',
        "Class ": '',
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prevData => ({
            ...prevData,
            [name]: value
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

    return (
        <div className="add-student-page-container dashboard-container">
            <div className="dashboard-card add-student-form-card">
                <div className="add-student-header-flex">
                    <h2><FaUserPlus /> Add New Student</h2>
                </div>

                {successMessage && (
                    <div className="add-student-success-message">
                        <FaCheckCircle /> {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="add-student-form">
                    {/* ... (rest of your form fields) ... */}
                    {/* Basic Information */}
                    <div className="add-student-form-section-title">Personal Details</div>
                    <div className="add-student-form-grid">
                        <div className="add-student-form-group">
                            <label htmlFor="Name"><FaUserCircle /> Student Name</label>
                            <input
                                type="text"
                                id="Name"
                                name="Name"
                                value={studentData.Name}
                                onChange={handleChange}
                                placeholder="Enter student's full name"
                                required
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Gender"><FaTransgender /> Gender</label>
                            <select
                                id="Gender"
                                name="Gender"
                                value={studentData.Gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="DOB"><FaCalendarAlt /> Date of Birth</label>
                            <input
                                type="date"
                                id="DOB"
                                name="DOB"
                                value={studentData.DOB}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="ContactNumber"><FaPhone /> Contact Number</label>
                            <input
                                type="tel"
                                id="ContactNumber"
                                name="ContactNumber"
                                value={studentData.ContactNumber}
                                onChange={handleChange}
                                placeholder="e.g., +919876543210"
                                required
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Email"><FaEnvelope /> Email</label>
                            <input
                                type="email"
                                id="Email"
                                name="Email"
                                value={studentData.Email}
                                onChange={handleChange}
                                placeholder="Enter student's email"
                            />
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="add-student-form-section-title">Academic Details</div>
                    <div className="add-student-form-grid">
                        <div className="add-student-form-group">
                            <label htmlFor="Subject"><FaBookOpen /> Primary Subject</label>
                            <input
                                type="text"
                                id="Subject"
                                name="Subject"
                                value={studentData.Subject}
                                onChange={handleChange}
                                placeholder="e.g., Physics, Maths"
                                required
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Class "><FaLayerGroup /> Class / Grade</label>
                            <input
                                type="text"
                                id="Class "
                                name="Class "
                                value={studentData["Class "]}
                                onChange={handleChange}
                                placeholder="e.g., 8th, 12th, PUC-I"
                                required
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Stream"><FaGraduationCap /> Stream</label>
                            <select
                                id="Stream"
                                name="Stream"
                                value={studentData.Stream}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Stream</option>
                                <option value="JEE">JEE</option>
                                <option value="NEET">NEET</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts">Arts</option>
                                <option value="Science">Science</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="College"><FaUniversity /> College/School</label>
                            <input
                                type="text"
                                id="College"
                                name="College"
                                value={studentData.College}
                                onChange={handleChange}
                                placeholder="Enter college/school name"
                                required
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Group "><FaUsers /> Group</label>
                            <input
                                type="text"
                                id="Group "
                                name="Group "
                                value={studentData["Group "]}
                                onChange={handleChange}
                                placeholder="e.g., MPC, BiPC, CEC"
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Year"><FaCalendarAlt /> Year</label>
                            <input
                                type="text"
                                id="Year"
                                name="Year"
                                value={studentData.Year}
                                onChange={handleChange}
                                placeholder="e.g., 1st Year, 2nd Year"
                            />
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="add-student-form-section-title">Financial Details</div>
                    <div className="add-student-form-grid">
                        <div className="add-student-form-group">
                            <label htmlFor="Monthly Fee"><FaDollarSign /> Monthly Fee (₹)</label>
                            <input
                                type="number"
                                id="Monthly Fee"
                                name="Monthly Fee"
                                value={studentData["Monthly Fee"]}
                                onChange={handleChange}
                                placeholder="Enter monthly fee"
                                min="0"
                                required
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Payment Status"><FaCreditCard /> Payment Status</label>
                            <select
                                id="Payment Status"
                                name="Payment Status"
                                value={studentData["Payment Status"]}
                                onChange={handleChange}
                                required
                            >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="Source"><FaSearchDollar /> Source</label>
                            <select
                                id="Source"
                                name="Source"
                                value={studentData.Source}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Source</option>
                                <option value="Urban Pro">Urban Pro</option>
                                <option value="Reference">Reference</option>
                                <option value="Online Ad">Online Ad</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Walk-in">Walk-in</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="add-student-button-group">
                        <button type="submit" className="add-student-primary-button">
                            <FaPlus /> Add Student
                        </button>
                        <button type="button" onClick={() => navigate('/students')} className="add-student-secondary-button">
                            <FaTimesCircle /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;