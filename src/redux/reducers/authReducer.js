// src/redux/reducers/authReducer.js

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_AUTH_ERROR,
  SET_USER_DATA, // NEW
   SIGNUP_REQUEST, // <-- NEW
  SIGNUP_SUCCESS, // <-- NEW
  SIGNUP_FAILURE, // <-- NEW
} from '../types';

// Try to get token and user info from localStorage on initial load
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const userEmail = localStorage.getItem('userEmail');

const initialState = {
  token: token || null,
  isAuthenticated: !!token, // True if token exists
  user: token ? { id: userId, email: userEmail } : null, // User object
  loading: false, // For login/logout requests
  error: null,    // For login/auth errors
  needsLoginRedirect: false, // Flag for components to react to auth state
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        needsLoginRedirect: false,
      };
    case LOGIN_SUCCESS:
      // When login is successful, middleware will already save to localStorage
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user, // Payload will contain {id, email}
        error: null,
        needsLoginRedirect: false,
      };
    case LOGIN_FAILURE:
      // Clear token and user on login failure
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        error: action.payload, // The error message
        needsLoginRedirect: false, // Keep false, component decides redirection based on error
      };
      case SIGNUP_SUCCESS: // <-- Handle signup success
      return {
        ...state,
        loading: false,
        error: null, // Clear any previous errors
        // Note: Signup success does NOT automatically authenticate the user.
        // They still need to log in.
      };
    case SIGNUP_FAILURE: // <-- Handle signup failure
      return {
        ...state,
        loading: false,
        error: action.payload, // Set the error message
      };
    case LOGOUT:
      // Clear token and user on logout action
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: null,
        loading: false,
        needsLoginRedirect: true, // Signal components to redirect
      };
 case SET_AUTH_ERROR:
  return {
    ...state,
    error: action.payload, // payload can be null to clear
    loading: false, // Ensure loading is false when clearing error too
  };
    case SET_USER_DATA: // New action to directly set user data (e.g. on app init if token exists)
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload && !!state.token, // Ensure token is also present
      };
    default:
      return state;
  }
};

export default authReducer;