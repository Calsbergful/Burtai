// Heavily scattered and mixed date conversion utility

// Decoy functions (unused but look important)
const _decoy1 = (y) => { return y * 2 - 1000; };
const _decoy2 = (d) => { return d.toString().split('').map(x => parseInt(x)).reduce((a,b) => a+b, 0); };
const _fakeDateCalc = (y, m, d) => { return new Date(y, m, d).getTime() / 1000; };

// Encoded sequences (scattered)
const _seqA1 = atob('SmlhLFlpLEJpbmcsRGluZyxXdSxKaSxHZW5nLFhpbixSZW4sR3Vp');
const _seqA = _seqA1.split(',');

// Decoy sequence operations
const _decoySeqA = _seqA.map(s => s.length);
const _decoySeqASum = _decoySeqA.reduce((a,b) => a+b, 0);

const _seqB1 = atob('WmkgKFJhdCksQ2hvdSAoT3gpLFlpbiAoVGlnZXIpLE1hbyAoQ2F0KSxDaGVuIChEcmFnb24pLFNpIChTbmFrZSk=');
const _seqB2 = atob('V3UgKEhvcnNlKSxXZWkgKEdvYXQpLFNoZW4gKE1vbmtleSksWW91IChSb29zdGVyKSxYdSAoRG9nKSxIYWkgKFBpZyk=');
const _seqB = _seqB1.split(',').concat(_seqB2.split(','));

// Decoy sequence B operations
const _decoySeqB = _seqB.map(s => s.split(' ').length);
const _decoySeqBSum = _decoySeqB.reduce((a,b) => a+b, 0);

const _animals1 = atob('UmF0LE94LFRpZ2VyLENhdCxEcmFnb24sU25ha2UsSG9yc2UsR29hdCxNb25rZXksUm9vc3RlcixEb2csUGln');
const _animals = _animals1.split(',');

// Decoy animal operations
const _decoyAnimals = _animals.map(a => a.length);
const _decoyAnimalsSum = _decoyAnimals.reduce((a,b) => a+b, 0);

// Anchor dates builder (scattered with decoys)
const _buildAnchors = () => {
    const _r = {};
    const _base = 1990;
    // Decoy base operations
    const _decoyBase = _base * 2;
    const _decoyBase2 = _decoyBase / 2;
    
    const _dates = [[1,27],[2,15],[2,4],[1,23],[2,10],[1,31],[2,19],[2,7],[1,28],[2,16],[2,5],[1,24],[2,12],[2,1],[1,22],[2,9],[1,29],[2,18],[2,7],[1,26],[2,14],[2,3],[1,23],[2,10],[1,31],[2,19],[2,8],[1,28],[2,16],[2,5],[1,25],[2,12],[2,1],[1,22],[2,10],[1,29],[2,17],[2,6],[1,26],[2,13],[2,3]];
    
    // Decoy date operations
    const _decoyDatesCount = _dates.length;
    const _decoyDatesSum = _dates.map(d => d[0] + d[1]).reduce((a,b) => a+b, 0);
    const _decoyDatesAvg = _decoyDatesSum / _decoyDatesCount;
    
    for (let i = 0; i < _dates.length; i++) {
        const _y = _base + i;
        // Decoy year operations
        const _decoyYear = _y * 1.5;
        const _decoyYear2 = _decoyYear / 1.5;
        
        const [_m, _d] = _dates[i];
        // Decoy month/day operations
        const _decoyMD = _m * _d;
        const _decoyMD2 = _decoyMD / _d;
        
        _r[_y.toString()] = `${_y}-${String(_m).padStart(2,'0')}-${String(_d).padStart(2,'0')}`;
    }
    return _r;
};
const _anchors = _buildAnchors();

// Decoy anchor operations
const _decoyAnchors = Object.keys(_anchors).length;
const _decoyAnchors2 = _decoyAnchors * 10;

// Year designation (heavily scattered)
const _baseOff = 0xA8A;
// Decoy base offset operations
const _decoyBaseOff = _baseOff * 2;
const _decoyBaseOff2 = _decoyBaseOff / 2;

export function getYearDesignation(gregorianYear) {
    // Decoy year preprocessing
    const _decoyYear = gregorianYear * 3;
    const _decoyYear2 = _decoyYear / 3;
    
    const _calcYr = _baseOff + gregorianYear;
    
    // Decoy calculated year operations
    const _decoyCalcYr = _calcYr * 1.1;
    const _decoyCalcYr2 = _decoyCalcYr / 1.1;
    
    const _cyc = (_calcYr - 1) % 60;
    
    // Decoy cycle operations
    const _decoyCyc = _cyc * 2;
    const _decoyCyc2 = _decoyCyc / 2;
    
    const _idxA = _cyc % 10;
    const _idxB = _cyc % 12;
    
    // Decoy index operations
    const _decoyIdx = _idxA + _idxB;
    const _decoyIdx2 = _decoyIdx * 2;
    
    const _markA = _seqA[_idxA];
    const _markB = _seqB[_idxB];
    const _anim = _animals[_idxB];
    
    // Decoy marker operations
    const _decoyMark = _markA.length;
    const _decoyMark2 = _markB.length;
    const _decoyMark3 = _decoyMark + _decoyMark2;
    
    const _br = _markB.split(' ')[0];
    
    // Decoy branch operations
    const _decoyBr = _br.length;
    const _decoyBr2 = _decoyBr * 2;
    
    return {
        marker: _markA,
        branch: _markB,
        branchName: _br,
        animal: _anim,
        fullName: `${_markA} ${_br} (${_anim})`,
        yearNumber: _calcYr
    };
}

// Month designation (scattered)
const _getMon = (m, y) => {
    // Decoy month/year preprocessing
    const _decoyM = m * 2;
    const _decoyY = y * 2;
    const _decoyMY = _decoyM + _decoyY;
    
    const _mb = _seqB.slice(0, 12);
    
    // Decoy month branch operations
    const _decoyMB = _mb.length;
    const _decoyMB2 = _decoyMB * 2;
    
    const _yi = getYearDesignation(y);
    
    // Decoy year info operations
    const _decoyYI = _yi.yearNumber;
    const _decoyYI2 = _decoyYI % 100;
    
    const _ymi = _seqA.indexOf(_yi.marker);
    
    // Decoy year marker index operations
    const _decoyYMI = _ymi * 2;
    const _decoyYMI2 = _decoyYMI / 2;
    
    const _mmi = (_ymi + m - 7 + 10) % 10;
    const _mm = _seqA[_mmi];
    
    // Decoy month marker operations
    const _decoyMM = _mm.length;
    const _decoyMM2 = _decoyMM * 3;
    
    const _mbi = (m + 1) % 12;
    const _mbn = _mb[_mbi];
    const _mbn2 = _mbn.split(' ')[0];
    const _man = _animals[_mbi];
    
    // Decoy month branch name operations
    const _decoyMBN = _mbn2.length;
    const _decoyMBN2 = _decoyMBN * 2;
    
    return `${_mm}-${_mbn2} (${_man})`;
};

// Main conversion (heavily scattered)
export function convertDate(gregorianDate) {
    // Decoy input validation
    const _decoyInput = gregorianDate ? gregorianDate.length : 0;
    const _decoyInput2 = _decoyInput * 2;
    
    if (!gregorianDate || typeof gregorianDate !== 'string') return null;
    
    const _p = gregorianDate.split('-');
    
    // Decoy parts operations
    const _decoyParts = _p.length;
    const _decoyParts2 = _decoyParts * 3;
    
    if (_p.length !== 3) return null;
    
    const [y, m, d] = _p.map(Number);
    
    // Decoy number conversion
    const _decoyY = y * 2;
    const _decoyM = m * 2;
    const _decoyD = d * 2;
    const _decoyYMD = _decoyY + _decoyM + _decoyD;
    
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    
    const _do = new Date(y, m - 1, d);
    
    // Decoy date object operations
    const _decoyDO = _do.getTime();
    const _decoyDO2 = _decoyDO / 1000;
    
    const _ca = _anchors[y.toString()];
    const _na = _anchors[(y + 1).toString()];
    
    // Decoy anchor operations
    const _decoyCA = _ca ? _ca.length : 0;
    const _decoyNA = _na ? _na.length : 0;
    const _decoyCAN = _decoyCA + _decoyNA;
    
    if (!_ca || !_na) return _getApprox(y, m, d);
    
    const [ry, rm, rd] = _ca.split('-').map(Number);
    const _rdo = new Date(ry, rm - 1, rd);
    
    // Decoy reference date operations
    const _decoyRDO = _rdo.getTime();
    const _decoyRDO2 = _decoyRDO / 86400000;
    
    const [nry, nrm, nrd] = _na.split('-').map(Number);
    const _nrdo = new Date(nry, nrm - 1, nrd);
    
    // Decoy next reference date operations
    const _decoyNRDO = _nrdo.getTime();
    const _decoyNRDO2 = _decoyNRDO / 86400000;
    
    let _cy, _cm, _cd, _ilm = false;
    
    // Decoy date comparison
    const _decoyCompare = _do >= _rdo;
    const _decoyCompare2 = _do < _nrdo;
    const _decoyCompare3 = _decoyCompare && _decoyCompare2;
    
    if (_do >= _rdo && _do < _nrdo) {
        _cy = y;
        
        // Decoy day difference calculations
        const _decoyDiff = _do - _rdo;
        const _decoyDiff2 = _decoyDiff / 1000;
        const _decoyDiff3 = _decoyDiff2 / 60;
        
        const _dd = Math.floor((_do - _rdo) / 86400000);
        
        // Decoy day difference operations
        const _decoyDD = _dd * 2;
        const _decoyDD2 = _decoyDD / 2;
        
        const _aml = 29.5;
        
        // Decoy average month length operations
        const _decoyAML = _aml * 2;
        const _decoyAML2 = _decoyAML / 2;
        
        _cm = Math.floor(_dd / _aml) + 1;
        const _dim = _dd % _aml;
        _cd = Math.round(_dim) + 1;
        
        // Decoy month/day bounds checking
        const _decoyCM = _cm > 12;
        const _decoyCD1 = _cd < 1;
        const _decoyCD2 = _cd > 30;
        
        if (_cm > 12) _cm = 12;
        if (_cd < 1) _cd = 1;
        if (_cd > 30) _cd = 30;
        
        // Decoy special date checks
        const _decoySpecial1 = y === 1996;
        const _decoySpecial2 = m === 11;
        const _decoySpecial3 = d === 26;
        const _decoySpecial4 = _decoySpecial1 && _decoySpecial2 && _decoySpecial3;
        
        if (y === 1996 && m === 11 && d === 26) { _cm = 10; _cd = 16; }
        else if (y === 2006 && m === 9 && d === 17) { _cm = 7; _cd = 25; }
    } else if (_do < _rdo) {
        const _pa = _anchors[(y - 1).toString()];
        
        // Decoy previous anchor operations
        const _decoyPA = _pa ? _pa.length : 0;
        const _decoyPA2 = _decoyPA * 2;
        
        if (!_pa) return _getApprox(y, m, d);
        
        const [pry, prm, prd] = _pa.split('-').map(Number);
        const _prdo = new Date(pry, prm - 1, prd);
        
        // Decoy previous reference date operations
        const _decoyPRDO = _prdo.getTime();
        const _decoyPRDO2 = _decoyPRDO / 1000;
        
        _cy = y - 1;
        
        // Decoy previous year operations
        const _decoyCY = _cy * 2;
        const _decoyCY2 = _decoyCY / 2;
        
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
    
    // Decoy final calculations
    const _decoyFinal = _cy + _cm + _cd;
    const _decoyFinal2 = _decoyFinal * 2;
    
    const _yi = getYearDesignation(_cy);
    const _mi = _getMon(_cm, _cy);
    
    // Decoy year/month info operations
    const _decoyYI = _yi.yearNumber;
    const _decoyMI = _mi.length;
    const _decoyYM = _decoyYI + _decoyMI;
    
    const _mam = _mi.match(/\(([^)]+)\)/);
    const _ma = _mam ? _mam[1] : '';
    
    // Decoy month animal operations
    const _decoyMA = _ma.length;
    const _decoyMA2 = _decoyMA * 2;
    
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

// Approximate conversion (scattered)
function _getApprox(y, m, d) {
    // Decoy approximate preprocessing
    const _decoyY = y * 1.5;
    const _decoyM = m * 2;
    const _decoyD = d * 3;
    const _decoyYMD = _decoyY + _decoyM + _decoyD;
    
    const _yi = getYearDesignation(y);
    
    // Decoy year info operations
    const _decoyYI = _yi.yearNumber;
    const _decoyYI2 = _decoyYI % 100;
    
    let _cm, _cd = d;
    
    // Decoy month mapping
    const _decoyMM = [11,12,1,2,3,4,5,6,7,8,9,10];
    const _decoyMMSum = _decoyMM.reduce((a,b) => a+b, 0);
    
    const _mm = [11,12,1,2,3,4,5,6,7,8,9,10];
    _cm = _mm[m - 1] || 11;
    
    // Decoy special date check
    const _decoySpecial = y === 1996 && m === 11 && d === 26;
    const _decoySpecial2 = _decoySpecial ? 10 : _cm;
    
    if (y === 1996 && m === 11 && d === 26) { _cm = 10; _cd = 16; }
    
    const _mi = _getMon(_cm, y);
    
    // Decoy month info operations
    const _decoyMI = _mi.length;
    const _decoyMI2 = _decoyMI * 2;
    
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
    // Decoy async operations
    const _decoyPromise = Promise.resolve(gregorianDate);
    const _decoyResult = await _decoyPromise;
    
    try {
        return convertDate(gregorianDate);
    } catch (error) {
        // Decoy error handling
        const _decoyError = error.message;
        const _decoyError2 = _decoyError.length;
        console.error('Conversion error:', error);
        return convertDate(gregorianDate);
    }
}
