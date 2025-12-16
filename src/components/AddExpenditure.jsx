import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
Paper,
  Button as MuiButton,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Typography,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
FaPlusCircle,
  FaSave,
  FaTimesCircle,
  FaMoneyBillWave,
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaBuilding,
  FaUser,
} from "react-icons/fa";
import {
  MuiInput,
  MuiDatePicker,
} from "./customcomponents/MuiCustomFormFields";
import { useSelector, useDispatch } from "react-redux";
import { addExpenditure, updateExpenditure } from "../redux/actions";

const AddExpenditure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // --- Check for Edit Mode ---
  const expenditureToEdit = location.state?.expenditureToEdit;
  const isUpdating = !!expenditureToEdit;

  // --- Check if it's a company expense ---
  const isCompanyExpense = location.state?.isCompanyExpense || false;
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
const [selectedPayee, setSelectedPayee] = useState(
    isCompanyExpense ? "OTHER" : ""
  );
  const { user } = useSelector((state) => state.auth);
const { employees } = useSelector((state) => state.employees);
useEffect(() => {
    if (isUpdating && expenditureToEdit) {
      setFormData({
        purpose: expenditureToEdit.purpose || "",
        work: expenditureToEdit.work || "",
        amount: expenditureToEdit.amount || "",
        date: expenditureToEdit.date
          ? new Date(expenditureToEdit.date)
          : new Date(),
        employeeId: expenditureToEdit.employeeId || null,
      });

      // If updating a company expense, set the dropdown correctly
      if (isCompanyExpense) {
        if (expenditureToEdit.employeeId) {
          setSelectedPayee(expenditureToEdit.employeeId);
        } else {
          setSelectedPayee("OTHER");
        }
      }
    }
  }, [isUpdating, expenditureToEdit, isCompanyExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dateValue) => {
    setFormData((prev) => ({ ...prev, date: dateValue }));
  };
  const handlePayeeChange = (e) => {
    const value = e.target.value;
    setSelectedPayee(value);

    if (value === "OTHER") {
      // Reset purpose to allow manual entry, remove employeeId
      setFormData((prev) => ({
        ...prev,
        purpose: "",
        employeeId: null,
      }));
    } else {
      // Find the employee to get the name
      const selectedEmp = employees.find((emp) => emp.id === value);
      if (selectedEmp) {
        setFormData((prev) => ({
          ...prev,
          purpose: selectedEmp.name, // Set Name as Purpose
          employeeId: selectedEmp.id, // Store ID
        }));
      }
    }
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
          new Date(expenditureToEdit.date).toISOString().slice(0, 10) ||
        formData.employeeId !== expenditureToEdit.employeeId;

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

    const expenditurePayload = {
      ...formData,
      amount: Number(formData.amount),
      lastModifiedBy: user.subject,
      isCompanyExpense: isCompanyExpense,
    };

    try {
      if (isUpdating) {
        await dispatch(
          updateExpenditure(expenditureToEdit.id, expenditurePayload)
        );
        setSnackbar({
          open: true,
          message: "Expenditure updated successfully!",
          severity: "success",
        });
      } else {
        const finalPayload = {
          ...expenditurePayload,
          createdBy: user.subject,
        };
        await dispatch(addExpenditure(finalPayload));
        setSnackbar({
          open: true,
          message: `Expenditure ${
            isCompanyExpense ? "(Company Expense) " : ""
          }added successfully!`,
          severity: "success",
        });
      }

      if (isCompanyExpense) {
        setTimeout(() => navigate("/academy-finance-dashboard"), 1500);
      } else {
        setTimeout(() => navigate("/expenditure"), 1500);
      }
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

  // Determine where to navigate back based on where we came from
  const handleCancel = () => {
    if (isCompanyExpense) {
      navigate("/academy-finance"); // Navigate back to academy finance dashboard
    } else {
      navigate("/expenditure"); // Navigate back to regular expenditure page
    }
  };

  return (
    <div className="dashboard-container">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            {isUpdating ? <FaEdit /> : <FaPlusCircle />}
            {isUpdating ? "Update Expenditure" : "Add New Expenditure"}
          </Typography>

          {/* Show company expense badge if applicable */}
          {isCompanyExpense && !isUpdating && (
            <Chip
              icon={<FaBuilding />}
              label="Company Expense"
              color="primary"
              variant="filled"
              sx={{ fontWeight: "bold" }}
            />
          )}
        </Box>

        <form onSubmit={handleSubmit}>
          <div className="add-student-form-grid">
            {isCompanyExpense && (
              <FormControl fullWidth required>
                <InputLabel id="payee-select-label">Payee / Type</InputLabel>
                <Select
                  labelId="payee-select-label"
                  value={selectedPayee}
                  label="Payee / Type"
                  onChange={handlePayeeChange}
                  startAdornment={
                    <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                      <FaUser color="#666" />
                    </Box>
                  }
                >
                  <MenuItem value="OTHER">
                    <em>Other (Enter Purpose Manually)</em>
                  </MenuItem>
                  {employees &&
                    employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
      {(!isCompanyExpense || selectedPayee === "OTHER") && (
              <MuiInput
                label="Purpose"
                name="purpose"
                icon={FaMoneyBillWave}
                value={formData.purpose}
                onChange={handleChange}
                placeholder="e.g., Office Rent, Software, Staff Salary"
                required
              />
            )}

            {/* Read-only field to show selected employee name if an employee is selected */}
            {isCompanyExpense && selectedPayee !== "OTHER" && (
              <MuiInput
                label="Purpose (Auto-filled)"
                name="purpose"
                icon={FaUser}
                value={formData.purpose}
                disabled={true} // Read only
              />
            )}
            <MuiInput
              label="Work/Details"
              name="work"
              icon={FaBriefcase}
              value={formData.work}
              onChange={handleChange}
              placeholder="e.g., Monthly Rent, Zoom Subscription, Marketing"
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
                : `Save ${isCompanyExpense ? "Company " : ""}Expenditure`}
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

export default AddExpenditure;
