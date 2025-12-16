import React, { useState, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Grid,
  CircularProgress, Alert, Link
} from "@mui/material";
import { FaFileUpload, FaCheckCircle, FaFileDownload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { evaluateStudentPaper } from "../../redux/actions";

const EvaluationDialog = ({ open, onClose, paper, studentId }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [marksSecured, setMarksSecured] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checkedFile, setCheckedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!marksSecured || !maxMarks) {
      setError("Please enter both Marks Secured and Max Marks.");
      return;
    }
    if (Number(marksSecured) > Number(maxMarks)) {
      setError("Marks secured cannot be greater than Max Marks.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("marksSecured", marksSecured);
    formData.append("maxMarks", maxMarks);
    formData.append("feedback", feedback);
    formData.append("studentId", studentId); // Needed for notification and refresh
    
    if (checkedFile) {
      formData.append("file", checkedFile);
    }

    try {
      await dispatch(evaluateStudentPaper(paper.id, formData));
      setLoading(false);
      onClose();
      // Reset form
      setMarksSecured("");
      setMaxMarks("");
      setFeedback("");
      setCheckedFile(null);
    } catch (err) {
      setLoading(false);
      setError("Evaluation failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #eee" }}>
        Evaluate Answer Sheet
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Student Submission Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Student Submission:
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {paper?.studentSubmission?.fileName || "AnswerSheet.pdf"}
            </Typography>
            <Button 
              size="small" 
              startIcon={<FaFileDownload />} 
              onClick={() => window.open(paper?.studentSubmission?.fileUrl, "_blank")}
            >
              View
            </Button>
          </Box>
        </Box>

        {/* Marks Entry */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField
              label="Marks Secured"
              type="number"
              fullWidth
              value={marksSecured}
              onChange={(e) => setMarksSecured(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Max Marks"
              type="number"
              fullWidth
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              required
            />
          </Grid>
        </Grid>

        {/* Feedback */}
        <TextField
          label="Feedback / Remarks (Optional)"
          multiline
          rows={3}
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Upload Checked File */}
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setCheckedFile(e.target.files[0])}
            style={{ display: "none" }}
            accept=".pdf,.jpg,.png"
          />
          <Button
            variant="outlined"
            fullWidth
            startIcon={checkedFile ? <FaCheckCircle /> : <FaFileUpload />}
            onClick={() => fileInputRef.current?.click()}
            color={checkedFile ? "success" : "primary"}
            sx={{ height: 50, borderStyle: "dashed" }}
          >
            {checkedFile ? checkedFile.name : "Upload Evaluated Copy (Optional)"}
          </Button>
        </Box>

      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Submitting..." : "Submit Results"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvaluationDialog;