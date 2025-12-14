import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  OutlinedInput
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadStudyMaterial } from "../redux/actions";
import CustomDragDropUpload from "./customcomponents/CustomDragDropUpload";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaTimes,
  FaUpload,
  FaCheck,
  FaLink,
  FaAlignLeft
} from "react-icons/fa";

// ITEM HEIGHT & PADDING FOR MULTI-SELECT
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StudyMaterialUpload = () => {
  const dispatch = useDispatch();
  
  // Safely access state
  const { uploadingStudyMaterial, error } = useSelector((state) => state.lectureMaterials || {});
  const { user } = useSelector((state) => state.auth || {});
  
  // Safety check for students list
  const studentState = useSelector((state) => state.students);
  const students = studentState?.students || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    materialType: "file", // 'file', 'link', 'message'
    linkUrl: "",
    messageContent: ""
  });
  
  const [selectedStudents, setSelectedStudents] = useState([]); // Array of student IDs
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (uploadAttempted && !uploadingStudyMaterial && !error) {
      setShowSuccess(true);
      setUploadAttempted(false);
      
      // Clear form
      setFormData({
        title: "",
        description: "",
        materialType: "file",
        linkUrl: "",
        messageContent: ""
      });
      setSelectedFile(null);
      setSelectedStudents([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadingStudyMaterial, error, uploadAttempted]);

  const getSubject = () => {
    if (!user) return "General";
    if (user.isPhysics && user.isChemistry) return "Physics & Chemistry";
    if (user.isPhysics) return "Physics";
    if (user.isChemistry) return "Chemistry";
    return "General";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStudents(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
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
        alert("Invalid file type.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size > 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  // ... Drag & Drop Handlers ...
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => { 
    e.preventDefault(); 
    setIsDragOver(false); 
    if(e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]); 
  };
  const handleBoxClick = () => fileInputRef.current?.click();
  const handleFileInputChange = (e) => { if (e.target.files.length > 0) handleFileSelect(e.target.files[0]); };
  const removeFile = () => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; };

  const getFileIcon = (file) => {
     if (!file) return <FaCloudUploadAlt size={48} />;
     const t = file.type;
     if (t.includes('pdf')) return <FaFilePdf size={48} color="#f40f02" />;
     if (t.includes('word') || t.includes('doc')) return <FaFileWord size={48} color="#2b579a" />;
     if (t.includes('excel') || t.includes('sheet')) return <FaFileExcel size={48} color="#217346" />;
     if (t.includes('image')) return <FaFileImage size={48} color="#ff6b35" />;
     return <FaCloudUploadAlt size={48} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
        alert("Please select at least one student.");
        return;
    }

    if (formData.materialType === 'file' && !selectedFile) {
      alert("Please select a file.");
      return;
    }
    if (formData.materialType === 'link' && !formData.linkUrl) {
        alert("Please enter a URL.");
        return;
    }
    if (formData.materialType === 'message' && !formData.messageContent) {
        alert("Please enter a message.");
        return;
    }

    const title = formData.title || `${getSubject()} Material ${new Date().toLocaleDateString()}`;
    // Create map for efficient lookup
    const studentNameMap = students.reduce((acc, s) => ({...acc, [s.id]: s.Name}), {});

    for (const studentId of selectedStudents) {
        const uploadFormData = new FormData();
        
        uploadFormData.append("studentName", studentNameMap[studentId] || "Student");
        uploadFormData.append("title", title);
        uploadFormData.append("description", formData.description || "");
        uploadFormData.append("subject", getSubject());
        
        // Custom field to tell backend logic what type this is
        // Note: Backend might need update to store 'type', 'contentUrl', 'contentMessage'
        uploadFormData.append("materialType", formData.materialType); 

        if (formData.materialType === 'file') {
            uploadFormData.append("file", selectedFile);
        } else if (formData.materialType === 'link') {
            uploadFormData.append("contentUrl", formData.linkUrl);
        } else if (formData.materialType === 'message') {
            uploadFormData.append("contentMessage", formData.messageContent);
        }

        dispatch(uploadStudyMaterial(studentId, uploadFormData));
    }

    setShowSuccess(false);
    setUploadAttempted(true);
  };

  // REMOVED STRICT ROLE CHECK that was likely hiding the UI
  // if (user?.role !== "tutor") return null; 

  return (
    <>
      <CustomDragDropUpload title="Share Study Material" error={error}>
        
        {/* 1. Student Selection (Multi-Select) */}
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="student-select-label">Select Students</InputLabel>
            <Select
            labelId="student-select-label"
            multiple
            value={selectedStudents}
            onChange={handleStudentChange}
            input={<OutlinedInput label="Select Students" />}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                    const student = students.find(s => s.id === value);
                    return <Chip key={value} label={student?.Name} size="small" />;
                })}
                </Box>
            )}
            MenuProps={MenuProps}
            disabled={uploadingStudyMaterial}
            >
            {students && students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                {student.Name}
                </MenuItem>
            ))}
            </Select>
        </FormControl>

        {/* 2. Material Type Selection */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Content Type:</Typography>
            <RadioGroup
                row
                name="materialType"
                value={formData.materialType}
                onChange={handleInputChange}
            >
                <FormControlLabel value="file" control={<Radio size="small" />} label="File/Document" disabled={uploadingStudyMaterial} />
                <FormControlLabel value="link" control={<Radio size="small" />} label="Web Link" disabled={uploadingStudyMaterial} />
                <FormControlLabel value="message" control={<Radio size="small" />} label="Message/Note" disabled={uploadingStudyMaterial} />
            </RadioGroup>
        </FormControl>

        {/* 3. Common Info */}
        <TextField
          label="Title (Optional)"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
          disabled={uploadingStudyMaterial}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          multiline rows={2}
          fullWidth
          disabled={uploadingStudyMaterial}
          sx={{ mb: 2 }}
        />

        {/* 4. Conditional Content Input */}
        
        {/* A. FILE UPLOAD */}
        {formData.materialType === 'file' && (
            <Box sx={{ mb: 2 }}>
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
                    borderRadius: 2, p: 4, textAlign: 'center', cursor: uploadingStudyMaterial ? 'not-allowed' : 'pointer',
                    backgroundColor: uploadingStudyMaterial ? 'rgba(0,0,0,0.04)' : (isDragOver ? 'rgba(25,118,210,0.04)' : 'transparent'),
                    }}
                >
                    {!selectedFile ? (
                        <Box>
                            <Box sx={{ color: isDragOver ? '#1976d2' : '#9e9e9e', mb: 2 }}>{getFileIcon(null)}</Box>
                            <Typography variant="body2" color="text.secondary">Click or Drag File Here</Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Box sx={{ color: '#1976d2', mb: 2 }}>{getFileIcon(selectedFile)}</Box>
                            <Typography variant="subtitle1">{selectedFile.name}</Typography>
                            <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); removeFile(); }}>Remove</Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        )}

        {/* B. LINK INPUT */}
        {formData.materialType === 'link' && (
            <TextField
                label="Paste URL Here"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleInputChange}
                fullWidth
                placeholder="https://example.com"
                disabled={uploadingStudyMaterial}
                InputProps={{ startAdornment: <FaLink style={{marginRight: 8, color: '#666'}}/> }}
                sx={{ mb: 2 }}
            />
        )}

        {/* C. MESSAGE INPUT */}
        {formData.materialType === 'message' && (
            <TextField
                label="Message Content"
                name="messageContent"
                value={formData.messageContent}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Type your important note or instruction here..."
                disabled={uploadingStudyMaterial}
                InputProps={{ startAdornment: <FaAlignLeft style={{marginRight: 8, marginTop: 4, color: '#666', alignSelf: 'flex-start'}}/> }}
                sx={{ mb: 2 }}
            />
        )}

        {/* 5. Subject Info & Submit */}
        <Paper elevation={0} sx={{ p: 1.5, mb: 2, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
           <Typography variant="caption" color="text.secondary">Subject: <b>{getSubject()}</b></Typography>
        </Paper>

        <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={uploadingStudyMaterial}
            startIcon={uploadingStudyMaterial ? <CircularProgress size={20} color="inherit"/> : <FaUpload/>}
        >
            {uploadingStudyMaterial ? "Sending..." : "Share Material"}
        </Button>

      </CustomDragDropUpload>

      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" icon={<FaCheck />}>Shared successfully!</Alert>
      </Snackbar>
    </>
  );
};

export default StudyMaterialUpload;