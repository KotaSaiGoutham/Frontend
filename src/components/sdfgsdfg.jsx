check this code don't make any css or classnames change 



const Dashboard = () => {

  const [userName, setUserName] = useState("");

  const [greetingInfo, setGreetingInfo] = useState({ text: "", className: "", imageUrl: "" });



  // States to be populated by API calls

  const [students, setStudents] = useState([]);

  const [employees, setEmployees] = useState([]);



  // States for other data, populated by test data logic

  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const [chartData, setChartData] = useState({

      testResults: {},

      studentDemographics: {},

      paymentStatus: {}

  });



  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");



  const navigate = useNavigate();



  // Function to determine greeting and background

  const getGreetingInfo = () => {

    const hour = new Date().getHours();

    let text, className, imageUrl;



    if (hour >= 5 && hour < 12) {

      text = "Morning";

      className = "morning";

      imageUrl =

        "https://images.unsplash.com/photo-1547463564-9273646736c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Sunny morning

    } else if (hour >= 12 && hour < 18) {

      text = "Afternoon";

      className = "afternoon";

      imageUrl =

        "https://images.unsplash.com/photo-1549490349-8643362c395f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Bright afternoon

    } else {

      text = "Evening";

      className = "evening";

      imageUrl =

        "https://images.unsplash.com/photo-1508906660126-a05d4f3b6d51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Calm evening/night

    }

    return { text, className, imageUrl };

  };

useEffect(() => {

        const info = getGreetingInfo();

        setGreetingInfo(info);



        document.documentElement.style.setProperty(

            "--current-greeting-bg-image",

            `url(${info.imageUrl})`

        );



        const storedUserName = localStorage.getItem("userName");

        if (storedUserName) {

            setUserName(storedUserName);

        } else {

            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserEmail) {

                setUserName(storedUserEmail.split("@")[0]);

            }

        }



        const fetchAndGenerateDashboardData = async () => {

            const token = localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;

            }



            setIsLoading(true);

            setError(""); // Clear previous errors



            let fetchedStudents = [];

            let fetchedEmployees = [];

            let rawTimetableData = []; // To store raw timetable data from API



            try {

                // --- API Call for Students ---

                const studentsResponse = await fetch(

                    "http://localhost:5000/api/data/students",

                    {

                        headers: { Authorization: `Bearer ${token}` },

                    }

                );

                const studentsData = await studentsResponse.json();

                if (!studentsResponse.ok) {

                    throw new Error(studentsData.message || "Failed to fetch students from API.");

                }

                fetchedStudents = studentsData;

                setTotalStudents(fetchedStudents.length);



                // Calculate fee collection with corrected payment status access

                const feeCollection = fetchedStudents.reduce((sum, student) => {

                    // Use bracket notation for properties with spaces

                    const paymentStatus = student["Payment Status"]; 

                    // Handle both numeric 'monthlyFee' and string 'Monthly Fee'

                    const monthlyFee = typeof student.monthlyFee === 'number' 

                        ? student.monthlyFee 

                        : parseFloat(student["Monthly Fee"]);



                    if (paymentStatus === "Paid" && !isNaN(monthlyFee)) {

                        return sum + monthlyFee;

                    }

                    return sum;

                }, 0);

                setTotalFeeCollection(feeCollection);





                // --- API Call for Employees ---

                const employeesResponse = await fetch(

                    "http://localhost:5000/api/data/employees", // Corrected typo: 'employees'

                    {

                        headers: { Authorization: `Bearer ${token}` },

                    }

                );

                const employeesData = await employeesResponse.json();

                if (!employeesResponse.ok) {

                    throw new Error(employeesData.message || "Failed to fetch employees from API.");

                }

                fetchedEmployees = employeesData;

                setTotalEmployees(fetchedEmployees.length);



                // --- API Call for Timetable --- (Data for Upcoming Classes Card)

                const timetableResponse = await fetch(

                    "http://localhost:5000/api/data/timetable",

                    {

                        headers: { Authorization: `Bearer ${token}` },

                    }

                );

                const timetableData = await timetableResponse.json();

                if (!timetableResponse.ok) {

                    throw new Error(timetableData.message || "Failed to fetch timetable from API.");

                }

                rawTimetableData = timetableData; // Store the raw data for processing



            } catch (err) {

                console.error("Error fetching API data:", err);

                setError(err.message || "Failed to load API data. Displaying mock counts.");

                if (err.message.includes("authorized")) {

                    localStorage.removeItem("token");

                    navigate("/login");

                }

                // Fallback to mock data for counts if API fails

                setTotalStudents(mockStudentsData.length);

                setTotalEmployees(mockEmployeesData.length);

                const mockFeeCollection = mockStudentsData.reduce((sum, student) => {

                    const paymentStatus = student["Payment Status"];

                    const monthlyFee = typeof student.monthlyFee === 'number'

                        ? student.monthlyFee

                        : parseFloat(student["Monthly Fee"]);

                    if (paymentStatus === "Paid" && !isNaN(monthlyFee)) {

                        return sum + monthlyFee;

                    }

                    return sum;

                }, 0);

                setTotalFeeCollection(mockFeeCollection);

                // If API fails, upcomingClasses will remain empty, or you can populate with mock timetable data here if you have it

                // setUpcomingClasses(generateMockTimetableData(mockStudentsData)); // If you want mock data on API failure

            } finally {

                // --- Data Processing for Dashboard Display ---



                // Process Timetable Data for Upcoming Classes Card

                const mappedTimetable = rawTimetableData.map((item) => {

                    const timeValue = item.Time || "";

                    const timePart = timeValue.split("to")[0]?.trim(); // e.g., "09:00am"



                    let parsedDateTime;

                    if (item.Day && timePart) {

                        const combinedDateTimeString = `${item.Day} ${timePart}`;

                        // Make sure the format string matches your data precisely

                        parsedDateTime = parse(combinedDateTimeString, "dd/MM/yyyy hh:mma", new Date());

                    } else if (item.Day) {

                        parsedDateTime = parse(item.Day, "dd/MM/yyyy", new Date());

                    } else {

                        parsedDateTime = new Date(NaN); // Handle cases with missing date/time

                    }



                    return {

                        id: item.id,

                        subject: item.Subject,

                        facultyName: item.Faculty, // Use Faculty name for the "Student" column in this context

                        dateTimeObject: parsedDateTime,

                        dayString: item.Day, // Keep original day string for display

                        timeString: item.Time, // Keep original time string for display

                        topic: item.Topic || 'N/A', // Add topic, default to 'N/A' if missing

                    };

                }).filter(item => item.dateTimeObject && !isNaN(item.dateTimeObject)); // Filter out invalid dates



                // Filter and sort for the dashboard's upcoming classes card (today and future, limited to 5)

                const now = new Date();

                const upcomingClassesForDashboard = mappedTimetable

                    .filter(cls => cls.dateTimeObject && cls.dateTimeObject.getTime() >= now.getTime())

                    .sort((a, b) => a.dateTimeObject.getTime() - b.dateTimeObject.getTime())

                    .slice(0, 5); // Limit to 5 upcoming classes



                setUpcomingClasses(upcomingClassesForDashboard); // Update state for the table



                // --- Generate Chart Data (using fetched or mock data if API fails) ---

                const studentsForCharts = fetchedStudents.length > 0 ? fetchedStudents : mockStudentsData;

                setChartData({

                    testResults: generateMockTestScores(), 

                    studentDemographics: generateMockStudentDemographics(studentsForCharts),

                    paymentStatus: generateMockPaymentStatus(studentsForCharts)

                });



                setIsLoading(false);

            }

        };



        fetchAndGenerateDashboardData();

    }, [navigate]); // navigate is a dependency





  // Calculate dashboard metrics from state (which is populated by API or mock fallback)

  const totalStudents = students.length;

  const totalEmployees = employees.length;



  // Calculate Fee Collection (uses data from 'students' state, which can be API or mock)

const totalFeeCollection = students.reduce((sum, student) => {

    // Corrected: Access "Payment Status" using bracket notation

    // Corrected: Access "Monthly Fee" using bracket notation if it's the string version

    // Check if the property exists first to avoid errors on malformed data

    const paymentStatus = student["Payment Status"];

    const monthlyFee = typeof student.monthlyFee === 'number' ? student.monthlyFee : parseFloat(student["Monthly Fee"]);



    if (paymentStatus === "Paid" && !isNaN(monthlyFee)) { // Check if monthlyFee is a valid number

        return sum + monthlyFee;

    }

    return sum;

}, 0);





      };

    } 



  if (isLoading) {

    return (

      <div className="dashboard-loading">

        <div className="spinner"></div>

        <p>Loading Dashboard Data...</p>

      </div>

    );

  }



  if (error) {

    return (

      <div className="dashboard-error">

        <h3>Error: {error}</h3>

        <p>Please ensure your backend is running at `http://localhost:5000` and you are logged in.</p>

        <button onClick={() => window.location.reload()}>

          Retry

        </button>

      </div>

    );

  }



  return (

   >

      </div>



      {/* Main Content Grid (Upcoming Classes, Test Results, Student Stats, Fee Collection Chart) */}

      <div className="main-content-grid">

        {/* Upcoming Classes Card (Test Data) */}

       <div className="dashboard-card upcoming-classes-card fade-in-up delay-4">

                <h2><FaCalendarCheck className="card-icon" /> Upcoming Classes</h2>

                {upcomingClasses.length > 0 ? (

                    <div className="table-responsive">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>Faculty</th> {/* Changed to Faculty as per your API structure */}

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Subject</th>

                                    <th>Topic</th> {/* <-- NEW COLUMN */}

                                </tr>

                            </thead>

                            <tbody>

                                {upcomingClasses.map((cls) => (

                                    <tr key={cls.id}>

                                        <td>{cls.facultyName}</td> {/* Display Faculty Name */}

                                        <td>{format(cls.dateTimeObject, "MMM dd, yyyy")}</td> {/* Use dateTimeObject for robust date formatting */}

                                        <td>{cls.timeString}</td> {/* Use timeString for display */}

                                        <td>{cls.subject}</td>

                                        <td>{cls.topic}</td> {/* <-- DISPLAY TOPIC */}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <p className="no-data-message">No upcoming classes scheduled.</p>

                )}

            </div>



    </div>

  );

};



export default Dashboard; don't use mock data students employess upcoming other you may use it 