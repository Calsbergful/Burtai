// String encryption utility - obfuscated
// XOR encryption with multiple layers

export const _encryptString = (str, key = 'k3y33x0r') => {
  const _k = key.split('').map(c => c.charCodeAt(0));
  const _result = [];
  for (let i = 0; i < str.length; i++) {
    _result.push(str.charCodeAt(i) ^ _k[i % _k.length] ^ (i * 7 + 13));
  }
  return _result;
};

export const _decryptString = (encrypted, key = 'k3y33x0r') => {
  const _k = key.split('').map(c => c.charCodeAt(0));
  const _result = [];
  for (let i = 0; i < encrypted.length; i++) {
    _result.push(String.fromCharCode(encrypted[i] ^ _k[i % _k.length] ^ (i * 7 + 13)));
  }
  return _result.join('');
};

// Multi-layer encryption
export const _encryptMulti = (str) => {
  const _k1 = 'k3y33x0r';
  const _k2 = '0bfusc4t3';
  const _step1 = _encryptString(str, _k1);
  const _step2 = _encryptString(_step1.map(c => String.fromCharCode(c)).join(''), _k2);
  return _step2;
};

export const _decryptMulti = (encrypted) => {
  const _k1 = 'k3y33x0r';
  const _k2 = '0bfusc4t3';
  const _step1 = _decryptString(encrypted, _k2);
  const _step2 = _decryptString(_step1.split('').map(c => c.charCodeAt(0)), _k1);
  return _step2;
};

// Obfuscated array operations
export const _obfuscateArray = (arr) => {
  const _offset = Math.floor(Math.random() * 100) + 50;
  return arr.map((v, i) => (typeof v === 'number' ? v + _offset - i : v));
};

export const _deobfuscateArray = (arr, offset) => {
  return arr.map((v, i) => (typeof v === 'number' ? v - offset + i : v));
};

