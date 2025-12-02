import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateLifePath, numberDescriptions } from '../utils/numerology';
import { getChineseZodiac, zodiacTranslations, zodiacEmojis } from '../utils/chineseZodiac';
import { getWesternZodiac, zodiacSignTranslations, zodiacSignEmojis } from '../utils/westernZodiac';
import { soulmateRelationships, friendlyRelationships, enemyRelationships, hourAnimals } from '../utils/hourAnimals';

export default function BirthdayCalculator() {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [results, setResults] = useState(null);

    const calculateResults = (m, d, y) => {
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
                
                // Get relationships based on Chinese zodiac
                const soulmates = soulmateRelationships[chineseZodiac.zodiac] || [];
                const friendly = friendlyRelationships[chineseZodiac.zodiac] || [];
                const enemies = enemyRelationships[chineseZodiac.zodiac] || [];
                
                // Combine soulmates with friendly, but mark soulmates
                const allFriendly = [...friendly, ...soulmates];
                const friendlyAnimals = hourAnimals.filter(ha => allFriendly.includes(ha.animal));
                const soulmateAnimals = hourAnimals.filter(ha => soulmates.includes(ha.animal));
                
                setResults({
                    lifePath,
                    chineseZodiac,
                    westernZodiac,
                    friendly: friendlyAnimals,
                    soulmateAnimals: soulmateAnimals.map(ha => ha.animal),
                    enemies: hourAnimals.filter(ha => enemies.includes(ha.animal))
                });
            } else {
                setResults(null);
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-white" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}>
                Gimtadienis
            </h2>

            {/* Date Input */}
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

            {/* Results */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Life Path Number */}
                    <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-400/30">
                        <div className="text-center mb-4">
                            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.8)' }}>
                                {results.lifePath.number}
                            </div>
                            <p className="text-white/90 text-sm sm:text-base md:text-lg">
                                {numberDescriptions[results.lifePath.number]?.lifePath || ''}
                            </p>
                        </div>
                        {results.lifePath.steps && results.lifePath.steps.length > 0 && (
                            <div className="mt-4 p-3 rounded-lg bg-purple-500/10">
                                <p className="text-purple-200 text-sm sm:text-base text-center">
                                    {results.lifePath.steps[0]}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Zodiac Signs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Chinese Zodiac */}
                        <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-yellow-400/30">
                            <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.6)' }}>
                                Kinų Zodiakas
                            </h3>
                            <div className="text-center">
                                <div className="text-6xl sm:text-7xl mb-2">
                                    {zodiacEmojis[results.chineseZodiac.zodiac]}
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.6)' }}>
                                    {zodiacTranslations[results.chineseZodiac.zodiac]}
                                </div>
                            </div>
                        </div>

                        {/* Western Zodiac */}
                        <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-cyan-400/30">
                            <h3 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.6)' }}>
                                Vakarų Zodiakas
                            </h3>
                            <div className="text-center">
                                <div className="text-6xl sm:text-7xl mb-2">
                                    {zodiacSignEmojis[results.westernZodiac.sign]}
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px rgba(34, 211, 238, 0.6)' }}>
                                    {zodiacSignTranslations[results.westernZodiac.sign]}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Relationships */}
                    <div className="space-y-4">
                        {/* Friendly (including soulmates) */}
                        {results.friendly.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-green-400/30"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 100%)',
                                    boxShadow: '0 4px 16px 0 rgba(34, 197, 94, 0.2)'
                                }}
                            >
                                <h4 className="text-lg sm:text-xl font-bold text-green-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
                                    Draugiški Zodiakai
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {results.friendly.map((animal, index) => {
                                        const isSoulmate = results.soulmateAnimals.includes(animal.animal);
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                                className={`text-center p-3 rounded-lg ${
                                                    isSoulmate 
                                                        ? 'bg-gradient-to-br from-pink-500/30 to-pink-600/20 border-2 border-pink-400/60' 
                                                        : 'bg-green-500/20'
                                                }`}
                                                style={isSoulmate ? {
                                                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)'
                                                } : {}}
                                            >
                                                <div className="text-3xl mb-1 relative">
                                                    {zodiacEmojis[animal.animal]}
                                                    {isSoulmate && (
                                                        <span className="absolute -top-1 -right-1 text-lg">⭐</span>
                                                    )}
                                                </div>
                                                <div className={`font-medium text-sm ${
                                                    isSoulmate ? 'text-pink-200' : 'text-white'
                                                }`}>
                                                    {zodiacTranslations[animal.animal]}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Enemies */}
                        {results.enemies.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-red-400/30"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
                                    boxShadow: '0 4px 16px 0 rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                <h4 className="text-lg sm:text-xl font-bold text-red-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                                    Priešiški Zodiakai
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {results.enemies.map((animal, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                            className="text-center p-3 rounded-lg bg-red-500/20"
                                        >
                                            <div className="text-3xl mb-1">{zodiacEmojis[animal.animal]}</div>
                                            <div className="text-white font-medium text-sm">{zodiacTranslations[animal.animal]}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

