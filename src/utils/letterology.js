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

// Vowels for calculation
export const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];

// Check if letter is a vowel
export const isVowel = (letter) => {
    return vowels.includes(letter.toUpperCase());
};

// Calculate vowel value (vowels use their position: A=1, E=5, I=9, O=6, U=3, Y=7)
export const getVowelValue = (letter) => {
    const upperLetter = letter.toUpperCase();
    const vowelMap = {
        'A': 1,
        'E': 5,
        'I': 9,
        'O': 6,
        'U': 3,
        'Y': 7
    };
    
    if (vowelMap[upperLetter] !== undefined) {
        const baseValue = vowelMap[upperLetter];
        if (isUpperCase(letter)) {
            // Capital vowels: base value + 26
            return baseValue + 26;
        }
        return baseValue;
    }
    return 0;
};

// Calculate total from a word/name
export const calculateWordValue = (word) => {
    const letters = word.split('').filter(char => /[a-zA-Z]/.test(char));
    const values = letters.map(letter => ({
        letter,
        value: getLetterValue(letter),
        isVowel: isVowel(letter),
        vowelValue: isVowel(letter) ? getVowelValue(letter) : 0
    }));
    const total = values.reduce((sum, item) => sum + item.value, 0);
    const vowelTotal = values
        .filter(item => item.isVowel)
        .reduce((sum, item) => sum + item.vowelValue, 0);
    
    return {
        letters,
        values,
        total,
        reduced: reduceNumber(total),
        vowels: values.filter(item => item.isVowel),
        vowelTotal,
        vowelReduced: vowelTotal > 0 ? reduceNumber(vowelTotal) : 0
    };
};

// Reduce number to single digit or master number (imported from numerology)
import { reduceNumber, masterNumbers } from './numerology';

