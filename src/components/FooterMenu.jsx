import { motion } from 'framer-motion';

export default function FooterMenu({ onMenuClick }) {
    const menuItems = [
        { id: 'letterology', label: 'Raštologijos Skaičiavimai', icon: '📝' },
        { id: 'hidden-numerology', label: 'Paslėpta Numerologija', icon: '🔮' },
        { id: 'life-path-settings', label: 'Gyvenimo Kelio Skaičiavimo Nustatymai', icon: '⚙️' },
    ];

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10 mt-6 sm:mt-8 md:mt-12"
        >
            <div className="backdrop-blur-xl bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-500/20"
                style={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                    boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2)'
                }}
            >
                <nav className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onMenuClick && onMenuClick(item.id)}
                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl text-white/90 hover:text-white transition-all backdrop-blur-sm bg-black/20 hover:bg-purple-500/30 border border-purple-500/20 hover:border-purple-400/40 min-h-[44px] w-full sm:w-auto text-xs sm:text-sm"
                            style={{
                                textShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
                                boxShadow: '0 4px 16px 0 rgba(138, 43, 226, 0.1)'
                            }}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm font-semibold">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>
                
                <div className="text-center text-white/70 mt-4 text-xs" style={{ textShadow: '0 0 8px rgba(138, 43, 226, 0.3)' }}>
                    HOMAGE TO GARRY 33 FEET SNAKE
                </div>
            </div>
        </motion.footer>
    );
}

