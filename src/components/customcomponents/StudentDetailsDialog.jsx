// src/components/customcomponents/StudentDetailsDialog.js
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TableSortLabel,
  CircularProgress,
  Chip,
  Tooltip,
  Skeleton
} from "@mui/material";
import { Close as CloseIcon, PersonOff as PersonOffIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { clearMonthlyStudentDetails } from "../../redux/actions";

const StudentDetailsDialog = () => {
  const dispatch = useDispatch();
  const { 
    monthlyStudentDetails, 
    selectedStudentMonth, 
    studentDetailsLoading,
    studentDetailsOpen 
  } = useSelector((state) => state.students);

  const [sortConfig, setSortConfig] = useState({
    key: "admissionDate",
    direction: "asc",
  });

  const handleClose = () => {
    dispatch(clearMonthlyStudentDetails());
    setSortConfig({ key: "admissionDate", direction: "asc" });
  };

  const formatMonthYear = (monthYear) => {
    if (!monthYear) return "";
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return "N/A";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone === "N/A") return "N/A";
    const cleaned = phone.toString().replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return phone;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = useMemo(() => {
    if (!monthlyStudentDetails) return [];

    let sortableItems = [...monthlyStudentDetails];

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "name") {
          const nameA = a.name ? a.name.toLowerCase() : "";
          const nameB = b.name ? b.name.toLowerCase() : "";
          if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "admissionDate") {
          const dateA = a.admissionDate?._seconds || 0;
          const dateB = b.admissionDate?._seconds || 0;
          if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "monthlyFee") {
          const feeA = a.monthlyFee || 0;
          const feeB = b.monthlyFee || 0;
          if (feeA < feeB) return sortConfig.direction === "asc" ? -1 : 1;
          if (feeA > feeB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "totalPaid") {
          const paidA = a.totalPaid || 0;
          const paidB = b.totalPaid || 0;
          if (paidA < paidB) return sortConfig.direction === "asc" ? -1 : 1;
          if (paidA > paidB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [monthlyStudentDetails, sortConfig]);

  if (!studentDetailsOpen) return null;

  const totalPaidAmount = monthlyStudentDetails?.reduce(
    (sum, student) => sum + (student.totalPaid || 0),
    0
  ) || 0;

  // Skeleton rows for loading state
  const skeletonRows = Array.from({ length: 8 }, (_, index) => (
    <TableRow key={index}>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={20} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "left", px: 0.5, py: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="text" width={120} height={25} />
          <Skeleton variant="rectangular" width={40} height={20} />
        </Box>
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: '12px' }} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={60} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={50} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={80} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={100} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={70} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={80} height={25} />
      </TableCell>
      <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
        <Skeleton variant="text" width={90} height={25} />
      </TableCell>
    </TableRow>
  ));

  return (
    <Dialog
      open={studentDetailsOpen}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontSize="1.25rem">
            Student Details - {formatMonthYear(selectedStudentMonth)}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ opacity: 0.9, mt: 0.5 }}
            fontSize="0.9rem"
          >
            Total: {studentDetailsLoading ? <Skeleton variant="text" width={30} sx={{ display: 'inline-block' }} /> : monthlyStudentDetails?.length || 0} students
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }} size="medium">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            maxHeight: '60vh',
            overflow: 'auto'
          }}
        >
          <Table sx={{ minWidth: 800 }} stickyHeader>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  textAlign: "center", 
                  px: 0.5, 
                  py: 1.5, 
                  width: "5%",
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'grey.50',
                  zIndex: 1
                }}>
                  Sl No
                </TableCell>

                <TableCell 
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: "1.2rem", 
                    textAlign: "left", 
                    px: 0.5, 
                    py: 1.5, 
                    cursor: "pointer", 
                    width: "auto", // Changed to auto for better spacing
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'grey.50',
                    zIndex: 1
                  }}
                  onClick={() => handleSort("name")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "name"}
                    direction={sortConfig.key === "name" ? sortConfig.direction : "asc"}
                  >
                    Student Name
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  textAlign: "center", 
                  px: 0.5, 
                  py: 1.5, 
                  width: "auto", // Changed to auto for better spacing
                  minWidth: "120px",
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'grey.50',
                  zIndex: 1
                }}>
                  Status
                </TableCell>

                <TableCell sx={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  textAlign: "center", 
                  px: 0.5, 
                  py: 1.5, 
                  width: "auto", // Adjusted for better spacing
                  minWidth: "80px",
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'grey.50',
                  zIndex: 1
                }}>
                  Stream
                </TableCell>

                <TableCell sx={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  textAlign: "center", 
                  px: 0.5, 
                  py: 1.5, 
                  width: "auto", // Adjusted for better spacing
                  minWidth: "80px",
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'grey.50',
                  zIndex: 1
                }}>
                  Year
                </TableCell>

                <TableCell sx={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  textAlign: "center", 
                  px: 0.5, 
                  py: 1.5, 
                  width: "auto", // Adjusted for better spacing
                  minWidth: "100px",
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'grey.50',
                  zIndex: 1
                }}>
                  College
                </TableCell>

                <TableCell sx={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  textAlign: "center", 
                  px: 0.5, 
                  py: 1.5, 
                  width: "auto", // Adjusted for better spacing
                  minWidth: "110px",
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'grey.50',
                  zIndex: 1
                }}>
                  Contact
                </TableCell>

                <TableCell 
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: "1.2rem", 
                    textAlign: "center", 
                    px: 0.5, 
                    py: 1.5, 
                    cursor: "pointer", 
                    width: "auto", // Adjusted for better spacing
                    minWidth: "110px",
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'grey.50',
                    zIndex: 1
                  }}
                  onClick={() => handleSort("admissionDate")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "admissionDate"}
                    direction={sortConfig.key === "admissionDate" ? sortConfig.direction : "asc"}
                  >
                    Admission Date
                  </TableSortLabel>
                </TableCell>

                <TableCell 
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: "1.2rem", 
                    textAlign: "center", 
                    px: 0.5, 
                    py: 1.5, 
                    cursor: "pointer", 
                    width: "auto", // Adjusted for better spacing
                    minWidth: "100px",
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'grey.50',
                    zIndex: 1
                  }}
                  onClick={() => handleSort("monthlyFee")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "monthlyFee"}
                    direction={sortConfig.key === "monthlyFee" ? sortConfig.direction : "asc"}
                  >
                    Monthly Fee
                  </TableSortLabel>
                </TableCell>

                <TableCell 
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: "1.2rem", 
                    textAlign: "center", 
                    px: 0.5, 
                    py: 1.5, 
                    cursor: "pointer", 
                    width: "auto", // Adjusted for better spacing
                    minWidth: "110px",
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'grey.50',
                    zIndex: 1
                  }}
                  onClick={() => handleSort("totalPaid")}
                >
                  <TableSortLabel
                    active={sortConfig.key === "totalPaid"}
                    direction={sortConfig.key === "totalPaid" ? sortConfig.direction : "asc"}
                  >
                    Total Paid
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetailsLoading ? (
                skeletonRows
              ) : (
                sortedStudents.map((student, index) => (
                  <TableRow
                    key={student.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontSize="1.1rem">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "left", px: 0.5, py: 1.25 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}> {/* Reduced gap */}
                        <Typography variant="body1" fontWeight="medium" fontSize="1.1rem">
                          {student.name}
                        </Typography>
                        {student.deactivated && (
                          <Tooltip 
                            title={`Student left on ${student.deactivatedAt ? formatDate(student.deactivatedAt) : 'N/A'}`}
                            placement="top"
                          >
                            <Chip
                              icon={<PersonOffIcon />}
                              label="Left"
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ 
                                height: '20px', 
                                fontSize: '0.6rem',
                                borderColor: '#f44336',
                                color: '#f44336',
                                '& .MuiChip-icon': { fontSize: '0.8rem' }
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      {student.deactivated ? (
                        <Tooltip 
                          title={`Left on ${student.deactivatedAt ? formatDate(student.deactivatedAt) : 'N/A'}`}
                          placement="top"
                        >
                          <Chip
                            label="Left"
                            size="small"
                            color="error"
                            variant="filled"
                            sx={{ 
                              height: '22px', 
                              fontSize: '0.65rem',
                              fontWeight: 'bold'
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ 
                            height: '22px', 
                            fontSize: '0.65rem',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontSize="1.1rem">
                        {student.stream}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontSize="1.1rem">
                        {student.year}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontSize="1.1rem">
                        {student.college}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontSize="1.1rem">
                        {formatPhoneNumber(student.contactNumber)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" color="text.secondary" fontSize="1.1rem">
                        {formatDate(student.admissionDate)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontWeight="bold" color="primary.main" fontSize="1.1rem">
                        {formatAmount(student.monthlyFee)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center", px: 0.5, py: 1.25 }}>
                      <Typography variant="body1" fontWeight="bold" color="success.main" fontSize="1.1rem">
                        {formatAmount(student.totalPaid)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" color="primary.main" fontSize="1.1rem">
              Total Paid Amount:
            </Typography>
            {studentDetailsLoading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                fontSize="1.3rem"
                sx={{ minWidth: "120px", textAlign: "center" }}
              >
                {formatAmount(totalPaidAmount)}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailsDialog;