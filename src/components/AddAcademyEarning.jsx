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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
  FaCheckCircle,
  FaUser,
  FaDollarSign,
  FaCalendar,
  FaClipboardList,
} from "react-icons/fa";
import {
  MuiInput,
  MuiDatePicker,
} from "./customcomponents/MuiCustomFormFields";
import { useSelector, useDispatch } from "react-redux";
import { addAcademyEarning, updateAcademyEarning } from "../redux/actions";

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
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

  const handleDateChange = (dateValue) => {
    setFormData((prev) => ({ ...prev, date: dateValue }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.tutorName || !formData.purpose || !formData.amount) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields (Tutor Name, Purpose, Amount).",
        severity: "error",
      });
      return;
    }

    // Open confirmation dialog instead of submitting directly
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {


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
        setConfirmDialogOpen(false);
        return;
      }
    }
    
    setLoading(true);
    setConfirmDialogOpen(false); // Close dialog when starting API call

    // Ensure date is properly formatted
    const formattedDate = formData.date instanceof Date 
      ? formData.date.toISOString() 
      : new Date(formData.date).toISOString();

    const earningPayload = {
      ...formData,
      amount: Number(formData.amount),
      date: formattedDate,
      lastModifiedBy: user.subject,
    };


    try {
      if (isUpdating) {
        await dispatch(
          updateAcademyEarning(earningToEdit.id, earningPayload)
        );
        setSnackbar({
          open: true,
          message: "Academy earning updated successfully!",
          severity: "success",
        });
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
      console.error("Operation failed:", error);
      setSnackbar({
        open: true,
        message: error.message || "Operation failed.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
  };

  const handleCancel = () => {
    navigate("/academy-finance-dashboard");
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    return date instanceof Date 
      ? date.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        })
      : new Date(date).toLocaleDateString('en-IN', {
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric'
        });
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
          
          {isUpdating ? (
            <Chip 
              icon={<FaEdit />}
              label="Edit Mode"
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          ) : (
            <Chip 
              icon={<FaChalkboardTeacher />}
              label="Academy Earning"
              color="success"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        
        <form onSubmit={handleSubmitClick}>
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <FaCheckCircle style={{ color: '#4caf50' }} />
          {isUpdating ? 'Confirm Update' : 'Confirm Academy Earning'}
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2, fontWeight: 'bold' }}>
            Please review the details before {isUpdating ? 'updating' : 'adding'} this earning:
          </DialogContentText>
          
          <List dense sx={{ width: '100%' }}>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FaChalkboardTeacher size={16} color="#1976d2" />
              </ListItemIcon>
              <ListItemText 
                primary="Tutor Name" 
                secondary={formData.tutorName || 'Not provided'}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FaUserGraduate size={16} color="#1976d2" />
              </ListItemIcon>
              <ListItemText 
                primary="Student Names" 
                secondary={formData.studentNames || 'Not provided'}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FaClipboardList size={16} color="#1976d2" />
              </ListItemIcon>
              <ListItemText 
                primary="Purpose" 
                secondary={formData.purpose || 'Not provided'}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FaBriefcase size={16} color="#1976d2" />
              </ListItemIcon>
              <ListItemText 
                primary="Work/Details" 
                secondary={formData.work || 'Not provided'}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FaDollarSign size={16} color="#4caf50" />
              </ListItemIcon>
              <ListItemText 
                primary="Amount" 
                secondary={`₹${Number(formData.amount).toLocaleString('en-IN')}`}
                sx={{ 
                  '& .MuiListItemText-secondary': { 
                    color: '#4caf50', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  } 
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FaCalendar size={16} color="#1976d2" />
              </ListItemIcon>
              <ListItemText 
                primary="Date" 
                secondary={formatDisplayDate(formData.date)}
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#fffde7', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> This {isUpdating ? 'update will modify' : 'entry will be added to'} the academy earnings records.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <MuiButton 
            onClick={handleCancelConfirm}
            variant="outlined"
            startIcon={<FaTimesCircle />}
          >
            Cancel
          </MuiButton>
          <MuiButton 
            onClick={handleConfirmSubmit}
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FaCheckCircle />
              )
            }
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)'
              }
            }}
          >
            {loading ? 'Processing...' : (isUpdating ? 'Update' : 'Confirm')}
          </MuiButton>
        </DialogActions>
      </Dialog>

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