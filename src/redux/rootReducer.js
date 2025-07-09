// src/redux/rootReducer.js

import { combineReducers } from "redux";
import classReducer from "./reducers/classReducer";
import studentReducer from "./reducers/studentReducer";
import employeeReducer from "./reducers/employeeReducer";
import authReducer from "./reducers/authReducer";
import paymentsReducer from "./reducers/paymentReducer";
const rootReducer = combineReducers({
  auth: authReducer, // <-- Ensure your authReducer is assigned to the 'auth' key
  classes: classReducer,
  students: studentReducer,
  employees: employeeReducer, 
    payments: paymentsReducer,   // ← new slice

  // Add any other reducers here as you create them
});

export default rootReducer;
