import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { formatFirebaseDate, capitalize } from "../mockdata/function";
import "./StudentPortfolio.css";
import AddWeeklyMarksModal from "./AddWeeklyMarksForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentHistory,
  fetchUpcomingClasses,
  fetchAutoTimetablesForToday,
  fetchStudentExamsByStudent,
} from "../redux/actions";
import LectureMaterialsTable from "./LectureMaterialsTable";

// Icon Imports
import {
  FaUserCircle,
  FaTransgender,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaDollarSign,
  FaGraduationCap,
  FaUniversity,
  FaUsers,
  FaSearchDollar,
  FaCalendarCheck,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaArrowLeft,
  FaInfoCircle,
  FaSpinner,
  FaCalendarDay,
  FaHistory,
  FaPhone,
  FaMale,
  FaFemale,
  FaClock,
  FaMoneyBillAlt,
  FaClipboardList,
  FaPlus,
  FaChartLine,
  FaEdit,
  FaBook,
  FaChartBar,
  FaIdCard,
  FaSchool,
  FaUserGraduate,
  FaFilePowerpoint,
  FaStar,
  FaRocket,
  FaArrowUp,
  FaAward,
  FaCrown,
  FaMedal,
  FaFileAlt,
  FaFilePdf,
  FaCalendarWeek,
  FaClipboardCheck,
  FaRegCalendar,
  FaTasks,
  FaFileUpload,
  FaTable,
  FaChartArea
} from "react-icons/fa";
import { MuiButton } from "./customcomponents/MuiCustomFormFields";
import WeeklyMarksTrendGraph from "./WeeklyMarksBarChart";
import PaymentHistoryTable from "./PaymentHistoryTable";
import ResultsTable from "./ResultsTable";
import { formatPhone } from "../mockdata/function";
const StudentPortfolio = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { studentExams, loading: studentExamsLoading } = useSelector(
    (state) => state.studentExams
  );

  const [studentData, setStudentData] = useState(
    location.state?.studentData || null
  );
  console.log("studentExams",studentExams)
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(!location.state?.studentData);

  const payments = useSelector((state) => state.payments.data);

  // Format phone number


  // Premium Stat Card Component
  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    color = "blue",
    delay = 0,
  }) => (
    <div
      className={`stat-card premium stat-card-${color}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-glow"></div>
      <div className="stat-icon">
        <Icon />
        <div className="stat-shine"></div>
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{label}</p>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
      <div className="stat-wave"></div>
    </div>
  );

  // Premium Detail Card Component
  const DetailCard = ({
    title,
    icon: Icon,
    children,
    className = "",
    delay = 0,
  }) => (
    <div
      className={`detail-card premium ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-glow"></div>
      <div className="detail-card-header">
        <div className="header-icon-wrapper">
          <Icon className="detail-card-icon" />
          <div className="icon-shine"></div>
        </div>
        <h3>{title}</h3>
        <div className="card-sparkles">
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
        </div>
      </div>
      <div className="detail-card-content">{children}</div>
    </div>
  );

  // Premium Detail Item Component
  const DetailItem = ({
    icon: Icon,
    label,
    value,
    isHighlighted = false,
    delay = 0,
  }) => (
    <div
      className={`detail-item premium ${isHighlighted ? "highlighted" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="item-glow"></div>
      <div className="detail-label">
        {Icon && (
          <div className="detail-icon-wrapper">
            <Icon className="detail-icon" />
          </div>
        )}
        <span>{label}</span>
      </div>
      <div className="detail-value">{value}</div>
      <div className="detail-shine"></div>
    </div>
  );

  // Payment Status Display
  const getPaymentStatusDisplay = (status) => {
    const statusClass = status?.toLowerCase() === "paid" ? "paid" : "unpaid";
    return (
      <span className={`status-tag premium ${statusClass}`}>
        {status?.toLowerCase() === "paid" ? (
          <FaCheckCircle />
        ) : (
          <FaExclamationCircle />
        )}
        {status || "N/A"}
        <div className="status-glow"></div>
      </span>
    );
  };

  // Fetch data
  useEffect(() => {
    if (studentData?.id || studentId) {
      dispatch(fetchPaymentHistory(studentData?.id || studentId));
      dispatch(fetchStudentExamsByStudent(studentData?.id || studentId));
    }
  }, [studentData?.id, studentId, dispatch]);

  if (loading) {
    return (
      <div className="portfolio-loading premium">
        <div className="loading-orbit">
          <div className="orbit-ring ring-1"></div>
          <div className="orbit-ring ring-2"></div>
          <div className="orbit-ring ring-3"></div>
          <div className="loading-center">
            <FaUserGraduate className="loading-icon" />
          </div>
        </div>
        <h2 className="loading-text">Loading Student Portfolio</h2>
        <p>Preparing your dashboard...</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="portfolio-error premium">
        <div className="error-animation">
          <FaExclamationCircle className="error-icon" />
          <div className="error-ripple"></div>
        </div>
        <h2>Student Not Found</h2>
        <p>The requested student portfolio could not be loaded.</p>
        <button
          onClick={() => navigate("/students")}
          className="back-btn premium"
        >
          <FaArrowLeft /> Back to Students
        </button>
      </div>
    );
  }
// Helper functions for weekend syllabus
const renderCurrentWeekSyllabus = () => {
  if (!studentData.weekSyllabus || studentData.weekSyllabus.length === 0) {
    return (
      <div className="syllabus-week">
        <h4>No syllabus data available</h4>
        <div className="syllabus-grid">
          <div className="syllabus-day">
            <h5>Saturday</h5>
            <ul>
              <li>No topics scheduled</li>
            </ul>
          </div>
          <div className="syllabus-day">
            <h5>Sunday</h5>
            <ul>
              <li>No topics scheduled</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Get the latest syllabus entry
  const latestSyllabus = [...studentData.weekSyllabus]
    .sort((a, b) => {
      const dateA = a.date?._seconds || 0;
      const dateB = b.date?._seconds || 0;
      return dateB - dateA;
    })[0];

  // Get previous syllabus entries (excluding the latest)
  const previousSyllabus = [...studentData.weekSyllabus]
    .sort((a, b) => {
      const dateA = a.date?._seconds || 0;
      const dateB = b.date?._seconds || 0;
      return dateB - dateA;
    })
    .slice(1);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'Date not available';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeekNumber = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'Current Week';
    const date = new Date(timestamp._seconds * 1000);
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  };

  return (
    <>
      <div className="syllabus-week">
        <h4>Week {getWeekNumber(latestSyllabus.date)} ({formatDate(latestSyllabus.date)})</h4>
        <div className="syllabus-grid">
          <div className="syllabus-day">
            <h5>Saturday</h5>
            <ul>
              <li key={latestSyllabus.id}>
                <strong>{studentData.Subject || 'Subject'}:</strong> {latestSyllabus.topic}
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Previous Week Syllabus */}
      {previousSyllabus.length > 0 && (
        <div className="previous-syllabus">
          <h4>Previous Week</h4>
          <div className="syllabus-grid">
            <div className="syllabus-day">
              <h5>Saturday</h5>
              <ul>
                {previousSyllabus.slice(0, 2).map((syllabus, index) => (
                  <li key={`prev-${syllabus.id}-${index}`}>
                    <strong>{studentData.Subject}:</strong> {syllabus.topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

  return (
    <div className="student-portfolio premium light-theme">
      {/* Header Section */}
      <header className="portfolio-header premium light-theme">
        <div className="header-background">
          <div className="header-gradient"></div>
          <div className="header-animated-shapes">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="floating-shape shape-4"></div>
          </div>
        </div>

        <div className="header-content">
          <div className="student-profile-header premium">
            <div className="profile-avatar-container">
              <div className="avatar-glow"></div>
              <div className="profile-avatar premium">
                <FaUserGraduate />
              </div>
            </div>

            <div className="profile-info premium">
              <div className="name-section">
                <h1 className="student-name">{studentData.Name || "N/A"}</h1>
              </div>

              <div className="profile-meta premium">
                <div className="meta-grid">
                  <div className="meta-item">
                    <div className="meta-icon-wrapper">
                      <FaCalendarDay className="meta-icon" />
                      <div className="meta-icon-glow"></div>
                    </div>
                    <div className="meta-content">
                      <span className="meta-label">Joined Date</span>
                      <span className="meta-value">
                        {formatFirebaseDate(studentData.admissionDate)}
                      </span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <div className="meta-icon-wrapper">
                      <FaTransgender className="meta-icon" />
                      <div className="meta-icon-glow"></div>
                    </div>
                    <div className="meta-content">
                      <span className="meta-label">Gender</span>
                      <span className="meta-value">
                        {studentData.Gender || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <div className="meta-icon-wrapper">
                      <FaGraduationCap className="meta-icon" />
                      <div className="meta-icon-glow"></div>
                    </div>
                    <div className="meta-content">
                      <span className="meta-label">Stream</span>
                      <span className="meta-value">
                        {studentData.Stream || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="portfolio-tabs premium light-theme">
        <div className="tabs-container">
          {[
       { id: "overview", label: "Overview", icon: FaUserCircle },
  { id: "profile", label: "Profile", icon: FaIdCard },
  { id: "weekend", label: "Weekend Syllabus", icon: FaCalendarAlt },
  { id: "upload", label: "Upload Files", icon: FaFileUpload },
  { id: "ppts", label: "PPT's and Materials", icon: FaFilePowerpoint },
  { id: "worksheets", label: "Worksheets", icon: FaTasks },
  { id: "papers", label: "Question Papers", icon: FaFileAlt },
  { id: "results", label: "Results", icon: FaClipboardCheck },
  { id: "classes", label: "Classes Info", icon: FaChalkboardTeacher },
  { id: "payments", label: "Fees Payment", icon: FaDollarSign },
  { id: "others", label: "Others", icon: FaInfoCircle }
          ].map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-btn premium ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              style={{ animationDelay: `${index * 100 + 600}ms` }}
            >
              <div className="tab-icon-wrapper">
                <tab.icon />
              </div>
              <span>{tab.label}</span>
              <div className="tab-highlight"></div>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="portfolio-main premium light-theme">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content premium">
            <div className="stats-grid premium">
              <StatCard
                icon={FaBookOpen}
                label="Classes Completed"
                value={studentData.isRevisionProgramJEEMains2026Student?studentData.revisionClassesCompleted : studentData.classesCompleted || "0"}
                color="blue"
                delay={200}
              />
              <StatCard
                icon={FaMoneyBillWave}
                label="Monthly Fee"
                value={`₹${(
                  +studentData["Monthly Fee"] || 0
                ).toLocaleString()}`}
                color="purple"
                delay={600}
              />
              <StatCard
                icon={FaAward}
                label="Achievement Score"
                value="92%"
                trend="Top Performer"
                color="orange"
                delay={800}
              />
            </div>

            <div className="content-grid premium">
              <div className="content-column">
                <DetailCard
                  title="Academic Information"
                  icon={FaBook}
                  delay={300}
                >
                  <div className="info-grid premium">
                    <DetailItem
                      icon={FaCalendarCheck}
                      label="Academic Year"
                      value={studentData.Year || "N/A"}
                      delay={100}
                    />
                    <DetailItem
                      icon={FaUniversity}
                      label="College"
                      value={studentData.College || "N/A"}
                      delay={200}
                    />
                    <DetailItem
                      icon={FaUsers}
                      label="Group"
                      value={studentData["Group "] || "N/A"}
                      delay={250}
                    />
                    <DetailItem
                      icon={FaSearchDollar}
                      label="Source"
                      value={studentData.Source || "N/A"}
                      delay={300}
                    />
                    <DetailItem
                      icon={FaChalkboardTeacher}
                      label="Classes Attended"
                      value={studentData.classesCompleted || "0"}
                      delay={350}
                    />
                  </div>
                </DetailCard>

                <DetailCard title="Contact Details" icon={FaPhone} delay={600}>
                  <div className="contact-list premium">
                    <div
                      className="contact-item premium"
                      style={{ animationDelay: "100ms" }}
                    >
                      <div className="contact-glow"></div>
                      <div className="contact-icon premium">
                        <FaUserCircle />
                      </div>
                      <div className="contact-info">
                        <strong>Student</strong>
                        <span>{formatPhone(studentData.ContactNumber)}</span>
                      </div>
                    </div>
                    <div
                      className="contact-item premium"
                      style={{ animationDelay: "200ms" }}
                    >
                      <div className="contact-glow"></div>
                      <div className="contact-icon premium">
                        <FaMale />
                      </div>
                      <div className="contact-info">
                        <strong>Father</strong>
                        <span>
                          {formatPhone(studentData.father_contact)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="contact-item premium"
                      style={{ animationDelay: "300ms" }}
                    >
                      <div className="contact-glow"></div>
                      <div className="contact-icon premium">
                        <FaFemale />
                      </div>
                      <div className="contact-info">
                        <strong>Mother</strong>
                        <span>
                          {formatPhone(studentData.mother_contact)}
                        </span>
                      </div>
                    </div>
                  </div>
                </DetailCard>
              </div>

              <div className="content-column">
                <DetailCard
                  title="Payment Status"
                  icon={FaDollarSign}
                  delay={300}
                >
                  <div className="payment-status premium">
                    <div className="payment-details premium">
                      <div className="payment-item premium">
                        <span>Status</span>
                        {getPaymentStatusDisplay(studentData["Payment Status"])}
                      </div>
                      <div className="payment-item premium">
                        <span>Last Paid</span>
                        <span>
                          {formatFirebaseDate(studentData.paidDate) || "N/A"}
                        </span>
                      </div>
                      <div className="payment-item premium">
                        <span>Next Due</span>
                        <span className="due-date">
                          {formatFirebaseDate(studentData.nextDueDate) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </DetailCard>

                <DetailCard
                  title="Recent Activity"
                  icon={FaHistory}
                  delay={600}
                >
                  <PremiumActivityTimeline />
                </DetailCard>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="tab-content premium">
            <div className="content-grid premium">
              <div className="content-column">
                <DetailCard title="Personal Information" icon={FaUserCircle} delay={200}>
                  <div className="info-grid premium">
                    <DetailItem
                      icon={FaUserCircle}
                      label="Full Name"
                      value={studentData.Name || "N/A"}
                      delay={100}
                    />
                    <DetailItem
                      icon={FaTransgender}
                      label="Gender"
                      value={studentData.Gender || "N/A"}
                      delay={150}
                    />
                    <DetailItem
                      icon={FaCalendarDay}
                      label="Admission Date"
                      value={formatFirebaseDate(studentData.admissionDate)}
                      delay={200}
                    />
                    <DetailItem
                      icon={FaPhone}
                      label="Contact Number"
                      value={formatPhone(studentData.ContactNumber)}
                      delay={250}
                    />
                  </div>
                </DetailCard>
              </div>
              <div className="content-column">
                <DetailCard title="Academic Profile" icon={FaGraduationCap} delay={400}>
                  <div className="info-grid premium">
                    <DetailItem
                      icon={FaUniversity}
                      label="College"
                      value={studentData.College || "N/A"}
                      delay={100}
                    />
                    <DetailItem
                      icon={FaBook}
                      label="Stream"
                      value={studentData.Stream || "N/A"}
                      delay={150}
                    />
                    <DetailItem
                      icon={FaUsers}
                      label="Group"
                      value={studentData["Group "] || "N/A"}
                      delay={200}
                    />
                    <DetailItem
                      icon={FaCalendarCheck}
                      label="Academic Year"
                      value={studentData.Year || "N/A"}
                      delay={250}
                    />
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>
        )}

        {/* Weekend Syllabus Tab */}
    {activeTab === "weekend" && (
  <div className="tab-content premium">
    <div className="weekend-syllabus-container">
      <DetailCard title="Current Week Syllabus" icon={FaCalendarWeek} delay={200}>
        <div className="syllabus-content">
          {renderCurrentWeekSyllabus()}
        </div>
      </DetailCard>

    </div>
  </div>
)}

        {/* Upload Files Tab */}
        {activeTab === "upload" && (
          <div className="tab-content premium">
            <div className="section-header premium">
              <h2>Upload Files</h2>
              <p>Manage and upload study materials, PPTs, and worksheets</p>
            </div>
            
            <div className="upload-files-container">
              <DetailCard title="Upload New File" icon={FaFileUpload} delay={200}>
                <div className="upload-section">
                  <div className="upload-zone">
                    <FaFileUpload className="upload-icon" />
                    <p>Drag and drop files here or click to browse</p>
                    <MuiButton variant="contained" className="premium">
                      Browse Files
                    </MuiButton>
                  </div>
                  <div className="file-types">
                    <h4>Supported File Types:</h4>
                    <div className="file-type-tags">
                      <span className="file-tag">PDF</span>
                      <span className="file-tag">PPT</span>
                      <span className="file-tag">DOC</span>
                      <span className="file-tag">XLS</span>
                      <span className="file-tag">ZIP</span>
                    </div>
                  </div>
                </div>
              </DetailCard>

              <DetailCard title="Recent Uploads" icon={FaFileAlt} delay={400}>
                <div className="recent-uploads">
                  <div className="upload-item">
                    <FaFilePdf className="file-icon pdf" />
                    <div className="file-info">
                      <strong>Calculus_Notes_Week15.pdf</strong>
                      <span>Uploaded 2 days ago</span>
                    </div>
                    <div className="file-actions">
                      <MuiButton variant="outlined" size="small">
                        Download
                      </MuiButton>
                    </div>
                  </div>
                  <div className="upload-item">
                    <FaFileAlt className="file-icon ppt" />
                    <div className="file-info">
                      <strong>Electromagnetism_PPT.pptx</strong>
                      <span>Uploaded 1 week ago</span>
                    </div>
                    <div className="file-actions">
                      <MuiButton variant="outlined" size="small">
                        Download
                      </MuiButton>
                    </div>
                  </div>
                </div>
              </DetailCard>
            </div>
          </div>
        )}

        {/* Worksheets Tab */}
        {activeTab === "worksheets" && (
          <div className="tab-content premium">
            <div className="section-header premium">
              <h2>Worksheets</h2>
              <p>Practice worksheets and assignments</p>
            </div>
            
            <div className="worksheets-container">
              <DetailCard title="Available Worksheets" icon={FaTasks} delay={200}>
                <div className="worksheets-list">
                  <div className="worksheet-item">
                    <FaFilePdf className="worksheet-icon" />
                    <div className="worksheet-info">
                      <h4>Mathematics Worksheet - Week 15</h4>
                      <p>Integration techniques and applications</p>
                      <span className="worksheet-meta">Due: Dec 16, 2024</span>
                    </div>
                    <div className="worksheet-actions">
                      <MuiButton variant="contained" size="small">
                        Download
                      </MuiButton>
                      <MuiButton variant="outlined" size="small">
                        Submit
                      </MuiButton>
                    </div>
                  </div>
                  
                  <div className="worksheet-item">
                    <FaFilePdf className="worksheet-icon" />
                    <div className="worksheet-info">
                      <h4>Physics Assignment - Electromagnetism</h4>
                      <p>Faraday's law and electromagnetic induction</p>
                      <span className="worksheet-meta">Due: Dec 18, 2024</span>
                    </div>
                    <div className="worksheet-actions">
                      <MuiButton variant="contained" size="small">
                        Download
                      </MuiButton>
                      <MuiButton variant="outlined" size="small">
                        Submit
                      </MuiButton>
                    </div>
                  </div>
                </div>
              </DetailCard>
            </div>
          </div>
        )}

     {activeTab === "results" && (
  <div className="tab-content premium">
    <div className="results-container">
      <DetailCard title="Marks Overview" icon={FaTable} delay={200}>
        <ResultsTable 
          studentExams={studentExams}    
          studentData={studentData}
        />
      </DetailCard>
      
      <DetailCard title="Performance Trends" icon={FaChartArea} delay={400}>
        <div className="chart-container premium">
          {studentExamsLoading ? (
            <div className="loading-state premium">
              <div className="loading-spinner"></div>
              <span>Loading performance data...</span>
            </div>
          ) : studentExams?.length > 0 ? (
            <WeeklyMarksTrendGraph
              weeklyMarksData={studentExams}
              programType={studentData.Stream}
              studentData={studentData}
            />
          ) : (
            <div className="empty-state premium">
              <FaChartLine />
              <h3>No Performance Data</h3>
              <p>Add weekly marks to see performance trends</p>
              <MuiButton
                variant="contained"
                startIcon={<FaPlus />}
                onClick={() => setShowAddMarksModal(true)}
                className="premium"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                Add First Marks
              </MuiButton>
            </div>
          )}
        </div>
      </DetailCard>
    </div>
  </div>
)}

        {/* Question Papers Tab */}
        {activeTab === "papers" && (
          <div className="tab-content premium">
            <div className="section-header premium">
              <h2>Question Papers</h2>
              <p>Previous year question papers and practice tests</p>
            </div>
            <div className="empty-state premium">
              <FaFileAlt />
              <h3>Question Papers</h3>
              <p>Access to previous year question papers and practice tests</p>
              <MuiButton variant="contained" className="premium">
                Browse Question Papers
              </MuiButton>
            </div>
          </div>
        )}

        {/* Exam Dates Tab */}
        {activeTab === "exams" && (
          <div className="tab-content premium">
            <div className="section-header premium">
              <h2>Exam Dates</h2>
              <p>Upcoming examination schedule</p>
            </div>
            <div className="empty-state premium">
              <FaRegCalendar />
              <h3>Exam Schedule</h3>
              <p>Upcoming exam dates and schedule will be displayed here</p>
              <MuiButton variant="contained" className="premium">
                View Exam Calendar
              </MuiButton>
            </div>
          </div>
        )}

        {/* Classes Info Tab */}
        {activeTab === "classes" && (
          <div className="tab-content premium">
            <DetailCard title="Class Schedule" icon={FaChalkboardTeacher} delay={200}>
              <div className="info-grid premium">
                {studentData.classDateandTime && studentData.classDateandTime.map((schedule, index) => (
                  <DetailItem
                    key={index}
                    icon={FaClock}
                    label={`Session ${index + 1}`}
                    value={schedule}
                    delay={100 * (index + 1)}
                  />
                ))}
              </div>
            </DetailCard>
            <DetailCard title="Class Statistics" icon={FaBookOpen} delay={400}>
              <div className="info-grid premium">
                <DetailItem
                  icon={FaCheckCircle}
                  label="Classes Completed"
                  value={studentData.isRevisionProgramJEEMains2026Student ? studentData.revisionClassesCompleted : studentData.classesCompleted}
                  delay={100}
                />
                <DetailItem
                  icon={FaChartLine}
                  label="Attendance Rate"
                  value={studentData.attendance || "N/A"}
                  delay={200}
                />
              </div>
            </DetailCard>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="tab-content premium">
            <div className="payments-header">
              <h2>Payment History</h2>
              <p>Complete transaction records</p>
            </div>
            <PaymentHistoryTable
              payments={payments}
              monthlyFee={studentData?.monthlyFee || 0}
            />
          </div>
        )}

        {/* Others Tab */}
        {activeTab === "others" && (
          <div className="tab-content premium">
            <div className="content-grid premium">
              <div className="content-column">
                <DetailCard title="Additional Resources" icon={FaInfoCircle} delay={200}>
                  <div className="info-grid premium">
                    <DetailItem
                      icon={FaSearchDollar}
                      label="Source"
                      value={studentData.Source || "N/A"}
                      delay={100}
                    />
                    <DetailItem
                      icon={FaMoneyBillWave}
                      label="Fee Structure"
                      value={`₹${(+studentData["Monthly Fee"] || 0).toLocaleString()}/month`}
                      delay={150}
                    />
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Marks Modal */}
      {showAddMarksModal && studentData && (
        <AddWeeklyMarksModal
          studentId={studentId}
          onClose={() => setShowAddMarksModal(false)}
          programType={studentData.Stream}
        />
      )}
    </div>
  );
};

// Premium Activity Timeline Component
const PremiumActivityTimeline = () => {
  const activities = [
    {
      type: "class",
      label: "Mathematics Class Completed",
      time: "2 hours ago",
      icon: FaChalkboardTeacher,
    },
    {
      type: "payment",
      label: "Monthly Fee Received",
      time: "1 day ago",
      icon: FaMoneyBillAlt,
    },
    {
      type: "exam",
      label: "Weekly Test - 85% Score",
      time: "2 days ago",
      icon: FaClipboardList,
    },
    {
      type: "achievement",
      label: "Top Performer of the Week",
      time: "3 days ago",
      icon: FaAward,
    },
  ];

  return (
    <div className="activity-timeline premium">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="timeline-item premium"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="timeline-glow"></div>
          <div className={`timeline-dot premium ${activity.type}`}>
            <activity.icon />
            <div className="dot-shine"></div>
          </div>
          <div className="timeline-content">
            <p className="timeline-text">{activity.label}</p>
            <span className="timeline-time">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentPortfolio;