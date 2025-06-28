// StudentPortfolio.jsx
import React, { useState, useEffect } from "react"; // Removed useMemo as latestWeeklyMark is no longer needed
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Keep Recharts imports if you use them elsewhere (e.g., Payment History)
import { format, parseISO } from "date-fns";
import "./StudentPortfolio.css";
import AddWeeklyMarksModal from "./AddWeeklyMarksForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeeklyMarks } from "../redux/actions";
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
  FaChartLine,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import { MuiButton } from "./customcomponents/MuiCustomFormFields";
// Import the new line graph component
import WeeklyMarksTrendGraph from "./WeeklyMarksBarChart"; // <--- NEW IMPORT

const StudentPortfolio = () => {
  const { id: studentId } = useParams();
  console.log("studentId",studentId)
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
    weeklyMarks, // NEW: from fetchWeeklyMarks
    loadingWeeklyMarks, // NEW: loading state for weeklyMarks
    weeklyMarksError, // NEW: error state for weeklyMarks
  } = useSelector(state => state.students); 
  const location = useLocation();

  const [studentData, setStudentData] = useState(
    location.state?.studentData || null
  );
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [loadingStudentData, setLoadingStudentData] = useState(
    !location.state?.studentData
  );
  const [error, setError] = useState(null);
  const [marksError, setMarksError] = useState(null);


  // Function to fetch Weekly Marks (returns an array)

  // Callback to refresh marks after a new one is adde

  useEffect(() => {

      dispatch(fetchWeeklyMarks(studentId)); // Fetch weekly marks
  }, []); // Depend on studentId and dispatch

  // --- REMOVED: No longer need to derive latestWeeklyMark as we are passing the full array for trend graph ---
  // const latestWeeklyMark = useMemo(() => { ... }, [weeklyMarks]);

  // Component for a single detail item
  const DetailItem = ({ icon: Icon, label, value, isHighlighted = false }) => (
    <div className={`detail-item ${isHighlighted ? "highlighted" : ""}`}>
      <div className="detail-label">
        {Icon && <Icon className="detail-icon" />}
        <span>{label}</span>
      </div>
      <div className="detail-value">{value}</div>
    </div>
  );

  // Helper function for payment status display
  const getPaymentStatusDisplay = (status) => {
    const statusClass = status?.toLowerCase() === "paid" ? "paid" : "unpaid";
    return (
      <span className={`payment-status-badge ${statusClass}`}>
        {status?.toLowerCase() === "paid" ? (
          <FaCheckCircle />
        ) : (
          <FaExclamationCircle />
        )}
        {status || "N/A"}
      </span>
    );
  };

  // Handle loading and error states for the entire portfolio
  if (loadingStudentData || !studentData) {
    return (
      <div className="full-page-message-container">
        <div className="full-page-message-card">
          {loadingStudentData ? (
            <>
              <h3>
                <FaSpinner className="spin-icon" /> Loading Student Data...
              </h3>
              <p>Please wait while we retrieve the student's information.</p>
            </>
          ) : (
            <>
              <h3>
                <FaExclamationCircle /> Student Data Unavailable
              </h3>
              <p>
                The student's portfolio could not be loaded. This page may not
                be accessed directly, or the data was not passed correctly.
              </p>
              <button
                onClick={() => navigate("/students")}
                className="back-button"
              >
                <FaArrowLeft /> Go to Students List
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Prepare payments data for Recharts (assuming you're still using Recharts for payments)
  const formattedPaymentsData =
    studentData.payments?.map((payment) => ({
      name: payment.month || "Month",
      Amount: payment.amount || 0,
    })) || [];

  return (
    <div className="portfolio-page-container">
      {/* Header Section */}
      <header className="portfolio-header">
        <div className="title-group">
          <FaUserCircle className="header-icon" />
          <h1>{studentData.Name || "Student"}'s Portfolio</h1>
        </div>
        <button onClick={() => navigate("/students")} className="back-button">
          <FaArrowLeft /> Back to Students List
        </button>
      </header>

      {/* Main Content Area */}
      <main className="portfolio-content-area">
        {/* Personal Details Card */}
        <section className="portfolio-card personal-details-card delay-1">
          <h2>
            <FaInfoCircle className="card-icon" /> Personal Details
          </h2>
          <div className="details-grid">
            <DetailItem
              icon={FaUserCircle}
              label="Name"
              value={studentData.Name || "N/A"}
            />
            <DetailItem
              icon={FaTransgender}
              label="Gender"
              value={studentData.Gender || "N/A"}
            />
            <DetailItem
              icon={FaBookOpen}
              label="Subject"
              value={studentData.Subject || "N/A"}
            />
            <DetailItem
              icon={FaCalendarCheck}
              label="Year"
              value={studentData.Year || "N/A"}
            />
            <DetailItem
              icon={FaGraduationCap}
              label="Stream"
              value={studentData.Stream || "N/A"}
            />
            <DetailItem
              icon={FaUniversity}
              label="College"
              value={studentData.College || "N/A"}
            />
            <DetailItem
              icon={FaUsers}
              label="Group"
              value={studentData["Group "] || "N/A"}
            />
            <DetailItem
              icon={FaSearchDollar}
              label="Source"
              value={studentData.Source || "N/A"}
            />
            <DetailItem
              icon={FaDollarSign}
              label="Monthly Payment"
              value={`₹${(studentData["Monthly Fee"] || 0).toLocaleString()}`}
              isHighlighted={true}
            />
            <div className="detail-item highlighted">
              <div className="detail-label">
                <FaMoneyBillWave className="detail-icon" />
                <span>Payment Status</span>
              </div>
              <div className="detail-value">
                {getPaymentStatusDisplay(studentData["Payment Status"])}
              </div>
            </div>
            <DetailItem
              icon={FaChalkboardTeacher}
              label="Total Classes Attended"
              value={studentData["Classes Completed"] || "N/A"}
            />
            <DetailItem
              icon={FaCalendarAlt}
              label="Next Class"
              value={
                studentData.nextClass
                  ? format(parseISO(studentData.nextClass), "MMM dd, p")
                  : "N/A"
              }
            />
          </div>
        </section>

        {/* Marks Performance Card */}
        <section className="portfolio-card marks-card delay-2">
          <h2>
            <span className="title-and-icon-group">
              <FaChartLine className="card-icon" /> Weekly Marks Trend
            </span>

            <MuiButton
              variant="contained"
              color="primary"
              onClick={() => {
                console.log("Add Marks Button Clicked!");
                setShowAddMarksModal(true);
              }}
              startIcon={<FaPlus />}
            >
              Add marks
            </MuiButton>
          </h2>
          {loadingWeeklyMarks ? (
            <div className="loading-message">
              <FaSpinner className="spin-icon" /> Loading marks...
            </div>
          ) : marksError ? (
            <div className="error-message">{marksError}</div>
          ) : weeklyMarks?.length > 0 && studentData.Stream ? (
            <WeeklyMarksTrendGraph
              weeklyMarksData={weeklyMarks} // <--- IMPORTANT: Pass the full array here
              programType={studentData.Stream}
            />
          ) : (
            <div className="no-data-message">
              No weekly marks data available for this student. Add some above!
            </div>
          )}
        </section>

        {/* Payment History Card */}
        <section className="portfolio-card payments-card delay-3">
          <h2>
            <FaDollarSign className="card-icon" /> Payment History
          </h2>
          {formattedPaymentsData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={formattedPaymentsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border-light)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--color-text-light)" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fill: "var(--color-text-light)" }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar
                    dataKey="Amount"
                    fill="var(--color-accent-tertiary)"
                    name="Payment Amount"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-data-message">
              No payment data available for this student.
            </div>
          )}
        </section>
      </main>

      {showAddMarksModal && studentData && (
        <AddWeeklyMarksModal
          studentId={studentId}
          onClose={() => {
            console.log("Closing Add Marks Modal");
            setShowAddMarksModal(false);
          }}
          programType={studentData.Stream}
        />
      )}
    </div>
  );
};

export default StudentPortfolio;
