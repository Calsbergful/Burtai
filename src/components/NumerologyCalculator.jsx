import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './Calendar';
import ResultCard from './ResultCard';
import CalculationSteps from './CalculationSteps';
import {
    calculateLifePath,
    reduceNumber,
    masterNumbers
} from '../utils/numerology';

export default function NumerologyCalculator() {
    const [birthdate, setBirthdate] = useState('');
    const [results, setResults] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleDateSelect = (date) => {
        setBirthdate(date);
        setIsCalculating(true);
        
        // Immediate calculation for smooth experience
        requestAnimationFrame(() => {
            // Ensure date is in correct format
            const selectedDate = date || '';
            if (!selectedDate) return;
            
            const lifePath = calculateLifePath(selectedDate);
            
            // Extract day number from selected date
            const [, , dayPart] = selectedDate.split('-');
            const selectedDay = parseInt(dayPart, 10);
            
            setResults({
                lifePath,
                selectedDay: selectedDay,
                selectedDate: selectedDate,
                calculations: [
                    { title: 'Pilna Data', steps: lifePath.steps }
                ]
            });
            
            setIsCalculating(false);
            
            // Smooth scroll after animation starts
            requestAnimationFrame(() => {
                const resultsElement = document.getElementById('results');
                if (resultsElement) {
                    resultsElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
            });
        });
    };

    return (
        <div className="w-full max-w-6xl mx-auto mb-1 sm:mb-2">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ willChange: 'transform, opacity' }}
            >
                <Calendar onDateSelect={handleDateSelect} />
            </motion.div>

                <AnimatePresence mode="wait">
                    {results && (
                        <motion.div
                            id="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            className="mt-2 sm:mt-3 backdrop-blur-xl bg-black/30 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
                            style={{
                                willChange: 'transform, opacity',
                                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-0">
                                {/* Left side - Full date data */}
                                <div className="flex flex-col items-center justify-center">
                                    {(() => {
                                        const lifePathNum = results.lifePath.number;
                                        const isSpecialLifePath = masterNumbers.includes(lifePathNum) || lifePathNum === 28 || lifePathNum === 20 || lifePathNum === 29;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-3 ${
                                                    isSpecialLifePath ? 'text-yellow-300' : 'text-white'
                                                }`}
                                                style={isSpecialLifePath ? {
                                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(245, 158, 11, 0.6), 0 0 60px rgba(217, 119, 6, 0.4)'
                                                } : {
                                                    textShadow: '0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(99, 102, 241, 0.4)'
                                                }}
                                            >
                                                {lifePathNum}
                                            </motion.div>
                                        );
                                    })()}
                                    <CalculationSteps calculations={results.calculations} />
                                </div>
                                
                                {/* Right side - Selected calendar day number */}
                                <div className="flex flex-col items-center justify-center">
                                    {(() => {
                                        const selectedDayNum = results.selectedDay;
                                        const reducedDay = reduceNumber(selectedDayNum);
                                        const isSpecialDay = masterNumbers.includes(selectedDayNum) || selectedDayNum === 28 || selectedDayNum === 20 || selectedDayNum === 29 ||
                                                           masterNumbers.includes(reducedDay) || reducedDay === 28 || reducedDay === 20 || reducedDay === 29;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-3 ${
                                                    isSpecialDay ? 'text-yellow-300' : 'text-white'
                                                }`}
                                                style={isSpecialDay ? {
                                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(245, 158, 11, 0.6), 0 0 60px rgba(217, 119, 6, 0.4)'
                                                } : {
                                                    textShadow: '0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(99, 102, 241, 0.4)'
                                                }}
                                            >
                                                {selectedDayNum}
                                            </motion.div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
}

