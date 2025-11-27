import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import ClassSchedule from './WeekTimeTable';
import TimetablePage from '../components/TimetablePage';

// Enhanced Color definitions
const colors = {
  background: '#ecf0f1',
  cardBackground: '#ffffff',
  border: '#bdc3c7',
  primary: '#3498db',
  text: '#2c3e50',
};

const containerStyle = {
  padding: '5px',
};

const mainContainerStyle = {
  maxWidth: '1400px',
  margin: '0 auto'
};

const navContainerStyle = {
  background: colors.cardBackground,
  borderRadius: '12px 12px 0 0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  border: `1px solid ${colors.border}`,
  borderBottom: 'none',
  overflow: 'hidden'
};

const contentContainerStyle = {
  background: colors.cardBackground,
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  border: `1px solid ${colors.border}`,
  borderTop: 'none'
};

const TimeTableManager = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        style={{ display: value === index ? 'block' : 'none' }}
      >
        {children}
      </div>
    );
  };

  return (
    <Box style={containerStyle}>
      <Box style={mainContainerStyle}>
   <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
  <Tabs
    value={activeTab}
    onChange={handleTabChange}
    TabIndicatorProps={{ sx: { display: 'none' } }}
    sx={{
      border: `1px solid ${colors.border || '#ccc'}`,
      borderRadius: '8px',
      overflow: 'hidden', // Keeps the corners rounded
      minHeight: '40px',
      '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '14px',
        color: '#666',
        minHeight: '40px',
        px: 3,
        transition: 'all 0.2s',
        // Add a divider line between tabs
        '&:not(:last-of-type)': {
           borderRight: `1px solid ${colors.border || '#ccc'}`,
        },
        '&:hover': {
           bgcolor: '#f9f9f9',
        },
        // Active State
        '&.Mui-selected': {
          bgcolor: colors.primary, // Solid color background
          color: '#fff',
          fontWeight: 700,
        }
      }
    }}
  >
        <Tab label="Daily Time Table" />

    <Tab label="Weekly Timetable" />
  </Tabs>
</Box>

        {/* Content Area - No extra padding */}
        <Paper style={contentContainerStyle} elevation={0}>
         
          
          <TabPanel value={activeTab} index={0}>
            <div style={{ padding: '5px' }}>
              <div style={{ 
                textAlign: 'center', 
                color: colors.text 
              }}>
                <p style={{ margin: 0, color: '#7f8c8d' }}>
                  <TimetablePage/>
                </p>
              </div>
            </div>
          </TabPanel>
           <TabPanel value={activeTab} index={1}>
            <div style={{ padding: '5px' }}>
              <div style={{ 
                textAlign: 'center', 
                color: colors.text 
              }}>
                <p style={{ margin: 0, color: '#7f8c8d' }}>
                  <ClassSchedule/>
                </p>
              </div>
            </div>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default TimeTableManager;