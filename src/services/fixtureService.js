import { studentsFixture } from "../fixtures/students";
import { allFixture} from "../fixtures/all";
import { studentsExamFixture } from "../fixtures/studentexams";
import { employeeFixture} from "../fixtures/employees"
import { studentpaymentbyid } from "../fixtures/studentpaymentbyid";

// Simulate API delay
const withDelay = (data, delay = 500) => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const fixtureService = {
  // Students
  getStudents: () => withDelay(studentsFixture),

  
  // Student Exams
  getStudentExams: () => withDelay(studentsExamFixture),

  
  // Payments
  getPayments: () => withDelay(allFixture),
  
  
  // Employees (empty for now)
  getEmployees: () => withDelay(employeeFixture),
  

    getstudentidbyPayments: () => withDelay(studentpaymentbyid),

  // Add other methods as needed...
};