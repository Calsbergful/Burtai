// Chinese Zodiac years and their start dates
// Chinese New Year dates (approximate, actual dates vary slightly each year)
export const chineseNewYearDates = {
    2024: { date: '2024-02-10', zodiac: 'Dragon' },
    2025: { date: '2025-01-29', zodiac: 'Snake' },
    2026: { date: '2026-02-17', zodiac: 'Horse' },
    2027: { date: '2027-02-06', zodiac: 'Goat' },
    2028: { date: '2028-01-26', zodiac: 'Monkey' },
    2029: { date: '2029-02-13', zodiac: 'Rooster' },
    2030: { date: '2030-02-03', zodiac: 'Dog' },
    2031: { date: '2031-01-23', zodiac: 'Pig' },
    2032: { date: '2032-02-11', zodiac: 'Rat' },
    2033: { date: '2033-01-31', zodiac: 'Ox' },
    2034: { date: '2034-02-19', zodiac: 'Tiger' },
    2035: { date: '2035-02-08', zodiac: 'Cat' },
};

// Chinese Zodiac cycle (12 animals)
export const zodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Lithuanian translations
export const zodiacTranslations = {
    'Rat': 'Žiurkė',
    'Ox': 'Jautis',
    'Tiger': 'Tigras',
    'Cat': 'Katė',
    'Dragon': 'Drakonas',
    'Snake': 'Gyvatė',
    'Horse': 'Arklys',
    'Goat': 'Ožka',
    'Monkey': 'Beždžionė',
    'Rooster': 'Gaidys',
    'Dog': 'Šuo',
    'Pig': 'Kiaulė'
};

// Emojis for each zodiac animal
export const zodiacEmojis = {
    'Rat': '🐭',
    'Ox': '🐂',
    'Tiger': '🐅',
    'Cat': '🐱',
    'Dragon': '🐉',
    'Snake': '🐍',
    'Horse': '🐴',
    'Goat': '🐐',
    'Monkey': '🐵',
    'Rooster': '🐓',
    'Dog': '🐕',
    'Pig': '🐷'
};

// Get Chinese zodiac for a given date
export function getChineseZodiac(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Check if we have the exact date for this year
    if (chineseNewYearDates[year]) {
        const newYearDate = chineseNewYearDates[year].date;
        const [newYear, newMonth, newDay] = newYearDate.split('-').map(Number);
        
        // If date is before Chinese New Year, use previous year's zodiac
        if (month < newMonth || (month === newMonth && day < newDay)) {
            const prevYear = year - 1;
            if (chineseNewYearDates[prevYear]) {
                return {
                    zodiac: chineseNewYearDates[prevYear].zodiac,
                    startDate: chineseNewYearDates[year].date,
                    year: year
                };
            }
        } else {
            return {
                zodiac: chineseNewYearDates[year].zodiac,
                startDate: chineseNewYearDates[year].date,
                year: year
            };
        }
    }
    
    // Fallback: calculate based on year cycle (1900 is Rat year)
    const baseYear = 1900;
    const zodiacIndex = (year - baseYear) % 12;
    const zodiac = zodiacAnimals[zodiacIndex];
    
    return {
        zodiac: zodiac,
        startDate: null,
        year: year
    };
}

// Check if a date is the start of a Chinese zodiac year
export function isChineseNewYear(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check current year
    if (chineseNewYearDates[year] && chineseNewYearDates[year].date === dateStr) {
        return true;
    }
    
    return false;
}

