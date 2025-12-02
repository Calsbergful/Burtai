// Letter to number mapping (A=1, B=2, ..., Z=26)
export const letterToNumber = (letter) => {
    const upperLetter = letter.toUpperCase();
    if (upperLetter >= 'A' && upperLetter <= 'Z') {
        return upperLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    }
    return 0;
};

// Check if letter is uppercase
export const isUpperCase = (letter) => {
    return letter === letter.toUpperCase() && letter !== letter.toLowerCase();
};

// Get letter value (capital letters add 26 to base value)
export const getLetterValue = (letter) => {
    const baseValue = letterToNumber(letter);
    if (baseValue === 0) return 0;
    
    if (isUpperCase(letter)) {
        // Capital letters: base value + 26
        // Example: G = 7, Capital G = 7 + 26 = 33
        return baseValue + 26;
    }
    return baseValue;
};

// Calculate total from a word/name
export const calculateWordValue = (word) => {
    const letters = word.split('').filter(char => /[a-zA-Z]/.test(char));
    const values = letters.map(letter => ({
        letter,
        value: getLetterValue(letter)
    }));
    const total = values.reduce((sum, item) => sum + item.value, 0);
    
    return {
        letters,
        values,
        total,
        reduced: reduceNumber(total)
    };
};

// Reduce number to single digit or master number (imported from numerology)
import { reduceNumber, masterNumbers } from './numerology';

