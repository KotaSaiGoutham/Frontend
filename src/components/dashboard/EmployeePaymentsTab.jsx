import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Card
} from '@mui/material';
import {
  FaCalendarAlt,
  FaFileInvoice
} from 'react-icons/fa';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoPng from "/spaceship.png"; 

const EmployeePaymentsTab = ({
  payments,
  filteredPayments,
  employee,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage
}) => {
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- SINGLE INVOICE PDF ---
  const handleDownloadInvoice = (payment) => {
    // ... [KEEP THE SAME INVOICE LOGIC AS BEFORE] ...
    // (Pasting the full logic here would be redundant, but keep the exact 
    // handleDownloadInvoice function from the previous step)
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    
    // Draw Header
    try { doc.addImage(logoPng, "PNG", margin, 20, 100, 36); } catch (e) {}
    doc.setFontSize(9); doc.setTextColor(100);
    doc.text("Electron Academy", margin, 75);
    doc.text("KPHB, Hyderabad", margin, 88);
    doc.text("electronacademy.2019@gmail.com | +91 8341482438", margin, 101);
    doc.setFontSize(22); doc.setTextColor(26, 35, 126); 
    doc.text("PAYMENT INVOICE", pageWidth / 2, 50, { align: "center" });

    let y = 140;
    doc.setDrawColor(220); doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, pageWidth - (margin*2), 70, 5, 5, 'FD');
    doc.setFontSize(10); doc.setTextColor(80);
    doc.text("INVOICE DETAILS", margin + 20, y + 25);
    doc.text("BILL TO", pageWidth / 2 + 20, y + 25);
    doc.setFontSize(11); doc.setTextColor(0);
    doc.text(`Date: ${payment.paymentDate}`, margin + 20, y + 45);
    doc.text(`Transaction ID: #INV-${payment.id?.substring(0,6) || 'GEN'}`, margin + 20, y + 60);
    doc.text(`${employee?.name}`, pageWidth / 2 + 20, y + 45);
    doc.text(`Role: ${employee?.role}`, pageWidth / 2 + 20, y + 60);

    const monthStr = new Date(payment.year, payment.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    autoTable(doc, {
        startY: y + 90,
        head: [['Description', 'Amount']],
        body: [[`Salary Payment for ${monthStr}`, `Rs. ${payment.paidAmount?.toLocaleString()}`]],
        foot: [['Total Paid', `Rs. ${payment.paidAmount?.toLocaleString()}`]],
        theme: 'striped',
        margin: { left: margin, right: margin },
        headStyles: { fillColor: [26, 35, 126] },
        footStyles: { fillColor: [26, 35, 126], halign: 'right' },
        columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } }
    });
    doc.save(`Invoice_${monthStr}.pdf`);
  };

  return (
    <Box>
      {/* Note: Filters removed from here as they are now in Dashboard header */}
      
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>Month</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }} align="center">Payment Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }} align="right">Salary</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }} align="right">Paid Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }} align="center">Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }} align="center">Invoice</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment, index) => {
                  const isFullPayment = payment.salary === payment.paidAmount;
                  return (
                    <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#f1f5f9', color: '#64748b' }}><FaCalendarAlt size={14} /></Box>
                          <Typography variant="body2" fontWeight="600" color="#334155">
                            {new Date(payment.year, payment.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={payment.paymentDate} size="small" variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#64748b', fontWeight: 500 }} />
                      </TableCell>
                      <TableCell align="right"><Typography variant="body2" color="#64748b">₹{payment.salary?.toLocaleString()}</Typography></TableCell>
                      <TableCell align="center"><Typography variant="body2" fontWeight="700" color="#059669">₹{payment.paidAmount?.toLocaleString()}</Typography></TableCell>
                      <TableCell align="center">
                        <Chip label={isFullPayment ? "Full Payment" : "Partial"} size="small" sx={{ backgroundColor: isFullPayment ? '#dcfce7' : '#ffedd5', color: isFullPayment ? '#15803d' : '#c2410c', fontWeight: 700, borderRadius: '6px' }} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download Invoice">
                          <IconButton size="small" onClick={() => handleDownloadInvoice(payment)} sx={{ color: '#3b82f6', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}>
                            <FaFileInvoice size={14} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
               {filteredPayments.length === 0 && (
                 <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography color="textSecondary">No payment records found.</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPayments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #f1f5f9' }}
        />
      </Card>
    </Box>
  );
};

export default EmployeePaymentsTab;