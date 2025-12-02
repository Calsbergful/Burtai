import { motion } from 'framer-motion'
import NumerologyCalculator from './components/NumerologyCalculator'
import CosmicBackground from './components/CosmicBackground'
import FooterMenu from './components/FooterMenu'

function App() {
  return (
    <div className="min-h-screen gradient-bg py-4 px-3 sm:py-8 sm:px-4 relative">
      <CosmicBackground />
      <header className="text-center text-white mb-6 sm:mb-12 relative z-10">
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

      <main className="relative z-10">
        <NumerologyCalculator />
      </main>

      <FooterMenu onMenuClick={(menuId) => {
        console.log('Paspaustas meniu:', menuId);
        // Handle menu navigation here
      }} />
    </div>
  )
}

export default App

