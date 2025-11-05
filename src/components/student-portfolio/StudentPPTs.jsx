import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaFilePowerpoint,
  FaDownload,
  FaEye,
  FaCalendar,
  FaSpinner,
  FaClock,
  FaFile,
} from "react-icons/fa";
import { Chip } from "@mui/material";
import { MuiButton } from "../customcomponents/MuiCustomFormFields";
import { fetchStudentPPTs } from "../../redux/actions";

const StudentPPTs = () => {
  const dispatch = useDispatch();

  const {
    ppts = [],
    loading,
    error,
  } = useSelector((state) => state.lectureMaterials || {});
  const currentStudent = useSelector((state) => state.auth?.currentStudent);

  useEffect(() => {
    if (currentStudent?.id) {
      dispatch(fetchStudentPPTs(currentStudent.id));
    }
  }, [dispatch, currentStudent?.id]);

  // Format class information from classId
  const formatClassInfo = (classId) => {
    if (!classId) return null;

    try {
      const parts = classId.split("-");
      if (parts.length >= 5) {
        const [, year, month, day, dayTime] = parts;

        // Extract time from dayTime (e.g., "Monday1000am")
        const timeMatch = dayTime.match(/([a-zA-Z]+)(\d+)([ap]m)/i);
        if (timeMatch) {
          const [, dayName, time, period] = timeMatch;
          // Format time as "10:00 AM"
          const formattedTime =
            time.length === 4
              ? `${time.slice(0, 2)}:${time.slice(2)} ${period.toUpperCase()}`
              : `${time} ${period.toUpperCase()}`;

          return {
            date: new Date(`${year}-${month}-${day}`),
            day:
              dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase(),
            time: formattedTime,
            fullDate: `${parseInt(day)} ${getMonthName(month)} ${year}`,
          };
        }
      }
    } catch (error) {
      console.error("Error parsing class info:", error);
    }

    return null;
  };

  const getMonthName = (month) => {
    const months = [
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
    return months[parseInt(month) - 1] || month;
  };

  const formatFileType = (fileType) => {
    const typeMap = {
      pptPrevious: "Previous Class",
      pptCurrent: "Current Class",
      ppt: "Presentation",
    };
    return typeMap[fileType] || "PPT";
  };

  const getFileIcon = (fileName) => {
    const isPPT = fileName?.includes(".ppt") || fileName?.includes(".pptx");
    const isPDF = fileName?.includes(".pdf");
    const isImage =
      fileName?.includes(".jpg") ||
      fileName?.includes(".jpeg") ||
      fileName?.includes(".png");

    let backgroundColor = "#6c757d";
    let icon = <FaFilePowerpoint />;

    if (isPPT) {
      backgroundColor = "#ff6b35";
      icon = <FaFilePowerpoint />;
    } else if (isPDF) {
      backgroundColor = "#e74c3c";
      icon = <FaFile />;
    } else if (isImage) {
      backgroundColor = "#27ae60";
      icon = <FaFile />;
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
          borderRadius: "8px",
          backgroundColor: backgroundColor,
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        {icon}
      </div>
    );
  };

  const getDisplayName = (fileName, fileType) => {
    if (fileName && fileName !== `${fileType}.undefined`) {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      return nameWithoutExt
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    const typeNames = {
      pptPrevious: "Previous Class Materials",
      pptCurrent: "Current Class Materials",
      ppt: "Presentation Slides",
    };

    return typeNames[fileType] || "Class Materials";
  };

  const getFileFormatBadge = (fileName) => {
    const format = fileName?.split(".").pop()?.toUpperCase();
    if (!format) return null;

    return (
      <Chip
        icon={<FaFile style={{ fontSize: "12px" }} />}
        label={format}
        size="small"
        variant="outlined"
        style={{
          backgroundColor: "#f8f9fa",
          borderColor: "#dee2e6",
          color: "#495057",
        }}
      />
    );
  };

  const handleDownload = (material) => {
    try {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${material.fileId}`;
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
      window.open(material.fileUrl, "_blank");
    }
  };

  const handlePreview = (material) => {
    window.open(material.fileUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="student-portfolio-tab premium light-theme">
        <div className="tab-content premium">
          <div className="loading-message">
            <FaSpinner className="spin-icon" /> Loading PPTs...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-portfolio-tab premium light-theme">
        <div className="tab-content premium">
          <div className="error-message">Error loading PPTs: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-portfolio-tab premium light-theme">
      <div className="tab-content premium">
        <div className="section-header premium">
          <h2>Class PPT's</h2>
          <p>Presentation slides and class materials</p>
        </div>

        <div className="materials-list">
          {ppts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#666",
              }}
            >
              <FaFilePowerpoint
                style={{
                  fontSize: "3rem",
                  color: "#6c757d",
                  marginBottom: "1rem",
                }}
              />
              <h4 style={{ margin: "16px 0 8px 0", color: "#333" }}>
                No PPTs Available Yet
              </h4>
              <p>
                Your class presentations will appear here once they are uploaded
                by your instructor.
              </p>
            </div>
          ) : (
            ppts.map((material, index) => {
              const classInfo = formatClassInfo(material.classId);

              return (
                <div
                  key={material.id}
                  className="material-item"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    background: "white",
                    transition: "all 0.3s ease",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ marginRight: "16px", flexShrink: 0 }}>
                    {getFileIcon(material.fileName)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          color: "#333",
                          fontSize: "18px",
                          fontWeight: 600,
                          flex: 1,
                        }}
                      >
                        {getDisplayName(material.fileName, material.fileType)}
                        <span style={{ paddingLeft: 10 }}>
                          {getFileFormatBadge(material.fileName)}
                        </span>
                      </h4>
                    </div>

                    {/* File Type and Time Badges */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        margin: "12px 0",
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={formatFileType(material.fileType)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {classInfo && (
                        <Chip
                          icon={<FaClock style={{ fontSize: "12px" }} />}
                          label={classInfo.time}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </div>

                    {/* Class Information */}
                    {classInfo && (
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "12px",
                          borderRadius: "8px",
                          margin: "12px 0",
                          borderLeft: "4px solid #2196F3",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "4px",
                            fontSize: "14px",
                            color: "#555",
                          }}
                        >
                          <FaCalendar
                            style={{ marginRight: "8px", fontSize: "14px" }}
                          />
                          <span>
                            {classInfo.day}, {classInfo.fullDate}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "14px",
                            color: "#555",
                          }}
                        >
                          <FaClock
                            style={{ marginRight: "8px", fontSize: "14px" }}
                          />
                          <span>{classInfo.time}</span>
                        </div>
                      </div>
                    )}

                    {/* Upload Info */}
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      <span>
                        Uploaded{" "}
                        {new Date(
                          material.uploadedAt?._seconds * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <MuiButton
                      variant="contained"
                      size="small"
                      startIcon={<FaDownload />}
                      onClick={() => handleDownload(material)}
                    >
                      Download
                    </MuiButton>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPPTs;
