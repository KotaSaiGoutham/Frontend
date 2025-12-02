import React from 'react';
import { Paper, Box, Typography, Tooltip, IconButton } from '@mui/material';
import { FaRupeeSign, FaInfoCircle } from 'react-icons/fa';

const MetricCard = ({ 
  label, 
  value, 
  gradient, 
  icon, 
  percentage, 
  previousValue,
  textColor,
  compact = false 
}) => {
  const formatValue = (val) => {
    if (typeof val !== 'number') return '0';
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getPercentageColor = (percentage) => {
    if (percentage > 0) return '#2e7d32'; // Green for increase
    if (percentage < 0) return '#d32f2f'; // Red for decrease
    return '#757575'; // Gray for no change
  };

  const getPercentageIcon = (percentage) => {
    if (percentage > 0) return '↗';
    if (percentage < 0) return '↘';
    return '→';
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return null;
    return `${Math.abs(percentage).toFixed(1)}%`;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: compact ? 2 : 3,
        borderRadius: 2,
        background: gradient,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ mr: 1, color: textColor || 'inherit' }}>
          {icon || <FaRupeeSign />}
        </Box>
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
          {label}
        </Typography>
      </Box>
      
      <Typography
        variant={compact ? "h5" : "h4"}
        fontWeight="bold"
        color={textColor || 'text.primary'}
        sx={{ mb: 0.5 }}
      >
        ₹{formatValue(value)}
      </Typography>
      
      {percentage !== null && percentage !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: getPercentageColor(percentage) + '15',
              color: getPercentageColor(percentage),
              fontSize: compact ? '0.7rem' : '0.8rem',
              fontWeight: 500,
            }}
          >
            <span style={{ marginRight: 2 }}>{getPercentageIcon(percentage)}</span>
            {formatPercentage(percentage)}
            <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.7 }}>
              vs prev month
            </Typography>
          </Box>
          
        </Box>
      )}
    </Paper>
  );
};

export default MetricCard;