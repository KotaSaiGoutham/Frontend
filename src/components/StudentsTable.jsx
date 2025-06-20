// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import "./StudentsTable.css";

// Import ALL necessary icons
import {
  FaSun,
  FaCloudMoon,
  FaSearch,
  FaUserGraduate,
  FaTransgender,
  FaDollarSign,
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser,
  FaUsers,
  FaHourglassHalf,
  FaIdCard,
  FaUserCircle,
  FaMoneyBillWave,
  FaUserTie,
  FaBuilding,
  FaWallet,
  FaTimesCircle,
  FaGlobe,
  FaPlus, // Existing and FaPlus
  FaGraduationCap,
  FaUniversity,
  FaSearchDollar,
  FaCalendarCheck, // Newly added for table columns
} from "react-icons/fa";

const StudentsTable = () => {
  const [userName, setUserName] = useState("Goutham");
  const [greetingTime, setGreetingTime] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [filters, setFilters] = useState({
    studentName: "",
    subject: "",
    paymentStatus: "",
    minClasses: "",
    maxClasses: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getGreetingInfo = () => {
    const hour = new Date().getHours();
    let text, className, imageUrl;

    if (hour >= 5 && hour < 12) {
      text = "Morning";
      className = "morning";
      imageUrl =
        "https://images.unsplash.com/photo-1547463564-9273646736c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    } else if (hour >= 12 && hour < 18) {
      text = "Afternoon";
      className = "afternoon";
      imageUrl =
        "https://images.unsplash.com/photo-1549490349-8643362c395f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    } else {
      text = "Evening";
      className = "evening";
      imageUrl =
        "https://images.unsplash.com/photo-1508906660126-a05d4f3b6d51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    return { text, className, imageUrl };
  };

  // Mock data for employees and salaries (up to 10)
  const mockSalariesData = [
    {
      id: "emp001",
      name: "Alice Johnson",
      role: "Physics Teacher",
      salary: 65000,
      paid: true,
      lastPaid: "2025-05-28",
    },
    {
      id: "emp002",
      name: "Bob Williams",
      role: "Maths Teacher",
      salary: 70000,
      paid: true,
      lastPaid: "2025-05-29",
    },
    {
      id: "emp003",
      name: "Charlie Brown",
      role: "Chemistry Teacher",
      salary: 68000,
      paid: false,
      lastPaid: "2025-04-30",
    },
    {
      id: "emp004",
      name: "Diana Miller",
      role: "Biology Teacher",
      salary: 67000,
      paid: true,
      lastPaid: "2025-05-27",
    },
    {
      id: "emp005",
      name: "Eve Davis",
      role: "Admin Staff",
      salary: 45000,
      paid: true,
      lastPaid: "2025-05-30",
    },
    {
      id: "emp006",
      name: "Frank White",
      role: "Physics Teacher",
      salary: 66000,
      paid: true,
      lastPaid: "2025-05-28",
    },
    {
      id: "emp007",
      name: "Grace Taylor",
      role: "Counselor",
      salary: 55000,
      paid: false,
      lastPaid: "2025-04-25",
    },
    {
      id: "emp008",
      name: "Henry King",
      role: "Maintenance",
      salary: 35000,
      paid: true,
      lastPaid: "2025-05-26",
    },
    {
      id: "emp009",
      name: "Ivy Green",
      role: "Chemistry Teacher",
      salary: 69000,
      paid: true,
      lastPaid: "2025-05-29",
    },
    {
      id: "emp010",
      name: "Jack Hall",
      role: "IT Support",
      salary: 50000,
      paid: false,
      lastPaid: "2025-04-20",
    },
  ];

  // Mock Timetable Data (to demonstrate the timetable section)
  const mockTimetableData = [
    {
      id: "tt001",
      studentName: "Student A",
      subject: "Physics",
      time: "10:00 AM",
      day: "Monday",
      teacher: "Alice Johnson",
    },
    {
      id: "tt002",
      studentName: "Student B",
      subject: "Maths",
      time: "02:00 PM",
      day: "Tuesday",
      teacher: "Bob Williams",
    },
    {
      id: "tt003",
      studentName: "Student C",
      subject: "Chemistry",
      time: "11:00 AM",
      day: "Wednesday",
      teacher: "Charlie Brown",
    },
    {
      id: "tt004",
      studentName: "Student D",
      subject: "Biology",
      time: "03:30 PM",
      day: "Thursday",
      teacher: "Diana Miller",
    },
    {
      id: "tt005",
      studentName: "Student E",
      subject: "Physics",
      time: "09:00 AM",
      day: "Friday",
      teacher: "Frank White",
    },
  ];

  useEffect(() => {
    const { text, imageUrl } = getGreetingInfo();
    setGreetingTime(text);

    // Dynamically set CSS variables for background images
    document.documentElement.style.setProperty(
      "--current-greeting-bg-image",
      `url(${imageUrl})`
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

    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch Students
        const studentsResponse = await fetch(
          "http://localhost:5000/api/data/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const studentsData = await studentsResponse.json();
        if (!studentsResponse.ok)
          throw new Error(studentsData.message || "Failed to fetch students.");
        setStudents(studentsData);
        setFilteredStudents(studentsData);

        // Simulate fetching Timetable
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
        setTimetable(mockTimetableData);

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        setSalaries(mockSalariesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data.");
        if (err.message.includes("authorized")) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    let tempStudents = [...students]; // Assuming 'students' holds your original, unfiltered data

    // NEW: Filter by Student Name
  if (filters.studentName) {
  tempStudents = tempStudents.filter((student) => {
    // 1. Ensure 'student' object exists
    // 2. Ensure 'student.Name' property exists (use correct casing, likely 'Name' based on your form)
    // 3. Ensure 'student.Name' is a string
    //    Using typeof student?.Name === 'string' is modern JS and concise
    const studentName = student?.Name; // Use optional chaining to safely access 'Name'

    // If studentName is not a string, or is null/undefined, this student doesn't match
    if (typeof studentName !== 'string') {
      return false; // Exclude this student
    }

    // Now safely perform the comparison
    return studentName.toLowerCase().includes(filters.studentName.toLowerCase());
  });
}

    // Existing Subject Filter
    if (filters.subject) {
      tempStudents = tempStudents.filter(
        (student) => student.subject === filters.subject
      );
    }

    // Existing Payment Status Filter
    if (filters.paymentStatus) {
      tempStudents = tempStudents.filter(
        (student) => student.paymentStatus === filters.paymentStatus
      );
    }

    // Existing Min Classes Filter
    if (filters.minClasses !== "") {
      // Use !== '' to check for actual value
      // Note: student.totalClasses is from mock data.
      // If you're fetching from Firestore, use student.classesCompleted
      tempStudents = tempStudents.filter(
        (student) =>
          (student.totalClasses || student.classesCompleted) >=
          parseInt(filters.minClasses)
      );
    }

    // Existing Max Classes Filter
    if (filters.maxClasses !== "") {
      // Use !== '' to check for actual value
      // Note: student.totalClasses is from mock data.
      // If you're fetching from Firestore, use student.classesCompleted
      tempStudents = tempStudents.filter(
        (student) =>
          (student.totalClasses || student.classesCompleted) <=
          parseInt(filters.maxClasses)
      );
    }

    setFilteredStudents(tempStudents); // Assuming you have a setFilteredStudents state
  }, [filters, students]); // Add 'students' to dependency array if not already there

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Calculate dashboard metrics
  const totalStudents = students.length;
  console.log("students,students",students)
 const paidStudents = students.filter(
  (s) => s["Payment Status"] === "Paid" // <--- Corrected key access
).length;

const unpaidStudents = students.filter(
  (s) => s["Payment Status"] === "Unpaid" // <--- Corrected key access
).length;
  const totalEmployees = salaries.length; // Using salaries data as a proxy for employees

  const { className: greetingClass } = getGreetingInfo(); // Get class name for greeting

  if (isLoading) {
    return <div className="loading-message">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button onClick={() => window.location.reload()}>
          Reload Dashboard
        </button>
      </div>
    );
  }
  console.log("filteredStudents", filteredStudents);

  return (
    <div className="dashboard-container">

      {/* Filters Section */}
      <div className="dashboard-card filters-section">
        <h2>
          <FaSearch className="inline-block mr-2" />
          Filter Students
        </h2>
        <div className="filters-grid">
          {/* Student Name Filter */}
          <div className="filter-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={filters.studentName}
              onChange={handleFilterChange}
              placeholder="Search by student name..."
            />
          </div>

          {/* Existing Subject Filter */}
          <div className="filter-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Maths">Maths</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          {/* Existing Payment Status Filter */}
          <div className="filter-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List Table */}
      <div className="dashboard-card students-table-container">
        <div className="students-table-header-flex">
          {" "}
          {/* NEW CONTAINER FOR H2 AND BUTTON */}
          <h2>
            <FaUsers /> Student Overview
          </h2>{" "}
          {/* Removed inline-block mr-2 */}
          <button
            onClick={() => navigate("/add-student")}
            className="add-student-button"
          >
            <FaPlus /> Add New Student {/* Removed inline-block mr-2 */}
          </button>
        </div>
        {filteredStudents.length > 0 ? (
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>
                    <div className="header-content">
                      <FaUserCircle /> Name
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <FaTransgender /> Gender
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <FaHourglassHalf /> Classes Completed
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <FaDollarSign /> Monthly Fee
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <FaBookOpen /> Subject
                    </div>
                  </th>
                  {/* NEW: Stream Header */}
                  <th>
                    <div className="header-content">
                      <FaGraduationCap /> Stream
                    </div>
                  </th>
                  {/* NEW: College Header */}
                  <th>
                    <div className="header-content">
                      <FaUniversity /> College
                    </div>
                  </th>
                  {/* NEW: Group Header */}
                  <th>
                    <div className="header-content">
                      <FaUsers /> Group
                    </div>
                  </th>
                  {/* NEW: Source Header */}
                  <th>
                    <div className="header-content">
                      <FaSearchDollar /> Source
                    </div>
                  </th>
                  {/* NEW: Year Header */}
                  <th>
                    <div className="header-content">
                      <FaCalendarCheck /> Year
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <FaCalendarAlt /> Next Class
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <FaIdCard /> Payment Status
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="student-name-cell">
                      <Link
                        to={`/student/${student.id}`}
                        className="student-name-link"
                      >
                        <FaUserGraduate /> {student.Name}
                      </Link>
                    </td>
                    <td>{student.Gender}</td>
                    <td>{student["Classes Completed"] || "N/A"}</td>
                    <td>₹{student["Monthly Fee"] || "0"}</td>
                    <td>{student.Subject}</td>
                    {/* NEW: Stream Data */}
                    <td>{student.Stream || "N/A"}</td>
                    {/* NEW: College Data */}
                    <td>{student.College || "N/A"}</td>
                    {/* NEW: Group Data (Note: 'Group ' has a space in your backend key) */}
                    <td>{student["Group "] || "N/A"}</td>
                    {/* NEW: Source Data */}
                    <td>{student.Source || "N/A"}</td>
                    {/* NEW: Year Data */}
                    <td>{student.Year || "N/A"}</td>
                    <td>
                      {student.nextClass
                        ? format(parseISO(student.nextClass), "MMM dd, p")
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`payment-status-badge ${student[
                          "Payment Status"
                        ]?.toLowerCase()}`}
                      >
                        {student["Payment Status"] === "Paid" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaExclamationCircle />
                        )}
                        {student["Payment Status"]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-students-message">
            No students match your criteria.
          </p>
        )}
      </div>
      {/* ... (rest of your dashboard content like Timetable, Salaries) */}
    </div>
  );
};

export default StudentsTable;
