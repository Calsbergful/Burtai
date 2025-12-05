// Obfuscated imports with decoy variables
const _d1 = () => {};
const _d2 = [1,2,3,4,5];
const _d3 = {a:1,b:2};

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CosmicBackground from './components/CosmicBackground'
import FooterMenu from './components/FooterMenu'
import PasswordProtection from './components/PasswordProtection'

// Import components directly (lazy loading temporarily disabled to fix white screen)
import NumerologyCalculator from './components/NumerologyCalculator'
import FriendlyEnemyHours from './components/FriendlyEnemyHours'
import BirthdayCalculator from './components/BirthdayCalculator'
import Letterology from './components/Letterology'
import HiddenNumerology from './components/HiddenNumerology'
import Database from './components/Database'

// Lazy load components for better performance (commented out to fix white screen issue)
// const NumerologyCalculator = lazy(() => import('./components/NumerologyCalculator'))
// const FriendlyEnemyHours = lazy(() => import('./components/FriendlyEnemyHours'))
// const BirthdayCalculator = lazy(() => import('./components/BirthdayCalculator'))
// const Letterology = lazy(() => import('./components/Letterology'))
// const HiddenNumerology = lazy(() => import('./components/HiddenNumerology'))
// const Database = lazy(() => import('./components/Database'))

// Loading fallback component
const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-white/60 text-sm"
    >
      Loading...
    </motion.div>
  </div>
)

// Error boundary component for lazy loading
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
    <p className="text-red-400 mb-4">Something went wrong</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
    >
      Try again
    </button>
  </div>
)

// Dead code injection
const _dead1 = () => { const x = Math.random() * 1000; return x % 2 === 0; };
const _dead2 = (a, b) => { for(let i=0;i<100;i++){a+=b;} return a; };
const _dead3 = [1,2,3,4,5].map(x => x*x).filter(x => x > 10);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeView, setActiveView] = useState('calculator');
  const [personalBirthdayTrigger, setPersonalBirthdayTrigger] = useState(0);
  const [databaseSequence, setDatabaseSequence] = useState([]); // Track sequence: ['calculator', 'life-path-settings', 'letterology', 'personal-birthday']
  const [databaseUnlocked, setDatabaseUnlocked] = useState(false);
  const [sequenceTimeout, setSequenceTimeout] = useState(null);

  useEffect(() => {
    // Verify authentication token with server on page load
    const verifyAuth = async () => {
      const _authKey = String.fromCharCode(105, 115, 65, 117, 116, 104, 101, 110, 116, 105, 99, 97, 116, 101, 100); // "isAuthenticated"
      const token = sessionStorage.getItem(_authKey);
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token with server
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem(_authKey);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // If server verification fails, clear token and require re-authentication
        sessionStorage.removeItem(_authKey);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
    
    // Database is always hidden on page load/reload - sequence must be entered each time
    setDatabaseUnlocked(false);
    const _dbKey = String.fromCharCode(100, 97, 116, 97, 98, 97, 115, 101, 85, 110, 108, 111, 99, 107, 101, 100); // "databaseUnlocked"
    sessionStorage.removeItem(_dbKey);
  }, [])

  // Reset sequence after 10 seconds of inactivity
  useEffect(() => {
    if (databaseSequence.length > 0 && !databaseUnlocked) {
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }
      const timeout = setTimeout(() => {
        setDatabaseSequence([])
      }, 10000) // 10 seconds
      setSequenceTimeout(timeout)
      
      return () => clearTimeout(timeout)
    }
  }, [databaseSequence, databaseUnlocked])

  const handlePasswordCorrect = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onPasswordCorrect={handlePasswordCorrect} />
  }

  const handleMenuClick = useCallback((menuId) => {
    // Check database unlock sequence: calculator -> life-path-settings -> letterology -> personal-birthday
    const expectedSequence = ['calculator', 'life-path-settings', 'letterology', 'personal-birthday'];
    
    // If database is already unlocked, allow direct access
    if (databaseUnlocked && menuId === 'database') {
      setActiveView('database');
      return;
    }
    
    // Check if this click is part of the sequence
    const currentStep = databaseSequence.length;
    const expectedNext = expectedSequence[currentStep];
    
    if (menuId === expectedNext) {
      // Correct step in sequence
      const newSequence = [...databaseSequence, menuId];
      setDatabaseSequence(newSequence);
      
      // Check if sequence is complete
      if (newSequence.length === expectedSequence.length) {
        setDatabaseUnlocked(true);
        // Don't persist to sessionStorage - Database will be hidden on reload
        setActiveView('database');
        setDatabaseSequence([]);
        return;
      }
    } else if (menuId === 'calculator' && currentStep === 0) {
      // Allow starting the sequence
      setDatabaseSequence(['calculator']);
    } else if (databaseSequence.length > 0) {
      // Wrong step - reset sequence
      setDatabaseSequence([]);
    }
    
    // Handle normal menu clicks
    if (menuId === 'calculator') {
      setActiveView('calculator');
    } else if (menuId === 'friendly-enemy-hours') {
      setActiveView('hours');
      setDatabaseSequence([]); // Reset sequence on wrong click
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
      setDatabaseSequence([]); // Reset sequence on wrong click
    } else if (menuId === 'database' && !databaseUnlocked) {
      // Don't allow direct access if not unlocked
      setDatabaseSequence([]); // Reset sequence
      return;
    } else if (menuId === 'database' && databaseUnlocked) {
      setActiveView('database');
    } else {
      setActiveView('calculator');
    }
  }, [databaseUnlocked, databaseSequence]);

  // Render active view component with error boundary
  const renderActiveView = () => {
    try {
      switch (activeView) {
        case 'calculator':
          return <NumerologyCalculator />;
        case 'hours':
          return <FriendlyEnemyHours />;
        case 'birthday':
          return <BirthdayCalculator personalBirthdayTrigger={personalBirthdayTrigger} />;
        case 'letterology':
          return <Letterology />;
        case 'hidden-numerology':
          return <HiddenNumerology />;
        case 'database':
          return <Database />;
        default:
          return <NumerologyCalculator />;
      }
    } catch (error) {
      console.error('Error rendering view:', error, error.stack);
      return (
        <div className="text-white text-center p-8">
          <p className="text-red-400 mb-4">Error loading component: {error.message}</p>
          <button 
            onClick={() => {
              setActiveView('calculator');
              window.location.reload();
            }}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
          >
            Return to Calculator
          </button>
        </div>
      );
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
        
        <AnimatePresence mode="wait" initial={false}>
          {activeView && (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {renderActiveView()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Homage Text */}
      <div className="fixed bottom-[90px] sm:bottom-[55px] left-0 right-0 z-40 text-center text-white/60 py-0.5 px-2 text-[9px] sm:text-[10px]" style={{ textShadow: '0 0 6px rgba(138, 43, 226, 0.3)' }}>
        HOMAGE TO GARRY 33 FEET SNAKE
      </div>

      <FooterMenu 
        onMenuClick={handleMenuClick} 
        activeMenuId={
          activeView === 'calculator' ? 'calculator' :
          activeView === 'hours' ? 'friendly-enemy-hours' : 
          activeView === 'birthday' && personalBirthdayTrigger > 0 ? 'personal-birthday' :
          activeView === 'birthday' ? 'life-path-settings' : 
          activeView === 'letterology' ? 'letterology' :
          activeView === 'hidden-numerology' ? 'hidden-numerology' :
          activeView === 'database' ? 'database' :
          null
        }
        hideDatabase={!databaseUnlocked}
      />
    </div>
  )
}

export default App

