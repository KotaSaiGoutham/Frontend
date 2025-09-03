import { combineReducers } from "redux";
import classReducer from "./reducers/classReducer";
import studentReducer from "./reducers/studentReducer";
import employeeReducer from "./reducers/employeeReducer";
import authReducer from "./reducers/authReducer";
import paymentsReducer from "./reducers/paymentReducer";
import demoClassReducer from "./reducers/demoClassReducer";
import autoTimetablesReducer from "./reducers/autoTimetablesReducer";
import { expenditureReducer } from "./reducers/expenditureReducer";
import studentExamReducer from "./reducers/studentExamReducer";
const rootReducer = combineReducers({
  auth: authReducer, // <-- Ensure your authReducer is assigned to the 'auth' key
  classes: classReducer,
  students: studentReducer,
  employees: employeeReducer,
  payments: paymentsReducer, // ← new slice
  demoClasses: demoClassReducer, // <--- This key MUST be 'demoClasses'
  autoTimetables: autoTimetablesReducer, // <--- This key MUST be 'demoClasses'
  expenditures: expenditureReducer,
  studentExams: studentExamReducer,
});

export default rootReducer;
