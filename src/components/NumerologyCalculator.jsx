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
        
        // Small delay for smooth animation
        setTimeout(() => {
            const lifePath = calculateLifePath(date);
            
            setResults({
                lifePath,
                calculations: [
                    { title: 'Gyvenimo Kelio Skaičius', steps: lifePath.steps }
                ]
            });
            
            setIsCalculating(false);
            
            // Scroll to results with smooth behavior
            setTimeout(() => {
                const resultsElement = document.getElementById('results');
                if (resultsElement) {
                    resultsElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);
        }, 300);
    };

    return (
        <div className="w-full max-w-6xl mx-auto mb-8 md:mb-12 lg:mb-16">
            <Calendar onDateSelect={handleDateSelect} />

                <AnimatePresence>
                    {results && (
                        <motion.div
                            id="results"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-4 sm:mt-6 md:mt-8 backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
                            style={{
                                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
                            }}
                        >
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-white px-2"
                                style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}
                            >
                                Gyvenimo Kelio Skaičius
                            </motion.h2>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                                <ResultCard
                                    number={results.lifePath.number}
                                    title="Gyvenimo Kelio Skaičius"
                                    description={numberDescriptions[results.lifePath.number]?.lifePath || 'Aprašymas neprieinamas.'}
                                    delay={0.1}
                                />
                            </div>

                            <CalculationSteps calculations={results.calculations} />
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
}

