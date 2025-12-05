import { motion } from 'framer-motion';
import { useState, useEffect, memo } from 'react';

function FooterMenu({ onMenuClick, activeMenuId, hideDatabase = false }) {
    const [activeItem, setActiveItem] = useState(activeMenuId || null);
    
    // Update active item when prop changes
    useEffect(() => {
        if (activeMenuId !== undefined) {
            setActiveItem(activeMenuId);
        }
    }, [activeMenuId]);
    
                const menuItems = [
                    { id: 'calculator', label: 'Kalendorius', icon: '📅' },
                    { id: 'letterology', label: 'Raidės', icon: '🔤' },
                    { id: 'hidden-numerology', label: 'Hmmm..', icon: '🔮' },
                    { id: 'life-path-settings', label: 'Gimtadienis', icon: '🎂' },
                    { id: 'personal-birthday', label: 'Asmeninis', icon: '⭐' },
                    { id: 'friendly-enemy-hours', label: 'Valandos', icon: '⏰' },
                    ...(hideDatabase ? [] : [{ id: 'database', label: 'Bazė', icon: '💾' }]),
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
                <nav className="flex justify-center items-center gap-2 sm:gap-2 md:gap-4 px-0 py-2.5 sm:py-1.5">
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
                                setActiveItem(item.id);
                                if (onMenuClick) {
                                    onMenuClick(item.id);
                                }
                            }}
                            className={`
                                flex flex-col items-center justify-center gap-1 px-3 sm:px-3 md:px-5 py-2 sm:py-1.5 rounded-lg transition-all
                                min-h-[65px] min-w-[65px] sm:min-h-[50px] sm:min-w-[70px] md:min-w-[90px]
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
                            <span className="text-2xl sm:text-2xl md:text-3xl">{item.icon}</span>
                            <span className="text-[9px] sm:text-[9px] md:text-[10px] font-semibold text-center leading-tight">
                                {item.label.split(' ')[0]}
                            </span>
                        </motion.button>
                    ))}
                </nav>
            </div>
        </motion.footer>
    );
}

export default memo(FooterMenu);

