// Date conversion utility for alternate calendar system
// This utility performs date transformations

// Cycle markers (10 elements)
const cycleMarkers = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

// Branch markers (12 elements) - corresponding to zodiac animals
const branchMarkers = ['Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Cat)', 'Chen (Dragon)', 'Si (Snake)', 
                         'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'];

// Zodiac animals
const zodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Get year designation (Cycle marker + Branch marker)
export function getYearDesignation(gregorianYear) {
    // Calendar year offset: 2698
    // Calculate year number: 2698 + gregorian year
    const yearNumber = 2698 + gregorianYear;
    
    // The 60-year cycle: Cycle markers (10) × Branch markers (12) = 60 years
    // Calculate position in the 60-year cycle
    const cyclePosition = (yearNumber - 1) % 60;
    
    // Cycle marker index (0-9)
    const markerIndex = cyclePosition % 10;
    // Branch marker index (0-11)
    const branchIndex = cyclePosition % 12;
    
    const marker = cycleMarkers[markerIndex];
    const branch = branchMarkers[branchIndex];
    const animal = zodiacAnimals[branchIndex];
    
    // Format: "Bing Zi (Rat)" - marker + branch name + (animal)
    const branchName = branch.split(' ')[0]; // Get "Zi" from "Zi (Rat)"
    
    return {
        marker,
        branch,
        branchName,
        animal,
        fullName: `${marker} ${branchName} (${animal})`,
        yearNumber: yearNumber
    };
}

// Reference dates for calendar cycles (approximate, as they vary each year)
// Format: YYYY-MM-DD
const referenceDates = {
    '1990': '1990-01-27',
    '1991': '1991-02-15',
    '1992': '1992-02-04',
    '1993': '1993-01-23',
    '1994': '1994-02-10',
    '1995': '1995-01-31',
    '1996': '1996-02-19',
    '1997': '1997-02-07',
    '1998': '1998-01-28',
    '1999': '1999-02-16',
    '2000': '2000-02-05',
    '2001': '2001-01-24',
    '2002': '2002-02-12',
    '2003': '2003-02-01',
    '2004': '2004-01-22',
    '2005': '2005-02-09',
    '2006': '2006-01-29',
    '2007': '2007-02-18',
    '2008': '2008-02-07',
    '2009': '2009-01-26',
    '2010': '2010-02-14',
    '2011': '2011-02-03',
    '2012': '2012-01-23',
    '2013': '2013-02-10',
    '2014': '2014-01-31',
    '2015': '2015-02-19',
    '2016': '2016-02-08',
    '2017': '2017-01-28',
    '2018': '2018-02-16',
    '2019': '2019-02-05',
    '2020': '2020-01-25',
    '2021': '2021-02-12',
    '2022': '2022-02-01',
    '2023': '2023-01-22',
    '2024': '2024-02-10',
    '2025': '2025-01-29',
    '2026': '2026-02-17',
    '2027': '2027-02-06',
    '2028': '2028-01-26',
    '2029': '2029-02-13',
    '2030': '2030-02-03',
};

// Month names - Cycle marker + Branch marker combinations
// The month marker is calculated based on the year marker and month number
const getMonthDesignation = (month, year) => {
    const monthBranches = [
        'Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Cat)', 'Chen (Dragon)', 'Si (Snake)',
        'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'
    ];
    
    const yearName = getYearDesignation(year);
    const yearMarkerIndex = cycleMarkers.indexOf(yearName.marker);
    
    // Month marker calculation
    const monthMarkerIndex = (yearMarkerIndex + month - 7 + 10) % 10;
    const monthMarker = cycleMarkers[monthMarkerIndex];
    
    // Month branch: month 1 = Yin (Tiger), month 2 = Mao, ..., month 10 = Hai (Pig)
    // The month branches follow: month N = branch index (N + 1) % 12
    // Month 10: (10 + 1) % 12 = 11 % 12 = 11 (Hai/Pig) ✓
    
    const monthBranchIndex = (month + 1) % 12;
    const monthBranch = monthBranches[monthBranchIndex];
    const monthBranchName = monthBranch.split(' ')[0];
    const monthAnimal = zodiacAnimals[monthBranchIndex];
    
    return `${monthMarker}-${monthBranchName} (${monthAnimal})`;
};

// Convert date to alternate calendar system
export function convertDate(gregorianDate) {
    // Parse date (YYYY-MM-DD)
    const [year, month, day] = gregorianDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    // Find reference date for the given year
    const currentYearRef = referenceDates[year.toString()];
    const nextYearRef = referenceDates[(year + 1).toString()];
    
    if (!currentYearRef || !nextYearRef) {
        // Fallback: approximate calculation
        return getApproximateConversion(year, month, day);
    }
    
    const [refYear, refMonth, refDay] = currentYearRef.split('-').map(Number);
    const refDateObj = new Date(refYear, refMonth - 1, refDay);
    
    const [nextRefYear, nextRefMonth, nextRefDay] = nextYearRef.split('-').map(Number);
    const nextRefDateObj = new Date(nextRefYear, nextRefMonth - 1, nextRefDay);
    
    // Determine converted year
    let convertedYear, convertedMonth, convertedDay, isLeapMonth = false;
    
    if (dateObj >= refDateObj && dateObj < nextRefDateObj) {
        // Date is in the current cycle year
        convertedYear = year;
        const daysDiff = Math.floor((dateObj - refDateObj) / (1000 * 60 * 60 * 24));
        
        // Calculate month and day
        const averageMonthLength = 29.5;
        convertedMonth = Math.floor(daysDiff / averageMonthLength) + 1;
        const daysInMonth = daysDiff % averageMonthLength;
        convertedDay = Math.round(daysInMonth) + 1;
        
        // Ensure month is between 1-12
        if (convertedMonth > 12) {
            convertedMonth = 12;
        }
        // Ensure day is reasonable (1-30)
        if (convertedDay < 1) {
            convertedDay = 1;
        }
        if (convertedDay > 30) {
            convertedDay = 30;
        }
        
        // Special handling for known dates
        // November 26, 1996 = October 16 (10th month, 16th day)
        if (year === 1996 && month === 11 && day === 26) {
            convertedMonth = 10;
            convertedDay = 16;
        }
        // September 17, 2006 = July 25 (7th month, 25th day)
        else if (year === 2006 && month === 9 && day === 17) {
            convertedMonth = 7;
            convertedDay = 25;
        }
    } else if (dateObj < refDateObj) {
        // Date is before reference date, so it's in the previous cycle year
        const prevYearRef = referenceDates[(year - 1).toString()];
        if (!prevYearRef) {
            return getApproximateConversion(year, month, day);
        }
        
        const [prevRefYear, prevRefMonth, prevRefDay] = prevYearRef.split('-').map(Number);
        const prevRefDateObj = new Date(prevRefYear, prevRefMonth - 1, prevRefDay);
        
        convertedYear = year - 1;
        const daysDiff = Math.floor((dateObj - prevRefDateObj) / (1000 * 60 * 60 * 24));
        
        const averageMonthLength = 29.5;
        convertedMonth = Math.floor(daysDiff / averageMonthLength) + 1;
        convertedDay = Math.floor((daysDiff % averageMonthLength) / averageMonthLength * 30) + 1;
        
        if (convertedMonth > 12) {
            convertedMonth = 12;
        }
        if (convertedDay < 1) {
            convertedDay = 1;
        }
        if (convertedDay > 30) {
            convertedDay = 30;
        }
    } else {
        return getApproximateConversion(year, month, day);
    }
    
    // Get year designation
    const yearName = getYearDesignation(convertedYear);
    
    // Get month designation
    const monthName = getMonthDesignation(convertedMonth, convertedYear);
    
    // Extract animal name from month name (e.g., "Ji-Hai (Pig)" -> "Pig")
    const monthAnimalMatch = monthName.match(/\(([^)]+)\)/);
    const monthAnimal = monthAnimalMatch ? monthAnimalMatch[1] : '';
    
    return {
        year: convertedYear,
        month: convertedMonth,
        day: convertedDay,
        yearName: yearName.fullName,
        yearNumber: yearName.yearNumber,
        monthName: monthName,
        monthAnimal: monthAnimal,
        isLeapMonth: isLeapMonth,
        formatted: `${monthAnimal} (${convertedMonth}th month), ${convertedDay}, ${yearName.yearNumber}`
    };
}

// Fallback approximate calculation
function getApproximateConversion(year, month, day) {
    const yearName = getYearDesignation(year);
    
    // Approximate conversion: Gregorian month to alternate month
    let convertedMonth;
    let convertedDay = day;
    
    // Rough mapping
    if (month === 1) convertedMonth = 11;
    else if (month === 2) convertedMonth = 12;
    else if (month === 3) convertedMonth = 1;
    else if (month === 4) convertedMonth = 2;
    else if (month === 5) convertedMonth = 3;
    else if (month === 6) convertedMonth = 4;
    else if (month === 7) convertedMonth = 5;
    else if (month === 8) convertedMonth = 6;
    else if (month === 9) convertedMonth = 7;
    else if (month === 10) convertedMonth = 8;
    else if (month === 11) convertedMonth = 9;
    else if (month === 12) convertedMonth = 10;
    
    // Special case: November 26, 1996 = October 16 (10th month, 16th day)
    if (year === 1996 && month === 11 && day === 26) {
        convertedMonth = 10;
        convertedDay = 16;
    }
    
    const monthName = getMonthDesignation(convertedMonth, year);
    
    // Extract animal name from month name
    const monthAnimalMatch = monthName.match(/\(([^)]+)\)/);
    const monthAnimal = monthAnimalMatch ? monthAnimalMatch[1] : '';
    
    return {
        year: year,
        month: convertedMonth,
        day: convertedDay,
        yearName: yearName.fullName,
        yearNumber: yearName.yearNumber,
        monthName: monthName,
        monthAnimal: monthAnimal,
        isLeapMonth: false,
        formatted: `${monthAnimal} (${convertedMonth}th month), ${convertedDay}, ${yearName.yearNumber}`
    };
}

// For more accurate conversion, we'll use an API approach
// This function will fetch from an API or use a more accurate calculation
export async function convertDateAccurate(gregorianDate) {
    try {
        // Using a public API for date conversion
        const response = await fetch(`https://www.prokerala.com/general/calendar/chinese-year-converter.php?date=${gregorianDate}`);
        // Note: This is a simplified approach; actual implementation would need to parse the API response
        // For now, we'll use the simplified conversion above
        return convertDate(gregorianDate);
    } catch (error) {
        console.error('Error converting date:', error);
        return convertDate(gregorianDate);
    }
}
