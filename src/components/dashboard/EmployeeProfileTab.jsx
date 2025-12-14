import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  FaBuilding,
  FaCalendarAlt,
  FaFingerprint,
  FaHourglassHalf,
  FaLayerGroup
} from 'react-icons/fa';
import { formatEmployeeDate } from '../../mockdata/function'; 

const EmployeeProfileTab = ({ employee }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
        Employment Details
      </Typography>

      <Grid>
        {/* Employment Timeline Section */}
        <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <FaCalendarAlt color="#1a237e" />
                    <Typography variant="subtitle1" fontWeight="bold">Timeline & Activity</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Joining Date</Typography>
                        <Typography variant="body1" fontWeight="600">
                             {formatEmployeeDate(employee.createdAt)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Last Reset</Typography>
                        <Typography variant="body1" fontWeight="600">
                            1st of next month
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>

        {/* Expense Classification Section */}
        <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <FaBuilding color="#1a237e" />
                    <Typography variant="subtitle1" fontWeight="bold">Department & Expenses</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">Physics Department</Typography>
                        <Chip 
                            label={employee.isPhysics ? "Yes" : "No"} 
                            size="small" 
                            color={employee.isPhysics ? "warning" : "default"} 
                            variant={employee.isPhysics ? "filled" : "outlined"}
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">Company Expense</Typography>
                        <Chip 
                            label={employee.isCompanyExpenditure ? "Yes" : "No"} 
                            size="small" 
                            color={employee.isCompanyExpenditure ? "success" : "default"}
                            variant={employee.isCompanyExpenditure ? "filled" : "outlined"}
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">Employee Expense</Typography>
                        <Chip 
                            label={employee.isEmployeeExpenditure ? "Yes" : "No"} 
                            size="small" 
                            color={employee.isEmployeeExpenditure ? "info" : "default"}
                            variant={employee.isEmployeeExpenditure ? "filled" : "outlined"}
                        />
                    </Box>
                </Box>
            </Paper>
        </Grid>

        {/* System Details */}
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                         <Box display="flex" alignItems="center" gap={1.5}>
                            <FaFingerprint color="#757575" />
                            <Box>
                                <Typography variant="caption" color="textSecondary">System ID</Typography>
                                <Typography variant="body2" fontFamily="monospace">{employee.id}</Typography>
                            </Box>
                         </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                         <Box display="flex" alignItems="center" gap={1.5}>
                            <FaLayerGroup color="#757575" />
                            <Box>
                                <Typography variant="caption" color="textSecondary">Payment Cycle</Typography>
                                <Typography variant="body2">Monthly Recurring</Typography>
                            </Box>
                         </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                         <Box display="flex" alignItems="center" gap={1.5}>
                            <FaHourglassHalf color="#757575" />
                            <Box>
                                <Typography variant="caption" color="textSecondary">Account Age</Typography>
                                <Typography variant="body2">2 Years, 3 Months</Typography>
                            </Box>
                         </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeProfileTab;