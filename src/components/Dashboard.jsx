import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO, addDays } from "date-fns";
import "./Dashboard.css"; // Ensure this CSS file is correctly linked

// Import ALL necessary icons
import {
  FaSun,
  FaCloudMoon,
  FaUsers, // For Total Students
  FaUserTie, // For Total Employees
  FaCalendarDay, // For Upcoming Classes Metric
  FaMoneyBillAlt, // For Fee Collection Metric
  FaCalendarCheck, // For Upcoming Classes Card Header
  FaChartBar, // For Student Statistics Chart
  FaChartLine, // For Test Results Chart
  FaSearchDollar, // For Fee Collection Chart
} from "react-icons/fa";

// --- Comprehensive Mock Data (Used as fallback and for generating dynamic parts like Upcoming Classes & Chart data) ---
const mockStudentsData = [
  {
    id: "s1",
    Name: "Alice Wonderland",
    subject: "Maths",
    monthlyFee: 1500,
    admissionDate: new Date(2024, 0, 15), // January 15, 2024
    classesCompleted: 25,
    paymentStatus: "Paid",
  },
  {
    id: "s2",
    Name: "Bob The Builder",
    subject: "Physics",
    monthlyFee: 1800,
    admissionDate: new Date(2023, 11, 1), // December 1, 2023
    classesCompleted: 30,
    paymentStatus: "Unpaid",
  },
  {
    id: "s3",
    Name: "Charlie Chaplin",
    subject: "Chemistry",
    monthlyFee: 1600,
    admissionDate: new Date(2024, 1, 20), // February 20, 2024
    classesCompleted: 18,
    paymentStatus: "Paid",
  },
  {
    id: "s4",
    Name: "Diana Prince",
    subject: "Biology",
    monthlyFee: 1700,
    admissionDate: new Date(2024, 2, 5), // March 5, 2024
    classesCompleted: 22,
    paymentStatus: "Paid",
  },
  {
    id: "s5",
    Name: "Eve Harrington",
    subject: "Maths",
    monthlyFee: 1500,
    admissionDate: new Date(2024, 3, 10), // April 10, 2024
    classesCompleted: 10,
    paymentStatus: "Unpaid",
  },
  {
    id: "s6",
    Name: "Frankenstein Monster",
    subject: "Physics",
    monthlyFee: 1800,
    admissionDate: new Date(2024, 4, 1), // May 1, 2024
    classesCompleted: 5,
    paymentStatus: "Paid",
  },
  {
    id: "s7",
    Name: "Grace Hopper",
    subject: "Chemistry",
    monthlyFee: 1600,
    admissionDate: new Date(2023, 9, 25), // October 25, 2023
    classesCompleted: 40,
    paymentStatus: "Paid",
  },
];

// Mock employee data (for API fallback if needed, or if API returns empty)
const mockEmployeesData = [
  { id: "e1", name: "Professor X", role: "Physics Teacher", salary: 50000 },
  { id: "e2", name: "Ms. Frizzle", role: "Maths Teacher", salary: 48000 },
  { id: "e3", name: "Dr. Jekyll", role: "Chemistry Teacher", salary: 52000 },
  { id: "e4", name: "Nurse Joy", role: "Admin Staff", salary: 30000 },
];

// --- Helper function to generate mock timetable data ---
const generateMockTimetableData = (studentsForNames) => {
  const today = new Date();
  const timetable = [];
  const subjects = ["Maths", "Physics", "Chemistry", "Biology"];
  // Use names from the provided studentsForNames, falling back to mockStudentsData if empty
  const studentsNames =
    studentsForNames.length > 0
      ? studentsForNames.map((s) => s.Name)
      : mockStudentsData.map((s) => s.Name);

  for (let i = 0; i < 7; i++) {
    // Generate classes for the next 7 days
    const classDate = addDays(today, i);
    for (let j = 0; j < 2; j++) {
      // Two classes per day
      const randomStudent =
        studentsNames[Math.floor(Math.random() * studentsNames.length)];
      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];
      const randomHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 4 PM
      const randomMinute = Math.random() < 0.5 ? "00" : "30";
      const ampm = randomHour < 12 ? "AM" : "PM";
      const displayHour =
        randomHour > 12 ? randomHour - 12 : randomHour === 0 ? 12 : randomHour; // Adjust for 12 AM/PM
      const time = `${displayHour
        .toString()
        .padStart(2, "0")}:${randomMinute} ${ampm}`;

      timetable.push({
        id: `class-${i}-${j}`,
        studentName: randomStudent,
        date: format(classDate, "yyyy-MM-dd"), // "2025-06-19"
        time: time,
        subject: randomSubject,
      });
    }
  }
  return timetable;
};

// --- Helper functions to generate mock chart data ---

// Generates mock data for a line chart (e.g., test scores over months)
const generateMockTestScores = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const scores = months.map(
    () => Math.floor(Math.random() * (95 - 60 + 1)) + 60
  ); // Scores between 60 and 95
  return { labels: months, data: scores, label: "Avg. Score" };
};

// Generates mock data for student demographics (e.g., by subject)
const generateMockStudentDemographics = (studentsData) => {
  const subjectCounts = {};
  const subjects = ["Maths", "Physics", "Chemistry", "Biology"]; // All possible subjects

  // Initialize counts for all subjects to 0
  subjects.forEach((sub) => {
    subjectCounts[sub] = 0;
  });

  // Count students per subject from the provided data
  (studentsData.length > 0 ? studentsData : mockStudentsData).forEach(
    (student) => {
      if (student.subject && subjectCounts.hasOwnProperty(student.subject)) {
        subjectCounts[student.subject]++;
      }
    }
  );

  const labels = Object.keys(subjectCounts);
  const data = Object.values(subjectCounts);
  const backgroundColors = [
    "#4a90e2",
    "#f5a623",
    "#4CAF50",
    "#F44336",
    "#9c27b0",
    "#ffeb3b",
  ]; // More colors

  return {
    labels,
    data,
    backgroundColors: backgroundColors.slice(0, labels.length),
  };
};

// Generates mock data for payment status (e.g., paid vs. unpaid)
const generateMockPaymentStatus = (studentsData) => {
  let paidCount = 0;
  let unpaidCount = 0;

  (studentsData.length > 0 ? studentsData : mockStudentsData).forEach(
    (student) => {
      if (student.paymentStatus === "Paid") {
        paidCount++;
      } else {
        unpaidCount++;
      }
    }
  );

  return {
    labels: ["Paid", "Unpaid"],
    data: [paidCount, unpaidCount],
    backgroundColors: ["#4CAF50", "#F44336"],
  };
};

const Dashboard = () => {
  const [userName, setUserName] = useState("Goutham");
  const [greetingInfo, setGreetingInfo] = useState({
    text: "",
    className: "",
    imageUrl: "",
  });

  // States to be populated by API calls
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);

  // States for other data, populated by test data logic
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [chartData, setChartData] = useState({
    testResults: {},
    studentDemographics: {},
    paymentStatus: {},
  });
  console.log("upcomingClasses", upcomingClasses);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Function to determine greeting and background
  const getGreetingInfo = () => {
    const hour = new Date().getHours();
    let text, className, imageUrl;

    if (hour >= 5 && hour < 12) {
      text = "Morning";
      className = "morning";
      imageUrl =
        "https://images.unsplash.com/photo-1547463564-9273646736c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Sunny morning
    } else if (hour >= 12 && hour < 18) {
      text = "Afternoon";
      className = "afternoon";
      imageUrl =
        "https://images.unsplash.com/photo-1549490349-8643362c395f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Bright afternoon
    } else {
      text = "Evening";
      className = "evening";
      imageUrl =
        "https://images.unsplash.com/photo-1508906660126-a05d4f3b6d51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Calm evening/night
    }
    return { text, className, imageUrl };
  };

  useEffect(() => {
    // Initial setup for greeting and user name from localStorage
    const info = getGreetingInfo();
    setGreetingInfo(info);

    document.documentElement.style.setProperty(
      "--current-greeting-bg-image",
      `url(${info.imageUrl})`
    );

    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      const storedUserEmail = localStorage.getItem("userEmail");
      if (storedUserEmail) {
        setUserName(storedUserEmail.split("@")[0]);
      }
    }

    // Async function to fetch and process all dashboard data
    const fetchAndGenerateDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return; // Stop execution if no token
      }

      setIsLoading(true); // Start loading state
      setError(""); // Clear any previous errors

      // Variables to hold fetched data, initialized to empty arrays
      // This ensures they are always defined for processing in the 'finally' block,
      // even if some API calls fail.
      let fetchedStudents = [];
      let fetchedEmployees = [];
      let rawTimetableData = [];

      try {
        // --- API Call for Students ---
        const studentsResponse = await fetch(
          "http://localhost:5000/api/data/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!studentsResponse.ok) {
          const errorData = await studentsResponse.json();
          throw new Error(
            errorData.message || "Failed to fetch students data."
          );
        }
        fetchedStudents = await studentsResponse.json();
        setStudents(fetchedStudents); // Update state with API data

        // --- API Call for Employees ---
        const employeesResponse = await fetch(
          "http://localhost:5000/api/data/empolyees", // Corrected typo
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!employeesResponse.ok) {
          const errorData = await employeesResponse.json();
          throw new Error(
            errorData.message || "Failed to fetch employees data."
          );
        }
        fetchedEmployees = await employeesResponse.json();
        setEmployees(fetchedEmployees); // Update state with API data

        // --- API Call for Timetable ---
        const timetableResponse = await fetch(
          "http://localhost:5000/api/data/timetable",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!timetableResponse.ok) {
          const errorData = await timetableResponse.json();
          throw new Error(
            errorData.message || "Failed to fetch timetable data."
          );
        }
        rawTimetableData = await timetableResponse.json();
        console.log("rawTimetableData,rawTimetableData", rawTimetableData);
        setUpcomingClasses(rawTimetableData);
      } catch (err) {
        // This single catch block handles errors from ANY of the above API fetches
        console.error("Error fetching dashboard data:", err);
        setError(
          err.message ||
            "Failed to load dashboard data. Please check your connection or try again."
        );

        // Specific error handling for unauthorized access
        if (
          err.message.includes("authorized") ||
          err.message.includes("Token") ||
          err.message.includes("Denied")
        ) {
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login"); // Redirect to login
        }
        // If an error occurred, fetchedStudents, fetchedEmployees, and rawTimetableData
        // will retain their initial empty array values, preventing subsequent errors
        // and gracefully showing "No data" where applicable.
      } finally {
        setIsLoading(false); // Set loading to false only after all data processing is complete
      }
    };

    // Call the async function
    fetchAndGenerateDashboardData();
  }, [navigate]); // Dependency array: navigate is used inside useEffect

  // Calculate dashboard metrics from state (which is populated by API or mock fallback)
  const totalStudents = students.length;
  const totalEmployees = employees.length;

  // Calculate Fee Collection (uses data from 'students' state, which can be API or mock)
  const totalFeeCollection = students.reduce((sum, student) => {
    // Corrected: Access "Payment Status" using bracket notation
    // Corrected: Access "Monthly Fee" using bracket notation if it's the string version
    // Check if the property exists first to avoid errors on malformed data
    const paymentStatus = student["Payment Status"];
    const monthlyFee =
      typeof student.monthlyFee === "number"
        ? student.monthlyFee
        : parseFloat(student["Monthly Fee"]);

    if (paymentStatus === "Paid" && !isNaN(monthlyFee)) {
      // Check if monthlyFee is a valid number
      return sum + monthlyFee;
    }
    return sum;
  }, 0);

  // --- Helper to generate QuickChart URL ---
  const getQuickChartUrl = (chartType, data) => {
    let chartConfig = {};
    if (chartType === "line") {
      chartConfig = {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: data.label,
              data: data.data,
              borderColor: "rgb(74,144,226)",
              fill: false,
            },
          ],
        },
      };
    } else if (chartType === "pie" || chartType === "doughnut") {
      chartConfig = {
        type: chartType,
        data: {
          labels: data.labels,
          datasets: [
            {
              data: data.data,
              backgroundColor: data.backgroundColors,
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              color: "#fff",
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map((data) => {
                  sum += data;
                });
                let percentage = ((value * 100) / sum).toFixed(0) + "%";
                return percentage;
              },
            },
          },
        },
      };
    }
    return `https://quickchart.io/chart?c=${encodeURIComponent(
      JSON.stringify(chartConfig)
    )}&f=png&bkg=transparent`;
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error: {error}</h3>
        <p>
          Please ensure your backend is running at `http://localhost:5000` and
          you are logged in.
        </p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header and Greeting */}
      <div
        className={`dashboard-card dashboard-header ${greetingInfo.className}`}
      >
        <div className="greeting-content">
          <h1>
            Good {greetingInfo.text}, {userName}!
          </h1>
          <p>Welcome to your Electron Academy Dashboard.</p>
        </div>
        <div className="greeting-graphic">
          {greetingInfo.className === "morning" && (
            <FaSun className="greeting-icon" />
          )}
          {greetingInfo.className === "evening" && (
            <FaCloudMoon className="greeting-icon" />
          )}
        </div>
      </div>

      {/* Metric Cards Section */}
      <div className="metrics-grid">
        <div className="dashboard-card metric-card fade-in-up">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-info">
            <p className="metric-label">Total Students</p>
            <p className="metric-value">{totalStudents}</p>
          </div>
        </div>

        <div className="dashboard-card metric-card fade-in-up delay-1">
          <div className="metric-icon">
            <FaUserTie /> {/* Icon for employees */}
          </div>
          <div className="metric-info">
            <p className="metric-label">Total Employees</p>
            <p className="metric-value">{totalEmployees}</p>
          </div>
        </div>

        <div className="dashboard-card metric-card fade-in-up delay-2">
          <div className="metric-icon">
            <FaCalendarDay />
          </div>
          <div className="metric-info">
            <p className="metric-label">Upcoming Classes</p>
            <p className="metric-value">{upcomingClasses.length}</p>
          </div>
        </div>

        <div className="dashboard-card metric-card fade-in-up delay-3">
          <div className="metric-icon">
            <FaMoneyBillAlt />
          </div>
          <div className="metric-info">
            <p className="metric-label">Monthly Fee Collection</p>
            <p className="metric-value">
              ₹{totalFeeCollection.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid (Upcoming Classes, Test Results, Student Stats, Fee Collection Chart) */}
      <div className="main-content-grid">
        {/* Upcoming Classes Card (Test Data) */}
        <div className="dashboard-card upcoming-classes-card fade-in-up delay-4">
          <h2>
            <FaCalendarCheck className="card-icon" /> Upcoming Classes
          </h2>
          {upcomingClasses.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingClasses.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.Student}</td>
                      <td>{cls.Day}</td>
                      <td>{cls.Time}</td>
                      <td>{cls.Subject}</td>
                      <td>{cls.Topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data-message">No upcoming classes scheduled.</p>
          )}
        </div>

        {/* Test Results Chart (Dynamic Test Data) */}
        <div className="dashboard-card chart-card test-results-card fade-in-up delay-5">
          <h2>
            <FaChartLine className="card-icon" /> Test Results Overview
          </h2>
          <div className="chart-placeholder">
            {chartData.testResults.labels && (
              <img
                src={getQuickChartUrl("line", chartData.testResults)}
                alt="Test Results Chart"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            )}
            <p className="chart-note">
              Simulated student performance trends over time.
            </p>
          </div>
        </div>

        {/* Student Statistics Chart (Dynamic Test Data) */}
        <div className="dashboard-card chart-card student-stats-card fade-in-up delay-6">
          <h2>
            <FaChartBar className="card-icon" /> Student Demographics
          </h2>
          <div className="chart-placeholder">
            {chartData.studentDemographics.labels && (
              <img
                src={getQuickChartUrl("pie", chartData.studentDemographics)}
                alt="Student Demographics Chart"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            )}
            <p className="chart-note">
              Simulated breakdown of students by subject.
            </p>
          </div>
        </div>

        {/* Fee Collection Chart (Dynamic Test Data) */}
        <div className="dashboard-card chart-card fee-collection-chart-card fade-in-up delay-7">
          <h2>
            <FaSearchDollar className="card-icon" /> Payment Status Summary
          </h2>
          <div className="chart-placeholder">
            {chartData.paymentStatus.labels && (
              <img
                src={getQuickChartUrl("doughnut", chartData.paymentStatus)}
                alt="Fee Collection Chart"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            )}
            <p className="chart-note">
              Simulated overview of payment statuses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
