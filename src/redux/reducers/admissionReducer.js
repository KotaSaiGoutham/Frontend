import {
  UPLOAD_STUDENT_DATA_REQUEST,
  UPLOAD_STUDENT_DATA_SUCCESS,
  UPLOAD_STUDENT_DATA_FAILURE,
  FETCH_UPLOAD_HISTORY_REQUEST,
  FETCH_UPLOAD_HISTORY_SUCCESS,
  FETCH_UPLOAD_HISTORY_FAILURE,
  DELETE_UPLOAD_REQUEST,
  DELETE_UPLOAD_SUCCESS,
  DELETE_UPLOAD_FAILURE,
  CREATE_LEAD_REQUEST,
  CREATE_LEAD_SUCCESS,
  CREATE_LEAD_FAILURE,
  FETCH_LEADS_REQUEST,
  FETCH_LEADS_SUCCESS,
  FETCH_LEADS_FAILURE,
  UPDATE_LEAD_STATUS_REQUEST,
  UPDATE_LEAD_STATUS_SUCCESS,
  UPDATE_LEAD_STATUS_FAILURE
} from '../types';

const initialState = {
  // Admission/Upload related state
  uploadHistory: [],
  uploading: false,
  uploadHistoryLoading: false,
  uploadError: null,
  
  // Lead management related state
  leads: [],
  leadsLoading: false,
  leadsError: null
};

export const admissionReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== UPLOAD STUDENT DATA ACTIONS ==========
    case UPLOAD_STUDENT_DATA_REQUEST:
      return { ...state, uploading: true, uploadError: null };
    
    case UPLOAD_STUDENT_DATA_SUCCESS:
      return { 
        ...state, 
        uploading: false,
        uploadHistory: [action.payload.uploadRecord, ...state.uploadHistory],
        uploadError: null
      };
    
    case UPLOAD_STUDENT_DATA_FAILURE:
      return { ...state, uploading: false, uploadError: action.payload.error };
    
    // ========== FETCH UPLOAD HISTORY ACTIONS ==========
    case FETCH_UPLOAD_HISTORY_REQUEST:
      return { ...state, uploadHistoryLoading: true, uploadError: null };
    
    case FETCH_UPLOAD_HISTORY_SUCCESS:
      return { ...state, uploadHistoryLoading: false, uploadHistory: action.payload };
    
    case FETCH_UPLOAD_HISTORY_FAILURE:
      return { ...state, uploadHistoryLoading: false, uploadError: action.payload.error };
    
    // ========== DELETE UPLOAD ACTIONS ==========
    case DELETE_UPLOAD_REQUEST:
      return { ...state, uploadHistoryLoading: true, uploadError: null };
    
    case DELETE_UPLOAD_SUCCESS:
      return {
        ...state,
        uploadHistoryLoading: false,
        uploadHistory: state.uploadHistory.filter(upload => upload.id !== action.payload),
        uploadError: null
      };
    
    case DELETE_UPLOAD_FAILURE:
      return { ...state, uploadHistoryLoading: false, uploadError: action.payload.error };
    
    // ========== CREATE LEAD ACTIONS ==========
    case CREATE_LEAD_REQUEST:
      return { ...state, leadsLoading: true, leadsError: null };
    
    case CREATE_LEAD_SUCCESS:
      return { 
        ...state, 
        leadsLoading: false,
        leads: [action.payload, ...state.leads],
        leadsError: null
      };
    
    case CREATE_LEAD_FAILURE:
      return { ...state, leadsLoading: false, leadsError: action.payload.error };
    
    // ========== FETCH LEADS ACTIONS ==========
    case FETCH_LEADS_REQUEST:
      return { ...state, leadsLoading: true, leadsError: null };
    
    case FETCH_LEADS_SUCCESS:
      return { ...state, leadsLoading: false, leads: action.payload };
    
    case FETCH_LEADS_FAILURE:
      return { ...state, leadsLoading: false, leadsError: action.payload.error };
    
    // ========== UPDATE LEAD STATUS ACTIONS ==========
    case UPDATE_LEAD_STATUS_REQUEST:
      return { ...state, leadsLoading: true, leadsError: null };
    
    case UPDATE_LEAD_STATUS_SUCCESS:
      return {
        ...state,
        leadsLoading: false,
        leads: state.leads.map(lead => 
          lead.id === action.payload.id ? action.payload : lead
        ),
        leadsError: null
      };
    
    case UPDATE_LEAD_STATUS_FAILURE:
      return { ...state, leadsLoading: false, leadsError: action.payload.error };
    
    default:
      return state;
  }
};