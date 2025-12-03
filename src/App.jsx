import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NumerologyCalculator from './components/NumerologyCalculator'
import FriendlyEnemyHours from './components/FriendlyEnemyHours'
import BirthdayCalculator from './components/BirthdayCalculator'
import Letterology from './components/Letterology'
import HiddenNumerology from './components/HiddenNumerology'
import CosmicBackground from './components/CosmicBackground'
import FooterMenu from './components/FooterMenu'

function App() {
  const [activeView, setActiveView] = useState('calculator');

  const handleMenuClick = (menuId) => {
    if (menuId === 'calculator') {
      setActiveView('calculator');
    } else if (menuId === 'friendly-enemy-hours') {
      setActiveView('hours');
    } else if (menuId === 'life-path-settings') {
      setActiveView('birthday');
    } else if (menuId === 'personal-birthday') {
      setActiveView('birthday');
      setPersonalBirthdayTrigger(prev => prev + 1);
    } else if (menuId === 'letterology') {
      setActiveView('letterology');
    } else if (menuId === 'hidden-numerology') {
      setActiveView('hidden-numerology');
    } else {
      setActiveView('calculator');
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-4 px-3 sm:py-8 sm:px-4 relative pb-20 sm:pb-24 md:pb-32 lg:pb-40">
      <CosmicBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <header className="text-center text-white mb-6 sm:mb-8 md:mb-12 relative z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              textShadow: [
                '0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(245, 158, 11, 0.3), 0 0 30px rgba(217, 119, 6, 0.2)',
                '0 0 15px rgba(251, 191, 36, 0.5), 0 0 30px rgba(245, 158, 11, 0.4), 0 0 45px rgba(217, 119, 6, 0.3)',
                '0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(245, 158, 11, 0.3), 0 0 30px rgba(217, 119, 6, 0.2)',
              ]
            }}
            transition={{ 
              duration: 0.6,
              textShadow: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 relative"
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 15%, #fcd34d 30%, #fbbf24 45%, #ffffff 60%, #fde68a 75%, #fbbf24 90%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.3)) drop-shadow(0 0 45px rgba(217, 119, 6, 0.2))',
              letterSpacing: '0.08em',
              fontWeight: '800',
            }}
          >
            Geduče Burtai
          </motion.h1>
        </header>
        
        <AnimatePresence mode="wait">
          {activeView === 'calculator' ? (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NumerologyCalculator />
            </motion.div>
          ) : activeView === 'hours' ? (
            <motion.div
              key="hours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FriendlyEnemyHours />
            </motion.div>
          ) : activeView === 'birthday' ? (
            <motion.div
              key="birthday"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BirthdayCalculator personalBirthdayTrigger={personalBirthdayTrigger} />
            </motion.div>
          ) : activeView === 'letterology' ? (
            <motion.div
              key="letterology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Letterology />
            </motion.div>
          ) : (
            <motion.div
              key="hidden-numerology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HiddenNumerology />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FooterMenu onMenuClick={handleMenuClick} activeMenuId={
        activeView === 'calculator' ? 'calculator' :
        activeView === 'hours' ? 'friendly-enemy-hours' : 
        activeView === 'birthday' && personalBirthdayTrigger > 0 ? 'personal-birthday' :
        activeView === 'birthday' ? 'life-path-settings' : 
        activeView === 'letterology' ? 'letterology' :
        activeView === 'hidden-numerology' ? 'hidden-numerology' :
        null
      } />
    </div>
  )
}

export default App

