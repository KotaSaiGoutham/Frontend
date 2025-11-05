import {
  FETCH_LECTURE_MATERIALS_REQUEST,
  FETCH_LECTURE_MATERIALS_SUCCESS,
  FETCH_LECTURE_MATERIALS_FAILURE,
  UPLOAD_LECTURE_MATERIAL_REQUEST,
  UPLOAD_LECTURE_MATERIAL_SUCCESS,
  UPLOAD_LECTURE_MATERIAL_FAILURE,
  DELETE_LECTURE_MATERIAL_REQUEST,
  DELETE_LECTURE_MATERIAL_SUCCESS,
  DELETE_LECTURE_MATERIAL_FAILURE,
  FETCH_STUDENT_PPTS_REQUEST,
  FETCH_STUDENT_PPTS_SUCCESS,
  FETCH_STUDENT_PPTS_FAILURE,
  FETCH_STUDENT_WORKSHEETS_REQUEST,
  FETCH_STUDENT_WORKSHEETS_SUCCESS,
  FETCH_STUDENT_WORKSHEETS_FAILURE,
} from "../types";

const initialLectureMaterialsState = {
  materials: [],
  ppts: [], // Student-specific PPTs
  worksheets: [], // Student-specific worksheets
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
};

export const lectureMaterialsReducer = (
  state = initialLectureMaterialsState,
  action
) => {
  switch (action.type) {
    // Lecture Materials Cases
    case FETCH_LECTURE_MATERIALS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_LECTURE_MATERIALS_SUCCESS:
      return { ...state, loading: false, materials: action.payload, error: null };

    case FETCH_LECTURE_MATERIALS_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    case UPLOAD_LECTURE_MATERIAL_REQUEST:
      return { ...state, uploading: true, error: null };

    case UPLOAD_LECTURE_MATERIAL_SUCCESS:
      return {
        ...state,
        uploading: false,
        error: null,
        materials: [...state.materials, action.payload],
      };

    case UPLOAD_LECTURE_MATERIAL_FAILURE:
      return { ...state, uploading: false, error: action.payload.error };

    case DELETE_LECTURE_MATERIAL_REQUEST:
      return { ...state, deleting: true, error: null };

    case DELETE_LECTURE_MATERIAL_SUCCESS:
      return {
        ...state,
        deleting: false,
        error: null,
        materials: state.materials.filter((m) => m.id !== action.payload),
      };

    case DELETE_LECTURE_MATERIAL_FAILURE:
      return { ...state, deleting: false, error: action.payload.error };

    // Student PPTs Cases
    case FETCH_STUDENT_PPTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_STUDENT_PPTS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        ppts: action.payload, 
        error: null 
      };

    case FETCH_STUDENT_PPTS_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error 
      };

    // Student Worksheets Cases
    case FETCH_STUDENT_WORKSHEETS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_STUDENT_WORKSHEETS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        worksheets: action.payload, 
        error: null 
      };

    case FETCH_STUDENT_WORKSHEETS_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error 
      };

    default:
      return state;
  }
};