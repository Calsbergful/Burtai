// Obfuscated imports
import { reduceNumber, masterNumbers } from './numerology';

// Encoded vowel data
const _vow = atob('QUVJTw==').split('');
export const vowels = _vow;

// Encoded vowel values (A=1, E=5, I=9, O=6, U=3)
const _vowMap = () => {
    const _r = {};
    const _vals = [1, 5, 9, 6, 3];
    _vow.forEach((v, i) => { _r[v] = _vals[i]; });
    return _r;
};
const _vowVals = _vowMap();

// Obfuscated letter to number
const _base = 'A'.charCodeAt(0);
const _getBase = (l) => {
    const _u = l.toUpperCase();
    if (_u >= 'A' && _u <= 'Z') {
        return _u.charCodeAt(0) - _base + 1;
    }
    return 0;
};

export const letterToNumber = (letter) => _getBase(letter);

// Obfuscated uppercase check
const _isUp = (l) => l === l.toUpperCase() && l !== l.toLowerCase();
export const isUpperCase = _isUp;

// Obfuscated vowel check
export const isVowel = (letter) => _vow.includes(letter.toUpperCase());

// Obfuscated vowel value getter
const _getVow = (l) => {
    const _u = l.toUpperCase();
    if (_vowVals[_u] !== undefined) {
        const _b = _vowVals[_u];
        return _isUp(l) ? _b + 26 : _b;
    }
    return 0;
};
export const getVowelValue = _getVow;

// Obfuscated letter value getter
const _getLet = (l) => {
    const _b = _getBase(l);
    if (_b === 0) return 0;
    return _isUp(l) ? _b + 26 : _b;
};
export const getLetterValue = _getLet;

// Obfuscated word value calculation
export const calculateWordValue = (word) => {
    const _lets = word.split('').filter(c => /[a-zA-Z]/.test(c));
    const _vals = _lets.map(l => ({
        letter: l,
        value: _getLet(l),
        isVowel: isVowel(l),
        vowelValue: isVowel(l) ? _getVow(l) : 0
    }));
    const _tot = _vals.reduce((a, b) => a + b.value, 0);
    const _vowList = _vals.filter(v => v.isVowel);
    const _vowTot = _vowList.reduce((a, b) => a + b.vowelValue, 0);
    
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
