import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  Typography
} from "@mui/material";
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MuiButton } from './MuiCustomFormFields'; // Assuming this is your custom Button component

/**
 * A reusable confirmation dialog component for class count changes.
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {string} props.studentName - The name of the student being updated.
 * @param {boolean} props.isIncreaseAction - A flag indicating if the action is an increase (true) or decrease (false).
 * @param {function} props.onConfirm - The function to call when the "OK" button is clicked.
 * @param {function} props.onCancel - The function to call when the "Cancel" button is clicked or the dialog is closed.
 */
export const ConfirmationDialog = ({
  open,
  studentName,
  isIncreaseAction,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Confirm Class Count Change
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description" sx={{ textAlign: 'center', mb: 2 }}>
          Are you sure you want to 
          <Box component="span" sx={{ color: isIncreaseAction ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
            {" "}{isIncreaseAction ? 'increase' : 'decrease'}{" "}
          </Box>
          the class count for 
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {" "}{studentName}
          </Box>
          ?
        </DialogContentText>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', fontStyle: 'italic', mt: 1 }}>
          Note: Increasing or decreasing classes may cause the student's position in the table to be rearranged. Please check once.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <MuiButton onClick={onCancel} color="error" >
          Cancel
        </MuiButton>
        <MuiButton onClick={onConfirm} color="primary" autoFocus >
          OK
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  data, // The data to display in the dialog
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "Confirm Delete"}</DialogTitle>
      <DialogContent>
        {message && <Typography>{message}</Typography>}
        {data && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
            }}
          >
            {/* Display a list of data properties, making it reusable */}
            {Object.entries(data).map(([key, value]) => (
              <Typography key={key}>
                <strong>{key}:</strong> {value}
              </Typography>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={onClose} color="inherit">
          Cancel
        </MuiButton>
        <MuiButton onClick={onConfirm} color="error" variant="contained">
          Delete
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};