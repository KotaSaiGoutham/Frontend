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

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleClose}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </MuiAlert>
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