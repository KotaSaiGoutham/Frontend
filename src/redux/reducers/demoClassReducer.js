import {
  FETCH_DEMO_CLASSES_REQUEST,
  FETCH_DEMO_CLASSES_SUCCESS,
  FETCH_DEMO_CLASSES_FAILURE,
  ADD_DEMO_CLASS_REQUEST,
  ADD_DEMO_CLASS_SUCCESS,
  ADD_DEMO_CLASS_FAILURE,
  UPDATE_DEMO_CLASS_STATUS_REQUEST,
  UPDATE_DEMO_CLASS_STATUS_SUCCESS,
  UPDATE_DEMO_CLASS_STATUS_FAILURE,
  UPDATE_DEMO_CLASS_FAILURE,
  UPDATE_DEMO_CLASS_SUCCESS,
  UPDATE_DEMO_CLASS_REQUEST,
  DELETE_DEMO_CLASS_FAILURE,DELETE_DEMO_CLASS_SUCCESS,DELETE_DEMO_CLASS_REQUEST
} from "../types";

const initialState = {
  demoClasses: [],
  loading: false,
  error: null,
  addSuccess: false,
  updateSuccess: false,
};

const demoClassReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DEMO_CLASSES_REQUEST:
    case ADD_DEMO_CLASS_REQUEST:
    case UPDATE_DEMO_CLASS_REQUEST: // <-- NEW
      return {
        ...state,
        loading: true,
        error: null,
        addSuccess: false, // Reset success flags on new request
        updateSuccess: false, // Reset this flag as well
      };
      case DELETE_DEMO_CLASS_REQUEST:
      return {
        ...state,
        loading: false,
        error: null,
        addSuccess: false, // Reset success flags on new request
        updateSuccess: false, // Reset this flag as well
      };

    case FETCH_DEMO_CLASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        demoClasses: action.payload,
        error: null,
      };

    case ADD_DEMO_CLASS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        addSuccess: true,
      };
      
    case UPDATE_DEMO_CLASS_SUCCESS:
      const updatedDemo = action.payload;
      return {
        ...state,
        loading: false,
        error: null,
        updateSuccess: true,
        demoClasses: state.demoClasses.map((demo) =>
          demo.id === updatedDemo.id ? updatedDemo : demo
        ),
      };

    // ... other cases
    case FETCH_DEMO_CLASSES_FAILURE:
    case ADD_DEMO_CLASS_FAILURE:
    case UPDATE_DEMO_CLASS_FAILURE: // <-- NEW
    case DELETE_DEMO_CLASS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        addSuccess: false,
        updateSuccess: false,
      };

    default:
      return state;
  }
};

export default demoClassReducer;