import {
  FETCH_REVISION_CLASSES_REQUEST,
  FETCH_REVISION_CLASSES_SUCCESS,
  FETCH_REVISION_CLASSES_FAILURE,
  UPDATE_CLASS_ATTENDANCE_REQUEST,
  UPDATE_CLASS_ATTENDANCE_SUCCESS,
  UPDATE_CLASS_ATTENDANCE_FAILURE,
  ADD_REVISION_CLASS_EXAM_SUCCESS,
  UPDATE_REVISION_CLASS_EXAM_SUCCESS,
  SET_REVISION_CLASS_EXAM_DATA,
  FETCH_STUDENT_CLASSES_REQUEST,
  FETCH_STUDENT_CLASSES_SUCCESS,
  FETCH_STUDENT_CLASSES_FAILURE,
  SEARCH_STUDENT_CLASSES_SUCCESS,
  SEARCH_STUDENT_CLASSES_FAILURE,
  SEARCH_STUDENT_CLASSES_REQUEST,
  CLEAR_SEARCH_RESULTS,
  FETCH_YEAR_STATISTICS_REQUEST,
  FETCH_YEAR_STATISTICS_SUCCESS,
  FETCH_YEAR_STATISTICS_FAILURE
} from "../types";

const initialState = {
  // Revision Classes State
  classes: [],
  loading: false,
  error: null,
  hasMore: true,
  nextCursor: null,
  prevCursor: null,
  hasPrevious: false,
  loadingMore: false,
  
  studentClasses: {
    pastClasses: [],
    futureClasses: [],
    loading: false,
    error: null,
    searchResults: [],
    searchQuery: '',
    totalResults: 0,
    searchLoading: false,
    searchError: null
  },

  // Year Statistics State
  yearStatistics: {
    firstYear: {
      total: 0,
      completed: 0,
      pending: 0,
      uniqueTopics: 0,
      classes: [],
      completedClasses: [],
      pendingClasses: [],
      topics: []
    },
    secondYear: {
      total: 0,
      completed: 0,
      pending: 0,
      uniqueTopics: 0,
      classes: [],
      completedClasses: [],
      pendingClasses: [],
      topics: []
    },
    dateRange: {},
    loading: false,
    error: null
  }
};

// Helper function to parse and compare dates (DD.MM.YY)
const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const [day, month, year] = dateStr.split('.');
  return new Date(`20${year}`, month - 1, day);
};

const classScheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_STUDENT_CLASSES_REQUEST:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          searchLoading: true,
          searchError: null
        }
      };

    case SEARCH_STUDENT_CLASSES_SUCCESS:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          searchLoading: false,
          searchResults: action.payload.searchResults || [],
          searchQuery: action.payload.searchQuery || '',
          totalResults: action.payload.totalResults || 0,
          searchError: null
        }
      };

    case SEARCH_STUDENT_CLASSES_FAILURE:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          searchLoading: false,
          searchError: action.payload.error,
          searchResults: [],
          totalResults: 0
        }
      };

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          searchResults: [],
          searchQuery: '',
          totalResults: 0,
          searchError: null
        }
      };

    case FETCH_REVISION_CLASSES_REQUEST:
      return {
        ...state,
        loading: !action.payload?.isLoadingMore,
        loadingMore: action.payload?.isLoadingMore || false,
        error: null,
      };
    
    case FETCH_REVISION_CLASSES_SUCCESS:
      const newClasses = action.payload.classes || [];
      const sortedClasses = [...newClasses].sort((a, b) => parseDate(a.date) - parseDate(b.date));

      return {
        ...state,
        loading: false,
        loadingMore: false,
        classes: sortedClasses,
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

    // Student Classes Cases
    case FETCH_STUDENT_CLASSES_REQUEST:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          loading: true,
          error: null
        }
      };
    
    case FETCH_STUDENT_CLASSES_SUCCESS:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          loading: false,
          pastClasses: action.payload.pastClasses || [],
          futureClasses: action.payload.futureClasses || [],
          studentId: action.payload.studentId || null,
          error: null
        }
      };
    
    case FETCH_STUDENT_CLASSES_FAILURE:
      return {
        ...state,
        studentClasses: {
          ...state.studentClasses,
          loading: false,
          error: action.payload.error,
          pastClasses: [],
          futureClasses: []
        }
      };

    // Year Statistics Cases
    case FETCH_YEAR_STATISTICS_REQUEST:
      return {
        ...state,
        yearStatistics: {
          ...state.yearStatistics,
          loading: true,
          error: null
        }
      };
    
    case FETCH_YEAR_STATISTICS_SUCCESS:
      return {
        ...state,
        yearStatistics: {
          ...state.yearStatistics,
          loading: false,
          firstYear: action.payload.firstYear || initialState.yearStatistics.firstYear,
          secondYear: action.payload.secondYear || initialState.yearStatistics.secondYear,
          dateRange: action.payload.dateRange || {},
          error: null
        }
      };
    
    case FETCH_YEAR_STATISTICS_FAILURE:
      return {
        ...state,
        yearStatistics: {
          ...state.yearStatistics,
          loading: false,
          error: action.payload.error
        }
      };

    // Existing attendance and exam cases...
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