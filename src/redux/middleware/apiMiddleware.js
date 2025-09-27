// src/redux/middleware/apiMiddleware.js

import { API_REQUEST, LOGOUT } from '../types';
import { setAuthError } from '../actions'; // Import setAuthError action

// Base URL for your API. Adjust if your backend is on a different domain/port.
const BASE_API_URL = import.meta.env.VITE_API_URL;


const apiMiddleware = ({ dispatch, getState }) => next => async action => {
  if (action.type !== API_REQUEST) {
    return next(action);
  }

  const {
    url,
    method,
    data,
    onSuccess,
    onFailure,
    onStart,
    authRequired,
  } = action.payload;
  const { deferred } = action.meta; // Access the deferred object

  if (onStart) {
    dispatch({ type: onStart });
  }

  try {
    const state = getState();
    const token = localStorage.getItem("token") || state.auth.token; // Get token from localStorage or Redux state

    const config = {
      method: method,
    };

    if (authRequired && token) {
      // Create headers object and set Authorization
      config.headers = {
        'Authorization': `Bearer ${token}`,
      };
    } else if (authRequired && !token) {
      // If auth is required but no token, immediately dispatch auth error and reject
      const error = { message: "Authentication required, but no token found.", status: 401 };
      dispatch(setAuthError(error.message));
      dispatch({
        type: onFailure || 'API_REQUEST_FAILURE',
        payload: { error: error.message },
      });
      deferred.reject(error);
      return;
    }

    // THIS IS THE CRITICAL CHANGE: Handle FormData vs. JSON
    if (data) {
      // Check if data is a FormData object (for file uploads)
      if (data instanceof FormData) {
        config.body = data;
        // Do NOT set the 'Content-Type' header. The browser will handle it.
      } else {
        // If it's not FormData, assume it's a JSON payload
        config.body = JSON.stringify(data);
        if (!config.headers) {
          config.headers = {};
        }
        config.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(`${BASE_API_URL}${url}`, config);

    // If the response is not OK
    if (!response.ok) {
      let errorData;
      try {
        // Attempt to parse JSON error message from the response
        errorData = await response.json(); 
      } catch (e) {
        // Fallback for non-JSON error responses
        errorData = { message: response.statusText, status: response.status }; 
      }

      console.error(`API Error (${response.status}) on ${method} ${url}:`, errorData);

      // Handle specific authentication errors (e.g., 401 Unauthorized, 403 Forbidden)
      if (response.status === 401 || response.status === 403) {
        dispatch(setAuthError(errorData.message || "Session expired please login again"));
        dispatch({ type: LOGOUT });
        localStorage.removeItem("token");
      }

      if (onFailure) {
        if (typeof onFailure === 'string') {
          dispatch({
            type: onFailure,
            payload: { error: errorData.message || 'API request failed', status: response.status, rawError: errorData },
          });
        } else if (typeof onFailure === 'function') {
          onFailure({ error: errorData, status: response.status }, dispatch);
        }
      }
      deferred.reject(errorData);
      return;
    }

    const responseData = await response.json();

    if (onSuccess) {
      if (typeof onSuccess === 'string') {
        dispatch({ type: onSuccess, payload: responseData });
      } else if (typeof onSuccess === 'function') {
        onSuccess(responseData, dispatch);
      }
    }
    deferred.resolve(responseData);

  } catch (error) {
    console.error(`Network or unexpected error on ${method} ${url}:`, error);
    const errorMessage = error.message || 'Network error or unexpected issue';

    if (onFailure) {
      if (typeof onFailure === 'string') {
        dispatch({ type: onFailure, payload: { error: errorMessage } });
      } else if (typeof onFailure === 'function') {
        onFailure({ error: { message: errorMessage } }, dispatch);
      }
    }
    deferred.reject(error);
  }
};

export default apiMiddleware;