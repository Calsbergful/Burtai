import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from './Calendar';
import DayRecommendations from './DayRecommendations';
import {
    calculateLifePath,
    reduceNumber,
    masterNumbers
} from '../utils/numerology';

export default function NumerologyCalculator() {
    const [birthdate, setBirthdate] = useState('');
    const [results, setResults] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Calculate date sum (full number) - same logic as Calendar - memoized
    const calculateDateSum = useCallback((day, month, year) => {
        const monthNum = month; // month is already 1-indexed from date string
        // For month: only November (11) is kept as master number; all others split into digits
        const monthValues = (monthNum === 11) ? [11] : monthNum.toString().split('').map(d => parseInt(d));
        // For day: if it's a master number (11, 22, 33), keep it whole; otherwise split into digits
        const dayValues = masterNumbers.includes(day) ? [day] : day.toString().split('').map(d => parseInt(d));
        // For year: always use individual digits
        const yearDigits = year.toString().split('').map(d => parseInt(d));
        
        // Sum all values together
        const allValues = [...monthValues, ...dayValues, ...yearDigits];
        const total = allValues.reduce((sum, val) => sum + val, 0);
        
        return total;
    }, []);

    const handleDateSelect = useCallback((date) => {
        // Clear previous results first
        setResults(null);
        setBirthdate(date);
        setIsCalculating(true);
        
        // Immediate calculation for smooth experience
        requestAnimationFrame(() => {
            // Ensure date is in correct format
            const selectedDate = date || '';
            if (!selectedDate) return;
            
            const lifePath = calculateLifePath(selectedDate);
            
            // Extract day, month, year from selected date
            const [yearPart, monthPart, dayPart] = selectedDate.split('-');
            const selectedDay = parseInt(dayPart, 10);
            const selectedMonth = parseInt(monthPart, 10);
            const selectedYear = parseInt(yearPart, 10);
            
            // Calculate full number (date sum)
            const dateSum = calculateDateSum(selectedDay, selectedMonth, selectedYear);
            
            setResults({
                lifePath,
                selectedDay: selectedDay,
                selectedDate: selectedDate,
                dateSum: dateSum,
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
    }, [calculateDateSum]);

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
                            
                            {/* Day Recommendations */}
                            <DayRecommendations 
                                dayNum={results.selectedDay}
                                fullNum={results.dateSum}
                                date={results.selectedDate}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
}

