import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateLifePath, reduceNumber, masterNumbers, calculatePersonalYear, reducePersonalYear } from '../utils/numerology';
import { getChineseZodiac, zodiacTranslations, zodiacEmojis } from '../utils/chineseZodiac';
import { getWesternZodiac, zodiacSignTranslations, zodiacSignEmojis } from '../utils/westernZodiac';
import { soulmateRelationships, friendlyRelationships, enemyRelationships, hourAnimals, getHourAnimal, getFriendlyHours, getEnemyHours, hourAnimalEmojis, formatHourRange } from '../utils/hourAnimals';

function BirthdayCalculator({ personalBirthdayTrigger = 0 }) {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [results, setResults] = useState(null);

    const calculateResults = useCallback((m, d, y, h = null, min = null) => {
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
                    
                    // Calculate personal year (always uses current device time)
                    let personalYear;
                    try {
                        personalYear = calculatePersonalYear(parseInt(m), parseInt(d), parseInt(y));
                        
                        // Personal hour is always calculated from current device time, not input hour
                        // The input hour is only used for birth hour animal display
                        const now = new Date();
                        const currentHour24 = now.getHours(); // 0-23 from JavaScript
                        // Convert to 1-24 format for numerology (0 becomes 24, 1-23 stay as 1-23)
                        const currentHour = currentHour24 === 0 ? 24 : currentHour24;
                        const personalDayNum = personalYear.day;
                        const personalHourSum = personalDayNum + currentHour;
                        const personalHourNum = reducePersonalYear(personalHourSum);
                        
                        // Calculate next personal hour (using 1-24 format)
                        let nextHourNum, nextHourNum24, nextPersonalHourSum, nextPersonalHourNum;
                        if (currentHour === 24) {
                            // Current is midnight (24), next is 1:00 (1)
                            nextHourNum = 1;
                            nextHourNum24 = 1;
                            nextPersonalHourSum = personalDayNum + nextHourNum;
                            nextPersonalHourNum = reducePersonalYear(nextPersonalHourSum);
                        } else if (currentHour === 23) {
                            // Current is 23:00, next is midnight (24)
                            nextHourNum = 24;
                            nextHourNum24 = 0; // For display purposes
                            nextPersonalHourSum = personalYear.nextDay + nextHourNum;
                            nextPersonalHourNum = reducePersonalYear(nextPersonalHourSum);
                        } else {
                            nextHourNum = currentHour + 1;
                            nextHourNum24 = nextHourNum === 24 ? 0 : nextHourNum;
                            nextPersonalHourSum = personalDayNum + nextHourNum;
                            nextPersonalHourNum = reducePersonalYear(nextPersonalHourSum);
                        }
                        
                        personalYear.hour = personalHourNum;
                        personalYear.hourNumber = currentHour; // 1-24 format
                        personalYear.nextHour = nextPersonalHourNum;
                        personalYear.nextHourNumber = nextHourNum; // 1-24 format
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
                    
                    // Calculate hour animal if hour is provided
                    let birthHourAnimal = null;
                    let birthHourFriendly = [];
                    let birthHourEnemies = [];
                    let birthHourSoulmates = [];
                    
                    // Check if hour is provided (either from input or personal birthday)
                    let hourToUse = null;
                    if (h !== null && h !== '') {
                        hourToUse = parseInt(h, 10);
                    } else if (parseInt(m) === 11 && parseInt(d) === 26 && parseInt(y) === 1996) {
                        // Personal birthday default hour
                        hourToUse = 3; // 03:40 = hour 3
                    }
                    
                    if (hourToUse !== null && !isNaN(hourToUse) && hourToUse >= 0 && hourToUse <= 23) {
                        birthHourAnimal = getHourAnimal(hourToUse);
                        const hourSoulmates = soulmateRelationships[birthHourAnimal.animal] || [];
                        
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
                        birthHourSoulmates: birthHourSoulmates.map(ha => ha.animal),
                        inputHour: h !== null && h !== '' ? parseInt(h, 10) : (parseInt(m) === 11 && parseInt(d) === 26 && parseInt(y) === 1996 ? 3 : null),
                        inputMinute: min !== null && min !== '' ? parseInt(min, 10) : (parseInt(m) === 11 && parseInt(d) === 26 && parseInt(y) === 1996 ? 40 : null)
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
    }, []);

    // Handle personal birthday trigger
    useEffect(() => {
        if (personalBirthdayTrigger && personalBirthdayTrigger > 0) {
            try {
                setMonth('11');
                setDay('26');
                setYear('1996');
                setHour('03');
                setMinute('40');
                // Use setTimeout to ensure state updates are processed
                setTimeout(() => {
                    calculateResults('11', '26', '1996', '03', '40');
                }, 0);
            } catch (error) {
                console.error('Error loading personal birthday:', error);
            }
        } else if (personalBirthdayTrigger === 0) {
            // Clear all fields when switching to regular birthday mode
            setMonth('');
            setDay('');
            setYear('');
            setHour('');
            setMinute('');
            setResults(null);
        }
    }, [personalBirthdayTrigger, calculateResults]);

    // Auto-refresh personal stats every minute to keep them up-to-date
    useEffect(() => {
        // Only set up auto-refresh if we have results and a valid date
        if (!results || !month || !day || !year) {
            return;
        }

        // Calculate time until next minute to align with minute boundaries
        const now = new Date();
        const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
        
        // Set initial timeout to align with next minute
        const initialTimeout = setTimeout(() => {
            // Recalculate immediately
            calculateResults(month, day, year, hour || null, minute || null);
            
            // Then set up interval to refresh every minute
            const interval = setInterval(() => {
                calculateResults(month, day, year, hour || null, minute || null);
            }, 60000); // 60 seconds = 1 minute
            
            // Cleanup function
            return () => clearInterval(interval);
        }, msUntilNextMinute);

        // Cleanup function for initial timeout
        return () => clearTimeout(initialTimeout);
    }, [month, day, year, hour, minute, results]);

    const handleMonthChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMonth(value);
        
        if (value.length === 2) {
            const monthNum = parseInt(value);
            if (monthNum >= 1 && monthNum <= 12) {
                document.getElementById('day-input')?.focus();
            }
        }
        
        calculateResults(value, day, year, hour, minute);
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
        
        calculateResults(month, value, year, hour, minute);
    };

    const handleYearChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setYear(value);
        
        if (value.length === 4) {
            document.getElementById('hour-input')?.focus();
        }
        
        calculateResults(month, day, value, hour, minute);
    };

    const handleHourChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
        setHour(value);
        
        if (value.length === 2) {
            const hourNum = parseInt(value);
            if (hourNum >= 0 && hourNum <= 23) {
                document.getElementById('minute-input')?.focus();
            }
        }
        
        calculateResults(month, day, year, value);
    };

    const handleMinuteChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMinute(value);
        
        if (value.length === 2) {
            document.getElementById('minute-input')?.blur();
        }
        
        calculateResults(month, day, year, hour);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl lg:max-w-6xl xl:max-w-6xl 2xl:max-w-6xl mx-auto backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-4.5 lg:p-5 xl:p-4.5 2xl:p-4 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            {/* Date Input - Hide for personal birthday */}
            {!personalBirthdayTrigger || personalBirthdayTrigger === 0 ? (
                <div className="mb-6 sm:mb-8">
                    <label className="block text-lg sm:text-xl font-semibold text-white mb-4 text-center" style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}>
                        Datos Analizė
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
                
                {/* Hour Input - Optional */}
                <div className="mb-4 sm:mb-6 mt-6 sm:mt-8">
                    <div className="flex justify-center items-center gap-2 sm:gap-3 max-w-xs mx-auto">
                        <div className="flex flex-col items-center">
                            <label className="text-xs text-white/60 mb-1.5">Valanda</label>
                            <input
                                id="hour-input"
                                type="text"
                                inputMode="numeric"
                                value={hour}
                                onChange={handleHourChange}
                                placeholder="HH"
                                maxLength={2}
                                className="w-14 sm:w-16 px-2 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-white text-center text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                style={{
                                    boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                                }}
                            />
                        </div>
                        <span className="text-white text-xl sm:text-2xl mt-5">:</span>
                        <div className="flex flex-col items-center">
                            <label className="text-xs text-white/60 mb-1.5">Minutė</label>
                            <input
                                id="minute-input"
                                type="text"
                                inputMode="numeric"
                                value={minute}
                                onChange={handleMinuteChange}
                                placeholder="MM"
                                maxLength={2}
                                className="w-14 sm:w-16 px-2 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-white text-center text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                style={{
                                    boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                                }}
                            />
                        </div>
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
                    <div className="backdrop-blur-lg rounded-xl p-2 sm:p-2.5 md:p-3 border border-purple-400/30 space-y-2 sm:space-y-2 md:space-y-2.5">
                        {/* Life Path Number and Day - Only show for regular birthday (not personal) */}
                        {(!personalBirthdayTrigger || personalBirthdayTrigger === 0) && (
                        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-8 items-center">
                            {/* Left side - Life Path */}
                            <div className="text-center">
                                {(() => {
                                    const lifePathNum = results.lifePath.number;
                                    const lifePathTotal = results.lifePath.total;
                                    const isSpecialTotal = masterNumbers.includes(lifePathTotal) || lifePathTotal === 20 || lifePathTotal === 28 || lifePathTotal === 29;
                                    const isSpecialLifePath = masterNumbers.includes(lifePathNum) || lifePathNum === 20 || lifePathNum === 28 || lifePathNum === 29;
                                    return (
                                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                                            {lifePathTotal !== lifePathNum && (
                                                <>
                                                    <div 
                                                        className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                                                            isSpecialTotal ? 'text-yellow-300' : 'text-white/80'
                                                        }`}
                                                        style={isSpecialTotal ? {
                                                            textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 15px rgba(138, 43, 226, 0.6)'
                                                        }}
                                                    >
                                                        {lifePathTotal}
                                                    </div>
                                                    <span className="text-3xl sm:text-4xl md:text-5xl text-white/60">→</span>
                                                </>
                                            )}
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
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Right side - Day */}
                            <div className="text-center">
                                {(() => {
                                    const dayNum = parseInt(day);
                                    const isSpecialDay = masterNumbers.includes(dayNum) || dayNum === 20 || dayNum === 28 || dayNum === 29;
                                    
                                    return (
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
                                    );
                                })()}
                            </div>
                        </div>
                        )}

                        {/* Personal Stats - Balanced grid layout */}
                        {results.personalYear && (
                        <div>
                            <div className="grid grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 lg:gap-4.5 xl:gap-4 2xl:gap-3.5 items-center">
                                {/* Current Personal Year */}
                                <div className="text-center">
                                    {(() => {
                                        const currentPY = results.personalYear?.current || 0;
                                        const isSpecialPY = masterNumbers.includes(currentPY) || currentPY === 20 || currentPY === 28 || currentPY === 29;
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Metai</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialPY ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialPY ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {currentPY}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
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
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Metai</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialPY ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialPY ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {nextPY}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {new Date().getFullYear() + 1}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Current Personal Month */}
                                {results.personalYear.month && (
                                <div className="text-center">
                                    {(() => {
                                        const personalMonth = results.personalYear.month;
                                        const isSpecialMonth = masterNumbers.includes(personalMonth) || personalMonth === 20 || personalMonth === 28 || personalMonth === 29;
                                        const monthNames = ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rug', 'Rgs', 'Spa', 'Lap', 'Gru'];
                                        const currentMonthName = monthNames[results.personalYear.monthNumber - 1];
                                        
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Mėnuo</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialMonth ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialMonth ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {personalMonth}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {currentMonthName}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Next Personal Month */}
                                {results.personalYear.nextMonth && (
                                <div className="text-center">
                                    {(() => {
                                        const nextPersonalMonth = results.personalYear.nextMonth;
                                        const isSpecialMonth = masterNumbers.includes(nextPersonalMonth) || nextPersonalMonth === 20 || nextPersonalMonth === 28 || nextPersonalMonth === 29;
                                        const monthNames = ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rug', 'Rgs', 'Spa', 'Lap', 'Gru'];
                                        const nextMonthName = monthNames[results.personalYear.nextMonthNumber - 1];
                                        
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Mėnuo</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialMonth ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialMonth ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {nextPersonalMonth}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {nextMonthName}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Current Personal Day */}
                                {results.personalYear.day && (
                                <div className="text-center">
                                    {(() => {
                                        const personalDay = results.personalYear.day;
                                        const isSpecialDay = masterNumbers.includes(personalDay) || personalDay === 20 || personalDay === 28 || personalDay === 29;
                                        
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Diena</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialDay ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialDay ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {personalDay}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {results.personalYear.dayNumber}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Next Personal Day */}
                                {results.personalYear.nextDay && (
                                <div className="text-center">
                                    {(() => {
                                        const nextPersonalDay = results.personalYear.nextDay;
                                        const isSpecialDay = masterNumbers.includes(nextPersonalDay) || nextPersonalDay === 20 || nextPersonalDay === 28 || nextPersonalDay === 29;
                                        
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Diena</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialDay ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialDay ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {nextPersonalDay}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {results.personalYear.nextDayNumber}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Current Personal Hour */}
                                {((personalBirthdayTrigger > 0) || (hour && hour !== '')) && results.personalYear && results.personalYear.hour !== undefined && (
                                <div className="text-center">
                                    {(() => {
                                        const personalHour = results.personalYear.hour;
                                        const isSpecialHour = masterNumbers.includes(personalHour) || personalHour === 20 || personalHour === 28 || personalHour === 29;
                                        
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Valanda</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialHour ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialHour ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {personalHour}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {results.personalYear.hourNumber === 24 ? '24:00 (00:00)' : String(results.personalYear.hourNumber).padStart(2, '0') + ':00'}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Next Personal Hour */}
                                {((personalBirthdayTrigger > 0) || (hour && hour !== '')) && results.personalYear && results.personalYear.nextHour !== undefined && (
                                <div className="text-center">
                                    {(() => {
                                        const nextPersonalHour = results.personalYear.nextHour;
                                        const isSpecialHour = masterNumbers.includes(nextPersonalHour) || nextPersonalHour === 20 || nextPersonalHour === 28 || nextPersonalHour === 29;
                                        
                                        return (
                                            <>
                                                <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-1.5 xl:mb-1 2xl:mb-0.5">Valanda</div>
                                                <div 
                                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl font-bold ${
                                                        isSpecialHour ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={isSpecialHour ? {
                                                        textShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 25px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 15px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {nextPersonalHour}
                                                </div>
                                                <div className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-1.5 xl:mt-1 2xl:mt-0.5">
                                                    {String(results.personalYear.nextHourNumber).padStart(2, '0')}:00
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* Zodiac Signs and Relationships - Horizontal Layout */}
                        <div className="border-t border-purple-400/20 pt-1.5 sm:pt-2 md:pt-2.5 xl:pt-2 2xl:pt-1.5">
                            {/* Chinese Zodiac Row */}
                            <div className="flex items-center justify-center gap-3 sm:gap-3.5 md:gap-4 lg:gap-4.5 xl:gap-4 2xl:gap-3.5">
                                {/* Friendly (including soulmates) - LEFT side */}
                                {results.friendly.length > 0 && (
                                    <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center justify-end">
                                        {results.friendly.map((animal, index) => {
                                            const isSoulmate = results.soulmateAnimals.includes(animal.animal);
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                                    className={`text-center p-1 sm:p-1.5 rounded-lg ${
                                                        isSoulmate 
                                                            ? 'bg-gradient-to-br from-pink-500/30 to-pink-600/20 border border-pink-400/60' 
                                                            : 'bg-green-500/20 border border-green-400/30'
                                                    }`}
                                                    style={isSoulmate ? {
                                                        boxShadow: '0 0 8px rgba(236, 72, 153, 0.3)'
                                                    } : {}}
                                                    title={zodiacTranslations[animal.animal]}
                                                >
                                                    <div className="text-lg sm:text-xl md:text-2xl mb-0.5 relative">
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
                                    <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-7xl 2xl:text-6xl mb-1.5 sm:mb-2 xl:mb-1.5 2xl:mb-1">
                                        {zodiacEmojis[results.chineseZodiac.zodiac]}
                                    </div>
                                    <div className="text-lg sm:text-xl md:text-2xl xl:text-xl 2xl:text-lg font-bold text-white" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.6)' }}>
                                        {zodiacTranslations[results.chineseZodiac.zodiac]}
                                    </div>
                                    {(parseInt(month) === 1 || parseInt(month) === 2) && results.chineseZodiac.startDate && (
                                        <div className="text-[9px] sm:text-[10px] text-yellow-300/80 mt-1 italic">
                                            Kinų N.M. {results.chineseZodiac.startDate.split('-')[0]}: {results.chineseZodiac.startDate.split('-')[2]}.{results.chineseZodiac.startDate.split('-')[1]}.
                                        </div>
                                    )}
                                </div>
                                
                                {/* Enemies and Western Zodiac - RIGHT side */}
                                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                                    {results.enemies.length > 0 && (
                                        <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center justify-start">
                                            {results.enemies.map((animal, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                                    className="text-center p-1.5 sm:p-2 rounded-lg bg-red-500/20 border border-red-400/30"
                                                    title={zodiacTranslations[animal.animal]}
                                                >
                                                    <div className="text-lg sm:text-xl md:text-2xl mb-0.5">{zodiacEmojis[animal.animal]}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Western Zodiac - Right of enemies */}
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl 2xl:text-4xl mb-1.5 sm:mb-2 xl:mb-1.5 2xl:mb-1">
                                            {zodiacSignEmojis[results.westernZodiac.sign]}
                                        </div>
                                        <div className="text-sm sm:text-base md:text-lg xl:text-base 2xl:text-sm font-bold text-white" style={{ textShadow: '0 0 15px rgba(34, 211, 238, 0.6)' }}>
                                            {zodiacSignTranslations[results.westernZodiac.sign]}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Birth Hour Animal */}
                        {results.birthHourAnimal && (
                            <div className="border-t border-purple-400/20 pt-1.5 sm:pt-2 md:pt-2.5 xl:pt-2 2xl:pt-1.5">
                                <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
                                    {/* Friendly (including soulmates) - LEFT side */}
                                    {results.birthHourFriendly.length > 0 && (
                                        <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center justify-end">
                                            {results.birthHourFriendly.map((animal, index) => {
                                                const isSoulmate = results.birthHourSoulmates.includes(animal.animal);
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                                        className={`text-center p-1 sm:p-1.5 rounded-lg ${
                                                            isSoulmate 
                                                                ? 'bg-gradient-to-br from-pink-500/30 to-pink-600/20 border border-pink-400/60' 
                                                                : 'bg-green-500/20 border border-green-400/30'
                                                        }`}
                                                        style={isSoulmate ? {
                                                            boxShadow: '0 0 8px rgba(236, 72, 153, 0.3)'
                                                        } : {}}
                                                        title={`${animal.name} (${formatHourRange(animal.start, animal.end)})`}
                                                    >
                                                        <div className="text-lg sm:text-xl md:text-2xl mb-0.5 relative">
                                                            {hourAnimalEmojis[animal.animal]}
                                                            {isSoulmate && (
                                                                <span className="absolute -top-0.5 -right-0.5 text-xs">⭐</span>
                                                            )}
                                                        </div>
                                                        <div className="text-[8px] sm:text-[9px] text-white/60">
                                                            {formatHourRange(animal.start, animal.end)}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    {/* Birth Hour Animal - CENTER */}
                                    <div className="text-center">
                                        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl mb-1.5 sm:mb-2 xl:mb-1.5 2xl:mb-1">
                                            {hourAnimalEmojis[results.birthHourAnimal.animal]}
                                        </div>
                                        <div className="text-[8px] sm:text-[9px] text-white/60">
                                            {formatHourRange(results.birthHourAnimal.start, results.birthHourAnimal.end)}
                                        </div>
                                    </div>
                                    
                                    {/* Enemies - RIGHT side */}
                                    {results.birthHourEnemies.length > 0 && (
                                        <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center justify-start">
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
                                                    <div className="text-[8px] sm:text-[9px] text-white/60">
                                                        {formatHourRange(animal.start, animal.end)}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export default BirthdayCalculator;

