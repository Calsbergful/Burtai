import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateLifePath, reduceNumber, masterNumbers, calculatePersonalYear } from '../utils/numerology';
import { convertDate } from '../utils/dateConverter';

export default function HiddenNumerology() {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculateResults = async (m, d, y) => {
        if (m && d && y) {
            try {
                setLoading(true);
                // Format date as YYYY-MM-DD
                const monthStr = String(m).padStart(2, '0');
                const dayStr = String(d).padStart(2, '0');
                const gregorianDate = `${y}-${monthStr}-${dayStr}`;
                
                // Validate date - convert to numbers first
                const monthNum = parseInt(m, 10);
                const dayNum = parseInt(d, 10);
                const yearNum = parseInt(y, 10);
                
                if (isNaN(monthNum) || isNaN(dayNum) || isNaN(yearNum)) {
                    setResults(null);
                    setLoading(false);
                    return;
                }
                
                const dateObj = new Date(yearNum, monthNum - 1, dayNum);
                if (dateObj.getFullYear() === yearNum && dateObj.getMonth() === monthNum - 1 && dateObj.getDate() === dayNum) {
                    // Transform date
                    const convertedDate = convertDate(gregorianDate);
                    
                    if (convertedDate) {
                        // Special case for November 26, 1996
                        const isSpecialDate = yearNum === 1996 && monthNum === 11 && dayNum === 26;
                        
                        let lifePath;
                        if (isSpecialDate) {
                            // Force life path to 22 for this specific date
                            lifePath = {
                                number: 22,
                                steps: []
                            };
                        } else {
                            // Format converted date as YYYY-MM-DD for calculation
                            const convertedDateStr = `${convertedDate.yearNumber}-${String(convertedDate.month).padStart(2, '0')}-${String(convertedDate.day).padStart(2, '0')}`;
                            // Calculate life path using converted date
                            lifePath = calculateLifePath(convertedDateStr);
                        }
                        
                        // Calculate personal year, month, day, and hour using converted date (not Gregorian)
                        let personalYear;
                        try {
                            // Use converted date for personal calculations
                            const convertedMonth = convertedDate.month;
                            const convertedDay = convertedDate.day;
                            const convertedYear = convertedDate.yearNumber;
                            personalYear = calculatePersonalYear(convertedMonth, convertedDay, convertedYear);
                        } catch (error) {
                            console.error('Error calculating personal year:', error);
                            personalYear = null;
                        }
                        
                        setResults({
                            gregorianDate,
                            convertedDate,
                            lifePath,
                            isSpecialDate,
                            personalYear
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
            } finally {
                setLoading(false);
            }
        } else {
            setResults(null);
        }
    };

    const handleMonthChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMonth(value);
        
        if (value.length === 2) {
            const monthNum = parseInt(value);
            if (monthNum >= 1 && monthNum <= 12) {
                document.getElementById('day-input-hidden')?.focus();
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
                document.getElementById('year-input-hidden')?.focus();
            }
        }
        
        calculateResults(month, value, year);
    };

    const handleYearChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setYear(value);
        
        if (value.length === 4) {
            document.getElementById('year-input-hidden')?.blur();
        }
        
        calculateResults(month, day, value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl lg:max-w-[88%] xl:max-w-[92%] 2xl:max-w-[96%] mx-auto backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-white" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}>
                Hmmm..
            </h2>

            {/* Date Input */}
            <div className="mb-6 sm:mb-8">
                <div className="flex justify-center items-center gap-2 sm:gap-4 max-w-md mx-auto">
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-white/70 mb-2">Mėnuo</label>
                        <input
                            id="month-input-hidden"
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
                            id="day-input-hidden"
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
                            id="year-input-hidden"
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

            {/* Loading */}
            {loading && (
                <div className="text-center text-white/70 mb-4">
                    Skaičiuojama...
                </div>
            )}

            {/* Results */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Combined Results and Calculation */}
                    <div className="backdrop-blur-lg rounded-xl p-2 sm:p-3 md:p-4 border border-purple-400/30 space-y-2 sm:space-y-2.5 md:space-y-3">
                        {/* Life Path Calculation */}
                        <div>
                            <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-8 items-center">
                                {/* Life Path Number */}
                                <div className="text-center">
                                    {(() => {
                                        const lifePathNum = results.lifePath.number;
                                        const lifePathTotal = results.lifePath.total;
                                        const isSpecialTotal = masterNumbers.includes(lifePathTotal) || lifePathTotal === 20 || lifePathTotal === 28 || lifePathTotal === 29;
                                        const isSpecialLifePath = masterNumbers.includes(lifePathNum) || lifePathNum === 20 || lifePathNum === 28 || lifePathNum === 29;
                                        
                                        // For special date, show 22/33
                                        const displayValue = results.isSpecialDate ? '22/33' : lifePathNum;
                                        
                                        return (
                                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                                {!results.isSpecialDate && lifePathTotal !== lifePathNum && (
                                                    <>
                                                        <div 
                                                            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                        <span className="text-2xl sm:text-3xl md:text-4xl text-white/60">→</span>
                                                    </>
                                                )}
                                                <div 
                                                    className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                                                        isSpecialLifePath || results.isSpecialDate ? 'text-yellow-300' : 'text-white'
                                                    }`}
                                                    style={(isSpecialLifePath || results.isSpecialDate) ? {
                                                        textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                    } : {
                                                        textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                    }}
                                                >
                                                    {displayValue}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Day Number */}
                                <div className="text-center">
                                    {(() => {
                                        const dayNum = results.convertedDate.day;
                                        const isSpecialDay = masterNumbers.includes(dayNum) || dayNum === 20 || dayNum === 28 || dayNum === 29;
                                        return (
                                            <div 
                                                className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
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
                        </div>

                        {/* Personal Stats - Combined compact layout */}
                        {results.personalYear && (
                        <div className="border-t border-purple-400/20 pt-2 md:pt-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 items-center">
                                {/* Current Personal Year */}
                                <div className="text-center">
                                    {(() => {
                                        const currentPY = results.personalYear?.current || 0;
                                        const isSpecialPY = masterNumbers.includes(currentPY) || currentPY === 20 || currentPY === 28 || currentPY === 29;
                                        return (
                                            <>
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Metai</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
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
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Metai</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
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
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Mėnuo</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
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
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Mėnuo</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
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
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Diena</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
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
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Diena</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
                                                    {results.personalYear.nextDayNumber}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Current Personal Hour */}
                                {results.personalYear.hour !== undefined && (
                                <div className="text-center">
                                    {(() => {
                                        const personalHour = results.personalYear.hour;
                                        const isSpecialHour = masterNumbers.includes(personalHour) || personalHour === 20 || personalHour === 28 || personalHour === 29;
                                        
                                        return (
                                            <>
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Valanda</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
                                                    {results.personalYear.hourNumber === 24 ? '24:00 (00:00)' : String(results.personalYear.hourNumber).padStart(2, '0') + ':00'}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                )}

                                {/* Next Personal Hour */}
                                {results.personalYear.nextHour !== undefined && (
                                <div className="text-center">
                                    {(() => {
                                        const nextPersonalHour = results.personalYear.nextHour;
                                        const isSpecialHour = masterNumbers.includes(nextPersonalHour) || nextPersonalHour === 20 || nextPersonalHour === 28 || nextPersonalHour === 29;
                                        
                                        return (
                                            <>
                                                <div className="text-[9px] sm:text-[10px] text-white/70 mb-0.5">Valanda</div>
                                                <div 
                                                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
                                                <div className="text-[9px] text-white/60 mt-0.5">
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
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

