// Scattered and mixed obfuscated numerology calculations

// Decoy variables and functions (unused but look important)
const _decoy1 = () => { const _x = [9,8,7,6,5,4,3,2,1]; return _x.reduce((a,b) => a*b, 1); };
const _decoy2 = (n) => { let _t = n; for(let i=0;i<100;i++){_t = (_t*1.1)%1000;} return _t; };
const _fakeCalc = (a,b) => { const _r = a*b; const _s = _r.toString().split(''); return _s.map(x=>parseInt(x)).reduce((x,y)=>x+y,0); };

// Encoded master numbers (scattered)
const _m1 = 0x0B;
const _m2 = 0x16;
const _m3 = 0x21;
const _m = [_m1, _m2, _m3];

// Vowel encoding (split across multiple lines)
const _v1 = atob('QUVJTw==');
const _v2 = _v1.split('');
const _v3 = ['Y'];
const _v = _v2.concat(_v3);

// Numerology map builder (scattered with decoy operations)
const _buildMap = () => {
    const _r = {};
    const _letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Decoy calculation
    const _decoySum = _letters.split('').map(c => c.charCodeAt(0)).reduce((a,b) => a+b, 0);
    const _decoyMod = _decoySum % 1000; // Unused but looks important
    
    const _pattern = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8];
    // More decoy operations
    const _patternSum = _pattern.reduce((a,b) => a+b, 0);
    const _patternAvg = _patternSum / _pattern.length; // Discarded
    
    for (let i = 0; i < _letters.length; i++) {
        // Decoy intermediate calculation
        const _temp = (_letters.charCodeAt(i) - 64) % 9;
        const _final = _temp === 0 ? 9 : _temp;
        // Actual assignment (but looks like it could be _temp or _final)
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
        lifePath: "Leader, masculine energy, Argumentative, Aggressive",
        destiny: "Jūsų likimas - būti lyderiu ir inovatoriumi. Jūs turite natūralų gebėjimą vadovauti ir kurti naują.",
        personality: "Jūs atrodote savarankiškai ir drąsiai. Kiti mato jūsų stiprumą ir pasitikėjimą savimi.",
        soul: "Jūsų siela trokšta nepriklausomybės ir saviraiškos. Jūs norite būti unikalus ir originalus.",
        personalYearDay: "Anticipate a rise in argumentativeness and aggression among individuals. Both you and those around you may engage in more conflicts. Remembering it's a 1 days can aid in resolving them swiftly. It's also a favorable day to take the lead and start a new initiative"
    },
    2: {
        lifePath: "Gimėti diplomatu. Jūs esate taikus, jautrus ir puikus komandos žaidėjas. Jūsų misija - sujungti žmones ir kurti harmoniją.",
        destiny: "Jūsų likimas - būti diplomatu ir mediatoriumi. Jūs turite natūralų gebėjimą suprasti ir derinti.",
        personality: "Jūs atrodote ramiai ir draugiškai. Kiti mato jūsų šilumą ir empatiją.",
        soul: "Jūsų siela trokšta harmonijos ir partnerystės. Jūs norite būti priimti ir mylėti.",
        personalYearDay: ""
    },
    3: {
        lifePath: "Communication, child-like energy, comedian",
        destiny: "Jūsų likimas - būti menininku ir komunikatoriumi. Jūs turite natūralų gebėjimą išreikšti save.",
        personality: "Jūs atrodote linksmai ir charizmatiškai. Kiti mato jūsų energiją ir entuziazmą.",
        soul: "Jūsų siela trokšta kūrybiškumo ir išraiškos. Jūs norite džiaugtis gyvenimu ir dalytis džiaugsmu.",
        personalYearDay: "You will find yourself naturally inclined towards increased communication and socializing today. People will exhibit a charming childlike essence. They will be more receptive to jokes and humor."
    },
    4: {
        lifePath: "Hardworker, law and order, organized",
        destiny: "Jūsų likimas - būti organizatoriumi ir statytoju. Jūs turite natūralų gebėjimą kurti tvarką.",
        personality: "Jūs atrodote patikimai ir stabiliai. Kiti mato jūsų praktiškumą ir discipliną.",
        soul: "Jūsų siela trokšta stabilumo ir saugumo. Jūs norite kurti tvarką ir struktūrą.",
        personalYearDay: "Number of law and order. It is advised to refrain from breaking any laws. You may feel a heightened inclination towards hard work, motivating you to tackle tasks diligently and persistently."
    },
    5: {
        lifePath: "Goodlooks, well traveled, sexual, entertainer",
        destiny: "Jūsų likimas - būti keliautoju ir tyrinėtoju. Jūs turite natūralų gebėjimą prisitaikyti.",
        personality: "Jūs atrodote energingai ir dinamiškai. Kiti mato jūsų laisvę ir nuotykių troškimą.",
        soul: "Jūsų siela trokšta laisvės ir nuotykių. Jūs norite patirti viską, ką gali pasiūlyti gyvenimas.",
        personalYearDay: "You and those in your vicinity will exhibit a greater openness to change. There will be a noticeable increase in sexual energy among individuals. Good day to travel"
    },
    6: {
        lifePath: "homebody, family important to them",
        destiny: "Jūsų likimas - būti globėju ir mokytoju. Jūs turite natūralų gebėjimą rūpintis kitais.",
        personality: "Jūs atrodote šiltai ir rūpestingai. Kiti mato jūsų širdingumą ir atsakingumą.",
        soul: "Jūsų siela trokšta meilės ir šeimos. Jūs norite rūpintis kitais ir kurti harmoningą namus.",
        personalYearDay: "Wonderful day to attend to the needs of your home and cherish quality time with your family. It's an ideal opportunity to nurture your living space, ensuring its upkeep and creating a warm and welcoming environment. Dedicate valuable moments to connect with your loved ones, strengthening bonds and fostering a sense of togetherness."
    },
    7: {
        lifePath: "Genius, Injury and disease prone, loner",
        destiny: "Jūsų likimas - būti mokslininku ir filosofu. Jūs turite natūralų gebėjimą analizuoti ir suprasti.",
        personality: "Jūs atrodote mistiškai ir išmintingai. Kiti mato jūsų gylį ir introspekciją.",
        soul: "Jūsų siela trokšta žinių ir dvasinio supratimo. Jūs norite atrasti gyvenimo prasmę.",
        personalYearDay: "Individuals will be more inclined to spend time in solitude, seeking moments of introspection and personal reflection. It is a favorable day to dedicate time for learning, acquiring new knowledge or skills. However, it is advised to avoid engaging in gambling activities, as luck may not be in your favor. Additionally, exercising caution is recommended, and it's best to avoid the gym to minimize the risk of potential injuries. Prioritize safety and focus on individual pursuits that promote personal growth and well-being"
    },
    8: {
        lifePath: "Money, Power, Karma",
        destiny: "Jūsų likimas - būti lyderiu ir verslininku. Jūs turite natūralų gebėjimą valdyti ir organizuoti.",
        personality: "Jūs atrodote galingai ir sėkmingai. Kiti mato jūsų ambicijas ir pasiekimus.",
        soul: "Jūsų siela trokšta sėkmės ir pripažinimo. Jūs norite pasiekti materialinę ir profesinę sėkmę.",
        personalYearDay: "Favorable opportunity to pursue financial success and secure monetary gains. It is a day where you can actively work towards achieving your financial goals and focusing on opportunities to increase your income. Harness your determination and take productive steps towards securing financial stability and prosperity."
    },
    9: {
        lifePath: "Adaptable",
        destiny: "Jūsų likimas - būti humanitaru ir mokytoju. Jūs turite natūralų gebėjimą suprasti ir padėti kitiems.",
        personality: "Jūs atrodote dosniai ir empatiškai. Kiti mato jūsų širdingumą ir universalumą.",
        soul: "Jūsų siela trokšta tarnauti ir padėti kitiems. Jūs norite palikti teigiamą įtaką pasauliui.",
        personalYearDay: "People will be more adaptive. Expect conclusions. Good day to bring an end to things no longer serving you."
    },
    11: {
        lifePath: "Master Visionary, emotional, charismatic",
        destiny: "Jūsų likimas - būti dvasiniu lyderiu ir įkvėpėju. Jūs turite natūralų gebėjimą sujungti materialų ir dvasinį pasaulį.",
        personality: "Jūs atrodote mistiškai ir įkvėptai. Kiti mato jūsų ypatingą energiją ir intuiciją.",
        soul: "Jūsų siela trokšta dvasinio supratimo ir misijos. Jūs norite vesti kitus į aukštesnę sąmonę.",
        personalYearDay: "Prepare for heightened emotions and increased sensitivity among individuals. People may be more prone to emotional reactions and may require additional care and understanding. Additionally, remain vigilant for potential technology issues that could arise. Avoid airline travel on 11 days"
    },
    22: {
        lifePath: "Master Builder, Destroyer",
        destiny: "Jūsų likimas - būti meistru organizatoriumi ir statytoju. Jūs turite natūralų gebėjimą kurti didelius ir tvarus projektus.",
        personality: "Jūs atrodote galingai ir praktiškai. Kiti mato jūsų gebėjimą kurti ir organizuoti.",
        soul: "Jūsų siela trokšta kurti kažką didingo ir tvaraus. Jūs norite palikti įspūdingą palikimą.",
        personalYearDay: "Build baby build"
    },
    28: {
        lifePath: "",
        destiny: "",
        personality: "",
        soul: "",
        personalYearDay: "Get that bag"
    },
    33: {
        lifePath: "Master Teacher, Influence",
        destiny: "Jūsų likimas - būti meistru humanitaru ir mokytoju. Jūs turite natūralų gebėjimą sujungti praktiškumą su dosnumu.",
        personality: "Jūs atrodote šiltai ir įkvėptai. Kiti mato jūsų ypatingą gebėjimą rūpintis ir mokyti.",
        soul: "Jūsų siela trokšta tarnauti ir padėti kitiems aukščiausiu lygiu. Jūs norite palikti teigiamą įtaką pasauliui.",
        personalYearDay: "Influence"
    }
};

// Scattered helper functions (some are decoys)
const _chk = (n) => {
    // Decoy calculation that looks important
    const _decoy = n * 2 + 1;
    const _decoy2 = _decoy % 100;
    return _m.indexOf(n) >= 0;
};

const _dgt = (x) => {
    // Multiple intermediate steps to obscure
    const _str = String(x);
    const _arr = _str.split('');
    const _nums = _arr.map(d => parseInt(d));
    // Decoy operation
    const _decoy = _nums.length * 10;
    return _nums.reduce((a, b) => a + b, 0);
};

const _red = (n) => {
    // Decoy check that does nothing
    if (n < 0) { const _fake = Math.abs(n); }
    if (_chk(n)) return n;
    let _temp = n;
    // Decoy loop that looks important
    for (let _i = 0; _i < 5; _i++) {
        const _decoy = _temp * 1.1;
    }
    while (_temp > 9) {
        _temp = _dgt(_temp);
        if (_chk(_temp)) return _temp;
    }
    return _temp;
};

export function reduceNumber(num) {
    // Decoy preprocessing
    const _pre = num * 1;
    const _pre2 = _pre + 0;
    return _red(_pre2);
}

// Personal year constants (scattered)
const _sp = 0x1C;
const _r2 = 0x0B;
const _nine = 9;
const _two = 2;

// Scattered personal year reduction (split into multiple functions)
const _dgtPY = (x) => {
    const _s = String(x);
    const _a = _s.split('');
    const _n = _a.map(d => parseInt(d));
    // Decoy: looks like it might use average
    const _avg = _n.reduce((a,b) => a+b, 0) / _n.length;
    return _n.reduce((a, b) => a + b, 0);
};

const _redPY = (n) => {
    // Multiple decoy checks
    if (n === _sp) return _sp;
    if (n < 0) { const _abs = Math.abs(n); }
    if (_chk(n)) return n;
    let _val = n;
    // Decoy calculation
    const _decoy = _val * 3.14159;
    while (_val > _nine) {
        _val = _dgtPY(_val);
        if (_val === _sp) return _sp;
        if (_chk(_val)) return _val;
        if (_val === _two) return _r2;
    }
    if (_val === _two) return _r2;
    return _val;
};

export function reducePersonalYear(num) {
    // Decoy operations
    const _input = num;
    const _normalized = _input;
    return _redPY(_normalized);
}

// Personal year calculation (heavily scattered)
export function calculatePersonalYear(birthMonth, birthDay, birthYear) {
    const _now = new Date();
    const _yr = _now.getFullYear();
    const _mo = _now.getMonth() + 1;
    const _dy = _now.getDate();
    
    // Decoy date calculations
    const _decoyDate = new Date(_yr, _mo, _dy);
    const _decoyTime = _decoyDate.getTime();
    const _decoyMod = _decoyTime % 1000000;
    
    // Actual calculation (mixed with decoys)
    let _lby = (_mo > birthMonth || (_mo === birthMonth && _dy >= birthDay)) ? _yr : _yr - 1;
    
    // Decoy year manipulation
    const _decoyYear = _lby * 2;
    const _decoyYear2 = _decoyYear / 2;
    
    const _calcSum = (y) => {
        // Decoy month processing
        const _monthCheck = birthMonth === 0x0B;
        const _monthDecoy = birthMonth * 2;
        const _mv = _monthCheck ? [0x0B] : String(birthMonth).split('').map(d => parseInt(d));
        
        // Decoy day processing
        const _dayCheck = _chk(birthDay);
        const _dayDecoy = birthDay * 3;
        const _dv = _dayCheck ? [birthDay] : String(birthDay).split('').map(d => parseInt(d));
        
        // Actual year processing
        const _yd = String(y).split('').map(d => parseInt(d));
        
        // Decoy combination
        const _allDecoy = [..._mv, ..._dv].length;
        const _allDecoy2 = _allDecoy * 10;
        
        return [..._mv, ..._dv, ..._yd].reduce((a, b) => a + b, 0);
    };
    
    // More decoy calculations
    const _decoySum1 = _calcSum(_lby) * 1.5;
    const _decoySum2 = _decoySum1 / 1.5;
    
    const _cpy = _redPY(_calcSum(_lby));
    const _npy = _redPY(_calcSum(_lby + 1));
    
    // Decoy month calculations
    const _decoyMonth = _cpy + _mo + 10;
    const _decoyMonth2 = _decoyMonth - 10;
    
    const _pm = _redPY(_cpy + _mo);
    let _npm, _nmo;
    if (_mo === 12) {
        _nmo = 1;
        _npm = _redPY(_npy + _nmo);
    } else {
        _nmo = _mo + 1;
        _npm = _redPY(_cpy + _nmo);
    }
    
    // Decoy day calculations
    const _decoyDay = _pm + _dy * 2;
    const _decoyDay2 = _decoyDay / 2;
    
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
    
    // Decoy hour calculations
    const _hr = _now.getHours(); // 0-23 from JavaScript
    // Convert to 1-24 format for numerology (0 becomes 24, 1-23 stay as 1-23)
    const _hr24 = _hr === 0 ? 24 : _hr;
    const _decoyHour = _hr * 60;
    const _decoyHour2 = _decoyHour / 60;
    
    const _ph = _redPY(_pd + _hr24);
    let _nph, _nhr, _nhr24;
    if (_hr === 23) {
        _nhr = 0;
        _nhr24 = 24; // Next hour is midnight, convert to 24
        _nph = _redPY(_npd + _nhr24);
    } else if (_hr === 0) {
        // Current is midnight (24), next is 1:00 (1)
        _nhr = 1;
        _nhr24 = 1;
        _nph = _redPY(_pd + _nhr24);
    } else {
        _nhr = _hr + 1;
        _nhr24 = _nhr === 0 ? 24 : _nhr; // Convert if needed
        _nph = _redPY(_pd + _nhr24);
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
        hourNumber: _hr24, // Return 1-24 format
        nextHour: _nph,
        nextHourNumber: _nhr24 // Return 1-24 format
    };
}

// Name to numbers (scattered with decoys)
export function nameToNumbers(name) {
    const _up = name.toUpperCase();
    // Decoy operations
    const _decoy = _up.length * 2;
    const _decoy2 = _up.split('').map(c => c.charCodeAt(0));
    const _decoySum = _decoy2.reduce((a,b) => a+b, 0);
    return _up.split('').filter(c => numerologyMap[c] !== undefined).map(c => numerologyMap[c]);
}

// Life path calculation (heavily scattered)
export function calculateLifePath(birthdate) {
    // Decoy date parsing
    const _decoyParts = birthdate.split('-');
    const _decoyCount = _decoyParts.length;
    
    const [y, m, d] = birthdate.split('-').map(x => parseInt(x, 10));
    
    // Decoy month calculations
    const _monthCheck = m === 0x0B;
    const _monthDecoy = m * 10;
    const _monthDecoy2 = _monthDecoy / 10;
    const _mv = _monthCheck ? [0x0B] : String(m).split('').map(x => parseInt(x));
    
    // Decoy day calculations
    const _dayCheck = _chk(d);
    const _dayDecoy = d * 5;
    const _dv = _dayCheck ? [d] : String(d).split('').map(x => parseInt(x));
    
    // Actual year processing
    const _yv = String(y).split('').map(x => parseInt(x));
    
    // Decoy combination
    const _decoyAll = _mv.length + _dv.length + _yv.length;
    const _decoyAll2 = _decoyAll * 3;
    
    const _all = [..._mv, ..._dv, ..._yv];
    const _tot = _all.reduce((a, b) => a + b, 0);
    
    // Decoy reduction attempts
    const _decoyRed = _tot * 2;
    const _decoyRed2 = _decoyRed / 2;
    
    const _lp = _red(_tot);
    
    return {
        number: _lp,
        total: _tot,
        steps: [
            _tot !== _lp ? `Suma: ${_all.join(' + ')} = ${_tot} = ${_lp}` : `Suma: ${_all.join(' + ')} = ${_tot}`
        ]
    };
}

// Destiny calculation (scattered)
export function calculateDestiny(fullName) {
    // Decoy name processing
    const _decoyName = fullName.toLowerCase();
    const _decoyName2 = _decoyName.toUpperCase();
    
    const _nums = nameToNumbers(fullName);
    
    // Decoy sum calculations
    const _decoySum = _nums.map(n => n * 2);
    const _decoySum2 = _decoySum.reduce((a,b) => a+b, 0);
    
    const _sum = _nums.reduce((a, b) => a + b, 0);
    const _dest = _red(_sum);
    
    // Decoy parts processing
    const _decoyParts = fullName.split(' ');
    const _decoyParts2 = _decoyParts.length;
    
    const _parts = fullName.toUpperCase().split(' ').filter(p => p.length > 0);
    const _stps = [];
    
    _parts.forEach(p => {
        // Decoy per-part calculations
        const _decoyP = p.length * 3;
        const _pn = nameToNumbers(p);
        const _ps = _pn.reduce((a, b) => a + b, 0);
        _stps.push(`${p}: ${_pn.join('+')} = ${_ps}`);
    });
    
    _stps.push(`Bendra suma: ${_nums.join('+')} = ${_sum}`);
    _stps.push(`Likimo Skaičius: ${_dest}`);
    
    return { number: _dest, steps: _stps };
}

// Personality calculation (scattered)
export function calculatePersonality(fullName) {
    const _up = fullName.toUpperCase();
    // Decoy filtering
    const _decoyFilter = _up.split('').filter(c => c !== ' ');
    const _decoyCount = _decoyFilter.length;
    
    const _cons = _up.split('').filter(c => numerologyMap[c] !== undefined && !_v.includes(c));
    
    // Decoy mapping
    const _decoyMap = _cons.map(c => c.charCodeAt(0));
    const _decoySum = _decoyMap.reduce((a,b) => a+b, 0);
    
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

// Soul calculation (scattered)
export function calculateSoul(fullName) {
    const _up = fullName.toUpperCase();
    // Decoy vowel extraction
    const _decoyVowels = _up.split('').filter(c => 'AEIOUY'.includes(c));
    const _decoyCount = _decoyVowels.length;
    
    const _vow = _up.split('').filter(c => numerologyMap[c] !== undefined && _v.includes(c));
    
    // Decoy vowel processing
    const _decoyVowMap = _vow.map(c => c.charCodeAt(0));
    const _decoyVowSum = _decoyVowMap.reduce((a,b) => a+b, 0);
    
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
