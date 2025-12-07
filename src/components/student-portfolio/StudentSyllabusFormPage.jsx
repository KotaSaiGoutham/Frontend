import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Stack,
  Autocomplete,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO } from "date-fns";
import {
  FaBook,
  FaSave,
  FaStickyNote,
  FaCheckCircle,
  FaHistory,
  FaLayerGroup,
  FaPenNib
} from "react-icons/fa";
import { MuiDatePicker } from "../customcomponents/MuiCustomFormFields"
import { topicOptions } from "../../mockdata/Options"
import { useSnackbar } from "../customcomponents/SnackbarContext"
import { addStudentSyllabus,fetchStudentSyllabus } from '../../redux/actions'

// Import the new CSS file
import "./StudentSyllabus.css";

const StudentSyllabusFormPage = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const currentStudent = useSelector((state) => state.auth?.currentStudent);
const syllabusHistory = useSelector((state) => state.studentSyllabus?.history || []); 
const historyLoading = useSelector((state) => state.studentSyllabus?.loading || false);

  const [formData, setFormData] = useState({
    date: new Date(),
    topics: [],
    subTopicNotes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentStudent?.id) {
      dispatch(fetchStudentSyllabus(currentStudent.id));
    }
  }, [dispatch, currentStudent]);

  const filteredTopicOptions = useMemo(() => {
    if (!currentStudent?.Subject) return [];
    const subjectLower = currentStudent.Subject.toLowerCase();
    const relevantOptions = topicOptions.filter(t => 
       t.subject?.toLowerCase() === subjectLower
    );
    const topicNames = relevantOptions.map(t => t.topic);
    const uniqueTopics = [...new Set(topicNames)];
    return uniqueTopics.sort().map(topic => ({ value: topic, label: topic }));
  }, [currentStudent]);

  const handleDateChange = (newDate) => setFormData(prev => ({ ...prev, date: newDate }));
  
  const handleTopicChange = (event, newValue) => {
    const selectedValues = newValue.map(item => item.value);
    setFormData(prev => ({ ...prev, topics: selectedValues }));
  };

  const handleNotesChange = (e) => setFormData(prev => ({ ...prev, subTopicNotes: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.topics.length === 0) {
      showSnackbar("Please select at least one topic.", "warning");
      return;
    }

    setLoading(true);
    try {
      await dispatch(addStudentSyllabus({
        studentId: currentStudent.id,
        studentName: currentStudent.Name,
        subject: currentStudent.Subject,
        facultyId: currentStudent.facultyId,
        date: formData.date.toISOString(),
        topics: formData.topics,
        notes: formData.subTopicNotes
      }));

      showSnackbar("Syllabus updated successfully!", "success");
      setFormData({ date: new Date(), topics: [], subTopicNotes: "" });
      dispatch(fetchStudentSyllabus(currentStudent.id));
      
    } catch (error) {
      console.error(error);
      showSnackbar(error.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="syllabus-page-container">
        
        {/* Header */}
        <div className="syllabus-header">
            <div className="syllabus-header-icon">
                <FaBook size={24} />
            </div>
            <Box>
                <Typography variant="h5" fontWeight="800" color="#1e293b">Weekly Syllabus Tracker</Typography>
                <Typography variant="body2" color="#64748b">
                    Subject: <strong>{currentStudent?.Subject || "N/A"}</strong>
                </Typography>
            </Box>
        </div>

        {/* Main Content Grid (Flexbox in CSS) */}
        <div className="syllabus-content-grid">
          
          {/* --- LEFT SIDE: FORM --- */}
          <div className="syllabus-card syllabus-form-section">
            <Typography variant="h6" fontWeight="700" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#334155' }}>
                <FaPenNib color="#1976d2" size={18} /> New Entry
            </Typography>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Stack spacing={3} sx={{ flex: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Select Date</Typography>
                  <MuiDatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Topics Covered</Typography>
                  <Autocomplete
                    multiple
                    id="syllabus-topics"
                    options={filteredTopicOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={filteredTopicOptions.filter(opt => formData.topics.includes(opt.value))}
                    onChange={handleTopicChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip 
                          variant="outlined" 
                          label={option.label} 
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 500 }}
                          {...getTagProps({ index })} 
                          key={option.value}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} placeholder="Select topics..." fullWidth />}
                  />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Sub-topics / Remarks</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6} 
                    placeholder="E.g., Solved Exercise 2.1, Focused on derivations..."
                    value={formData.subTopicNotes}
                    onChange={handleNotesChange}
                    variant="outlined"
                    sx={{ bgcolor: '#f8fafc', flex: 1, '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }}
                  />
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <FaSave />}
                  sx={{ 
                    py: 1.5, 
                    bgcolor: '#1976d2',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 6px -1px rgba(25, 118, 210, 0.2)',
                    '&:hover': { bgcolor: '#1565c0', boxShadow: '0 10px 15px -3px rgba(25, 118, 210, 0.3)' }
                  }}
                >
                  {loading ? "Saving..." : "Save Syllabus"}
                </Button>
              </Stack>
            </form>
          </div>

          {/* --- RIGHT SIDE: HISTORY LIST --- */}
          <div className="syllabus-card syllabus-history-section">
             <div className="history-header">
                <Typography variant="h6" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#334155' }}>
                    <FaHistory color="#ea580c" size={18} /> Syllabus History
                </Typography>
             </div>

             <div className="history-list-container">
                {historyLoading ? (
                   <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                      <CircularProgress />
                   </Box>
                ) : syllabusHistory.length === 0 ? (
                   <Box sx={{ textAlign: 'center', p: 5, color: '#94a3b8', mt: 5 }}>
                      <FaLayerGroup size={40} style={{ marginBottom: 10, opacity: 0.5 }} />
                      <Typography>No syllabus records found.</Typography>
                   </Box>
                ) : (
                   <List sx={{ p: 0 }}>
                      {syllabusHistory.map((item, index) => (
                         <React.Fragment key={item.id}>
                            <ListItem alignItems="flex-start" sx={{ px: 0, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                               <ListItemIcon sx={{ minWidth: 40, mt: 1 }}>
                                  <FaCheckCircle color="#10b981" size={20} />
                               </ListItemIcon>
                               <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                       <Typography variant="subtitle1" fontWeight="700" color="#1e293b">
                                          {format(parseISO(item.date), "EEEE, dd MMM yyyy")}
                                       </Typography>
                                       <Chip label={item.subject} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 600, fontSize: '0.75rem' }} />
                                    </Box>
                                  }
                                  secondary={
                                    <Stack spacing={1.5}>
                                       {/* Topics Badges */}
                                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                          {item.topics.map((topic, idx) => (
                                             <Chip 
                                                key={idx} 
                                                label={topic} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ 
                                                   borderRadius: 1, 
                                                   borderColor: '#cbd5e1', 
                                                   color: '#475569',
                                                   bgcolor: 'white'
                                                }} 
                                             />
                                          ))}
                                       </Box>
                                       
                                       {/* Notes Section */}
                                       {item.notes && (
                                          <Box sx={{ display: 'flex', gap: 1, mt: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, borderLeft: '3px solid #cbd5e1' }}>
                                             <FaStickyNote color="#94a3b8" size={14} style={{ marginTop: 3, flexShrink: 0 }} />
                                             <Typography variant="body2" color="#475569" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {item.notes}
                                             </Typography>
                                          </Box>
                                       )}
                                    </Stack>
                                  }
                               />
                            </ListItem>
                         </React.Fragment>
                      ))}
                   </List>
                )}
             </div>
          </div>

        </div>
      </div>
    </LocalizationProvider>
  );
};

export default StudentSyllabusFormPage;