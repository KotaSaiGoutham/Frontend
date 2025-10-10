// src/redux/middleware/apiMiddleware.js

import { API_REQUEST, LOGOUT } from '../types';
import { setAuthError } from '../actions';

const BASE_API_URL = import.meta.env.VITE_API_URL;

const apiMiddleware = ({ dispatch, getState }) => next => async action => {
  if (action.type !== API_REQUEST) {
    return next(action);
  }

  const {
    url,
    method,
    data,
    params, // ADD THIS LINE - GET PARAMS FROM PAYLOAD
    onSuccess,
    onFailure,
    onStart,
    authRequired,
  } = action.payload;
  const { deferred } = action.meta;

  if (onStart) {
    dispatch({ type: onStart });
  }

  try {
    const state = getState();
    const token = localStorage.getItem("token") || state.auth.token;

    // BUILD URL WITH QUERY PARAMETERS
    let fullUrl = `${BASE_API_URL}${url}`;
    
    // ADD PARAMS HANDLING HERE
    if (params && Object.keys(params).length > 0) {
      const urlParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          urlParams.append(key, params[key]);
        }
      });
      
      const queryString = urlParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
      
      console.log("🔗 Built URL with params:", fullUrl); // Debug log
    }

    const config = {
      method: method,
    };

    if (authRequired && token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
      };
    } else if (authRequired && !token) {
      const error = { message: "Authentication required, but no token found.", status: 401 };
      dispatch(setAuthError(error.message));
      dispatch({
        type: onFailure || 'API_REQUEST_FAILURE',
        payload: { error: error.message },
      });
      deferred.reject(error);
      return;
    }

    // Handle FormData vs. JSON
    if (data) {
      if (data instanceof FormData) {
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
        if (!config.headers) {
          config.headers = {};
        }
        config.headers['Content-Type'] = 'application/json';
      }
    }

    // USE THE FULL URL WITH PARAMS
    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json(); 
      } catch (e) {
        errorData = { message: response.statusText, status: response.status }; 
      }

      console.error(`API Error (${response.status}) on ${method} ${url}:`, errorData);

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