import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  FaFileAlt, FaDownload, FaCalendarAlt, FaClock, FaLock, FaUnlock, 
  FaEye, FaTimes, FaCloudUploadAlt, FaCheckCircle, FaHourglassHalf, 
  FaStar, FaClipboardCheck, FaFileSignature, FaPenNib
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper, Typography, Box, Button, Chip, CircularProgress,
  Alert, Card, CardContent, Dialog, DialogContent, DialogTitle,
  IconButton, Tooltip, Divider, LinearProgress
} from "@mui/material";
import DetailCard from "./components/DetailCard";
import QuestionPaperUpload from "../QuestionPaperUpload";
import ResultUploadDialog from "./ResultUploadDialog";
import EvaluationDialog from "./EvaluationDialog"; 
import { fetchQuestionPapers } from "../../redux/actions";

const StudentPapers = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  
  // Select data from the correct reducer (lectureMaterialsReducer)
  const { questionPapers, fetchingQuestionPapers, error } = useSelector((state) => state.lectureMaterials);
  const { students } = useSelector((state) => state.students);
  const currentStudent = students?.find(s => s.id === studentId);
  const { user } = useSelector((state) => state.auth);
  
  // --- DEV MODE: Set to 'admin' or 'tutor' to see both upload and evaluate buttons ---
  // In production, change this back to: const userRole = user?.role || "student";
  const userRole = "admin"; 

  const [timeUntilRefresh, setTimeUntilRefresh] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  
  // Dialog States
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [targetPaper, setTargetPaper] = useState(null); 

  // Initial Fetch
  useEffect(() => {
    if (studentId) {
      dispatch(fetchQuestionPapers(studentId));
    }
  }, [dispatch, studentId]);

  // Auto-refresh for upcoming papers
  useEffect(() => {
    if (questionPapers?.some(paper => paper.isUpcoming)) {
      const interval = setInterval(() => setTimeUntilRefresh(prev => prev + 1), 60000);
      return () => clearInterval(interval);
    }
  }, [questionPapers]);

  // --- Handlers ---
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(fileUrl, '_blank');
    }
  };

  const handlePreview = (paper, type = 'question') => {
    let fileData = {
      title: paper.title,
      fileUrl: paper.fileUrl,
      fileName: paper.fileName,
      mimeType: paper.mimeType,
      fileSize: paper.fileSize
    };

    if (type === 'submission' && paper.resultSubmission) {
      fileData = {
        title: `${paper.title} - Submission`,
        fileUrl: paper.resultSubmission.fileUrl,
        fileName: paper.resultSubmission.fileName,
        mimeType: paper.resultSubmission.fileType,
      };
    } else if (type === 'evaluation' && paper.evaluation) {
      fileData = {
        title: `${paper.title} - Evaluated Copy`,
        fileUrl: paper.evaluation.fileUrl,
        fileName: paper.evaluation.fileName,
        mimeType: 'application/pdf'
      };
    }

    setSelectedPaper(fileData);
    setPreviewOpen(true);
  };

  const handleOpenUpload = (paper) => {
    setTargetPaper(paper);
    setUploadDialogOpen(true);
  };
  const handleCloseUpload = () => {
    setUploadDialogOpen(false);
    setTargetPaper(null);
  };

  const handleOpenEvaluation = (paper) => {
    setTargetPaper(paper);
    setEvaluationDialogOpen(true);
  };
  const handleCloseEvaluation = () => {
    setEvaluationDialogOpen(false);
    setTargetPaper(null);
  };

  // --- LOGIC TO DETERMINE STATUS ---
  const getExamState = (paper) => {
    if (paper.evaluation) return "GRADED";
    if (paper.resultSubmission) return "SUBMITTED"; 
    return "PENDING";
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const enabledPapers = questionPapers?.filter(paper => paper.isEnabled) || [];
  const upcomingPapers = questionPapers?.filter(paper => paper.isUpcoming) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FaFileAlt /> Question Papers & Results
      </Typography>

      {/* Manual Refresh Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <Button variant="outlined" size="small" onClick={() => dispatch(fetchQuestionPapers(studentId))} disabled={fetchingQuestionPapers}>
            {fetchingQuestionPapers ? <CircularProgress size={20} /> : "Refresh List"}
         </Button>
      </Box>

      {/* --- AVAILABLE PAPERS LIST --- */}
      <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        {enabledPapers.length === 0 && !fetchingQuestionPapers && (
          <Alert severity="info">No question papers assigned yet.</Alert>
        )}

        {enabledPapers.map((paper) => {
          const examState = getExamState(paper);
          
          return (
            <DetailCard key={paper.id} sx={{ mb: 3, overflow: 'visible', position: 'relative' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                
                {/* LEFT SIDE: Info */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip label={paper.subject} size="small" color="primary" variant="filled" />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FaCalendarAlt /> {formatDateTime(paper.paperDateTime)}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                    {paper.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="outlined" size="small" startIcon={<FaEye />} onClick={() => handlePreview(paper, 'question')}>
                      View Paper
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<FaDownload />} onClick={() => handleDownload(paper.fileUrl, paper.fileName)}>
                      Download
                    </Button>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

                {/* RIGHT SIDE: STATUS */}
                <Box sx={{ flex: { md: '0 0 350px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  
                  {/* CASE 1: PENDING (Needs Upload) */}
                  {examState === "PENDING" && (
                    <Box sx={{ p: 2, border: '2px dashed #1976d2', borderRadius: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', textAlign: 'center' }}>
                      <FaCloudUploadAlt size={30} color="#1976d2" style={{ marginBottom: 8 }} />
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">Exam Pending</Typography>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                        Upload your answer sheet.
                      </Typography>
                      
                      {/* DEV MODE: Show Upload Button */}
                      <Button variant="contained" fullWidth color="primary" onClick={() => handleOpenUpload(paper)}>
                        Upload Answer Sheet
                      </Button>
                    </Box>
                  )}

                  {/* CASE 2: SUBMITTED (WAITING) */}
                  {examState === "SUBMITTED" && (
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fff3e0', border: '1px solid #ffe0b2' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FaHourglassHalf color="#f57c00" />
                        <Typography variant="subtitle2" fontWeight="bold" color="#e65100">
                          Waiting for Evaluation
                        </Typography>
                      </Box>
                      <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
                        Submitted on: {new Date(paper.resultSubmission.uploadedAt).toLocaleDateString()}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                         <Button size="small" variant="outlined" color="warning" fullWidth startIcon={<FaEye />} onClick={() => handlePreview(paper, 'submission')}>
                          View Student Submission
                        </Button>
                        
                        {/* DEV MODE: Show Evaluate Button */}
                        <Button 
                          size="small" variant="contained" color="secondary" fullWidth 
                          startIcon={<FaPenNib />}
                          onClick={() => handleOpenEvaluation(paper)}
                        >
                          Evaluate & Grade
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* CASE 3: GRADED */}
                  {examState === "GRADED" && (
                    <Box sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', border: '1px solid #a5d6a7', position: 'relative', overflow: 'hidden' }}>
                      <FaCheckCircle size={80} color="rgba(76, 175, 80, 0.1)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold" color="#2e7d32" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaClipboardCheck /> Exam Completed
                          </Typography>
                          <Typography variant="caption" color="#1b5e20">Result Declared</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h4" fontWeight="900" color="#2e7d32" sx={{ lineHeight: 1 }}>
                            {paper.evaluation.marksSecured}<Typography component="span" variant="caption" color="text.secondary">/{paper.evaluation.maxMarks}</Typography>
                          </Typography>
                          <Typography variant="caption" fontWeight="bold">MARKS</Typography>
                        </Box>
                      </Box>
                      <LinearProgress variant="determinate" value={(paper.evaluation.marksSecured / paper.evaluation.maxMarks) * 100} sx={{ mb: 2, height: 6, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.5)', '& .MuiLinearProgress-bar': { bgcolor: '#2e7d32' } }} />
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                         <Tooltip title="View Original Submission">
                          <IconButton size="small" onClick={() => handlePreview(paper, 'submission')} sx={{ bgcolor: 'white' }}>
                            <FaFileAlt color="#555" size={14} />
                          </IconButton>
                        </Tooltip>
                        {paper.evaluation.fileUrl && (
                          <Button size="small" variant="contained" color="success" fullWidth startIcon={<FaFileSignature />} onClick={() => handlePreview(paper, 'evaluation')} sx={{ boxShadow: 'none' }}>
                            Evaluated Script
                          </Button>
                        )}
                        {/* DEV MODE: Re-Evaluate */}
                        <Tooltip title="Edit Marks">
                          <IconButton size="small" onClick={() => handleOpenEvaluation(paper)} sx={{ bgcolor: 'white' }}>
                            <FaPenNib color="#555" size={14} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                </Box>
              </Box>
            </DetailCard>
          );
        })}
      </Paper>

      {/* --- DIALOGS --- */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { height: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Typography variant="h6">{selectedPaper?.title}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<FaDownload />} size="small" onClick={() => handleDownload(selectedPaper?.fileUrl, selectedPaper?.fileName)}>Download</Button>
            <IconButton onClick={() => setPreviewOpen(false)} size="small"><FaTimes /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
          {selectedPaper && (
            <Box sx={{ flex: 1, height: '100%', p: 2 }}>
               {selectedPaper.mimeType?.includes('pdf') || selectedPaper.fileUrl?.endsWith('.pdf') ? (
                  <iframe src={selectedPaper.fileUrl} width="100%" height="100%" style={{ border: 'none', borderRadius: '4px' }} title="Preview" />
               ) : (selectedPaper.mimeType?.includes('image') || selectedPaper.fileUrl?.match(/\.(jpeg|jpg|png)$/)) ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <img src={selectedPaper.fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '4px' }} />
                  </Box>
               ) : (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', color: '#777' }}>
                   <FaFileAlt size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
                   <Typography>Preview not available.</Typography>
                 </Box>
               )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ResultUploadDialog
        open={uploadDialogOpen}
        onClose={handleCloseUpload}
        paperId={targetPaper?.id}
        studentId={studentId}
        studentName={currentStudent?.Name || "Student"}
      />

      <EvaluationDialog
        open={evaluationDialogOpen}
        onClose={handleCloseEvaluation}
        paper={targetPaper}
        studentId={studentId}
      />
    </Box>
  );
};

export default StudentPapers;