import { useState } from 'react';
import { motion } from 'framer-motion';
import { hourAnimals, getFriendlyHours, getEnemyHours, getSoulmateHours, formatHourRange, hourAnimalEmojis } from '../utils/hourAnimals';

export default function FriendlyEnemyHours() {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const soulmateHours = selectedAnimal ? getSoulmateHours(selectedAnimal.animal) : [];
    const friendlyHours = selectedAnimal ? getFriendlyHours(selectedAnimal.animal) : [];
    const enemyHours = selectedAnimal ? getEnemyHours(selectedAnimal.animal) : [];

    const handleAnimalSelect = (animal) => {
        setSelectedAnimal(animal);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl mx-auto backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-white" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}>
                Draugiškos ir Priešiškos Valandos
            </h2>

            {/* Animal Selection */}
            <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center" style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}>
                    Pasirinkite Gyvūną
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                                    rounded-xl p-4 sm:p-5 text-white transition-all
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
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2">{hourAnimalEmojis[animal.animal]}</div>
                                    <div className="text-sm sm:text-base font-semibold mb-1">{animal.name}</div>
                                    <div className="text-xs sm:text-sm text-white/80">{formatHourRange(animal.start, animal.end)}</div>
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
                    className="mb-6 sm:mb-8 text-center"
                >
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2">
                        {hourAnimalEmojis[selectedAnimal.animal]}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px rgba(138, 43, 226, 0.6)' }}>
                        {selectedAnimal.name} - {formatHourRange(selectedAnimal.start, selectedAnimal.end)}
                    </h3>
                </motion.div>
            )}

            {/* Soulmate, Friendly and Enemy Hours */}
            {selectedAnimal && (
            <div className="space-y-6">
                {/* Soulmate Hours */}
                {soulmateHours.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-pink-400/40"
                        style={{
                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0.2) 100%)',
                            boxShadow: '0 4px 16px 0 rgba(236, 72, 153, 0.3)'
                        }}
                    >
                        <h4 className="text-lg sm:text-xl font-bold text-pink-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.6)' }}>
                            Sielos Draugai ⭐
                        </h4>
                        <div className="space-y-2">
                            {soulmateHours.map((hourAnimal, index) => {
                                const hourRange = formatHourRange(hourAnimal.start, hourAnimal.end);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-pink-500/25"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{hourAnimalEmojis[hourAnimal.animal]}</span>
                                            <span className="text-white font-semibold text-lg">{hourAnimal.name}</span>
                                        </div>
                                        <span className="text-pink-300 font-medium">{hourRange}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Friendly Hours */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-green-400/30"
                    style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 100%)',
                        boxShadow: '0 4px 16px 0 rgba(34, 197, 94, 0.2)'
                    }}
                >
                    <h4 className="text-lg sm:text-xl font-bold text-green-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
                        Draugiškos Valandos
                    </h4>
                    <div className="space-y-2">
                        {friendlyHours.map((hourAnimal, index) => {
                            const hourRange = formatHourRange(hourAnimal.start, hourAnimal.end);
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-green-500/20"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{hourAnimalEmojis[hourAnimal.animal]}</span>
                                        <span className="text-white font-medium">{hourAnimal.name}</span>
                                    </div>
                                    <span className="text-green-300 text-sm">{hourRange}</span>
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
                    className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-red-400/30"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
                        boxShadow: '0 4px 16px 0 rgba(239, 68, 68, 0.2)'
                    }}
                >
                    <h4 className="text-lg sm:text-xl font-bold text-red-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                        Priešiškos Valandos
                    </h4>
                    <div className="space-y-2">
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
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{hourAnimalEmojis[hourAnimal.animal]}</span>
                                        <span className="text-white font-medium">{hourAnimal.name}</span>
                                    </div>
                                    <span className="text-red-300 text-sm">{hourRange}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
            )}
        </motion.div>
    );
}

