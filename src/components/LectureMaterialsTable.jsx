import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaTrashAlt,
  FaCheck,
  FaLock,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaFilePowerpoint,
  FaClipboardList
} from "react-icons/fa";
import {
  fetchStudentLectureMaterials,
  uploadLectureMaterial,
  deleteLectureMaterial,
} from "../redux/actions";

// --- INLINE STYLES ---
const colors = {
  primary: "#4f46e5",
  primaryLight: "#e0e7ff",
  secondary: "#0ea5e9", // For Worksheet section
  secondaryLight: "#e0f2fe",
  success: "#10b981",
  successLight: "#ecfdf5",
  locked: "#94a3b8",
  border: "#e2e8f0",
  textMain: "#1e293b",
  textSub: "#64748b",
  white: "#ffffff",
  bg: "#f1f5f9",
  danger: "#ef4444"
};

const styles = {
  wrapper: {
    padding: "20px",
    background: colors.bg,
    borderRadius: "16px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    background: colors.white,
    padding: "16px 24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  titleGroup: { display: "flex", flexDirection: "column" },
  title: { margin: 0, color: colors.textMain, fontSize: "1.25rem", fontWeight: "700" },
  subtitle: { fontSize: "0.875rem", color: colors.textSub, marginTop: "4px" },
  
  // Week Navigation
  weekNav: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f8fafc",
    padding: "6px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
  },
  navBtn: {
    background: "white",
    border: `1px solid ${colors.border}`,
    cursor: "pointer",
    color: colors.textSub,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "6px",
    transition: "all 0.2s",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
  },
  currentWeek: { fontWeight: "600", fontSize: "0.9rem", color: colors.primary, minWidth: "120px", textAlign: "center" },

  // Class Session Container
  classContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  classCard: {
    background: colors.white,
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: `1px solid ${colors.border}`,
    overflow: "hidden"
  },
  
  // Class Header Strip
  classHeader: {
    background: "#f8fafc",
    padding: "12px 24px",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  dateBadge: {
    background: colors.primary,
    color: "white",
    padding: "4px 12px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  timeBadge: {
    color: colors.textSub,
    fontWeight: "600",
    fontSize: "0.9rem"
  },

  // Sections Wrapper
  sectionsWrapper: {
    display: "flex",
    flexWrap: "wrap", // Allows stacking on mobile
  },
  
  // Section: Presentation
  sectionPPT: {
    flex: "1",
    minWidth: "300px",
    padding: "20px",
    borderRight: `1px solid ${colors.border}`,
  },
  // Section: Worksheet
  sectionWorksheet: {
    flex: "2", // Takes up more space
    minWidth: "300px",
    padding: "20px",
    background: "#fafafa" // Slight contrast
  },

  sectionTitle: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textSub,
    fontWeight: "700",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  // Flow Grid
  cardGrid: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },

  // Material Card
  card: {
    width: "110px",
    height: "100px",
    background: colors.white,
    border: `1px dashed #cbd5e1`,
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: "8px",
  },
  cardUploaded: {
    background: colors.successLight,
    border: `1px solid ${colors.success}`,
    boxShadow: "0 2px 4px rgba(16, 185, 129, 0.1)"
  },
  cardLocked: {
    background: "#f1f5f9",
    border: `1px solid ${colors.border}`,
    cursor: "not-allowed",
    opacity: 0.6,
  },
  
  // Content
  iconArea: { fontSize: "1.4rem", marginBottom: "8px" },
  textArea: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" },
  label: { fontSize: "0.65rem", color: colors.textSub, fontWeight: "700", textAlign: "center", lineHeight: "1.2", marginBottom: "4px" },
  status: { fontSize: "0.7rem", fontWeight: "700", color: colors.primary },
  fileName: { fontSize: "0.65rem", color: "#065f46", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "90px" },

  // Arrows/Connectors
  connector: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100px", // Match card height
    color: colors.locked
  },

  // Overlays
  actionOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    borderRadius: "10px",
    zIndex: 10,
  },
  iconBtn: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },
  
  emptyState: { textAlign: "center", padding: "40px", color: colors.textSub, fontStyle: "italic" },
  uploadBar: { background: colors.primaryLight, color: colors.primary, padding: "10px", borderRadius: "8px", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: "600" }
};

// --- SUB-COMPONENT: Material Card ---
const MaterialCard = ({ classId, fileType, file, isLocked, onUpload, onDelete, label, customIcon }) => {
  const fileInputRef = useRef(null);
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    // If it's the "Create Worksheet" step, we might want to open a dialog later
    // For now, it behaves like a normal upload
    if (!isLocked && !file) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) onUpload(e.target.files[0], classId, fileType);
  };

  // Dynamic Styles
  let cardStyle = { ...styles.card };
  if (isLocked) cardStyle = { ...cardStyle, ...styles.cardLocked };
  else if (file) cardStyle = { ...cardStyle, ...styles.cardUploaded };
  else if (hover) cardStyle = { ...cardStyle, borderColor: colors.primary, background: colors.primaryLight };

  return (
    <div 
      style={cardStyle} 
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />

      <div style={styles.iconArea}>
        {isLocked ? <FaLock color={colors.locked} /> : 
         file ? <FaCheck color={colors.success} /> : 
         customIcon || <FaCloudUploadAlt color={colors.primary} />}
      </div>

      <div style={styles.textArea}>
        <span style={styles.label}>{label}</span>
        {file ? (
          <span style={styles.fileName} title={file.fileName}>{file.fileName}</span>
        ) : (
          <span style={{ ...styles.status, color: isLocked ? colors.locked : colors.primary }}>
            {isLocked ? "Locked" : "Upload"}
          </span>
        )}
      </div>

      {file && hover && (
        <div style={styles.actionOverlay} onClick={(e) => e.stopPropagation()}>
          <a href={file.fileUrl} target="_blank" rel="noreferrer" style={{...styles.iconBtn, color: colors.primary}}>
            <FaDownload size={12} />
          </a>
          <button onClick={() => onDelete(file.id)} style={{...styles.iconBtn, color: colors.danger}}>
            <FaTrashAlt size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: Arrow Connector ---
const Connector = ({ active }) => (
  <div style={styles.connector}>
    <FaChevronRight size={12} color={active ? colors.success : colors.border} />
  </div>
);

// --- MAIN COMPONENT ---
const LectureMaterialsTable = ({ studentId, studentName, studentClassSchedule = [], admissionDate }) => {
  const dispatch = useDispatch();
  const { materials = [], loading, uploading, error } = useSelector((state) => state.lectureMaterials || {});
  const [weekOffset, setWeekOffset] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    if (studentId) dispatch(fetchStudentLectureMaterials(studentId));
  }, [dispatch, studentId]);

  useEffect(() => {
    if (!studentClassSchedule?.length || !admissionDate) {
      setScheduleData([]);
      return;
    }
    const today = new Date();
    const currentWeekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 0 });

    const calculated = studentClassSchedule.map((sch) => {
      const [day, time] = sch.split("-");
      const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
      const classDate = addDays(currentWeekStart, dayMap[day]);
      const uniqueId = `${studentId}-${format(classDate, "yyyy-MM-dd")}-${time.replace(/[^a-zA-Z0-9]/g, "")}`;
      return { day, time, date: classDate, classId: uniqueId };
    });

    calculated.sort((a, b) => a.date - b.date);
    setScheduleData(calculated);
  }, [studentClassSchedule, admissionDate, weekOffset, studentId]);

  const handleUpload = (file, classId, fileType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentName", studentName);
    dispatch(uploadLectureMaterial(studentId, classId, fileType, formData));
  };

  const handleDelete = (fileId) => {
    if (window.confirm("Delete this file?")) dispatch(deleteLectureMaterial(fileId));
  };

  const getFile = (classId, type) => materials.find((m) => m.classId === classId && m.fileType === type);

  // --- CONFIGURATION FOR STEPS ---
  
  // 1. PPT Section Config
  const pptSteps = [
    { key: "pptDummy", label: "Dummy PPT" },
    { key: "pptValid", label: "Valid PPT" }, // Locked until Dummy uploaded? (Optional, currently open)
    { key: "pptAfter", label: "After Class PPT" }
  ];

  // 2. Worksheet Section Config
  const worksheetSteps = [
    { key: "wsCreate", label: "Create Worksheet" }, // Step 1
    { key: "wsStudentUpload", label: "Student Result" }, // Step 2 (Any format)
    { key: "wsMounikaDoubts", label: "Mounika (Doubts)" }, // Step 3
    { key: "wsVamshiExplain", label: "Vamshi (Explain)" }, // Step 4
    { key: "wsMounikaFinal", label: "Mounika (Final)" }  // Step 5
  ];

  if (loading && materials.length === 0) return <div style={styles.emptyState}><FaSpinner className="spin" /> Loading...</div>;
  if (error) return <div style={{...styles.emptyState, color: colors.danger}}><FaExclamationTriangle /> {error}</div>;

  return (
    <div style={styles.wrapper}>
      {/* Header & Nav */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h3 style={styles.title}>Class & Workflow Manager</h3>
          <span style={styles.subtitle}>Materials for {studentName}</span>
        </div>
        <div style={styles.weekNav}>
          <button style={styles.navBtn} onClick={() => setWeekOffset(prev => prev - 1)}><FaChevronLeft /></button>
          <span style={styles.currentWeek}>{weekOffset === 0 ? "Current Week" : `${weekOffset > 0 ? '+' : ''}${weekOffset} Week`}</span>
          <button style={styles.navBtn} onClick={() => setWeekOffset(prev => prev + 1)}><FaChevronRight /></button>
        </div>
      </div>

      {uploading && <div style={styles.uploadBar}><FaSpinner className="spin" /> Uploading...</div>}

      {/* Class List */}
      <div style={styles.classContainer}>
        {scheduleData.length > 0 ? (
          scheduleData.map((row) => (
            <div key={row.classId} style={styles.classCard}>
              
              {/* Class Header info */}
              <div style={styles.classHeader}>
                <div style={styles.dateBadge}>
                  <span>{format(row.date, "dd MMM")}</span>
                  <span>{format(row.date, "EEE")}</span>
                </div>
                <div style={styles.timeBadge}>{row.time}</div>
              </div>

              <div style={styles.sectionsWrapper}>
                
                {/* SECTION 1: Presentation Slides */}
                <div style={styles.sectionPPT}>
                  <div style={styles.sectionTitle}><FaFilePowerpoint color={colors.primary} /> Presentation Slides</div>
                  <div style={styles.cardGrid}>
                    {pptSteps.map((step) => (
                      <MaterialCard
                        key={step.key}
                        classId={row.classId}
                        fileType={step.key}
                        file={getFile(row.classId, step.key)}
                        label={step.label}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                        // For PPTs, we can leave them unlocked, or lock sequential if desired
                        isLocked={false} 
                      />
                    ))}
                  </div>
                </div>

                {/* SECTION 2: Worksheet Workflow */}
                <div style={styles.sectionWorksheet}>
                  <div style={styles.sectionTitle}><FaClipboardList color={colors.secondary} /> Worksheet Workflow</div>
                  <div style={styles.cardGrid}>
                    {worksheetSteps.map((step, idx) => {
                      const file = getFile(row.classId, step.key);
                      // Lock logic: Step N is locked if Step N-1 is missing
                      const prevKey = idx > 0 ? worksheetSteps[idx - 1].key : null;
                      const isLocked = prevKey && !getFile(row.classId, prevKey);

                      return (
                        <React.Fragment key={step.key}>
                          <MaterialCard
                            classId={row.classId}
                            fileType={step.key}
                            file={file}
                            label={step.label}
                            isLocked={isLocked}
                            onUpload={handleUpload}
                            onDelete={handleDelete}
                            customIcon={idx === 0 ? <FaCloudUploadAlt color={colors.secondary} /> : null}
                          />
                          {idx < worksheetSteps.length - 1 && <Connector active={!!file} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>No classes scheduled for this week.</div>
        )}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default LectureMaterialsTable;