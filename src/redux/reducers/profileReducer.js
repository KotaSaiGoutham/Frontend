// src/redux/reducers/profileReducer.js
import {
  GET_PROFILE_ICON_REQUEST,
  GET_PROFILE_ICON_SUCCESS,
  GET_PROFILE_ICON_FAILURE,
  UPLOAD_ICON_REQUEST,
  UPLOAD_ICON_SUCCESS,
  UPLOAD_ICON_FAILURE
} from '../types';

const initialState = {
  photoUrl: null,    
  isLoading: false, 
  isUploading: false,
  error: null
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- FETCHING LOGIC ---
    case GET_PROFILE_ICON_REQUEST:
      return { ...state, isLoading: true, error: null };
    case GET_PROFILE_ICON_SUCCESS:
      return {
        ...state,
        isLoading: false,
        photoUrl: action.payload.photoUrl,
        error: null
      };
    case GET_PROFILE_ICON_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    // --- UPLOADING LOGIC ---
    case UPLOAD_ICON_REQUEST:
      return { ...state, isUploading: true, error: null };
    case UPLOAD_ICON_SUCCESS:
      return {
        ...state,
        isUploading: false,
        // Optimistic update
        photoUrl: action.payload.photoUrl, 
        error: null
      };
    case UPLOAD_ICON_FAILURE:
      return { ...state, isUploading: false, error: action.payload };

    default:
      return state;
  }
};

export default profileReducer;