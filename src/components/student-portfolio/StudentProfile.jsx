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
  FaExclamationCircle,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaBookOpen,
  FaRocket,
  FaChartBar,
  FaPercentage,
  FaShieldAlt,
  FaEdit
} from "react-icons/fa";
import { setCurrentStudent } from "../../redux/actions";
import { formatFirebaseDate, formatPhone } from "../../mockdata/function";

const StudentProfile = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentStudent = useSelector((state) => state.auth?.currentStudent);

  useEffect(() => {
    if (location.state?.studentData) {
      dispatch(setCurrentStudent(location.state.studentData));
    }
  }, [location.state, studentId, dispatch]);

  const studentData = currentStudent || location.state?.studentData;

  // Enhanced color palette
  const colors = {
    primary: "#3b82f6",
    primaryLight: "#dbeafe",
    primaryDark: "#1d4ed8",
    secondary: "#64748b",
    success: "#10b981",
    successLight: "#d1fae5",
    warning: "#f59e0b",
    warningLight: "#fef3c7",
    error: "#ef4444",
    errorLight: "#fee2e2",
    purple: "#8b5cf6",
    purpleLight: "#ede9fe",
    indigo: "#6366f1",
    indigoLight: "#e0e7ff",
    pink: "#ec4899",
    pinkLight: "#fce7f3",
    teal: "#14b8a6",
    tealLight: "#ccfbf1"
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (studentData.isRevisionProgramJEEMains2026Student) {
      const total = studentData.revisionProgramFee?.totalFee || 0;
      const paid = Object.values(studentData.revisionProgramFee?.installments || {})
        .reduce((sum, inst) => sum + (inst.paidAmount || 0), 0);
      return total > 0 ? Math.min((paid / total) * 100, 100) : 0;
    }
    return studentData["Payment Status"]?.toLowerCase() === "paid" ? 100 : 0;
  };

  // Enhanced status badge with glow effects
  const StatusBadge = ({ status, type = "payment", icon: Icon }) => {
    const getConfig = () => {
      const configs = {
        payment: {
          paid: { bg: colors.successLight, color: colors.success, border: colors.success, glow: "0 0 20px rgba(16, 185, 129, 0.3)" },
          unpaid: { bg: colors.errorLight, color: colors.error, border: colors.error, glow: "0 0 20px rgba(239, 68, 68, 0.2)" }
        },
        status: {
          active: { bg: colors.successLight, color: colors.success, border: colors.success, glow: "0 0 20px rgba(16, 185, 129, 0.3)" },
          inactive: { bg: colors.errorLight, color: colors.error, border: colors.error, glow: "0 0 20px rgba(239, 68, 68, 0.2)" }
        },
        program: {
          revision: { bg: colors.purpleLight, color: colors.purple, border: colors.purple, glow: "0 0 20px rgba(139, 92, 246, 0.3)" }
        }
      };
      return configs[type]?.[status?.toLowerCase()] || configs.payment.unpaid;
    };

    const config = getConfig();

    return (
      <div style={{
        padding: "10px 18px",
        borderRadius: "25px",
        fontSize: "0.75rem",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: config.bg,
        color: config.color,
        border: `2px solid ${config.border}`,
        boxShadow: config.glow,
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease"
      }}>
        {Icon && <Icon />}
        {status}
      </div>
    );
  };

  // Enhanced Progress Bar with animation
  const ProgressBar = ({ percentage, color = colors.primary, height = 12 }) => (
    <div style={{
      width: "100%",
      height: `${height}px`,
      backgroundColor: "rgba(0,0,0,0.1)",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "8px",
      position: "relative"
    }}>
      <div style={{
        width: `${percentage}%`,
        height: "100%",
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        borderRadius: "10px",
        transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          animation: "shimmer 2s infinite"
        }} />
      </div>
    </div>
  );

  // Premium StatCard with gradient option
  const StatCard = ({ icon: Icon, value, label, color = colors.primary, trend, subtitle, gradient }) => (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: gradient ? `linear-gradient(135deg, ${color}15, ${color}08)` : "white",
      padding: "24px",
      borderRadius: "20px",
      border: `1px solid ${color}20`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      minHeight: "120px",
      ':hover': {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
      }
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "80px",
        height: "80px",
        background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
        opacity: 0.4
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", zIndex: 2 }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          fontSize: "1.4rem",
          border: `2px solid ${color}25`,
          boxShadow: `0 4px 12px ${color}15`
        }}>
          <Icon />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "#1a1a1a",
            lineHeight: "1.1",
            marginBottom: "4px",
            background: gradient ? `linear-gradient(135deg, ${color}, ${color}dd)` : "none",
            WebkitBackgroundClip: gradient ? "text" : "none",
            WebkitTextFillColor: gradient ? "transparent" : "none"
          }}>
            {value}
          </div>
          <div style={{
            fontSize: "0.85rem",
            color: "#666",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "4px"
          }}>
            {label}
          </div>
          {subtitle && (
            <div style={{
              fontSize: "0.75rem",
              color: color,
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: color
              }} />
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Enhanced Section Header
  const SectionHeader = ({ icon: Icon, title, subtitle, color = colors.primary, action }) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "28px",
      paddingBottom: "20px",
      borderBottom: "2px solid rgba(0,0,0,0.06)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.5rem",
          boxShadow: `0 8px 25px ${color}40`
        }}>
          <Icon />
        </div>
        <div>
          <h3 style={{
            fontSize: "1.6rem",
            fontWeight: "700",
            color: "#1a1a1a",
            margin: "0 0 6px 0",
            background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              fontSize: "0.95rem",
              color: "#666",
              margin: 0,
              fontWeight: "500"
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <button style={{
          padding: "10px 20px",
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "0.85rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.3s ease"
        }}>
          <FaEdit />
          {action}
        </button>
      )}
    </div>
  );

  // Info Item Component
  const InfoItem = ({ icon: Icon, label, value, color = colors.primary, type = "text" }) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "20px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
      borderRadius: "16px",
      border: "1px solid rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: `${color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        fontSize: "1.2rem",
        border: `2px solid ${color}20`
      }}>
        <Icon />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "0.85rem",
          color: "#666",
          fontWeight: "600",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          {label}
        </div>
        <div style={{
          fontSize: "1.1rem",
          color: "#1a1a1a",
          fontWeight: "600"
        }}>
          {value || "N/A"}
        </div>
      </div>
    </div>
  );

  if (!studentData) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          textAlign: "center",
          background: "rgba(255,255,255,0.95)",
          padding: "60px 40px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(20px)",
          maxWidth: "500px",
          width: "100%"
        }}>
          <div style={{
            fontSize: "4rem",
            color: colors.error,
            marginBottom: "20px",
            opacity: 0.8
          }}>
            <FaExclamationCircle />
          </div>
          <h2 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1a1a1a",
            margin: "0 0 16px 0"
          }}>
            Student Not Found
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#666",
            margin: 0,
            lineHeight: "1.6"
          }}>
            The student profile you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = calculateProgress();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      {/* Main Profile Container */}
      <div style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "28px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        
        {/* Premium Header Section */}
        <div style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
          color: "white",
          padding: "50px 40px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Animated background elements */}
          <div style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            filter: "blur(40px)",
            animation: "float 6s ease-in-out infinite"
          }} />
          <div style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(30px)",
            animation: "float 8s ease-in-out infinite 1s"
          }} />
          
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "35px",
            position: "relative",
            zIndex: 2
          }}>
            {/* Enhanced Avatar */}
            <div style={{
              width: "140px",
              height: "140px",
              borderRadius: "25px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3.5rem",
              color: "white",
              border: "3px solid rgba(255,255,255,0.3)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden"
            }}>
              <FaUserGraduate />
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.1))"
              }} />
            </div>

            {/* Student Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "16px",
                flexWrap: "wrap"
              }}>
                <h1 style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  margin: 0,
                  background: "linear-gradient(135deg, #fff, #e0e7ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}>
                  {studentData.Name || "N/A"}
                </h1>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <StatusBadge 
                    status={studentData.isActive ? "Active" : "Inactive"} 
                    type="status" 
                    icon={studentData.isActive ? FaCheckCircle : FaExclamationCircle}
                  />
                  {studentData.isRevisionProgramJEEMains2026Student && (
                    <StatusBadge 
                      status="Revision Program" 
                      type="program" 
                      icon={FaRocket}
                    />
                  )}
                </div>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px"
              }}>
                <StatCard
                  icon={FaGraduationCap}
                  value={studentData.Stream || "N/A"}
                  label="Stream"
                  color={colors.success}
                />
                <StatCard
                  icon={FaUsers}
                  value={studentData["Group "] || "N/A"}
                  label="Group"
                  color={colors.warning}
                />
                <StatCard
                  icon={FaChartBar}
                  value={studentData.isRevisionProgramJEEMains2026Student ? 
                    studentData.revisionClassesCompleted : 
                    studentData.classesCompleted || "0"}
                  label="Classes Completed"
                  color={colors.primary}
                />
                <StatCard
                  icon={FaPercentage}
                  value={`${progressPercentage}%`}
                  label="Payment Progress"
                  color={progressPercentage === 100 ? colors.success : colors.warning}
                  subtitle={progressPercentage === 100 ? "Fully Paid" : "Payment Pending"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          padding: "45px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "35px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
        }}>
          
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
            
            {/* Personal Information */}
            <div style={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)"
            }}>
              <SectionHeader
                icon={FaUserCircle}
                title="Personal Information"
                subtitle="Basic details and contact information"
                color={colors.primary}
              />
              
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <InfoItem
                  icon={FaIdCard}
                  label="Full Name"
                  value={studentData.Name}
                  color={colors.primary}
                />
                <InfoItem
                  icon={FaTransgender}
                  label="Gender"
                  value={studentData.Gender}
                  color={colors.purple}
                />
                <InfoItem
                  icon={FaBook}
                  label="Subject"
                  value={studentData.Subject}
                  color={colors.indigo}
                />
                <InfoItem
                  icon={FaCalendarDay}
                  label="Admission Date"
                  value={formatFirebaseDate(studentData.admissionDate)}
                  color={colors.success}
                />
                <InfoItem
                  icon={FaShieldAlt}
                  label="Source"
                  value={studentData.Source}
                  color={colors.secondary}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div style={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)"
            }}>
              <SectionHeader
                icon={FaPhone}
                title="Contact Information"
                subtitle="Phone numbers and communication details"
                color={colors.success}
              />
              
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <InfoItem
                  icon={FaPhone}
                  label="Student Contact"
                  value={formatPhone(studentData.ContactNumber)}
                  color={colors.success}
                />
                <InfoItem
                  icon={FaUserCircle}
                  label="Father's Contact"
                  value={formatPhone(studentData.father_contact)}
                  color={colors.primary}
                />
                <InfoItem
                  icon={FaUserCircle}
                  label="Mother's Contact"
                  value={formatPhone(studentData.mother_contact)}
                  color={colors.purple}
                />
                        <InfoItem
                  icon={FaGraduationCap}
                  label="Program Type"
                  value={studentData.isRevisionProgramJEEMains2026Student ? "Revision Program" : "Regular"}
                  color={colors.warning}
                />
              </div>
            </div>

            {/* Revision Program Details (MOVED HERE - LEFT SIDE) */}
            {studentData.isRevisionProgramJEEMains2026Student && studentData.revisionProgramFee && (
              <div style={{
                background: "rgba(255,255,255,0.8)",
                borderRadius: "24px",
                padding: "35px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)"
              }}>
                <SectionHeader
                  icon={FaRocket}
                  title="Revision Program"
                  subtitle="JEE Mains 2026 preparation details"
                  color={colors.purple}
                />
                
                <div style={{ marginBottom: "28px" }}>
                  <div style={{
                    fontWeight: "800",
                    color: "#1a1a1a",
                    marginBottom: "10px",
                    fontSize: "1.3rem"
                  }}>
                    {studentData.revisionProgramFee.programName}
                  </div>
                  <div style={{
                    color: "#666",
                    fontSize: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))",
                    borderRadius: "12px",
                    border: "2px solid rgba(139,92,246,0.2)"
                  }}>
                    <span style={{ fontWeight: "600" }}>Total Program Fee:</span>
                    <span style={{ fontWeight: "800", color: "#1a1a1a", fontSize: "1.1rem" }}>
                      {formatCurrency(studentData.revisionProgramFee.totalFee)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 style={{
                    margin: "0 0 22px 0",
                    color: "#1a1a1a",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    paddingBottom: "12px",
                    borderBottom: "2px solid rgba(0,0,0,0.06)"
                  }}>
                    Installment Plan
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {Object.entries(studentData.revisionProgramFee.installments).map(([key, installment]) => (
                      <div key={key} style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                        padding: "22px",
                        borderRadius: "16px",
                        border: "2px solid rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)"
                      }}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "15px"
                        }}>
                          <div style={{
                            fontWeight: "800",
                            color: "#1a1a1a",
                            fontSize: "1.1rem"
                          }}>
                            {key.replace('installment', 'Installment ')}
                          </div>
                          <StatusBadge 
                            status={installment.status} 
                            type="payment"
                            icon={installment.status === "paid" ? FaCheckCircle : FaClock}
                          />
                        </div>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "15px",
                          fontSize: "0.9rem"
                        }}>
                          <div>
                            <strong style={{ color: "#666" }}>Amount:</strong> {formatCurrency(installment.amount)}
                          </div>
                          <div>
                            <strong style={{ color: "#666" }}>Due Date:</strong> {installment.dueDate}
                          </div>
                          <div>
                            <strong style={{ color: "#666" }}>Paid Amount:</strong> {formatCurrency(installment.paidAmount)}
                          </div>
                          <div>
                            <strong style={{ color: "#666" }}>Paid Date:</strong> {installment.paidDate ? 
                              new Date(installment.paidDate).toLocaleDateString() : "Not Paid"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>

            {/* Class Schedule (Moved to Right Side & Row Wise) */}
            {studentData.classDateandTime && studentData.classDateandTime.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.8)",
                borderRadius: "24px",
                padding: "35px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)"
              }}>
                <SectionHeader
                  icon={FaCalendarAlt}
                  title="Class Schedule"
                  subtitle="Weekly class timings and schedule"
                  color={colors.warning}
                />
                
                {/* Updated Row-wise Enhanced UI */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  alignItems: "center"
                }}>
                  {studentData.classDateandTime.map((schedule, index) => {
                    const [day, time] = schedule.split('-');
                    return (
                      <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "linear-gradient(135deg, #ffffff 0%, #fffbf2 100%)",
                        padding: "12px 24px",
                        borderRadius: "14px",
                        border: "1px solid rgba(245,158,11,0.15)",
                        boxShadow: "0 4px 15px rgba(245,158,11,0.08)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        flex: "1 1 auto",
                        minWidth: "220px",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(245,158,11,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(245,158,11,0.08)";
                      }}
                      >
                        {/* Day Section */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "700",
                          color: "#1a1a1a",
                          fontSize: "1rem"
                        }}>
                          <div style={{
                            padding: "6px",
                            borderRadius: "8px",
                            background: "rgba(245,158,11,0.1)",
                            color: colors.warning,
                            display: "flex"
                          }}>
                            <FaCalendarDay size={14} />
                          </div>
                          {day}
                        </div>

                        {/* Vertical Separator */}
                        <div style={{
                          width: "1px",
                          height: "24px",
                          background: "rgba(0,0,0,0.1)",
                          margin: "0 4px"
                        }} />

                        {/* Time Section */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "600",
                          color: "#666",
                          fontSize: "0.95rem"
                        }}>
                          <FaClock size={14} color="#92400e" />
                          {time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Academic Information */}
            <div style={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)"
            }}>
              <SectionHeader
                icon={FaUniversity}
                title="Academic Information"
                subtitle="Educational background and institution details"
                color={colors.indigo}
              />
              
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <InfoItem
                  icon={FaUniversity}
                  label="College/School"
                  value={studentData.College}
                  color={colors.indigo}
                />
                <InfoItem
                  icon={FaBook}
                  label="Stream"
                  value={studentData.Stream}
                  color={colors.primary}
                />
                <InfoItem
                  icon={FaUsers}
                  label="Group"
                  value={studentData["Group "]}
                  color={colors.purple}
                />
                <InfoItem
                  icon={FaCalendarCheck}
                  label="Academic Year"
                  value={studentData.Year}
                  color={colors.success}
                />
        
              </div>
            </div>

            {/* Payment Information */}
            <div style={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)"
            }}>
              <SectionHeader
                icon={FaMoneyBillWave}
                title="Payment Information"
                subtitle="Fee details and payment status"
                color={colors.success}
              />
              
              <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "25px",
                  background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))",
                  borderRadius: "16px",
                  border: "2px solid rgba(16,185,129,0.2)"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      fontWeight: "600",
                      marginBottom: "6px"
                    }}>
                      Monthly Fee
                    </div>
                    <div style={{
                      fontSize: "1.8rem",
                      color: "#1a1a1a",
                      fontWeight: "800"
                    }}>
                      {formatCurrency(studentData["Monthly Fee"] || studentData.monthlyFee || 0)}
                    </div>
                  </div>
                  <StatusBadge 
                    status={studentData["Payment Status"] || "N/A"} 
                    type="payment"
                    icon={studentData["Payment Status"] === "Paid" ? FaCheckCircle : FaClock}
                  />
                </div>

                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))",
                  borderRadius: "16px",
                  border: "2px solid rgba(59,130,246,0.2)"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px"
                  }}>
                    <span style={{
                      fontSize: "0.95rem",
                      color: "#666",
                      fontWeight: "600"
                    }}>
                      Payment Progress
                    </span>
                    <span style={{
                      fontSize: "1.1rem",
                      color: "#1a1a1a",
                      fontWeight: "800"
                    }}>
                      {progressPercentage}%
                    </span>
                  </div>
                  <ProgressBar 
                    percentage={progressPercentage} 
                    color={progressPercentage === 100 ? colors.success : colors.warning}
                    height={14}
                  />
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px"
                }}>
                  <div style={{
                    padding: "20px",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))",
                    borderRadius: "16px",
                    border: "2px solid rgba(99,102,241,0.2)",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "600",
                      marginBottom: "8px"
                    }}>
                      Last Paid
                    </div>
                    <div style={{
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      fontWeight: "700"
                    }}>
                      {formatFirebaseDate(studentData.paidDate) || "N/A"}
                    </div>
                  </div>
                  <div style={{
                    padding: "20px",
                    background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))",
                    borderRadius: "16px",
                    border: "2px solid rgba(245,158,11,0.2)",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "600",
                      marginBottom: "8px"
                    }}>
                      Next Due
                    </div>
                    <div style={{
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      fontWeight: "700"
                    }}>
                      {formatFirebaseDate(studentData.nextDueDate) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default StudentProfile;