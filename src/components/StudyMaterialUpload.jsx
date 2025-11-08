import React, { useState, useRef, useEffect } from "react";
import { 
  TextField, 
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadStudyMaterial } from "../redux/actions";
import CustomDragDropUpload from "./customcomponents/CustomDragDropUpload";
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaTimes, FaUpload, FaCheck } from "react-icons/fa";

const StudyMaterialUpload = ({ studentId, studentName }) => {
  const dispatch = useDispatch();
  const { uploadingStudyMaterial, error } = useSelector((state) => state.lectureMaterials);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const fileInputRef = useRef(null);

  // Effect to handle successful upload
  useEffect(() => {
    // If upload finished successfully and we had attempted an upload
    if (uploadAttempted && !uploadingStudyMaterial && !error) {
      setShowSuccess(true);
      setUploadAttempted(false);
      
      // Clear form state
      setFormData({
        title: "",
        description: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Auto-hide success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadingStudyMaterial, error, uploadAttempted]);

  // Determine subject based on boolean values
  const getSubject = () => {
    if (user.isPhysics && user.isChemistry) return "Physics & Chemistry";
    if (user.isPhysics) return "Physics";
    if (user.isChemistry) return "Chemistry";
    return "General";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid file type (PDF, Word, Excel, or Image)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <FaCloudUploadAlt size={48} />;
    
    const fileType = file.type;
    if (fileType.includes('pdf')) return <FaFilePdf size={48} color="#f40f02" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FaFileWord size={48} color="#2b579a" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FaFileExcel size={48} color="#217346" />;
    if (fileType.includes('image')) return <FaFileImage size={48} color="#ff6b35" />;
    return <FaCloudUploadAlt size={48} />;
  };

  const getFileTypeText = (file) => {
    if (!file) return "PDF, Word, Excel, or Image files";
    
    const fileType = file.type;
    if (fileType.includes('pdf')) return "PDF Document";
    if (fileType.includes('word') || fileType.includes('document')) return "Word Document";
    if (fileType.includes('excel') || fileType.includes('sheet')) return "Excel Spreadsheet";
    if (fileType.includes('image')) return "Image File";
    return "Document";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    // Generate a better title if not provided
    const title = formData.title || 
      `${getSubject()} Study Material ${new Date().toLocaleDateString()}`;

    // Ensure studentName is defined
    const studentNameToUse = studentName || user.name || "Unknown Student";

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);
    uploadFormData.append("studentName", studentNameToUse);
    uploadFormData.append("title", title);
    uploadFormData.append("description", formData.description || "Study material for student");
    uploadFormData.append("subject", getSubject());

    // Reset success state and mark upload as attempted
    setShowSuccess(false);
    setUploadAttempted(true);
    
    // Dispatch the upload action
    dispatch(uploadStudyMaterial(studentId, uploadFormData));
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  // Only show if user is tutor
  const userRole = "tutor";

  if (userRole !== "tutor") {
    return null;
  }

  return (
    <>
      <CustomDragDropUpload
        title="Upload Study Material"
        error={error}
      >
        <TextField
          label="Title (Optional)"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Leave empty to auto-generate title"
          fullWidth
          helperText="If left empty, a title will be generated automatically"
          disabled={uploadingStudyMaterial}
        />

        <TextField
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description for the study material"
          multiline
          rows={2}
          fullWidth
          helperText="Brief description of the study material"
          disabled={uploadingStudyMaterial}
        />

        {/* Subject Display */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Subject (Auto-detected from your profile)
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {getSubject()}
          </Typography>
        </Paper>

        {/* Drag and Drop Area with Upload Button */}
        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            disabled={uploadingStudyMaterial}
          />
          
          <Paper
            elevation={isDragOver ? 8 : 2}
            onClick={uploadingStudyMaterial ? undefined : handleBoxClick}
            onDragOver={uploadingStudyMaterial ? undefined : handleDragOver}
            onDragLeave={uploadingStudyMaterial ? undefined : handleDragLeave}
            onDrop={uploadingStudyMaterial ? undefined : handleDrop}
            sx={{
              border: isDragOver ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: uploadingStudyMaterial ? 'not-allowed' : 'pointer',
              backgroundColor: uploadingStudyMaterial ? 'rgba(0, 0, 0, 0.04)' : (isDragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent'),
              transition: 'all 0.3s ease',
              '&:hover': uploadingStudyMaterial ? {} : {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderColor: '#1976d2',
              }
            }}
          >
            {uploadingStudyMaterial ? (
              <Box>
                <CircularProgress size={48} sx={{ mb: 2, color: '#1976d2' }} />
                <Typography variant="h6" gutterBottom color="primary">
                  Uploading Study Material...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we upload your file
                </Typography>
              </Box>
            ) : !selectedFile ? (
              <Box>
                <Box sx={{ color: isDragOver ? '#1976d2' : '#9e9e9e', mb: 2 }}>
                  {getFileIcon(null)}
                </Box>
                <Typography variant="h6" gutterBottom color={isDragOver ? 'primary' : 'text.secondary'}>
                  {isDragOver ? 'Drop your file here' : 'Click to select a file'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getFileTypeText(null)} (Max 10MB)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  or drag and drop your files here
                </Typography>
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ color: '#1976d2', mb: 2 }}>
                  {getFileIcon(selectedFile)}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getFileTypeText(selectedFile)} • {formatFileSize(selectedFile.size)}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<FaTimes />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    disabled={uploadingStudyMaterial}
                  >
                    Remove
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={uploadingStudyMaterial ? <CircularProgress size={16} /> : <FaUpload />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(e);
                    }}
                    disabled={uploadingStudyMaterial}
                  >
                    {uploadingStudyMaterial ? "Uploading..." : "Upload Now"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </CustomDragDropUpload>

      {/* Success Message Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          icon={<FaCheck />}
          sx={{ width: '100%' }}
        >
          Study material uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudyMaterialUpload;