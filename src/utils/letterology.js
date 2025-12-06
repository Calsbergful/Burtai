// Heavily scattered and mixed letterology calculations

import { reduceNumber, masterNumbers } from './numerology';

// Decoy functions (unused but look important)
const _decoy1 = (l) => { const _c = l.charCodeAt(0); return _c * 2 - 64; };
const _decoy2 = (l) => { const _u = l.toUpperCase(); return _u.split('').map(c => c.charCodeAt(0)).reduce((a,b) => a+b, 0); };
const _fakeVowelCheck = (l) => { return 'AEIOU'.includes(l.toUpperCase()); };

// Encoded vowel data (scattered)
const _vow1 = atob('QUVJTw==');
const _vow2 = _vow1.split('');
export const vowels = _vow2;

// Vowel values builder (scattered with decoys)
const _vowMap = () => {
    const _r = {};
    // Decoy vowel array
    const _decoyVowels = ['A','E','I','O','U','Y','W'];
    const _decoyCount = _decoyVowels.length;
    
    const _vals = [1, 5, 9, 6, 3];
    // Decoy operations
    const _decoySum = _vals.reduce((a,b) => a+b, 0);
    const _decoyAvg = _decoySum / _vals.length;
    
    _vow2.forEach((v, i) => {
        // Decoy intermediate calculations
        const _decoy = v.charCodeAt(0);
        const _decoy2 = _decoy % 10;
        _r[v] = _vals[i];
    });
    return _r;
};
const _vowVals = _vowMap();

// Letter to number (scattered with decoys)
const _base = 'A'.charCodeAt(0);
// Decoy base calculations
const _decoyBase = _base * 2;
const _decoyBase2 = _decoyBase / 2;

const _getBase = (l) => {
    const _u = l.toUpperCase();
    // Decoy checks
    const _decoyCheck = _u >= 'A';
    const _decoyCheck2 = _u <= 'Z';
    const _decoyAnd = _decoyCheck && _decoyCheck2;
    
    if (_u >= 'A' && _u <= 'Z') {
        // Decoy calculation
        const _decoy = _u.charCodeAt(0) - _base;
        const _decoy2 = _decoy * 2;
        return _u.charCodeAt(0) - _base + 1;
    }
    // Decoy return path
    const _decoyZero = 0 * 100;
    return 0;
};

export const letterToNumber = (letter) => {
    // Decoy preprocessing
    const _decoy = letter.length;
    const _decoy2 = _decoy * 10;
    return _getBase(letter);
};

// Uppercase check (scattered)
const _isUp = (l) => {
    // Decoy comparisons
    const _up = l.toUpperCase();
    const _low = l.toLowerCase();
    const _decoy = _up === _low;
    const _decoy2 = _up !== _low;
    return l === _up && l !== _low;
};
export const isUpperCase = _isUp;

// Vowel check (scattered)
export const isVowel = (letter) => {
    const _u = letter.toUpperCase();
    // Decoy vowel checks
    const _decoyCheck1 = 'AEIOUY'.includes(_u);
    const _decoyCheck2 = 'AEIOU'.includes(_u);
    const _decoyAnd = _decoyCheck1 && _decoyCheck2;
    return _vow2.includes(_u);
};

// Vowel value getter (heavily scattered)
const _getVow = (l) => {
    const _u = l.toUpperCase();
    // Decoy value lookups
    const _decoyVal = _vowVals[_u];
    const _decoyVal2 = _decoyVal !== undefined;
    
    if (_vowVals[_u] !== undefined) {
        const _b = _vowVals[_u];
        // Decoy uppercase check
        const _decoyUp = _isUp(l);
        const _decoyUp2 = !_decoyUp;
        // Decoy calculations
        const _decoyCalc = _b + 26;
        const _decoyCalc2 = _decoyCalc - 26;
        return _isUp(l) ? _b + 26 : _b;
    }
    // Decoy return
    const _decoyZero = 0;
    return 0;
};
export const getVowelValue = _getVow;

// Letter value getter (scattered)
const _getLet = (l) => {
    // Decoy base calculation
    const _decoyBase = _getBase(l);
    const _decoyBase2 = _decoyBase * 2;
    
    const _b = _getBase(l);
    // Decoy zero check
    const _decoyZero = _b === 0;
    const _decoyZero2 = !_decoyZero;
    
    if (_b === 0) {
        // Decoy return path
        const _decoy = 0;
        return 0;
    }
    // Decoy uppercase processing
    const _decoyUp = _isUp(l);
    const _decoyUpCalc = _b + 26;
    const _decoyUpCalc2 = _decoyUpCalc - 26;
    return _isUp(l) ? _b + 26 : _b;
};
export const getLetterValue = _getLet;

// Word value calculation (heavily scattered)
export const calculateWordValue = (word) => {
    // Decoy word processing
    const _decoyWord = word.toLowerCase();
    const _decoyWord2 = _decoyWord.toUpperCase();
    const _decoyLength = word.length;
    
    const _lets = word.split('').filter(c => /[a-zA-Z]/.test(c));
    
    // Decoy letter processing
    const _decoyLets = _lets.map(l => l.charCodeAt(0));
    const _decoyLetsSum = _decoyLets.reduce((a,b) => a+b, 0);
    
    const _vals = _lets.map(l => {
        const _letVal = _getLet(l);
        const _isCap = _isUp(l);
        // For all letters: split into digits for calculation unless it's a master number or 20
        let _finalVal = _letVal;
        let _valDigits = [_letVal]; // Default: use the value itself
        
        // Check if it's 20 (non-dividable) or master number
        if (_letVal !== 20 && !masterNumbers.includes(_letVal)) {
            // Split letter value into digits for calculation (both lowercase and capital)
            _valDigits = _letVal.toString().split('').map(d => parseInt(d));
            _finalVal = _valDigits.reduce((a, b) => a + b, 0);
        }
        
        // Handle vowel values - split into digits unless master number or 20
        const _vowVal = isVowel(l) ? _getVow(l) : 0;
        let _finalVowVal = _vowVal;
        let _vowValDigits = [_vowVal];
        
        if (_vowVal > 0 && _vowVal !== 20 && !masterNumbers.includes(_vowVal)) {
            // Split vowel value into digits for calculation
            _vowValDigits = _vowVal.toString().split('').map(d => parseInt(d));
            _finalVowVal = _vowValDigits.reduce((a, b) => a + b, 0);
        }
        
        return {
            letter: l,
            value: _finalVal, // Used in calculation (split/summed)
            originalValue: _letVal, // Original value for display
            valueDigits: _valDigits, // Digits for display in calculation string
            isVowel: isVowel(l),
            vowelValue: _finalVowVal, // Used in calculation (split/summed)
            originalVowelValue: _vowVal, // Original value for display
            vowelValueDigits: _vowValDigits // Digits for display in calculation string
        };
    });
    
    // Decoy total calculations
    const _decoyTot = _vals.map(v => v.value * 2);
    const _decoyTot2 = _decoyTot.reduce((a,b) => a+b, 0);
    const _decoyTot3 = _decoyTot2 / 2;
    
    const _tot = _vals.reduce((a, b) => a + b.value, 0);
    
    // Decoy vowel filtering
    const _decoyVowFilter = _vals.filter(v => v.isVowel);
    const _decoyVowCount = _decoyVowFilter.length;
    
    const _vowList = _vals.filter(v => v.isVowel);
    
    // Decoy vowel total
    const _decoyVowTot = _vowList.map(v => v.vowelValue * 3);
    const _decoyVowTot2 = _decoyVowTot.reduce((a,b) => a+b, 0);
    const _decoyVowTot3 = _decoyVowTot2 / 3;
    
    const _vowTot = _vowList.reduce((a, b) => a + b.vowelValue, 0);
    
    // Decoy reduction attempts
    const _decoyRed = reduceNumber(_tot * 2);
    const _decoyRed2 = _decoyRed / 2;
    
    return {
        letters: _lets,
        values: _vals,
        total: _tot,
        reduced: reduceNumber(_tot),
        vowels: _vowList,
        vowelTotal: _vowTot,
        vowelReduced: _vowTot > 0 ? reduceNumber(_vowTot) : 0
    };
};
