import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './Calendar';
import ResultCard from './ResultCard';
import CalculationSteps from './CalculationSteps';
import {
    calculateLifePath,
    numberDescriptions
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
            const lifePath = calculateLifePath(date);
            
            // Calculate current day's data
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const todayLifePath = calculateLifePath(todayStr);
            
            setResults({
                lifePath,
                todayLifePath,
                calculations: [
                    { title: 'Pilna Data', steps: lifePath.steps }
                ],
                todayCalculations: [
                    { title: 'Šiandienos Data', steps: todayLifePath.steps }
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
        <div className="w-full max-w-6xl mx-auto mb-8 md:mb-12 lg:mb-16">
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
                            className="mt-4 sm:mt-6 md:mt-8 backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
                            style={{
                                willChange: 'transform, opacity',
                                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Left side - Full date data */}
                                <div>
                                    <ResultCard
                                        number={results.lifePath.number}
                                        title="Pilna Data"
                                        description={numberDescriptions[results.lifePath.number]?.lifePath || 'Aprašymas neprieinamas.'}
                                        delay={0.1}
                                    />
                                    <CalculationSteps calculations={results.calculations} />
                                </div>
                                
                                {/* Right side - Current calendar day data */}
                                <div>
                                    <ResultCard
                                        number={results.todayLifePath.number}
                                        title="Šiandienos Data"
                                        description={numberDescriptions[results.todayLifePath.number]?.lifePath || 'Aprašymas neprieinamas.'}
                                        delay={0.2}
                                    />
                                    <CalculationSteps calculations={results.todayCalculations} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
}

