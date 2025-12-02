import { useState } from 'react';
import { motion } from 'framer-motion';
import { getChineseZodiac, isChineseNewYear, zodiacTranslations, zodiacEmojis } from '../utils/chineseZodiac';
import { getWesternZodiac, isZodiacSignStart, zodiacSignTranslations, zodiacSignEmojis } from '../utils/westernZodiac';

const masterNumbers = [11, 22, 33];

// Calculate total sum for a date
const calculateDateSum = (day, month, year) => {
    const monthNum = month + 1; // month is 0-indexed
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
};

export default function Calendar({ onDateSelect }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Adjust for Lithuanian calendar (Monday = 0, Sunday = 6)
    const firstDayOfMonthRaw = new Date(year, month, 1).getDay();
    const firstDayOfMonth = firstDayOfMonthRaw === 0 ? 6 : firstDayOfMonthRaw - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
        'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
    ];

    const dayNames = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'];

    const handleDateClick = (day) => {
        const date = new Date(year, month, day);
        setSelectedDate(date);
        if (onDateSelect) {
            // Format date as YYYY-MM-DD directly to avoid timezone issues
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            onDateSelect(formattedDate);
        }
    };

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    };

    const days = [];
    
    // Only current month days
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="backdrop-blur-xl bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl shadow-purple-500/30 border border-purple-500/20 max-w-2xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto"
            style={{
                willChange: 'transform, opacity',
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-1 sm:mb-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToPrevMonth}
                    className="text-white/80 hover:text-white transition-colors p-1.5 sm:p-2 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center touch-manipulation"
                    style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>
                
                <div className="text-center">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white px-2 sm:px-4" style={{ textShadow: '0 0 15px rgba(138, 43, 226, 0.6)' }}>
                        {monthNames[month]} {year}
                    </h2>
                    <div className="flex flex-col gap-1 mt-1">
                        {(() => {
                            const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
                            const zodiac = getChineseZodiac(currentDateStr);
                            const zodiacName = zodiacTranslations[zodiac.zodiac] || zodiac.zodiac;
                            const zodiacEmoji = zodiacEmojis[zodiac.zodiac] || '';
                            return (
                                <p className="text-xs sm:text-sm md:text-base text-yellow-300/80 font-semibold" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}>
                                    {zodiacName} {zodiacEmoji}
                                </p>
                            );
                        })()}
                        {(() => {
                            const westernSign = getWesternZodiac(month + 1, 15); // Use middle of month for display
                            const signName = zodiacSignTranslations[westernSign] || westernSign;
                            const signEmoji = zodiacSignEmojis[westernSign] || '';
                            return (
                                <p className="text-xs sm:text-sm md:text-base text-cyan-400/75 font-semibold" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.4), 0 0 15px rgba(6, 182, 212, 0.3)' }}>
                                    {signName} {signEmoji}
                                </p>
                            );
                        })()}
                    </div>
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToNextMonth}
                    className="text-white/80 hover:text-white transition-colors p-1.5 sm:p-2 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center touch-manipulation"
                    style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2 mb-1 sm:mb-1.5">
                {dayNames.map((dayName, index) => (
                    <div
                        key={index}
                        className="text-center text-xs sm:text-sm md:text-base font-semibold text-white/70 py-1 sm:py-2"
                        style={{ textShadow: '0 0 8px rgba(138, 43, 226, 0.4)' }}
                    >
                        {dayName}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-[40px] sm:h-[48px] md:h-[56px] lg:h-[64px] xl:h-[72px]" />
                ))}
                
                {/* Current month days */}
                {days.map((day, index) => {
                    const isTodayDate = isToday(day);
                    const isSelectedDate = isSelected(day);
                    const dateSum = calculateDateSum(day, month, year);
                    // Highlight master numbers (11, 22, 33), 28, 20 (hidden 11), and 29 (2+9=11) in sum only
                    const isSpecialSum = masterNumbers.includes(dateSum) || dateSum === 28 || dateSum === 20 || dateSum === 29;
                    // Highlight the 11th, 20th, 22nd, 28th, 29th, and 33rd day numbers (master numbers and special days)
                    const isSpecialDay = day === 11 || day === 20 || day === 22 || day === 28 || day === 29 || day === 33;
                    // Check if this is Chinese New Year
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isZodiacNewYear = isChineseNewYear(dateStr);
                    // Check if this is Western zodiac sign start
                    const isWesternZodiacStart = isZodiacSignStart(month + 1, day);
                    
                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDateClick(day)}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            style={{ willChange: 'transform' }}
                            className={`
                                rounded-md sm:rounded-lg transition-all text-white cursor-pointer 
                                h-[40px] sm:h-[48px] md:h-[56px] lg:h-[64px] xl:h-[72px]
                                min-w-[40px] sm:min-w-[48px] md:min-w-[56px] lg:min-w-[64px] xl:min-w-[72px]
                                text-sm sm:text-base md:text-lg lg:text-xl font-medium
                                flex flex-col items-center justify-center
                                ${isZodiacNewYear
                                    ? 'bg-gradient-to-br from-yellow-500/40 to-orange-500/40 text-white border-2 border-yellow-400/60 shadow-lg'
                                    : isWesternZodiacStart
                                    ? 'bg-gradient-to-br from-cyan-500/35 to-teal-500/35 text-white border-2 border-cyan-400/60 shadow-lg'
                                    : isSelectedDate
                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg'
                                    : isTodayDate
                                    ? 'bg-purple-500/30 text-white border border-purple-400'
                                    : 'hover:bg-purple-500/20 active:bg-purple-500/30'
                                }
                            `}
                            style={{
                                boxShadow: isSelectedDate 
                                    ? '0 0 20px rgba(138, 43, 226, 0.6)' 
                                    : isTodayDate
                                    ? '0 0 15px rgba(138, 43, 226, 0.4)'
                                    : 'none'
                            }}
                        >
                            <span className={isSpecialDay ? 'text-yellow-300 font-bold' : ''} style={isSpecialDay ? {
                                textShadow: '0 0 8px rgba(251, 191, 36, 0.8), 0 0 12px rgba(245, 158, 11, 0.6)'
                            } : {}}>{day}</span>
                            <span 
                                className={`text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-normal ${
                                    isSpecialSum 
                                        ? 'text-yellow-300 font-bold opacity-100' 
                                        : 'opacity-70'
                                }`}
                                style={isSpecialSum ? {
                                    textShadow: '0 0 8px rgba(251, 191, 36, 0.8), 0 0 12px rgba(245, 158, 11, 0.6)'
                                } : {}}
                            >
                                {dateSum}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

        </motion.div>
    );
}

