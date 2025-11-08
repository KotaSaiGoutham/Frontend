import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaInfoCircle, FaDownload, FaCalendarAlt } from "react-icons/fa";
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
import StudyMaterialUpload from "../StudyMaterialUpload";
import { fetchStudyMaterials } from "../../redux/actions";

const StudentStudyMaterials = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { studyMaterials, fetchingStudyMaterials, error } = useSelector((state) => state.lectureMaterials);

  // Get user role from auth state
  const userRole = "student"; // This should come from your auth state

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudyMaterials(studentId));
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FaInfoCircle />
        Study Materials
      </Typography>

      {/* Upload Section - Only shown to tutors */}
      {userRole === "tutor" && (
        <StudyMaterialUpload 
          studentId={studentId} 
          studentName="Student Name" // Pass actual student name
        />
      )}

      {/* Study Materials List - Shown to both tutors and students */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Study Materials ({studyMaterials?.length || 0})
        </Typography>

        {fetchingStudyMaterials && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!fetchingStudyMaterials && studyMaterials?.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No study materials available yet.
          </Typography>
        )}

        {studyMaterials?.map((material) => (
          <DetailCard key={material.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {material.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {material.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip 
                    label={material.subject} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<FaCalendarAlt />}
                    label={formatDate(material.uploadedAt)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<FaDownload />}
                onClick={() => handleDownload(material.fileUrl, material.fileName)}
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

export default StudentStudyMaterials;