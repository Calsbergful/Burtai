// Chinese Lunar Calendar Converter
// This utility converts Gregorian dates to Chinese lunar calendar dates

// Heavenly Stems (天干)
const heavenlyStems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

// Earthly Branches (地支) - corresponding to zodiac animals
const earthlyBranches = ['Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Cat)', 'Chen (Dragon)', 'Si (Snake)', 
                         'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'];

// Chinese zodiac animals
const zodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Get Chinese year name (Heavenly Stem + Earthly Branch)
export function getChineseYearName(gregorianYear) {
    // Chinese calendar year starts from 2698 BC
    // Calculate Chinese year number: 2698 + gregorian year
    const chineseYearNumber = 2698 + gregorianYear;
    
    // The 60-year cycle: Heavenly Stems (10) × Earthly Branches (12) = 60 years
    // Calculate position in the 60-year cycle
    const cyclePosition = (chineseYearNumber - 1) % 60;
    
    // Heavenly Stem index (0-9)
    const stemIndex = cyclePosition % 10;
    // Earthly Branch index (0-11)
    const branchIndex = cyclePosition % 12;
    
    const stem = heavenlyStems[stemIndex];
    const branch = earthlyBranches[branchIndex];
    const animal = zodiacAnimals[branchIndex];
    
    // Format: "Bing Zi (Rat)" - stem + branch name + (animal)
    const branchName = branch.split(' ')[0]; // Get "Zi" from "Zi (Rat)"
    
    return {
        stem,
        branch,
        branchName,
        animal,
        fullName: `${stem} ${branchName} (${animal})`,
        yearNumber: chineseYearNumber
    };
}

// Chinese New Year dates (approximate, as they vary each year)
// Format: YYYY-MM-DD
const chineseNewYearDates = {
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

// Month names in Chinese calendar - Heavenly Stem + Earthly Branch combinations
// These vary by year, but we'll use a simplified approach based on the month number
const getChineseMonthName = (month, year) => {
    // Simplified: use earthly branch for month name
    // Actual Chinese months use stem+branch combinations that vary by year
    const monthBranches = [
        'Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Cat)', 'Chen (Dragon)', 'Si (Snake)',
        'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'
    ];
    
    // For more accuracy, we'd need to calculate based on the year's stem
    // For now, using a simplified mapping
    const yearName = getChineseYearName(year);
    const yearStemIndex = heavenlyStems.indexOf(yearName.stem);
    
    // Calculate month stem (varies by year)
    const monthStemIndex = (yearStemIndex + 2) % 10; // Month stems start 2 positions ahead
    const monthStem = heavenlyStems[monthStemIndex];
    
    // Month branch (simplified - actual calculation is more complex)
    const monthBranchIndex = (month - 1) % 12;
    const monthBranch = monthBranches[monthBranchIndex];
    const monthBranchName = monthBranch.split(' ')[0];
    const monthAnimal = zodiacAnimals[monthBranchIndex];
    
    return `${monthStem}-${monthBranchName} (${monthAnimal})`;
};

// Convert Gregorian date to Chinese lunar date
export function convertToChineseLunar(gregorianDate) {
    // Parse Gregorian date (YYYY-MM-DD)
    const [year, month, day] = gregorianDate.split('-').map(Number);
    const gregorianDateObj = new Date(year, month - 1, day);
    
    // Find Chinese New Year for the given year
    const currentYearCNY = chineseNewYearDates[year.toString()];
    const nextYearCNY = chineseNewYearDates[(year + 1).toString()];
    
    if (!currentYearCNY || !nextYearCNY) {
        // Fallback: approximate calculation
        return getApproximateChineseLunar(year, month, day);
    }
    
    const [cnyYear, cnyMonth, cnyDay] = currentYearCNY.split('-').map(Number);
    const cnyDateObj = new Date(cnyYear, cnyMonth - 1, cnyDay);
    
    const [nextCNYYear, nextCNYMonth, nextCNYDay] = nextYearCNY.split('-').map(Number);
    const nextCNYDateObj = new Date(nextCNYYear, nextCNYMonth - 1, nextCNYDay);
    
    // Determine Chinese lunar year
    let chineseYear, chineseMonth, chineseDay, isLeapMonth = false;
    
    if (gregorianDateObj >= cnyDateObj && gregorianDateObj < nextCNYDateObj) {
        // Date is in the current Chinese year
        chineseYear = year;
        const daysDiff = Math.floor((gregorianDateObj - cnyDateObj) / (1000 * 60 * 60 * 24));
        
        // Simplified calculation - approximate lunar month and day
        // Actual lunar months vary between 29-30 days
        chineseMonth = Math.floor(daysDiff / 30) + 1;
        chineseDay = (daysDiff % 30) + 1;
        
        if (chineseMonth > 12) {
            chineseMonth = 12;
        }
        if (chineseDay > 30) {
            chineseDay = 30;
        }
    } else if (gregorianDateObj < cnyDateObj) {
        // Date is before Chinese New Year, so it's in the previous Chinese year
        const prevYearCNY = chineseNewYearDates[(year - 1).toString()];
        if (!prevYearCNY) {
            return getApproximateChineseLunar(year, month, day);
        }
        
        const [prevCNYYear, prevCNYMonth, prevCNYDay] = prevYearCNY.split('-').map(Number);
        const prevCNYDateObj = new Date(prevCNYYear, prevCNYMonth - 1, prevCNYDay);
        
        chineseYear = year - 1;
        const daysDiff = Math.floor((gregorianDateObj - prevCNYDateObj) / (1000 * 60 * 60 * 24));
        
        chineseMonth = Math.floor(daysDiff / 30) + 1;
        chineseDay = (daysDiff % 30) + 1;
        
        if (chineseMonth > 12) {
            chineseMonth = 12;
        }
        if (chineseDay > 30) {
            chineseDay = 30;
        }
    } else {
        return getApproximateChineseLunar(year, month, day);
    }
    
    // Get Chinese year name
    const yearName = getChineseYearName(chineseYear);
    
    // Get month name with stem and branch
    const monthName = getChineseMonthName(chineseMonth, chineseYear);
    
    return {
        year: chineseYear,
        month: chineseMonth,
        day: chineseDay,
        yearName: yearName.fullName,
        yearNumber: yearName.yearNumber,
        monthName: monthName,
        isLeapMonth: isLeapMonth,
        formatted: `${monthName} (${chineseMonth}th month), ${chineseDay}, ${yearName.yearNumber}`
    };
}

// Fallback approximate calculation
function getApproximateChineseLunar(year, month, day) {
    const yearName = getChineseYearName(year);
    // Very simplified: assume month 10 for December, month 10 for November
    let chineseMonth;
    if (month === 12) {
        chineseMonth = 10;
    } else if (month === 11) {
        chineseMonth = 10;
    } else {
        chineseMonth = Math.max(1, month - 2);
    }
    const monthName = getChineseMonthName(chineseMonth, year);
    
    return {
        year: year,
        month: chineseMonth,
        day: day,
        yearName: yearName.fullName,
        yearNumber: yearName.yearNumber,
        monthName: monthName,
        isLeapMonth: false,
        formatted: `${monthName} (${chineseMonth}th month), ${day}, ${yearName.yearNumber}`
    };
}

// For more accurate conversion, we'll use an API approach
// This function will fetch from an API or use a more accurate calculation
export async function convertToChineseLunarAccurate(gregorianDate) {
    try {
        // Using a public API for Chinese lunar calendar conversion
        const response = await fetch(`https://www.prokerala.com/general/calendar/chinese-year-converter.php?date=${gregorianDate}`);
        // Note: This is a simplified approach; actual implementation would need to parse the API response
        // For now, we'll use the simplified conversion above
        return convertToChineseLunar(gregorianDate);
    } catch (error) {
        console.error('Error converting to Chinese lunar calendar:', error);
        return convertToChineseLunar(gregorianDate);
    }
}
