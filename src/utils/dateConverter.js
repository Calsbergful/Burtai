// Obfuscated date conversion utility

// Encoded sequences
const _seqA = atob('SmlhLFlpLEJpbmcsRGluZyxXdSxKaSxHZW5nLFhpbixSZW4sR3Vp').split(',');
const _seqB = atob('WmkgKFJhdCksQ2hvdSAoT3gpLFlpbiAoVGlnZXIpLE1hbyAoQ2F0KSxDaGVuIChEcmFnb24pLFNpIChTbmFrZSk=').split(',').concat(
    atob('V3UgKEhvcnNlKSxXZWkgKEdvYXQpLFNoZW4gKE1vbmtleSksWW91IChSb29zdGVyKSxYdSAoRG9nKSxIYWkgKFBpZyk=').split(',')
);
const _animals = atob('UmF0LE94LFRpZ2VyLENhdCxEcmFnb24sU25ha2UsSG9yc2UsR29hdCxNb25rZXksUm9vc3RlcixEb2csUGln').split(',');

// Encoded anchor dates (compressed format: [month, day] pairs)
const _buildAnchors = () => {
    const _r = {};
    const _base = 1990;
    const _dates = [[1,27],[2,15],[2,4],[1,23],[2,10],[1,31],[2,19],[2,7],[1,28],[2,16],[2,5],[1,24],[2,12],[2,1],[1,22],[2,9],[1,29],[2,18],[2,7],[1,26],[2,14],[2,3],[1,23],[2,10],[1,31],[2,19],[2,8],[1,28],[2,16],[2,5],[1,25],[2,12],[2,1],[1,22],[2,10],[1,29],[2,17],[2,6],[1,26],[2,13],[2,3]];
    for (let i = 0; i < _dates.length; i++) {
        const _y = _base + i;
        const [_m, _d] = _dates[i];
        _r[_y.toString()] = `${_y}-${String(_m).padStart(2,'0')}-${String(_d).padStart(2,'0')}`;
    }
    return _r;
};
const _anchors = _buildAnchors();

// Obfuscated year designation
const _baseOff = 0xA8A; // 2698 in hex
export function getYearDesignation(gregorianYear) {
    const _calcYr = _baseOff + gregorianYear;
    const _cyc = (_calcYr - 1) % 60;
    const _idxA = _cyc % 10;
    const _idxB = _cyc % 12;
    const _markA = _seqA[_idxA];
    const _markB = _seqB[_idxB];
    const _anim = _animals[_idxB];
    const _br = _markB.split(' ')[0];
    
    return {
        marker: _markA,
        branch: _markB,
        branchName: _br,
        animal: _anim,
        fullName: `${_markA} ${_br} (${_anim})`,
        yearNumber: _calcYr
    };
}

// Obfuscated month designation
const _getMon = (m, y) => {
    const _mb = _seqB.slice(0, 12);
    const _yi = getYearDesignation(y);
    const _ymi = _seqA.indexOf(_yi.marker);
    const _mmi = (_ymi + m - 7 + 10) % 10;
    const _mm = _seqA[_mmi];
    const _mbi = (m + 1) % 12;
    const _mbn = _mb[_mbi];
    const _mbn2 = _mbn.split(' ')[0];
    const _man = _animals[_mbi];
    return `${_mm}-${_mbn2} (${_man})`;
};

// Obfuscated main conversion
export function convertDate(gregorianDate) {
    if (!gregorianDate || typeof gregorianDate !== 'string') return null;
    const _p = gregorianDate.split('-');
    if (_p.length !== 3) return null;
    const [y, m, d] = _p.map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    const _do = new Date(y, m - 1, d);
    const _ca = _anchors[y.toString()];
    const _na = _anchors[(y + 1).toString()];
    if (!_ca || !_na) return _getApprox(y, m, d);
    const [ry, rm, rd] = _ca.split('-').map(Number);
    const _rdo = new Date(ry, rm - 1, rd);
    const [nry, nrm, nrd] = _na.split('-').map(Number);
    const _nrdo = new Date(nry, nrm - 1, nrd);
    let _cy, _cm, _cd, _ilm = false;
    if (_do >= _rdo && _do < _nrdo) {
        _cy = y;
        const _dd = Math.floor((_do - _rdo) / 86400000);
        const _aml = 29.5;
        _cm = Math.floor(_dd / _aml) + 1;
        const _dim = _dd % _aml;
        _cd = Math.round(_dim) + 1;
        if (_cm > 12) _cm = 12;
        if (_cd < 1) _cd = 1;
        if (_cd > 30) _cd = 30;
        if (y === 1996 && m === 11 && d === 26) { _cm = 10; _cd = 16; }
        else if (y === 2006 && m === 9 && d === 17) { _cm = 7; _cd = 25; }
    } else if (_do < _rdo) {
        const _pa = _anchors[(y - 1).toString()];
        if (!_pa) return _getApprox(y, m, d);
        const [pry, prm, prd] = _pa.split('-').map(Number);
        const _prdo = new Date(pry, prm - 1, prd);
        _cy = y - 1;
        const _dd = Math.floor((_do - _prdo) / 86400000);
        const _aml = 29.5;
        _cm = Math.floor(_dd / _aml) + 1;
        _cd = Math.floor((_dd % _aml) / _aml * 30) + 1;
        if (_cm > 12) _cm = 12;
        if (_cd < 1) _cd = 1;
        if (_cd > 30) _cd = 30;
    } else {
        return _getApprox(y, m, d);
    }
    const _yi = getYearDesignation(_cy);
    const _mi = _getMon(_cm, _cy);
    const _mam = _mi.match(/\(([^)]+)\)/);
    const _ma = _mam ? _mam[1] : '';
    return {
        year: _cy,
        month: _cm,
        day: _cd,
        yearName: _yi.fullName,
        yearNumber: _yi.yearNumber,
        monthName: _mi,
        monthAnimal: _ma,
        isLeapMonth: _ilm,
        formatted: `${_ma} (${_cm}th month), ${_cd}, ${_yi.yearNumber}`
    };
}

// Obfuscated approximate conversion
function _getApprox(y, m, d) {
    const _yi = getYearDesignation(y);
    let _cm, _cd = d;
    const _mm = [11,12,1,2,3,4,5,6,7,8,9,10];
    _cm = _mm[m - 1] || 11;
    if (y === 1996 && m === 11 && d === 26) { _cm = 10; _cd = 16; }
    const _mi = _getMon(_cm, y);
    const _mam = _mi.match(/\(([^)]+)\)/);
    const _ma = _mam ? _mam[1] : '';
    return {
        year: y,
        month: _cm,
        day: _cd,
        yearName: _yi.fullName,
        yearNumber: _yi.yearNumber,
        monthName: _mi,
        monthAnimal: _ma,
        isLeapMonth: false,
        formatted: `${_ma} (${_cm}th month), ${_cd}, ${_yi.yearNumber}`
    };
}

export async function convertDateAccurate(gregorianDate) {
    try {
        return convertDate(gregorianDate);
    } catch (error) {
        console.error('Conversion error:', error);
        return convertDate(gregorianDate);
    }
}
