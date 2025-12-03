import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NumerologyCalculator from './components/NumerologyCalculator'
import FriendlyEnemyHours from './components/FriendlyEnemyHours'
import BirthdayCalculator from './components/BirthdayCalculator'
import Letterology from './components/Letterology'
import HiddenNumerology from './components/HiddenNumerology'
import CosmicBackground from './components/CosmicBackground'
import FooterMenu from './components/FooterMenu'
import PasswordProtection from './components/PasswordProtection'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeView, setActiveView] = useState('calculator');
  const [personalBirthdayTrigger, setPersonalBirthdayTrigger] = useState(0);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handlePasswordCorrect = () => {
    setIsAuthenticated(true)
  }

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onPasswordCorrect={handlePasswordCorrect} />
  }

  const handleMenuClick = (menuId) => {
    if (menuId === 'calculator') {
      setActiveView('calculator');
    } else if (menuId === 'friendly-enemy-hours') {
      setActiveView('hours');
    } else if (menuId === 'life-path-settings') {
      setActiveView('birthday');
      setPersonalBirthdayTrigger(0); // Reset to show regular birthday input
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
    <div className="min-h-screen gradient-bg py-4 px-3 sm:py-8 sm:px-4 relative pb-[95px] sm:pb-[75px] md:pb-[80px]">
      <CosmicBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
        <header className="text-center text-white mb-2 sm:mb-3 md:mb-4 relative z-10 w-full">
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

      {/* Homage Text */}
      <div className="fixed bottom-[90px] sm:bottom-[55px] left-0 right-0 z-40 text-center text-white/60 py-0.5 px-2 text-[9px] sm:text-[10px]" style={{ textShadow: '0 0 6px rgba(138, 43, 226, 0.3)' }}>
        HOMAGE TO GARRY 33 FEET SNAKE
      </div>

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

