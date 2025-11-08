import React from "react";
import { Paper } from "@mui/material";

const DetailCard = ({ children, sx = {}, ...props }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        ...sx 
      }} 
      {...props}
    >
      {children}
    </Paper>
  );
};

export default DetailCard;