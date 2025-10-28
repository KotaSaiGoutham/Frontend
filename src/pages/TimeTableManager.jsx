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
        {/* Navigation Tabs */}
        <Paper style={navContainerStyle} elevation={0}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              minHeight: '48px',
              '& .MuiTab-root': {
                fontSize: '15px',
                fontWeight: '600',
                minHeight: '48px',
                py: 1.5,
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: colors.primary,
              }
            }}
          >
            <Tab 
              label="Weekly Timetable" 
              id="tab-0"
              sx={{
                borderRight: `1px solid ${colors.border}`,
              }}
            />
            <Tab 
              label="Time Table" 
              id="tab-1" 
            />
          </Tabs>
        </Paper>

        {/* Content Area - No extra padding */}
        <Paper style={contentContainerStyle} elevation={0}>
          <TabPanel value={activeTab} index={0}>
            <div style={{ padding: '16px' }}>
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
          
          <TabPanel value={activeTab} index={1}>
            <div style={{ padding: '16px' }}>
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
        </Paper>
      </Box>
    </Box>
  );
};

export default TimeTableManager;