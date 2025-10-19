// src/pages/AddEmployeePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaCheckCircle,
  FaUserCircle,
  FaBuilding,
  FaWallet,
  FaMobileAlt,
  FaPlus,
  FaTimesCircle,
} from "react-icons/fa";

// MUI Imports
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

import "./Employees.css";
import "./AddStudent.css";
import { useSelector, useDispatch } from "react-redux";
import { addEmployee } from "../redux/actions";

const AddEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    mobile: "",
    role: "",
    salary: "",
    lastPaid: "",
    paid: false,
    isPhysics: user?.isPhysics || false,
    isChemistry: user?.isChemistry || false,
    isDisplay: user?.AllowAll || false,
  });

  const { addingEmployee, addEmployeeSuccess, addEmployeeError } = useSelector(
    (state) => state.employees
  );

  // Keep local state ONLY for client-side validation errors 
  // and the success message that triggers redirection.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear validation error on input change
    setError("");

    if (name === "isDisplay") {
      setNewEmployee((prev) => ({
        ...prev,
        isDisplay: checked,
        // If 'For All' is checked, set both subjects to true and disable them
        isPhysics: checked ? true : prev.isPhysics,
        isChemistry: checked ? true : prev.isChemistry,
      }));
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCheckboxChange = (field) => (event) => {
    const checked = event.target.checked;
    
    if (field === "isDisplay") {
      setNewEmployee((prev) => ({
        ...prev,
        isDisplay: checked,
        // If 'For All' is checked, enforce both subjects as true
        isPhysics: checked ? true : prev.isPhysics,
        isChemistry: checked ? true : prev.isChemistry,
      }));
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        [field]: checked,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset local messages before validation/submission
    setError("");
    setSuccessMessage("");

    // Client-side validation
    if (
      !newEmployee.name ||
      !newEmployee.mobile ||
      !newEmployee.role ||
      !newEmployee.salary
    ) {
      setError(
        "Please fill in all required fields (Name, Mobile, Role, Monthly Salary)."
      );
      return;
    }
    if (
      isNaN(parseFloat(newEmployee.salary)) ||
      parseFloat(newEmployee.salary) <= 0
    ) {
      setError("Monthly Salary must be a positive number.");
      return;
    }
    if (!/^\d{10}$/.test(newEmployee.mobile)) {
      setError("Mobile Number must be 10 digits.");
      return;
    }

    const payload = {
      ...newEmployee,
      salary: parseFloat(newEmployee.salary),
      isPhysics: newEmployee.isPhysics || false,
      isChemistry: newEmployee.isChemistry || false,
      isDisplay: newEmployee.isDisplay || false,
    };

    try {
      // Dispatch the action. 'await' ensures we wait for success/failure from middleware.
      await dispatch(addEmployee(payload));
      
      // If successful, show local success message and navigate after 2.5 seconds
      // The Redux state (addEmployeeSuccess) will also be set.
      setSuccessMessage("Employee added successfully! Redirecting to employee list...");
      
      setTimeout(() => {
        navigate("/employees");
      }, 2500);
      
    } catch (err) {
      // If dispatch throws an unexpected error (not the API failure), log it.
      // The API failure is handled by the Redux middleware setting addEmployeeError.
      console.error("Unexpected error during addEmployee dispatch:", err);
      // Optional: Set a fallback error message if the Redux error state isn't sufficient.
    }
  };

  // Check for the most recent error state (local validation OR Redux API error)
  const displayError = error || (addEmployeeError ? `API Error: ${addEmployeeError}` : null);


  return (
    <div className="add-student-page-container dashboard-container">
      <div className="dashboard-card add-student-form-card">
        <div className="add-student-header-flex">
          <h2>
            <FaUserPlus /> Add New Employee
          </h2>
        </div>

        {/* Display Error Message (Local Validation OR Redux API Failure) */}
        {displayError && (
          <div className="add-student-error-message">
            <FaTimesCircle /> {displayError}
          </div>
        )}
        {/* Display Success Message (Local for redirection feedback) */}
        {successMessage && (
          <div className="add-student-success-message">
            <FaCheckCircle /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-student-form">
          <div className="add-student-form-section-title">Employee Details</div>
          <div className="add-student-form-grid">
            <div className="add-student-form-group">
              <label htmlFor="name">
                <FaUserCircle /> Employee Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                placeholder="Enter employee's full name"
                required
              />
            </div>
            <div className="add-student-form-group">
              <label htmlFor="mobile">
                <FaMobileAlt /> Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={newEmployee.mobile}
                onChange={handleInputChange}
                placeholder="e.g., 9876543210"
                required
                maxLength="10"
              />
            </div>
            <div className="add-student-form-group">
              <label htmlFor="role">
                <FaBuilding /> Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={newEmployee.role}
                onChange={handleInputChange}
                placeholder="e.g., Maths Teacher, HR Manager"
                required
              />
            </div>
            <div className="add-student-form-group">
              <label htmlFor="salary">
                <FaWallet /> Monthly Salary (₹)
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={newEmployee.salary}
                onChange={handleInputChange}
                placeholder="e.g., 50000"
                min="0"
                required
              />
            </div>
          </div>

          {/* Access Control Section */}
          <div className="add-student-form-section-title">Access Control</div>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newEmployee.isPhysics}
                  onChange={handleCheckboxChange("isPhysics")}
                  disabled={newEmployee.isDisplay} // Disabled if 'For All' is checked
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight="500">
                    Physics Faculty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visible to Physics faculty members
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={newEmployee.isChemistry}
                  onChange={handleCheckboxChange("isChemistry")}
                  disabled={newEmployee.isDisplay} // Disabled if 'For All' is checked
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight="500">
                    Chemistry Faculty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visible to Chemistry faculty members
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={newEmployee.isDisplay}
                  onChange={handleCheckboxChange("isDisplay")}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight="500">
                    For All
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visible to all users (overrides other settings)
                  </Typography>
                </Box>
              }
            />
          </Box>

          <div className="add-student-button-group">
            <button
              type="submit"
              className="add-student-primary-button"
              disabled={addingEmployee || !!successMessage} // Disable while adding or waiting for redirect
            >
              <FaPlus />{" "}
              {addingEmployee ? "Adding Employee..." : "Add Employee"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/employees")}
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

export default AddEmployeePage;