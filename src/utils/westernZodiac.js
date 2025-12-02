// Western Zodiac signs and their date ranges
export const zodiacSigns = [
    { name: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { name: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { name: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    { name: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { name: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 }
];

// Lithuanian translations
export const zodiacSignTranslations = {
    'Aries': 'Avinas',
    'Taurus': 'Jautis',
    'Gemini': 'Dvyniai',
    'Cancer': 'Vėžys',
    'Leo': 'Liūtas',
    'Virgo': 'Mergelė',
    'Libra': 'Svarstyklės',
    'Scorpio': 'Skorpionas',
    'Sagittarius': 'Šaulys',
    'Capricorn': 'Ožiaragis',
    'Aquarius': 'Vandenis',
    'Pisces': 'Žuvys'
};

// Emojis for each zodiac sign
export const zodiacSignEmojis = {
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓'
};

// Get Western zodiac sign for a given date
export function getWesternZodiac(month, day) {
    // Month is 1-indexed (1 = January, 12 = December)
    for (const sign of zodiacSigns) {
        if (sign.endMonth < sign.startMonth) {
            // Sign spans across year boundary (Capricorn: Dec 22 - Jan 19)
            if ((month === sign.startMonth && day >= sign.startDay) || 
                (month === sign.endMonth && day <= sign.endDay) ||
                (month === 12 && day >= sign.startDay) ||
                (month === 1 && day <= sign.endDay)) {
                return sign.name;
            }
        } else {
            // Normal case: sign within same year
            if ((month === sign.startMonth && day >= sign.startDay) || 
                (month === sign.endMonth && day <= sign.endDay) ||
                (month > sign.startMonth && month < sign.endMonth)) {
                return sign.name;
            }
        }
    }
    
    // Fallback (shouldn't happen)
    return 'Aries';
}

// Check if a date is the start of a Western zodiac sign
export function isZodiacSignStart(month, day) {
    for (const sign of zodiacSigns) {
        if (month === sign.startMonth && day === sign.startDay) {
            return true;
        }
    }
    return false;
}

