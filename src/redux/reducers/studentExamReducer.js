import {
  FETCH_STUDENT_EXAMS_REQUEST,
  FETCH_STUDENT_EXAMS_SUCCESS,
  FETCH_STUDENT_EXAMS_FAILURE,
  ADD_STUDENT_EXAM_REQUEST,
  ADD_STUDENT_EXAM_SUCCESS,
  ADD_STUDENT_EXAM_FAILURE,
  UPDATE_STUDENT_EXAM_REQUEST,
  UPDATE_STUDENT_EXAM_SUCCESS,
  UPDATE_STUDENT_EXAM_FAILURE,
  DELETE_STUDENT_EXAM_REQUEST,
  DELETE_STUDENT_EXAM_SUCCESS,
  DELETE_STUDENT_EXAM_FAILURE,
  // Add your new syllabus action types
  UPDATE_SYLLABUS_REQUEST,
  UPDATE_SYLLABUS_SUCCESS,
  UPDATE_SYLLABUS_FAILURE,
} from "../types";

const initialState = {
  studentExams: [],
  loading: false,
  error: null,
  addSuccess: false,
  updateSuccess: false,
};

const studentExamReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handling all request actions
    case FETCH_STUDENT_EXAMS_REQUEST:
    case ADD_STUDENT_EXAM_REQUEST:
    case UPDATE_STUDENT_EXAM_REQUEST:
    case DELETE_STUDENT_EXAM_REQUEST:
    case UPDATE_SYLLABUS_REQUEST: // Add the new request type here
      return { ...state, loading: true, error: null, addSuccess: false, updateSuccess: false };

    // Handling all success and failure actions
    case FETCH_STUDENT_EXAMS_SUCCESS:
      return { ...state, loading: false, studentExams: action.payload };

    case ADD_STUDENT_EXAM_SUCCESS:
      return { ...state, loading: false, addSuccess: true };

    case UPDATE_STUDENT_EXAM_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        studentExams: state.studentExams.map((exam) =>
          exam.id === action.payload.id ? action.payload : exam
        ),
      };

    case DELETE_STUDENT_EXAM_SUCCESS:
      return {
        ...state,
        loading: false,
        studentExams: state.studentExams.filter((exam) => exam.id !== action.payload),
      };

    case UPDATE_SYLLABUS_SUCCESS: // This is a new success case for syllabus updates
      return {
        ...state,
        loading: false,
        // Find the student by ID and update their 'lessons' field
        studentExams: state.studentExams.map((student) =>
          student.id === action.payload.studentId
            ? { ...student, lessons: action.payload.lessons }
            : student
        ),
      };

    // Handling all failure actions
    case FETCH_STUDENT_EXAMS_FAILURE:
    case ADD_STUDENT_EXAM_FAILURE:
    case UPDATE_STUDENT_EXAM_FAILURE:
    case DELETE_STUDENT_EXAM_FAILURE:
    case UPDATE_SYLLABUS_FAILURE: // Add the new failure type here
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default studentExamReducer;