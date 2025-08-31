import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {

  format,
} from "date-fns";
import ExcelDownloadButton from "../customcomponents/ExcelDownloadButton";

const WeeklyTimetableExcelButton = () => {
  const { students } = useSelector((state) => state.students);


  const Exceltitle = `Monthly Timetable Report (${format(new Date(), 'MMM dd, yyyy')})`;
  const filename = `Monthly_Timetable_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

  return (
    <ExcelDownloadButton
      data={students}
      filename={filename}
      buttonLabel="Download Weekly Timetable"
      buttonProps={{ variant: "contained", color: "success" }}
      excelReportTitle={Exceltitle}
    />
  );
};

export default WeeklyTimetableExcelButton;