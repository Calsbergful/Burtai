import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateLifePath, numberDescriptions } from '../utils/numerology';
import { getChineseZodiac, zodiacTranslations, zodiacEmojis } from '../utils/chineseZodiac';
import { soulmateRelationships, friendlyRelationships, enemyRelationships, hourAnimals } from '../utils/hourAnimals';

export default function BirthdayCalculator() {
    const [birthdate, setBirthdate] = useState('');
    const [results, setResults] = useState(null);

    const handleDateChange = (e) => {
        const date = e.target.value;
        setBirthdate(date);
        
        if (date) {
            const lifePath = calculateLifePath(date);
            const chineseZodiac = getChineseZodiac(date);
            
            // Get relationships based on Chinese zodiac
            const soulmates = soulmateRelationships[chineseZodiac.zodiac] || [];
            const friendly = friendlyRelationships[chineseZodiac.zodiac] || [];
            const enemies = enemyRelationships[chineseZodiac.zodiac] || [];
            
            setResults({
                lifePath,
                chineseZodiac,
                soulmates: hourAnimals.filter(ha => soulmates.includes(ha.animal)),
                friendly: hourAnimals.filter(ha => friendly.includes(ha.animal)),
                enemies: hourAnimals.filter(ha => enemies.includes(ha.animal))
            });
        } else {
            setResults(null);
        }
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
                    Pasirinkite Gimimo Datą
                </label>
                <input
                    type="date"
                    value={birthdate}
                    onChange={handleDateChange}
                    className="w-full max-w-md mx-auto block px-4 py-3 rounded-xl bg-purple-500/20 border border-purple-400/40 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{
                        boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                    }}
                />
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
                        <h3 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.6)' }}>
                            Gyvenimo Kelio Skaičius
                        </h3>
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

                    {/* Relationships */}
                    <div className="space-y-4">
                        {/* Soulmates */}
                        {results.soulmates.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-pink-400/40"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0.2) 100%)',
                                    boxShadow: '0 4px 16px 0 rgba(236, 72, 153, 0.3)'
                                }}
                            >
                                <h4 className="text-lg sm:text-xl font-bold text-pink-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.6)' }}>
                                    Sielos Draugai ⭐
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {results.soulmates.map((animal, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                            className="text-center p-3 rounded-lg bg-pink-500/20"
                                        >
                                            <div className="text-3xl mb-1">{zodiacEmojis[animal.animal]}</div>
                                            <div className="text-white font-medium text-sm">{zodiacTranslations[animal.animal]}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Friendly */}
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
                                    {results.friendly.map((animal, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                            className="text-center p-3 rounded-lg bg-green-500/20"
                                        >
                                            <div className="text-3xl mb-1">{zodiacEmojis[animal.animal]}</div>
                                            <div className="text-white font-medium text-sm">{zodiacTranslations[animal.animal]}</div>
                                        </motion.div>
                                    ))}
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

