// Hour animals - each 2-hour period is associated with an animal
// Starting from 11 PM - 1 AM (Rat hour)
export const hourAnimals = [
    { start: 23, end: 1, animal: 'Rat', name: 'Žiurkė' },
    { start: 1, end: 3, animal: 'Ox', name: 'Jautis' },
    { start: 3, end: 5, animal: 'Tiger', name: 'Tigras' },
    { start: 5, end: 7, animal: 'Cat', name: 'Katė' },
    { start: 7, end: 9, animal: 'Dragon', name: 'Drakonas' },
    { start: 9, end: 11, animal: 'Snake', name: 'Gyvatė' },
    { start: 11, end: 13, animal: 'Horse', name: 'Arklys' },
    { start: 13, end: 15, animal: 'Goat', name: 'Ožka' },
    { start: 15, end: 17, animal: 'Monkey', name: 'Beždžionė' },
    { start: 17, end: 19, animal: 'Rooster', name: 'Gaidys' },
    { start: 19, end: 21, animal: 'Dog', name: 'Šuo' },
    { start: 21, end: 23, animal: 'Pig', name: 'Kiaulė' }
];

// Emojis for hour animals
export const hourAnimalEmojis = {
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

// Soulmate relationships (special bond - Ox and Rat are the only soulmates)
export const soulmateRelationships = {
    'Rat': ['Ox'],
    'Ox': ['Rat']
};

// Friendly relationships (compatible animals)
export const friendlyRelationships = {
    'Rat': ['Dragon', 'Monkey'],
    'Ox': ['Snake', 'Rooster'],
    'Tiger': ['Horse', 'Dog'],
    'Cat': ['Goat', 'Pig'],
    'Dragon': ['Rat', 'Monkey'],
    'Snake': ['Ox', 'Rooster'],
    'Horse': ['Tiger', 'Goat', 'Dog'],
    'Goat': ['Cat', 'Horse', 'Pig'],
    'Monkey': ['Rat', 'Dragon'],
    'Rooster': ['Ox', 'Snake'],
    'Dog': ['Tiger', 'Horse'],
    'Pig': ['Cat', 'Goat']
};

// Get soulmate hours for a given animal
export function getSoulmateHours(animal) {
    const soulmates = soulmateRelationships[animal] || [];
    return hourAnimals.filter(ha => soulmates.includes(ha.animal));
}

// Enemy relationships (incompatible animals)
export const enemyRelationships = {
    'Rat': ['Horse'],
    'Ox': ['Goat'],
    'Tiger': ['Monkey'],
    'Cat': ['Rooster'],
    'Dragon': ['Dog'],
    'Snake': ['Pig'],
    'Horse': ['Rat'],
    'Goat': ['Ox'],
    'Monkey': ['Tiger'],
    'Rooster': ['Cat'],
    'Dog': ['Dragon'],
    'Pig': ['Snake']
};

// Get animal for a given hour (0-23)
export function getHourAnimal(hour) {
    for (const hourAnimal of hourAnimals) {
        if (hourAnimal.start > hourAnimal.end) {
            // Spans midnight (23-1)
            if (hour >= hourAnimal.start || hour < hourAnimal.end) {
                return hourAnimal;
            }
        } else {
            // Normal range
            if (hour >= hourAnimal.start && hour < hourAnimal.end) {
                return hourAnimal;
            }
        }
    }
    return hourAnimals[0]; // Default to Rat
}

// Format hour for display (24-hour format)
export function formatHour(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
}

// Format hour range for display (handles midnight span)
export function formatHourRange(start, end) {
    return `${formatHour(start)} - ${formatHour(end)}`;
}

// Get friendly hours for a given animal
export function getFriendlyHours(animal) {
    const friendly = friendlyRelationships[animal] || [];
    return hourAnimals.filter(ha => friendly.includes(ha.animal));
}

// Get enemy hours for a given animal
export function getEnemyHours(animal) {
    const enemies = enemyRelationships[animal] || [];
    return hourAnimals.filter(ha => enemies.includes(ha.animal));
}

