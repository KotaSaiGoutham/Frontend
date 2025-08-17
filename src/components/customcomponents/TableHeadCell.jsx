import React from 'react';
import { TableCell, Box } from '@mui/material';

const TableHeadCell = ({ icon, children }) => {
  return (
    <TableCell
      align="center"
      sx={{
        fontWeight: "bold",
        color: "#1a237e",
        fontSize: "1.05rem",
        padding: "12px 8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Conditionally render the icon if it exists */}
        {icon && React.cloneElement(icon, { style: { marginRight: 8, color: "#1976d2" } })}
        {children}
      </Box>
    </TableCell>
  );
};

export default TableHeadCell;