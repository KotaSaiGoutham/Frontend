import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  FaFileAlt, FaDownload, FaCalendarAlt, FaClock, FaLock, FaUnlock, 
  FaEye, FaTimes 
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip
} from "@mui/material";
import DetailCard from "./components/DetailCard";
import QuestionPaperUpload from "../QuestionPaperUpload";
import { fetchQuestionPapers } from "../../redux/actions";

const StudentPapers = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { questionPapers, fetchingQuestionPapers, error } = useSelector((state) => state.lectureMaterials);
  
  // Get students from Redux store to find current student name
  const { students } = useSelector((state) => state.students);
  const currentStudent = students?.find(s => s.id === studentId);

  // Get user role from auth state
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || "student";

  const [timeUntilRefresh, setTimeUntilRefresh] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchQuestionPapers(studentId));
    }
  }, [dispatch, studentId]);

  // Check for upcoming papers and set refresh timer
  useEffect(() => {
    if (questionPapers?.some(paper => paper.isUpcoming)) {
      // Refresh every minute to check if any paper becomes available
      const interval = setInterval(() => {
        setTimeUntilRefresh(prev => prev + 1);
        // Refresh data every 5 minutes or when user manually refreshes
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [questionPapers]);

const handleDownload = async (fileUrl, fileName) => {
  try {
    
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab
    window.open(fileUrl, '_blank');
  }
};
  const handlePreview = (paper) => {
    setSelectedPaper(paper);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedPaper(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

  const getTimeUntilAvailable = (paperDateTime) => {
    const now = new Date();
    const target = new Date(paperDateTime);
    const diff = target - now;
    
    if (diff <= 0) return "Available now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `Available in ${days}d ${hours}h`;
    if (hours > 0) return `Available in ${hours}h ${minutes}m`;
    return `Available in ${minutes}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  const handleRefresh = () => {
    if (studentId) {
      dispatch(fetchQuestionPapers(studentId));
      setTimeUntilRefresh(0);
    }
  };

  // Check if file is previewable (PDF, images)
  const isPreviewable = (mimeType) => {
    return mimeType?.includes('pdf') || mimeType?.includes('image');
  };

  // Separate enabled and upcoming papers
  const enabledPapers = questionPapers?.filter(paper => paper.isEnabled) || [];
  const upcomingPapers = questionPapers?.filter(paper => paper.isUpcoming) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FaFileAlt />
        Question Papers
      </Typography>

      {/* Upload Section - Only shown to tutors */}
      {userRole === "tutor" && (
        <QuestionPaperUpload 
          studentId={studentId} 
          studentName={currentStudent?.Name || "Student"} 
        />
      )}

      {/* Refresh Button for upcoming papers */}
      {(upcomingPapers.length > 0 || timeUntilRefresh > 0) && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {upcomingPapers.length > 0 && "Some papers will become available automatically"}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleRefresh}
            disabled={fetchingQuestionPapers}
          >
            {fetchingQuestionPapers ? <CircularProgress size={20} /> : "Refresh"}
          </Button>
        </Box>
      )}

      {/* Enabled Question Papers */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaUnlock color="#4caf50" />
          Available Question Papers ({enabledPapers.length})
        </Typography>

        {fetchingQuestionPapers && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!fetchingQuestionPapers && enabledPapers.length === 0 && questionPapers?.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No question papers available yet.
          </Typography>
        )}

        {enabledPapers.map((paper) => (
          <DetailCard key={paper.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {paper.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip 
                    label={paper.subject} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<FaCalendarAlt />}
                    label={formatDateTime(paper.paperDateTime)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                {/* Preview Button */}
                {isPreviewable(paper.mimeType) && (
                  <Tooltip title="Preview">
                    <Button
                      variant="outlined"
                      startIcon={<FaEye />}
                      onClick={() => handlePreview(paper)}
                      sx={{ minWidth: 'auto' }}
                    >
                      Preview
                    </Button>
                  </Tooltip>
                )}
                
                {/* Download Button */}
                <Tooltip title="Download">
                  <Button
                    variant="contained"
                    startIcon={<FaDownload />}
                    onClick={() => handleDownload(paper.fileUrl, paper.fileName)}
                    sx={{ minWidth: 'auto' }}
                  >
                    Download
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </DetailCard>
        ))}
      </Paper>

      {/* Upcoming Question Papers */}
      {upcomingPapers.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaLock color="#f44336" />
            Upcoming Question Papers ({upcomingPapers.length})
          </Typography>

          {upcomingPapers.map((paper) => (
            <Card key={paper.id} sx={{ mb: 2, opacity: 0.7, backgroundColor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom color="text.secondary">
                      {paper.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip 
                        label={paper.subject} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                     
                      <Chip 
                        icon={<FaClock />}
                        label={getTimeUntilAvailable(paper.paperDateTime)}
                        size="small"
                        color="warning"
                      />
                      <Chip 
                        icon={<FaCalendarAlt />}
                        label={formatDateTime(paper.paperDateTime)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    disabled
                    startIcon={<FaLock />}
                    sx={{ ml: 2 }}
                  >
                    Available {formatDate(paper.paperDateTime)}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6">
            {selectedPaper?.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<FaDownload />}
              onClick={() => handleDownload(selectedPaper?.fileUrl, selectedPaper?.fileName)}
              size="small"
            >
              Download
            </Button>
            <IconButton onClick={handleClosePreview} size="small">
              <FaTimes />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {selectedPaper && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* File Info */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>File:</strong> {selectedPaper.fileName} • 
                  <strong> Size:</strong> {(selectedPaper.fileSize / 1024).toFixed(2)} KB • 
                  <strong> Type:</strong> {selectedPaper.mimeType}
                </Typography>
              </Box>
              
              {/* Preview Content */}
              <Box sx={{ flex: 1, p: 1 }}>
                {selectedPaper.mimeType?.includes('pdf') ? (
                  <iframe
                    src={selectedPaper.fileUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={`Preview of ${selectedPaper.title}`}
                  />
                ) : selectedPaper.mimeType?.includes('image') ? (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <img
                      src={selectedPaper.fileUrl}
                      alt={selectedPaper.title}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <FaFileAlt size={48} color="#9e9e9e" />
                    <Typography variant="h6" color="text.secondary">
                      Preview not available for this file type
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<FaDownload />}
                      onClick={() => handleDownload(selectedPaper.fileUrl, selectedPaper.fileName)}
                    >
                      Download to view
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentPapers;