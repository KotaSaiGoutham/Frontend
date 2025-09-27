import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import startOfWeek and addWeeks for correct weekly navigation
import { format, nextDay, parseISO, addDays, startOfWeek, addWeeks, isAfter } from "date-fns";
import {
  FaFileAlt,
  FaPlus,
  FaDownload,
  FaSpinner,
  FaExclamationCircle,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import {
  fetchStudentLectureMaterials,
  uploadLectureMaterial,
  deleteLectureMaterial,
} from "../redux/actions"; // Adjust path as needed
import "./LectureMaterialsTable.css";

// Reusable component for both PPTs and Worksheet steps
const FileInteractionBox = ({
  classId,
  fileType,
  file,
  isUploadable = true,
  handleDragOver,
  handleDrop,
  handleFileSelect,
  handleDelete,
  fileInputRef,
  uploading,
}) => {
  const isCompleted = !!file;
  const isLocked = !isUploadable;

  const boxClasses = `file-interaction-box ${isCompleted ? "completed" : ""} ${
    isUploadable ? "uploadable" : ""
  } ${isLocked ? "locked" : ""}`;

  return (
    <div
      className={boxClasses}
      onDragOver={isUploadable ? handleDragOver : undefined}
      onDrop={isUploadable ? (e) => handleDrop(e, classId, fileType) : undefined}
      onClick={isUploadable && !isCompleted ? () => fileInputRef?.current?.click() : undefined}
    >
      <div className="box-content-wrapper">
        {isUploadable ? (
          isCompleted ? (
            <div className="uploaded-file-info">
              <FaCheckCircle className="upload-success-icon" />
              <span className="file-name" title={file?.fileName}>{file?.fileName}</span>
              <div className="file-actions">
                <button
                  onClick={() =>
                    window.open(
                      file?.fileUrl || `https://drive.google.com/uc?export=download&id=${file?.fileId}`,
                      "_blank"
                    )
                  }
                  className="file-action-btn view-btn"
                >
                  <FaDownload />
                </button>
                <button onClick={() => handleDelete(file?.id, file?.fileId)} className="file-action-btn delete-btn">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-area">
              <FaPlus className="upload-icon" />
              <span>Upload</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, classId, fileType)}
              />
            </div>
          )
        ) : (
          <div className="locked-content">
            <FaExclamationCircle className="locked-icon" />
            <span>Complete previous step</span>
          </div>
        )}
      </div>

      {uploading && <FaSpinner className="spin-icon upload-spinner" />}
    </div>
  );
};

const getStatusType = (status) => {
  if (!status) return "urgent";
  if (status.includes("Waiting")) return "waiting";
  if (status.includes("Upload") || status.includes("Completed")) return "uploaded";
  if (status.includes("Pending")) return "pending";
  return "urgent"; // Default or other cases
};

const getShortStatus = (status) => {
  if (!status) return "";
  const shortMap = {
    "Waiting for lecture to upload question": "Upload Question",
    "Waiting for worksheet from Nagender": "From Nagender",
    "Waiting for lecture to upload to student": "To Student",
    "Waiting for student to upload answers": "Upload Answers",
    "Waiting for result from Nagender": "Get Results",
    "Waiting for doubts PPT": "Doubts PPT",
  };
  return shortMap[status] || status;
};

// Component for the linear worksheet progress flow
const WorksheetProgressBar = ({
  schedule,
  materials = [],
  worksheetStatuses = [],
  handleDragOver,
  handleDrop,
  handleFileSelect,
  handleDelete,
  fileInputRefs,
  uploading,
}) => {
  return (
    <div className="worksheet-linear-flow">
      {worksheetStatuses.map((status, idx) => {
        const fileType = `worksheet${idx + 1}`;
        const file = materials.find((m) => m.classId === schedule.classId && m.fileType === fileType);
        const refKey = `${schedule.classId}-${fileType}`;

        if (!fileInputRefs.current[refKey]) {
          fileInputRefs.current[refKey] = React.createRef();
        }

        // Logic to enable sequential upload for worksheets
        const isUploadable =
          idx === 0 ||
          !!materials.find((m) => m.classId === schedule.classId && m.fileType === `worksheet${idx}`);

        return (
          <React.Fragment key={refKey}>
            <FileInteractionBox
              classId={schedule.classId}
              fileType={fileType}
              file={file}
              isUploadable={isUploadable}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelect}
              handleDelete={handleDelete}
              fileInputRef={fileInputRefs.current[refKey]}
              uploading={uploading}
            />

            {idx < worksheetStatuses.length - 1 && (
              <div className="flow-connector">
                <div className={`flow-arrow ${file ? "arrow-active" : ""}`}>→</div>

                <div className={`status-badge status-${getStatusType(worksheetStatuses[idx + 1])}`}>
                  {getShortStatus(worksheetStatuses[idx + 1])}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Main Component
const LectureMaterialsTable = ({ studentId, studentName, studentClassSchedule = [], admissionDate }) => {
  const dispatch = useDispatch();
  const { materials = [], loading, uploading, error } = useSelector((state) => state.lectureMaterials || {});

  const fileInputRefs = useRef({});
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = past, +1 = next

  const getUniqueClassId = (date, day, time) => {
    const normalizedTime = (time || "").replace(/[^a-zA-Z0-9]/g, "");
    return `${studentId}-${format(date, "yyyy-MM-dd")}-${day}-${normalizedTime}`;
  };

  const resolveAdmissionDate = (adDate) => {
    if (!adDate) return new Date();
    // Handle Firebase Timestamp object
    if (adDate._seconds) return new Date(adDate._seconds * 1000); 
    if (typeof adDate === "string") return parseISO(adDate);
    if (adDate instanceof Date) return adDate;
    return new Date();
  };
  
  // Helper to get the correct day of the week, starting from the admission date
  const getNextClassDate = (day, admission) => {
    const dayOfWeekMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const targetDayIndex = dayOfWeekMap[day];

    // Find the date of the target day, starting the search from the admission date
    let date = nextDay(admission, targetDayIndex);
    
    // If the next calculated date is more than 7 days past admission, 
    // it means the first class was in the previous week, but we want the one 
    // closest to the admission date, which nextDay handles fine. 
    // The key is to start weekly navigation from the *current* week.
    return date;
  };
  
  const [scheduleWithDates, setScheduleWithDates] = useState([]);

  // This array defines the 6 steps for the worksheet progress
  const worksheetStatuses = [
    "Waiting for lecture to upload question",
    "Waiting for worksheet from Nagender",
    "Waiting for lecture to upload to student",
    "Waiting for student to upload answers",
    "Waiting for result from Nagender",
    "Waiting for doubts PPT",
  ];

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentLectureMaterials(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (Array.isArray(studentClassSchedule) && studentClassSchedule.length > 0 && admissionDate) {
      const resolvedAdmissionDate = resolveAdmissionDate(admissionDate);
      const today = new Date();

      // 1. Determine the start of the current displayed week based on weekOffset
      // Setting weekStartsOn: 1 (Monday) or 0 (Sunday) based on preference. Using 0 (Sunday) here.
      const currentWeekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
      
      const calculatedDates = studentClassSchedule.map((schedule) => {
        const [day, time] = (schedule || "").split("-");
        
        const dayOfWeekMap = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };
        const targetDayIndex = dayOfWeekMap[day];

        // 2. Calculate the exact date for this class day in the current week
        // addDays(currentWeekStart, dayIndex) gets the correct day within the week
        let classDate = addDays(currentWeekStart, targetDayIndex);

        // Optional: Filter out classes that happened before the admission date
        if (isAfter(resolvedAdmissionDate, classDate)) {
            // If the calculated date is before the admission date, skip it or adjust
            // For weekly display, we just proceed. The table will show old dates for past weeks.
        }

        return {
          day,
          time,
          date: classDate,
          classId: getUniqueClassId(classDate, day, time),
        };
      });

      calculatedDates.sort((a, b) => a.date - b.date);
      setScheduleWithDates(calculatedDates);
    } else {
      setScheduleWithDates([]);
    }
  }, [studentClassSchedule, admissionDate, weekOffset]);


  const handleDragOver = (e) => e.preventDefault();

  // ⚠️ UPDATED: Added studentName to formData
  const handleDrop = (e, classId, fileType) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      // 👇 Pass the student name in the form data
      formData.append("studentName", studentName); 
      dispatch(uploadLectureMaterial(studentId, classId, fileType, formData));
    }
  };

  // ⚠️ UPDATED: Added studentName to formData
  const handleFileSelect = (e, classId, fileType) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      // 👇 Pass the student name in the form data
      formData.append("studentName", studentName); 
      dispatch(uploadLectureMaterial(studentId, classId, fileType, formData));
    }
  };

  const handleDelete = (fileId, googleDriveId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      dispatch(deleteLectureMaterial(fileId, googleDriveId));
    }
  };

  const getRecentMaterial = (classId, fileType) => materials.find((m) => m.classId === classId && m.fileType === fileType);

  const ensureRef = (key) => {
    if (!fileInputRefs.current[key]) {
      fileInputRefs.current[key] = React.createRef();
    }
    return fileInputRefs.current[key];
  };

  if (loading) {
    return (
      <div className="loading-message">
        <FaSpinner className="spin-icon" /> Loading lecture materials...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <FaExclamationCircle /> {error}
      </div>
    );
  }

  if (!scheduleWithDates || scheduleWithDates.length === 0) {
    return (
      <div className="loading-message">
        <FaSpinner className="spin-icon" /> Calculating class schedule...
      </div>
    );
  }

  return (
    <div className="lecture-materials-container">
      <h2 className="materials-header">
        <FaFileAlt className="header-icon" /> Lecture Materials & Notes for {studentName}
      </h2>

      <p className="materials-description">
        Drag and drop files or click to upload. All materials will be accessible to the student.
      </p>
        {/* Navigation is working now, controlled by weekOffset state */}
        <div className="week-navigation">
          <button onClick={() => setWeekOffset(weekOffset - 1)}>⬅ Prev Week</button>
          <button onClick={() => setWeekOffset(0)}>This Week</button>
          <button onClick={() => setWeekOffset(weekOffset + 1)}>Next Week ➡</button>
        </div>

      <div className="table-responsive">
        <table className="materials-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Class Time</th>
              <th>PPT (Previous)</th>
              <th>PPT (Current)</th>
              <th colSpan="4">Worksheet Progress</th>
            </tr>
          </thead>

          <tbody>
            {scheduleWithDates.map((schedule) => {
              const pptPreviousFile = getRecentMaterial(schedule.classId, "pptPrevious");
              const pptCurrentFile = getRecentMaterial(schedule.classId, "pptCurrent");

              return (
                <tr key={schedule.classId} className="material-row">
                  {/* ✅ FIX: Change date format to dd/MM/yyyy */}
                  <td>{format(schedule.date, "dd/MM/yyyy")}</td>
                  <td>{schedule.time}</td>

                  <td>
                    <FileInteractionBox
                      classId={schedule.classId}
                      fileType="pptPrevious"
                      file={pptPreviousFile}
                      isUploadable={true} // PPT Previous is always the first step
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      handleFileSelect={handleFileSelect}
                      handleDelete={handleDelete}
                      fileInputRef={ensureRef(`${schedule.classId}-pptPrevious`)}
                      uploading={uploading}
                    />
                  </td>

                  <td className="file-cell">
                    <FileInteractionBox
                      classId={schedule.classId}
                      fileType="pptCurrent"
                      file={pptCurrentFile}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      handleFileSelect={handleFileSelect}
                      handleDelete={handleDelete}
                      fileInputRef={ensureRef(`${schedule.classId}-pptCurrent`)}
                      isUploadable={!!pptPreviousFile}
                      uploading={uploading}
                    />
                  </td>

                  <td colSpan="4">
                    <WorksheetProgressBar
                      schedule={schedule}
                      materials={materials}
                      worksheetStatuses={worksheetStatuses}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      handleFileSelect={handleFileSelect}
                      handleDelete={handleDelete}
                      fileInputRefs={fileInputRefs}
                      uploading={uploading}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LectureMaterialsTable;