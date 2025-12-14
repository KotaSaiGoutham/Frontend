import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  FaInfoCircle, 
  FaDownload, 
  FaCalendarAlt, 
  FaCopy, 
  FaExternalLinkAlt, 
  FaFileAlt, 
  FaLink, 
  FaAlignLeft,
  FaCheck
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
  Tooltip
} from "@mui/material";
import StudyMaterialUpload from "../StudyMaterialUpload";
import { fetchStudyMaterials } from "../../redux/actions";

const StudentStudyMaterials = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { studyMaterials, fetchingStudyMaterials, error } = useSelector((state) => state.lectureMaterials);
  const { user } = useSelector((state) => state.auth);

  const [copiedId, setCopiedId] = useState(null);

  // Determine user role
  const userRole = user?.role || "student"; 

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudyMaterials(studentId));
    }
  }, [dispatch, studentId]);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    // Reset copy status after 2 seconds
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMaterialIcon = (type) => {
      if (type === 'link') return <FaLink />;
      if (type === 'message') return <FaAlignLeft />;
      return <FaFileAlt />;
  };

  const getThemeColor = (type) => {
      if (type === 'link') return '#0288d1'; // Blue
      if (type === 'message') return '#ed6c02'; // Orange
      return '#2e7d32'; // Green (File)
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FaInfoCircle />
        Study Materials
      </Typography>

      {/* Upload Section - Only shown to tutors */}
      {userRole === "tutor" && (
        <Box sx={{ mb: 4 }}>
            <StudyMaterialUpload 
              studentId={studentId} 
              // If you have the student object in parent/redux, pass studentName here if needed
            />
        </Box>
      )}

      {/* Study Materials List */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#333' }}>
          Available Materials ({studyMaterials?.length || 0})
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {studyMaterials?.map((material) => {
          const type = material.materialType || 'file'; // Default to file for old data
          const content = material.content || "";
          const themeColor = getThemeColor(type);
          
          return (
            <Paper 
              key={material.id} 
              elevation={2} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                borderLeft: `5px solid ${themeColor}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', gap: 2 }}>
                
                {/* Left Side: Content Information */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ color: themeColor, display: 'flex', fontSize: '1.2rem' }}>
                          {getMaterialIcon(type)}
                      </Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {material.title}
                      </Typography>
                      <Chip 
                        label={type.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.65rem', 
                          height: 20, 
                          bgcolor: `${themeColor}15`, 
                          color: themeColor,
                          fontWeight: 700
                        }}
                      />
                  </Box>

                  {material.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {material.description}
                    </Typography>
                  )}

                  {/* --- Type Specific Content Display --- */}
                  
                  {/* 1. MESSAGE VIEW */}
                  {type === 'message' && (
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff3e0', mb: 2, border: '1px dashed #ed6c02', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#333' }}>{content}</Typography>
                      </Paper>
                  )}

                  {/* 2. LINK VIEW */}
                  {type === 'link' && (
                      <Typography variant="body2" sx={{ mb: 2, color: 'primary.main', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FaLink size={12}/>
                          <a href={content} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline', color: 'inherit'}}>
                              {content}
                          </a>
                      </Typography>
                  )}

                  {/* Metadata Footer */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, alignItems: 'center' }}>
                    <Chip 
                      label={material.subject} 
                      size="small" 
                      sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 500 }}
                    />
                    <Chip 
                      icon={<FaCalendarAlt size={12}/>}
                      label={formatDate(material.uploadedAt)}
                      size="small" 
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        By: {material.uploadedByName || "Tutor"}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Side: Action Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minWidth: {sm: '140px'}, justifyContent: {xs: 'flex-start', sm: 'flex-end'} }}>
                  
                  {type === 'file' ? (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<FaDownload />}
                      onClick={() => handleDownload(material.fileUrl, material.fileName)}
                      sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                    >
                      Download
                    </Button>
                  ) : (
                    <>
                       {type === 'link' && (
                           <Button
                             variant="outlined"
                             size="small"
                             startIcon={<FaExternalLinkAlt />}
                             href={content}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                             Open
                           </Button>
                       )}
                       
                       <Tooltip title={copiedId === material.id ? "Copied!" : "Copy to Clipboard"} arrow placement="top">
                         <Button
                           variant={type === 'message' ? "contained" : "outlined"}
                           size="small"
                           color={type === 'message' ? "warning" : "primary"}
                           startIcon={copiedId === material.id ? <FaCheck /> : <FaCopy />}
                           onClick={() => handleCopy(content, material.id)}
                           sx={type === 'message' ? { bgcolor: '#ed6c02', '&:hover': {bgcolor: '#e65100'} } : {}}
                         >
                           {copiedId === material.id ? "Copied" : "Copy"}
                         </Button>
                       </Tooltip>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentStudyMaterials;