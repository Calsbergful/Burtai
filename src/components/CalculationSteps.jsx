import { motion } from 'framer-motion';

export default function CalculationSteps({ calculations }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 sm:mt-6 md:mt-8"
            style={{ willChange: 'transform, opacity' }}
        >
            <div className="space-y-4 sm:space-y-6">
                {calculations.map((calc, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: 0.3 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                        className="backdrop-blur-sm bg-black/30 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-l-4 border-purple-400"
                        style={{
                            willChange: 'transform, opacity',
                            boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.1)'
                        }}
                    >
                        <div className="font-mono text-xs sm:text-sm text-gray-300 space-y-1 break-words">
                            {calc.steps.map((step, stepIndex) => (
                                <div key={stepIndex}>{step}</div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

