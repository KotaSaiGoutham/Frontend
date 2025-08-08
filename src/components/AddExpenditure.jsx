import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  Button as MuiButton,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Typography,
} from "@mui/material";
import {
  FaPlusCircle,
  FaSave,
  FaTimesCircle,
  FaMoneyBillWave,
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import {
  MuiInput,
  MuiDatePicker,
} from "./customcomponents/MuiCustomFormFields";
import { useSelector, useDispatch } from "react-redux";
// Import both add and update actions
import { addExpenditure, updateExpenditure } from "../redux/actions";

const AddExpenditure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // --- Check for Edit Mode ---
  // Get the data passed from the previous page (ExpenditureDashboard)
  const expenditureToEdit = location.state?.expenditureToEdit;
  // Create a boolean flag to easily check if we are updating
  const isUpdating = !!expenditureToEdit;

  // --- Component State ---
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    purpose: "",
    work: "",
    amount: "",
    date: new Date(),
  });

  const { user } = useSelector((state) => state.auth);

  // --- Effect to Pre-fill Form for Editing ---
  useEffect(() => {
    // If we are in "update" mode, set the form data with the existing record's values
    if (isUpdating && expenditureToEdit) {
      setFormData({
        purpose: expenditureToEdit.purpose || "",
        work: expenditureToEdit.work || "",
        amount: expenditureToEdit.amount || "",
        // Ensure date is a valid Date object
        date: expenditureToEdit.date
          ? new Date(expenditureToEdit.date)
          : new Date(),
      });
    }
  }, [isUpdating, expenditureToEdit]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleDateChange = (e) => {
  setFormData((prev) => ({ ...prev, date: e.target.value }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdating) {
      // Compare formData with existing data
      const hasChanged =
        formData.purpose !== expenditureToEdit.purpose ||
        formData.work !== expenditureToEdit.work ||
        Number(formData.amount) !== Number(expenditureToEdit.amount) ||
        new Date(formData.date).toISOString().slice(0, 10) !==
          new Date(expenditureToEdit.date).toISOString().slice(0, 10);

      if (!hasChanged) {
        setSnackbar({
          open: true,
          message: "No changes detected. Please modify before updating.",
          severity: "error",
        });
        return; // Stop further execution
      }
    }
    setLoading(true);

    const expenditurePayload = {
      ...formData,
      // Ensure amount is a number
      amount: Number(formData.amount),
      // Add the user's name for tracking who created/updated it
      lastModifiedBy: user.name,
    };

    try {
      if (isUpdating) {
        // --- UPDATE LOGIC ---
        // Dispatch update action with the record's ID and the new data
        await dispatch(
          updateExpenditure(expenditureToEdit.id, expenditurePayload)
        );
        setSnackbar({
          open: true,
          message: "Expenditure updated successfully!",
          severity: "success",
        });
      } else {
        // --- ADD LOGIC ---
        // Add the 'createdBy' field only when creating a new record
        const finalPayload = { ...expenditurePayload, createdBy: user.name };
        await dispatch(addExpenditure(finalPayload));
        setSnackbar({
          open: true,
          message: "Expenditure added successfully!",
          severity: "success",
        });
      }
      // Navigate back to the main list after a short delay
      setTimeout(() => navigate("/expenditure"), 1500);
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

  return (
    <div className="dashboard-container">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
        >
          {isUpdating ? <FaEdit /> : <FaPlusCircle />}
          {isUpdating ? "Update Expenditure" : "Add New Expenditure"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="add-student-form-grid">
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
            >
              {loading
                ? isUpdating
                  ? "Updating..."
                  : "Saving..."
                : isUpdating
                ? "Update Expenditure"
                : "Save Expenditure"}
            </MuiButton>
            <MuiButton
              variant="outlined"
              onClick={() => navigate("/expenditure")}
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
            ...(snackbar.severity === "success" && { color: "#fff" }), // White text for success
          }}
        >
          {" "}
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AddExpenditure;
