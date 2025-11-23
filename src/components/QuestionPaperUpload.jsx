import React, { useState, useRef, useEffect } from "react";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadQuestionPaper } from "../redux/actions";
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaTimes, FaUpload, FaCheck, FaCalendarAlt } from "react-icons/fa";
import { MuiDateTimePicker } from "./customcomponents/MuiCustomFormFields";
import { format, parseISO, isValid } from "date-fns";

const QuestionPaperUpload = () => {
  const dispatch = useDispatch();
  const { uploadingQuestionPaper, error } = useSelector((state) => state.lectureMaterials);
  const { user } = useSelector((state) => state.auth);
  
  // Get students from Redux store
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const fileInputRef = useRef(null);

  // Effect to handle successful upload
  useEffect(() => {
    if (uploadAttempted && !uploadingQuestionPaper && !error) {
      setShowSuccess(true);
      setUploadAttempted(false);
      
      // Clear form state
      setSelectedStudent("");
      setSelectedFile(null);
      setSelectedDateTime("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Auto-hide success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadingQuestionPaper, error, uploadAttempted]);

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleDateTimeChange = (dateTimeString) => {
    setSelectedDateTime(dateTimeString);
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

  const formatDateTimeForDisplay = (dateTimeString) => {
    if (!dateTimeString) return "Not selected";
    try {
      const date = parseISO(dateTimeString);
      if (isValid(date)) {
        return format(date, "dd/MM/yyyy hh:mm a");
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
    return dateTimeString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate student selection
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    // Find selected student data
    const student = students.find(s => s.id === selectedStudent);
    if (!student) {
      alert("Selected student not found");
      return;
    }

    // Determine subject based on student data or user profile
    const getSubject = () => {
      if (student.Subject) return student.Subject;
      if (user.isPhysics && user.isChemistry) return "Physics & Chemistry";
      if (user.isPhysics) return "Physics";
      if (user.isChemistry) return "Chemistry";
      return "General";
    };

    // Generate title with current date
    const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-GB'); 
    const title = `${student.Name} - Question Paper - ${formattedDate}`;

    // Use current year
    const year = currentDate.getFullYear();

    // Use selected date time or default to 2099-12-31 23:59:59 if not provided
    const paperDateTime = selectedDateTime || "2099-12-31T23:59:59";

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);
    uploadFormData.append("studentName", student.Name); // Student name is mandatory
    uploadFormData.append("title", title);
    uploadFormData.append("subject", getSubject());
    uploadFormData.append("year", year);
    uploadFormData.append("paperDateTime", paperDateTime); // Add the date time field

    // Reset success state and mark upload as attempted
    setShowSuccess(false);
    setUploadAttempted(true);
    
    // Dispatch the upload action
    dispatch(uploadQuestionPaper(selectedStudent, uploadFormData));
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
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Upload Question Paper
        </Typography>

        {/* Student Dropdown */}
        <FormControl fullWidth sx={{ mb: 3 }} disabled={uploadingQuestionPaper}>
          <InputLabel>Select Student *</InputLabel>
          <Select
            value={selectedStudent}
            onChange={handleStudentChange}
            label="Select Student *"
          >
            {studentsLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading students...
              </MenuItem>
            ) : studentsError ? (
              <MenuItem disabled>Error loading students</MenuItem>
            ) : (
            students
  .filter(student => student.isActive && !student.deactivated)
  .sort((a, b) => a.Name.localeCompare(b.Name)) // Sort A to Z by name
  .map((student) => (
    <MenuItem key={student.id} value={student.id}>
      {student.Name} - {student.Subject || "General"} ({student.Stream || "No Stream"})
    </MenuItem>
  ))
            )}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Student name is mandatory for file organization
          </Typography>
        </FormControl>

        {/* Date Time Picker */}
        <Box sx={{ mb: 3 }}>
          <MuiDateTimePicker
            label="Question Paper Date & Time (Optional)"
            icon={FaCalendarAlt}
            value={selectedDateTime}
            onChange={handleDateTimeChange}
            helperText={
              selectedDateTime 
                ? `Selected: ${formatDateTimeForDisplay(selectedDateTime)}` 
                : "If not selected, will use default date 2099-12-31 23:59:59"
            }
            disabled={uploadingQuestionPaper}
          />
        </Box>

        {/* Drag and Drop File Upload Area */}
        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            disabled={uploadingQuestionPaper || !selectedStudent}
          />
          
          <Paper
            elevation={isDragOver ? 8 : 2}
            onClick={(!uploadingQuestionPaper && selectedStudent) ? handleBoxClick : undefined}
            onDragOver={(!uploadingQuestionPaper && selectedStudent) ? handleDragOver : undefined}
            onDragLeave={(!uploadingQuestionPaper && selectedStudent) ? handleDragLeave : undefined}
            onDrop={(!uploadingQuestionPaper && selectedStudent) ? handleDrop : undefined}
            sx={{
              border: isDragOver ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: (!uploadingQuestionPaper && selectedStudent) ? 'pointer' : 'not-allowed',
              backgroundColor: uploadingQuestionPaper ? 'rgba(0, 0, 0, 0.04)' : 
                            !selectedStudent ? 'rgba(0, 0, 0, 0.02)' :
                            (isDragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent'),
              transition: 'all 0.3s ease',
              '&:hover': (!uploadingQuestionPaper && selectedStudent) ? {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderColor: '#1976d2',
              } : {}
            }}
          >
            {!selectedStudent ? (
              <Box>
                <Box sx={{ color: '#9e9e9e', mb: 2 }}>
                  <FaCloudUploadAlt size={48} />
                </Box>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Please select a student first
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a student from the dropdown above to enable file upload
                </Typography>
              </Box>
            ) : uploadingQuestionPaper ? (
              <Box>
                <CircularProgress size={48} sx={{ mb: 2, color: '#1976d2' }} />
                <Typography variant="h6" gutterBottom color="primary">
                  Uploading Question Paper...
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
                    disabled={uploadingQuestionPaper}
                  >
                    Remove
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={uploadingQuestionPaper ? <CircularProgress size={16} /> : <FaUpload />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(e);
                    }}
                    disabled={uploadingQuestionPaper}
                  >
                    {uploadingQuestionPaper ? "Uploading..." : "Upload Now"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>

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
          Question paper uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuestionPaperUpload;