import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateLifePath, numberDescriptions, reduceNumber, masterNumbers } from '../utils/numerology';
import { convertToChineseLunar } from '../utils/chineseLunarCalendar';

export default function HiddenNumerology() {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculateResults = async (m, d, y) => {
        if (m && d && y) {
            setLoading(true);
            // Format date as YYYY-MM-DD
            const monthStr = String(m).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const gregorianDate = `${y}-${monthStr}-${dayStr}`;
            
            // Validate date
            const dateObj = new Date(y, m - 1, d);
            if (dateObj.getFullYear() == y && dateObj.getMonth() == m - 1 && dateObj.getDate() == d) {
                // Convert to Chinese lunar calendar
                const chineseLunar = convertToChineseLunar(gregorianDate);
                
                if (chineseLunar) {
                    // Calculate life path using Chinese lunar date
                    const lifePath = calculateLifePath(chineseLunar.formatted);
                    
                    setResults({
                        gregorianDate,
                        chineseLunar,
                        lifePath
                    });
                } else {
                    setResults(null);
                }
            } else {
                setResults(null);
            }
            setLoading(false);
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
            className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
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
                    {/* Date Conversion Info */}
                    <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-400/30">
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-lg sm:text-xl font-bold text-yellow-300 mb-2" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.6)' }}>
                                    {results.chineseLunar.month}-{results.chineseLunar.day}-{results.chineseLunar.yearNumber}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Life Path Calculation */}
                    <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-400/30">
                        <div className="grid grid-cols-2 gap-4 items-center">
                            {/* Life Path Number */}
                            <div className="text-center">
                                {(() => {
                                    const lifePathNum = results.lifePath.number;
                                    const isSpecialLifePath = masterNumbers.includes(lifePathNum) || lifePathNum === 20 || lifePathNum === 28 || lifePathNum === 29;
                                    const description = numberDescriptions[lifePathNum]?.lifePath || '';
                                    return (
                                        <>
                                            <div className="text-sm text-white/70 mb-2">Gyvenimo Kelio Skaičius</div>
                                            <div 
                                                className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-2 ${
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
                                            {description && (
                                                <p className="text-white/90 text-xs sm:text-sm">
                                                    {description}
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Calculation Steps */}
                            <div className="text-center">
                                <div className="text-sm text-white/70 mb-2">Skaičiavimas</div>
                                {results.lifePath.steps && results.lifePath.steps.length > 0 && (
                                    <div className="p-3 rounded-lg bg-purple-500/10">
                                        <p className="text-purple-200 text-xs sm:text-sm text-left">
                                            {results.lifePath.steps[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

