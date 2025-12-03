import { useState } from 'react'
import { motion } from 'framer-motion'
import CosmicBackground from './CosmicBackground'

function PasswordProtection({ onPasswordCorrect }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Encoded password (base64) - decoded at runtime
  const getCorrectPassword = () => {
    return atob('ZnJ1a3RhczMz')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === getCorrectPassword()) {
        // Store authentication in sessionStorage (clears when browser closes)
        // Use localStorage if you want it to persist across sessions
        sessionStorage.setItem('isAuthenticated', 'true')
        onPasswordCorrect()
      } else {
        setError('Neteisingas slaptažodis')
        setIsSubmitting(false)
        setPassword('')
      }
    }, 300)
  }

  return (
    <div className="min-h-screen gradient-bg py-4 px-3 sm:py-8 sm:px-4 relative flex items-center justify-center">
      <CosmicBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="bg-gradient-to-br from-purple-900/20 via-violet-900/15 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                textShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(245, 158, 11, 0.3)',
                  '0 0 15px rgba(251, 191, 36, 0.5), 0 0 30px rgba(245, 158, 11, 0.4)',
                  '0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(245, 158, 11, 0.3)',
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
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 15%, #fcd34d 30%, #fbbf24 45%, #ffffff 60%, #fde68a 75%, #fbbf24 90%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))',
                letterSpacing: '0.08em',
                fontWeight: '800',
              }}
            >
              Geduče Burtai
            </motion.h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Bandyk laimę"
                className="w-full px-4 py-3 rounded-lg bg-purple-900/15 backdrop-blur-sm border border-purple-400/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                autoFocus
                disabled={isSubmitting}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 text-center"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-400/80 to-yellow-600/80 hover:from-yellow-400 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-yellow-500/30"
            >
              {isSubmitting ? 'Tikrinama...' : 'Kas siunte, Kas busi?'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default PasswordProtection

