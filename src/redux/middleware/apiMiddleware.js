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

    const headers = {
      'Content-Type': 'application/json',
    };

    if (authRequired && token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (authRequired && !token) {
      // If auth is required but no token, immediately dispatch auth error and reject
      const error = { message: "Authentication required, but no token found.", status: 401 };
      dispatch(setAuthError(error.message));
      dispatch({
        type: onFailure || 'API_REQUEST_FAILURE', // Use generic failure if specific not provided
        payload: { error: error.message },
      });
      deferred.reject(error); // Reject the promise immediately
      return; // Stop processing this action
    }

    const config = {
      method: method,
      headers: headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_API_URL}${url}`, config);

    // If the response is not OK
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json(); // Try to parse JSON error
      } catch (e) {
        errorData = { message: response.statusText, status: response.status }; // Fallback for non-JSON error
      }

      console.error(`API Error (${response.status}) on ${method} ${url}:`, errorData);

      // Handle specific authentication errors (e.g., 401 Unauthorized, 403 Forbidden)
      if (response.status === 401 || response.status === 403) {
        dispatch(setAuthError(errorData.message || "Session expired please login again"));
        dispatch({ type: LOGOUT }); // Dispatch logout to clear state and trigger redirect
        localStorage.removeItem("token"); // Also clear from local storage
      }

      if (onFailure) {
        if (typeof onFailure === 'string') {
          dispatch({
            type: onFailure,
            payload: { error: errorData.message || 'API request failed', status: response.status, rawError: errorData },
          });
        } else if (typeof onFailure === 'function') {
          onFailure({ error: errorData, status: response.status }, dispatch); // Pass error and dispatch to callback
        }
      }
      deferred.reject(errorData); // Reject the promise with error data
      return; // Stop further processing for this action
    }

    const responseData = await response.json();

    if (onSuccess) {
      if (typeof onSuccess === 'string') {
        dispatch({ type: onSuccess, payload: responseData });
      } else if (typeof onSuccess === 'function') {
        onSuccess(responseData, dispatch); // Pass data and dispatch to callback
      }
    }
    deferred.resolve(responseData); // Resolve the promise with data

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
    deferred.reject(error); // Reject the promise with the error
  }
};

export default apiMiddleware;