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
import studentProgramReducer from "./reducers/studentprogram";
import { lectureMaterialsReducer } from "./reducers/lectureReducer";
import classScheduleReducer from "./reducers/classScheduleReducer";
import revisionExamsReducer from "./reducers/revisionExamsReducer";
import demoBookingsReducer from "./reducers/demoBookingsReducer";
import tutorIdeasReducer from "./reducers/tutorIdeasReducer";
import { admissionReducer } from "./reducers/admissionReducer";
import studentSyllabusReducer from "./reducers/studentSyllabusReducer";
import notificationReducer from "./reducers/notificationReducer";
const rootReducer = combineReducers({
  auth: authReducer, 
  classes: classReducer,
  students: studentReducer,
  employees: employeeReducer,
  payments: paymentsReducer, 
  demoClasses: demoClassReducer, 
  autoTimetables: autoTimetablesReducer, 
  expenditures: expenditureReducer,
  studentExams: studentExamReducer,
  studentprogram: studentProgramReducer,
  lectureMaterials: lectureMaterialsReducer, 
  classSchedule: classScheduleReducer, 
 demoBookings: demoBookingsReducer,
   revisionExams: revisionExamsReducer, 
   tutorIdeas:tutorIdeasReducer,
   admission:admissionReducer,
   studentSyllabus:studentSyllabusReducer,
   notifications:notificationReducer
});

export default rootReducer;
