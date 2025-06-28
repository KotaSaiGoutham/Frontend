import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus, FaArrowLeft, FaCheckCircle,
    FaUserCircle, FaBuilding, FaWallet, FaMobileAlt, // Added FaMobileAlt for mobile number
    FaPlus, FaTimesCircle
} from 'react-icons/fa';

import './Employees.css';
import './AddStudent.css';
import { useSelector, useDispatch } from 'react-redux';
import { addEmployee } from '../redux/actions';

const AddEmployeePage = () => {
      const dispatch  = useDispatch()
    
    const navigate = useNavigate();
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        mobile: '',
        role: '',
        salary: '',
        lastPaid: '', // Will be sent as an empty string if not filled
        paid: false,
    });
        const { 
        addingEmployee, 
        addEmployeeSuccess, 
        addEmployeeError 
    } = useSelector(state => state.employees); // Assuming 'employees' is the key for employeeReducer in rootReducer
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation (keep this for immediate feedback)
        if (!newEmployee.name || !newEmployee.mobile || !newEmployee.role || !newEmployee.salary) {
            setError('Please fill in all required fields (Name, Mobile, Role, Monthly Salary).');
            setSuccessMessage('');
            return;
        }
        if (isNaN(parseFloat(newEmployee.salary)) || parseFloat(newEmployee.salary) <= 0) {
            setError('Monthly Salary must be a positive number.');
            setSuccessMessage('');
            return;
        }
        if (!/^\d{10}$/.test(newEmployee.mobile)) {
            setError('Mobile Number must be 10 digits.');
            setSuccessMessage('');
            return;
        }

        setIsSaving(true);
        setError('');
        setSuccessMessage('');

        const payload = {
            ...newEmployee,
            salary: parseFloat(newEmployee.salary), // Convert salary to number
        };

        try {
            // --- DISPATCH THE REDUX ACTION HERE ---
            // Await the dispatch if your `addEmployee` action returns a promise
            // which the `apiRequest` pattern in your middleware should do.
            await dispatch(addEmployee(payload));

            // No need for direct response checks or local state updates here.
            // The useEffect above will handle success/error messages and navigation
            // based on changes in Redux state (`addEmployeeSuccess`, `addEmployeeError`).

        } catch (err) {
            // This catch block would primarily handle errors from the dispatch itself
            // (e.g., if the action wasn't properly formed or middleware failed unexpectedly),
            // not typical API errors, as those are caught by the apiMiddleware
            // and reflected in the Redux store states.
            console.error("Unexpected error during addEmployee dispatch:", err);
            // Optionally, set a local error state if this catch is reached for unexpected issues
            // setError('An unexpected client-side error occurred.');
        } 
    };

    return (
        <div className="add-student-page-container dashboard-container">
            <div className="dashboard-card add-student-form-card">
                <div className="add-student-header-flex">
                    <button onClick={() => navigate('/employees')} className="back-button">
                        <FaArrowLeft /> Back
                    </button>
                    <h2><FaUserPlus /> Add New Employee</h2>
                </div>

                {error && (
                    <div className="add-student-error-message">
                        <FaTimesCircle /> {error}
                    </div>
                )}
                {successMessage && (
                    <div className="add-student-success-message">
                        <FaCheckCircle /> {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="add-student-form">
                    <div className="add-student-form-section-title">Employee Details</div>
                    <div className="add-student-form-grid">
                        <div className="add-student-form-group">
                            <label htmlFor="name"><FaUserCircle /> Employee Name</label>
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
                            <label htmlFor="mobile"><FaMobileAlt /> Mobile Number</label>
                            <input
                                type="tel" // Use type="tel" for mobile numbers
                                id="mobile"
                                name="mobile"
                                value={newEmployee.mobile}
                                onChange={handleInputChange}
                                placeholder="e.g., 9876543210"
                                required
                                maxLength="10" // Limit input to 10 characters
                            />
                        </div>
                        <div className="add-student-form-group">
                            <label htmlFor="role"><FaBuilding /> Role</label>
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
                            <label htmlFor="salary"><FaWallet /> Monthly Salary (₹)</label>
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

                    <div className="add-student-button-group">
                        <button type="submit" className="add-student-primary-button" disabled={isSaving}>
                            <FaPlus /> {addingEmployee   ? 'Adding Employee...' : 'Add Employee'}
                        </button>
                        <button type="button" onClick={() => navigate('/employees')} className="add-student-secondary-button">
                            <FaTimesCircle /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeePage;