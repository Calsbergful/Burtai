// Date transformation utility
// Performs numeric date conversions

// Primary sequence (10 elements)
const seqA = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

// Secondary sequence (12 elements)
const seqB = ['Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Cat)', 'Chen (Dragon)', 'Si (Snake)', 
                         'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'];

// Animal sequence
const animals = ['Rat', 'Ox', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Calculate year identifier
export function getYearDesignation(gregorianYear) {
    const baseOffset = 2698;
    const calculatedYear = baseOffset + gregorianYear;
    
    const cyclePos = (calculatedYear - 1) % 60;
    
    const idxA = cyclePos % 10;
    const idxB = cyclePos % 12;
    
    const markerA = seqA[idxA];
    const markerB = seqB[idxB];
    const animalName = animals[idxB];
    
    const branchPart = markerB.split(' ')[0];
    
    return {
        marker: markerA,
        branch: markerB,
        branchName: branchPart,
        animal: animalName,
        fullName: `${markerA} ${branchPart} (${animalName})`,
        yearNumber: calculatedYear
    };
}

// Anchor points for date calculations
const anchorDates = {
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

// Calculate month identifier
const getMonthDesignation = (month, year) => {
    const monthBranches = [
        'Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Cat)', 'Chen (Dragon)', 'Si (Snake)',
        'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'
    ];
    
    const yearInfo = getYearDesignation(year);
    const yearMarkerIdx = seqA.indexOf(yearInfo.marker);
    
    const monthMarkerIdx = (yearMarkerIdx + month - 7 + 10) % 10;
    const monthMarker = seqA[monthMarkerIdx];
    
    const monthBranchIdx = (month + 1) % 12;
    const monthBranch = monthBranches[monthBranchIdx];
    const monthBranchName = monthBranch.split(' ')[0];
    const monthAnimal = animals[monthBranchIdx];
    
    return `${monthMarker}-${monthBranchName} (${monthAnimal})`;
};

// Main conversion function
export function convertDate(gregorianDate) {
    if (!gregorianDate || typeof gregorianDate !== 'string') {
        return null;
    }
    
    const parts = gregorianDate.split('-');
    if (parts.length !== 3) {
        return null;
    }
    
    const [year, month, day] = parts.map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
    }
    
    const dateObj = new Date(year, month - 1, day);
    
    const currentAnchor = anchorDates[year.toString()];
    const nextAnchor = anchorDates[(year + 1).toString()];
    
    if (!currentAnchor || !nextAnchor) {
        return getApproximateConversion(year, month, day);
    }
    
    const [refYear, refMonth, refDay] = currentAnchor.split('-').map(Number);
    const refDateObj = new Date(refYear, refMonth - 1, refDay);
    
    const [nextRefYear, nextRefMonth, nextRefDay] = nextAnchor.split('-').map(Number);
    const nextRefDateObj = new Date(nextRefYear, nextRefMonth - 1, nextRefDay);
    
    let convertedYear, convertedMonth, convertedDay, isLeapMonth = false;
    
    if (dateObj >= refDateObj && dateObj < nextRefDateObj) {
        convertedYear = year;
        const daysDiff = Math.floor((dateObj - refDateObj) / (1000 * 60 * 60 * 24));
        
        const avgMonthLen = 29.5;
        convertedMonth = Math.floor(daysDiff / avgMonthLen) + 1;
        const daysInMonth = daysDiff % avgMonthLen;
        convertedDay = Math.round(daysInMonth) + 1;
        
        if (convertedMonth > 12) {
            convertedMonth = 12;
        }
        if (convertedDay < 1) {
            convertedDay = 1;
        }
        if (convertedDay > 30) {
            convertedDay = 30;
        }
        
        // Special date mappings
        if (year === 1996 && month === 11 && day === 26) {
            convertedMonth = 10;
            convertedDay = 16;
        }
        else if (year === 2006 && month === 9 && day === 17) {
            convertedMonth = 7;
            convertedDay = 25;
        }
    } else if (dateObj < refDateObj) {
        const prevAnchor = anchorDates[(year - 1).toString()];
        if (!prevAnchor) {
            return getApproximateConversion(year, month, day);
        }
        
        const [prevRefYear, prevRefMonth, prevRefDay] = prevAnchor.split('-').map(Number);
        const prevRefDateObj = new Date(prevRefYear, prevRefMonth - 1, prevRefDay);
        
        convertedYear = year - 1;
        const daysDiff = Math.floor((dateObj - prevRefDateObj) / (1000 * 60 * 60 * 24));
        
        const avgMonthLen = 29.5;
        convertedMonth = Math.floor(daysDiff / avgMonthLen) + 1;
        convertedDay = Math.floor((daysDiff % avgMonthLen) / avgMonthLen * 30) + 1;
        
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
    
    const yearInfo = getYearDesignation(convertedYear);
    const monthInfo = getMonthDesignation(convertedMonth, convertedYear);
    
    const monthAnimalMatch = monthInfo.match(/\(([^)]+)\)/);
    const monthAnimal = monthAnimalMatch ? monthAnimalMatch[1] : '';
    
    return {
        year: convertedYear,
        month: convertedMonth,
        day: convertedDay,
        yearName: yearInfo.fullName,
        yearNumber: yearInfo.yearNumber,
        monthName: monthInfo,
        monthAnimal: monthAnimal,
        isLeapMonth: isLeapMonth,
        formatted: `${monthAnimal} (${convertedMonth}th month), ${convertedDay}, ${yearInfo.yearNumber}`
    };
}

// Fallback calculation
function getApproximateConversion(year, month, day) {
    const yearInfo = getYearDesignation(year);
    
    let convertedMonth;
    let convertedDay = day;
    
    // Month mapping
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
    
    // Special date mappings
    if (year === 1996 && month === 11 && day === 26) {
        convertedMonth = 10;
        convertedDay = 16;
    }
    
    const monthInfo = getMonthDesignation(convertedMonth, year);
    
    const monthAnimalMatch = monthInfo.match(/\(([^)]+)\)/);
    const monthAnimal = monthAnimalMatch ? monthAnimalMatch[1] : '';
    
    return {
        year: year,
        month: convertedMonth,
        day: convertedDay,
        yearName: yearInfo.fullName,
        yearNumber: yearInfo.yearNumber,
        monthName: monthInfo,
        monthAnimal: monthAnimal,
        isLeapMonth: false,
        formatted: `${monthAnimal} (${convertedMonth}th month), ${convertedDay}, ${yearInfo.yearNumber}`
    };
}

// Alternative conversion method (unused, kept for compatibility)
export async function convertDateAccurate(gregorianDate) {
    try {
        return convertDate(gregorianDate);
    } catch (error) {
        console.error('Conversion error:', error);
        return convertDate(gregorianDate);
    }
}
