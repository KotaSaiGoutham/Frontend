import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  Button as MuiButton,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  FaPlusCircle,
  FaSave,
  FaTimesCircle,
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
  FaEdit,
  FaBriefcase,
} from "react-icons/fa";
import {
  MuiInput,
  MuiDatePicker,
} from "./customcomponents/MuiCustomFormFields";
import { useSelector, useDispatch } from "react-redux";
import { addAcademyEarning } from "../redux/actions";

const AddAcademyEarning = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // --- Check for Edit Mode ---
  const earningToEdit = location.state?.earningToEdit;
  const isUpdating = !!earningToEdit;

  // --- Component State ---
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    tutorName: "",
    studentNames: "",
    purpose: "",
    work: "",
    amount: "",
    date: new Date(),
  });

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isUpdating && earningToEdit) {
      setFormData({
        tutorName: earningToEdit.tutorName || "",
        studentNames: earningToEdit.studentNames || "",
        purpose: earningToEdit.purpose || "",
        work: earningToEdit.work || "",
        amount: earningToEdit.amount || "",
        date: earningToEdit.date
          ? new Date(earningToEdit.date)
          : new Date(),
      });
    }
  }, [isUpdating, earningToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FIXED: Handle date change properly
  const handleDateChange = (dateValue) => {
    setFormData((prev) => ({ ...prev, date: dateValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isUpdating) {
      // Compare formData with existing data
      const hasChanged =
        formData.tutorName !== earningToEdit.tutorName ||
        formData.studentNames !== earningToEdit.studentNames ||
        formData.purpose !== earningToEdit.purpose ||
        formData.work !== earningToEdit.work ||
        Number(formData.amount) !== Number(earningToEdit.amount) ||
        new Date(formData.date).toISOString().slice(0, 10) !==
          new Date(earningToEdit.date).toISOString().slice(0, 10);

      if (!hasChanged) {
        setSnackbar({
          open: true,
          message: "No changes detected. Please modify before updating.",
          severity: "error",
        });
        return;
      }
    }
    
    setLoading(true);

    const earningPayload = {
      ...formData,
      amount: Number(formData.amount),
      lastModifiedBy: user.subject,
    };

    try {
      if (isUpdating) {
        // await dispatch(
        //   updateAcademyEarning(earningToEdit.id, earningPayload)
        // );
        // setSnackbar({
        //   open: true,
        //   message: "Academy earning updated successfully!",
        //   severity: "success",
        // });
      } else {
        const finalPayload = { 
          ...earningPayload, 
          createdBy: user.subject 
        };
        await dispatch(addAcademyEarning(finalPayload));
        setSnackbar({
          open: true,
          message: "Academy earning added successfully!",
          severity: "success",
        });
      }
      
      setTimeout(() => navigate("/academy-finance-dashboard"), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Operation failed.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/academy-finance-dashboard");
  };

  return (
    <div className="dashboard-container">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            {isUpdating ? <FaEdit /> : <FaPlusCircle />}
            {isUpdating ? "Update Academy Earning" : "Add New Academy Earning"}
          </Typography>
          
          {!isUpdating && (
            <Chip 
              icon={<FaChalkboardTeacher />}
              label="Academy Earning"
              color="success"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        
        <form onSubmit={handleSubmit}>
          <div className="add-student-form-grid">
            <MuiInput
              label="Tutor Name"
              name="tutorName"
              icon={FaChalkboardTeacher}
              value={formData.tutorName}
              onChange={handleChange}
              placeholder="e.g., Rajju Sir, Math Tutor"
              required
            />
            <MuiInput
              label="Student Names"
              name="studentNames"
              icon={FaUserGraduate}
              value={formData.studentNames}
              onChange={handleChange}
              placeholder="e.g., Student 1, Student 2"
            />
            <MuiInput
              label="Purpose"
              name="purpose"
              icon={FaMoneyBillWave}
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Monthly Tuition, Course Fee"
              required
            />
            <MuiInput
              label="Work/Details"
              name="work"
              icon={FaBriefcase}
              value={formData.work}
              onChange={handleChange}
              placeholder="e.g., Physics Classes, Math Course"
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
              onChange={handleDateChange} // Fixed: Now passing the date value directly
              required
            />
          </div>
          <div className="add-student-button-group">
            <MuiButton
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FaSave />
                )
              }
              sx={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #26a69a 0%, #00796b 100%)'
                }
              }}
            >
              {loading
                ? isUpdating
                  ? "Updating..."
                  : "Saving..."
                : isUpdating
                ? "Update Earning"
                : "Save Academy Earning"}
            </MuiButton>
            <MuiButton
              variant="outlined"
              onClick={handleCancel}
              startIcon={<FaTimesCircle />}
            >
              Cancel
            </MuiButton>
          </div>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            ...(snackbar.severity === "success" && { color: "#fff" }),
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AddAcademyEarning;