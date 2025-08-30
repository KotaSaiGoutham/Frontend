import React, { useMemo, useEffect } from 'react';
import { FaGraduationCap, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import './HistoricalTables.css';
import { useSelector, useDispatch } from "react-redux";
import { fetchMonthlyPayments } from '../../redux/actions';

const HistoricalTables = ({ students }) => {
  const dispatch = useDispatch();

  // Get the current day and month
  const today = new Date();
  const currentDayAbbr = today.toLocaleDateString('en-US', { weekday: 'short' });
  const currentMonth = today.toLocaleDateString('en-US', { month: 'short' });

  useEffect(() => {
    dispatch(fetchMonthlyPayments());
  }, [dispatch]);

  // Use the monthlyPayments data from the Redux store
  const { monthlyPayments } = useSelector((state) => state.expenditures);
  
  // Define a constant array of all month abbreviations to ensure consistent table display
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate daily classes data from students
  const dailyClassesData = useMemo(() => {
    const classCount = {
      'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0
    };

    if (!students || !Array.isArray(students)) return classCount;

    students.forEach(student => {
      if (!student.isActive || !Array.isArray(student.classDateandTime)) return;

      student.classDateandTime.forEach(schedule => {
        const [dayNameRaw] = schedule.split("-");
        const dayName = dayNameRaw.trim();
        
        const dayMap = {
          'Sunday': 'Sun', 'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed',
          'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat'
        };
        
        const dayAbbr = dayMap[dayName] || dayName.substring(0, 3);
        
        if (classCount.hasOwnProperty(dayAbbr)) {
          classCount[dayAbbr] += 1;
        }
      });
    });

    return classCount;
  }, [students]);

  // Update monthly fee data to use the fetched monthlyPayments
  const monthlyFeeData = useMemo(() => {
    const data = {};
    allMonths.forEach(monthAbbr => {
      // Check if data exists for the month, otherwise use '-'
      const amount = monthlyPayments[monthAbbr] || '-';
      data[monthAbbr] = amount;
    });
    return data;
  }, [monthlyPayments]);

  // You can still use mock data for monthly student count
  const monthlyStudentData = useMemo(() => {
    return {
      'Jan': 10, 'Feb': 11, 'Mar': 12, 'Apr': 13, 'May': 11, 'Jun': 12,
      'Jul': 14, 'Aug': 15, 'Sep': 15, 'Oct': 16, 'Nov': 17, 'Dec': 18
    };
  }, [students]);

  return (
    <div className="historical-tables-container">
      <div className="table-section">
        <div className="table-card full-width">
          <h3 className="table-heading">
            <span className="decorative-bar"></span>
            No of classes per day
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(dailyClassesData).map(day => (
                  <th 
                    key={day}
                    className={day === currentDayAbbr ? 'highlight-cell pulse' : ''}
                  >
                    <span className="th-content">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(dailyClassesData).map((count, index) => {
                  const dayKey = Object.keys(dailyClassesData)[index];
                  return (
                    <td 
                      key={index}
                      className={dayKey === currentDayAbbr ? 'highlight-cell' : ''}
                    >
                      <span className="data-value">{count}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-section">
        <div className="table-row">
          <div className="table-card">
            <h3 className="table-heading">
              <span className="decorative-bar"></span>
              <FaRupeeSign /> Fee payment per month
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(monthlyFeeData).map(month => (
                    <th 
                      key={month}
                      className={month === currentMonth ? 'highlight-cell pulse' : ''}
                    >
                      <span className="th-content">{month}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.keys(monthlyFeeData).map((monthKey, index) => {
                    const amount = monthlyFeeData[monthKey];
                    return (
                      <td 
                        key={index}
                        className={monthKey === currentMonth ? 'highlight-cell' : ''}
                      >
                        <span className="data-value">{amount !== '-' ? amount.toLocaleString() : '-'}</span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <h3 className="table-heading">
              <span className="decorative-bar"></span>
              No of students per month
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(monthlyStudentData).map(month => (
                    <th 
                      key={month}
                      className={month === currentMonth ? 'highlight-cell pulse' : ''}
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
                        className={monthKey === currentMonth ? 'highlight-cell' : ''}
                      >
                        <span className="data-value">{count}</span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTables;