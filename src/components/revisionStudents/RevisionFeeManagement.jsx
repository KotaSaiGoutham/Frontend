import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Refresh, Payment } from '@mui/icons-material';
import { updateRevisionFee } from '../../redux/actions';
import { fetchStudents } from '../../redux/actions'; // Import your existing fetchStudents

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.8rem",
  borderRight: "1px solid #475569",
  padding: "12px 8px",
  textAlign: "center",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
  },
  "&:last-child": {
    borderTopRightRadius: "8px",
    borderRight: "none",
  },
}));

const RevisionFeeManagement = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector(state => state.students);
  const { user } = useSelector(state => state.auth);
  const [updatingStudent, setUpdatingStudent] = useState(null);

  const revisionStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    // Get all revision students from both subjects
    const allRevisionStudents = students.filter(
      (student) => student.isRevisionProgramJEEMains2026Student === true
    );

    // Common student names (these students take both Physics and Chemistry)
    const commonStudentNames = [
      "Gagan",
      "Amal",
      "Ananya",
      "Sriya Jee",
      "Sriya.JEE",
    ];

    // Physics-only student names
    const physicsOnlyNames = ["Nithya", "Navya"];

    // Filter students based on user role
    let filteredStudents = allRevisionStudents.filter((student) => {
      const studentName = student.Name || student.studentName || "";

      if (user?.isPhysics) {
        // Physics users see common students + physics-only students
        return (
          commonStudentNames.some((name) =>
            studentName.toLowerCase().includes(name.toLowerCase())
          ) ||
          physicsOnlyNames.some((name) =>
            studentName.toLowerCase().includes(name.toLowerCase())
          )
        );
      } else if (user?.isChemistry) {
        // Chemistry users only see common students
        return commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );
      } else if (user?.AllowAll) {
        // AllowAll users see all revision students
        return true;
      }
      return false;
    });

    // Map and sort students with consistent naming
    return filteredStudents
      .map((student) => {
        const studentName = student.Name || student.studentName || "";
        let normalizedName = studentName;

        // Normalize names for consistent display
        if (studentName.toLowerCase().includes("sriya")) {
          normalizedName = "Sriya JEE";
        }

        const isCommonStudent = commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );

        return {
          ...student,
          studentName: normalizedName,
          originalName: studentName,
          initials: normalizedName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          isCommonStudent: isCommonStudent,
        };
      })
      .sort((a, b) => {
        // Sort by name order
        const nameOrder = {
          gagan: 1,
          amal: 2,
          ananya: 3,
          sriya: 4,
          nithya: 5,
          navya: 6,
        };

        const aName = a.studentName.toLowerCase();
        const bName = b.studentName.toLowerCase();

        const aOrder = Object.keys(nameOrder).find((key) => aName.includes(key))
          ? nameOrder[Object.keys(nameOrder).find((key) => aName.includes(key))]
          : 999;
        const bOrder = Object.keys(nameOrder).find((key) => bName.includes(key))
          ? nameOrder[Object.keys(nameOrder).find((key) => bName.includes(key))]
          : 999;

        return aOrder - bOrder;
      });
  }, [students, user]);

  const handleInstallmentToggle = async (studentId, installment, currentStatus) => {
    setUpdatingStudent(studentId);
    
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    const updateData = {
      [installment]: {
        status: newStatus,
        ...(newStatus === 'paid' && { 
          paidDate: new Date().toISOString(),
          paidAmount: 35000
        })
      }
    };

    try {
      // Update the fee
      await dispatch(updateRevisionFee(studentId, updateData));
      
      // Refresh students data to get the updated state
      await dispatch(fetchStudents());
      
    } catch (error) {
      console.error('Error updating installment:', error);
    } finally {
      setUpdatingStudent(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchStudents());
  };

  const getPaymentInfo = (student) => {
    const subject = student.Subject?.toLowerCase();
    
    if (subject === 'physics') {
      return { 
        upiId: '8688119362', 
        name: 'Dulam Vamshi Krishna', 
        account: 'Electron Educational Services' 
      };
    } else {
      return { 
        upiId: '8019603679', 
        name: 'Bollam Karunakar Reddy', 
        account: 'Electron Educational Academy' 
      };
    }
  };

  const calculateTotalPaid = (student) => {
    const fee = student.revisionProgramFee;
    if (!fee || !fee.installments) return 0;
    
    let total = 0;
    if (fee.installments.installment1?.status === 'paid') total += 35000;
    if (fee.installments.installment2?.status === 'paid') total += 35000;
    
    return total;
  };

  const getStatusChip = (status) => {
    return status === 'paid' 
      ? <Chip label="Paid" color="success" size="small" />
      : <Chip label="Unpaid" color="error" size="small" variant="outlined" />;
  };

  const getInstallmentStatus = (student, installment) => {
    if (!student.revisionProgramFee || !student.revisionProgramFee.installments) {
      return 'unpaid';
    }
    return student.revisionProgramFee.installments[installment]?.status || 'unpaid';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
  

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}


        {/* Students Table */}
        <StyledPaper>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Revision Students Fee Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Total Students: {revisionStudents.length}
                </Typography>
                <Tooltip title="Refresh Data">
                  <IconButton onClick={handleRefresh} size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>Student Name</HeaderCell>
                    <HeaderCell>Total Fee</HeaderCell>
                    <HeaderCell>Total Paid</HeaderCell>
                    <HeaderCell>Installment 1</HeaderCell>
                    <HeaderCell>Installment 2</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revisionStudents.map((student) => {
                    const totalPaid = calculateTotalPaid(student);
                    const paymentInfo = getPaymentInfo(student);
                    const installment1Status = getInstallmentStatus(student, 'installment1');
                    const installment2Status = getInstallmentStatus(student, 'installment2');
                    
                    return (
                      <TableRow key={student.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600,textAlign:'center' }}>
                            {student.studentName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600,textAlign:'center' }}>
                            ₹70,000
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              textAlign:'center',
                              color: totalPaid === 70000 ? '#10b981' : totalPaid > 0 ? '#f59e0b' : '#ef4444'
                            }}
                          >
                            ₹{totalPaid.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        {/* Installment 1 */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {getStatusChip(installment1Status)}
                            <Switch
                              size="small"
                              checked={installment1Status === 'paid'}
                              onChange={() => handleInstallmentToggle(
                                student.id, 
                                'installment1', 
                                installment1Status
                              )}
                              disabled={updatingStudent === student.id}
                            />
                          </Box>
                          {student.revisionProgramFee?.installments?.installment1?.paidDate && (
                           <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
  Paid: {formatDateDDMMYYYY(student.revisionProgramFee.installments.installment1.paidDate)}
</Typography>
                          )}
                        </TableCell>
                        
                        {/* Installment 2 */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {getStatusChip(installment2Status)}
                            <Switch
                              size="small"
                              checked={installment2Status === 'paid'}
                              onChange={() => handleInstallmentToggle(
                                student.id, 
                                'installment2', 
                                installment2Status
                              )}
                              disabled={updatingStudent === student.id}
                            />
                          </Box>
                          {student.revisionProgramFee?.installments?.installment2?.paidDate && (
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                              Paid: {new Date(student.revisionProgramFee.installments.installment2.paidDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {revisionStudents.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No revision program students found
                </Typography>
              </Box>
            )}
          </Box>
        </StyledPaper>
      </Box>
    </Fade>
  );
};

export default RevisionFeeManagement;

// Date formatting helper function
const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Get day, month, year with leading zeros
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};