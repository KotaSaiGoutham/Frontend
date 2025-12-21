import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, 
  FaSearch, FaTrashAlt, FaDownload, FaSpinner, FaFile, FaExclamationTriangle 
} from "react-icons/fa";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton 
} from "@mui/material"; // Using MUI for Dialog (Assuming you have it, based on previous context)
import { uploadImportantFile, fetchImportantFiles, deleteImportantFile } from "../redux/actions";

// --- THEME CONFIGURATION ---
const theme = {
  primary: "#6366f1",
  primaryBg: "#e0e7ff",
  accent: "#4f46e5",
  bg: "#f3f4f6",
  white: "#ffffff",
  textMain: "#111827",
  textSub: "#6b7280",
  border: "#e5e7eb",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  success: "#10b981",
  glass: "rgba(255, 255, 255, 0.95)"
};

const styles = {
  wrapper: {
    padding: "30px",
    background: theme.bg,
    minHeight: "calc(100vh - 64px)",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  header: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: { fontSize: "1.75rem", fontWeight: "800", color: theme.textMain, margin: 0 },
  subTitle: { color: theme.textSub, fontSize: "0.95rem" },

  // --- MAIN LAYOUT (Reversed) ---
  container: {
    display: "flex",
    gap: "24px",
    height: "calc(100vh - 180px)",
    alignItems: "flex-start"
  },

  // 1. LEFT COLUMN (Files List)
  leftCol: {
    flex: "1",
    background: theme.white,
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    border: `1px solid ${theme.border}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  toolbar: {
    padding: "20px",
    borderBottom: `1px solid ${theme.border}`,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    background: theme.bg,
    padding: "10px 16px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid transparent",
    transition: "all 0.2s"
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    marginLeft: "12px",
    width: "100%",
    fontSize: "0.95rem",
    color: theme.textMain
  },
  
  listContent: {
    flex: "1",
    overflowY: "auto",
    padding: "10px",
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "8px",
    background: theme.white,
    border: `1px solid ${theme.border}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default"
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "16px",
    fontSize: "1.5rem",
    flexShrink: 0
  },
  fileInfo: { flex: "1", minWidth: 0 },
  fileName: { fontWeight: "600", fontSize: "0.95rem", color: theme.textMain, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  fileMeta: { fontSize: "0.8rem", color: theme.textSub, display: "flex", alignItems: "center", gap: "10px" },
  badge: { padding: "2px 8px", borderRadius: "4px", background: theme.bg, fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase" },
  
  actions: { display: "flex", gap: "8px" },
  actionBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: `1px solid ${theme.border}`,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    color: theme.textSub
  },

  // 2. RIGHT COLUMN (Upload)
  rightCol: {
    width: "350px",
    flexShrink: 0,
    background: theme.white,
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    border: `1px solid ${theme.border}`,
    padding: "24px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "sticky",
    top: "24px"
  },
  dropZone: {
    width: "100%",
    height: "100%",
    border: `2px dashed ${theme.primary}`,
    borderRadius: "12px",
    background: "linear-gradient(145deg, #ffffff, #f9fafb)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
    padding: "20px",
    transition: "all 0.3s ease"
  },
  dropZoneActive: {
    background: theme.primaryBg,
    borderColor: theme.accent,
    transform: "scale(0.98)"
  },
  uploadTitle: { fontSize: "1.1rem", fontWeight: "700", color: theme.textMain, marginTop: "16px", marginBottom: "8px" },
  uploadSub: { fontSize: "0.85rem", color: theme.textSub, padding: "0 20px", lineHeight: "1.4" },
  
  emptyState: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: theme.textSub,
    opacity: 0.7
  }
};

const ImportantFiles = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const { importantFiles = [], fetchingImportantFiles, uploadingImportantFile } = useSelector(
    (state) => state.lectureMaterials || {}
  );

  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- DELETE DIALOG STATE ---
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchImportantFiles());
  }, [dispatch]);

  // Handlers
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    dispatch(uploadImportantFile(formData));
  };

  // --- DELETE LOGIC ---
  const promptDelete = (id) => {
    setFileToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      dispatch(deleteImportantFile(fileToDelete));
    }
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  // Helper for Icons & Colors
  const getFileStyle = (type) => {
    if (type.includes("pdf")) return { icon: <FaFilePdf />, color: "#fee2e2", text: "#ef4444" };
    if (type.includes("word")) return { icon: <FaFileWord />, color: "#dbeafe", text: "#3b82f6" };
    if (type.includes("excel")) return { icon: <FaFileExcel />, color: "#d1fae5", text: "#10b981" };
    if (type.includes("image")) return { icon: <FaFileImage />, color: "#fef3c7", text: "#f59e0b" };
    return { icon: <FaFile />, color: "#f3f4f6", text: "#6b7280" };
  };

  const filteredFiles = importantFiles.filter(file => 
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Important Files</h2>
          <span style={styles.subTitle}>Manage centralized resources and documents</span>
        </div>
      </div>

      <div style={styles.container}>
        
        {/* 1. LEFT: File List (70%) */}
        <div style={styles.leftCol}>
          {/* Toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.searchWrapper}>
              <FaSearch color={theme.textSub} />
              <input 
                style={styles.searchInput} 
                placeholder="Search files..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{fontSize: '0.85rem', fontWeight: 600, color: theme.textSub}}>
              {filteredFiles.length} Documents
            </div>
          </div>

          {/* Scrollable List */}
          <div style={styles.listContent}>
            {fetchingImportantFiles && importantFiles.length === 0 ? (
              <div style={styles.emptyState}>
                <FaSpinner className="spin" size={30} color={theme.primary} />
                <p style={{marginTop: 10}}>Loading library...</p>
              </div>
            ) : filteredFiles.length > 0 ? (
              filteredFiles.map((file) => {
                const style = getFileStyle(file.fileType);
                return (
                  <div key={file.id} style={styles.fileItem} className="file-row">
                    <div style={{ ...styles.iconBox, background: style.color, color: style.text }}>
                      {style.icon}
                    </div>
                    <div style={styles.fileInfo}>
                      <span style={styles.fileName} title={file.fileName}>{file.fileName}</span>
                      <div style={styles.fileMeta}>
                        <span style={styles.badge}>{file.fileType?.split('/')[1] || 'FILE'}</span>
                        <span>• {new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={styles.actions}>
                      <a 
                        href={file.fileUrl} target="_blank" rel="noreferrer" 
                        style={styles.actionBtn} className="btn-hover" title="Download"
                      >
                        <FaDownload size={14} color={theme.primary} />
                      </a>
                      <button 
                        onClick={() => promptDelete(file.id)} 
                        style={styles.actionBtn} className="btn-hover-danger" title="Delete"
                      >
                        <FaTrashAlt size={14} color={theme.danger} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.emptyState}>
                <FaFile size={40} style={{marginBottom: 10}} />
                <p>No files found.</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. RIGHT: Upload Zone (30% / 350px) */}
        <div style={styles.rightCol}>
          <div 
            style={{ ...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}) }}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" ref={fileInputRef} hidden 
              onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])} 
            />
            
            {uploadingImportantFile ? (
              <>
                <FaSpinner className="spin" size={40} color={theme.primary} />
                <span style={styles.uploadTitle}>Uploading...</span>
                <span style={styles.uploadSub}>Please wait while we process your file.</span>
              </>
            ) : (
              <>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', background: theme.primaryBg, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15
                }}>
                  <FaCloudUploadAlt size={28} color={theme.primary} />
                </div>
                <span style={styles.uploadTitle}>Upload New File</span>
                <span style={styles.uploadSub}>Drag & drop here or click to browse</span>
              </>
            )}
          </div>
        </div>

      </div>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { borderRadius: 16, padding: 10 }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minWidth: '300px' }}>
          <div style={{ 
            width: 50, height: 50, borderRadius: '50%', background: theme.dangerLight, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 
          }}>
            <FaExclamationTriangle size={24} color={theme.danger} />
          </div>
          <Typography variant="h6" style={{ fontWeight: 700, color: theme.textMain, marginBottom: 8 }}>
            Delete File?
          </Typography>
          <Typography variant="body2" style={{ color: theme.textSub, textAlign: 'center', marginBottom: 24 }}>
            This action cannot be undone. Are you sure you want to delete this file permanently?
          </Typography>
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <Button 
              onClick={cancelDelete} 
              variant="outlined" 
              fullWidth
              style={{ 
                borderRadius: 8, textTransform: 'none', fontWeight: 600, 
                borderColor: theme.border, color: theme.textMain 
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              variant="contained" 
              fullWidth
              disableElevation
              style={{ 
                borderRadius: 8, textTransform: 'none', fontWeight: 600, 
                backgroundColor: theme.danger 
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Hover Effects */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .file-row:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: ${theme.primaryBg}; }
        .btn-hover:hover { background: ${theme.primaryBg}; border-color: ${theme.primary}; }
        .btn-hover-danger:hover { background: #fee2e2; border-color: ${theme.danger}; }
      `}</style>
    </div>
  );
};

export default ImportantFiles;