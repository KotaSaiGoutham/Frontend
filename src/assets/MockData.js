// --- Comprehensive Mock Data (Used as fallback and for generating dynamic parts like Upcoming Classes & Chart data) ---
const mockStudentsData = [
  {
    id: "s1",
    Name: "Alice Wonderland",
    subject: "Maths",
    monthlyFee: 1500,
    admissionDate: new Date(2024, 0, 15), // January 15, 2024
    classesCompleted: 25,
    paymentStatus: "Paid",
  },
  {
    id: "s2",
    Name: "Bob The Builder",
    subject: "Physics",
    monthlyFee: 1800,
    admissionDate: new Date(2023, 11, 1), // December 1, 2023
    classesCompleted: 30,
    paymentStatus: "Unpaid",
  },
  {
    id: "s3",
    Name: "Charlie Chaplin",
    subject: "Chemistry",
    monthlyFee: 1600,
    admissionDate: new Date(2024, 1, 20), // February 20, 2024
    classesCompleted: 18,
    paymentStatus: "Paid",
  },
  {
    id: "s4",
    Name: "Diana Prince",
    subject: "Biology",
    monthlyFee: 1700,
    admissionDate: new Date(2024, 2, 5), // March 5, 2024
    classesCompleted: 22,
    paymentStatus: "Paid",
  },
  {
    id: "s5",
    Name: "Eve Harrington",
    subject: "Maths",
    monthlyFee: 1500,
    admissionDate: new Date(2024, 3, 10), // April 10, 2024
    classesCompleted: 10,
    paymentStatus: "Unpaid",
  },
  {
    id: "s6",
    Name: "Frankenstein Monster",
    subject: "Physics",
    monthlyFee: 1800,
    admissionDate: new Date(2024, 4, 1), // May 1, 2024
    classesCompleted: 5,
    paymentStatus: "Paid",
  },
  {
    id: "s7",
    Name: "Grace Hopper",
    subject: "Chemistry",
    monthlyFee: 1600,
    admissionDate: new Date(2023, 9, 25), // October 25, 2023
    classesCompleted: 40,
    paymentStatus: "Paid",
  },
];

// Mock employee data (for API fallback if needed, or if API returns empty)
const mockEmployeesData = [
  { id: "e1", name: "Professor X", role: "Physics Teacher", salary: 50000 },
  { id: "e2", name: "Ms. Frizzle", role: "Maths Teacher", salary: 48000 },
  { id: "e3", name: "Dr. Jekyll", role: "Chemistry Teacher", salary: 52000 },
  { id: "e4", name: "Nurse Joy", role: "Admin Staff", salary: 30000 },
];

// --- Helper function to generate mock timetable data ---
const generateMockTimetableData = (studentsForNames) => {
  const today = new Date();
  const timetable = [];
  const subjects = ["Maths", "Physics", "Chemistry", "Biology"];
  // Use names from the provided studentsForNames, falling back to mockStudentsData if empty
  const studentsNames = studentsForNames.length > 0 ? studentsForNames.map(s => s.Name) : mockStudentsData.map(s => s.Name);

  for (let i = 0; i < 7; i++) { // Generate classes for the next 7 days
    const classDate = addDays(today, i);
    for (let j = 0; j < 2; j++) { // Two classes per day
      const randomStudent = studentsNames[Math.floor(Math.random() * studentsNames.length)];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const randomHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 4 PM
      const randomMinute = Math.random() < 0.5 ? "00" : "30";
      const ampm = randomHour < 12 ? 'AM' : 'PM';
      const displayHour = randomHour > 12 ? randomHour - 12 : randomHour === 0 ? 12 : randomHour; // Adjust for 12 AM/PM
      const time = `${displayHour.toString().padStart(2, '0')}:${randomMinute} ${ampm}`;

      timetable.push({
        id: `class-${i}-${j}`,
        studentName: randomStudent,
        date: format(classDate, "yyyy-MM-dd"), // "2025-06-19"
        time: time,
        subject: randomSubject,
      });
    }
  }
  return timetable;
};

// --- Helper functions to generate mock chart data ---

// Generates mock data for a line chart (e.g., test scores over months)
const generateMockTestScores = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const scores = months.map(() => Math.floor(Math.random() * (95 - 60 + 1)) + 60); // Scores between 60 and 95
    return { labels: months, data: scores, label: 'Avg. Score' };
};



