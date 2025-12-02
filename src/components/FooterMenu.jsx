import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FooterMenu({ onMenuClick, activeMenuId }) {
    const [activeItem, setActiveItem] = useState(activeMenuId || null);
    
    // Update active item when prop changes
    useEffect(() => {
        if (activeMenuId !== undefined) {
            setActiveItem(activeMenuId);
        }
    }, [activeMenuId]);
    
    const menuItems = [
        { id: 'letterology', label: 'Raidės', icon: '🔤' },
        { id: 'hidden-numerology', label: 'Slapta Numerologija', icon: '🔮' },
        { id: 'life-path-settings', label: 'Gimtadienis', icon: '🎂' },
        { id: 'friendly-enemy-hours', label: 'Valandos', icon: '⏰' },
    ];

    const handleClick = (itemId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveItem(itemId);
        if (onMenuClick) {
            onMenuClick(itemId);
        }
    };

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 w-full"
        >
            <div className="backdrop-blur-xl bg-black/50 border-t-2 border-purple-500/40 w-full"
                style={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.85) 0%, rgba(26, 10, 46, 0.8) 50%, rgba(15, 52, 96, 0.75) 100%)',
                    boxShadow: '0 -4px 20px 0 rgba(138, 43, 226, 0.4), inset 0 1px 0 rgba(138, 43, 226, 0.2)'
                }}
            >
                <nav className="flex justify-center items-center gap-1 sm:gap-2 md:gap-4 px-0 py-2 sm:py-3">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleClick(item.id, e)}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClick(item.id, e);
                            }}
                            className={`
                                flex flex-col items-center justify-center gap-1 px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-all
                                min-h-[60px] min-w-[60px] sm:min-w-[80px] md:min-w-[100px]
                                touch-manipulation cursor-pointer
                                ${activeItem === item.id
                                    ? 'bg-purple-500/40 text-white border border-purple-400/60'
                                    : 'text-white/70 hover:text-white hover:bg-purple-500/20 border border-transparent'
                                }
                            `}
                            style={{
                                textShadow: activeItem === item.id 
                                    ? '0 0 15px rgba(138, 43, 226, 0.8)' 
                                    : '0 0 8px rgba(138, 43, 226, 0.4)',
                                boxShadow: activeItem === item.id 
                                    ? '0 4px 16px 0 rgba(138, 43, 226, 0.3)' 
                                    : 'none',
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent',
                                userSelect: 'none'
                            }}
                            title={item.label}
                        >
                            <span className="text-2xl sm:text-3xl md:text-4xl">{item.icon}</span>
                            <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold text-center leading-tight hidden sm:block">
                                {item.label.split(' ')[0]}
                            </span>
                        </motion.button>
                    ))}
                </nav>
                
                <div className="text-center text-white/60 mt-1 sm:mt-2 pb-2 px-2 text-[10px] sm:text-xs" style={{ textShadow: '0 0 6px rgba(138, 43, 226, 0.3)' }}>
                    HOMAGE TO GARRY 33 FEET SNAKE
                </div>
            </div>
        </motion.footer>
    );
}

