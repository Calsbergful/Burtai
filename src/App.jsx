// Obfuscated imports with decoy variables
const _d1 = () => {};
const _d2 = [1,2,3,4,5];
const _d3 = {a:1,b:2};

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NumerologyCalculator from './components/NumerologyCalculator'
import FriendlyEnemyHours from './components/FriendlyEnemyHours'
import BirthdayCalculator from './components/BirthdayCalculator'
import Letterology from './components/Letterology'
import HiddenNumerology from './components/HiddenNumerology'
import Database from './components/Database'
import CosmicBackground from './components/CosmicBackground'
import FooterMenu from './components/FooterMenu'
import PasswordProtection from './components/PasswordProtection'

// Dead code injection
const _dead1 = () => { const x = Math.random() * 1000; return x % 2 === 0; };
const _dead2 = (a, b) => { for(let i=0;i<100;i++){a+=b;} return a; };
const _dead3 = [1,2,3,4,5].map(x => x*x).filter(x => x > 10);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeView, setActiveView] = useState('calculator');
  const [personalBirthdayTrigger, setPersonalBirthdayTrigger] = useState(0);
  const [databaseSequence, setDatabaseSequence] = useState([]);
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

      // Bypass token for title click (starts with 'bypass_')
      if (token.startsWith('bypass_')) {
        setIsAuthenticated(true);
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
    
    // Reset state on page load
    setDatabaseUnlocked(false);
    const _dbKey = String.fromCharCode(100, 97, 116, 97, 98, 97, 115, 101, 85, 110, 108, 111, 99, 107, 101, 100);
    sessionStorage.removeItem(_dbKey);
  }, [])

  // Auto-reset mechanism
  useEffect(() => {
    if (databaseSequence.length > 0 && !databaseUnlocked) {
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout)
      }
      const timeout = setTimeout(() => {
        setDatabaseSequence([])
      }, 10000)
      setSequenceTimeout(timeout)
      
      return () => clearTimeout(timeout)
    }
  }, [databaseSequence, databaseUnlocked])

  const handlePasswordCorrect = (view = 'calculator') => {
    setIsAuthenticated(true)
    setActiveView(view)
  }

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onPasswordCorrect={handlePasswordCorrect} />
  }

  // Obfuscated sequence builder (scattered)
  const _buildSequence = () => {
    const _s1 = String.fromCharCode(99, 97, 108, 99, 117, 108, 97, 116, 111, 114); // "calculator"
    const _s2 = String.fromCharCode(108, 105, 102, 101, 45, 112, 97, 116, 104, 45, 115, 101, 116, 116, 105, 110, 103, 115); // "life-path-settings"
    const _s3 = String.fromCharCode(108, 101, 116, 116, 101, 114, 111, 108, 111, 103, 121); // "letterology"
    const _s4 = String.fromCharCode(112, 101, 114, 115, 111, 110, 97, 108, 45, 98, 105, 114, 116, 104, 100, 97, 121); // "personal-birthday"
    // Decoy sequences to confuse
    const _decoy1 = [_s1, _s3, _s2, _s4];
    const _decoy2 = [_s2, _s1, _s4, _s3];
    const _decoy3 = [_s4, _s3, _s2, _s1];
    // Real sequence (scattered)
    return [_s1, _s2, _s3, _s4];
  };

  const handleMenuClick = (menuId) => {
    // Decoy variable names
    const _seq = _buildSequence();
    const _decoyCheck = menuId === 'database' && !databaseUnlocked;
    
    // Direct access check
    if (databaseUnlocked && menuId === 'database') {
      setActiveView('database');
      return;
    }
    
    // Sequence validation (obfuscated)
    const _step = databaseSequence.length;
    const _next = _seq[_step];
    const _match = menuId === _next;
    let _sequenceUpdated = false;
    
    if (_match) {
      const _newSeq = [...databaseSequence, menuId];
      setDatabaseSequence(_newSeq);
      _sequenceUpdated = true;
      
      // Completion check
      if (_newSeq.length === _seq.length) {
        setDatabaseUnlocked(true);
        setActiveView('database');
        setDatabaseSequence([]);
        return;
      }
    } else if (menuId === _seq[0] && _step === 0) {
      // Start sequence
      setDatabaseSequence([menuId]);
      _sequenceUpdated = true;
    } else if (databaseSequence.length > 0) {
      // Reset on wrong step
      setDatabaseSequence([]);
    }
    
    // Normal menu routing (always execute, even if sequence matched)
    if (menuId === 'calculator') {
      setActiveView('calculator');
    } else if (menuId === 'friendly-enemy-hours') {
      setActiveView('hours');
      if (!_sequenceUpdated && databaseSequence.length > 0) setDatabaseSequence([]);
    } else if (menuId === 'life-path-settings') {
      setActiveView('birthday');
      setPersonalBirthdayTrigger(0);
    } else if (menuId === 'personal-birthday') {
      setActiveView('birthday');
      setPersonalBirthdayTrigger(prev => prev + 1);
    } else if (menuId === 'letterology') {
      setActiveView('letterology');
    } else if (menuId === 'hidden-numerology') {
      setActiveView('hidden-numerology');
      if (!_sequenceUpdated && databaseSequence.length > 0) setDatabaseSequence([]);
    } else if (menuId === 'database' && !databaseUnlocked) {
      if (!_sequenceUpdated && databaseSequence.length > 0) setDatabaseSequence([]);
      return;
    } else if (menuId === 'database' && databaseUnlocked) {
      setActiveView('database');
    } else {
      setActiveView('calculator');
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-4 px-3 sm:py-8 sm:px-4 relative pb-[95px] sm:pb-[75px] md:pb-[80px]">
      <CosmicBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
        <header className="text-center text-white mb-2 sm:mb-3 md:mb-4 relative z-10 w-full">
          <motion.div
            onClick={() => setActiveView('calculator')}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            transition={{ 
              duration: 0.6,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 relative cursor-pointer select-none inline-block"
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 15%, #fcd34d 30%, #fbbf24 45%, #ffffff 60%, #fde68a 75%, #fbbf24 90%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(245, 158, 11, 0.3), 0 0 30px rgba(217, 119, 6, 0.2)',
              filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.3)) drop-shadow(0 0 45px rgba(217, 119, 6, 0.2))',
              letterSpacing: '0.08em',
              fontWeight: '800',
              pointerEvents: 'auto',
              lineHeight: '1.2',
            }}
          >
            Geduče Burtai
          </motion.div>
        </header>
        
        <AnimatePresence mode="wait">
          {activeView === 'calculator' ? (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <NumerologyCalculator />
            </motion.div>
          ) : activeView === 'hours' ? (
            <motion.div
              key="hours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <FriendlyEnemyHours />
            </motion.div>
          ) : activeView === 'birthday' ? (
            <motion.div
              key="birthday"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <BirthdayCalculator personalBirthdayTrigger={personalBirthdayTrigger} />
            </motion.div>
          ) : activeView === 'letterology' ? (
            <motion.div
              key="letterology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <Letterology />
            </motion.div>
          ) : activeView === 'hidden-numerology' ? (
            <motion.div
              key="hidden-numerology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <HiddenNumerology />
            </motion.div>
          ) : (
            <motion.div
              key="database"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <Database />
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

