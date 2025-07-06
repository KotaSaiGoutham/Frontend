// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif',
      // You can keep 'Roboto', 'Helvetica', 'Arial' here as fallbacks if you want
      // but 'sans-serif' generally covers most common sans-serif fonts.
    ].join(','),
    // You can also customize specific typography variants if needed:
    // h1: {
    //   fontSize: '2.5rem',
    //   fontWeight: 600,
    // },
    // body1: {
    //   fontSize: '1rem',
    // },
  },
  // You can add other theme customizations here (palette, components, etc.)
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
     success: {
      main: '#4CAF50', // Green color for success
    },
    error: {
      main: '#F44336', // Red color for error
    },
  },
});

export default theme;