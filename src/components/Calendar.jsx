import { useState } from 'react';
import { motion } from 'framer-motion';

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
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-black/30 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl shadow-purple-500/30 border border-purple-500/20 max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto"
            style={{
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
                
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white px-1 sm:px-2 text-center" style={{ textShadow: '0 0 15px rgba(138, 43, 226, 0.6)' }}>
                    {monthNames[month]} {year}
                </h2>
                
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
                        className="text-center text-[10px] sm:text-xs font-semibold text-white/70 py-0.5"
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
                    <div key={`empty-${index}`} className="h-[32px] sm:h-[36px] md:h-[44px] lg:h-[52px]" />
                ))}
                
                {/* Current month days */}
                {days.map((day, index) => {
                    const isTodayDate = isToday(day);
                    const isSelectedDate = isSelected(day);
                    
                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDateClick(day)}
                            className={`
                                rounded-md sm:rounded-lg transition-all text-white cursor-pointer 
                                h-[32px] sm:h-[36px] md:h-[44px] lg:h-[52px] 
                                min-w-[32px] sm:min-w-[36px] md:min-w-[44px] lg:min-w-[52px]
                                text-xs sm:text-sm md:text-base font-medium
                                ${isSelectedDate
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
                            {day}
                        </motion.button>
                    );
                })}
            </div>

        </motion.div>
    );
}

