import React from "react";
import {
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { FaUpload } from "react-icons/fa";

const CustomFileUpload = ({
  title,
  children,
  loading = false,
  error = null,
  onFileSelect,
  onSubmit,
  selectedFile,
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png",
  submitButtonText = "Upload File",
  showUploadButton = true // New prop to control upload button visibility
}) => {
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

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

      <form onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Custom form fields passed as children */}
          {children}

          {/* Only show file selection and upload button if showUploadButton is true */}
          {showUploadButton && (
            <>
              {/* File selection */}
              <Button
                variant="outlined"
                component="label"
                startIcon={<FaFileAlt />}
                fullWidth
              >
                Select File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept={accept}
                />
              </Button>

              {selectedFile && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {selectedFile.name}
                </Typography>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !selectedFile}
                startIcon={loading ? <CircularProgress size={20} /> : <FaUpload />}
                fullWidth
              >
                {loading ? "Uploading..." : submitButtonText}
              </Button>
            </>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default CustomFileUpload;