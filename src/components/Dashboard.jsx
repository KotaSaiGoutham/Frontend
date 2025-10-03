import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./Dashboard.css";
import axios from "axios";
import {
  parse,
  isValid,
  addHours,
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
  getDay,
  isAfter,
} from "date-fns";
import { Snackbar, Alert as MuiAlert, CircularProgress } from "@mui/material";
import {
  FaSun,
  FaUsers,
  FaUserTie,
  FaCalendarDay,
  FaMoneyBillAlt,
  FaCalendarCheck,
  FaMoon,
  FaBookOpen,
  FaCloudSun,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaUserGraduate,
  FaUserClock,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarWeek,
} from "react-icons/fa";
import {
  getUniqueQuote,
  getInitialShownQuoteIndices,
  saveShownQuoteIndices,
} from "../mockdata/mockdata";
import {
  fetchEmployees,
  fetchStudents,
  // fetchUpcomingClasses,
  logoutUser,
  setAuthError,
  fetchDemoClasses,
  fetchExpenditures,
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import {
  getGreetingInfo,
  getRecentEmployeeActivity,
  getRecentStudentActivity,
  getCombinedRecentActivity,
} from "../mockdata/function";
import { getDemoClassMetrics } from "../mockdata/function";
import StudentPayments from "./dashboard/StudentPayments";
import RecentActivity from "./dashboard/RecentActivity";
import UpcomingClassesCard from "./dashboard/UpcomingClassesCard";
import DemoClassInsightsCard from "./dashboard/DemoClassInsightsCard";
import { Link } from "react-router-dom";
import ClassesOverview from "./dashboard/ClassesOverview";
import HistoricalTables from "./dashboard/HistoricalTables";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const dayNameToDayNum = useMemo(
    () => ({
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    }),
    []
  );
  const convertSingleTimeToSlot = useCallback((singleTime) => {
    if (!singleTime || typeof singleTime !== "string") {
      return null;
    }
    singleTime = singleTime.trim();

    if (singleTime.includes(" to ")) {
      const [start, end] = singleTime.split(" to ");
      if (
        isValid(parse(start.trim(), "hh:mm a", new Date())) &&
        isValid(parse(end.trim(), "hh:mm a", new Date()))
      ) {
        return singleTime;
      }
    }

    try {
      let parsedTime = parse(singleTime, "hh:mm a", new Date());
      if (!isValid(parsedTime)) {
        parsedTime = parse(singleTime, "h:mm a", new Date());
      }
      if (!isValid(parsedTime)) {
        parsedTime = parse(singleTime, "hh:mma", new Date());
      }
      if (!isValid(parsedTime)) {
        parsedTime = parse(singleTime, "h:mma", new Date());
      }
      if (!isValid(parsedTime)) {
        const match = singleTime.match(/(\d+)(am|pm)/i);
        if (match) {
          const hour = parseInt(match[1], 10);
          const ampm = match[2].toLowerCase();
          let tempDate = new Date();
          tempDate.setHours(
            hour +
              (ampm === "pm" && hour !== 12
                ? 12
                : ampm === "am" && hour === 12
                ? -12
                : 0),
            0,
            0,
            0
          );
          parsedTime = tempDate;
        }
      }

      if (isValid(parsedTime)) {
        const endTime = addHours(parsedTime, 1);
        return `${format(parsedTime, "hh:mm a")} to ${format(
          endTime,
          "hh:mm a"
        )}`;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }, []);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [processedStudentActivity, setProcessedStudentActivity] = useState([]);
  const [hasAttemptedAutoGenerateSession, setHasAttemptedAutoGenerateSession] =
    useState(false);
  const [greetingInfo, setGreetingInfo] = useState({
    text: "",
    className: "",
    imageUrl: "",
  });
  const [isGeneratingAuto, setIsGeneratingAuto] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [shownQuoteIndices, setShownQuoteIndices] = useState(
    getInitialShownQuoteIndices
  );
  const [autoGenerateErrorMsg, setAutoGenerateErrorMsg] = useState(null);

  const {
    timetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students);
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useSelector((state) => state.employees);
  const {
    timetables: autoTimetables,
    loading: autoTimetablesLoading,
    error: autoTimetablesError,
    hasSavedToday: autoTimetablesHasSavedToday,
  } = useSelector((state) => state.autoTimetables);
  const { expenditures, payments, totalStudentPayments, totalExpenditure } =
    useSelector((state) => state.expenditures);

  const canAccessAll = user?.AllowAll;
  const currentUserSubject = user?.isPhysics
    ? "Physics"
    : user?.isChemistry
    ? "Chemistry"
    : null;
  const currentUserFaculty = user?.name || "Unknown Faculty";
  const combinedActivity = getCombinedRecentActivity(students, payments);

  const processedEmployeeActivity = getRecentEmployeeActivity(employees);
  // ADDED: Helper function to show the MUI Snackbar
  const showSnackbar = useCallback((message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };


  useEffect(() => {
    const updateAndSaveQuote = () => {
      setShownQuoteIndices((prevIndices) => {
        const { quote, newShownIndices } = getUniqueQuote(prevIndices);
        setCurrentQuote(quote);
        saveShownQuoteIndices(newShownIndices);
        return newShownIndices;
      });
    };

    setGreetingInfo(getGreetingInfo());
    updateAndSaveQuote();
    const interval = setInterval(() => {
      setGreetingInfo(getGreetingInfo());
      updateAndSaveQuote();
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (!token) {
      console.warn("No authentication token found. Redirecting to login.");
      dispatch(logoutUser());
      dispatch(setAuthError("No authentication token found. Please log in."));
      return;
    }
    dispatch(fetchStudents());
    dispatch(fetchEmployees());
    // dispatch(fetchUpcomingClasses({date :new Date().toLocaleDateString("en-GB")}));
    dispatch(fetchDemoClasses());
    dispatch(fetchExpenditures(currentYear, currentMonth, "month"));
  }, [dispatch, user]);
  useEffect(() => {
    if (students && payments) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // Correctly filter payments for the current month
      const currentMonthPayments = payments.filter(
        (payment) =>
          payment.month ===
          `${currentYear}-${String(currentMonth).padStart(2, "0")}`
      );

      // Pass the pre-filtered data to the helper function
      const processedStudents = getRecentStudentActivity(
        students,
        currentMonthPayments
      );
      setProcessedStudentActivity(processedStudents);
    }
  }, [students, payments]);
  let filteredStudents = [];
  if (students && students.length > 0 && user) {
    if (user.AllowAll) {
      filteredStudents = students;
    } else if (user.isPhysics) {
      filteredStudents = students.filter(
        (student) => student.Subject === "Physics"
      );
    } else if (user.isChemistry) {
      filteredStudents = students.filter(
        (student) => student.Subject === "Chemistry"
      );
    } else {
      filteredStudents = [];
      console.warn(
        "User has no specific subject permissions (isPhysics, isChemistry) and not AllowAll. Displaying no students."
      );
    }
    filteredStudents = filteredStudents.filter(
      (student) => student.isActive === true
    );
  }
  const allTimetables = [...(timetables || []), ...(autoTimetables || [])];

  let filteredTimetables = [];
  if (allTimetables.length > 0 && user) {
    let permissionFilteredTimetables = [];

    if (user.AllowAll) {
      permissionFilteredTimetables = allTimetables;
    } else if (user.isPhysics) {
      permissionFilteredTimetables = allTimetables.filter(
        (schedule) => schedule.Subject === "Physics"
      );
    } else if (user.isChemistry) {
      permissionFilteredTimetables = allTimetables.filter(
        (schedule) => schedule.Subject === "Chemistry"
      );
    } else {
      permissionFilteredTimetables = [];
      console.warn(
        "User has no specific subject permissions for timetables. Displaying no classes."
      );
    }

    const now = new Date();
    filteredTimetables = permissionFilteredTimetables.filter((schedule) => {
      try {
        const classStartTimeStr = schedule.Time.split(" to ")[0];
        const classDateTime = parse(
          `${schedule.Day} ${classStartTimeStr}`,
          "dd/MM/yyyy hh:mm a",
          new Date()
        );
        return isValid(classDateTime) && isAfter(classDateTime, now);
      } catch (e) {
        console.error("Error parsing timetable date/time:", schedule, e);
        return false;
      }
    });

    filteredTimetables.sort((a, b) => {
      const dateA = parse(
        `${a.Day} ${a.Time.split(" to ")[0]}`,
        "dd/MM/yyyy hh:mm a",
        new Date()
      );
      const dateB = parse(
        `${b.Day} ${b.Time.split(" to ")[0]}`,
        "dd/MM/yyyy hh:mm a",
        new Date()
      );

      if (isValid(dateA) && isValid(dateB)) {
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });
  }
  const totalStudents = filteredStudents.length;
  const totalEmployees = employees.length;
  const totalFeeCollection = filteredStudents.reduce((sum, student) => {
    const paymentStatus = student["Payment Status"];
    const monthlyFee =
      typeof student.monthlyFee === "number"
        ? student.monthlyFee
        : parseFloat(student["Monthly Fee"]);

    if (paymentStatus === "Paid" && !isNaN(monthlyFee)) {
      return sum + monthlyFee;
    }
    return sum;
  }, 0);

  if (students.loading) {
    return (
      <div className="dashboard-loading">
        <CircularProgress />
        <p>Loading Dashboard Data...</p>
      </div>
    );
  }
  const { demoClasses, loading, error } = useSelector(
    (state) => state.demoClasses
  );
  const firstName = user && user.name ? user.name.split(" ")[0] : "Guest";
  const userHasSubjectPreference = user.isPhysics || user.isChemistry;

  const filteredDemoClasses = userHasSubjectPreference
    ? demoClasses?.filter((demo) => {
        const demoSubject = demo.Subject?.toLowerCase();
        return (
          (user.isPhysics && demoSubject === "physics") ||
          (user.isChemistry && demoSubject === "chemistry") ||
          (user.isMaths && demoSubject === "maths")
        );
      })
    : demoClasses;

  const demoMetrics = getDemoClassMetrics(filteredDemoClasses);

  // Initialize counters correctly
  let classesThisMonth = 0;
  let classesThisWeek = 0;
  const classesByDay = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  // Get today's date and the start of the week (Sunday for consistency)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Helper function to get the date of a specific day of the week in the current week
  const getDayDate = (dayString) => {
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const dayIndex = dayMap[dayString];
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);
    return date;
  };

  // Loop through each active student
  students.forEach((student) => {
    if (student.isActive) {
      // Loop through each of the student's scheduled classes
      student.classDateandTime.forEach((classString) => {
        const day = classString.split("-")[0];

        // Get the specific date for this class in the current week
        const classDateInCurrentWeek = getDayDate(day);

        // Check if this class happened this month
        if (
          classDateInCurrentWeek.getFullYear() === today.getFullYear() &&
          classDateInCurrentWeek.getMonth() === today.getMonth()
        ) {
          classesThisMonth++;
        }

        // Check if this class happened this week and is not in the future
        if (
          classDateInCurrentWeek >= startOfWeek &&
          classDateInCurrentWeek <= today
        ) {
          classesThisWeek++;
        }

        // Count for each day of the week (original logic, now working)
        if (classesByDay.hasOwnProperty(day)) {
          classesByDay[day]++;
        }
      });
    }
  });

  return (
    <div className="dashboard-container">
      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <HistoricalTables students={students} />
      {/* <div className="metrics-grid">
        <Link
          to="/students"
          className="dashboard-card metric-card fade-in-up"
          style={{ textDecoration: "none" }}
        >
          <div className="metric-icon metric-icon-student">
            <FaUsers />
          </div>
          <div className="metric-info">
            <p className="metric-label">Total Students (Active)</p>
            <p className="metric-value">{totalStudents}</p>
          </div>
        </Link>

        <Link
          to="/employees"
          className="dashboard-card metric-card fade-in-up"
          style={{ textDecoration: "none" }}
        >
          {" "}
          <div className="metric-icon metric-icon-employee">
            <FaUserTie />
          </div>
          <div className="metric-info">
            <p className="metric-label">Total Employees</p>
            <p className="metric-value">{totalEmployees}</p>
          </div>
        </Link>

        <div className="dashboard-card metric-card fade-in-up delay-2">
          <div className="metric-icon metric-icon-classes">
            <FaCalendarDay />
          </div>
          <div className="metric-info">
            <p className="metric-label">Upcoming Classes</p>
            <p className="metric-value">{filteredTimetables?.length}</p>
          </div>
        </div>

        <div className="dashboard-card metric-card fade-in-up delay-3">
          <div className="metric-icon metric-icon-fee">
            <FaRupeeSign />
          </div>
          <div className="metric-info">
            <p className="metric-label">Monthly Fee Collection</p>
            <p className="metric-value">
              ₹{totalFeeCollection?.toLocaleString()}
            </p>
          </div>
        </div>
      </div> */}
      {/* <ClassesOverview students={students} /> */}
      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2.33fr 1fr",
          gap: "2.5rem",
          padding: "2rem",
          backgroundColor: "#f0f2f5",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <StudentPayments students={processedStudentActivity} />
        <RecentActivity activities={combinedActivity} />
        <UpcomingClassesCard timetables={filteredTimetables} />
        <DemoClassInsightsCard
          demoMetrics={demoMetrics}
          filteredDemoClasses={filteredDemoClasses}
        />
      </div>
    </div>
  );
};

export default Dashboard;
