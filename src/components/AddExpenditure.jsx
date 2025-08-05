import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper, Button as MuiButton, CircularProgress, Snackbar, Alert as MuiAlert
} from "@mui/material";
import { FaPlusCircle, FaSave, FaTimesCircle, FaMoneyBillWave, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { MuiInput ,MuiDatePicker} from "./customcomponents/MuiCustomFormFields"

// Replace with your actual API call function
// import { addExpenditure } from '../api/expenditureApi'; 

const AddExpenditure = () => {
  const navigate = useNavigate();
  // In a real app, you would use your Redux state and dispatch actions
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    purpose: "",
    work: "",
    amount: "",
    date: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (newDate) => {
    setFormData((prev) => ({...prev, date: newDate}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // **REPLACE WITH YOUR API/REDUX ACTION**
      // await addExpenditure(formData);
      console.log("Submitting:", formData); // Mock submission

      setSnackbar({ open: true, message: "Expenditure added successfully!", severity: "success" });
      setTimeout(() => navigate("/expenditures"), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to add expenditure.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <h2><FaPlusCircle /> Add New Expenditure</h2>
        <form onSubmit={handleSubmit}>
          <div className="add-student-form-grid" /* Reusing your CSS class */ >
            <MuiInput
              label="Purpose"
              name="purpose"
              icon={FaMoneyBillWave}
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Office Rent, Software"
              required
            />
            <MuiInput
              label="Work/Details"
              name="work"
              icon={FaBriefcase}
              value={formData.work}
              onChange={handleChange}
              placeholder="e.g., Monthly Rent, Zoom Subscription"
            />
            <MuiInput
              label="Amount (INR)"
              name="amount"
              type="number"
              icon={() => "₹"}
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 15000"
              required
            />
             <MuiDatePicker
                label="Date of Payment"
                icon={FaCalendarAlt}
                value={formData.date}
                onChange={handleDateChange}
                required
             />
          </div>
          <div className="add-student-button-group" /* Reusing your CSS class */ >
            <MuiButton
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
            >
              {loading ? "Saving..." : "Save Expenditure"}
            </MuiButton>
            <MuiButton
              variant="outlined"
              onClick={() => navigate("/expenditures")}
              startIcon={<FaTimesCircle />}
            >
              Cancel
            </MuiButton>
          </div>
        </form>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <MuiAlert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AddExpenditure;