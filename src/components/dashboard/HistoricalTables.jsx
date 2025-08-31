import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaRupeeSign, FaCalendarAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchMonthlyPayments, fetchClassUpdates } from "../../redux/actions";
import { Box, Tooltip } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  format,
  addDays,
  isSameMonth,
  parseISO,
  isAfter,
  startOfMonth,
  endOfMonth,
} from "date-fns"; // ⬅️ Add `isSameMonth` and `parseISO`
import "./HistoricalTables.css";

const HistoricalTables = ({ students }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const today = new Date();
  const currentDayAbbr = today.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const currentMonth = today.toLocaleDateString("en-US", { month: "short" });

  const {
    classUpdates,
    loading: classUpdatesLoading,
    error: classUpdatesError,
  } = useSelector((state) => state.classes);
  useEffect(() => {
    dispatch(fetchMonthlyPayments());
    dispatch(fetchClassUpdates());
  }, [dispatch]);

  const { monthlyPayments } = useSelector((state) => state.expenditures);

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
  const currentYear = today.getFullYear();

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

    if (!students || !Array.isArray(students)) return classCount;

    students.forEach((student) => {
      if (!student.isActive || !Array.isArray(student.classDateandTime)) return;

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

    return classCount;
  }, [students]);

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

      // ✅ If this month is in the future → mark as "-"
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

    // ✅ If month is in the future → mark as "-"
    if (monthStart > today) {
      data[monthAbbr] = "-";
      return;
    }

    let count = 0;

    students.forEach((student) => {
      if (!student.admissionDate?._seconds) return;

      const admissionDate = new Date(student.admissionDate._seconds * 1000);

      // 🟢 Step 1: Must have joined before end of this month
      if (admissionDate > monthEnd) return;

      // 🟢 Step 2: Must be active (isActive true, deactivated false)
      if (!student.isActive || student.deactivated) return;

      // 🟢 Step 3: If deactivatedAt exists, make sure it’s AFTER this month
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

  return (
    <div className="historical-tables-container">
            {/* First Row: Classes per day */}     {" "}
      <div className="table-section">
               {" "}
        <div className="row-container">
                   {" "}
          <div className="table-container">
                       {" "}
            <div className="table-card primary-card">
                           {" "}
              <h3
                className="table-heading clickable-heading"
                onClick={handleNavigateToToday}
              >
                               {" "}
                <span className="heading-icon">
                  <FaCalendarAlt />
                </span>{" "}
                No of classes per day              {" "}
              </h3>
                           {" "}
              <table className="data-table">
                               {" "}
                <thead>
                                   {" "}
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
                                               {" "}
                        <span className="th-content">{dayAbbr}</span>           
                                 {" "}
                      </th>
                    ))}
                                     {" "}
                  </tr>
                                 {" "}
                </thead>
                               {" "}
                <tbody>
                                   {" "}
                  <tr>
                                       {" "}
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
                                                 {" "}
                          <Tooltip
                            title={`Click to view timetable for ${dayAbbr}`}
                            placement="top"
                          >
                                                     {" "}
                            <span className="data-value">{count}</span>         
                                         {" "}
                          </Tooltip>
                                               {" "}
                        </td>
                      )
                    )}
                                     {" "}
                  </tr>
                                 {" "}
                </tbody>
                             {" "}
              </table>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="chart-container-history">
                       {" "}
            <Box className="chart-card">
                           {" "}
              <LineChart
                xAxis={[
                  {
                    scaleType: "point",
                    data: sevenDayClassesData.map((item) => item.dayAbbr),
                  },
                ]}
                yAxis={[{ min: 0 }]}
                series={[
                  {
                    data: sevenDayClassesData.map((item) => item.count),
                    color: "#4a6cf7",
                    area: true,
                    curve: "natural",
                  },
                ]}
                height={180}
                margin={{ top: 15, right: 15, left: 35, bottom: 15 }}
              />
                         {" "}
            </Box>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
            {/* Second Row: Fee payment per month */}     {" "}
      <div className="table-section">
               {" "}
        <div className="row-container">
                   {" "}
          <div className="table-container">
                       {" "}
            <div className="table-card secondary-card">
                           {" "}
              <h3 className="table-heading">
                               {" "}
                <span className="heading-icon">
                  <FaRupeeSign />
                </span>{" "}
                Fee payment per month              {" "}
              </h3>
                           {" "}
              <table className="data-table">
                               {" "}
                <thead>
                                   {" "}
                  <tr>
                                       {" "}
                    {Object.keys(monthlyFeeData).map((month) => (
                      <th
                        key={month}
                        className={
                          month === currentMonth ? "highlight-cell pulse" : ""
                        }
                      >
                                               {" "}
                        <span className="th-content">{month}</span>             
                               {" "}
                      </th>
                    ))}
                                     {" "}
                  </tr>
                                 {" "}
                </thead>
                               {" "}
                <tbody>
                                   {" "}
                  <tr>
                                       {" "}
                    {Object.keys(monthlyFeeData).map((monthKey, index) => {
                      const amount = monthlyFeeData[monthKey];
                      return (
                        <td
                          key={index}
                          className={
                            monthKey === currentMonth ? "highlight-cell" : ""
                          }
                        >
                                                   {" "}
                          <span className="data-value">
                            {amount.toLocaleString()}
                          </span>
                                                 {" "}
                        </td>
                      );
                    })}
                                     {" "}
                  </tr>
                                 {" "}
                </tbody>
                             {" "}
              </table>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="chart-container-history">
                       {" "}
            <LineChart
              xAxis={[{ scaleType: "point", data: allMonths }]}
              yAxis={[{ min: 0 }]}
              series={[
                {
                  data: Object.values(monthlyFeeData).map((val) =>
                    val === "-" ? 0 : val
                  ),
                  color: "#B21F62",
                  area: true,
                  curve: "natural",
                },
              ]}
              height={180}
              margin={{ top: 15, right: 15, left: 35, bottom: 15 }}
            />
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
                  {/* Third Row: Students per month */}     {" "}
      <div className="table-section">
               {" "}
        <div className="row-container">
                   {" "}
          <div className="table-container">
                       {" "}
            <div className="table-card tertiary-card">
                           {" "}
              <h3 className="table-heading">
                               {" "}
                <span className="heading-icon">
                  <FaGraduationCap />
                </span>{" "}
                No of students per month              {" "}
              </h3>
                           {" "}
              <table className="data-table">
                               {" "}
                <thead>
                                   {" "}
                  <tr>
                                       {" "}
                    {Object.keys(monthlyStudentData).map((month) => (
                      <th
                        key={month}
                        className={
                          month === currentMonth ? "highlight-cell pulse" : ""
                        }
                      >
                                               {" "}
                        <span className="th-content">{month}</span>             
                               {" "}
                      </th>
                    ))}
                                     {" "}
                  </tr>
                                 {" "}
                </thead>
                               {" "}
                <tbody>
                                   {" "}
                  <tr>
                                       {" "}
                    {Object.values(monthlyStudentData).map((count, index) => {
                      const monthKey = Object.keys(monthlyStudentData)[index];
                      return (
                        <td
                          key={index}
                          className={
                            monthKey === currentMonth ? "highlight-cell" : ""
                          }
                        >
                                                   {" "}
                          <span className="data-value">{count}</span>           
                                     {" "}
                        </td>
                      );
                    })}
                                   {" "}
                  </tr>
                                 {" "}
                </tbody>
                             {" "}
              </table>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="chart-container-history">
                       {" "}
            <Box className="chart-card">
                           {" "}
              <LineChart
                xAxis={[{ scaleType: "point", data: allMonths }]}
                yAxis={[{ min: 0 }]}
                series={[
                  {
                    // ✅ convert "-" to 0 for chart only
                    data: Object.values(monthlyStudentData).map((val) =>
                      val === "-" ? 0 : val
                    ),
                    color: "#292551",
                    area: true,
                    curve: "natural",
                  },
                ]}
                height={180}
                margin={{ top: 15, right: 15, left: 35, bottom: 15 }}
              />
                         {" "}
            </Box>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default HistoricalTables;
