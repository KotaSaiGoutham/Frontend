import {
  FaTransgender,
  FaBookOpen,
  FaUsers,
  FaUserCircle,
  FaGraduationCap,
  FaUniversity,
  FaSearchDollar,
  FaCalendarCheck,
  FaPhone,
  FaArrowRight,
  FaCalendarAlt, FaCheckCircle, FaTrashAlt,
  FaBook, FaFlask, FaAtom, FaBalanceScale 
} from "react-icons/fa";
import {
  HourglassEmpty as PendingIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,    
    CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  Schedule as RescheduledIcon,

} from '@mui/icons-material';
export const subjectOptions = [
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Maths", label: "Maths" },
  { value: "Biology", label: "Biology" },
];
 export const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Success", label: "Success" }, // Corrected typo here from "Succes" to "Success"
    { value: "Failed", label: "Failed" },
    { value: "Rescheduled", label: "Rescheduled" },
  ];
export const paymentStatusOptions = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "Due", label: "Due" }, // Ensure this matches your backend data
];
export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const streamOptions = [
  { value: "JEE", label: "JEE" },
  { value: "NEET", label: "NEET" },
  { value: "CBSE", label: "CBSE" },
  { value: "Foundation", label: "Foundation" },
  { value: "AP PHY", label: "AP PHY" },
  { value: "Other", label: "Other" },
];

export const sourceOptions = [
  { value: "Urban Pro", label: "Urban Pro" },
  { value: "Reference", label: "Reference" },
  { value: "Mediator", label: "Mediator" },
  { value: "Other", label: "Other" },
];
export const topicOptions = [
  { id: 1, topic: "Physical world", subject: "Physics", year: "1st Year" },
  {
    id: 2,
    topic: "Units and Measurements",
    subject: "Physics",
    year: "1st Year",
  },
  {
    id: 3,
    topic: "Motion in a Straight Line",
    subject: "Physics",
    year: "1st Year",
  },
  { id: 4, topic: "Motion in a Plane", subject: "Physics", year: "1st Year" },
  { id: 5, topic: "Laws of Motion", subject: "Physics", year: "1st Year" },
  {
    id: 6,
    topic: "Work, Energy and Power",
    subject: "Physics",
    year: "1st Year",
  },
  {
    id: 7,
    topic: "System of Particles and Rotational Motion",
    subject: "Physics",
    year: "1st Year",
  },
  { id: 8, topic: "Oscillations", subject: "Physics", year: "1st Year" },
  { id: 9, topic: "Gravitation", subject: "Physics", year: "1st Year" },
  {
    id: 10,
    topic: "Mechanical Properties of Solids",
    subject: "Physics",
    year: "1st Year",
  },
  {
    id: 11,
    topic: "Mechanical Properties of Fluids",
    subject: "Physics",
    year: "1st Year",
  },
  {
    id: 12,
    topic: "Thermal Properties of Matter",
    subject: "Physics",
    year: "1st Year",
  },
  { id: 13, topic: "Thermodynamics", subject: "Physics", year: "1st Year" },
  {
    id: 14,
    topic: "Kinetic Theory of Gases",
    subject: "Physics",
    year: "1st Year",
  },
  { id: 15, topic: "Waves", subject: "Physics", year: "2nd Year" },
  { id: 16, topic: "Ray Optics", subject: "Physics", year: "2nd Year" },
  { id: 17, topic: "Wave Optics", subject: "Physics", year: "2nd Year" },
  {
    id: 18,
    topic: "Electric Charges and Fields",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 19,
    topic: "Electrostatic Potential and Capacitance",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 20,
    topic: "Current Electricity",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 21,
    topic: "Moving Charges and Magnetism",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 22,
    topic: "Magnetism and Matter",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 23,
    topic: "Electromagnetic Induction",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 24,
    topic: "Alternating Current",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 25,
    topic: "Dual Nature of Radiation and Matter",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 26,
    topic: "Electromagnetic Waves",
    subject: "Physics",
    year: "2nd Year",
  },
  { id: 27, topic: "Atoms", subject: "Physics", year: "2nd Year" },
  { id: 28, topic: "Nuclei", subject: "Physics", year: "2nd Year" },
  {
    id: 29,
    topic: "Semiconductor Devices",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 30,
    topic: "Communication system",
    subject: "Physics",
    year: "2nd Year",
  },
  {
    id: 31,
    topic: "Some Basic Concepts of Chemistry",
    subject: "Chemistry",
    year: "1st Year",
  },
  {
    id: 32,
    topic: "Structure of Atom",
    subject: "Chemistry",
    year: "1st Year",
  },
  {
    id: 33,
    topic: "Classification of Elements and Periodicity",
    subject: "Chemistry",
    year: "1st Year",
  },
  {
    id: 34,
    topic: "Chemical Bonding and Molecular Structure",
    subject: "Chemistry",
    year: "1st Year",
  },
  {
    id: 35,
    topic: "States of Matter: Gases and Liquids",
    subject: "Chemistry",
    year: "1st Year",
  },
  { id: 36, topic: "Thermodynamics", subject: "Chemistry", year: "1st Year" },
  { id: 37, topic: "Equilibrium", subject: "Chemistry", year: "1st Year" },
  { id: 38, topic: "Redox Reactions", subject: "Chemistry", year: "1st Year" },
  { id: 39, topic: "Hydrogen", subject: "Chemistry", year: "1st Year" },
  {
    id: 40,
    topic: "The s-Block Element",
    subject: "Chemistry",
    year: "1st Year",
  },
  {
    id: 41,
    topic: "Some p-Block Elements (Group 13 & 14)",
    subject: "Chemistry",
    year: "1st Year",
  },
  {
    id: 42,
    topic: "Organic Chemistry - Basic Principles & Techniques",
    subject: "Chemistry",
    year: "1st Year",
  },
  { id: 43, topic: "Hydrocarbons", subject: "Chemistry", year: "1st Year" },
  {
    id: 44,
    topic: "Environmental Chemistry",
    subject: "Chemistry",
    year: "1st Year",
  },
  { id: 45, topic: "The Solid State", subject: "Chemistry", year: "2nd Year" },
  { id: 46, topic: "Solutions", subject: "Chemistry", year: "2nd Year" },
  { id: 47, topic: "Electrochemistry", subject: "Chemistry", year: "2nd Year" },
  {
    id: 48,
    topic: "Chemical Kinetics",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 49,
    topic: "Surface Chemistry",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 50,
    topic: "The p-Block Elements (Group 15,16,17,18)",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 51,
    topic: "The d- and f-Block Elements",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 52,
    topic: "Coordination Compounds",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 53,
    topic: "Haloalkanes and Haloarenes",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 54,
    topic: "Alcohols, Phenols and Ethers",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 55,
    topic: "Aldehydes, Ketones and Carboxylic Acids",
    subject: "Chemistry",
    year: "2nd Year",
  },
  {
    id: 56,
    topic: "Organic Compounds Containing Nitrogen",
    subject: "Chemistry",
    year: "2nd Year",
  },
  { id: 57, topic: "Biomolecules", subject: "Chemistry", year: "2nd Year" },
  { id: 58, topic: "Polymers", subject: "Chemistry", year: "2nd Year" },
  {
    id: 59,
    topic: "Chemistry in Everyday Life",
    subject: "Chemistry",
    year: "2nd Year",
  },
];
export const yearOptions = [
  { value: "12th Class", label: "12th Class" },
  { value: "11th Class", label: "11th Class" },
  { value: "10th Class", label: "10th Class" },
  { value: "9th Class", label: "9th Class" },
  { value: "8th Class", label: "8th Class" },
  { value: "7th Class", label: "7th Class" },
  { value: "6th Class", label: "6th Class" },
  { value: "5th Class", label: "5th Class" },
  { value: "4th Class", label: "4th Class" },
  { value: "3rd Class", label: "3rd Class" },
  { value: "2nd Class", label: "2nd Class" },
  { value: "1st Class", label: "1st Class" },
];


export const validRoles = ["Physics", "Chemistry", "Biology", "Zoology", "Maths"];
export const dayOptions = [
  { value: "", label: "Select Day" }, 
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];
export const studentColumns = [
  { id: 'sNo', label: 'S.No.', minWidth: 50, align: 'center', hasSort: false },
  { id: 'name', label: 'Name', minWidth: 150, align: 'left', hasSort: true, icon: FaUserCircle },
  { id: 'gender', label: 'Gender', minWidth: 100, align: 'center', hasSort: false, icon: FaTransgender },
  { id: 'subject', label: 'Subject', minWidth: 120, align: 'center', hasSort: false, icon: FaBookOpen },
  { id: 'year', label: 'Year', minWidth: 80, align: 'center', hasSort: false, icon: FaCalendarCheck },
  { id: 'stream', label: 'Stream', minWidth: 120, align: 'center', hasSort: false, icon: FaGraduationCap },
  { id: 'college', label: 'College', minWidth: 150, align: 'center', hasSort: false, icon: FaUniversity },
  { id: 'group', label: 'Group', minWidth: 100, align: 'center', hasSort: false, icon: FaUsers },
  { id: 'source', label: 'Source', minWidth: 100, align: 'center', hasSort: false, icon: FaSearchDollar },
  { id: 'contactNumber', label: 'Contact No.', minWidth: 150, align: 'center', hasSort: false, icon: FaPhone },
  { id: 'motherContact', label: 'Mother Contact', minWidth: 150, align: 'center', hasSort: false, icon: FaPhone },
  { id: 'fatherContact', label: 'Father Contact', minWidth: 150, align: 'center', hasSort: false, icon: FaPhone },
  { id: 'monthlyFee', label: 'Monthly Fee', minWidth: 120, align: 'right', hasSort: true },
  { id: 'classesCompleted', label: 'Classes Completed', minWidth: 160, align: 'center', hasSort: true },
  { id: 'nextClass', label: 'Next Class', minWidth: 120, align: 'center', hasSort: false },
  { id: 'paymentStatus', label: 'Payment Status', minWidth: 150, align: 'center', hasSort: false },
  { id: 'status', label: 'Status', minWidth: 150, align: 'center', hasSort: false },
  { id: 'actions', label: 'Actions', minWidth: 150, align: 'center', hasSort: false },
];



export const demoTableColumns = [
  {
    id: 'sNo',
    label: 'S.No.',
    align: 'center',
    minWidth: 'auto',
    hasSort: false,
    icon: null,
  },
  {
    id: 'studentName',
    label: 'Student Name',
    align: 'center',
    minWidth: 120,
    hasSort: true, // You might want to enable sorting for dates
    icon: FaCalendarAlt,
  },
  {
    id: 'demoDate',
    label: 'Demo Date',
    align: 'center',
    minWidth: 120,
    hasSort: true, // You might want to enable sorting for dates
    icon: FaCalendarAlt,
  },
  {
    id: 'status',
    label: 'Status',
    align: 'center',
    minWidth: 150,
    hasSort: true, // Status is often sortable
    icon: FaCheckCircle,
  },
  {
    id: 'moveToStudents',
    label: 'Move To Students',
    align: 'center',
    minWidth: 180,
    hasSort: false,
    icon: FaArrowRight,
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
    minWidth: 120,
    hasSort: false,
  },
];


// Define all possible columns
export const allExamTableColumns = [
  { id: 'sNo', label: 'S.No', align: 'center', hasSort: false, icon: null },
  { id: 'studentName', label: 'Student Name', align: 'center', hasSort: true, icon: FaBook },
  { id: 'examDate', label: 'Exam Date', align: 'center', hasSort: true, icon: FaCalendarAlt },
  { id: 'stream', label: 'Stream', align: 'center', hasSort: true, icon: FaFlask },
  { id: 'status', label: 'Status', align: 'center', hasSort: true, icon: FaCheckCircle },
  { id: 'maths', label: 'Math', align: 'center', hasSort: true, icon: FaBalanceScale },
  { id: 'physics', label: 'Physics', align: 'center', hasSort: true, icon: FaAtom },
  { id: 'chemistry', label: 'Chemistry', align: 'center', hasSort: true, icon: FaFlask },
  { id: 'total', label: 'Total', align: 'center', hasSort: true, icon: null },
  { id: 'actions', label: 'Actions', align: 'center', hasSort: false, icon: null },
];

export const getExamTableColumns = (user) => {
  if (!user) return [];

  return allExamTableColumns.filter(column => {
    // These columns are always visible
    if (['sNo', 'studentName', 'examDate', 'stream', 'status', 'total', 'actions'].includes(column.id)) {
      return true;
    }

    // Conditionally show subject columns
    if (column.id === 'physics' && user.isPhysics) {
      return true;
    }
    if (column.id === 'chemistry' && user.isChemistry) {
      return true;
    }
    if (column.id === 'maths' && user.isMaths) {
      return true;
    }

    return false;
  });
};
export const MARK_SCHEMES = {
  JEE: { Maths: 100, Physics: 100, Chemistry: 100 },
  NEET: { Botany: 180, Zoology: 180, Physics: 180, Chemistry: 180 },
  FOUNDATION: { Maths: 15, Physics: 15, Chemistry: 15 },
  BITSAT: {
    Maths: 120,
    Physics: 90,
    Chemistry: 90,
    English: 30,
    "Logical Reasoning": 60,
  },
  CBSE: { Maths: 35, Physics: 35, Chemistry: 35 },
};



export const examStatusConfig = {
  Present: {
    label: "Present",
    icon: <PresentIcon fontSize="small" />,
    backgroundColor: "#d1e7dd", // Green-like color
    color: "#0f5132",
  },
  Absent: {
    label: "Absent",
    icon: <AbsentIcon fontSize="small" />,
    backgroundColor: "#f8d7da", // Red-like color
    color: "#842029",
  },
  Pending: {
    label: "Pending",
    icon: <PendingIcon fontSize="small" />,
    backgroundColor: "#fff3cd", // Yellow-like color
    color: "#664d03",
  },
};

export const demoStatusConfig = {
  Pending: {
    label: "Pending",
    icon: <PendingIcon fontSize="small" />,
    backgroundColor: "#fff3cd",
    color: "#664d03",
  },
  Success: {
    label: "Success",
    icon: <SuccessIcon fontSize="small" />,
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
  },
  Failed: {
    label: "Failed",
    icon: <FailedIcon fontSize="small" />,
    backgroundColor: "#f8d7da",
    color: "#842029",
  },
  Rescheduled: {
    label: "Rescheduled",
    icon: <RescheduledIcon fontSize="small" />,
    backgroundColor: "#cfe2ff",
    color: "#052c65",
  },
};

export const reportTypeOptions = [
  { value: "todayTimetable", label: "Today Timetable" },
  { value: "demoClasses", label: "Demo Classes" },
  { value: "monthlyExpense", label: "Monthly Expense" },
  { value: "monthlyTimetable", label: "Monthly Timetable Download" },
    { value: "studentData", label: "Student Data (Month Wise)" },

];

export const exportTypeOptions = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
];
