import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO, addDays } from "date-fns";
import "./Dashboard.css"; // Ensure this CSS file is correctly linked
import axios from 'axios'; // Import axios

import { sortAndFilterTimetableData } from "../mockdata/funcation";
// Import ALL necessary icons
import {
  FaSun,
  FaUsers, // For Total Students
  FaUserTie, // For Total Employees
  FaCalendarDay, // For Upcoming Classes Metric
  FaMoneyBillAlt, // For Fee Collection Metric
  FaCalendarCheck, // For Upcoming Classes Card Header
  FaMoon, // A slightly more refined moon for evening
  FaBookOpen, // Another option for afternoon
  FaGraduationCap, // Consider for a general academic icon if needed elsewhere
  FaCloudSun,   // For general weather icon (or other specific weather icons)
  FaThermometerHalf // For temperature icon
} from "react-icons/fa";
import { getUniqueQuote, getInitialShownQuoteIndices, saveShownQuoteIndices } from "../mockdata/mockdata"; // Adjust path as needed
import StatsSection from "../pages/StatsSection";
import { generateMockPaymentStatus,generateMockTimetableData,generateMockStudentDemographics } from "../mockdata/mockdata";
import { fetchEmployees,fetchStudents,fetchUpcomingClasses } from "../redux/actions";
// --- Weather API Configuration ---
import { useSelector, useDispatch } from 'react-redux';

const WEATHER_API_KEY = 'eb5a71e29d26ddab85144879fe13cd34'; // This key is now active!
const HYDERABAD_LAT = 17.3850;
const HYDERABAD_LON = 78.4867;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&appid=${WEATHER_API_KEY}&units=metric`;


const Dashboard = () => {
  const dispatch  = useDispatch()
    const { user } = useSelector(state => state.auth);
    console.log("user",user)

  const [userName, setUserName] = useState("Goutham");
  const [greetingInfo, setGreetingInfo] = useState({
    text: "",
    className: "",
    imageUrl: "",
  });
    const [weatherData, setWeatherData] = useState(null); // State for weather
  const [currentQuote, setCurrentQuote] = useState(''); // State for quote
  const { timetables, loading: classesLoading, error: classesError } = useSelector((state) => state.classes);
  const { students, loading: studentsLoading, error: studentsError } = useSelector((state) => state.students); // <--- THIS IS WHERE STUDENTS DATA COMES FROM
  const { employees, loading: employeesLoading, error: employeesError } = useSelector((state) => state.employees); // <--- THIS IS WHERE EMPLOYEES DATA COMES FROM

  // Initialize shownQuoteIndices using the utility function
  const [shownQuoteIndices, setShownQuoteIndices] = useState(getInitialShownQuoteIndices);
  // States for other data, populated by test data logic
  const [chartData, setChartData] = useState({
    testResults: {},
    studentDemographics: {},
    paymentStatus: {},
  });
  console.log("timetables", timetables);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getGreetingInfo = () => {
    const hour = new Date().getHours();
    let text, className, imageUrl;

    if (hour >= 5 && hour < 12) {
      text = "Morning";
      className = "morning";
      // Bright, minimalist study space with good light
      imageUrl = "https://images.unsplash.com/photo-1549725838-8c1143c72b53?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    } else if (hour >= 12 && hour < 18) {
      text = "Afternoon";
      className = "afternoon";
      // Empty, clean, naturally lit classroom
      imageUrl = "https://images.unsplash.com/photo-1498243691581-b145c3f54bfb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB4MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    } else { // 18 (6 PM) onwards to 4 AM
      text = "Evening";
      className = "evening";
      // Modern office/study with ambient lighting, still bright, glowing screen
      imageUrl = "https://images.unsplash.com/photo-1454165205744-bdc3fd1d49db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    return { text, className, imageUrl };
  };


  // Effect for greeting info and quote (MODIFIED FOR DAILY UPDATE)
  useEffect(() => {
    const updateAndSaveQuote = () => {
      setShownQuoteIndices(prevIndices => {
        const { quote, newShownIndices } = getUniqueQuote(prevIndices);
        setCurrentQuote(quote);
        saveShownQuoteIndices(newShownIndices); // Save the updated list to localStorage
        return newShownIndices; // Return the new state for shownQuoteIndices
      });
    };
    setGreetingInfo(getGreetingInfo());
    updateAndSaveQuote(); // Call it once immediately
    const interval = setInterval(() => {
      setGreetingInfo(getGreetingInfo()); // Update greeting as well (hourly is fine here if needed)
      updateAndSaveQuote(); // This will now happen once every 24 hours
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, []);
 // Effect for fetching weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(WEATHER_API_URL);
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null); // Clear weather data on error
      }
    };
    fetchWeather();
    // Fetch weather every 15 minutes (or as frequently as your API allows/you deem necessary)
    const weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []); // Run once on mount, then by interval
 
useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found. Redirecting to login.");
      // Dispatch logout to clear any lingering Redux state related to auth
      dispatch(logoutUser());
      // Set an auth error message to be consistent
      dispatch(setAuthError("No authentication token found. Please log in."));
      return; // Stop further execution if no token
    }

    // Dispatch the Redux actions to fetch data
    // The apiMiddleware will handle the actual fetch calls, loading states, and success/failure.
    // The .catch here is mainly for unexpected errors in dispatching, not API errors.
    dispatch(fetchStudents());
    dispatch(fetchEmployees());
    dispatch(fetchUpcomingClasses());

  }, [dispatch]);
let filteredStudents = [];
  if (students && students.length > 0 && user) {
    if (user.AllowAll) {
      filteredStudents = students; // If AllowAll is true, return all students
    } else if (user.isPhysics) {
      filteredStudents = students.filter(student => student.Subject === 'Physics');
    } else if (user.isChemistry) {
      filteredStudents = students.filter(student => student.Subject === 'Chemistry');
    } else {
      // If none of the specific permissions are true, and not AllowAll,
      // it means the user should see no students, or students specific to them (e.g., if user is a teacher).
      // For now, it will be an empty array. You might add a console.warn here too.
      filteredStudents = [];
      console.warn("User has no specific subject permissions (isPhysics, isChemistry) and not AllowAll. Displaying no students.");
    }
  }
   let filteredTimetables = [];
  if (timetables && timetables.length > 0 && user) {
    if (user.AllowAll) {
      filteredTimetables = timetables; // If AllowAll is true, return all timetables
    } else if (user.isPhysics) {
      filteredTimetables = timetables.filter(schedule => schedule.Subject === 'Physics');
    } else if (user.isChemistry) {
      filteredTimetables = timetables.filter(schedule => schedule.Subject === 'Chemistry');
    } else {
      filteredTimetables = [];
      console.warn("User has no specific subject permissions for timetables. Displaying no classes.");
    }
  }
  console.log("filteredTimetables",filteredTimetables)
    console.log("filteredStudents",filteredStudents)

  // Calculate dashboard metrics from state (which is populated by API or mock fallback)
  const totalStudents = filteredStudents.length
  const totalEmployees = employees.length;
  // Calculate Fee Collection (uses data from 'students' state, which can be API or mock)
  const totalFeeCollection = filteredStudents.reduce((sum, student) => {
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

  if (students.loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard Data...</p>
      </div>
    );
  }
  const firstName = user && user.name ? user.name.split(' ')[0] : 'Guest'; // Default to 'Guest' if name is not available

  return (
    <div className="dashboard-container">
      {/* Header and Greeting */}
  <div
        className={`dashboard-card dashboard-header ${greetingInfo.className}`}
        style={{ backgroundImage: `url(${greetingInfo.imageUrl})` }}
      >
        <div className="background-overlay"></div>

        <div className="greeting-content">
          <h1>
            Good {greetingInfo.text}, {firstName}!
          </h1>
          <p className="welcome-message">Welcome to your Electron Academy Dashboard.</p>
          {currentQuote && (
            <p className="motivational-quote">"{currentQuote}"</p>
          )}
        </div>
        {/* Moved weather info here, inside greeting-graphic for flexbox */}
        <div className="greeting-graphic">
          {greetingInfo.className === "morning" && (
            <FaSun className="greeting-icon" />
          )}
          {greetingInfo.className === "afternoon" && (
            <FaBookOpen className="greeting-icon" />
          )}
          {greetingInfo.className === "evening" && (
            <FaMoon className="greeting-icon" />
          )}
          {weatherData && (
            <p className="weather-info weather-right">
              <FaCloudSun className="weather-icon" /> {weatherData.name}: {weatherData.main.temp.toFixed(1)}°C
            </p>
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
            <p className="metric-value">{filteredTimetables?.length}</p>
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
          {filteredTimetables?.length > 0 ? (
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
                  {timetables.map((cls) => (
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

      <div className="dashboard-card chart-card test-results-card fade-in-up delay-5">
        <h2>
          {/* <FaChartLine className="card-icon" /> */} Test Results Overview
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
          {/* <FaChartBar className="card-icon" /> */} Student Demographics
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
          {/* <FaSearchDollar className="card-icon" /> */} Payment Status Summary
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
