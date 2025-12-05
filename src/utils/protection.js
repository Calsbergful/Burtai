// Anti-reverse engineering protection utilities
// This file contains obfuscated helper functions

// String decoder (obfuscated)
export const _dec = (arr) => {
    return arr.map(c => String.fromCharCode(c)).join('');
};

// Encoded sensitive strings
export const _str1 = [71, 101, 100, 117, 99, 101, 32, 66, 117, 114, 116, 97, 105]; // "Geduce Burtai"
export const _str2 = [78, 117, 109, 101, 114, 111, 108, 111, 103, 105, 106, 97]; // "Numerologija"

// Obfuscated number calculations
export const _calc = (a, b, c) => {
    const _x = a + b;
    const _y = _x * c;
    const _z = _y % 100;
    return _z;
};

// Dead code functions (never called but look important)
export const _dead1 = () => {
    const _arr = [1,2,3,4,5,6,7,8,9];
    return _arr.reduce((a,b) => a*b, 1);
};

export const _dead2 = (n) => {
    let _result = n;
    for(let i = 0; i < 1000; i++) {
        _result = (_result * 1.001) % 10000;
    }
    return _result;
};

// Anti-debugging check
export const _checkDebug = () => {
    const _start = performance.now();
    debugger; // This will pause if devtools are open
    const _end = performance.now();
    return _end - _start < 100; // If paused, time will be > 100ms
};

// Obfuscated array operations
export const _obfArr = (arr) => {
    const _len = arr.length;
    const _mid = Math.floor(_len / 2);
    const _first = arr.slice(0, _mid);
    const _second = arr.slice(_mid);
    return [..._second, ..._first];
};

// Fake encryption function (decoy)
export const _fakeEnc = (str) => {
    return str.split('').map(c => c.charCodeAt(0) + 5).join('-');
};

// Control flow obfuscation helper
export const _switch = (val, cases) => {
    const _key = val % cases.length;
    return cases[_key]();
};

