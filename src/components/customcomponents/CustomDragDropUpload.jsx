import React from "react";
import {
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { FaUpload } from "react-icons/fa";

const CustomDragDropUpload = ({
  title,
  children,
  error = null,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FaUpload />
        {title}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Custom form fields passed as children */}
        {children}
      </Box>
    </Paper>
  );
};

export default CustomDragDropUpload;