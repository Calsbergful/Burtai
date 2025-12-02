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
            
            setResults({
                lifePath,
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
                            className="mt-4 sm:mt-6 md:mt-8"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                                <ResultCard
                                    number={results.lifePath.number}
                                    title="Pilna Data"
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

