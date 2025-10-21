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
  FaStar,
  FaRocket,
  FaArrowUp,
  FaAward,
  FaCrown,
  FaMedal,
  FaFileAlt
} from "react-icons/fa";
import { MuiButton } from "./customcomponents/MuiCustomFormFields";
import WeeklyMarksTrendGraph from "./WeeklyMarksBarChart";
import PaymentHistoryTable from "./PaymentHistoryTable";

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
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(!location.state?.studentData);

  const payments = useSelector((state) => state.payments.data);
  console.log("payments",payments)

  // Format phone number
  const formatPhone = (num) => {
    if (!num) return "N/A";
    return (
      <a href={`tel:${num}`} className="phone-link">
        {num.replace(/(\d{5})(\d{5})/, "$1 $2")}
      </a>
    );
  };

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

  // // Simulate loading
  // useEffect(() => {
  //   if (!studentData) {
  //     const timer = setTimeout(() => {
  //       setLoading(false);
  //       setStudentData({
  //         Name: "John Doe",
  //         isActive: true,
  //         Gender: "Male",
  //         Subject: "Mathematics, Physics",
  //         Year: "2024",
  //         Stream: "Science",
  //         "Group ": "A",
  //         College: "City College",
  //         Source: "Referral",
  //         "Monthly Fee": "5000",
  //         "Payment Status": "Paid",
  //         paidDate: { seconds: 1701388800 },
  //         nextDueDate: { seconds: 1704067200 },
  //         classesCompleted: 24,
  //         nextClass: new Date(),
  //         classDateandTime: ["Mon, Wed, Fri - 4:00 PM", "Tue, Thu - 3:00 PM"],
  //         ContactNumber: "9876543210",
  //         FatherContactNumber: "9876543211",
  //         MotherContactNumber: "9876543212",
  //         admissionDate: { seconds: 1696118400 },
  //         performance: "excellent",
  //         attendance: "95%"
  //       });
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [studentData]);

  // Get performance badge
  const getPerformanceBadge = () => {
    if (studentData.performance === "excellent") {
      return { icon: FaCrown, label: "Top Performer", color: "gold" };
    } else if (studentData.performance === "good") {
      return { icon: FaMedal, label: "Excellent", color: "silver" };
    } else {
      return { icon: FaStar, label: "Good", color: "bronze" };
    }
  };

  const performanceBadge = getPerformanceBadge();

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
          {/* <div className="header-sparkles">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div> */}
        </div>

        <div className="header-content">
          <div className="student-profile-header premium">
            <div className="profile-avatar-container">
              <div className="avatar-glow"></div>
              <div className="profile-avatar premium">
                <FaUserGraduate />
                {/* <div className="avatar-pulse"></div> */}
              </div>
              {/* <div className={`status-indicator premium ${studentData.isActive ? 'active' : 'inactive'}`}>
          {studentData.isActive ? <FaCheckCircle /> : <FaExclamationCircle />}
        </div>
        <div className="achievement-badge">
          <FaStar />
        </div> */}
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
            { id: "academics", label: "Academics", icon: FaBook },
            { id: "performance", label: "Performance", icon: FaChartBar },
            { id: "payments", label: "Payments", icon: FaDollarSign },
{ id: "materials", label: "Materials", icon: FaFileAlt }
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
            {/* Stats Grid */}
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
              {/* Left Column */}
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
                          {formatPhone(studentData.FatherContactNumber)}
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
                          {formatPhone(studentData.MotherContactNumber)}
                        </span>
                      </div>
                    </div>
                  </div>
                </DetailCard>
              </div>

              {/* Right Column */}
              <div className="content-column">
                <DetailCard
                  title="Payment Status"
                  icon={FaDollarSign}
                  delay={300}
                >
                  <div className="payment-status premium">
                    {/* <div className="payment-visual">
                      <div className="payment-circle">
                        <div className="payment-progress"></div>
                        <div className="payment-amount">
                          <span>₹{(+studentData["Monthly Fee"] || 0).toLocaleString()}</span>
                          <small>per month</small>
                        </div>
                      </div>
                    </div> */}
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

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="tab-content premium">
            <div className="performance-header premium">
              <h2>Academic Performance</h2>
              <p>Track progress and weekly marks</p>
            </div>

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
                  >
                    Add First Marks
                  </MuiButton>
                </div>
              )}
            </div>
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

        {/* Schedule Tab */}
        {activeTab === "materials" && (
          <div className="tab-content premium">
            {studentData && studentId && studentData.admissionDate && (
              <LectureMaterialsTable
                studentId={studentId}
                studentName={studentData.Name}
                studentClassSchedule={studentData.classDateandTime}
                admissionDate={studentData.admissionDate}
              />
            )}
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
