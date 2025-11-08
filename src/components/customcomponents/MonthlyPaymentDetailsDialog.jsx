import React from "react";
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
  Chip
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { clearMonthlyPaymentDetails } from "../../redux/actions";
const MonthlyPaymentDetailsDialog = () => {
  const dispatch = useDispatch();
  const { monthlyPaymentDetails, selectedMonth, paymentDetailsLoading } = useSelector(
    state => state.expenditures
  );
const handleClose = () => {
    dispatch(clearMonthlyPaymentDetails()); // This will clear the data and close the dialog
  };
  const formatMonthYear = (monthYear) => {
    if (!monthYear) return '';
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!monthlyPaymentDetails) return null;

  const totalAmount = monthlyPaymentDetails.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <Dialog
      open={!!monthlyPaymentDetails}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" component="div">
            Payment Details - {formatMonthYear(selectedMonth)}
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Total: {formatAmount(totalAmount)} • {monthlyPaymentDetails.length} payments
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Stream</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Year</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Paid On</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'right' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyPaymentDetails.map((payment, index) => (
                <TableRow 
                  key={payment.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {payment.studentName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.stream}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.year}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.source} 
                      size="small" 
                      color="secondary" 
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(payment.paidOn)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      {formatAmount(payment.amount)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="h6" color="primary.main">
            Total Collection
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            {formatAmount(totalAmount)}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MonthlyPaymentDetailsDialog;