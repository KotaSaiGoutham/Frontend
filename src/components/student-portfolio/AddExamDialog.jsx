import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Radio,
  Typography,
  Stack,
  Autocomplete,
  TextField,
  Chip,
  Checkbox
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  MuiInput,
  MuiDatePicker
} from "../customcomponents/MuiCustomFormFields";
import { FaCheckSquare, FaUniversity } from "react-icons/fa";
import { addStudentExam, fetchStudentExamsByStudent } from "../../redux/actions";
import { topicOptions, MARK_SCHEMES } from "../../mockdata/Options";

const AddExamDialog = ({ open, onClose, currentStudent }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    subject: currentStudent?.Subject || "Physics",
    stream: currentStudent?.Stream || "",
    marks: {},
    outOf: 0,
    examDate: new Date(),
    status: "Present",
    topic: [],
    testType: [], 
    examType: "E-EA", // Default to Exam by EA
  });

  useEffect(() => {
    if (open && currentStudent) {
      const stream = currentStudent.Stream || "";
      const scheme = MARK_SCHEMES[stream] || {};
      
      const subjects = ["Physics", "Chemistry", "Maths"];
      const outOf = subjects.reduce((sum, subj) => sum + (scheme[subj] || 0), 0);

      setFormData(prev => ({
        ...prev,
        stream,
        outOf: outOf > 0 ? outOf : 300,
        subject: currentStudent.Subject || "Physics",
        marks: {},
        topic: [],
        testType: [],
        examType: "E-EA"
      }));
    }
  }, [open, currentStudent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (event, newValue) => {
    const selectedTopics = newValue.map(item => item.value);
    setFormData(prev => ({ ...prev, topic: selectedTopics }));
  };

  const handleDatePickerChange = (date) => {
    setFormData((prev) => ({ ...prev, examDate: date }));
  };

  const handleTestTypeChange = (testType) => {
    setFormData((prev) => ({ ...prev, testType: [testType] }));
  };

  // Handle exam type change (Origin)
  const handleExamTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, examType: e.target.value }));
  };

  const handleMarksChange = (e, subject) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subject]: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const examDateISO = new Date(formData.examDate).toISOString();
      
      const studentExamData = {
        userId: currentStudent.id,
        studentId: currentStudent.id,
        studentName: currentStudent.Name,
        stream: formData.stream,
        examDate: examDateISO,
        examName: formData.topic,
        recordedBy: currentStudent.id,
        status: formData.status,
        topic: formData.topic,
        Subject: formData.subject,
        testType: formData.testType,
        examType: formData.examType, // Use selected exam type
        isRevisionProgramJEEMains2026Student: currentStudent.isRevisionProgramJEEMains2026Student || false,
      };

      const subjects = ["Physics", "Chemistry", "Maths"];
      subjects.forEach(subj => {
         const marks = Number(formData.marks[subj]);
         if (!isNaN(marks)) {
            studentExamData[subj.toLowerCase()] = marks;
            studentExamData[`max${subj}`] = MARK_SCHEMES[formData.stream]?.[subj] || 100;
         }
      });

      await dispatch(addStudentExam(studentExamData));
      if (currentStudent?.id) {
          await dispatch(fetchStudentExamsByStudent(currentStudent.id));
      }
      onClose();
      
    } catch (error) {
      console.error("Failed to add exam:", error);
      alert("Failed to add exam. Please try again.");
    }
  };

  const subjectsToShow = useMemo(() => {
    const studentSubject = currentStudent?.Subject; 
    const allSubjects = ["Physics", "Chemistry", "Maths"];
    
    let validSubjects = allSubjects.filter(s => 
       MARK_SCHEMES[formData.stream]?.[s] !== undefined
    );
    if (validSubjects.length === 0) validSubjects = allSubjects; 

    if (studentSubject) {
        if (studentSubject === "Physics") return validSubjects.filter(s => s === "Physics");
        if (studentSubject === "Chemistry") return validSubjects.filter(s => s === "Chemistry");
        if (studentSubject === "Maths" || studentSubject === "Mathematics") return validSubjects.filter(s => s === "Maths");
    }

    return validSubjects;
  }, [currentStudent, formData.stream]);

  const filteredTopicOptions = useMemo(() => {
     if (!currentStudent?.Subject) return [];
     const studentSubjectLower = currentStudent.Subject.toLowerCase();
     const relevantOptions = topicOptions.filter(t => 
        t.subject?.toLowerCase() === studentSubjectLower
     );
     const topicNames = relevantOptions.map(t => t.topic);
     const uniqueTopics = [...new Set(topicNames)];
     return uniqueTopics.sort((a, b) => a.localeCompare(b)).map(topic => ({ value: topic, label: topic }));
  }, [currentStudent]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
           Add Self Assessment
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
           <form>
              <Box sx={{ mb: 2 }}>
                 <Typography variant="subtitle2" color="primary" sx={{ mb: 2, mt:1 }}>1. Exam Details</Typography>
                 
                 {/* Exam Origin Selection */}
                 <div style={{ marginTop: 0, background: "#f0f8ff", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #1976d2", marginBottom: 20 }}>
                    <div style={{ fontSize: "1.0rem", fontWeight: "600", color: "#292551", marginBottom: "10px", display: "flex", alignItems: "center" }}>
                      <FaUniversity style={{ marginRight: 8 }} /> Select Exam Origin
                    </div>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.examType === "E-EA"} onChange={() => handleExamTypeChange({ target: { value: "E-EA" } })} name="examType" value="E-EA" sx={{ p: 0.5, color: "#1976d2", "&.Mui-checked": { color: "#1976d2" }}} />}
                        label={<span>Exam by EA</span>}
                        sx={{ m: 0, border: formData.examType === "E-EA" ? "2px solid #1976d2" : "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: formData.examType === "E-EA" ? "#e3f2fd" : "white", p: 0.5, minWidth: "140px" }}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formData.examType === "CA"} onChange={() => handleExamTypeChange({ target: { value: "CA" } })} name="examType" value="CA" sx={{ p: 0.5, color: "#d32f2f", "&.Mui-checked": { color: "#d32f2f" }}} />}
                        label={<span>College Exam (CA)</span>}
                        sx={{ m: 0, border: formData.examType === "CA" ? "2px solid #d32f2f" : "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: formData.examType === "CA" ? "#ffebee" : "white", p: 0.5, minWidth: "140px" }}
                      />
                    </Box>
                 </div>

                 <Stack spacing={2}>
                    <MuiDatePicker
                      label="Exam Date"
                      value={formData.examDate}
                      onChange={handleDatePickerChange}
                      required
                    />
                    
                    <Autocomplete
                        multiple
                        id="topic-multiselect"
                        options={filteredTopicOptions}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={filteredTopicOptions.filter(opt => formData.topic.includes(opt.value))}
                        onChange={handleTopicChange}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip 
                              variant="outlined" 
                              label={option.label} 
                              {...getTagProps({ index })} 
                              key={option.value}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Topics Covered"
                            placeholder="Select topics"
                            fullWidth
                          />
                        )}
                    />
                 </Stack>
              </Box>

              {/* Revision Test Type Selection */}
              {currentStudent?.isRevisionProgramJEEMains2026Student && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, borderLeft: "4px solid #7b1fa2" }}>
                   <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: "#292551", fontWeight: "600", fontSize: "1.0rem" }}>
                      <FaCheckSquare /> Revision Test Type
                   </Typography>
                   <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={<Radio checked={formData.testType.includes("generalExam")} onChange={() => handleTestTypeChange("generalExam")} size="small" sx={{color: '#ed6c02', '&.Mui-checked': {color: '#ed6c02'}}} />}
                        label={<Typography fontSize="0.85rem">General</Typography>}
                        sx={{ border: formData.testType.includes("generalExam") ? "2px solid #ed6c02" : "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: formData.testType.includes("generalExam") ? "#fff3e0" : "white", p: 0.5, minWidth: "130px", m:0 }}
                      />
                      <FormControlLabel
                        control={<Radio checked={formData.testType.includes("weekendTest")} onChange={() => handleTestTypeChange("weekendTest")} size="small" sx={{color: '#1976d2', '&.Mui-checked': {color: '#1976d2'}}} />}
                        label={<Typography fontSize="0.85rem">Weekend</Typography>}
                        sx={{ border: formData.testType.includes("weekendTest") ? "2px solid #1976d2" : "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: formData.testType.includes("weekendTest") ? "#e3f2fd" : "white", p: 0.5, minWidth: "130px", m:0 }}
                      />
                      <FormControlLabel
                        control={<Radio checked={formData.testType.includes("cumulativeTest")} onChange={() => handleTestTypeChange("cumulativeTest")} size="small" sx={{color: '#7b1fa2', '&.Mui-checked': {color: '#7b1fa2'}}} />}
                        label={<Typography fontSize="0.85rem">Cumulative</Typography>}
                        sx={{ border: formData.testType.includes("cumulativeTest") ? "2px solid #7b1fa2" : "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: formData.testType.includes("cumulativeTest") ? "#f3e5f5" : "white", p: 0.5, minWidth: "130px", m:0 }}
                      />
                      <FormControlLabel
                        control={<Radio checked={formData.testType.includes("grandTest")} onChange={() => handleTestTypeChange("grandTest")} size="small" sx={{color: '#2e7d32', '&.Mui-checked': {color: '#2e7d32'}}} />}
                        label={<Typography fontSize="0.85rem">Grand</Typography>}
                        sx={{ border: formData.testType.includes("grandTest") ? "2px solid #2e7d32" : "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: formData.testType.includes("grandTest") ? "#e8f5e9" : "white", p: 0.5, minWidth: "130px", m:0 }}
                      />
                   </Box>
                </Box>
              )}

              <Box>
                 <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>2. Score Entry</Typography>
                 <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                    {subjectsToShow.map(subj => (
                       <MuiInput 
                          key={subj}
                          label={subj}
                          type="number"
                          value={formData.marks[subj] || ''}
                          onChange={(e) => handleMarksChange(e, subj)}
                          sx={{ flex: 1, minWidth: '100px' }}
                          placeholder={`Max ${MARK_SCHEMES[formData.stream]?.[subj] || 100}`}
                       />
                    ))}
                 </Stack>
              </Box>
           </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
           <Button onClick={onClose} color="inherit">Cancel</Button>
           <Button onClick={handleSubmit} variant="contained" color="primary">Save Exam</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddExamDialog;