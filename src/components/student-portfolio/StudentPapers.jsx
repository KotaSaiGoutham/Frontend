import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFileAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import DetailCard from "./components/DetailCard";
import QuestionPaperUpload from "../QuestionPaperUpload";
import { fetchQuestionPapers } from "../../redux/actions";

const StudentPapers = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { questionPapers, fetchingQuestionPapers, error } = useSelector((state) => state.lectureMaterials);

  // Get user role from auth state
  const userRole = "student"; // This should come from your auth state

  useEffect(() => {
    if (studentId) {
      dispatch(fetchQuestionPapers(studentId));
    }
  }, [dispatch, studentId]);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

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
          studentName="Student Name" // Pass actual student name
        />
      )}

      {/* Question Papers List - Shown to both tutors and students */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Question Papers ({questionPapers?.length || 0})
        </Typography>

        {fetchingQuestionPapers && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!fetchingQuestionPapers && questionPapers?.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No question papers available yet.
          </Typography>
        )}

        {questionPapers?.map((paper) => (
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
                    label={`Year: ${paper.year}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={paper.paperType}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip 
                    label={paper.difficulty}
                    size="small"
                    color={getDifficultyColor(paper.difficulty)}
                  />
                  <Chip 
                    icon={<FaCalendarAlt />}
                    label={formatDate(paper.uploadedAt)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<FaDownload />}
                onClick={() => handleDownload(paper.fileUrl, paper.fileName)}
                sx={{ ml: 2 }}
              >
                Download
              </Button>
            </Box>
          </DetailCard>
        ))}
      </Paper>
    </Box>
  );
};

export default StudentPapers;