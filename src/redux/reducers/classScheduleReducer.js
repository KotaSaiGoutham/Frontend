import {
  FETCH_REVISION_CLASSES_REQUEST,
  FETCH_REVISION_CLASSES_SUCCESS,
  FETCH_REVISION_CLASSES_FAILURE,
  UPDATE_CLASS_ATTENDANCE_REQUEST,
  UPDATE_CLASS_ATTENDANCE_SUCCESS,
  UPDATE_CLASS_ATTENDANCE_FAILURE,
  ADD_REVISION_CLASS_EXAM_SUCCESS,
  UPDATE_REVISION_CLASS_EXAM_SUCCESS,
  SET_REVISION_CLASS_EXAM_DATA
} from "../types";

const initialState = {
  classes: [],
  loading: false,
  error: null,
  hasMore: true,
  nextCursor: null,
  prevCursor: null,
  hasPrevious: false,
  loadingMore: false,
};

// Helper function to parse and compare dates (DD.MM.YY)
const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const [day, month, year] = dateStr.split('.');
  return new Date(`20${year}`, month - 1, day);
};

const classScheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVISION_CLASSES_REQUEST:
      return {
        ...state,
        loading: !action.payload?.isLoadingMore,
        loadingMore: action.payload?.isLoadingMore || false,
        error: null,
      };
    
    case FETCH_REVISION_CLASSES_SUCCESS:
      // Always replace classes with the new data, don't append/prepend
      const newClasses = action.payload.classes || [];
      
      // Sort by date
      const sortedClasses = [...newClasses].sort((a, b) => parseDate(a.date) - parseDate(b.date));

      return {
        ...state,
        loading: false,
        loadingMore: false,
        classes: sortedClasses, // Replace completely
        hasMore: action.payload.hasMore !== undefined ? action.payload.hasMore : false,
        hasPrevious: action.payload.hasPrevious !== undefined ? action.payload.hasPrevious : false,
        nextCursor: action.payload.nextCursor || null,
        prevCursor: action.payload.prevCursor || null,
        error: null,
      };
    
    case FETCH_REVISION_CLASSES_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.payload.error,
      };

    case UPDATE_CLASS_ATTENDANCE_SUCCESS:
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls.id === action.payload.id ? action.payload : cls
        ),
        error: null,
      };

    case "UPDATE_REVISION_CLASS_EXAM_SUCCESS":
      return {
        ...state,
        classes: state.classes.map(classItem =>
          classItem.id === action.payload.classId
            ? {
                ...classItem,
                examData: (classItem.examData || []).map(exam =>
                  exam.studentId === action.payload.studentId
                    ? { ...exam, ...action.payload.examData }
                    : exam
                ),
              }
            : classItem
        ),
      };

    case ADD_REVISION_CLASS_EXAM_SUCCESS: {
      const { classId, examData } = action.payload;
      return {
        ...state,
        classes: state.classes.map(cls => {
          if (cls.id === classId) {
            const existingExamData = cls.examData || [];
            const studentIndex = existingExamData.findIndex(
              exam => exam.studentId === examData.studentId
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
              ...cls,
              examData: updatedExamData
            };
          }
          return cls;
        })
      };
    }

    case UPDATE_REVISION_CLASS_EXAM_SUCCESS: {
      const { classId, studentId, examData } = action.payload;
      return {
        ...state,
        classes: state.classes.map(cls => {
          if (cls.id === classId) {
            const existingExamData = cls.examData || [];
            const updatedExamData = existingExamData.map(exam => 
              exam.studentId === studentId 
                ? { ...exam, ...examData }
                : exam
            );
            
            return {
              ...cls,
              examData: updatedExamData
            };
          }
          return cls;
        })
      };
    }

    case SET_REVISION_CLASS_EXAM_DATA: {
      const { classId, examData } = action.payload;
      return {
        ...state,
        classes: state.classes.map(cls => 
          cls.id === classId 
            ? { ...cls, examData }
            : cls
        )
      };
    }

    default:
      return state;
  }
};

export default classScheduleReducer;