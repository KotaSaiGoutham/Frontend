import {
  FETCH_IMPORTANT_FILES_REQUEST,
  FETCH_IMPORTANT_FILES_SUCCESS,
  FETCH_IMPORTANT_FILES_FAILURE,
  UPLOAD_IMPORTANT_FILE_REQUEST,
  UPLOAD_IMPORTANT_FILE_SUCCESS,
  UPLOAD_IMPORTANT_FILE_FAILURE,
  DELETE_IMPORTANT_FILE_SUCCESS,
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
  // Study Materials and Question Papers Actions
  UPLOAD_STUDY_MATERIAL_REQUEST,
  UPLOAD_STUDY_MATERIAL_SUCCESS,
  UPLOAD_STUDY_MATERIAL_FAILURE,
  UPLOAD_QUESTION_PAPER_REQUEST,
  UPLOAD_QUESTION_PAPER_SUCCESS,
  UPLOAD_QUESTION_PAPER_FAILURE,
  FETCH_STUDY_MATERIALS_REQUEST,
  FETCH_STUDY_MATERIALS_SUCCESS,
  FETCH_STUDY_MATERIALS_FAILURE,
  FETCH_QUESTION_PAPERS_REQUEST,
  FETCH_QUESTION_PAPERS_SUCCESS,
  FETCH_QUESTION_PAPERS_FAILURE,
  // --- NEW IMPORTS FOR RESULT & EVALUATION ---
  UPLOAD_RESULT_REQUEST,
  UPLOAD_RESULT_SUCCESS,
  UPLOAD_RESULT_FAILURE,
  EVALUATE_PAPER_REQUEST,
  EVALUATE_PAPER_SUCCESS,
  EVALUATE_PAPER_FAILURE,
} from "../types";

const initialLectureMaterialsState = {
  materials: [],
  ppts: [], 
  worksheets: [], 
  studyMaterials: [], 
  questionPapers: [], 
  importantFiles: [],
  loading: false,
  uploading: false,
  deleting: false,
  
  uploadingStudyMaterial: false,
  uploadingQuestionPaper: false,
  
  // --- NEW STATE VARIABLES ---
  uploadingResult: false, // For Student uploading answer sheet
  evaluatingPaper: false, // For Tutor uploading marks
  
  fetchingStudyMaterials: false,
  fetchingQuestionPapers: false,
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

    // Study Materials Cases
    case UPLOAD_STUDY_MATERIAL_REQUEST:
      return { 
        ...state, 
        uploadingStudyMaterial: true, 
        error: null 
      };

    case UPLOAD_STUDY_MATERIAL_SUCCESS:
      return {
        ...state,
        uploadingStudyMaterial: false,
        error: null,
      };

    case UPLOAD_STUDY_MATERIAL_FAILURE:
      return { 
        ...state, 
        uploadingStudyMaterial: false, 
        error: action.payload.error 
      };

    case FETCH_STUDY_MATERIALS_REQUEST:
      return { 
        ...state, 
        fetchingStudyMaterials: true, 
        error: null 
      };

    case FETCH_STUDY_MATERIALS_SUCCESS:
      return { 
        ...state, 
        fetchingStudyMaterials: false, 
        studyMaterials: action.payload, 
        error: null 
      };

    case FETCH_STUDY_MATERIALS_FAILURE:
      return { 
        ...state, 
        fetchingStudyMaterials: false, 
        error: action.payload.error 
      };

    // Question Papers Cases
    case UPLOAD_QUESTION_PAPER_REQUEST:
      return { 
        ...state, 
        uploadingQuestionPaper: true, 
        error: null 
      };

    case UPLOAD_QUESTION_PAPER_SUCCESS:
      return {
        ...state,
        uploadingQuestionPaper: false,
        error: null,
      };

    case UPLOAD_QUESTION_PAPER_FAILURE:
      return { 
        ...state, 
        uploadingQuestionPaper: false, 
        error: action.payload.error 
      };

    case FETCH_QUESTION_PAPERS_REQUEST:
      return { 
        ...state, 
        fetchingQuestionPapers: true, 
        error: null 
      };

    case FETCH_QUESTION_PAPERS_SUCCESS:
      return { 
        ...state, 
        fetchingQuestionPapers: false, 
        questionPapers: action.payload, 
        error: null 
      };

    case FETCH_QUESTION_PAPERS_FAILURE:
      return { 
        ...state, 
        fetchingQuestionPapers: false, 
        error: action.payload.error 
      };

    // --- NEW: STUDENT RESULT UPLOAD CASES ---
    case UPLOAD_RESULT_REQUEST:
      return {
        ...state,
        uploadingResult: true,
        error: null
      };

    case UPLOAD_RESULT_SUCCESS:
      return {
        ...state,
        uploadingResult: false,
        error: null,
        // The list will be updated by the subsequent fetchQuestionPapers dispatch
        // from the action creator, so we just reset the loading state here.
      };

    case UPLOAD_RESULT_FAILURE:
      return {
        ...state,
        uploadingResult: false,
        error: action.payload.error
      };

    // --- NEW: TUTOR EVALUATION CASES ---
    case EVALUATE_PAPER_REQUEST:
      return {
        ...state,
        evaluatingPaper: true,
        error: null
      };

    case EVALUATE_PAPER_SUCCESS:
      return {
        ...state,
        evaluatingPaper: false,
        error: null,
        // Similarly, the UI updates because the action creator fetches the fresh list immediately after.
      };

    case EVALUATE_PAPER_FAILURE:
      return {
        ...state,
        evaluatingPaper: false,
        error: action.payload.error
      };
case FETCH_IMPORTANT_FILES_REQUEST:
      return { ...state, fetchingImportantFiles: true, error: null };
    
    case FETCH_IMPORTANT_FILES_SUCCESS:
      return { 
        ...state, 
        fetchingImportantFiles: false, 
        importantFiles: action.payload, // Updates the list
        error: null 
      };

    case FETCH_IMPORTANT_FILES_FAILURE:
      return { ...state, fetchingImportantFiles: false, error: action.payload };

    // 2. Uploading
    case UPLOAD_IMPORTANT_FILE_REQUEST:
      return { ...state, uploadingImportantFile: true, error: null };

    case UPLOAD_IMPORTANT_FILE_SUCCESS:
      return {
        ...state,
        uploadingImportantFile: false,
        // IMMEDIATE UI UPDATE: Add new file to top of list
        importantFiles: [action.payload, ...state.importantFiles], 
        error: null
      };

    case UPLOAD_IMPORTANT_FILE_FAILURE:
      return { ...state, uploadingImportantFile: false, error: action.payload };

    // 3. Deleting
    case DELETE_IMPORTANT_FILE_SUCCESS:
      return {
        ...state,
        // IMMEDIATE UI UPDATE: Filter out deleted file
        importantFiles: state.importantFiles.filter(file => file.id !== action.payload)
      };
    default:
      return state;
  }
};