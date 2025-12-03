// Numerology letter to number mapping
export const numerologyMap = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};

// Vowels for Soul Number calculation
export const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];

// Master numbers that should not be reduced
export const masterNumbers = [11, 22, 33];

// Number descriptions
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

// Reduce number to single digit or master number
export function reduceNumber(num) {
    if (masterNumbers.includes(num)) {
        return num;
    }
    
    while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        if (masterNumbers.includes(num)) {
            return num;
        }
    }
    return num;
}

// Reduce number for personal year (skip 2, use 11 instead; keep 28 as 28)
export function reducePersonalYear(num) {
    // Keep 28 as 28 (don't reduce it)
    if (num === 28) {
        return 28;
    }
    
    if (masterNumbers.includes(num)) {
        return num;
    }
    
    while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        // Keep 28 as 28
        if (num === 28) {
            return 28;
        }
        if (masterNumbers.includes(num)) {
            return num;
        }
        // Skip 2, use 11 instead
        if (num === 2) {
            return 11;
        }
    }
    // Skip 2, use 11 instead
    if (num === 2) {
        return 11;
    }
    return num;
}

// Calculate Personal Year from birthdate
export function calculatePersonalYear(birthMonth, birthDay, birthYear) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    // Determine the last birthday that occurred
    let lastBirthdayYear;
    if (currentMonth > birthMonth || (currentMonth === birthMonth && currentDay >= birthDay)) {
        // Birthday has already occurred this year
        lastBirthdayYear = currentYear;
    } else {
        // Birthday hasn't occurred yet this year
        lastBirthdayYear = currentYear - 1;
    }
    
    // Calculate personal year sum without reducing first
    // Use same logic as calculateLifePath but get the total sum
    const calculatePersonalYearSum = (year) => {
        // For month: only November (11) is kept as master number; all others split into digits
        // For day: if it's a master number (11, 22, 33), keep it whole; otherwise split into digits
        // For year: always use individual digits
        const monthValues = (birthMonth === 11) ? [11] : birthMonth.toString().split('').map(d => parseInt(d));
        const dayValues = masterNumbers.includes(birthDay) ? [birthDay] : birthDay.toString().split('').map(d => parseInt(d));
        const yearDigits = year.toString().split('').map(d => parseInt(d));
        
        // Sum all values together
        const allValues = [...monthValues, ...dayValues, ...yearDigits];
        const total = allValues.reduce((sum, val) => sum + val, 0);
        
        return total;
    };
    
    // Calculate current personal year (from last birthday to next birthday)
    const currentPersonalYearSum = calculatePersonalYearSum(lastBirthdayYear);
    const currentPersonalYearNum = reducePersonalYear(currentPersonalYearSum);
    
    // Calculate next personal year (from next birthday to following birthday)
    const nextBirthdayYear = lastBirthdayYear + 1;
    const nextPersonalYearSum = calculatePersonalYearSum(nextBirthdayYear);
    const nextPersonalYearNum = reducePersonalYear(nextPersonalYearSum);
    
    // Calculate personal month (current personal year + current month)
    // currentMonth is already declared above
    const personalMonthSum = currentPersonalYearNum + currentMonth;
    const personalMonthNum = reducePersonalYear(personalMonthSum);
    
    // Calculate next personal month
    let nextMonthNumber, nextPersonalMonthSum, nextPersonalMonthNum;
    if (currentMonth === 12) {
        // If current month is December, next month is January of next personal year
        nextMonthNumber = 1;
        nextPersonalMonthSum = nextPersonalYearNum + nextMonthNumber;
        nextPersonalMonthNum = reducePersonalYear(nextPersonalMonthSum);
    } else {
        // Otherwise, next month is still in current personal year
        nextMonthNumber = currentMonth + 1;
        nextPersonalMonthSum = currentPersonalYearNum + nextMonthNumber;
        nextPersonalMonthNum = reducePersonalYear(nextPersonalMonthSum);
    }
    
    // Calculate personal day (personal month + day of month)
    // currentDay is already declared above
    const personalDaySum = personalMonthNum + currentDay;
    const personalDayNum = reducePersonalYear(personalDaySum);
    
    // Calculate next personal day
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    let nextDayNumber, nextPersonalDaySum, nextPersonalDayNum;
    if (currentDay === daysInMonth) {
        // If today is the last day of the month, next day is first day of next month
        nextDayNumber = 1;
        nextPersonalDaySum = nextPersonalMonthNum + nextDayNumber;
        nextPersonalDayNum = reducePersonalYear(nextPersonalDaySum);
    } else {
        // Otherwise, next day is still in current month
        nextDayNumber = currentDay + 1;
        nextPersonalDaySum = personalMonthNum + nextDayNumber;
        nextPersonalDayNum = reducePersonalYear(nextPersonalDaySum);
    }
    
    // Calculate personal hour (personal day + current hour)
    const currentHour = today.getHours(); // 0-23
    const personalHourSum = personalDayNum + currentHour;
    const personalHourNum = reducePersonalYear(personalHourSum);
    
    // Calculate next personal hour
    let nextHourNumber, nextPersonalHourSum, nextPersonalHourNum;
    if (currentHour === 23) {
        // If current hour is 23, next hour is 0 (midnight) of next day
        nextHourNumber = 0;
        nextPersonalHourSum = nextPersonalDayNum + nextHourNumber;
        nextPersonalHourNum = reducePersonalYear(nextPersonalHourSum);
    } else {
        // Otherwise, next hour is still in current day
        nextHourNumber = currentHour + 1;
        nextPersonalHourSum = personalDayNum + nextHourNumber;
        nextPersonalHourNum = reducePersonalYear(nextPersonalHourSum);
    }
    
    return {
        current: currentPersonalYearNum,
        next: nextPersonalYearNum,
        currentYear: lastBirthdayYear,
        nextYear: nextBirthdayYear,
        month: personalMonthNum,
        monthNumber: currentMonth,
        nextMonth: nextPersonalMonthNum,
        nextMonthNumber: nextMonthNumber,
        day: personalDayNum,
        dayNumber: currentDay,
        nextDay: nextPersonalDayNum,
        nextDayNumber: nextDayNumber,
        hour: personalHourNum,
        hourNumber: currentHour,
        nextHour: nextPersonalHourNum,
        nextHourNumber: nextHourNumber
    };
}

// Convert name to numbers
export function nameToNumbers(name) {
    return name.toUpperCase()
        .split('')
        .filter(char => numerologyMap[char] !== undefined)
        .map(char => numerologyMap[char]);
}

// Calculate Life Path Number from birthdate
export function calculateLifePath(birthdate) {
    // Parse date string (YYYY-MM-DD) to avoid timezone issues
    const [yearPart, monthPart, dayPart] = birthdate.split('-');
    const day = parseInt(dayPart, 10);
    const month = parseInt(monthPart, 10);
    const year = parseInt(yearPart, 10);
    
    // For month: only November (11) is kept as master number; all others split into digits
    // For day: if it's a master number (11, 22, 33), keep it whole; otherwise split into digits
    // For year: always use individual digits
    const monthValues = (month === 11) ? [11] : month.toString().split('').map(d => parseInt(d));
    const dayValues = masterNumbers.includes(day) ? [day] : day.toString().split('').map(d => parseInt(d));
    const yearDigits = year.toString().split('').map(d => parseInt(d));
    
    // Sum all values together
    const allValues = [...monthValues, ...dayValues, ...yearDigits];
    const total = allValues.reduce((sum, val) => sum + val, 0);
    
    // Reduce to single digit or master number
    const lifePath = reduceNumber(total);
    
    // Build calculation steps
    const monthStr = monthValues.join(' + ');
    const dayStr = dayValues.join(' + ');
    const yearStr = yearDigits.join(' + ');
    const allStr = allValues.join(' + ');
    
    return {
        number: lifePath,
        total: total,
        steps: [
            total !== lifePath 
                ? `Suma: ${allStr} = ${total} = ${lifePath}`
                : `Suma: ${allStr} = ${total}`
        ]
    };
}

// Calculate Destiny Number (Expression Number) from full name
export function calculateDestiny(fullName) {
    const numbers = nameToNumbers(fullName);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const destiny = reduceNumber(sum);
    
    const nameParts = fullName.toUpperCase().split(' ').filter(part => part.length > 0);
    const steps = [];
    
    nameParts.forEach(part => {
        const partNumbers = nameToNumbers(part);
        const partSum = partNumbers.reduce((acc, num) => acc + num, 0);
        steps.push(`${part}: ${partNumbers.join('+')} = ${partSum}`);
    });
    
    steps.push(`Bendra suma: ${numbers.join('+')} = ${sum}`);
    steps.push(`Likimo Skaičius: ${destiny}`);
    
    return {
        number: destiny,
        steps: steps
    };
}

// Calculate Personality Number (from consonants)
export function calculatePersonality(fullName) {
    const consonants = fullName.toUpperCase()
        .split('')
        .filter(char => numerologyMap[char] !== undefined && !vowels.includes(char));
    
    const numbers = consonants.map(char => numerologyMap[char]);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const personality = reduceNumber(sum);
    
    return {
        number: personality,
        steps: [
            `Pridėtosios: ${consonants.join(', ')}`,
            `Skaičiai: ${numbers.join('+')} = ${sum}`,
            `Asmenybės Skaičius: ${personality}`
        ]
    };
}

// Calculate Soul Number (from vowels)
export function calculateSoul(fullName) {
    const nameVowels = fullName.toUpperCase()
        .split('')
        .filter(char => numerologyMap[char] !== undefined && vowels.includes(char));
    
    const numbers = nameVowels.map(char => numerologyMap[char]);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const soul = reduceNumber(sum);
    
    return {
        number: soul,
        steps: [
            `Balsės: ${nameVowels.join(', ')}`,
            `Skaičiai: ${numbers.join('+')} = ${sum}`,
            `Sielos Skaičius: ${soul}`
        ]
    };
}

