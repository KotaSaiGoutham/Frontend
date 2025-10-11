// redux/reducers/revisionExamsReducer.js

import {
  FETCH_REVISION_EXAMS_REQUEST,
  FETCH_REVISION_EXAMS_SUCCESS,
  FETCH_REVISION_EXAMS_FAILURE,
  ADD_REVISION_EXAM_SUCCESS,
  UPDATE_REVISION_EXAM_SUCCESS,
} from "../types";

const initialState = {
  exams: [],
  loading: false,
  error: null,
  hasMore: true,
  nextCursor: null,
  prevCursor: null,
  hasPrevious: false,
};

// Helper function to parse dates (DD.MM.YYYY)
const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const [day, month, year] = dateStr.split('.');
  return new Date(`20${year}`, month - 1, day);
};

const revisionExamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVISION_EXAMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case FETCH_REVISION_EXAMS_SUCCESS:
      const newExams = action.payload.exams || [];
      
      // Sort by date
      const sortedExams = [...newExams].sort((a, b) => parseDate(a.date) - parseDate(b.date));

      return {
        ...state,
        loading: false,
        exams: sortedExams,
        hasMore: action.payload.hasMore !== undefined ? action.payload.hasMore : false,
        hasPrevious: action.payload.hasPrevious !== undefined ? action.payload.hasPrevious : false,
        nextCursor: action.payload.nextCursor || null,
        prevCursor: action.payload.prevCursor || null,
        error: null,
      };
    
    case FETCH_REVISION_EXAMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case ADD_REVISION_EXAM_SUCCESS: {
      const { classId, examData } = action.payload;
      return {
        ...state,
        exams: state.exams.map(exam => {
          if (exam.id === classId) {
            const existingExamData = exam.examData || [];
            const studentIndex = existingExamData.findIndex(
              e => e.studentId === examData.studentId
            );
            
            let updatedExamData;
            if (studentIndex >= 0) {
              updatedExamData = [...existingExamData];
              updatedExamData[studentIndex] = { 
                ...updatedExamData[studentIndex], 
                ...examData 
              };
            } else {
              updatedExamData = [...existingExamData, examData];
            }
            
            return {
              ...exam,
              examData: updatedExamData
            };
          }
          return exam;
        })
      };
    }

    case UPDATE_REVISION_EXAM_SUCCESS: {
      const { classId, studentId, examData } = action.payload;
      return {
        ...state,
        exams: state.exams.map(exam => {
          if (exam.id === classId) {
            const existingExamData = exam.examData || [];
            const updatedExamData = existingExamData.map(e => 
              e.studentId === studentId 
                ? { ...e, ...examData }
                : e
            );
            
            return {
              ...exam,
              examData: updatedExamData
            };
          }
          return exam;
        })
      };
    }

    default:
      return state;
  }
};

export default revisionExamsReducer;