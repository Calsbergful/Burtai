import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculatePersonalYear, reducePersonalYear } from '../utils/numerology';
import { getHourAnimal, getFriendlyHours, getEnemyHours, getSoulmateHours } from '../utils/hourAnimals';
import ResultCard from './ResultCard';
import CosmicBackground from './CosmicBackground';

// Personal Year/Month/Day/Hour meanings from database
const personalYearMeanings = {
    1: {
        title: "1 Ciklas - Nauja Pradžia",
        description: "Naujas pradžia jums, tiesiogine prasme. Pradėkite naujus dalykus. Ne laikas būti pasyviam. Būkite aktyvus.",
        color: "from-blue-500 to-cyan-500"
    },
    2: {
        title: "2 Ciklas - Bendradarbiavimas",
        description: "Bendradarbiavimas, santykiai, laukimas. Laikas būti kantriam ir dirbti su kitais.",
        color: "from-pink-500 to-rose-500"
    },
    3: {
        title: "3 Ciklas - Komunikacija",
        description: "Viskas apie komunikaciją. 3-ame, nebūkite atsiskyrėliu. Kalbėkite su daug, tinkluokite, susipažinkite, būkite kūrybingi. Dėmesio spanas tikriausiai nebus toks geras - bus traukiamas daug kryptimis.",
        color: "from-yellow-500 to-orange-500"
    },
    4: {
        title: "4 Ciklas - Darbas ir Tvarka",
        description: "Eikite prie darbo, daugiau smulkmenų. Nelaužykite įstatymų. Praeities teisiniai klausimai. Epstein pirmą kartą pateko į kalėjimą 2008 m., gimęs sausio 20 d., taigi 1/20/2008 sudėjus = 4 - teisė ir tvarka.",
        color: "from-green-500 to-emerald-500"
    },
    5: {
        title: "5 Ciklas - Pokyčiai",
        description: "Kelionės. Atviraus proto, sulaužykite rutiną, būkite atsargūs su seksualine energija, nes trauka bus aukščiausiame taške. Sveikatos ir grožio fokusas geras.",
        color: "from-purple-500 to-violet-500"
    },
    6: {
        title: "6 Ciklas - Šeima",
        description: "Šeima, atsakomybės.",
        color: "from-indigo-500 to-blue-500"
    },
    7: {
        title: "7 Ciklas - Vienatvė ir Mokymasis",
        description: "Leiskite laiką vienam, mokymasis, problemų sprendimas, ne materialistinis, sunkiau sveikatai ir santykiams.",
        color: "from-gray-500 to-slate-500"
    },
    8: {
        title: "8 Ciklas - Pinigai ir Galia",
        description: "Pinigai, karma, galia. Bidenas šiuo metu 8 cikle.",
        color: "from-amber-500 to-yellow-500"
    },
    9: {
        title: "9 Ciklas - Užbaigimas",
        description: "Ciklo užbaigimas. Priverstas prisitaikyti, atsispindėti, tada viską pradedate iš naujo.",
        color: "from-red-500 to-pink-500"
    },
    11: {
        title: "11 Ciklas - Master Skaičius",
        description: "Gali būti vienas geriausių arba vienas blogiausių, priklausomai nuo draugiško astro metų - vieni geriausi metai gyvenime, arba blogiausi, jei priešingi. Dėl aukštesnio dažnio. Daug emocijų, charizma aukščiausiame taške, tapti dvasiniu, turėti kitokį požiūrį metų pabaigoje.",
        color: "from-cyan-500 to-blue-500"
    },
    22: {
        title: "22 Ciklas - Master Skaičius",
        description: "Daug retesnis, daugiausia 4 ciklas. Turi tiksliai sudėti iki 22. Galimybė statyti didesniu mastu.",
        color: "from-violet-500 to-purple-500"
    },
    33: {
        title: "33 Ciklas - Master Skaičius",
        description: "Labai retas, ypač nuo 2000-ųjų. 2020 turėjo kai kurias 22 savybes, o ne 4 - labiau kaip 22/4. Liepos 4 d. JAV - 7 + 4 + 2020 = 33. Galingas skaičius, padidiniklis, veikia kaip posūkio taškas, taigi posūkio taškas Amerikai. Įtakos skaičius, taigi 33/6 cikle įtaka turi didesnį poveikį.",
        color: "from-gold-500 to-yellow-500"
    }
};

export default function PersonalYearCalculator() {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [birthHour, setBirthHour] = useState(''); // Optional birth hour (0-23)
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hourFormat, setHourFormat] = useState('24'); // '24' or '12'

    useEffect(() => {
        // Auto-calculate when all fields are filled
        if (month && day && year && month.length === 2 && day.length === 2 && year.length === 4) {
            calculateResults();
        } else {
            setResults(null);
        }
    }, [month, day, year, birthHour]);

    const calculateResults = () => {
        try {
            setLoading(true);
            const m = parseInt(month);
            const d = parseInt(day);
            const y = parseInt(year);

            if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31) {
                setResults(null);
                return;
            }

            // Validate date
            const dateObj = new Date(y, m - 1, d);
            if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
                setResults(null);
                return;
            }

            // Calculate personal year, month, day, hour
            const personalYear = calculatePersonalYear(m, d, y);
            const now = new Date();

            // Get current values
            const currentPY = personalYear.current;
            const currentPM = personalYear.month;
            const currentPD = personalYear.day;
            const currentPH = personalYear.hour;

            // Get next values
            const nextPY = personalYear.next;
            const nextPM = personalYear.nextMonth;
            const nextPD = personalYear.nextDay;
            const nextPH = personalYear.nextHour;

            // Calculate when next period starts
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            const currentDay = now.getDate();
            const currentHour24 = now.getHours(); // 0-23 from JavaScript
            // Convert to 1-24 format for numerology (0 becomes 24)
            const currentHour = currentHour24 === 0 ? 24 : currentHour24;

            // Next personal year starts on birthday
            let nextPYYear = currentYear;
            if (currentMonth > m || (currentMonth === m && currentDay >= d)) {
                nextPYYear = currentYear + 1;
            }

            // Next personal month starts on birthday day of next month
            // Personal months start on the birthday day number each month
            let nextPMMonth = currentMonth;
            let nextPMYear = currentYear;
            
            // Check if we've passed the birthday day this month
            if (currentDay >= d) {
                // Birthday day has passed, next PM starts next month
                nextPMMonth = currentMonth + 1;
                if (nextPMMonth > 12) {
                    nextPMMonth = 1;
                    nextPMYear = currentYear + 1;
                }
            }
            // If birthday day hasn't passed yet this month, next PM is still this month

            // Next personal day starts tomorrow
            const nextPDDate = new Date(currentYear, currentMonth - 1, currentDay + 1);
            const nextPDDay = nextPDDate.getDate();
            const nextPDMonth = nextPDDate.getMonth() + 1;
            const nextPDYear = nextPDDate.getFullYear();

            // Next personal hour starts next hour (using 1-24 format)
            let nextPHHour, nextPHHour24;
            let nextPHDay = currentDay;
            let nextPHMonth = currentMonth;
            let nextPHYear = currentYear;
            
            if (currentHour === 24) {
                // Current is midnight (24), next is 1:00 (1)
                nextPHHour = 1;
                nextPHHour24 = 1;
            } else if (currentHour === 23) {
                // Current is 23:00, next is midnight (24)
                nextPHHour = 24;
                nextPHHour24 = 0; // For date calculation
                const nextDay = new Date(currentYear, currentMonth - 1, currentDay + 1);
                nextPHDay = nextDay.getDate();
                nextPHMonth = nextDay.getMonth() + 1;
                nextPHYear = nextDay.getFullYear();
            } else {
                // Normal case: next hour is current + 1
                nextPHHour = currentHour + 1;
                nextPHHour24 = nextPHHour === 24 ? 0 : nextPHHour; // For date calculation
            }

            // Check if current hour is friendly/enemy (if birth hour is provided)
            let hourRelationship = 'neutral'; // 'friendly', 'enemy', or 'neutral'
            let birthHourAnimal = null;
            let currentHourAnimal = null;
            
            if (birthHour !== '' && !isNaN(parseInt(birthHour))) {
                const birthHourNum = parseInt(birthHour);
                if (birthHourNum >= 0 && birthHourNum <= 23) {
                    birthHourAnimal = getHourAnimal(birthHourNum);
                    currentHourAnimal = getHourAnimal(currentHour24); // Use 0-23 format for getHourAnimal
                    
                    // Check if current hour animal is friendly
                    const friendlyHours = getFriendlyHours(birthHourAnimal.animal);
                    const soulmateHours = getSoulmateHours(birthHourAnimal.animal);
                    const allFriendly = [...friendlyHours, ...soulmateHours];
                    if (allFriendly.some(ha => ha.animal === currentHourAnimal.animal)) {
                        hourRelationship = 'friendly';
                    } else {
                        // Check if current hour animal is enemy
                        const enemyHours = getEnemyHours(birthHourAnimal.animal);
                        if (enemyHours.some(ha => ha.animal === currentHourAnimal.animal)) {
                            hourRelationship = 'enemy';
                        }
                    }
                }
            }

            setResults({
                personalYear: {
                    current: currentPY,
                    next: nextPY,
                    currentYear: personalYear.currentYear,
                    nextYear: nextPYYear,
                    nextDate: `${nextPYYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                },
                personalMonth: {
                    current: currentPM,
                    next: nextPM,
                    currentMonth: currentMonth,
                    nextMonth: nextPMMonth,
                    nextYear: nextPMYear,
                    nextDate: `${nextPMYear}-${String(nextPMMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                },
                personalDay: {
                    current: currentPD,
                    next: nextPD,
                    currentDay: currentDay,
                    nextDay: nextPDDay,
                    nextMonth: nextPDMonth,
                    nextYear: nextPDYear,
                    nextDate: `${nextPDYear}-${String(nextPDMonth).padStart(2, '0')}-${String(nextPDDay).padStart(2, '0')}`
                },
                personalHour: {
                    current: currentPH,
                    next: nextPH,
                    currentHour: currentHour, // 1-24 format
                    nextHour: nextPHHour, // 1-24 format
                    nextDay: nextPHDay,
                    nextMonth: nextPHMonth,
                    nextYear: nextPHYear,
                    nextDate: `${nextPHYear}-${String(nextPHMonth).padStart(2, '0')}-${String(nextPHDay).padStart(2, '0')} ${formatHourForDate(nextPHHour)}:00`,
                    hourRelationship: hourRelationship, // 'friendly', 'enemy', or 'neutral'
                    birthHourAnimal: birthHourAnimal,
                    currentHourAnimal: currentHourAnimal
                }
            });
        } catch (error) {
            console.error('Error calculating personal year:', error);
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    const getMeaning = (num) => {
        return personalYearMeanings[num] || {
            title: `${num} Ciklas`,
            description: "Šis ciklas turi savo unikalų poveikį jūsų gyvenimui.",
            color: "from-gray-500 to-slate-500"
        };
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('lt-LT', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatHour = (hour24) => {
        // hour24 is in 1-24 format
        if (hourFormat === '12') {
            if (hour24 === 24) {
                return '12:00 AM';
            } else if (hour24 === 12) {
                return '12:00 PM';
            } else if (hour24 > 12) {
                return `${hour24 - 12}:00 PM`;
            } else {
                return `${hour24}:00 AM`;
            }
        } else {
            // 24-hour format
            if (hour24 === 24) {
                return '24:00 (00:00)';
            } else {
                return `${String(hour24).padStart(2, '0')}:00`;
            }
        }
    };

    const formatHourForDate = (hour24) => {
        // For date strings, convert 24-hour format (1-24) to JavaScript hour (0-23)
        // Always use 24-hour format in date strings for consistency
        const jsHour = hour24 === 24 ? 0 : hour24;
        return String(jsHour).padStart(2, '0');
    };

    return (
        <div className="min-h-screen gradient-bg py-4 px-3 sm:py-8 sm:px-4 relative">
            <CosmicBackground />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-4xl mx-auto"
            >
                <div className="backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-white" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}>
                        Asmeniniai Metai, Mėnesiai, Dienos ir Valandos
                    </h2>

                    {/* Input Form */}
                    <div className="mb-6">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-white/80 text-sm mb-2">Mėnuo</label>
                                <input
                                    type="text"
                                    value={month}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        setMonth(value);
                                        if (value.length === 2) {
                                            document.getElementById('day-input-py')?.focus();
                                        }
                                    }}
                                    placeholder="MM"
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm mb-2">Diena</label>
                                <input
                                    id="day-input-py"
                                    type="text"
                                    value={day}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        setDay(value);
                                        if (value.length === 2) {
                                            document.getElementById('year-input-py')?.focus();
                                        }
                                    }}
                                    placeholder="DD"
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm mb-2">Metai</label>
                                <input
                                    id="year-input-py"
                                    type="text"
                                    value={year}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        setYear(value);
                                    }}
                                    placeholder="YYYY"
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                        
                        {/* Birth Hour Input (Optional) */}
                        <div className="mb-4">
                            <label className="block text-white/80 text-sm mb-2 text-center">Gimimo valanda (neprivaloma)</label>
                            <input
                                type="text"
                                value={birthHour}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                                    setBirthHour(value);
                                }}
                                placeholder="03 (Tiger: 03-05)"
                                className="w-full max-w-xs mx-auto block px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                maxLength={2}
                            />
                            <p className="text-xs text-white/50 text-center mt-1">
                                Įveskite gimimo valandą (0-23), pvz. 03 = Tiger (03-05), 11 = Horse (11-13)
                            </p>
                        </div>
                        
                        <p className="text-xs text-white/60 text-center mb-4">
                            Įveskite savo gimimo datą. Skaičiavimai atnaujinami automatiškai.
                        </p>
                        
                        {/* Hour Format Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <label className="text-white/80 text-sm">Valandų formatas:</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setHourFormat('24')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        hourFormat === '24'
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'bg-purple-900/30 text-white/70 hover:bg-purple-800/40'
                                    }`}
                                >
                                    24 val. (1-24)
                                </button>
                                <button
                                    onClick={() => setHourFormat('12')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        hourFormat === '12'
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'bg-purple-900/30 text-white/70 hover:bg-purple-800/40'
                                    }`}
                                >
                                    12 val. (AM/PM)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {loading && (
                        <div className="text-center text-white/60 py-8">
                            Skaičiuojama...
                        </div>
                    )}

                    {results && !loading && (
                        <div className="space-y-6">
                            {/* Personal Year */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <div className={`bg-gradient-to-br ${getMeaning(results.personalYear.current).color} rounded-xl p-6 border-2 border-white/20`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-white">Asmeniniai Metai (PY)</h3>
                                        <span className="text-5xl font-bold text-white drop-shadow-lg">
                                            {results.personalYear.current}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-4 mb-3">
                                        <p className="text-white/90 text-sm font-semibold mb-1">
                                            {getMeaning(results.personalYear.current).title}
                                        </p>
                                        <p className="text-white/80 text-xs">
                                            {getMeaning(results.personalYear.current).description}
                                        </p>
                                    </div>
                                    <div className="text-white/70 text-xs">
                                        <p>Dabartiniai metai: {results.personalYear.currentYear}</p>
                                        <p>Kiti metai ({results.personalYear.next}): prasideda {formatDate(results.personalYear.nextDate)}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Personal Month */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <div className={`bg-gradient-to-br ${getMeaning(results.personalMonth.current).color} rounded-xl p-6 border-2 border-white/20`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white">Asmeniniai Mėnesiai (PM)</h3>
                                        <span className="text-4xl font-bold text-white drop-shadow-lg">
                                            {results.personalMonth.current}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-4 mb-3">
                                        <p className="text-white/90 text-sm font-semibold mb-1">
                                            {getMeaning(results.personalMonth.current).title}
                                        </p>
                                        <p className="text-white/80 text-xs">
                                            {getMeaning(results.personalMonth.current).description}
                                        </p>
                                    </div>
                                    <div className="text-white/70 text-xs">
                                        <p>Dabartinis mėnuo: {results.personalMonth.currentMonth}</p>
                                        <p>Kitas mėnuo ({results.personalMonth.next}): prasideda {formatDate(results.personalMonth.nextDate)}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Personal Day */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <div className={`bg-gradient-to-br ${getMeaning(results.personalDay.current).color} rounded-xl p-6 border-2 border-white/20`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white">Asmeninės Dienos (PD)</h3>
                                        <span className="text-4xl font-bold text-white drop-shadow-lg">
                                            {results.personalDay.current}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-4 mb-3">
                                        <p className="text-white/90 text-sm font-semibold mb-1">
                                            {getMeaning(results.personalDay.current).title}
                                        </p>
                                        <p className="text-white/80 text-xs">
                                            {getMeaning(results.personalDay.current).description}
                                        </p>
                                    </div>
                                    <div className="text-white/70 text-xs">
                                        <p>Dabartinė diena: {results.personalDay.currentDay}</p>
                                        <p>Rytoj ({results.personalDay.next}): {formatDate(results.personalDay.nextDate)}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Personal Hour */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <div className={`bg-gradient-to-br ${getMeaning(results.personalHour.current).color} rounded-xl p-6 border-2 ${
                                    results.personalHour.hourRelationship === 'friendly' 
                                        ? 'border-green-400/60 shadow-lg shadow-green-500/30' 
                                        : results.personalHour.hourRelationship === 'enemy'
                                        ? 'border-red-400/60 shadow-lg shadow-red-500/30'
                                        : 'border-white/20'
                                }`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white">Asmeninės Valandos (PH)</h3>
                                        <span className={`text-4xl font-bold drop-shadow-lg ${
                                            results.personalHour.hourRelationship === 'friendly'
                                                ? 'text-green-300'
                                                : results.personalHour.hourRelationship === 'enemy'
                                                ? 'text-red-300'
                                                : 'text-white'
                                        }`}>
                                            {results.personalHour.current}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-4 mb-3">
                                        <p className="text-white/90 text-sm font-semibold mb-1">
                                            {getMeaning(results.personalHour.current).title}
                                        </p>
                                        <p className="text-white/80 text-xs">
                                            {getMeaning(results.personalHour.current).description}
                                        </p>
                                    </div>
                                    <div className="text-white/70 text-xs">
                                        <p className={results.personalHour.hourRelationship === 'friendly' ? 'text-green-300 font-semibold' : results.personalHour.hourRelationship === 'enemy' ? 'text-red-300 font-semibold' : 'text-white/70'}>
                                            Dabartinė valanda: {formatHour(results.personalHour.currentHour)}
                                            {results.personalHour.hourRelationship === 'friendly' && ' 🟢 Draugiška'}
                                            {results.personalHour.hourRelationship === 'enemy' && ' 🔴 Priešiška'}
                                        </p>
                                        {results.personalHour.birthHourAnimal && results.personalHour.currentHourAnimal && (
                                            <p className="text-white/50 text-[10px] mt-1">
                                                Gimimo valanda: {results.personalHour.birthHourAnimal.name} ({formatHour(results.personalHour.birthHourAnimal.start === 23 ? 24 : results.personalHour.birthHourAnimal.start + 1)}-{formatHour(results.personalHour.birthHourAnimal.end === 1 ? 24 : results.personalHour.birthHourAnimal.end)}) | 
                                                Dabartinė valanda: {results.personalHour.currentHourAnimal.name} ({formatHour(results.personalHour.currentHourAnimal.start === 23 ? 24 : results.personalHour.currentHourAnimal.start + 1)}-{formatHour(results.personalHour.currentHourAnimal.end === 1 ? 24 : results.personalHour.currentHourAnimal.end)})
                                            </p>
                                        )}
                                        <p className="text-white/60 mt-1">Kita valanda ({results.personalHour.next}): {(() => {
                                            const dateParts = results.personalHour.nextDate.split(' ');
                                            const dateStr = dateParts[0];
                                            const hourStr = dateParts[1] || '00:00';
                                            const hour24 = parseInt(hourStr.split(':')[0]);
                                            // Convert JavaScript hour (0-23) to numerology hour (1-24) for display
                                            const numerologyHour = hour24 === 0 ? 24 : hour24;
                                            return `${dateStr} ${formatHour(numerologyHour)}`;
                                        })()}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Info Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-4"
                            >
                                <p className="text-white/90 text-sm mb-2">
                                    <span className="font-semibold text-blue-300">Svarbu:</span> Asmeniniai metai prasideda jūsų gimtadienį, ne sausio 1 d. 
                                    Asmeniniai mėnesiai prasideda jūsų gimimo dienos skaičiumi kiekvieną mėnesį.
                                </p>
                                <p className="text-white/70 text-xs italic">
                                    Asmeninės dienos ir valandos egzistuoja, bet nėra tokios svarbios kaip metai ir mėnesiai. 
                                    Detalės - Database skiltyje.
                                </p>
                            </motion.div>
                        </div>
                    )}

                    {!results && !loading && month && day && year && (
                        <div className="text-center text-red-400 py-4">
                            Neteisinga data. Patikrinkite įvestį.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
