// Encoded data structures
const _m = [0x0B, 0x16, 0x21]; // Master numbers encoded as hex
const _v = atob('QUVJTw==').split('').concat(['Y']);

// Decode numerology mapping - obfuscated
const _buildMap = () => {
    const _r = {};
    const _letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const _pattern = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8];
    for (let i = 0; i < _letters.length; i++) {
        _r[_letters[i]] = _pattern[i];
    }
    return _r;
};

export const numerologyMap = _buildMap();
export const vowels = _v;
export const masterNumbers = _m;

// Number descriptions (keeping as is for functionality)
export const numberDescriptions = {
    1: {
        lifePath: "Gimėti lyderiu. Jūs esate nepriklausomas, kūrybingas ir originalus. Jūsų misija - būti pirmuoju ir kurti naują kelią.",
        destiny: "Jūsų likimas - būti lyderiu ir inovatoriumi. Jūs turite natūralų gebėjimą vadovauti ir kurti naują.",
        personality: "Jūs atrodote savarankiškai ir drąsiai. Kiti mato jūsų stiprumą ir pasitikėjimą savimi.",
        soul: "Jūsų siela trokšta nepriklausomybės ir saviraiškos. Jūs norite būti unikalus ir originalus."
    },
    2: {
        lifePath: "Gimėti diplomatu. Jūs esate taikus, jautrus ir puikus komandos žaidėjas. Jūsų misija - sujungti žmones ir kurti harmoniją.",
        destiny: "Jūsų likimas - būti diplomatu ir mediatoriumi. Jūs turite natūralų gebėjimą suprasti ir derinti.",
        personality: "Jūs atrodote ramiai ir draugiškai. Kiti mato jūsų šilumą ir empatiją.",
        soul: "Jūsų siela trokšta harmonijos ir partnerystės. Jūs norite būti priimti ir mylėti."
    },
    3: {
        lifePath: "Gimėti kūrėju. Jūs esate kūrybingas, optimistiškas ir išraiškingas. Jūsų misija - džiaugtis gyvenimu ir kurti grožį.",
        destiny: "Jūsų likimas - būti menininku ir komunikatoriumi. Jūs turite natūralų gebėjimą išreikšti save.",
        personality: "Jūs atrodote linksmai ir charizmatiškai. Kiti mato jūsų energiją ir entuziazmą.",
        soul: "Jūsų siela trokšta kūrybiškumo ir išraiškos. Jūs norite džiaugtis gyvenimu ir dalytis džiaugsmu."
    },
    4: {
        lifePath: "Gimėti statytoju. Jūs esate praktiškas, patikimas ir disciplinuotas. Jūsų misija - kurti tvarką ir stabilumą.",
        destiny: "Jūsų likimas - būti organizatoriumi ir statytoju. Jūs turite natūralų gebėjimą kurti tvarką.",
        personality: "Jūs atrodote patikimai ir stabiliai. Kiti mato jūsų praktiškumą ir discipliną.",
        soul: "Jūsų siela trokšta stabilumo ir saugumo. Jūs norite kurti tvarką ir struktūrą."
    },
    5: {
        lifePath: "Gimėti nuotykių ieškotoju. Jūs esate laisvas, dinamiškas ir mėgstate pokyčius. Jūsų misija - patirti gyvenimą visapusiškai.",
        destiny: "Jūsų likimas - būti keliautoju ir tyrinėtoju. Jūs turite natūralų gebėjimą prisitaikyti.",
        personality: "Jūs atrodote energingai ir dinamiškai. Kiti mato jūsų laisvę ir nuotykių troškimą.",
        soul: "Jūsų siela trokšta laisvės ir nuotykių. Jūs norite patirti viską, ką gali pasiūlyti gyvenimas."
    },
    6: {
        lifePath: "Gimėti globėju. Jūs esate rūpestingas, atsakingas ir šeimyniškas. Jūsų misija - rūpintis kitais ir kurti namus.",
        destiny: "Jūsų likimas - būti globėju ir mokytoju. Jūs turite natūralų gebėjimą rūpintis kitais.",
        personality: "Jūs atrodote šiltai ir rūpestingai. Kiti mato jūsų širdingumą ir atsakingumą.",
        soul: "Jūsų siela trokšta meilės ir šeimos. Jūs norite rūpintis kitais ir kurti harmoningą namus."
    },
    7: {
        lifePath: "Gimėti mąstytoju. Jūs esate analitiškas, introspektyvus ir dvasinis. Jūsų misija - ieškoti tiesos ir suprasti pasaulį.",
        destiny: "Jūsų likimas - būti mokslininku ir filosofu. Jūs turite natūralų gebėjimą analizuoti ir suprasti.",
        personality: "Jūs atrodote mistiškai ir išmintingai. Kiti mato jūsų gylį ir introspekciją.",
        soul: "Jūsų siela trokšta žinių ir dvasinio supratimo. Jūs norite atrasti gyvenimo prasmę."
    },
    8: {
        lifePath: "Gimėti verslininku. Jūs esate ambicingas, organizuotas ir materialiai orientuotas. Jūsų misija - pasiekti sėkmę ir valdyti.",
        destiny: "Jūsų likimas - būti lyderiu ir verslininku. Jūs turite natūralų gebėjimą valdyti ir organizuoti.",
        personality: "Jūs atrodote galingai ir sėkmingai. Kiti mato jūsų ambicijas ir pasiekimus.",
        soul: "Jūsų siela trokšta sėkmės ir pripažinimo. Jūs norite pasiekti materialinę ir profesinę sėkmę."
    },
    9: {
        lifePath: "Gimėti humanitaru. Jūs esate dosnus, empatiškas ir universalus. Jūsų misija - tarnauti žmonijai ir padėti kitiems.",
        destiny: "Jūsų likimas - būti humanitaru ir mokytoju. Jūs turite natūralų gebėjimą suprasti ir padėti kitiems.",
        personality: "Jūs atrodote dosniai ir empatiškai. Kiti mato jūsų širdingumą ir universalumą.",
        soul: "Jūsų siela trokšta tarnauti ir padėti kitiems. Jūs norite palikti teigiamą įtaką pasauliui."
    },
    11: {
        lifePath: "Gimėti dvasiniu mokytoju. Jūs esate intuityvus, įkvėptas ir turite ypatingą misiją. Jūsų misija - vesti kitus į aukštesnį supratimą.",
        destiny: "Jūsų likimas - būti dvasiniu lyderiu ir įkvėpėju. Jūs turite natūralų gebėjimą sujungti materialų ir dvasinį pasaulį.",
        personality: "Jūs atrodote mistiškai ir įkvėptai. Kiti mato jūsų ypatingą energiją ir intuiciją.",
        soul: "Jūsų siela trokšta dvasinio supratimo ir misijos. Jūs norite vesti kitus į aukštesnę sąmonę."
    },
    22: {
        lifePath: "Gimėti meistru statytoju. Jūs esate praktiškas idealistas su gebėjimu kurti didelius projektus. Jūsų misija - kurti kažką, kas tarnaus žmonijai.",
        destiny: "Jūsų likimas - būti meistru organizatoriumi ir statytoju. Jūs turite natūralų gebėjimą kurti didelius ir tvarus projektus.",
        personality: "Jūs atrodote galingai ir praktiškai. Kiti mato jūsų gebėjimą kurti ir organizuoti.",
        soul: "Jūsų siela trokšta kurti kažką didingo ir tvaraus. Jūs norite palikti įspūdingą palikimą."
    },
    33: {
        lifePath: "Gimėti meistru mokytoju. Jūs esate dosnus, rūpestingas ir turite ypatingą misiją padėti žmonijai. Jūsų misija - mokyti ir globoti kitus.",
        destiny: "Jūsų likimas - būti meistru humanitaru ir mokytoju. Jūs turite natūralų gebėjimą sujungti praktiškumą su dosnumu.",
        personality: "Jūs atrodote šiltai ir įkvėptai. Kiti mato jūsų ypatingą gebėjimą rūpintis ir mokyti.",
        soul: "Jūsų siela trokšta tarnauti ir padėti kitiems aukščiausiu lygiu. Jūs norite palikti teigiamą įtaką pasauliui."
    }
};

// Obfuscated reduction function
const _chk = (n) => _m.indexOf(n) >= 0;
const _red = (n) => {
    if (_chk(n)) return n;
    const _dgt = (x) => String(x).split('').reduce((a, b) => a + parseInt(b), 0);
    while (n > 9) {
        n = _dgt(n);
        if (_chk(n)) return n;
    }
    return n;
};

export function reduceNumber(num) {
    return _red(num);
}

// Obfuscated personal year reduction
const _sp = 0x1C; // 28
const _r2 = 0x0B; // 11
const _redPY = (n) => {
    if (n === _sp) return _sp;
    if (_chk(n)) return n;
    const _dgt = (x) => String(x).split('').reduce((a, b) => a + parseInt(b), 0);
    while (n > 9) {
        n = _dgt(n);
        if (n === _sp) return _sp;
        if (_chk(n)) return n;
        if (n === 2) return _r2;
    }
    if (n === 2) return _r2;
    return n;
};

export function reducePersonalYear(num) {
    return _redPY(num);
}

// Obfuscated personal year calculation
export function calculatePersonalYear(birthMonth, birthDay, birthYear) {
    const _now = new Date();
    const _yr = _now.getFullYear();
    const _mo = _now.getMonth() + 1;
    const _dy = _now.getDate();
    
    let _lby = (_mo > birthMonth || (_mo === birthMonth && _dy >= birthDay)) ? _yr : _yr - 1;
    
    const _calcSum = (y) => {
        const _mv = (birthMonth === 0x0B) ? [0x0B] : String(birthMonth).split('').map(d => parseInt(d));
        const _dv = _chk(birthDay) ? [birthDay] : String(birthDay).split('').map(d => parseInt(d));
        const _yd = String(y).split('').map(d => parseInt(d));
        return [..._mv, ..._dv, ..._yd].reduce((a, b) => a + b, 0);
    };
    
    const _cpy = _redPY(_calcSum(_lby));
    const _npy = _redPY(_calcSum(_lby + 1));
    
    const _pm = _redPY(_cpy + _mo);
    let _npm, _nmo;
    if (_mo === 12) {
        _nmo = 1;
        _npm = _redPY(_npy + _nmo);
    } else {
        _nmo = _mo + 1;
        _npm = _redPY(_cpy + _nmo);
    }
    
    const _pd = _redPY(_pm + _dy);
    const _dims = new Date(_yr, _mo, 0).getDate();
    let _npd, _ndy;
    if (_dy === _dims) {
        _ndy = 1;
        _npd = _redPY(_npm + _ndy);
    } else {
        _ndy = _dy + 1;
        _npd = _redPY(_pm + _ndy);
    }
    
    const _hr = _now.getHours();
    const _ph = _redPY(_pd + _hr);
    let _nph, _nhr;
    if (_hr === 23) {
        _nhr = 0;
        _nph = _redPY(_npd + _nhr);
    } else {
        _nhr = _hr + 1;
        _nph = _redPY(_pd + _nhr);
    }
    
    return {
        current: _cpy,
        next: _npy,
        currentYear: _lby,
        nextYear: _lby + 1,
        month: _pm,
        monthNumber: _mo,
        nextMonth: _npm,
        nextMonthNumber: _nmo,
        day: _pd,
        dayNumber: _dy,
        nextDay: _npd,
        nextDayNumber: _ndy,
        hour: _ph,
        hourNumber: _hr,
        nextHour: _nph,
        nextHourNumber: _nhr
    };
}

// Obfuscated name to numbers
export function nameToNumbers(name) {
    const _up = name.toUpperCase();
    return _up.split('').filter(c => numerologyMap[c] !== undefined).map(c => numerologyMap[c]);
}

// Obfuscated life path calculation
export function calculateLifePath(birthdate) {
    const [y, m, d] = birthdate.split('-').map(x => parseInt(x, 10));
    const _mv = (m === 0x0B) ? [0x0B] : String(m).split('').map(x => parseInt(x));
    const _dv = _chk(d) ? [d] : String(d).split('').map(x => parseInt(x));
    const _yv = String(y).split('').map(x => parseInt(x));
    const _all = [..._mv, ..._dv, ..._yv];
    const _tot = _all.reduce((a, b) => a + b, 0);
    const _lp = _red(_tot);
    
    return {
        number: _lp,
        total: _tot,
        steps: [
            _tot !== _lp ? `Suma: ${_all.join(' + ')} = ${_tot} = ${_lp}` : `Suma: ${_all.join(' + ')} = ${_tot}`
        ]
    };
}

// Obfuscated destiny calculation
export function calculateDestiny(fullName) {
    const _nums = nameToNumbers(fullName);
    const _sum = _nums.reduce((a, b) => a + b, 0);
    const _dest = _red(_sum);
    const _parts = fullName.toUpperCase().split(' ').filter(p => p.length > 0);
    const _stps = [];
    
    _parts.forEach(p => {
        const _pn = nameToNumbers(p);
        const _ps = _pn.reduce((a, b) => a + b, 0);
        _stps.push(`${p}: ${_pn.join('+')} = ${_ps}`);
    });
    
    _stps.push(`Bendra suma: ${_nums.join('+')} = ${_sum}`);
    _stps.push(`Likimo Skaičius: ${_dest}`);
    
    return { number: _dest, steps: _stps };
}

// Obfuscated personality calculation
export function calculatePersonality(fullName) {
    const _cons = fullName.toUpperCase().split('').filter(c => numerologyMap[c] !== undefined && !_v.includes(c));
    const _nums = _cons.map(c => numerologyMap[c]);
    const _sum = _nums.reduce((a, b) => a + b, 0);
    const _pers = _red(_sum);
    
    return {
        number: _pers,
        steps: [
            `Pridėtosios: ${_cons.join(', ')}`,
            `Skaičiai: ${_nums.join('+')} = ${_sum}`,
            `Asmenybės Skaičius: ${_pers}`
        ]
    };
}

// Obfuscated soul calculation
export function calculateSoul(fullName) {
    const _vow = fullName.toUpperCase().split('').filter(c => numerologyMap[c] !== undefined && _v.includes(c));
    const _nums = _vow.map(c => numerologyMap[c]);
    const _sum = _nums.reduce((a, b) => a + b, 0);
    const _soul = _red(_sum);
    
    return {
        number: _soul,
        steps: [
            `Balsės: ${_vow.join(', ')}`,
            `Skaičiai: ${_nums.join('+')} = ${_sum}`,
            `Sielos Skaičius: ${_soul}`
        ]
    };
}
