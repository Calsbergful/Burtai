// Month animals - each month has an associated animal
export const monthAnimals = {
    1: 'Ox',      // January
    2: 'Tiger',   // February
    3: 'Cat',     // March
    4: 'Dragon',  // April
    5: 'Snake',   // May
    6: 'Horse',   // June
    7: 'Goat',    // July
    8: 'Monkey',  // August
    9: 'Rooster', // September
    10: 'Dog',    // October
    11: 'Pig',    // November
    12: 'Rat'     // December
};

// Lithuanian translations (reusing Chinese zodiac translations)
export const monthAnimalTranslations = {
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

// Emojis for month animals (reusing Chinese zodiac emojis)
export const monthAnimalEmojis = {
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

// Get month animal for a given month (1-12)
export function getMonthAnimal(month) {
    return monthAnimals[month] || 'Rat';
}

