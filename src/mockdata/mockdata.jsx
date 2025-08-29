 // Mock data for employees and salaries (up to 10)
  const mockSalariesData = [
    {
      id: "emp001",
      name: "Alice Johnson",
      role: "Physics Teacher",
      salary: 65000,
      paid: true,
      lastPaid: "2025-05-28",
    },
    {
      id: "emp002",
      name: "Bob Williams",
      role: "Maths Teacher",
      salary: 70000,
      paid: true,
      lastPaid: "2025-05-29",
    },
    {
      id: "emp003",
      name: "Charlie Brown",
      role: "Chemistry Teacher",
      salary: 68000,
      paid: false,
      lastPaid: "2025-04-30",
    },
    {
      id: "emp004",
      name: "Diana Miller",
      role: "Biology Teacher",
      salary: 67000,
      paid: true,
      lastPaid: "2025-05-27",
    },
    {
      id: "emp005",
      name: "Eve Davis",
      role: "Admin Staff",
      salary: 45000,
      paid: true,
      lastPaid: "2025-05-30",
    },
    {
      id: "emp006",
      name: "Frank White",
      role: "Physics Teacher",
      salary: 66000,
      paid: true,
      lastPaid: "2025-05-28",
    },
    {
      id: "emp007",
      name: "Grace Taylor",
      role: "Counselor",
      salary: 55000,
      paid: false,
      lastPaid: "2025-04-25",
    },
    {
      id: "emp008",
      name: "Henry King",
      role: "Maintenance",
      salary: 35000,
      paid: true,
      lastPaid: "2025-05-26",
    },
    {
      id: "emp009",
      name: "Ivy Green",
      role: "Chemistry Teacher",
      salary: 69000,
      paid: true,
      lastPaid: "2025-05-29",
    },
    {
      id: "emp010",
      name: "Jack Hall",
      role: "IT Support",
      salary: 50000,
      paid: false,
      lastPaid: "2025-04-20",
    },
  ];

  // Mock Timetable Data (to demonstrate the timetable section)
  const mockTimetableData = [
    {
      id: "tt001",
      studentName: "Student A",
      subject: "Physics",
      time: "10:00 AM",
      day: "Monday",
      teacher: "Alice Johnson",
    },
    {
      id: "tt002",
      studentName: "Student B",
      subject: "Maths",
      time: "02:00 PM",
      day: "Tuesday",
      teacher: "Bob Williams",
    },
    {
      id: "tt003",
      studentName: "Student C",
      subject: "Chemistry",
      time: "11:00 AM",
      day: "Wednesday",
      teacher: "Charlie Brown",
    },
    {
      id: "tt004",
      studentName: "Student D",
      subject: "Biology",
      time: "03:30 PM",
      day: "Thursday",
      teacher: "Diana Miller",
    },
    {
      id: "tt005",
      studentName: "Student E",
      subject: "Physics",
      time: "09:00 AM",
      day: "Friday",
      teacher: "Frank White",
    },
  ];
  // src/utils/quotes.js (or src/constants/quotes.js)

export const motivationalQuotes = [
  "Every step forward is a step towards your dreams.",
  "The greatest journey begins with a single intention.",
  "Your family is your foundation; cherish every moment.",
  "Love and laughter shared with family are life's true treasures.",
  "In a changing world, kindness remains our most powerful constant.",
  "Every day offers a new chance to learn and grow.",
  "Together, we build a brighter tomorrow for all.",
  "Challenges make us stronger; let's face them with hope.",
  "The pursuit of knowledge lights the path to a meaningful life.",
  "The world is full of wonders; keep exploring and understanding.",
  "Embrace the beauty of new beginnings.",
  "Your potential is limitless; never stop believing.",
  "Small efforts daily lead to great achievements.",
  "The best way to predict the future is to create it.",
  "Learning is a journey, not a destination.",
  "Find joy in the process of becoming.",
  "A positive mind creates a positive life.",
  "Be the change you wish to see in the world.",
  "Every challenge is an opportunity in disguise.",
  "Kindness costs nothing, but means everything.",
  "Cherish the present moment; it's a gift.",
  "Your strength is greater than any struggle.",
  "Growth is never by chance, but by change.",
  "Listen more, learn more, live more.",
  "The simplest acts of caring are heroic.",
  "Innovation thrives where curiosity leads.",
  "Make today amazing; it's yours to shape.",
  "Your spirit is your greatest guide.",
  "Discovering new ideas lights up the mind.",
  "The power of a smile can change a day.",
  "Success is the sum of small efforts.",
  "Choose courage over comfort, always.",
  "Let your dreams be your wings.",
  "Every day is a chance to start fresh.",
  "Knowledge truly empowers you.",
  "Your unique voice matters.",
  "Connect with purpose, live with passion.",
  "The future is built on today's decisions.",
  "Believe in the magic of your own journey.",
  "Give back, and watch your world expand.",
  "Peace begins with a kind thought.",
  "Adaptability is the key to thriving.",
  "Celebrate progress, no matter how small.",
  "Your story is still being written.",
  "Inspire others by being authentically you.",
  "The greatest lessons are learned through experience.",
  "Cultivate gratitude, and find happiness.",
  "Breathe deeply, live fully.",
  "Explore new horizons with an open mind.",
  "The warmth of connection fuels the soul.",
  "Stay curious, stay inspired.",
  "Your determination defines your destiny.",
  "Learn from yesterday, live for today, hope for tomorrow.",
  "The art of living is in finding balance.",
  "Make learning a lifelong adventure.",
  "Spread positivity wherever you go.",
  "Your actions speak louder than words.",
  "Seek understanding, not just answers.",
  "Empathy connects us all.",
  "The path to mastery is continuous learning.",
  "Build bridges, not walls.",
  "Find strength in unity.",
  "Every person you meet knows something you don't.",
  "The joy of giving is immense.",
  "Be patient with yourself; growth takes time.",
  "Your inner strength is your greatest asset.",
  "See possibilities, not limitations.",
  "Illuminate the world with your unique light.",
  "The best investments are in yourself.",
  "A curious mind never runs out of things to learn.",
  "Harmony begins at home.",
  "The world needs your brilliance.",
  "Commit to learning, commit to growth.",
  "Your kindness is a powerful force.",
  "Embrace every lesson, big or small.",
  "The beauty of life is in its unfolding.",
  "Find your purpose and pursue it passionately.",
  "A moment of reflection can bring clarity.",
  "Your efforts truly make a difference.",
  "Inspire, innovate, ignite.",
  "The gift of knowledge is boundless.",
  "Every challenge refines your character.",
  "Create your own sunshine.",
  "The rhythm of life is change.",
  "Seek wisdom, share knowledge.",
  "Your resilience shines brightest in adversity.",
  "The future is an open book, write your chapter.",
  "Connect deeply, live fully.",
  "Be the reason someone smiles today.",
  "Learning expands your universe.",
  "The greatest wealth is health and peace of mind.",
  "Your journey is uniquely yours; embrace it.",
  "Find wonder in the everyday.",
  "The power of community builds us all.",
  "Radiate positive energy.",
  "Education is freedom.",
  "Your potential is a gift; what will you do with it?",
  "Keep moving forward, one step at a time.",
  "The heart of learning is curiosity.",
  "May your day be filled with purpose and joy."
];
// Function to get a unique quote, managing shown indices in localStorage
export const getUniqueQuote = (currentShownIndices) => {
  let updatedShownIndices = [...currentShownIndices]; // Work with a copy

  // Find indices that haven't been shown yet
  let availableIndices = motivationalQuotes
    .map((_, index) => index)
    .filter(index => !updatedShownIndices.includes(index));

  // If all quotes have been shown in the current cycle, reset the shown indices
  if (availableIndices.length === 0) {
    updatedShownIndices = []; // Clear the list to start over
    availableIndices = motivationalQuotes.map((_, index) => index); // All quotes are now available again
  }

  // Fallback in case something goes wrong (e.g., empty motivationalQuotes array)
  if (availableIndices.length === 0) {
    return {
      quote: "Seek knowledge, for it enlightens the mind.", // Default fallback quote
      newShownIndices: [] // Return empty to prevent issues
    };
  }

  // Select a random index from the currently available (unshown) quotes
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  updatedShownIndices.push(randomIndex); // Add the new index to the shown list

  // Return the selected quote and the updated list of shown indices
  return {
    quote: motivationalQuotes[randomIndex],
    newShownIndices: updatedShownIndices
  };
};

// Function to initialize shown indices from localStorage (no change)
export const getInitialShownQuoteIndices = () => {
  try {
    const stored = localStorage.getItem('shownQuoteIndices');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse shownQuoteIndices from localStorage:", e);
    return [];
  }
};

// Function to save shown indices to localStorage (no change)
export const saveShownQuoteIndices = (indices) => {
  try {
    localStorage.setItem('shownQuoteIndices', JSON.stringify(indices));
  } catch (e) {
    console.error("Failed to save shownQuoteIndices to localStorage:", e);
  }
};
const AccountRecoveryTwilio = "1JQKQD4NALTZT3J6TSLQ35S7"


// --- Comprehensive Mock Data (Used as fallback and for generating dynamic parts like Upcoming Classes & Chart data) ---
export const mockStudentsData = [
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
export const generateMockTimetableData = (studentsForNames) => {
  const today = new Date();
  const timetable = [];
  const subjects = ["Maths", "Physics", "Chemistry", "Biology"];
  // Use names from the provided studentsForNames, falling back to mockStudentsData if empty
  const studentsNames =
    studentsForNames.length > 0
      ? studentsForNames.map((s) => s.Name)
      : mockStudentsData.map((s) => s.Name);

  for (let i = 0; i < 7; i++) {
    // Generate classes for the next 7 days
    const classDate = addDays(today, i);
    for (let j = 0; j < 2; j++) {
      // Two classes per day
      const randomStudent =
        studentsNames[Math.floor(Math.random() * studentsNames.length)];
      const randomSubject =
        subjects[Math.floor(Math.random() * subjects.length)];
      const randomHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 4 PM
      const randomMinute = Math.random() < 0.5 ? "00" : "30";
      const ampm = randomHour < 12 ? "AM" : "PM";
      const displayHour =
        randomHour > 12 ? randomHour - 12 : randomHour === 0 ? 12 : randomHour; // Adjust for 12 AM/PM
      const time = `${displayHour
        .toString()
        .padStart(2, "0")}:${randomMinute} ${ampm}`;

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
export const generateMockTestScores = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const scores = months.map(
    () => Math.floor(Math.random() * (95 - 60 + 1)) + 60
  ); // Scores between 60 and 95
  return { labels: months, data: scores, label: "Avg. Score" };
};

// Generates mock data for student demographics (e.g., by subject)
export const generateMockStudentDemographics = (studentsData) => {
  const subjectCounts = {};
  const subjects = ["Maths", "Physics", "Chemistry", "Biology"]; // All possible subjects

  // Initialize counts for all subjects to 0
  subjects.forEach((sub) => {
    subjectCounts[sub] = 0;
  });

  // Count students per subject from the provided data
  (studentsData.length > 0 ? studentsData : mockStudentsData).forEach(
    (student) => {
      if (student.subject && subjectCounts.hasOwnProperty(student.subject)) {
        subjectCounts[student.subject]++;
      }
    }
  );

  const labels = Object.keys(subjectCounts);
  const data = Object.values(subjectCounts);
  const backgroundColors = [
    "#4a90e2",
    "#f5a623",
    "#4CAF50",
    "#F44336",
    "#9c27b0",
    "#ffeb3b",
  ]; // More colors

  return {
    labels,
    data,
    backgroundColors: backgroundColors.slice(0, labels.length),
  };
};

// Generates mock data for payment status (e.g., paid vs. unpaid)
export const generateMockPaymentStatus = (studentsData) => {
  let paidCount = 0;
  let unpaidCount = 0;

  (studentsData.length > 0 ? studentsData : mockStudentsData).forEach(
    (student) => {
      if (student.paymentStatus === "Paid") {
        paidCount++;
      } else {
        unpaidCount++;
      }
    }
  );

  return {
    labels: ["Paid", "Unpaid"],
    data: [paidCount, unpaidCount],
    backgroundColors: ["#4CAF50", "#F44336"],
  };
};
;
export  const getTimetablePdfTitle = () => {
    const pdfTimetables = combinedAndFilteredTimetables.filter(
      (item) => !item.isAutoGenerated
    );
    if (pdfTimetables.length === 0) {
      return "Timetable Report";
    }

    const uniqueSubjects = [
      ...new Set(pdfTimetables.map((item) => item.Subject)),
    ];

    if (uniqueSubjects.length === 1) {
      const subject = uniqueSubjects[0];
      if (subject === "Physics") {
        return "Dulam Timetable";
      } else if (subject === "Chemistry") {
        return "Bollam Timetable";
      }
    }
    return "General Timetable Report";
  };