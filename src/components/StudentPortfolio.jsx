// StudentPortfolio.jsx
import React, { useState, useEffect } from "react"; // Removed useMemo as latestWeeklyMark is no longer needed
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { formatFirebaseDate, capitalize } from "../mockdata/funcation";
import "./StudentPortfolio.css";
import AddWeeklyMarksModal from "./AddWeeklyMarksForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeeklyMarks,
  fetchPaymentHistory,
  fetchUpcomingClasses,
} from "../redux/actions";
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
  FaCalendarDay,
  FaHistory,
  FaWallet,
  FaPhone,
  FaMale,
  FaFemale,
} from "react-icons/fa";
import { MuiButton } from "./customcomponents/MuiCustomFormFields";
import WeeklyMarksTrendGraph from "./WeeklyMarksBarChart";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { TimelineCard } from "./TimeLineCard";
const formatPhone = (num) =>
  num ? (
    <a href={`tel:${num}`} className="phone-link">
      {num.replace(/(\d{5})(\d{5})/, "$1 $2")}
    </a>
  ) : null;

const StudentPortfolio = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { weeklyMarks, loadingWeeklyMarks } = useSelector(
    (state) => state.students
  );
  const location = useLocation();
  const {
    timetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const [studentData, setStudentData] = useState(
    location.state?.studentData || null
  );
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [loadingStudentData, setLoadingStudentData] = useState(
    !location.state?.studentData
  );
  const [error, setError] = useState(null);
  const [marksError, setMarksError] = useState(null);
  console.log("studentData", studentData);

  useEffect(() => {
    dispatch(fetchPaymentHistory(studentData?.id || studentId));
  }, [studentData?.id || studentId]);

  useEffect(() => {
    dispatch(fetchWeeklyMarks(studentData?.id || studentId));
    dispatch(fetchUpcomingClasses());
  }, []);
  const payments = useSelector((state) => state.payments.data);

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

  const { user } = useSelector((state) => state.auth);
  const feeAmount = studentData?.monthlyFee || 0;
  const timelineEvents = [];
if (timetables?.length > 0 && studentData?.Name) {
  const matchingClasses = timetables
    .filter((entry) => entry.Student === studentData.Name)
    .map((entry) => ({
      ...entry,
      parsedDate: new Date(
        entry.Day.split("/").reverse().join("/") // Convert to YYYY/MM/DD
      ),
    }))
    .sort((a, b) => b.parsedDate - a.parsedDate); // latest first

  if (matchingClasses.length > 0) {
    const latestClass = matchingClasses[0];
    const formattedDate = format(latestClass.parsedDate, "dd MMM yyyy (EEE)");

    const label = [
      `📘 Subject: ${latestClass.Subject}`,
      `📖 Topic: ${latestClass.Topic}`,
      `👨‍🏫 Faculty: ${latestClass.Faculty}`,
      `🕒 Time: ${latestClass.Time}`,
      `📅 Date: ${formattedDate}`,
    ].join("\n");

    timelineEvents.push({
      type: "Next Class",
      label,
      timestamp: formattedDate,
    });
  }
}



  if (studentData?.paidDate) {
    timelineEvents.push({
      type: "Payment",
      label: "Monthly Fee Paid",
      timestamp: formatFirebaseDate(studentData?.paidDate),
    });
  }

  if (studentData?.lastUpdatedClassesAt) {
    timelineEvents.push({
      type: "Class Update",
      label: "Classes Completed",
      timestamp: formatFirebaseDate(studentData?.lastUpdatedClassesAt),
    });
  }

if (weeklyMarks?.length > 0) {
  const sortedMarks = [...weeklyMarks].sort((a, b) => {
    const aTime = a.timestamp?.seconds || a.timestamp?._seconds || 0;
    const bTime = b.timestamp?.seconds || b.timestamp?._seconds || 0;
    return bTime - aTime; // Latest first
  });

  const latestMark = sortedMarks[0];

  if (latestMark?.timestamp) {
    const subjects = ["maths", "physics", "chemistry", "botany", "zoology"];

    const subjectScoreLines = subjects
      .filter(
        (subj) =>
          latestMark[subj] != null &&
          latestMark[`max${capitalize(subj)}`] != null
      )
      .map(
        (subj) =>
          `📘 ${capitalize(subj)}: ${latestMark[subj]}/${
            latestMark[`max${capitalize(subj)}`]
          }`
      );

    const label = subjectScoreLines.join("\n");

    timelineEvents.push({
      type: "Marks",
      label,
      timestamp: formatFirebaseDate(latestMark.timestamp),
    });
  }
}


  payments?.forEach((payment) => {
    if (payment?.date) {
      timelineEvents.push({
        type: "Payment",
        label: `Payment of ₹${payment?.amount}`,
        timestamp: formatFirebaseDate(payment?.date),
      });
    }
  });

  timelineEvents.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div
      className="portfolio-page-container"
      style={{ display: "flex", gap: "20px" }}
    >
      <div style={{ width: "70%" }}>
        <header className="portfolio-header">
          <div className="title-group">
            <FaUserCircle className="header-icon" />
            <h1>{studentData.Name || "Student"}'s Portfolio</h1>
          </div>
          {user.role === "student" && (
            <button
              onClick={() => navigate("/students")}
              className="back-button"
            >
              <FaArrowLeft /> Back to Students List
            </button>
          )}
        </header>

        {/* Main Content Area */}
        <main className="portfolio-content-area">
          {/* Personal Details Card */}
          <section className="portfolio-card personal-details-card delay-1">
            <h2>
              <FaInfoCircle className="card-icon" /> Personal Details
            </h2>
            <div className="details-grid">
              {/* --- Basic Info --- */}
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
                icon={FaUsers}
                label="Group"
                value={studentData["Group "] || "N/A"}
              />
              <DetailItem
                icon={FaUniversity}
                label="College"
                value={studentData.College || "N/A"}
              />
              <DetailItem
                icon={FaSearchDollar}
                label="Source"
                value={studentData.Source || "N/A"}
              />

              {/* --- Contact --- */}
              <DetailItem
                icon={FaPhone}
                label="Student Contact"
                value={formatPhone(studentData.ContactNumber) || "N/A"}
              />
              <DetailItem
                icon={FaMale}
                label="Father Contact"
                value={formatPhone(studentData.father_contact) || "N/A"}
              />
              <DetailItem
                icon={FaFemale}
                label="Mother Contact"
                value={formatPhone(studentData.mother_contact) || "N/A"}
              />

              {/* --- Payment --- */}
              <DetailItem
                icon={FaDollarSign}
                label="Monthly Payment"
                value={`₹${(
                  +studentData["Monthly Fee"] || 0
                ).toLocaleString()}`}
                isHighlighted
              />
              <DetailItem
                icon={FaMoneyBillWave}
                label="Payment Status"
                value={getPaymentStatusDisplay(studentData["Payment Status"])}
                isHighlighted
              />
              <DetailItem
                icon={FaHistory}
                label="Previous Payment Date"
                value={formatFirebaseDate(studentData.paidDate)}
              />
              <DetailItem
                icon={FaCalendarDay}
                label="Next Expected Payment Date"
                value={formatFirebaseDate(studentData.nextDueDate)}
                isHighlighted={studentData["Payment Status"] === "Unpaid"}
              />

              {/* --- Class Info --- */}
              <DetailItem
                icon={FaChalkboardTeacher}
                label="Total Classes Attended"
                value={studentData.classesCompleted || "N/A"}
              />
              <DetailItem
                icon={FaCalendarAlt}
                label="Next Class"
                value={
                  studentData.nextClass
                    ? format(studentData.nextClass, "MMM dd, hh:mm a")
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
                studentData={studentData}
              />
            ) : (
              <div className="no-data-message">
                No weekly marks data available for this student. Add some above!
              </div>
            )}
          </section>

          <section className="portfolio-card payments-card delay-3">
            <h2>
              <FaDollarSign className="card-icon" /> Payment History
            </h2>

            <PaymentHistoryTable payments={payments} monthlyFee={feeAmount} />
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
      <div style={{ width: "30%" }}>
        <TimelineCard events={timelineEvents} />
      </div>
    </div>
  );
};

export default StudentPortfolio;
