import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaRupeeSign, FaCalendarAlt, FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMonthlyPayments,
  fetchAutoTimetablesForToday,
  fetchUpcomingClasses,
  fetchMonthlyPaymentDetails,
  fetchMonthlyStudentDetails
} from "../../redux/actions";
import { Box, Tooltip, IconButton } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import {
  format,
  addDays,
  isSameMonth,
  parseISO,
  isAfter,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import "./HistoricalTables.css";
import { calculateQuartiles,formatToLacs } from "../../mockdata/function";
import MonthlyPaymentDetailsDialog from "../customcomponents/MonthlyPaymentDetailsDialog"
import StudentDetailsDialog from "../customcomponents/StudentDetailsDialog";
const HistoricalTables = ({ students }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showFeeAmounts, setShowFeeAmounts] = useState(false); // State to toggle fee visibility

  const today = new Date();
  const currentDayAbbr = today.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const currentMonth = today.toLocaleDateString("en-US", { month: "short" });
  const {
    timetables: manualTimetables,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.classes);
  const {
    timetables: autoTimetables,
    loading: autoTimetablesLoading,
    error: autoTimetablesError,
    hasSavedToday: autoTimetablesHasSavedToday,
  } = useSelector((state) => state.autoTimetables);
  
  const { monthlyPayments, loading: paymentsLoading } = useSelector((state) => state.expenditures);
  
  useEffect(() => {
    dispatch(fetchAutoTimetablesForToday(user?.id));
    dispatch(fetchUpcomingClasses());
    dispatch(fetchMonthlyPayments());
  }, [dispatch]);

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const rawDailyClassesData = useMemo(() => {
    const classCount = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    if (students && Array.isArray(students)) {
      students.forEach((student) => {
        if (!student.isActive || !Array.isArray(student.classDateandTime))
          return;
        student.classDateandTime.forEach((schedule) => {
          const [dayNameRaw] = schedule.split("-");
          const dayName = dayNameRaw.trim();
          const dayMap = {
            Sunday: "Sun",
            Monday: "Mon",
            Tuesday: "Tue",
            Wednesday: "Wed",
            Thursday: "Thu",
            Friday: "Fri",
            Saturday: "Sat",
          };
          const dayAbbr = dayMap[dayName] || dayName.substring(0, 3);
          if (classCount.hasOwnProperty(dayAbbr)) {
            classCount[dayAbbr] += 1;
          }
        });
      });
    }

    if (manualTimetables && Array.isArray(manualTimetables)) {
      manualTimetables.forEach((timetable) => {
        if (timetable.dateTimeISO) {
          try {
            const classDate = parseISO(timetable.dateTimeISO);
            const dayAbbr = format(classDate, "EEE");

            if (classCount.hasOwnProperty(dayAbbr)) {
              classCount[dayAbbr] += 1;
            }
          } catch (error) {
            console.error("Error parsing date from manual timetable:", error);
          }
        }
      });
    }

    return classCount;
  }, [students, manualTimetables]);

  const sevenDayClassesData = useMemo(() => {
    const data = [];
    for (let i = -3; i <= 3; i++) {
      const date = addDays(today, i);
      const dayAbbr = format(date, "EEE");
      const count = rawDailyClassesData[dayAbbr];
      data.push({ date, dayAbbr, count });
    }
    return data;
  }, [today, rawDailyClassesData]);

  const monthlyFeeData = useMemo(() => {
    if (!monthlyPayments) return {};

    const data = {};
    const today = new Date();

    allMonths.forEach((monthAbbr, index) => {
      const year = today.getFullYear();
      const monthStart = startOfMonth(new Date(year, index, 1));

      // If this month is in the future → mark as "-"
      if (monthStart > today) {
        data[monthAbbr] = "-";
      } else {
        const amount = monthlyPayments[monthAbbr] || 0;
        data[monthAbbr] = amount;
      }
    });

    return data;
  }, [monthlyPayments, allMonths]);

  const monthlyStudentData = useMemo(() => {
    if (!students || students.length === 0) return {};

    const data = {};
    const today = new Date();

    allMonths.forEach((monthAbbr, index) => {
      const year = today.getFullYear();

      const monthStart = startOfMonth(new Date(year, index, 1));
      const monthEnd = endOfMonth(new Date(year, index, 1));

      // If month is in the future → mark as "-"
      if (monthStart > today) {
        data[monthAbbr] = "-";
        return;
      }

      let count = 0;

      students.forEach((student) => {
        if (!student.admissionDate?._seconds) return;

        const admissionDate = new Date(student.admissionDate._seconds * 1000);

        if (admissionDate > monthEnd) return;

        if (!student.isActive || student.deactivated) return;

        if (student.deactivatedAt?._seconds) {
          const deactivatedAt = new Date(student.deactivatedAt._seconds * 1000);
          if (deactivatedAt <= monthEnd) return; // left before / in this month
        }

        count++;
      });

      data[monthAbbr] = count;
    });

    return data;
  }, [students, allMonths]);

  const handleDateClick = (date) => {
    const dateFormatted = format(date, "dd/MM/yyyy");
    navigate("/timetable", { state: { date: dateFormatted } });
  };
  
  const handleNavigateToToday = () => {
    const todayDateFormatted = format(today, "dd/MM/yyyy");
    navigate("/timetable", { state: { date: todayDateFormatted } });
  };
  
  const { median: medianClasses, q3: q3Classes } = useMemo(() => {
    const counts = sevenDayClassesData.map((item) => item.count);
    return calculateQuartiles(counts);
  }, [sevenDayClassesData]);
  
  const { median: medianFee, q3: q3Fee } = useMemo(() => {
    const fees = Object.values(monthlyFeeData).filter(
      (val) => typeof val === "number"
    );
    return calculateQuartiles(fees);
  }, [monthlyFeeData]);
  
  const { median: medianStudents, q3: q3Students } = useMemo(() => {
    const studentsCount = Object.values(monthlyStudentData).filter(
      (val) => typeof val === "number"
    );
    return calculateQuartiles(studentsCount);
  }, [monthlyStudentData]);
  
  const handleMonthClick = async (monthKey) => {
    // Only handle click if fee amounts are visible
    if (!showFeeAmounts) return;
    
    try {
      const currentYear = new Date().getFullYear();
      const monthMap = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      
      const monthNumber = monthMap[monthKey];
      const yearMonth = `${currentYear}-${monthNumber}`;
      
      // Fetch payment details for selected month
      dispatch(fetchMonthlyPaymentDetails(yearMonth));
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };
const handleStudentMonthClick = async (monthKey) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthMap = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const monthNumber = monthMap[monthKey];
    const yearMonth = `${currentYear}-${monthNumber}`;
    
    // Fetch student details for selected month
    dispatch(fetchMonthlyStudentDetails(yearMonth));
  } catch (error) {
    console.error('Error fetching student details:', error);
  }
};
  const toggleFeeVisibility = () => {
    setShowFeeAmounts(!showFeeAmounts);
  };

  const SkeletonCount = ({ width = "40px", height = "24px" }) => (
    <div 
      className="skeleton-count" 
      style={{ width, height }}
    ></div>
  );

  const isLoading = classesLoading || autoTimetablesLoading || paymentsLoading;

  return (
    <div className="historical-tables-container">
      {/* Render the dialog component */}
      <MonthlyPaymentDetailsDialog />
          <StudentDetailsDialog />

      
      {/* First Row: Classes per day */}
      <div className="table-section">
        <div className="row-container">
          <div className="table-container">
            <div className="table-card primary-card fixed-table-card">
              <h3
                className="table-heading clickable-heading"
                onClick={handleNavigateToToday}
              >
                <span className="heading-icon">
                  <FaCalendarAlt />
                </span>
                No of classes per day
              </h3>
              {/* Scroll Wrapper */}
              <div className="table-scroll-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {" "}
                      {sevenDayClassesData.map(({ date, dayAbbr }) => (
                        <th
                          key={dayAbbr}
                          className={
                            format(date, "yyyy-MM-dd") ===
                            format(today, "yyyy-MM-dd")
                              ? "highlight-cell pulse"
                              : ""
                          }
                        >
                          <span className="th-content">{dayAbbr}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {sevenDayClassesData.map(
                        ({ date, dayAbbr, count }, index) => (
                          <td
                            key={index}
                            className={`clickable ${
                              format(date, "yyyy-MM-dd") ===
                              format(today, "yyyy-MM-dd")
                                ? "highlight-cell"
                                : ""
                            }`}
                            onClick={() => handleDateClick(date)}
                          >
                            <Tooltip
                              title={`Click to view timetable for ${dayAbbr}`}
                              placement="top"
                            >
                              <span className="data-value">
                                {isLoading ? (
                                  <SkeletonCount width="30px" height="20px" />
                                ) : (
                                  count
                                )}
                              </span>
                            </Tooltip>
                          </td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="chart-container-history">
            <Box className="chart-card">
              {/* Bar Chart for Classes per day */}
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: sevenDayClassesData.map((item) => item.dayAbbr),
                  },
                ]}
                yAxis={[
                  {
                    min: 0,
                    max: q3Classes + q3Classes * 0.1,
                    tickNumber: 3,
                    tickValues: [0, medianClasses, q3Classes],
                  },
                ]}
                series={[
                  {
                    data: sevenDayClassesData.map((item) => item.count),
                    color: "#4a6cf7",
                  },
                ]}
                height={180}
                margin={{ top: 15, right: 15, left: 35, bottom: 15 }}
              />
            </Box>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="row-container">
          <div className="table-container">
            <div className="table-card-students tertiary-card fixed-table-card">
              <h3 className="table-heading">
                <span className="heading-icon">
                  <FaGraduationCap />
                </span>
                No of students per month
              </h3>

              {/* Scroll Wrapper */}
              <div className="table-scroll-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(monthlyStudentData).map((month) => (
                        <th
                          key={month}
                          className={
                            month === currentMonth ? "highlight-cell pulse" : ""
                          }
                        >
                          <span className="th-content">{month}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Object.values(monthlyStudentData).map((count, index) => {
                        const monthKey = Object.keys(monthlyStudentData)[index];
                        return (
                          <td
                        key={index}
  className={`clickable ${monthKey === currentMonth ? "highlight-cell" : ""}`}
  onClick={() => handleStudentMonthClick(monthKey)}
  style={{ cursor: 'pointer' }}
                          >
                            <span className="data-value">
                              {isLoading ? (
                                <SkeletonCount width="30px" height="20px" />
                              ) : (
                                count
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Note Section */}
              <div className="data-note">
                <FaInfoCircle className="note-icon" />
                <span>
                  Real data is available from <strong>September 2025</strong> onwards.
                </span>
              </div>
            </div>
          </div>
          <div className="chart-container-history">
            <Box className="chart-card">
              {/* Bar Chart for Students per month */}
              <BarChart
                xAxis={[{ scaleType: "band", data: allMonths }]}
                yAxis={[
                  {
                    min: 0,
                    max: q3Students + q3Students * 0.1,
                    tickNumber: 3,
                    tickValues: [0, medianStudents, q3Students],
                  },
                ]}
                series={[
                  {
                    data: Object.values(monthlyStudentData).map((val) =>
                      val === "-" ? 0 : val
                    ),
                    color: "#292551",
                  },
                ]}
                height={180}
                margin={{ top: 15, right: 15, left: 35, bottom: 15 }}
              />
            </Box>
          </div>
        </div>
      </div>

      {/* Fee payment per month section with eye icon */}
      <div className="table-section">
        <div className="row-container">
          <div className="table-container">
            <div className="table-card secondary-card fixed-table-card">
              <div className="table-heading-with-toggle">
                <h3 className="table-heading">
                  <span className="heading-icon">
                    <FaRupeeSign />
                  </span>
                  Fee payment per month
                </h3>
                <Tooltip 
                  title={showFeeAmounts ? "Hide amounts" : "Show amounts"} 
                  placement="top"
                >
                  <IconButton
                    onClick={toggleFeeVisibility}
                    size="small"
                sx={{
  color: 'white',
  backgroundColor:  'rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: showFeeAmounts ? 'rgba(25, 118, 210, 0.9)' : 'rgba(255, 255, 255, 0.3)',
  },
  marginLeft: 'auto',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
}}
                  >
                    {showFeeAmounts ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </Tooltip>
              </div>
              <div className="grid-table-wrapper">
                <div className="month-grid">
                  {Object.keys(monthlyFeeData).map((monthKey, index) => {
                    const amount = monthlyFeeData[monthKey];
                    const isCurrentMonth = monthKey === currentMonth;
                    const isFuture = amount === "-";
                    const isClickable = showFeeAmounts && !isFuture;
                    
                    return (
                      <div
                        key={monthKey}
                        className={`month-grid-item ${isCurrentMonth ? 'highlight-cell' : ''} ${isClickable ? 'clickable-month' : ''}`}
                        onClick={() => isClickable && handleMonthClick(monthKey)}
                        style={{ 
                          cursor: isClickable ? 'pointer' : 'default',
                          opacity: showFeeAmounts ? 1 : 0.8
                        }}
                      >
                        <div className="month-header">{monthKey}</div>
                        <div 
                          className="month-value"
                          data-future={isFuture}
                        >
                          {isLoading ? (
                            <SkeletonCount width="60px" height="20px" />
                          ) : isFuture ? (
                            "-"
                          ) : showFeeAmounts ? (
                            formatToLacs(amount)
                          ) : (
                            <Tooltip title="Click eye icon to view amount" placement="top">
                              <span className="hidden-amount">••••</span>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="chart-container-history">
            <Box className="chart-card">
              <BarChart
                xAxis={[{ scaleType: "band", data: allMonths }]}
                yAxis={[
                  {
                    min: 0,
                    max: q3Fee + q3Fee * 0.1,
                    tickNumber: 3,
                    tickValues: [0, medianFee, q3Fee],
                  },
                ]}
                series={[
                  {
                    data: Object.values(monthlyFeeData).map((val) =>
                      val === "-" ? 0 : val
                    ),
                    color: "#B21F62",
                  },
                ]}
                height={180}
                margin={{ top: 15, right: 15, left: 35, bottom: 15 }}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTables;