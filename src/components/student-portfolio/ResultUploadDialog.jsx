import React, { useState, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, Paper, Alert
} from "@mui/material";
import { FaCloudUploadAlt, FaFilePdf, FaFileImage, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { uploadStudentResult } from "../../redux/actions";

const ResultUploadDialog = ({ open, onClose, paperId, studentId, studentName }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setErrorMsg("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setUploadLoading(true);
    // Standard FormData
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("studentId", studentId);
    formData.append("studentName", studentName);

    try {
      // Logic from your redux actions
      await dispatch(uploadStudentResult(paperId, formData));
      setUploadLoading(false);
      onClose(); 
      setSelectedFile(null); 
    } catch (err) {
      console.log("Upload Error:", err);
      setUploadLoading(false);
      setErrorMsg("Failed to upload. Please try again.");
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes("pdf")) return <FaFilePdf size={40} color="#f40f02" />;
    if (type?.includes("image")) return <FaFileImage size={40} color="#ff6b35" />;
    return <FaCloudUploadAlt size={40} color="#1976d2" />;
  };

  return (
    <Dialog open={open} onClose={!uploadLoading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>Upload Answer Sheet</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: "none" }}
        />

        {!selectedFile ? (
          <Paper
            variant="outlined"
            sx={{
              p: 5,
              textAlign: "center",
              cursor: "pointer",
              borderStyle: "dashed",
              borderColor: "primary.main",
              bgcolor: "#f9f9f9",
              transition: '0.2s',
              "&:hover": { bgcolor: "#f0f7ff", borderColor: '#1565c0' }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaCloudUploadAlt size={48} color="#9e9e9e" />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
              Click to Select Answer Sheet
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PDF or Images (Max 10MB)
            </Typography>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: '#e3f2fd', borderColor: '#90caf9' }}>
            <Box>{getFileIcon(selectedFile.type)}</Box>
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <Typography noWrap variant="subtitle1" fontWeight="bold">
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
            <Button color="error" onClick={() => setSelectedFile(null)} disabled={uploadLoading} sx={{ minWidth: 'auto', p: 1 }}>
              <FaTimes />
            </Button>
          </Paper>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={onClose} disabled={uploadLoading} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!selectedFile || uploadLoading}
          startIcon={uploadLoading && <CircularProgress size={20} color="inherit" />}
          sx={{ px: 3 }}
        >
          {uploadLoading ? "Uploading..." : "Submit Result"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultUploadDialog;