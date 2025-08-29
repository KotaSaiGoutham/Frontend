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
    case FETCH_STUDENT_EXAMS_REQUEST:
    case ADD_STUDENT_EXAM_REQUEST:
    case UPDATE_STUDENT_EXAM_REQUEST:
    case DELETE_STUDENT_EXAM_REQUEST:
      return { ...state, loading: true, error: null, addSuccess: false, updateSuccess: false };

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

    case FETCH_STUDENT_EXAMS_FAILURE:
    case ADD_STUDENT_EXAM_FAILURE:
    case UPDATE_STUDENT_EXAM_FAILURE:
    case DELETE_STUDENT_EXAM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default studentExamReducer;
