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
  Alert,
  Chip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadQuestionPaper } from "../redux/actions";
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaTimes, FaUpload, FaCheck, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { MuiDateTimePicker } from "./customcomponents/MuiCustomFormFields";
import { format, parseISO, isValid } from "date-fns";

const QuestionPaperUpload = () => {
  const dispatch = useDispatch();
  
  // Redux Selectors
  const { uploadingQuestionPaper, error } = useSelector((state) => state.lectureMaterials);
  const { user } = useSelector((state) => state.auth);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);

  // --- CHANGED: State to store ARRAY of student IDs ---
  const [selectedStudents, setSelectedStudents] = useState([]); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (uploadAttempted && !uploadingQuestionPaper && !error) {
      setShowSuccess(true);
      setUploadAttempted(false);
      
      // Clear form state
      setSelectedStudents([]); // Clear array
      setSelectedFile(null);
      setSelectedDateTime("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadingQuestionPaper, error, uploadAttempted]);

  // --- CHANGED: Handle Multi-Select Change ---
  const handleStudentChange = (e) => {
    const { value } = e.target;
    // On autofill we get a stringified value
    setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDateTimeChange = (dateTimeString) => {
    setSelectedDateTime(dateTimeString);
  };

  const handleFileSelect = (file) => {
    if (file) {
      const validTypes = [
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg', 'image/png', 'image/jpg'
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

  // ... (Drag & Drop handlers remain the same) ...
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0]);
  };
  const handleBoxClick = () => { fileInputRef.current?.click(); };
  const handleFileInputChange = (e) => { if (e.target.files.length > 0) handleFileSelect(e.target.files[0]); };
  
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ... (Helper functions remain the same) ...
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
      if (isValid(date)) return format(date, "dd/MM/yyyy hh:mm a");
    } catch (error) { console.error("Error formatting date:", error); }
    return dateTimeString;
  };

  // --- CHANGED: Handle Submit with Loop ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check array length instead of single value
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB'); 
    const year = currentDate.getFullYear();
    const paperDateTime = selectedDateTime || "2099-12-31T23:59:59";

    // --- LOOP: Call API for each selected student ---
    selectedStudents.forEach(studentId => {
        // Find specific student data for this iteration
        const student = students.find(s => s.id === studentId);
        
        if (student) {
            // Logic to get subject specific to this student or logged-in user
            let subject = "General";
            if (student.Subject) subject = student.Subject;
            else if (user.isPhysics && user.isChemistry) subject = "Physics & Chemistry";
            else if (user.isPhysics) subject = "Physics";
            else if (user.isChemistry) subject = "Chemistry";

            // Title specific to this student
            const title = `${student.Name} - Question Paper - ${formattedDate}`;

            const uploadFormData = new FormData();
            uploadFormData.append("file", selectedFile);
            uploadFormData.append("studentName", student.Name);
            uploadFormData.append("title", title);
            uploadFormData.append("subject", subject);
            uploadFormData.append("year", year);
            uploadFormData.append("paperDateTime", paperDateTime);

            // Call API
            dispatch(uploadQuestionPaper(studentId, uploadFormData));
        }
    });

    setShowSuccess(false);
    setUploadAttempted(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  // Permission Check (Updated to include faculty)
  const allowedRoles = ["tutor", "admin", "faculty"];
  if (!user || !allowedRoles.includes(user.role)) {
     return null; // Or return an Alert component
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Upload Question Paper
        </Typography>

        {/* --- CHANGED: Multi-Select Student Dropdown --- */}
        <FormControl fullWidth sx={{ mb: 3 }} disabled={uploadingQuestionPaper}>
          <InputLabel>Select Students *</InputLabel>
          <Select
            multiple // Enabled multiple
            value={selectedStudents} // Binds to array
            onChange={handleStudentChange}
            label="Select Students *"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                   const student = students.find(s => s.id === value);
                   return (
                     <Chip key={value} label={student?.Name} size="small" />
                   );
                })}
              </Box>
            )}
          >
            {studentsLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Loading students...
              </MenuItem>
            ) : studentsError ? (
              <MenuItem disabled>Error loading students</MenuItem>
            ) : (
              students
                .filter(student => student.isActive && !student.deactivated)
                .sort((a, b) => a.Name.localeCompare(b.Name))
                .map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.Name} - {student.Subject || "General"}
                  </MenuItem>
                ))
            )}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Select one or more students
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
            disabled={uploadingQuestionPaper || selectedStudents.length === 0}
          />
          
          <Paper
            elevation={isDragOver ? 8 : 2}
            onClick={(!uploadingQuestionPaper && selectedStudents.length > 0) ? handleBoxClick : undefined}
            onDragOver={(!uploadingQuestionPaper && selectedStudents.length > 0) ? handleDragOver : undefined}
            onDragLeave={(!uploadingQuestionPaper && selectedStudents.length > 0) ? handleDragLeave : undefined}
            onDrop={(!uploadingQuestionPaper && selectedStudents.length > 0) ? handleDrop : undefined}
            sx={{
              border: isDragOver ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: (!uploadingQuestionPaper && selectedStudents.length > 0) ? 'pointer' : 'not-allowed',
              backgroundColor: uploadingQuestionPaper ? 'rgba(0, 0, 0, 0.04)' : 
                            selectedStudents.length === 0 ? 'rgba(0, 0, 0, 0.02)' :
                            (isDragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent'),
              transition: 'all 0.3s ease',
              '&:hover': (!uploadingQuestionPaper && selectedStudents.length > 0) ? {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderColor: '#1976d2',
              } : {}
            }}
          >
            {selectedStudents.length === 0 ? (
              <Box>
                <Box sx={{ color: '#9e9e9e', mb: 2 }}><FaCloudUploadAlt size={48} /></Box>
                <Typography variant="h6" gutterBottom color="text.secondary">Please select students first</Typography>
              </Box>
            ) : uploadingQuestionPaper ? (
              <Box>
                <CircularProgress size={48} sx={{ mb: 2, color: '#1976d2' }} />
                <Typography variant="h6" gutterBottom color="primary">Uploading...</Typography>
              </Box>
            ) : !selectedFile ? (
              <Box>
                <Box sx={{ color: isDragOver ? '#1976d2' : '#9e9e9e', mb: 2 }}>{getFileIcon(null)}</Box>
                <Typography variant="h6" gutterBottom color={isDragOver ? 'primary' : 'text.secondary'}>
                  {isDragOver ? 'Drop your file here' : 'Click to select a file'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>{getFileTypeText(null)} (Max 10MB)</Typography>
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ color: '#1976d2', mb: 2 }}>{getFileIcon(selectedFile)}</Box>
                <Typography variant="h6" gutterBottom>{selectedFile.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getFileTypeText(selectedFile)} • {formatFileSize(selectedFile.size)}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                  <Button variant="outlined" color="error" size="small" startIcon={<FaTimes />} onClick={(e) => { e.stopPropagation(); removeFile(); }} disabled={uploadingQuestionPaper}>
                    Remove
                  </Button>
                  <Button variant="contained" size="small" startIcon={uploadingQuestionPaper ? <CircularProgress size={16} /> : <FaUpload />} onClick={(e) => { e.stopPropagation(); handleSubmit(e); }} disabled={uploadingQuestionPaper}>
                    {uploadingQuestionPaper ? "Uploading..." : "Upload Now"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </Paper>

      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={handleCloseSuccess} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSuccess} severity="success" variant="filled" icon={<FaCheck />} sx={{ width: '100%' }}>
          Question papers uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuestionPaperUpload;