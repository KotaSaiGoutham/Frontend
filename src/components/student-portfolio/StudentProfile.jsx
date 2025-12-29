import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserCircle,
  FaTransgender,
  FaPhone,
  FaGraduationCap,
  FaUniversity,
  FaUsers,
  FaUserGraduate,
  FaIdCard,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaRocket,
  FaChartBar,
  FaPrint,
  FaCamera 
} from "react-icons/fa";
import { 
  Box, 
  Badge, 
  Avatar, 
  Tooltip, 
  IconButton, 
  CircularProgress, 
  Skeleton 
} from "@mui/material";

import { setCurrentStudent, getUserProfileIcon, updateProfilePicture } from "../../redux/actions";
import { formatFirebaseDate, formatPhone } from "../../mockdata/function";

// --- ENHANCED STYLES ---
const styles = `
  :root {
    --primary: #4f46e5;
    --primary-light: #e0e7ff;
    --bg-page: #f1f5f9;
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-light: #64748b;
    --border-color: #e2e8f0;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  body {
    background-color: var(--bg-page);
  }

  .sp-container {
    min-height: 100vh;
    padding: 20px;
    background: var(--bg-page);
    font-family: 'Inter', sans-serif;
    max-width: 1600px;
    margin: 0 auto;
  }

  /* --- ANIMATIONS --- */
  @keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .animate-card {
    opacity: 0; /* Start hidden */
    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }

  /* --- GRID SYSTEM --- */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
  }

  .span-12 { grid-column: span 12; }
  .span-8 { grid-column: span 8; }
  .span-6 { grid-column: span 6; }
  .span-4 { grid-column: span 4; }

  /* --- CARD STYLES --- */
  .modern-card {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 24px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .modern-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* --- HEADER SECTION --- */
  .profile-header-content {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .header-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  /* --- STATS GRID --- */
  .mini-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-top: 25px;
  }

  .stat-item {
    background: #f8fafc;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  /* --- DATA ROWS --- */
  .data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px dashed var(--border-color);
  }
  .data-row:last-child { border-bottom: none; }

  .label { font-size: 0.85rem; color: var(--text-light); font-weight: 600; text-transform: uppercase; }
  .value { font-size: 1rem; color: var(--text-main); font-weight: 600; text-align: right; }

  /* --- MOBILE RESPONSIVE --- */
  @media (max-width: 1024px) {
    .span-4, .span-6, .span-8 { grid-column: span 12; }
    .mini-stat-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .profile-header-content { flex-direction: column; text-align: center; gap: 15px; }
    .header-details { display: flex; flex-direction: column; align-items: center; }
    .header-badges { justify-content: center; }
    .data-row { display: flex; flex-direction: row; justify-content: space-between; }
    .mini-stat-grid { grid-template-columns: 1fr; }
    .card-title { justify-content: center; }
    .schedule-container { justify-content: center; }
  }
`;

const StudentProfile = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Selectors
  const currentStudent = useSelector((state) => state.auth?.currentStudent);
  const { photoUrl: profilePhoto, isLoading: isProfileLoading } = useSelector((state) => state.profile);

  // Local State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (location.state?.studentData) {
      dispatch(setCurrentStudent(location.state.studentData));
    }
  }, [location.state, studentId, dispatch]);

  const studentData = currentStudent || location.state?.studentData;

  // Fetch Profile Icon
  useEffect(() => {
    if (studentData?.id) {
        dispatch(getUserProfileIcon(studentData.id));
    }
  }, [dispatch, studentData?.id]);

  // File Upload Handler
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", studentData.id); 

    try {
      await dispatch(updateProfilePicture(formData));
      dispatch(getUserProfileIcon(studentData.id));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const calculateProgress = () => {
    if (studentData?.isRevisionProgramJEEMains2026Student) {
      const total = studentData.revisionProgramFee?.totalFee || 0;
      const paid = Object.values(studentData.revisionProgramFee?.installments || {})
        .reduce((sum, inst) => sum + (inst.paidAmount || 0), 0);
      return total > 0 ? Math.min((paid / total) * 100, 100) : 0;
    }
    return studentData?.["Payment Status"]?.toLowerCase() === "paid" ? 100 : 0;
  };

  if (!studentData) return <div style={{padding:20, textAlign:'center'}}>Student not found</div>;

  const progress = calculateProgress();
  const isActive = studentData.isActive;

  return (
    <div className="sp-container">
      <style>{styles}</style>
      
      <div className="dashboard-grid">
        
        {/* --- HEADER (Span 12) --- */}
        <div className="modern-card span-12 animate-card delay-1">
          <div className="profile-header-content">
            
            {/* UPDATED: MUI Avatar with Camera Badge */}
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Update Photo">
                      <IconButton
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                          bgcolor: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#f5f5f5', transform: 'scale(1.1)' },
                          transition: 'all 0.2s',
                          width: 42, height: 42,
                          border: '2px solid #e0e7ff'
                        }}
                        disabled={isUploading}
                      >
                        {isUploading ? <CircularProgress size={20} /> : <FaCamera color="#4f46e5" size={18} />}
                      </IconButton>
                    </Tooltip>
                  }
                >
                  {isProfileLoading ? (
                    <Skeleton 
                        variant="circular" 
                        width={120} 
                        height={120} 
                        animation="wave"
                        sx={{ 
                            border: '4px solid #ffffff', 
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
                        }} 
                    />
                  ) : (
                    <Avatar
                        src={profilePhoto}
                        alt={studentData.Name}
                        sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid #ffffff',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        bgcolor: '#4f46e5',
                        fontSize: '3.5rem',
                        background: 'linear-gradient(135deg, #4f46e5, #818cf8)'
                        }}
                    >
                        {studentData.Name?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </Badge>
            </Box>
            
            <div className="header-details" style={{ flex: 1, width: '100%' }}>
              <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#1e293b' }}>
                {studentData.Name}
              </h1>
              
              <div className="header-badges">
                <span style={{ 
                  background: isActive ? '#dcfce7' : '#fee2e2', 
                  color: isActive ? '#166534' : '#991b1b',
                  padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  {isActive ? <FaCheckCircle /> : <FaExclamationCircle />}
                  {isActive ? "Active Student" : "Inactive"}
                </span>
                {studentData.isRevisionProgramJEEMains2026Student && (
                  <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaRocket /> Revision Batch
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="mini-stat-grid">
                <div className="stat-item">
                  <span className="label">Stream</span>
                  <div style={{ color: '#4f46e5', fontWeight: 700, fontSize: '1.1rem', display:'flex', alignItems:'center', gap:'5px' }}>
                     <FaGraduationCap /> {studentData.Stream || "N/A"}
                  </div>
                </div>
                <div className="stat-item">
                  <span className="label">Group</span>
                  <div style={{ color: '#d97706', fontWeight: 700, fontSize: '1.1rem', display:'flex', alignItems:'center', gap:'5px' }}>
                     <FaUsers /> {studentData["Group "] || "N/A"}
                  </div>
                </div>
                <div className="stat-item">
                  <span className="label">Classes</span>
                  <div style={{ color: '#059669', fontWeight: 700, fontSize: '1.1rem', display:'flex', alignItems:'center', gap:'5px' }}>
                     <FaChartBar /> {studentData.classesCompleted || "0"}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- COLUMN 1 (Span 4) --- */}
        <div className="span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* PERSONAL INFO */}
          <div className="modern-card animate-card delay-2">
            <div className="card-header">
              <div className="card-title">
                <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '8px', borderRadius: '8px' }}><FaUserCircle /></div>
                Personal Details
              </div>
            </div>
            <div className="data-row">
              <span className="label">Gender</span>
              <span className="value">{studentData.Gender}</span>
            </div>
            <div className="data-row">
              <span className="label">Subject</span>
              <span className="value">{studentData.Subject}</span>
            </div>
            <div className="data-row">
              <span className="label">DOB</span>
              <span className="value">{studentData.DOB || "N/A"}</span>
            </div>
            <div className="data-row">
              <span className="label">Source</span>
              <span className="value">{studentData.Source || "Direct"}</span>
            </div>
            <div className="data-row">
              <span className="label">Location</span>
              <span className="value">{studentData.Address || "Boath, TS"}</span>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="modern-card animate-card delay-3">
             <div className="card-header">
              <div className="card-title">
                <div style={{ background: '#dcfce7', color: '#15803d', padding: '8px', borderRadius: '8px' }}><FaPhone /></div>
                Contacts
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                 <small style={{ color: '#64748b', textTransform:'uppercase', fontSize:'0.7rem', fontWeight:700 }}>Student</small>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600 }}>
                   {formatPhone(studentData.ContactNumber)}
                   <a href={`tel:${studentData.ContactNumber}`} style={{ color: '#4f46e5' }}><FaPhone /></a>
                 </div>
               </div>
               <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                 <small style={{ color: '#64748b', textTransform:'uppercase', fontSize:'0.7rem', fontWeight:700 }}>Father</small>
                 <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatPhone(studentData.father_contact)}</div>
               </div>
               <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                 <small style={{ color: '#64748b', textTransform:'uppercase', fontSize:'0.7rem', fontWeight:700 }}>Mother</small>
                 <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatPhone(studentData.mother_contact)}</div>
               </div>
            </div>
          </div>

        </div>

        {/* --- COLUMN 2 (Span 4) --- */}
        <div className="span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
           {/* SCHEDULE */}
           <div className="modern-card animate-card delay-2">
            <div className="card-header">
              <div className="card-title">
                <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px', borderRadius: '8px' }}><FaCalendarAlt /></div>
                Weekly Schedule
              </div>
            </div>
            <div className="schedule-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {studentData.classDateandTime?.map((schedule, idx) => {
                const [day, time] = schedule.split('-');
                return (
                  <div key={idx} style={{ 
                    flex: '1 1 45%', minWidth: '120px', 
                    background: '#fffbeb', border: '1px solid #fcd34d', 
                    borderRadius: '10px', padding: '10px',
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                    <FaClock color="#d97706" />
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309' }}>{day}</div>
                      <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{time}</div>
                    </div>
                  </div>
                )
              })}
              {(!studentData.classDateandTime || studentData.classDateandTime.length === 0) && (
                <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '10px', textAlign: 'center', width: '100%' }}>No active schedule</div>
              )}
            </div>
          </div>

          {/* ACADEMIC */}
          <div className="modern-card animate-card delay-3">
             <div className="card-header">
              <div className="card-title">
                <div style={{ background: '#fce7f3', color: '#be185d', padding: '8px', borderRadius: '8px' }}><FaUniversity /></div>
                Academics
              </div>
            </div>
            <div className="data-row">
              <span className="label">College</span>
              <span className="value" style={{maxWidth:'60%'}}>{studentData.College || "Electron Academy"}</span>
            </div>
            <div className="data-row">
              <span className="label">Year</span>
              <span className="value">{studentData.Year}</span>
            </div>
            <div className="data-row">
              <span className="label">Joining Date</span>
              <span className="value">{formatFirebaseDate(studentData.admissionDate)}</span>
            </div>
          </div>
        </div>

        {/* --- COLUMN 3 (Span 4) --- */}
        <div className="span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* FEES */}
          <div className="modern-card animate-card delay-2">
            <div className="card-header">
              <div className="card-title">
                <div style={{ background: '#d1fae5', color: '#047857', padding: '8px', borderRadius: '8px' }}><FaMoneyBillWave /></div>
                Fee Details
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px dashed #e2e8f0', marginBottom: '15px' }}>
               <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Monthly Fee</div>
               <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>
                 {formatCurrency(studentData["Monthly Fee"] || studentData.monthlyFee || 0)}
               </div>
               <span style={{ 
                 background: studentData["Payment Status"] === "Paid" ? '#dcfce7' : '#fee2e2',
                 color: studentData["Payment Status"] === "Paid" ? '#166534' : '#991b1b',
                 padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                 marginTop: '5px', display: 'inline-block'
               }}>
                 {studentData["Payment Status"] || "Unpaid"}
               </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Last Paid</div>
                <div style={{ fontWeight: 600 }}>{formatFirebaseDate(studentData.paidDate) || "-"}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Next Due</div>
                <div style={{ fontWeight: 600, color: '#ef4444' }}>{formatFirebaseDate(studentData.nextDueDate) || "-"}</div>
              </div>
            </div>
          </div>

          {/* REVISION PROGRAM */}
          {studentData.isRevisionProgramJEEMains2026Student && studentData.revisionProgramFee && (
            <div className="modern-card animate-card delay-3" style={{ border: '2px solid #d8b4fe', background: '#faf5ff' }}>
              <div className="card-header">
                <div className="card-title">
                  <div style={{ background: '#7e22ce', color: 'white', padding: '8px', borderRadius: '8px' }}><FaRocket /></div>
                  Revision Plan
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 700 }}>
                <span>Total Fee</span>
                <span>{formatCurrency(studentData.revisionProgramFee.totalFee)}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {Object.entries(studentData.revisionProgramFee.installments).map(([key, inst]) => (
                   <div key={key} style={{ 
                     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                     background: inst.status === 'paid' ? '#ffffff' : 'rgba(255,255,255,0.5)',
                     padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)'
                   }}>
                     <div>
                       <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{key}</div>
                       <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{inst.dueDate}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{formatCurrency(inst.amount)}</div>
                       {inst.status === 'paid' && <FaCheckCircle color="#16a34a" size={12} />}
                     </div>
                   </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default StudentProfile;