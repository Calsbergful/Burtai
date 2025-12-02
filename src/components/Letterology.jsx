import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateWordValue, getLetterValue, isUpperCase, isVowel } from '../utils/letterology';
import { masterNumbers } from '../utils/numerology';

export default function Letterology() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        
        if (value.trim()) {
            const wordResult = calculateWordValue(value);
            setResults(wordResult);
        } else {
            setResults(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-white" style={{ textShadow: '0 0 20px rgba(138, 43, 226, 0.6)' }}>
                Raidės
            </h2>

            {/* Input */}
            <div className="mb-6 sm:mb-8">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Pvz.: gedic"
                    className="w-full max-w-md mx-auto block px-4 py-3 rounded-xl bg-purple-500/20 border border-purple-400/40 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{
                        boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.2)'
                    }}
                />
                <p className="text-white/60 text-xs sm:text-sm text-center mt-2">
                    Mažosios raidės: A=1, B=2, ..., Z=26 | Didžiosios raidės: A=27, B=28, ..., Z=52
                </p>
            </div>

            {/* Results */}
            {results && results.values.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Combined Letter and Vowel Breakdown */}
                    <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-400/30">
                        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-4 text-center" style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.6)' }}>
                            Raidžių Skaičiavimas
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4">
                            {results.values.map((item, index) => {
                                const isCapital = isUpperCase(item.letter);
                                const isVowelLetter = item.isVowel;
                                const isSpecial = masterNumbers.includes(item.value) || item.value === 20 || item.value === 28 || item.value === 29;
                                const isSpecialVowel = isVowelLetter && (masterNumbers.includes(item.vowelValue) || item.vowelValue === 20 || item.vowelValue === 28 || item.vowelValue === 29);
                                
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                                        className={`text-center p-2 sm:p-3 rounded-lg relative ${
                                            isSpecial || isSpecialVowel
                                                ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border-2 border-yellow-400/60'
                                                : isVowelLetter
                                                ? isCapital
                                                    ? 'bg-gradient-to-br from-pink-500/30 to-rose-500/20 border border-pink-400/40'
                                                    : 'bg-pink-500/20 border border-pink-400/30'
                                                : isCapital
                                                ? 'bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border border-cyan-400/40'
                                                : 'bg-purple-500/20 border border-purple-400/30'
                                        }`}
                                        style={(isSpecial || isSpecialVowel) ? {
                                            boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)'
                                        } : {}}
                                    >
                                        <div className={`text-2xl sm:text-3xl font-bold mb-1 ${
                                            isSpecial || isSpecialVowel ? 'text-yellow-300' : 
                                            isVowelLetter ? (isCapital ? 'text-pink-300' : 'text-white') :
                                            isCapital ? 'text-cyan-300' : 'text-white'
                                        }`}>
                                            {item.letter}
                                        </div>
                                        <div className={`text-sm font-medium ${
                                            isSpecial || isSpecialVowel ? 'text-yellow-200' : 
                                            isVowelLetter ? (isCapital ? 'text-pink-200' : 'text-pink-200') :
                                            isCapital ? 'text-cyan-200' : 'text-purple-200'
                                        }`}>
                                            {item.value}
                                        </div>
                                        {isVowelLetter && (
                                            <div className="text-xs text-pink-300/70 mt-0.5">
                                                balsis: {item.vowelValue}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total and Reduced */}
                    <div className="backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-400/30">
                        <div className="grid grid-cols-2 gap-4 items-center mb-4">
                            {/* Total */}
                            <div className="text-center">
                                {(() => {
                                    const isSpecialTotal = masterNumbers.includes(results.total) || results.total === 20 || results.total === 28 || results.total === 29;
                                    return (
                                        <>
                                            <div className="text-sm text-white/70 mb-2">Suma</div>
                                            <div 
                                                className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-2 ${
                                                    isSpecialTotal ? 'text-yellow-300' : 'text-white'
                                                }`}
                                                style={isSpecialTotal ? {
                                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                } : {
                                                    textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                }}
                                            >
                                                {results.total}
                                            </div>
                                            <div className="text-xs text-purple-200">
                                                {results.values.map(item => item.value).join(' + ')} = {results.total}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Reduced */}
                            <div className="text-center">
                                {(() => {
                                    const isSpecialReduced = masterNumbers.includes(results.reduced) || results.reduced === 20 || results.reduced === 28 || results.reduced === 29;
                                    return (
                                        <>
                                            <div className="text-sm text-white/70 mb-2">Sumažinta</div>
                                            <div 
                                                className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
                                                    isSpecialReduced ? 'text-yellow-300' : 'text-white'
                                                }`}
                                                style={isSpecialReduced ? {
                                                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                } : {
                                                    textShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
                                                }}
                                            >
                                                {results.reduced}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Vowel Total and Reduced */}
                        {results.vowelTotal > 0 && (
                            <div className="border-t border-purple-400/20 pt-4 mt-4">
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    {/* Vowel Total */}
                                    <div className="text-center">
                                        {(() => {
                                            const isSpecialVowelTotal = masterNumbers.includes(results.vowelTotal) || results.vowelTotal === 20 || results.vowelTotal === 28 || results.vowelTotal === 29;
                                            return (
                                                <>
                                                    <div className="text-sm text-white/70 mb-2">Balsių Suma</div>
                                                    <div 
                                                        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${
                                                            isSpecialVowelTotal ? 'text-yellow-300' : 'text-pink-300'
                                                        }`}
                                                        style={isSpecialVowelTotal ? {
                                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 20px rgba(236, 72, 153, 0.8)'
                                                        }}
                                                    >
                                                        {results.vowelTotal}
                                                    </div>
                                                    <div className="text-xs text-pink-200">
                                                        {results.vowels.map(item => item.vowelValue).join(' + ')} = {results.vowelTotal}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Vowel Reduced */}
                                    <div className="text-center">
                                        {(() => {
                                            const isSpecialVowelReduced = masterNumbers.includes(results.vowelReduced) || results.vowelReduced === 20 || results.vowelReduced === 28 || results.vowelReduced === 29;
                                            return (
                                                <>
                                                    <div className="text-sm text-white/70 mb-2">Balsių Sumažinta</div>
                                                    <div 
                                                        className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                                                            isSpecialVowelReduced ? 'text-yellow-300' : 'text-pink-300'
                                                        }`}
                                                        style={isSpecialVowelReduced ? {
                                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)'
                                                        } : {
                                                            textShadow: '0 0 20px rgba(236, 72, 153, 0.8)'
                                                        }}
                                                    >
                                                        {results.vowelReduced}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

