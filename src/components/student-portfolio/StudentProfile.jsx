import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserCircle,
  FaTransgender,
  FaCalendarDay,
  FaPhone,
  FaGraduationCap,
  FaUniversity,
  FaBook,
  FaUsers,
  FaCalendarCheck,
  FaUserGraduate,
  FaIdCard,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaEnvelope,
  FaAward,
  FaChartLine,
  FaStar,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaBookOpen,
  FaRocket,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";
import { setCurrentStudent, clearCurrentStudent } from "../../redux/actions";
import { formatFirebaseDate,formatPhone  } from "../../mockdata/function";
const StudentProfile = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentStudent = useSelector((state) => state.auth?.currentStudent);

  useEffect(() => {
    if (location.state?.studentData) {
      dispatch(setCurrentStudent(location.state.studentData));
    } else if (currentStudent && currentStudent.id !== studentId) {
      dispatch(clearCurrentStudent());
    }
  }, [location.state, studentId, dispatch, currentStudent]);

  const studentData = currentStudent || location.state?.studentData;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get payment status style
  const getPaymentStatusStyle = (status) => {
    const baseStyle = {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    };

    if (status?.toLowerCase() === "paid") {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #10B981, #059669)",
        color: "white"
      };
    } else {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #EF4444, #DC2626)",
        color: "white"
      };
    }
  };

  // Get installment status style
  const getInstallmentStatusStyle = (status) => {
    if (status === "paid") {
      return { color: "#10B981", fontWeight: "600" };
    } else {
      return { color: "#EF4444", fontWeight: "600" };
    }
  };

  // Main container
  const containerStyle = {
    minHeight: "100vh",
  };

  // Profile card
  const profileCardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    margin: "0 auto",
    maxWidth: "1400px"
  };

  // Header section
  const headerStyle = {
    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    color: "white",
    padding: "40px",
    position: "relative",
    overflow: "hidden"
  };

  const headerBackgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"
  };

  const profileHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    position: "relative",
    zIndex: 2
  };

  const avatarStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    color: "#4F46E5",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
  };

  const studentInfoStyle = {
    flex: 1
  };

  const studentNameStyle = {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #fff, #E0E7FF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const studentIdStyle = {
    fontSize: "1.1rem",
    opacity: 0.9,
    margin: "0 0 20px 0",
    fontWeight: "500"
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  };

  const statCardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center"
  };

  const statValueStyle = {
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "4px"
  };

  const statLabelStyle = {
    fontSize: "0.85rem",
    opacity: 0.8,
    fontWeight: "500"
  };

  // Content sections
  const contentStyle = {
    padding: "40px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px"
  };

  // Section styles
  const sectionStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)"
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "2px solid #F3F4F6"
  };

  const sectionIconStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1.2rem"
  };

  const sectionTitleStyle = {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#1F2937",
    margin: 0
  };

  // Table styles
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const tableRowStyle = {
    borderBottom: "1px solid #F3F4F6",
    transition: "all 0.2s ease"
  };

  const tableCellStyle = {
    padding: "16px 12px",
    fontSize: "1.1rem"
  };

  const labelCellStyle = {
    ...tableCellStyle,
    fontWeight: "600",
    color: "#374151",
    width: "40%",
    verticalAlign: "top"
  };

  const valueCellStyle = {
    ...tableCellStyle,
    color: "#6B7280",
    fontWeight: "500"
  };

  const iconCellStyle = {
    width: "40px",
    textAlign: "center",
    color: "#4F46E5",
    fontSize: "1rem"
  };

  // Class schedule styles
  const scheduleGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginTop: "15px"
  };

  const scheduleCardStyle = {
    background: "linear-gradient(135deg, #F0F9FF, #E0F2FE)",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #BAE6FD",
    textAlign: "center"
  };

  const scheduleDayStyle = {
    fontWeight: "700",
    color: "#0369A1",
    fontSize: "0.9rem",
    marginBottom: "4px"
  };

  const scheduleTimeStyle = {
    fontWeight: "600",
    color: "#0C4A6E",
    fontSize: "0.85rem"
  };

  // Installment styles
  const installmentCardStyle = {
    background: "linear-gradient(135deg, #F8FAFC, #F1F5F9)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    marginBottom: "15px"
  };

  const installmentHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  };

  const installmentTitleStyle = {
    fontWeight: "700",
    color: "#1E293B",
    fontSize: "1rem"
  };

  // Error state
  const errorContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    color: "white"
  };

  const errorIconStyle = {
    fontSize: "4rem",
    marginBottom: "20px",
    opacity: 0.8
  };

  if (!studentData) {
    return (
      <div style={containerStyle}>
        <div style={errorContainerStyle}>
          <FaExclamationCircle style={errorIconStyle} />
          <h2 style={{ margin: "0 0 12px 0", fontSize: "1.8rem" }}>Student Profile Not Found</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "1.1rem" }}>
            Please go back and select a student to view their profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={profileCardStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <div style={headerBackgroundStyle}></div>
          <div style={profileHeaderStyle}>
            <div style={avatarStyle}>
              <FaUserGraduate />
            </div>
            <div style={studentInfoStyle}>
              <h1 style={studentNameStyle}>{studentData.Name || "N/A"}</h1>
              <div style={statsGridStyle}>
                <div style={statCardStyle}>
                  <div style={statValueStyle}>{studentData.Stream || "N/A"}</div>
                  <div style={statLabelStyle}>Stream</div>
                </div>
                <div style={statCardStyle}>
                  <div style={statValueStyle}>{studentData["Group "] || "N/A"}</div>
                  <div style={statLabelStyle}>Group</div>
                </div>
                <div style={statCardStyle}>
                  <div style={statValueStyle}>{studentData.Year || "N/A"}</div>
                  <div style={statLabelStyle}>Academic Year</div>
                </div>
                <div style={statCardStyle}>
                  <div style={statValueStyle}>
                    {studentData.isRevisionProgramJEEMains2026Student 
                      ? studentData.revisionClassesCompleted 
                      : studentData.classesCompleted || "0"}
                  </div>
                  <div style={statLabelStyle}>Classes Completed</div>
                </div>
                <div style={statCardStyle}>
                  <div style={statValueStyle}>
                    {studentData.isRevisionProgramJEEMains2026Student ? "Yes" : "No"}
                  </div>
                  <div style={statLabelStyle}>Revision Program</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={contentStyle}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Personal Information */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={sectionIconStyle}>
                  <FaUserCircle />
                </div>
                <h3 style={sectionTitleStyle}>Personal Information</h3>
              </div>
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaIdCard style={iconCellStyle} />
                        Full Name
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.Name || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaTransgender style={iconCellStyle} />
                        Gender
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.Gender || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaBook style={iconCellStyle} />
                        Subject
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.Subject || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaCalendarDay style={iconCellStyle} />
                        Admission Date
                      </div>
                    </td>
                    <td style={valueCellStyle}>
                      {formatFirebaseDate(studentData.admissionDate) || "N/A"}
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {studentData.isActive ? 
                          <FaToggleOn style={{...iconCellStyle, color: "#10B981"}} /> : 
                          <FaToggleOff style={{...iconCellStyle, color: "#EF4444"}} />
                        }
                        Account Status
                      </div>
                    </td>
                    <td style={valueCellStyle}>
                      <span style={studentData.isActive ? 
                        {color: "#10B981", fontWeight: "600"} : 
                        {color: "#EF4444", fontWeight: "600"}}>
                        {studentData.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Contact Information */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={sectionIconStyle}>
                  <FaPhone />
                </div>
                <h3 style={sectionTitleStyle}>Contact Information</h3>
              </div>
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaPhone style={iconCellStyle} />
                        Student Contact
                      </div>
                    </td>
                    <td style={valueCellStyle}>{formatPhone(studentData.ContactNumber)}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaUserCircle style={iconCellStyle} />
                        Father's Contact
                      </div>
                    </td>
                    <td style={valueCellStyle}>{formatPhone(studentData.father_contact)}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaUserCircle style={iconCellStyle} />
                        Mother's Contact
                      </div>
                    </td>
                    <td style={valueCellStyle}>{formatPhone(studentData.mother_contact)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Class Schedule */}
            {studentData.classDateandTime && (
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={sectionIconStyle}>
                    <FaCalendarAlt />
                  </div>
                  <h3 style={sectionTitleStyle}>Class Schedule</h3>
                </div>
                <div style={scheduleGridStyle}>
                  {studentData.classDateandTime.map((schedule, index) => {
                    const [day, time] = schedule.split('-');
                    return (
                      <div key={index} style={scheduleCardStyle}>
                        <div style={scheduleDayStyle}>{day}</div>
                        <div style={scheduleTimeStyle}>{time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Academic Information */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={sectionIconStyle}>
                  <FaGraduationCap />
                </div>
                <h3 style={sectionTitleStyle}>Academic Information</h3>
              </div>
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaUniversity style={iconCellStyle} />
                        College
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.College || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaBook style={iconCellStyle} />
                        Stream
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.Stream || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaUsers style={iconCellStyle} />
                        Group
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData["Group "] || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaCalendarCheck style={iconCellStyle} />
                        Academic Year
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.Year || "N/A"}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaGraduationCap style={iconCellStyle} />
                        Source
                      </div>
                    </td>
                    <td style={valueCellStyle}>{studentData.Source || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Information */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={sectionIconStyle}>
                  <FaMoneyBillWave />
                </div>
                <h3 style={sectionTitleStyle}>Payment Information</h3>
              </div>
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaMoneyBillWave style={iconCellStyle} />
                        Monthly Fee
                      </div>
                    </td>
                    <td style={valueCellStyle}>
                      {formatCurrency(studentData["Monthly Fee"] || studentData.monthlyFee || 0)}
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaCheckCircle style={iconCellStyle} />
                        Payment Status
                      </div>
                    </td>
                    <td style={valueCellStyle}>
                      <span style={getPaymentStatusStyle(studentData["Payment Status"])}>
                        {studentData["Payment Status"] || "N/A"}
                      </span>
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaCalendarDay style={iconCellStyle} />
                        Last Paid Date
                      </div>
                    </td>
                    <td style={valueCellStyle}>
                      {formatFirebaseDate(studentData.paidDate) || "N/A"}
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={labelCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaClock style={iconCellStyle} />
                        Next Due Date
                      </div>
                    </td>
                    <td style={valueCellStyle}>
                      {formatFirebaseDate(studentData.nextDueDate) || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
 {studentData.weekSyllabus && studentData.weekSyllabus.length > 0 && (
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={sectionIconStyle}>
                    <FaBookOpen />
                  </div>
                  <h3 style={sectionTitleStyle}>Recent Syllabus</h3>
                </div>
                <div>
                  {studentData.weekSyllabus.map((syllabus, index) => (
                    <div key={index} style={{
                      padding: "15px",
                      background: index % 2 === 0 ? "#F8FAFC" : "white",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      border: "1px solid #E2E8F0"
                    }}>
                      <div style={{ fontWeight: "600", color: "#1E293B", marginBottom: "5px" }}>
                        Topic: {syllabus.topic}
                      </div>
                      <div style={{ color: "#64748B", fontSize: "0.9rem" }}>
                        Date: {formatFirebaseDate(syllabus.date)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Revision Program Information */}
            {studentData.isRevisionProgramJEEMains2026Student && studentData.revisionProgramFee && (
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div style={sectionIconStyle}>
                    <FaRocket />
                  </div>
                  <h3 style={sectionTitleStyle}>Revision Program</h3>
                </div>
                
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontWeight: "600", color: "#1E293B", marginBottom: "8px" }}>
                    Program: {studentData.revisionProgramFee.programName}
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.95rem" }}>
                    Total Fee: {formatCurrency(studentData.revisionProgramFee.totalFee)}
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 15px 0", color: "#374151", fontSize: "1rem" }}>
                    Installments
                  </h4>
                  {Object.entries(studentData.revisionProgramFee.installments).map(([key, installment]) => (
                    <div key={key} style={installmentCardStyle}>
                      <div style={installmentHeaderStyle}>
                        <div style={installmentTitleStyle}>{key.replace('installment', 'Installment ')}</div>
                        <span style={getInstallmentStatusStyle(installment.status)}>
                          {installment.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.9rem" }}>
                        <div>
                          <strong>Amount:</strong> {formatCurrency(installment.amount)}
                        </div>
                        <div>
                          <strong>Due Date:</strong> {installment.dueDate}
                        </div>
                        <div>
                          <strong>Paid Amount:</strong> {formatCurrency(installment.paidAmount)}
                        </div>
                        <div>
                          <strong>Paid Date:</strong> {installment.paidDate ? 
                            new Date(installment.paidDate).toLocaleDateString() : "Not Paid"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Week Syllabus */}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;