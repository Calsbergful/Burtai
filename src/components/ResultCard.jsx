import { motion } from 'framer-motion';
import { memo } from 'react';

function ResultCard({ number, title, description, delay = 0 }) {
    const isMasterNumber = [11, 22, 33].includes(number);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-purple-500/20 transition-all"
            style={{
                willChange: 'transform, opacity',
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 60px rgba(138, 43, 226, 0.1)'
            }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.1, type: "spring", stiffness: 200, damping: 20 }}
                style={{ willChange: 'transform' }}
                className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 ${
                    isMasterNumber 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent' 
                        : 'text-purple-600'
                }`}
            >
                {number}
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white px-2" style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.4)' }}>{title}</h3>
            <p className="text-gray-200 leading-relaxed text-xs sm:text-sm px-2">{description}</p>
        </motion.div>
    );
}

export default memo(ResultCard);

