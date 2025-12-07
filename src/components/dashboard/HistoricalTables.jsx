import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaRupeeSign,
  FaCalendarAlt,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMonthlyPayments,
  fetchAutoTimetablesForToday,
  fetchUpcomingClasses,
  fetchMonthlyPaymentDetails,
  fetchMonthlyStudentDetails,
} from "../../redux/actions";
import { Box, Tooltip, IconButton, MenuItem, Select, FormControl } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import {
  format,
  addDays,
  parseISO,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import "./HistoricalTables.css";
import { calculateQuartiles, formatToLacs } from "../../mockdata/function";
import MonthlyPaymentDetailsDialog from "../customcomponents/MonthlyPaymentDetailsDialog";
import StudentDetailsDialog from "../customcomponents/StudentDetailsDialog";

const HistoricalTables = ({ students }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showFeeAmounts, setShowFeeAmounts] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const { monthlyPayments, loading: paymentsLoading } = useSelector(
    (state) => state.expenditures
  );

  // Generate year options (starting from 2024 to current year + 3)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2024;
    const endYear = currentYear + 3;
    const years = [];
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    
    return years;
  };

  const yearOptions = generateYearOptions();

  useEffect(() => {
    dispatch(fetchAutoTimetablesForToday(user?.id));
    dispatch(fetchUpcomingClasses());
    dispatch(fetchMonthlyPayments(selectedYear));
  }, [dispatch, selectedYear]);

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
  
  if (!monthlyPayments || !monthlyPayments.monthlyPayments) {
    // Create empty data structure
    const emptyData = {};
    allMonths.forEach(month => emptyData[month] = 0);
    return emptyData;
  }

  const data = {};
  const today = new Date();
  const currentYear = today.getFullYear();

  // Get the actual payments data from the nested structure
  const paymentsData = monthlyPayments.monthlyPayments;

  allMonths.forEach((monthAbbr, index) => {
    const year = selectedYear;
    const monthStart = startOfMonth(new Date(year, index, 1));

    // If selected year is current year, mark future months as "-"
    if (year === currentYear && monthStart > today) {
      data[monthAbbr] = "-";
    } else {
      // Access the data correctly from paymentsData
      const amount = paymentsData[monthAbbr] || 0;
      data[monthAbbr] = amount;
    }
  });

  return data;
}, [monthlyPayments, allMonths, selectedYear]);

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
    if (!showFeeAmounts) return;

    try {
      const monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      const monthNumber = monthMap[monthKey];
      const yearMonth = `${selectedYear}-${monthNumber}`;

      dispatch(fetchMonthlyPaymentDetails(yearMonth));
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleStudentMonthClick = async (monthKey) => {
    try {
      const currentYear = new Date().getFullYear();
      const monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      const monthNumber = monthMap[monthKey];
      const yearMonth = `${currentYear}-${monthNumber}`;

      // Fetch student details for selected month
      dispatch(fetchMonthlyStudentDetails(yearMonth));
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  
  const toggleFeeVisibility = () => {
    setShowFeeAmounts(!showFeeAmounts);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const SkeletonCount = ({ width = "40px", height = "24px" }) => (
    <div className="skeleton-count" style={{ width, height }}></div>
  );

  const isLoading = classesLoading || autoTimetablesLoading || paymentsLoading;

  // Responsive styles
  const isMobile = window.innerWidth <= 768;
  
  const headingContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? '10px' : '0'
  };

  const headingLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    flex: isMobile ? '1 1 100%' : '0 1 auto'
  };

  const headingTextStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    fontSize: isMobile ? '16px' : '18px',
    whiteSpace: 'nowrap'
  };

  const yearSelectContainerStyle = {
    minWidth: isMobile ? '90px' : '100px',
    marginLeft: isMobile ? '0' : '10px'
  };

  const yearSelectStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: isMobile ? '13px' : '14px',
    height: isMobile ? '28px' : '30px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiSelect-icon': {
      color: 'rgba(255, 255, 255, 0.7)',
    }
  };

  const menuItemStyle = {
    color: '#333',
    fontSize: isMobile ? '13px' : '14px'
  };

  const iconButtonStyle = {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    "&:hover": {
      backgroundColor: showFeeAmounts
        ? "rgba(25, 118, 210, 0.9)"
        : "rgba(255, 255, 255, 0.3)",
    },
    marginLeft: "auto",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    "&:hover": {
      border: "1px solid rgba(255, 255, 255, 0.5)",
    },
    padding: isMobile ? '6px' : '8px',
    fontSize: isMobile ? '16px' : '18px'
  };

  const actionsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '10px',
    flex: isMobile ? '1 1 100%' : '0 1 auto',
    justifyContent: isMobile ? 'flex-end' : 'flex-start'
  };

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
                            className={`clickable ${
                              monthKey === currentMonth ? "highlight-cell" : ""
                            }`}
                            onClick={() => handleStudentMonthClick(monthKey)}
                            style={{ cursor: "pointer" }}
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
                  Real data is available from <strong>September 2025</strong>{" "}
                  onwards.
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

      {/* Fee payment per month section with eye icon and year dropdown */}
    <div className="table-section">
  <div className="row-container">
    <div className="table-container">
      <div className="table-card secondary-card fixed-table-card">
        <div style={headingContainerStyle}>
          <div style={headingLeftStyle}>
            <h3 style={headingTextStyle}>
              <span className="heading-icon">
                <FaRupeeSign />
              </span>
              Fee payment per month
            </h3>
          </div>
          <div style={actionsContainerStyle}>
            <FormControl 
              size="small" 
              style={{
                minWidth: isMobile ? '90px' : '100px',
                marginRight: isMobile ? '4px' : '0px'
              }}
            >
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select year' }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: isMobile ? '13px' : '14px',
                  height: isMobile ? '28px' : '30px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year} sx={{
                    color: '#333',
                    fontSize: isMobile ? '13px' : '14px'
                  }}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip
              title={showFeeAmounts ? "Hide amounts" : "Show amounts"}
              placement="top"
            >
              <IconButton
                onClick={toggleFeeVisibility}
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: showFeeAmounts
                      ? "rgba(25, 118, 210, 0.9)"
                      : "rgba(255, 255, 255, 0.3)",
                  },
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                  },
                  padding: isMobile ? '6px' : '8px',
                  fontSize: isMobile ? '16px' : '18px'
                }}
              >
                {showFeeAmounts ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="grid-table-wrapper">
          <div className="month-grid">
            {Object.keys(monthlyFeeData).map((monthKey, index) => {
              const amount = monthlyFeeData[monthKey];
              const isCurrentMonth = monthKey === currentMonth && selectedYear === new Date().getFullYear();
              const isFuture = amount === "-";
              const isClickable = showFeeAmounts && !isFuture;

              return (
                <div
                  key={monthKey}
                  className={`month-grid-item ${
                    isCurrentMonth ? "highlight-cell" : ""
                  } ${isClickable ? "clickable-month" : ""}`}
                  onClick={() =>
                    isClickable && handleMonthClick(monthKey)
                  }
                  style={{
                    cursor: isClickable ? "pointer" : "default",
                    opacity: showFeeAmounts ? 1 : 0.8,
                  }}
                >
                  <div className="month-header">{monthKey}</div>
                  <div className="month-value" data-future={isFuture}>
                    {isLoading ? (
                      <SkeletonCount width="60px" height="20px" />
                    ) : isFuture ? (
                      "-"
                    ) : showFeeAmounts ? (
                      formatToLacs(amount)
                    ) : (
                      <Tooltip
                        title="Click eye icon to view amount"
                        placement="top"
                      >
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