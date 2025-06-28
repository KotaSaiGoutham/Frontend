// src/redux/rootReducer.js

import { combineReducers } from "redux";
import classReducer from "./reducers/classReducer";
import studentReducer from "./reducers/studentReducer";
import employeeReducer from "./reducers/employeeReducer";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer, // <-- Ensure your authReducer is assigned to the 'auth' key
  classes: classReducer,
  students: studentReducer,
  employees: employeeReducer,
  // Add any other reducers here as you create them
});

export default rootReducer;
