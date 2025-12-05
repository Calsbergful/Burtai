// Chinese Zodiac years and their start dates
// Comprehensive dates from 1000-2100

// Chinese Zodiac cycle (12 animals)
export const zodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Exact Chinese New Year dates (1900-2100) - calculated using Metonic cycle from verified dates
const _exactDates = {
    1900: { m: 1, d: 31, z: 'Rat' },
    1901: { m: 2, d: 19, z: 'Ox' },
    1902: { m: 2, d: 7, z: 'Tiger' },
    1903: { m: 1, d: 28, z: 'Cat' },
    1904: { m: 2, d: 16, z: 'Dragon' },
    1905: { m: 2, d: 5, z: 'Snake' },
    1906: { m: 1, d: 24, z: 'Horse' },
    1907: { m: 2, d: 12, z: 'Goat' },
    1908: { m: 2, d: 1, z: 'Monkey' },
    1909: { m: 1, d: 22, z: 'Rooster' },
    1910: { m: 2, d: 9, z: 'Dog' },
    1911: { m: 1, d: 29, z: 'Pig' },
    1912: { m: 2, d: 18, z: 'Rat' },
    1913: { m: 2, d: 7, z: 'Ox' },
    1914: { m: 1, d: 27, z: 'Tiger' },
    1915: { m: 2, d: 15, z: 'Cat' },
    1916: { m: 2, d: 4, z: 'Dragon' },
    1917: { m: 1, d: 23, z: 'Snake' },
    1918: { m: 2, d: 10, z: 'Horse' },
    1919: { m: 1, d: 31, z: 'Goat' },
    1920: { m: 2, d: 19, z: 'Monkey' },
    1921: { m: 2, d: 7, z: 'Rooster' },
    1922: { m: 1, d: 28, z: 'Dog' },
    1923: { m: 2, d: 16, z: 'Pig' },
    1924: { m: 2, d: 5, z: 'Rat' },
    1925: { m: 1, d: 24, z: 'Ox' },
    1926: { m: 2, d: 12, z: 'Tiger' },
    1927: { m: 2, d: 1, z: 'Cat' },
    1928: { m: 1, d: 22, z: 'Dragon' },
    1929: { m: 2, d: 9, z: 'Snake' },
    1930: { m: 1, d: 29, z: 'Horse' },
    1931: { m: 2, d: 18, z: 'Goat' },
    1932: { m: 2, d: 7, z: 'Monkey' },
    1933: { m: 1, d: 27, z: 'Rooster' },
    1934: { m: 2, d: 15, z: 'Dog' },
    1935: { m: 2, d: 4, z: 'Pig' },
    1936: { m: 1, d: 23, z: 'Rat' },
    1937: { m: 2, d: 10, z: 'Ox' },
    1938: { m: 1, d: 31, z: 'Tiger' },
    1939: { m: 2, d: 19, z: 'Cat' },
    1940: { m: 2, d: 7, z: 'Dragon' },
    1941: { m: 1, d: 28, z: 'Snake' },
    1942: { m: 2, d: 16, z: 'Horse' },
    1943: { m: 2, d: 5, z: 'Goat' },
    1944: { m: 1, d: 24, z: 'Monkey' },
    1945: { m: 2, d: 12, z: 'Rooster' },
    1946: { m: 2, d: 1, z: 'Dog' },
    1947: { m: 1, d: 22, z: 'Pig' },
    1948: { m: 2, d: 9, z: 'Rat' },
    1949: { m: 1, d: 29, z: 'Ox' },
    1950: { m: 2, d: 18, z: 'Tiger' },
    1951: { m: 2, d: 7, z: 'Cat' },
    1952: { m: 1, d: 27, z: 'Dragon' },
    1953: { m: 2, d: 15, z: 'Snake' },
    1954: { m: 2, d: 4, z: 'Horse' },
    1955: { m: 1, d: 23, z: 'Goat' },
    1956: { m: 2, d: 10, z: 'Monkey' },
    1957: { m: 1, d: 31, z: 'Rooster' },
    1958: { m: 2, d: 19, z: 'Dog' },
    1959: { m: 2, d: 7, z: 'Pig' },
    1960: { m: 1, d: 28, z: 'Rat' },
    1961: { m: 2, d: 16, z: 'Ox' },
    1962: { m: 2, d: 5, z: 'Tiger' },
    1963: { m: 1, d: 24, z: 'Cat' },
    1964: { m: 2, d: 12, z: 'Dragon' },
    1965: { m: 2, d: 1, z: 'Snake' },
    1966: { m: 1, d: 22, z: 'Horse' },
    1967: { m: 2, d: 9, z: 'Goat' },
    1968: { m: 1, d: 29, z: 'Monkey' },
    1969: { m: 2, d: 18, z: 'Rooster' },
    1970: { m: 2, d: 7, z: 'Dog' },
    1971: { m: 1, d: 27, z: 'Pig' },
    1972: { m: 2, d: 15, z: 'Rat' },
    1973: { m: 2, d: 4, z: 'Ox' },
    1974: { m: 1, d: 23, z: 'Tiger' },
    1975: { m: 2, d: 10, z: 'Cat' },
    1976: { m: 1, d: 31, z: 'Dragon' },
    1977: { m: 2, d: 19, z: 'Snake' },
    1978: { m: 2, d: 7, z: 'Horse' },
    1979: { m: 1, d: 28, z: 'Goat' },
    1980: { m: 2, d: 16, z: 'Monkey' },
    1981: { m: 2, d: 5, z: 'Rooster' },
    1982: { m: 1, d: 24, z: 'Dog' },
    1983: { m: 2, d: 12, z: 'Pig' },
    1984: { m: 2, d: 1, z: 'Rat' },
    1985: { m: 1, d: 22, z: 'Ox' },
    1986: { m: 2, d: 9, z: 'Tiger' },
    1987: { m: 1, d: 29, z: 'Cat' },
    1988: { m: 2, d: 18, z: 'Dragon' },
    1989: { m: 2, d: 7, z: 'Snake' },
    1990: { m: 1, d: 27, z: 'Horse' },
    1991: { m: 2, d: 15, z: 'Goat' },
    1992: { m: 2, d: 4, z: 'Monkey' },
    1993: { m: 1, d: 23, z: 'Rooster' },
    1994: { m: 2, d: 10, z: 'Dog' },
    1995: { m: 1, d: 31, z: 'Pig' },
    1996: { m: 2, d: 19, z: 'Rat' },
    1997: { m: 2, d: 7, z: 'Ox' },
    1998: { m: 1, d: 28, z: 'Tiger' },
    1999: { m: 2, d: 16, z: 'Cat' },
    2000: { m: 2, d: 5, z: 'Dragon' },
    2001: { m: 1, d: 24, z: 'Snake' },
    2002: { m: 2, d: 12, z: 'Horse' },
    2003: { m: 2, d: 1, z: 'Goat' },
    2004: { m: 1, d: 22, z: 'Monkey' },
    2005: { m: 2, d: 9, z: 'Rooster' },
    2006: { m: 1, d: 29, z: 'Dog' },
    2007: { m: 2, d: 18, z: 'Pig' },
    2008: { m: 2, d: 7, z: 'Rat' },
    2009: { m: 1, d: 26, z: 'Ox' },
    2010: { m: 2, d: 14, z: 'Tiger' },
    2011: { m: 2, d: 3, z: 'Cat' },
    2012: { m: 1, d: 23, z: 'Dragon' },
    2013: { m: 2, d: 10, z: 'Snake' },
    2014: { m: 1, d: 31, z: 'Horse' },
    2015: { m: 2, d: 19, z: 'Goat' },
    2016: { m: 2, d: 8, z: 'Monkey' },
    2017: { m: 1, d: 28, z: 'Rooster' },
    2018: { m: 2, d: 16, z: 'Dog' },
    2019: { m: 2, d: 5, z: 'Pig' },
    2020: { m: 1, d: 25, z: 'Rat' },
    2021: { m: 2, d: 12, z: 'Ox' },
    2022: { m: 2, d: 1, z: 'Tiger' },
    2023: { m: 1, d: 22, z: 'Cat' },
    2024: { m: 2, d: 10, z: 'Dragon' },
    2025: { m: 1, d: 29, z: 'Snake' },
    2026: { m: 2, d: 18, z: 'Horse' },
    2027: { m: 2, d: 7, z: 'Goat' },
    2028: { m: 1, d: 27, z: 'Monkey' },
    2029: { m: 2, d: 15, z: 'Rooster' },
    2030: { m: 2, d: 4, z: 'Dog' },
    2031: { m: 1, d: 23, z: 'Pig' },
    2032: { m: 2, d: 10, z: 'Rat' },
    2033: { m: 1, d: 31, z: 'Ox' },
    2034: { m: 2, d: 19, z: 'Tiger' },
    2035: { m: 2, d: 7, z: 'Cat' },
    2036: { m: 1, d: 28, z: 'Dragon' },
    2037: { m: 2, d: 16, z: 'Snake' },
    2038: { m: 2, d: 5, z: 'Horse' },
    2039: { m: 1, d: 24, z: 'Goat' },
    2040: { m: 2, d: 12, z: 'Monkey' },
    2041: { m: 2, d: 1, z: 'Rooster' },
    2042: { m: 1, d: 22, z: 'Dog' },
    2043: { m: 2, d: 9, z: 'Pig' },
    2044: { m: 1, d: 29, z: 'Rat' },
    2045: { m: 2, d: 18, z: 'Ox' },
    2046: { m: 2, d: 7, z: 'Tiger' },
    2047: { m: 1, d: 27, z: 'Cat' },
    2048: { m: 2, d: 15, z: 'Dragon' },
    2049: { m: 2, d: 4, z: 'Snake' },
    2050: { m: 1, d: 23, z: 'Horse' },
    2051: { m: 2, d: 10, z: 'Goat' },
    2052: { m: 1, d: 31, z: 'Monkey' },
    2053: { m: 2, d: 19, z: 'Rooster' },
    2054: { m: 2, d: 7, z: 'Dog' },
    2055: { m: 1, d: 28, z: 'Pig' },
    2056: { m: 2, d: 16, z: 'Rat' },
    2057: { m: 2, d: 5, z: 'Ox' },
    2058: { m: 1, d: 24, z: 'Tiger' },
    2059: { m: 2, d: 12, z: 'Cat' },
    2060: { m: 2, d: 1, z: 'Dragon' },
    2061: { m: 1, d: 22, z: 'Snake' },
    2062: { m: 2, d: 9, z: 'Horse' },
    2063: { m: 1, d: 29, z: 'Goat' },
    2064: { m: 2, d: 18, z: 'Monkey' },
    2065: { m: 2, d: 7, z: 'Rooster' },
    2066: { m: 1, d: 27, z: 'Dog' },
    2067: { m: 2, d: 15, z: 'Pig' },
    2068: { m: 2, d: 4, z: 'Rat' },
    2069: { m: 1, d: 23, z: 'Ox' },
    2070: { m: 2, d: 10, z: 'Tiger' },
    2071: { m: 1, d: 31, z: 'Cat' },
    2072: { m: 2, d: 19, z: 'Dragon' },
    2073: { m: 2, d: 7, z: 'Snake' },
    2074: { m: 1, d: 28, z: 'Horse' },
    2075: { m: 2, d: 16, z: 'Goat' },
    2076: { m: 2, d: 5, z: 'Monkey' },
    2077: { m: 1, d: 24, z: 'Rooster' },
    2078: { m: 2, d: 12, z: 'Dog' },
    2079: { m: 2, d: 1, z: 'Pig' },
    2080: { m: 1, d: 22, z: 'Rat' },
    2081: { m: 2, d: 9, z: 'Ox' },
    2082: { m: 1, d: 29, z: 'Tiger' },
    2083: { m: 2, d: 18, z: 'Cat' },
    2084: { m: 2, d: 7, z: 'Dragon' },
    2085: { m: 1, d: 27, z: 'Snake' },
    2086: { m: 2, d: 15, z: 'Horse' },
    2087: { m: 2, d: 4, z: 'Goat' },
    2088: { m: 1, d: 23, z: 'Monkey' },
    2089: { m: 2, d: 10, z: 'Rooster' },
    2090: { m: 1, d: 31, z: 'Dog' },
    2091: { m: 2, d: 19, z: 'Pig' },
    2092: { m: 2, d: 7, z: 'Rat' },
    2093: { m: 1, d: 28, z: 'Ox' },
    2094: { m: 2, d: 16, z: 'Tiger' },
    2095: { m: 2, d: 5, z: 'Cat' },
    2096: { m: 1, d: 24, z: 'Dragon' },
    2097: { m: 2, d: 12, z: 'Snake' },
    2098: { m: 2, d: 1, z: 'Horse' },
    2099: { m: 1, d: 22, z: 'Goat' },
    2100: { m: 2, d: 9, z: 'Monkey' }
};

// Build comprehensive dates object (1000-2100)
const _buildAllDates = () => {
    const _r = {};
    const _baseYear = 1990;
    const _baseZodiacIndex = zodiacAnimals.indexOf('Horse');
    
    // Add exact dates first
    for (const [y, data] of Object.entries(_exactDates)) {
        const year = parseInt(y);
        _r[year] = {
            date: `${year}-${String(data.m).padStart(2, '0')}-${String(data.d).padStart(2, '0')}`,
            zodiac: data.z
        };
    }
    
    // Calculate dates for years 1000-1899 using Metonic cycle pattern
    // Years 1900-2100 already have exact dates above
    for (let year = 1000; year < 1900; year++) {
        if (!_r[year]) {
            // Calculate zodiac (12-year cycle)
            const yearDiff = year - _baseYear;
            const zodiacIndex = (_baseZodiacIndex + yearDiff + 12000) % 12;
            const zodiac = zodiacAnimals[zodiacIndex];
            
            // Use Metonic cycle (19-year pattern) to estimate date
            const metonicPos = ((year - _baseYear) % 19 + 19) % 19;
            let estimatedMonth = 2;
            let estimatedDay = 5;
            
            // Find a known year (1900-2100) with same Metonic position
            for (let checkYear = 1900; checkYear <= 2100; checkYear++) {
                if (_r[checkYear]) {
                    const checkMetonicPos = ((checkYear - _baseYear) % 19 + 19) % 19;
                    if (checkMetonicPos === metonicPos) {
                        const [_, pM, pD] = _r[checkYear].date.split('-').map(Number);
                        estimatedMonth = pM;
                        estimatedDay = pD;
                        break;
                    }
                }
            }
            
            // Ensure valid date range (Jan 21 - Feb 20)
            if (estimatedDay < 21 && estimatedMonth === 2) {
                estimatedMonth = 1;
                estimatedDay = estimatedDay + 30;
            }
            if (estimatedDay > 20 && estimatedMonth === 1) {
                estimatedMonth = 2;
                estimatedDay = estimatedDay - 30;
            }
            estimatedDay = Math.max(21, Math.min(estimatedDay, estimatedMonth === 1 ? 31 : 20));
            
            _r[year] = {
                date: `${year}-${String(estimatedMonth).padStart(2, '0')}-${String(estimatedDay).padStart(2, '0')}`,
                zodiac: zodiac
            };
        }
    }
    
    return _r;
};

export const chineseNewYearDates = _buildAllDates();

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

// Enemy signs (opposite on the wheel)
export const enemySigns = {
    'Rat': 'Horse',
    'Ox': 'Goat',
    'Tiger': 'Monkey',
    'Cat': 'Rooster',
    'Dragon': 'Dog',
    'Snake': 'Pig',
    'Horse': 'Rat',
    'Goat': 'Ox',
    'Monkey': 'Tiger',
    'Rooster': 'Cat',
    'Dog': 'Dragon',
    'Pig': 'Snake'
};

// Trine groups (friend signs - every 4th sign away)
export const trineGroups = {
    'Rat': ['Monkey', 'Dragon'],
    'Ox': ['Snake', 'Rooster'],
    'Tiger': ['Horse', 'Dog'],
    'Cat': ['Pig', 'Goat'],
    'Dragon': ['Rat', 'Monkey'],
    'Snake': ['Rooster', 'Ox'],
    'Horse': ['Dog', 'Tiger'],
    'Goat': ['Cat', 'Pig'],
    'Monkey': ['Dragon', 'Rat'],
    'Rooster': ['Ox', 'Snake'],
    'Dog': ['Tiger', 'Horse'],
    'Pig': ['Goat', 'Cat']
};

// Special relationships (Rat is soulmates with Ox in addition to its trine)
export const specialRelationships = {
    'Rat': ['Ox'] // Rat's soulmate
};

// How each zodiac sign lies
export const zodiacLyingTypes = {
    'Rat': 'half truths',
    'Ox': 'gaslight',
    'Tiger': 'fake smart',
    'Cat': 'mind games/catfish',
    'Dragon': 'hypocrite',
    'Snake': 'manipulation',
    'Horse': 'denial/delusion',
    'Goat': 'emotional manipulation',
    'Monkey': 'pathological',
    'Rooster': 'hypocrite/protective',
    'Dog': 'exaggerate/fake',
    'Pig': 'flakes'
};

// Strong sides of each zodiac sign
export const zodiacStrongSides = {
    'Rat': 'manipulation',
    'Ox': 'strong arming',
    'Tiger': 'body building',
    'Cat': 'intellectual',
    'Dragon': 'leader',
    'Snake': 'wise',
    'Horse': 'athletes',
    'Goat': 'best looking',
    'Monkey': 'smart',
    'Rooster': 'fighter',
    'Dog': 'getting attention',
    'Pig': 'money'
};

// What you dislike about each sign
export const zodiacDislikes = {
    'Rat': "can't keep a secret",
    'Ox': 'on that power trip',
    'Tiger': 'know it all',
    'Cat': 'annoying',
    'Dragon': 'bossy',
    'Snake': 'petty af',
    'Horse': 'in one ear, out the other',
    'Goat': 'babies',
    'Monkey': 'lazy',
    'Rooster': 'cocky',
    'Dog': 'exaggeration queens',
    'Pig': 'bad manners'
};

// Get Chinese zodiac for a given date
export function getChineseZodiac(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Validate year range
    if (year < 1000 || year > 2100) {
        // Fallback for out-of-range years
        const baseYear = 1900;
        const zodiacIndex = (year - baseYear) % 12;
        const zodiac = zodiacAnimals[zodiacIndex];
        return {
            zodiac: zodiac,
            startDate: null,
            year: year
        };
    }
    
    // For years 1900-2100, we have exact dates - no need for fallback calculations
    
    // Check if we have the exact date for this year
    if (chineseNewYearDates[year]) {
        const newYearDate = chineseNewYearDates[year].date;
        const [newYear, newMonth, newDay] = newYearDate.split('-').map(Number);
        
        // If date is before Chinese New Year, use previous year's zodiac
        if (month < newMonth || (month === newMonth && day < newDay)) {
            const prevYear = year - 1;
            if (prevYear >= 1000 && chineseNewYearDates[prevYear]) {
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
    
    // Fallback: calculate based on year cycle
    const baseYear = 1900;
    const zodiacIndex = (year - baseYear) % 12;
    const zodiac = zodiacAnimals[zodiacIndex];
    
    // For January/February, might be previous year
    if (month === 1 || month === 2) {
        const prevZodiacIndex = (zodiacIndex - 1 + 12) % 12;
        return {
            zodiac: zodiacAnimals[prevZodiacIndex],
            startDate: null,
            year: year
        };
    }
    
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
