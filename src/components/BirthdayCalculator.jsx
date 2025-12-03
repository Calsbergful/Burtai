import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateLifePath, reduceNumber, masterNumbers, calculatePersonalYear } from '../utils/numerology';
import { getChineseZodiac, zodiacTranslations, zodiacEmojis } from '../utils/chineseZodiac';
import { getWesternZodiac, zodiacSignTranslations, zodiacSignEmojis } from '../utils/westernZodiac';
import { soulmateRelationships, friendlyRelationships, enemyRelationships, hourAnimals, getHourAnimal, getFriendlyHours, getEnemyHours, hourAnimalEmojis, formatHourRange } from '../utils/hourAnimals';

export default function BirthdayCalculator({ personalBirthdayTrigger = 0 }) {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [results, setResults] = useState(null);

    const calculateResults = (m, d, y) => {
        try {
            if (m && d && y) {
                // Format date as YYYY-MM-DD
                const monthStr = String(m).padStart(2, '0');
                const dayStr = String(d).padStart(2, '0');
                const date = `${y}-${monthStr}-${dayStr}`;
                
                // Validate date
                const dateObj = new Date(y, m - 1, d);
                if (dateObj.getFullYear() == y && dateObj.getMonth() == m - 1 && dateObj.getDate() == d) {
                    const lifePath = calculateLifePath(date);
                    const chineseZodiac = getChineseZodiac(date);
                    const westernZodiacSign = getWesternZodiac(parseInt(m), parseInt(d));
                    const westernZodiac = { sign: westernZodiacSign };
                    
                    // Calculate personal year
                    let personalYear;
                    try {
                        personalYear = calculatePersonalYear(parseInt(m), parseInt(d), parseInt(y));
                    } catch (error) {
                        console.error('Error calculating personal year:', error);
                        personalYear = null;
                    }
                    
                    // Get relationships based on Chinese zodiac
                    const soulmates = soulmateRelationships[chineseZodiac.zodiac] || [];
                    const friendly = friendlyRelationships[chineseZodiac.zodiac] || [];
                    const enemies = enemyRelationships[chineseZodiac.zodiac] || [];
                    
                    // Combine soulmates with friendly, but mark soulmates
                    const allFriendly = [...friendly, ...soulmates];
                    const friendlyAnimals = hourAnimals.filter(ha => allFriendly.includes(ha.animal));
                    const soulmateAnimals = hourAnimals.filter(ha => soulmates.includes(ha.animal));
                    
                    // Calculate hour animal for personal birthday (03:40 = Tiger hour)
                    let birthHourAnimal = null;
                    let birthHourFriendly = [];
                    let birthHourEnemies = [];
                    let birthHourSoulmates = [];
                    
                    // Check if this is the personal birthday (11/26/1996)
                    if (parseInt(m) === 11 && parseInt(d) === 26 && parseInt(y) === 1996) {
                        const hour = 3; // 03:40 = hour 3
                        birthHourAnimal = getHourAnimal(hour);
                        const hourSoulmates = soulmateRelationships[birthHourAnimal.animal] || [];
                        const hourFriendly = friendlyRelationships[birthHourAnimal.animal] || [];
                        const hourEnemies = enemyRelationships[birthHourAnimal.animal] || [];
                        
                        birthHourFriendly = getFriendlyHours(birthHourAnimal.animal);
                        birthHourEnemies = getEnemyHours(birthHourAnimal.animal);
                        birthHourSoulmates = hourAnimals.filter(ha => hourSoulmates.includes(ha.animal));
                    }
                    
                    setResults({
                        lifePath,
                        personalYear: personalYear || { current: 0, next: 0, month: 0, day: 0 },
                        chineseZodiac,
                        westernZodiac,
                        friendly: friendlyAnimals,
                        soulmateAnimals: soulmateAnimals.map(ha => ha.animal),
                        enemies: hourAnimals.filter(ha => enemies.includes(ha.animal)),
                        birthHourAnimal,
                        birthHourFriendly,
                        birthHourEnemies,
                        birthHourSoulmates: birthHourSoulmates.map(ha => ha.animal)
                    });
                } else {
                    setResults(null);
                }
            } else {
                setResults(null);
            }
        } catch (error) {
            console.error('Error calculating results:', error);
            setResults(null);
        }
    };

    // Handle personal birthday trigger
    useEffect(() => {
        if (personalBirthdayTrigger && personalBirthdayTrigger > 0) {
            try {
                setMonth('11');
                setDay('26');
                setYear('1996');
                // Use setTimeout to ensure state updates are processed
                setTimeout(() => {
                    calculateResults('11', '26', '1996');
                }, 0);
            } catch (error) {
                console.error('Error loading personal birthday:', error);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personalBirthdayTrigger]);

    const handleMonthChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMonth(value);
        
        if (value.length === 2) {
            const monthNum = parseInt(value);
            if (monthNum >= 1 && monthNum <= 12) {
                document.getElementById('day-input')?.focus();
            }
        }
        
        calculateResults(value, day, year);
    };

    const handleDayChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
        setDay(value);
        
        if (value.length === 2) {
            const dayNum = parseInt(value);
            if (dayNum >= 1 && dayNum <= 31) {
                document.getElementById('year-input')?.focus();
            }
        }
        
        calculateResults(month, value, year);
    };

    const handleYearChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setYear(value);
        
        if (value.length === 4) {
            document.getElementById('year-input')?.blur();
        }
        
        calculateResults(month, day, value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            {/* Date Input - Hide for personal birthday */}
            {!personalBirthdayTrigger || personalBirthdayTrigger === 0 ? (
                <div className="mb-6 sm:mb-8">
                    <label className="block text-lg sm:text-xl font-semibold text-white mb-4 text-center" style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}>
                        Įveskite Gimimo Datą
                    </label>
                    <div className="flex justify-center items-center gap-2 sm:gap-4 max-w-md mx-auto">
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-white/70 mb-2">Mėnuo</label>
                        <input
                            id="month-input"
                            type="text"
                            inputMode="numeric"
                            value={month}
                            onChange={handleMonthChange}
                            placeholder="MM"
                            maxLength={2}
                            className="w-16 sm:w-20 px-3 py-3 rounded-xl bg-purple-500/20 border border-purple-400/40 text-white text-center text-xl sm:text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            style={{
                                boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                            }}
                        />
                    </div>
                    <span className="text-white text-2xl sm:text-3xl mt-6">.</span>
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-white/70 mb-2">Diena</label>
                        <input
                            id="day-input"
                            type="text"
                            inputMode="numeric"
                            value={day}
                            onChange={handleDayChange}
                            placeholder="DD"
                            maxLength={2}
                            className="w-16 sm:w-20 px-3 py-3 rounded-xl bg-purple-500/20 border border-purple-400/40 text-white text-center text-xl sm:text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            style={{
                                boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                            }}
                        />
                    </div>
                    <span className="text-white text-2xl sm:text-3xl mt-6">.</span>
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-white/70 mb-2">Metai</label>
                        <input
                            id="year-input"
                            type="text"
                            inputMode="numeric"
                            value={year}
                            onChange={handleYearChange}
                            placeholder="YYYY"
                            maxLength={4}
                            className="w-20 sm:w-24 px-3 py-3 rounded-xl bg-purple-500/20 border border-purple-400/40 text-white text-center text-xl sm:text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            style={{
                                boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                            }}
                        />
                    </div>
                </div>
                </div>
            ) : null}

            {/* Results */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-400/30 space-y-6">
                        {/* Life Path Number */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                            {/* Left side - Life Path */}
                            <div className="text-center">
                                {(() => {
                                    const lifePathNum = results.lifePath.number;
                                    const isSpecialLifePath = masterNumbers.includes(lifePathNum) || lifePathNum === 20 || lifePathNum === 28 || lifePathNum === 29;
                                    return (
                                        <>
                                            <div className="text-xs sm:text-sm text-white/70 mb-1">Pagrindinis</div>
                                            <div 
                                                className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                    isSpecialLifePath ? 'text-yellow-300' : 'text-white'
                                                }`}
                                                style={isSpecialLifePath ? {
                                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                } : {
                                                    textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                }}
                                            >
                                                {lifePathNum}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Right side - Day */}
                            <div className="text-center">
                                {(() => {
                                    const dayNum = parseInt(day);
                                    const isSpecialDay = masterNumbers.includes(dayNum) || dayNum === 20 || dayNum === 28 || dayNum === 29;
                                    
                                    return (
                                        <>
                                            <div className="text-xs sm:text-sm text-white/70 mb-1">Diena</div>
                                            <div 
                                                className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                    isSpecialDay ? 'text-yellow-300' : 'text-white'
                                                }`}
                                                style={isSpecialDay ? {
                                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                } : {
                                                    textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                }}
                                            >
                                                {dayNum}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Personal Year */}
                        {results.personalYear && (
                        <div className="border-t border-purple-400/20 pt-4">
                            <div className="grid grid-cols-2 gap-4 items-center">
                                {/* Current Personal Year */}
                                <div className="text-center">
                                    {(() => {
                                        const currentPY = results.personalYear?.current || 0;
                                        const isSpecialPY = masterNumbers.includes(currentPY) || currentPY === 20 || currentPY === 28 || currentPY === 29;
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1">Asmeniniai Metai</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                        isSpecialPY ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialPY ? {
                                                        textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {currentPY}
                                                </div>
                                                <div className="text-xs text-white/60 mt-1">
                                                    {new Date().getFullYear()}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Next Personal Year */}
                                <div className="text-center">
                                    {(() => {
                                        const nextPY = results.personalYear.next;
                                        const isSpecialPY = masterNumbers.includes(nextPY) || nextPY === 20 || nextPY === 28 || nextPY === 29;
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1">Asmeniniai Metai</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                        isSpecialPY ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialPY ? {
                                                        textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {nextPY}
                                                </div>
                                                <div className="text-xs text-white/60 mt-1">
                                                    {new Date().getFullYear() + 1}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Personal Month */}
                        {results.personalYear && results.personalYear.month && (
                            <div className="border-t border-purple-400/20 pt-4">
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    {/* Current Personal Month */}
                                    <div className="text-center">
                                        {(() => {
                                            const personalMonth = results.personalYear.month;
                                            const isSpecialMonth = masterNumbers.includes(personalMonth) || personalMonth === 20 || personalMonth === 28 || personalMonth === 29;
                                            const monthNames = ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'];
                                            const currentMonthName = monthNames[results.personalYear.monthNumber - 1];
                                            
                                            return (
                                                <>
                                                    <div className="text-xs sm:text-sm text-white/70 mb-1">Asmeninis Mėnuo</div>
                                                    <div 
                                                        className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                            isSpecialMonth ? 'text-yellow-300' : 'text-white'
                                                        }`}
                                                        style={isSpecialMonth ? {
                                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                        }}
                                                    >
                                                        {personalMonth}
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {currentMonthName}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Next Personal Month */}
                                    <div className="text-center">
                                        {(() => {
                                            const nextPersonalMonth = results.personalYear.nextMonth;
                                            const isSpecialMonth = masterNumbers.includes(nextPersonalMonth) || nextPersonalMonth === 20 || nextPersonalMonth === 28 || nextPersonalMonth === 29;
                                            const monthNames = ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'];
                                            const nextMonthName = monthNames[results.personalYear.nextMonthNumber - 1];
                                            
                                            return (
                                                <>
                                                    <div className="text-xs sm:text-sm text-white/70 mb-1">Asmeninis Mėnuo</div>
                                                    <div 
                                                        className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                            isSpecialMonth ? 'text-yellow-300' : 'text-white'
                                                        }`}
                                                        style={isSpecialMonth ? {
                                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                        }}
                                                    >
                                                        {nextPersonalMonth}
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {nextMonthName}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Personal Day */}
                        {results.personalYear && results.personalYear.day && (
                            <div className="border-t border-purple-400/20 pt-4">
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    {/* Current Personal Day */}
                                    <div className="text-center">
                                        {(() => {
                                            const personalDay = results.personalYear.day;
                                            const isSpecialDay = masterNumbers.includes(personalDay) || personalDay === 20 || personalDay === 28 || personalDay === 29;
                                            
                                            return (
                                                <>
                                                    <div className="text-xs sm:text-sm text-white/70 mb-1">Asmeninė Diena</div>
                                                    <div 
                                                        className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                            isSpecialDay ? 'text-yellow-300' : 'text-white'
                                                        }`}
                                                        style={isSpecialDay ? {
                                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                        }}
                                                    >
                                                        {personalDay}
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {results.personalYear.dayNumber}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Next Personal Day */}
                                    <div className="text-center">
                                        {(() => {
                                            const nextPersonalDay = results.personalYear.nextDay;
                                            const isSpecialDay = masterNumbers.includes(nextPersonalDay) || nextPersonalDay === 20 || nextPersonalDay === 28 || nextPersonalDay === 29;
                                            
                                            return (
                                                <>
                                                    <div className="text-xs sm:text-sm text-white/70 mb-1">Asmeninė Diena</div>
                                                    <div 
                                                        className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                            isSpecialDay ? 'text-yellow-300' : 'text-white'
                                                        }`}
                                                        style={isSpecialDay ? {
                                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                        }}
                                                    >
                                                        {nextPersonalDay}
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {results.personalYear.nextDayNumber}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Zodiac Signs and Relationships */}
                        <div className="border-t border-purple-400/20 pt-4">
                            <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8 flex-wrap">
                                {/* Chinese Zodiac with Friendly on left and Enemies on right */}
                                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                                    {/* Friendly (including soulmates) - LEFT side */}
                                    {results.friendly.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                                            {results.friendly.map((animal, index) => {
                                                const isSoulmate = results.soulmateAnimals.includes(animal.animal);
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                                        className={`text-center p-1.5 sm:p-2 rounded-lg ${
                                                            isSoulmate 
                                                                ? 'bg-gradient-to-br from-pink-500/30 to-pink-600/20 border border-pink-400/60' 
                                                                : 'bg-green-500/20 border border-green-400/30'
                                                        }`}
                                                        style={isSoulmate ? {
                                                            boxShadow: '0 0 8px rgba(236, 72, 153, 0.3)'
                                                        } : {}}
                                                        title={zodiacTranslations[animal.animal]}
                                                    >
                                                        <div className="text-xl sm:text-2xl mb-0.5 relative">
                                                            {zodiacEmojis[animal.animal]}
                                                            {isSoulmate && (
                                                                <span className="absolute -top-0.5 -right-0.5 text-xs">⭐</span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    {/* Chinese Zodiac - CENTER */}
                                    <div className="text-center">
                                        <div className="text-5xl sm:text-6xl md:text-7xl mb-2">
                                            {zodiacEmojis[results.chineseZodiac.zodiac]}
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.6)' }}>
                                            {zodiacTranslations[results.chineseZodiac.zodiac]}
                                        </div>
                                    </div>
                                    
                                    {/* Enemies - RIGHT side */}
                                    {results.enemies.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                                            {results.enemies.map((animal, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                                    className="text-center p-1.5 sm:p-2 rounded-lg bg-red-500/20 border border-red-400/30"
                                                    title={zodiacTranslations[animal.animal]}
                                                >
                                                    <div className="text-xl sm:text-2xl mb-0.5">{zodiacEmojis[animal.animal]}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Western Zodiac */}
                                <div className="text-center flex-shrink-0">
                                    <div className="text-5xl sm:text-6xl md:text-7xl mb-2">
                                        {zodiacSignEmojis[results.westernZodiac.sign]}
                                    </div>
                                    <div className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(34, 211, 238, 0.6)' }}>
                                        {zodiacSignTranslations[results.westernZodiac.sign]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Birth Hour Animal (Personal Birthday Only) */}
                        {results.birthHourAnimal && (
                            <div className="border-t border-purple-400/20 pt-4">
                                <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8 flex-wrap">
                                    {/* Birth Hour Animal with Friendly on left and Enemies on right */}
                                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 mx-auto">
                                        {/* Friendly (including soulmates) - LEFT side */}
                                        {results.birthHourFriendly.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                                                {results.birthHourFriendly.map((animal, index) => {
                                                    const isSoulmate = results.birthHourSoulmates.includes(animal.animal);
                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                                            className={`text-center p-1.5 sm:p-2 rounded-lg ${
                                                                isSoulmate 
                                                                    ? 'bg-gradient-to-br from-pink-500/30 to-pink-600/20 border border-pink-400/60' 
                                                                    : 'bg-green-500/20 border border-green-400/30'
                                                            }`}
                                                            style={isSoulmate ? {
                                                                boxShadow: '0 0 8px rgba(236, 72, 153, 0.3)'
                                                            } : {}}
                                                            title={`${animal.name} (${formatHourRange(animal.start, animal.end)})`}
                                                        >
                                                            <div className="text-xl sm:text-2xl mb-0.5 relative">
                                                                {hourAnimalEmojis[animal.animal]}
                                                                {isSoulmate && (
                                                                    <span className="absolute -top-0.5 -right-0.5 text-xs">⭐</span>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        
                                        {/* Birth Hour Animal - CENTER */}
                                        <div className="text-center">
                                            <div className="text-5xl sm:text-6xl md:text-7xl mb-2">
                                                {hourAnimalEmojis[results.birthHourAnimal.animal]}
                                            </div>
                                            <div className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.6)' }}>
                                                {results.birthHourAnimal.name}
                                            </div>
                                            <div className="text-xs sm:text-sm text-white/70 mt-1">
                                                {String(results.birthHourAnimal.start).padStart(2, '0')}:40
                                            </div>
                                        </div>
                                        
                                        {/* Enemies - RIGHT side */}
                                        {results.birthHourEnemies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                                                {results.birthHourEnemies.map((animal, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                                        className="text-center p-1.5 sm:p-2 rounded-lg bg-red-500/20 border border-red-400/30"
                                                        title={`${animal.name} (${formatHourRange(animal.start, animal.end)})`}
                                                    >
                                                        <div className="text-xl sm:text-2xl mb-0.5">{hourAnimalEmojis[animal.animal]}</div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

