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
} from "react-icons/fa";
import { MuiButton } from "./customcomponents/MuiCustomFormFields";
import WeeklyMarksTrendGraph from "./WeeklyMarksBarChart";
import PaymentHistoryTable from "./PaymentHistoryTable";

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

  // Highlighted Change: Use studentexams from the studentExams reducer
  const { studentExams, loading: studentExamsLoading } = useSelector(
    (state) => state.studentExams
  );

  const location = useLocation();
  const { timetables, loading: classesLoading } = useSelector(
    (state) => state.classes
  );
  const { timetables: autoTimetables, loading: autoTimetablesLoading } =
    useSelector((state) => state.autoTimetables);
  const [studentData, setStudentData] = useState(
    location.state?.studentData || null
  );
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [loadingStudentData, setLoadingStudentData] = useState(
    !location.state?.studentData
  );
  const [error, setError] = useState(null);
  const [marksError, setMarksError] = useState(null);

  useEffect(() => {
    dispatch(fetchPaymentHistory(studentData?.id || studentId));
  }, [studentData?.id, studentId, dispatch]);

  useEffect(() => {
    // This action already fetches the required data
    dispatch(fetchStudentExamsByStudent(studentData?.id || studentId));
    dispatch(
      fetchUpcomingClasses({ date: new Date().toLocaleDateString("en-GB") })
    );
    dispatch(fetchAutoTimetablesForToday());
  }, [studentData?.id, studentId, dispatch]);

  const payments = useSelector((state) => state.payments.data);
  const { user } = useSelector((state) => state.auth);

  const DetailItem = ({ icon: Icon, label, value, isHighlighted = false }) => (
    <div className={`detail-item ${isHighlighted ? "highlighted" : ""}`}>
      <div className="detail-label">
        {Icon && <Icon className="detail-icon" />}
        <span>{label}</span>
      </div>
      <div className="detail-value">{value}</div>
    </div>
  );

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

  const feeAmount = studentData?.monthlyFee || 0;
  const timelineEvents = [];

  if (
    (timetables?.length > 0 || autoTimetables?.length > 0) &&
    studentData?.Name
  ) {
    const combinedTimetables = [
      ...(timetables || []),
      ...(autoTimetables || []),
    ];
    const matchingClasses = combinedTimetables
      .filter((entry) => entry.Student === studentData.Name)
      .map((entry) => ({
        ...entry,
        parsedDate: new Date(entry.Day.split("/").reverse().join("/")),
      }))
      .sort((a, b) => b.parsedDate - a.parsedDate);

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
      timelineEvents.push({ type: "Next Class", label });
    }
  }

  // Highlighted Change: Use studentExams to build the timeline
  if (studentExams?.length > 0) {
    const sortedExams = [...studentExams].sort((a, b) => {
      const aTime = a.createdAt?.seconds || a.createdAt?._seconds || 0;
      const bTime = b.createdAt?.seconds || b.createdAt?._seconds || 0;
      return bTime - aTime;
    });

    const latestExam = sortedExams[0];

    if (latestExam?.createdAt) {
      const subjects = ["physics", "chemistry", "maths"]; // Use subjects based on your data
      const subjectScoreLines = subjects
        .filter(
          (subj) =>
            latestExam[subj] != null &&
            latestExam[`max${capitalize(subj)}`] != null
        )
        .map(
          (subj) =>
            `📘 ${capitalize(subj)}: ${latestExam[subj]}/${
              latestExam[`max${capitalize(subj)}`]
            }`
        );

      const label = [`Exam: ${latestExam.examName}`, ...subjectScoreLines].join(
        "\n"
      );

      timelineEvents.push({
        type: "Marks",
        label,
        timestamp: formatFirebaseDate(latestExam.createdAt),
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
      <div>
        <main className="portfolio-content-area">
          <section className="portfolio-card personal-details-card delay-1">
            {studentData && studentId && studentData.admissionDate && (
              <section className="portfolio-card delay-4">
                <LectureMaterialsTable
                  studentId={studentId}
                    studentName={studentData.Name}   
                  studentClassSchedule={studentData.classDateandTime}
                  admissionDate={studentData.admissionDate}
                />
              </section>
            )}

            {/* Student Name Header */}
            <div className="student-name-header">
              <FaUserCircle className="name-icon" />
              <h1>{studentData.Name || "N/A"}</h1>
              <span className="student-status">
                {studentData.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="details-sections">
              {/* Personal Details Section */}
              <div className="details-section">
                <h2>
                  <FaInfoCircle className="card-icon" /> Personal Details
                </h2>
                <div className="details-grid">
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
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="details-section">
                <h2>
                  <FaMoneyBillWave className="card-icon" /> Payment Details
                </h2>
                <div className="details-grid">
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
                    value={getPaymentStatusDisplay(
                      studentData["Payment Status"]
                    )}
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
                </div>
              </div>

              {/* Class Details Section */}
              <div className="details-section">
                <h2>
                  <FaChalkboardTeacher className="card-icon" /> Class Details
                </h2>
                <div className="details-grid">
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
                  <div className="detail-item class-schedule">
                    <div className="detail-icon">
                      <FaClock />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Class Schedule</span>
                      <div className="schedule-list">
                        {studentData.classDateandTime &&
                        studentData.classDateandTime.length > 0 ? (
                          studentData.classDateandTime.map(
                            (schedule, index) => (
                              <span key={index} className="schedule-item">
                                {schedule}
                              </span>
                            )
                          )
                        ) : (
                          <span className="detail-value">No schedule set</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="details-section">
                <h2>
                  <FaPhone className="card-icon" /> Contact Details
                </h2>
                <div className="details-grid">
                  <DetailItem
                    icon={FaPhone}
                    label="Student Contact"
                    value={formatPhone(studentData.ContactNumber) || "N/A"}
                  />
                  <DetailItem
                    icon={FaMale}
                    label="Father Contact"
                    value={
                      formatPhone(studentData.FatherContactNumber) || "N/A"
                    }
                  />
                  <DetailItem
                    icon={FaFemale}
                    label="Mother Contact"
                    value={
                      formatPhone(studentData.MotherContactNumber) || "N/A"
                    }
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="portfolio-card marks-card delay-2">
            {/* <h2>
              <span className="title-and-icon-group">
                <FaChartLine className="card-icon" /> Weekly Marks Trend
              </span>
              <MuiButton
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowAddMarksModal(true);
                }}
                startIcon={<FaPlus />}
              >
                Add marks
              </MuiButton>
            </h2> */}
            {studentExamsLoading ? ( // Highlighted: Use new loading state
              <div className="loading-message">
                <FaSpinner className="spin-icon" /> Loading marks...
              </div>
            ) : marksError ? (
              <div className="error-message">{marksError}</div>
            ) : studentExams?.length > 0 && studentData.Stream ? (
              <WeeklyMarksTrendGraph
                weeklyMarksData={studentExams} // Highlighted: Pass studentExams
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
              setShowAddMarksModal(false);
            }}
            programType={studentData.Stream}
          />
        )}
        <TimeLineCard events={timelineEvents} />
      </div>
    </div>
  );
};

export default StudentPortfolio;

const TimeLineCard = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <section className="portfolio-card timeline-card delay-0">
        <h2>
          <FaClock className="card-icon" /> Recent Activity
        </h2>
        <p className="no-activity">No recent activity to display.</p>
      </section>
    );
  }

  const getEventIcon = (label) => {
    if (label.includes("Payment")) {
      return FaMoneyBillAlt;
    }
    if (label.includes("Class")) {
      return FaBookOpen;
    }
    if (label.includes("Marks") || label.includes("Exam")) {
      return FaClipboardList;
    }
    return FaInfoCircle;
  };

  const getIndicatorColor = (label) => {
    if (label.includes("Payment")) {
      return "#28a745";
    }
    if (label.includes("Class")) {
      return "#007bff";
    }
    if (label.includes("Marks") || label.includes("Exam")) {
      return "#ffc107";
    }
    return "#6c757d";
  };

  return (
    <section className="portfolio-card timeline-card delay-0">
      <h2>
        <FaClock className="card-icon" /> Recent Activity
      </h2>
      <ul className="timeline-list">
        {events.map((event, i) => {
          const EventIcon = getEventIcon(event.label);
          const subHeading =
            event.type === "Marks"
              ? "📊 Weekly Marks"
              : event.type === "Next Class"
              ? "📅 Next Class"
              : event.type === "Payment"
              ? "💰 Payment"
              : "🔔 Activity";
          const showTimestamp = false;
          const labelLines = Array.isArray(event.label)
            ? event.label
            : event.label.split("\n");

          return (
            <li
              key={i}
              className="timeline-item"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span
                className="timeline-indicator"
                style={{ backgroundColor: getIndicatorColor(event.label) }}
              >
                <EventIcon className="timeline-event-icon" />
              </span>
              <div className="timeline-content">
                <div className="timeline-subheading">{subHeading}</div>
                <div className="timeline-text">
                  {labelLines.map((line, idx) => (
                    <div
                      key={idx}
                      style={{ marginBottom: "4px", lineHeight: "1.4" }}
                    >
                      {line}
                    </div>
                  ))}
                  {showTimestamp && (
                    <span className="timestamp-inline">
                      ({event.timestamp})
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
