import { motion } from 'framer-motion';

export default function CalculationSteps({ calculations }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6 md:mt-8 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.5) 0%, rgba(26, 10, 46, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.15)'
            }}
        >
            <div className="space-y-4 sm:space-y-6">
                {calculations.map((calc, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                        className="backdrop-blur-sm bg-black/30 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-l-4 border-purple-400"
                        style={{
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

