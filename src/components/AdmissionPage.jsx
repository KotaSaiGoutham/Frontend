import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Stack,
  TablePagination,
  Avatar,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  FaUserPlus,
  FaUsers,
  FaCloudUploadAlt,
  FaFilter,
  FaSearch,
  FaDatabase,
  FaFileCsv,
  FaFileExcel,
  FaFile,
  FaEdit,
  FaCheck,
  FaTimes,
  FaStar,
  FaPhoneAlt,
  FaThumbsUp,
  FaGraduationCap,
  FaBan,
  FaDownload,
  FaGlobe,
  FaWhatsapp,
  FaQuestionCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, isValid } from "date-fns";
import {
  uploadStudentData,
  fetchUploadHistory,
  createLead,
  fetchLeads,
  updateLeadStatus,
} from "../redux/actions";

import "./AdmissionPage.css"; 

// --- STATUS CONFIGURATION ---
const getStatusConfig = (status) => {
  switch (status) {
    case "new":
      return { icon: <FaStar />, color: "#2196f3", bg: "#e3f2fd", label: "New Lead" };
    case "contacted":
      return { icon: <FaPhoneAlt />, color: "#00bcd4", bg: "#e0f7fa", label: "Contacted" };
    case "interested":
      return { icon: <FaThumbsUp />, color: "#ff9800", bg: "#fff3e0", label: "Interested" };
    case "enrolled":
      return { icon: <FaGraduationCap />, color: "#4caf50", bg: "#e8f5e9", label: "Enrolled" };
    case "rejected":
      return { icon: <FaBan />, color: "#f44336", bg: "#ffebee", label: "Rejected" };
    default:
      return { icon: <FaUsers />, color: "#757575", bg: "#f5f5f5", label: status };
  }
};

// --- SOURCE CONFIGURATION (Helper for Source Icons) ---
const getSourceIcon = (source) => {
  if (!source) return <FaQuestionCircle size={14} />;
  const s = source.toLowerCase();
  if (s.includes("whatsapp")) return <FaWhatsapp size={14} />;
  if (s.includes("urban")) return <FaGlobe size={14} />;
  return <FaUsers size={14} />;
};

const AdmissionPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- States ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Updated State with 'source'
  const [newLead, setNewLead] = useState({ 
    studentName: "", 
    phoneNumber: "", 
    status: "new", 
    source: "Urban Pro", 
    notes: "" 
  });
  
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [viewDataOpen, setViewDataOpen] = useState(false);

  const { uploadHistory, uploading } = useSelector((state) => state.admission);
  const { leads } = useSelector((state) => state.admission);

  useEffect(() => {
    dispatch(fetchUploadHistory());
    dispatch(fetchLeads());
  }, [dispatch]);

  // --- Handlers ---
  const handleOpenViewData = () => {
    dispatch(fetchUploadHistory());
    setViewDataOpen(true);
  };

  const startEditingNote = (lead) => {
    setEditingNoteId(lead.id);
    setTempNote(lead.notes || "");
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setTempNote("");
  };

  const saveNote = async (leadId) => {
    try {
      await dispatch(updateLeadStatus(leadId, { notes: tempNote }));
      showSnackbar("Note updated successfully", "success");
      setEditingNoteId(null);
      dispatch(fetchLeads());
    } catch (error) {
      showSnackbar("Failed to update note", "error");
    }
  };

  const handleDownloadFile = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      showSnackbar("File URL not found", "error");
    }
  };

  const leadStats = {
    contacted: leads.filter(lead => lead.status === "contacted").length,
    enrolled: leads.filter(lead => lead.status === "enrolled").length,
    interested: leads.filter(lead => lead.status === "interested").length,
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phoneNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024 * 1024) setSelectedFile(file);
    else showSnackbar("File too large (Max 50MB)", "error");
  };

  const handleUpload = async () => {
    if (!selectedFile) return showSnackbar("Please select a file", "error");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("uploadedBy", user?.subject || "Unknown");
    formData.append("uploadDate", new Date().toISOString());

    try {
      const interval = setInterval(() => setUploadProgress(p => p >= 90 ? 90 : p + 10), 200);
      await dispatch(uploadStudentData(formData));
      clearInterval(interval);
      setUploadProgress(100);
      showSnackbar("Uploaded successfully!", "success");
      setTimeout(() => { setSelectedFile(null); setUploadProgress(0); dispatch(fetchUploadHistory()); }, 1000);
    } catch (error) { showSnackbar("Upload failed", "error"); }
  };

  const handleCreateLead = async () => {
    if (!newLead.studentName || !newLead.phoneNumber) return showSnackbar("Name/Phone required", "error");
    try {
      await dispatch(createLead({ ...newLead, createdBy: user?.subject, createdAt: new Date().toISOString() }));
      showSnackbar("Lead created!", "success");
      setNewLead({ studentName: "", phoneNumber: "", status: "new", source: "Urban Pro", notes: "" });
      setLeadDialogOpen(false);
      dispatch(fetchLeads());
    } catch (error) { showSnackbar("Failed", "error"); }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await dispatch(updateLeadStatus(leadId, { status: newStatus }));
      showSnackbar(`Status updated to ${newStatus}!`, "success");
      dispatch(fetchLeads());
    } catch (error) { showSnackbar("Failed update", "error"); }
  };

  const formatDate = (d) => { try { return isValid(parseISO(d)) ? format(parseISO(d), "dd/MM/yyyy") : d; } catch { return d; }};
  const showSnackbar = (msg, sev) => setSnackbar({ open: true, message: msg, severity: sev });

  return (
    <div className="admission-page">
      
      {/* 1. Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="header-section">
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: 1 }}>Admission Hub</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Manage leads & Upload data</Typography>
          </Box>
          <Stack direction="row" spacing={3}>
             {[
               { label: 'CONTACTED', count: leadStats.contacted, icon: <FaPhoneAlt/>, bg: 'rgba(255,255,255,0.15)' },
               { label: 'ENROLLED', count: leadStats.enrolled, icon: <FaGraduationCap/>, bg: 'rgba(76,175,80,0.3)' },
               { label: 'INTERESTED', count: leadStats.interested, icon: <FaThumbsUp/>, bg: 'rgba(255,152,0,0.3)' },
             ].map((stat, idx) => (
               <Box key={idx} sx={{ textAlign: 'center' }}>
                 <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '1.2rem' }}>
                   {stat.icon}
                 </Box>
                 <Typography variant="h6" fontWeight="bold" sx={{lineHeight: 1}}>{stat.count}</Typography>
                 <Typography variant="caption" sx={{fontSize: '0.65rem', opacity: 0.9}}>{stat.label}</Typography>
               </Box>
             ))}
          </Stack>
        </Paper>
      </motion.div>

      {/* 2. Main Content Wrapper */}
      <div className="content-wrapper">
        
        {/* LEFT: Table Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="table-section">
          
          <div className="table-toolbar">
            <Stack direction="row" alignItems="center" spacing={1}>
              <FaUsers size={20} color="#1a237e" />
              <Typography variant="h6" fontWeight="700" color="#333">Student Leads</Typography>
              <Chip label={filteredLeads.length} size="small" color="primary" sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }} />
            </Stack>
            <TextField
              placeholder="Search student, phone..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 280, bgcolor: '#f8fafc' }}
              InputProps={{ startAdornment: <FaSearch style={{ marginRight: 10, color: '#999' }} /> }}
            />
          </div>

          <div className="table-container-scroll">
            <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>Contact</TableCell>
                  {/* ADDED SOURCE COLUMN */}
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: getStatusConfig(lead.status).color, width: 32, height: 32, fontSize: '0.9rem' }}>
                           {lead.studentName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600" color="#1e293b">{lead.studentName}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDate(lead.createdAt)}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontWeight="500">{lead.phoneNumber}</Typography>
                    </TableCell>

                    {/* DISPLAY SOURCE */}
                    <TableCell>
                       <Chip 
                          icon={getSourceIcon(lead.source)}
                          label={lead.source || "Other"} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.75rem', 
                            height: 24, 
                            borderColor: '#e2e8f0',
                            color: '#475569',
                            '& .MuiChip-icon': { color: '#64748b' }
                          }} 
                        />
                    </TableCell>

                    <TableCell>
                       <Chip 
                          icon={getStatusConfig(lead.status).icon}
                          label={getStatusConfig(lead.status).label}
                          size="small"
                          sx={{ 
                            bgcolor: getStatusConfig(lead.status).bg, 
                            color: getStatusConfig(lead.status).color,
                            fontWeight: 700,
                            border: `1px solid ${getStatusConfig(lead.status).bg}`,
                            '& .MuiChip-icon': { color: 'inherit' }
                          }} 
                        />
                    </TableCell>
                    
                    <TableCell sx={{ maxWidth: 280 }}>
                      {editingNoteId === lead.id ? (
                        <Paper elevation={3} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                          <TextField
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            size="small"
                            fullWidth
                            variant="standard"
                            autoFocus
                            placeholder="Type note..."
                            InputProps={{ disableUnderline: true, sx: { px: 1, fontSize: '0.85rem' } }}
                          />
                          <IconButton size="small" color="primary" onClick={() => saveNote(lead.id)}><FaCheck /></IconButton>
                          <IconButton size="small" color="error" onClick={cancelEditingNote}><FaTimes /></IconButton>
                        </Paper>
                      ) : (
                        <Box 
                          onClick={() => startEditingNote(lead)}
                          sx={{ 
                            display: 'flex', alignItems: 'center', gap: 1, 
                            cursor: 'pointer', p: 0.5, borderRadius: 1,
                            '&:hover': { bgcolor: '#f1f5f9' }
                          }}
                        >
                          <Typography variant="body2" sx={{ 
                              color: lead.notes ? '#334155' : '#94a3b8', 
                              fontStyle: lead.notes ? 'normal' : 'italic',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220
                            }}>
                            {lead.notes || "Click to add notes..."}
                          </Typography>
                          <FaEdit size={12} color="#cbd5e1" />
                        </Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 32, 
                          fontSize: '0.8rem',
                          bgcolor: 'white',
                          '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1 }
                        }}
                      >
                         {["new", "contacted", "interested", "enrolled", "rejected"].map(s => {
                           const config = getStatusConfig(s);
                           return (
                             <MenuItem key={s} value={s}>
                               <ListItemIcon sx={{ minWidth: 28, color: config.color, fontSize: 16 }}>
                                 {config.icon}
                               </ListItemIcon>
                               <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                 {config.label}
                               </ListItemText>
                             </MenuItem>
                           );
                         })}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={filteredLeads.length}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </motion.div>

        {/* RIGHT: Sidebar Section */}
        <div className="actions-section">
          
          <Button
            variant="contained"
            fullWidth
            startIcon={<FaUserPlus />}
            onClick={() => setLeadDialogOpen(true)}
            sx={{ 
              background: 'linear-gradient(45deg, #00b09b, #96c93d)', 
              py: 1.5, fontWeight: 700, borderRadius: 3, 
              boxShadow: '0 4px 14px 0 rgba(0,176,155,0.39)',
              '&:hover': { boxShadow: '0 6px 20px rgba(0,176,155,0.23)' }
            }}
          >
            ADD NEW LEAD
          </Button>

          <div className="action-card">
             <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 0.5 }}>
               <FaFilter /> FILTER BY STATUS
             </Typography>
             <Select 
                fullWidth 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                size="small"
                sx={{ bgcolor: '#f8fafc' }}
             >
                <MenuItem value="all">Show All</MenuItem>
                {["new", "contacted", "interested", "enrolled", "rejected"].map(s => (
                  <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
                ))}
             </Select>
          </div>

          <div className="action-card">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaCloudUploadAlt color="#0288d1" size={18} />
              <Typography variant="subtitle2" fontWeight="700" color="#333">Bulk Import</Typography>
            </Box>

            <div className="upload-box" onClick={() => document.getElementById('file-input').click()}>
              <input type="file" id="file-input" onChange={handleFileSelect} style={{ display: 'none' }} />
              {selectedFile ? (
                <Box>
                  <FaFileExcel size={30} color="#2e7d32" style={{marginBottom: 8}} />
                  <Typography variant="caption" display="block" fontWeight="600" noWrap sx={{ maxWidth: 180 }}>{selectedFile.name}</Typography>
                  <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); handleUpload(); }} sx={{ mt: 1, borderRadius: 5 }}>
                    Start Upload
                  </Button>
                </Box>
              ) : (
                <Box>
                   <FaCloudUploadAlt size={30} color="#cbd5e1" style={{marginBottom: 8}} />
                   <Typography variant="caption" color="#64748b" display="block">Click to Browse</Typography>
                   <Typography variant="caption" color="#94a3b8" fontSize="0.65rem">CSV/Excel (Max 50MB)</Typography>
                </Box>
              )}
            </div>
            
            {uploading && <LinearProgress sx={{ borderRadius: 1, mt: 1 }} value={uploadProgress} variant="determinate" />}

            <Button fullWidth size="small" variant="outlined" startIcon={<FaDatabase />} onClick={handleOpenViewData} sx={{ mt: 1, borderRadius: 2 }}>
              View History
            </Button>
          </div>

        </div>
      </div>

      {/* --- View Data Dialog --- */}
      <Dialog open={viewDataOpen} onClose={() => setViewDataOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           <FaDatabase color="#1a237e" /> Uploaded Files History
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
           <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                   <TableRow>
                     <TableCell sx={{fontWeight: 700}}>File Name</TableCell>
                     <TableCell sx={{fontWeight: 700}}>Upload Date</TableCell>
                     <TableCell sx={{fontWeight: 700}}>Status</TableCell>
                     <TableCell align="right" sx={{fontWeight: 700}}>Action</TableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                  {uploadHistory && uploadHistory.map((file) => {
                    if (!file) return null;
                    return (
                      <TableRow key={file.id || Math.random()}>
                        <TableCell>
                           <Stack direction="row" alignItems="center" spacing={1}>
                              <FaFileExcel color="#2e7d32" />
                              <Box>
                                 <Typography variant="body2" fontWeight="500">{file?.fileName || "Unknown"}</Typography>
                                 <Typography variant="caption" color="text.secondary">{file?.fileType}</Typography>
                              </Box>
                           </Stack>
                        </TableCell>
                        <TableCell>{file?.uploadDate ? formatDate(file.uploadDate) : "-"}</TableCell>
                        <TableCell>
                           <Chip 
                             label={file?.studentCount ? `${file.studentCount} Records` : 'File Stored'} 
                             size="small" 
                             color={file?.studentCount ? "success" : "default"} 
                             variant="outlined"
                           />
                        </TableCell>
                        <TableCell align="right">
                           {file?.fileUrl ? (
                             <Tooltip title="Download File">
                               <IconButton color="primary" onClick={() => handleDownloadFile(file.fileUrl)}>
                                 <FaDownload size={14} />
                               </IconButton>
                             </Tooltip>
                           ) : (
                             <Typography variant="caption" color="text.disabled">No Link</Typography>
                           )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
           </TableContainer>
        </DialogContent>
        <DialogActions><Button onClick={() => setViewDataOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      {/* --- Add Lead Dialog (UPDATED) --- */}
      <Dialog open={leadDialogOpen} onClose={() => setLeadDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {/* Name */}
            <TextField 
              label="Student Name" 
              value={newLead.studentName} 
              onChange={(e) => setNewLead({...newLead, studentName: e.target.value})} 
              size="small" 
              fullWidth 
              required
            />
            
            {/* Phone */}
            <TextField 
              label="Phone Number" 
              value={newLead.phoneNumber} 
              onChange={(e) => setNewLead({...newLead, phoneNumber: e.target.value})} 
              size="small" 
              fullWidth 
              required
            />

            {/* Status Dropdown */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Lead Status</Typography>
              <Select
                value={newLead.status}
                onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                size="small"
                fullWidth
              >
                <MenuItem value="new">New Lead</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="interested">Interested</MenuItem>
                <MenuItem value="enrolled">Enrolled</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </Box>

            {/* Source Dropdown */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Lead Source</Typography>
              <Select
                value={newLead.source}
                onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                size="small"
                fullWidth
              >
                <MenuItem value="Bulk WhatsApp">Bulk WhatsApp</MenuItem>
                <MenuItem value="Urban Pro">Urban Pro</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </Box>

            {/* Notes */}
            <TextField 
              label="Initial Notes" 
              value={newLead.notes} 
              onChange={(e) => setNewLead({...newLead, notes: e.target.value})} 
              size="small" 
              fullWidth 
              multiline 
              rows={3} 
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateLead} disabled={!newLead.studentName || !newLead.phoneNumber}>Save Lead</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

    </div>
  );
};

export default AdmissionPage;