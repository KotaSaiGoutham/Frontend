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
  Fade,
  TableFooter, 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Refresh, Payment } from '@mui/icons-material';
import { updateRevisionFee } from '../../redux/actions';
import { fetchStudents } from '../../redux/actions';

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
  fontSize: "1rem", // Increased font size
  borderRight: "1px solid #475569",
  padding: "16px 12px", // Increased padding
  textAlign: "center",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
  },
  "&:last-child": {
    borderTopRightRadius: "8px",
    borderRight: "none",
  },
}));

const FooterCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 700,
    fontSize: "1rem", // Increased font size
    backgroundColor: theme.palette.grey[100],
    borderTop: `2px solid ${theme.palette.grey[300]}`,
    textAlign: "center",
    padding: "16px 12px", // Increased padding
}));

const RevisionFeeManagement = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector(state => state.students);
  const { user } = useSelector(state => state.auth);
  const [updatingStudent, setUpdatingStudent] = useState(null);

  // Helper to calculate total paid for a single student
  const calculateStudentTotalPaid = (student) => {
    const fee = student.revisionProgramFee;
    if (!fee || !fee.installments) return 0;
    
    let total = 0;
    
    const inst1 = fee.installments.installment1;
    if (inst1?.status === 'paid') {
        total += inst1.paidAmount || inst1.amount || 0;
    }
    
    const inst2 = fee.installments.installment2;
    if (inst2?.status === 'paid') {
        total += inst2.paidAmount || inst2.amount || 0;
    }
    
    return total;
  };

  const { revisionStudents, totalFeeSum, totalPaidSum } = useMemo(() => {
    if (!students || students.length === 0) return { revisionStudents: [], totalFeeSum: 0, totalPaidSum: 0 };

    const allRevisionStudents = students.filter(
      (student) => student.isRevisionProgramJEEMains2026Student === true
    );

    const commonStudentNames = [
      "Gagan",
      "Amal",
            "Sriya Jee",
      "Sriya.JEE",
      "Ananya",
    ];

    const physicsOnlyNames = ["Nithya", "Navya"];

    let calculatedTotalPaidSum = 0;
    const FULL_FEE = 70000;

    let filteredStudents = allRevisionStudents.filter((student) => {
      const studentName = student.Name || student.studentName || "";

      let includeStudent = false;

      if (user?.isPhysics) {
        includeStudent = commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        ) || physicsOnlyNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );
      } else if (user?.isChemistry) {
        includeStudent = commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );
      } else if (user?.AllowAll) {
        includeStudent = true;
      }
      
      return includeStudent;
    });

    const mappedStudents = filteredStudents
      .map((student) => {
        const studentName = student.Name || student.studentName || "";
        let normalizedName = studentName;

        if (studentName.toLowerCase().includes("sriya")) {
          normalizedName = "Sriya JEE";
        }

        const isCommonStudent = commonStudentNames.some((name) =>
          studentName.toLowerCase().includes(name.toLowerCase())
        );

        const studentTotalPaid = calculateStudentTotalPaid(student);
        calculatedTotalPaidSum += studentTotalPaid;

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
          totalPaid: studentTotalPaid,
        };
      })
      .sort((a, b) => {
        const nameOrder = {
          gagan: 1,
          amal: 2,
          sriya: 3,
          ananya: 4,
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

    const calculatedTotalFeeSum = mappedStudents.length * FULL_FEE;

    return {
      revisionStudents: mappedStudents,
      totalFeeSum: calculatedTotalFeeSum,
      totalPaidSum: calculatedTotalPaidSum,
    };
  }, [students, user]);

  const handleInstallmentToggle = async (studentId, installment, currentStatus) => {
    setUpdatingStudent(studentId);
    
    // Find the student object from the original students array
    const studentToUpdate = students.find(s => s.id === studentId);
    if (!studentToUpdate) {
        setUpdatingStudent(null);
        return;
    }
    
    const currentInstallments = studentToUpdate.revisionProgramFee?.installments || {};
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    const amount = 35000;

    // Create the update data in the format your backend expects
    const updateData = {
        [installment]: {
            status: newStatus,
            ...(newStatus === 'paid' ? { 
                paidDate: new Date().toISOString(),
                paidAmount: amount 
            } : {
                paidDate: null,
                paidAmount: 0
            })
        }
    };

    try {
      console.log('Sending update data:', updateData);
      await dispatch(updateRevisionFee(studentId, updateData));
      
      // Refresh after a short delay to ensure update is processed
      setTimeout(() => {
        dispatch(fetchStudents());
      }, 1000);
      
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

  const getStatusChip = (status) => {
    return status === 'paid' 
      ? <Chip label="Paid" color="success" size="medium" sx={{ fontSize: '0.9rem' }} /> // Increased chip size
      : <Chip label="Unpaid" color="error" size="medium" variant="outlined" sx={{ fontSize: '0.9rem' }} />;
  };

  const getInstallmentStatus = (student, installment) => {
    if (!student.revisionProgramFee || !student.revisionProgramFee.installments) {
      return 'unpaid';
    }
    return student.revisionProgramFee.installments[installment]?.status || 'unpaid';
  };

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Get day, month, year with leading zeros
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} /> {/* Increased spinner size */}
      </Box>
    );
  }

  const percentagePaid = totalFeeSum > 0 
    ? ((totalPaidSum / totalFeeSum) * 100).toFixed(1) 
    : 0;

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
  
        <Box sx={{ mb: 3 }}>
          <Card variant="outlined" sx={{ bgcolor: '#f0f9ff', borderColor: '#bae6fd' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0c4a6e" }} gutterBottom> {/* Increased font size */}
                Overall Financial Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1.1rem' }}> {/* Increased font size */}
                    Total Fee Due
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}> {/* Increased font size */}
                    ₹{totalFeeSum.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1.1rem' }}> {/* Increased font size */}
                    Total Amount Paid
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: totalPaidSum === totalFeeSum ? '#10b981' : totalPaidSum > 0 ? '#f59e0b' : '#ef4444' }}> {/* Increased font size */}
                    ₹{totalPaidSum.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1.1rem' }}> {/* Increased font size */}
                    Payment Completion
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: totalPaidSum === totalFeeSum ? '#10b981' : '#3b82f6' }}> {/* Increased font size */}
                    {percentagePaid}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, fontSize: '1rem' }}> {/* Increased font size */}
            {error}
          </Alert>
        )}

        <StyledPaper>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}> {/* Increased font size */}
                Revision Students Fee Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ color: "#64748b", fontSize: '1.1rem' }}> {/* Increased font size */}
                  Total Students: {revisionStudents.length}
                </Typography>
                <Tooltip title="Refresh Data">
                  <IconButton onClick={handleRefresh} size="large"> {/* Increased icon size */}
                    <Refresh fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell sx={{ width: '80px' }}>S.No.</HeaderCell> {/* Added Serial Number column */}
                    <HeaderCell sx={{ width: '200px' }}>Student Name</HeaderCell>
                    <HeaderCell sx={{ width: '150px' }}>Installment 1</HeaderCell>
                    <HeaderCell sx={{ width: '150px' }}>Installment 2</HeaderCell>
                    <HeaderCell sx={{ width: '200px' }}>Total Fees Paid/Total Fees</HeaderCell> {/* New column */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revisionStudents.map((student, index) => {
                    const totalPaid = student.totalPaid;
                    const installment1Status = getInstallmentStatus(student, 'installment1');
                    const installment2Status = getInstallmentStatus(student, 'installment2');
                    
                    return (
                      <TableRow key={student.id} hover>
                        {/* Serial Number */}
                        <TableCell>
                          <Typography variant="h6" sx={{ fontWeight: 600, textAlign:'center', fontSize: '1.1rem' }}> {/* Increased font size */}
                            {index + 1}
                          </Typography>
                        </TableCell>
                        
                        {/* Student Name */}
                        <TableCell>
                          <Typography variant="h6" sx={{ fontWeight: 600, textAlign:'center', fontSize: '1.1rem' }}> {/* Increased font size */}
                            {student.studentName}
                          </Typography>
                        </TableCell>
                        
                        {/* Installment 1 */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {getStatusChip(installment1Status)}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 600 }}> {/* Increased font size */}
                                ₹35,000
                              </Typography>
                              <Switch
                                size="medium" // Increased switch size
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
                              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}> {/* Increased font size */}
                                Paid: {formatDateDDMMYYYY(student.revisionProgramFee.installments.installment1.paidDate)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        
                        {/* Installment 2 */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {getStatusChip(installment2Status)}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 600 }}> {/* Increased font size */}
                                ₹35,000
                              </Typography>
                              <Switch
                                size="medium" // Increased switch size
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
                              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}> {/* Increased font size */}
                                Paid: {formatDateDDMMYYYY(student.revisionProgramFee.installments.installment2.paidDate)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        {/* Total Fees Paid/Total Fees */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                fontSize: '1.2rem', // Increased font size
                                color: totalPaid === 70000 ? '#10b981' : totalPaid > 0 ? '#f59e0b' : '#ef4444'
                              }}
                            >
                              ₹{totalPaid.toLocaleString()} / ₹70,000
                            </Typography>
                            <Chip 
                              label={`${((totalPaid / 70000) * 100).toFixed(1)}% Paid`}
                              color={totalPaid === 70000 ? 'success' : totalPaid > 0 ? 'warning' : 'error'}
                              size="medium"
                              sx={{ fontSize: '0.9rem', fontWeight: 600 }} // Increased font size
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <FooterCell>Total ({revisionStudents.length} Students)</FooterCell>
                        <FooterCell>-</FooterCell>
                        <FooterCell>-</FooterCell>
                        <FooterCell>-</FooterCell>
                        <FooterCell>
                            <Box>
                                <Typography 
                                    variant="h6"
                                    sx={{ 
                                        fontWeight: 700,
                                        fontSize: '1.2rem', // Increased font size
                                        color: totalPaidSum === totalFeeSum ? '#10b981' : totalPaidSum > 0 ? '#f59e0b' : '#ef4444'
                                    }}
                                >
                                    ₹{totalPaidSum.toLocaleString()} / ₹{totalFeeSum.toLocaleString()}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1rem' }}> {/* Increased font size */}
                                    ({percentagePaid}% Paid Overall)
                                </Typography>
                            </Box>
                        </FooterCell>
                    </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>

            {revisionStudents.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1.2rem' }}> {/* Increased font size */}
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