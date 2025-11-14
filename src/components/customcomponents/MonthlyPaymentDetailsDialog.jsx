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
    dispatch(clearMonthlyPaymentDetails());
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
        alignItems: 'center',
        py: 2
      }}>
        <Box>
          <Typography variant="h6" component="div" fontSize="1.25rem">
            Payment Details - {formatMonthYear(selectedMonth)}
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 0.5 }} fontSize="0.9rem">
            Total: {formatAmount(totalAmount)} • {monthlyPaymentDetails.length} payments
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
          size="medium"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.3rem',
                    textAlign: 'center',
                    px: 1.5,
                    py: 1.5
                  }}
                >
                  Student Name
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.3rem',
                    textAlign: 'center',
                    px: 1.5,
                    py: 1.5
                  }}
                >
                  Stream
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.3rem',
                    textAlign: 'center',
                    px: 1.5,
                    py: 1.5
                  }}
                >
                  Year
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.3rem',
                    textAlign: 'center',
                    px: 1.5,
                    py: 1.5
                  }}
                >
                  Paid On
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.3rem',
                    textAlign: 'center',
                    px: 1.5,
                    py: 1.5
                  }}
                >
                  Amount
                </TableCell>
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
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      px: 1.5,
                      py: 1.25
                    }}
                  >
                    <Typography variant="body1" fontWeight="medium" fontSize="1.2rem">
                      {payment.studentName}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      px: 1.5,
                      py: 1.25
                    }}
                  >
                    <Typography variant="body1" fontSize="1.2rem">
                      {payment.stream}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      px: 1.5,
                      py: 1.25
                    }}
                  >
                    <Typography variant="body1" fontSize="1.2rem">
                      {payment.year}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      px: 1.5,
                      py: 1.25
                    }}
                  >
                    <Typography variant="body1" color="text.secondary" fontSize="1.2rem">
                      {formatDate(payment.paidOn)}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      px: 1.5,
                      py: 1.25
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold" color="success.main" fontSize="1.2rem">
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
  p: 2, 
  bgcolor: 'grey.50',
  borderTop: '1px solid',
  borderColor: 'divider'
}}>
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'flex-end', 
    width: '100%', 
    alignItems: 'center',
    gap: 2,
    pr: 4.5 // Adjust this value to align with the Amount column
  }}>
    <Typography variant="h6" color="primary.main" fontSize="1.1rem">
      Total Collection
    </Typography>
    <Typography variant="h5" fontWeight="bold" color="success.main" fontSize="1.3rem" sx={{ minWidth: '120px', textAlign: 'center' }}>
      {formatAmount(totalAmount)}
    </Typography>
  </Box>
</DialogActions>
    </Dialog>
  );
};

export default MonthlyPaymentDetailsDialog;