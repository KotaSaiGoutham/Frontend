export const sortAndFilterTimetableData = (data) => {
    const now = new Date(); // Current date and time
    const todayFormatted = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY

    // Helper to parse time string into minutes from midnight
    const timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period && period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
        } else if (period && period.toLowerCase() === 'am' && hours === 12) { // Midnight 12 AM
            hours = 0;
        }
        return hours * 60 + minutes;
    };

    // Filter out past events first
    const futureClasses = data.filter(item => {
        const [day, month, year] = item.Day.split('/').map(Number);
        const classDate = new Date(year, month - 1, day); // Month is 0-indexed

        const [startTimeStr] = item.Time.split(' to ');
        const classStartTimeMinutes = timeToMinutes(startTimeStr);

        // Create a Date object for the class start time on its respective day
        const classDateTime = new Date(year, month - 1, day, Math.floor(classStartTimeMinutes / 60), classStartTimeMinutes % 60);

        // If the class date is in the future, include it
        if (classDateTime.getTime() > now.getTime()) {
            return true;
        }
        return false;
    });

    // Then sort the remaining future classes
    return futureClasses.sort((a, b) => {
        // Parse dates for comparison
        const [dayA, monthA, yearA] = a.Day.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);

        const [dayB, monthB, yearB] = b.Day.split('/').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB);

        const timeA = timeToMinutes(a.Time.split(' to ')[0]);
        const timeB = timeToMinutes(b.Time.split(' to ')[0]);

        // Prioritize today's *remaining* classes (those after current time)
        const isTodayA = a.Day === todayFormatted;
        const isTodayB = b.Day === todayFormatted;

        if (isTodayA && !isTodayB) {
            return -1; // 'a' is today, 'b' is not, so 'a' comes first
        }
        if (!isTodayA && isTodayB) {
            return 1; // 'b' is today, 'a' is not, so 'b' comes first
        }

        // If both or neither are today, sort by date
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }

        // If dates are the same, sort by time
        return timeA - timeB;
    });
};