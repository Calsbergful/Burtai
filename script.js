// Numerology letter to number mapping
const numerologyMap = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};

// Vowels for Soul Number calculation
const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];

// Master numbers that should not be reduced
const masterNumbers = [11, 22, 33];

// Number descriptions
const numberDescriptions = {
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
        soul: "Jūsų siela trokšta sėkmės ir pripažinimo. Jūs norite pasiekti materialinį ir profesinį sėkmę."
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
function reduceNumber(num) {
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

// Calculate Life Path Number from birthdate
function calculateLifePath(birthdate) {
    const date = new Date(birthdate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const daySum = reduceNumber(day);
    const monthSum = reduceNumber(month);
    const yearSum = reduceNumber(year);
    
    const total = daySum + monthSum + yearSum;
    const lifePath = reduceNumber(total);
    
    return {
        number: lifePath,
        steps: [
            `Gimimo data: ${day}.${month}.${year}`,
            `Diena: ${day} → ${daySum}`,
            `Mėnuo: ${month} → ${monthSum}`,
            `Metai: ${year} → ${yearSum}`,
            `Suma: ${daySum} + ${monthSum} + ${yearSum} = ${total}`,
            `Gyvenimo Kelio Skaičius: ${lifePath}`
        ]
    };
}

// Convert name to numbers
function nameToNumbers(name) {
    return name.toUpperCase()
        .split('')
        .filter(char => numerologyMap[char] !== undefined)
        .map(char => numerologyMap[char]);
}

// Calculate Destiny Number (Expression Number) from full name
function calculateDestiny(fullName) {
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
function calculatePersonality(fullName) {
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
function calculateSoul(fullName) {
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

// Display results
function displayResults(lifePath, destiny, personality, soul) {
    // Display numbers
    document.getElementById('lifePathNumber').textContent = lifePath.number;
    document.getElementById('destinyNumber').textContent = destiny.number;
    document.getElementById('personalityNumber').textContent = personality.number;
    document.getElementById('soulNumber').textContent = soul.number;
    
    // Display descriptions
    const lifePathDesc = numberDescriptions[lifePath.number]?.lifePath || 'Aprašymas neprieinamas.';
    const destinyDesc = numberDescriptions[destiny.number]?.destiny || 'Aprašymas neprieinamas.';
    const personalityDesc = numberDescriptions[personality.number]?.personality || 'Aprašymas neprieinamas.';
    const soulDesc = numberDescriptions[soul.number]?.soul || 'Aprašymas neprieinamas.';
    
    document.getElementById('lifePathDesc').textContent = lifePathDesc;
    document.getElementById('destinyDesc').textContent = destinyDesc;
    document.getElementById('personalityDesc').textContent = personalityDesc;
    document.getElementById('soulDesc').textContent = soulDesc;
    
    // Display calculation steps
    const stepsContainer = document.getElementById('calculationSteps');
    stepsContainer.innerHTML = '';
    
    const allSteps = [
        { title: 'Gyvenimo Kelio Skaičius', steps: lifePath.steps },
        { title: 'Likimo Skaičius', steps: destiny.steps },
        { title: 'Asmenybės Skaičius', steps: personality.steps },
        { title: 'Sielos Skaičius', steps: soul.steps }
    ];
    
    allSteps.forEach(({ title, steps }) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'step-title';
        titleDiv.textContent = title;
        stepDiv.appendChild(titleDiv);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'step-content';
        contentDiv.innerHTML = steps.join('<br>');
        stepDiv.appendChild(contentDiv);
        
        stepsContainer.appendChild(stepDiv);
    });
    
    // Show results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle form submission
document.getElementById('numerologyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    
    if (!fullName || !birthdate) {
        alert('Prašome užpildyti visus laukus.');
        return;
    }
    
    // Calculate all numbers
    const lifePath = calculateLifePath(birthdate);
    const destiny = calculateDestiny(fullName);
    const personality = calculatePersonality(fullName);
    const soul = calculateSoul(fullName);
    
    // Display results
    displayResults(lifePath, destiny, personality, soul);
});


