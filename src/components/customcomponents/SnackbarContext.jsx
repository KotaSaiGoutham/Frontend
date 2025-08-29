import React, { createContext, useState, useContext, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarState({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState((prevState) => ({ ...prevState, open: false }));
  }, []);

  // Your custom Alert component with dynamic styling
  const Alert = React.forwardRef(function Alert(props, ref) {
    // Determine background and text color based on severity and message content
    const getBackgroundColor = () => {
      if (props.severity === 'success') {
        return props.children.includes('Inactive') ? '#d32f2f' : '#2e7d32';
      }
      return undefined; // Default background for other severities
    };

    const getTextColor = () => {
      if (props.severity === 'success') {
        return props.children.includes('Inactive') ? 'black' : 'white';
      }
      return undefined; // Default color for other severities
    };

    return (
      <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        sx={{
          width: '100%',
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
        }}
        {...props}
      />
    );
  });

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};