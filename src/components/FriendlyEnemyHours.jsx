import { useState } from 'react';
import { motion } from 'framer-motion';
import { hourAnimals, getFriendlyHours, getEnemyHours, getSoulmateHours, formatHourRange, hourAnimalEmojis } from '../utils/hourAnimals';

export default function FriendlyEnemyHours() {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const soulmateHours = selectedAnimal ? getSoulmateHours(selectedAnimal.animal) : [];
    const friendlyHours = selectedAnimal ? getFriendlyHours(selectedAnimal.animal) : [];
    const enemyHours = selectedAnimal ? getEnemyHours(selectedAnimal.animal) : [];
    
    // Combine soulmates with friendly
    const allFriendlyHours = selectedAnimal 
        ? [...friendlyHours, ...soulmateHours]
        : [];
    const soulmateAnimalNames = soulmateHours.map(ha => ha.animal);

    const handleAnimalSelect = (animal) => {
        setSelectedAnimal(animal);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl mx-auto backdrop-blur-xl bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-white px-2" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}>
                Draugiškos ir Priešiškos Valandos
            </h2>

            {/* Animal Selection */}
            <div className="mb-4 sm:mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                    {hourAnimals.map((animal, index) => {
                        const isSelected = selectedAnimal?.animal === animal.animal;
                        return (
                            <motion.button
                                key={animal.animal}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAnimalSelect(animal)}
                                className={`
                                    rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white transition-all
                                    ${isSelected
                                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg'
                                        : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30'
                                    }
                                `}
                                style={{
                                    boxShadow: isSelected 
                                        ? '0 0 20px rgba(138, 43, 226, 0.6)' 
                                        : 'none'
                                }}
                            >
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{hourAnimalEmojis[animal.animal]}</div>
                                    <div className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1 break-words">{animal.name}</div>
                                    <div className="text-[10px] sm:text-xs text-white/80 leading-tight">{formatHourRange(animal.start, animal.end)}</div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Animal Info */}
            {selectedAnimal && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6 text-center px-2"
                >
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2">
                        {hourAnimalEmojis[selectedAnimal.animal]}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 break-words" style={{ textShadow: '0 0 15px rgba(138, 43, 226, 0.6)' }}>
                        {selectedAnimal.name} - {formatHourRange(selectedAnimal.start, selectedAnimal.end)}
                    </h3>
                </motion.div>
            )}

            {/* Friendly and Enemy Hours */}
            {selectedAnimal && (
            <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Friendly Hours (including soulmates) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-green-400/30"
                    style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 100%)',
                        boxShadow: '0 4px 16px 0 rgba(34, 197, 94, 0.2)'
                    }}
                >
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-green-300 mb-3 sm:mb-4 text-center" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
                        Draugiškos Valandos
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                        {allFriendlyHours.map((hourAnimal, index) => {
                            const hourRange = formatHourRange(hourAnimal.start, hourAnimal.end);
                            const isSoulmate = soulmateAnimalNames.includes(hourAnimal.animal);
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                                        isSoulmate 
                                            ? 'bg-gradient-to-r from-pink-500/25 to-pink-600/15 border-2 border-pink-400/50' 
                                            : 'bg-green-500/20'
                                    }`}
                                    style={isSoulmate ? {
                                        boxShadow: '0 0 10px rgba(236, 72, 153, 0.3)'
                                    } : {}}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-xl sm:text-2xl relative flex-shrink-0">
                                            {hourAnimalEmojis[hourAnimal.animal]}
                                            {isSoulmate && (
                                                <span className="absolute -top-1 -right-1 text-xs">⭐</span>
                                            )}
                                        </span>
                                        <span className={`font-medium text-sm sm:text-base truncate ${
                                            isSoulmate ? 'text-pink-200' : 'text-white'
                                        }`}>
                                            {hourAnimal.name}
                                        </span>
                                    </div>
                                    <span className={`text-xs sm:text-sm flex-shrink-0 ml-2 ${
                                        isSoulmate ? 'text-pink-300' : 'text-green-300'
                                    }`}>
                                        {hourRange}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Enemy Hours */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-red-400/30"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
                        boxShadow: '0 4px 16px 0 rgba(239, 68, 68, 0.2)'
                    }}
                >
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-red-300 mb-3 sm:mb-4 text-center" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                        Priešiškos Valandos
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                        {enemyHours.map((hourAnimal, index) => {
                            const hourRange = formatHourRange(hourAnimal.start, hourAnimal.end);
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-red-500/20"
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-xl sm:text-2xl flex-shrink-0">{hourAnimalEmojis[hourAnimal.animal]}</span>
                                        <span className="text-white font-medium text-sm sm:text-base truncate">{hourAnimal.name}</span>
                                    </div>
                                    <span className="text-red-300 text-xs sm:text-sm flex-shrink-0 ml-2">{hourRange}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
                </div>
            </div>
            )}
        </motion.div>
    );
}

