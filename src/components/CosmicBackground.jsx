import { motion } from 'framer-motion'
import { useMemo, memo } from 'react'

const CosmicBackground = memo(function CosmicBackground() {
  // Generate random positions for cosmic elements - memoized to prevent regeneration
  const floatingParticles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5,
  })), [])

  const glowingOrbs = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 30 + Math.random() * 50,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: i % 3 === 0 ? 'rgba(138, 43, 226, 0.3)' : i % 3 === 1 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(147, 51, 234, 0.3)',
    duration: 15 + Math.random() * 10,
  })), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      {/* Floating Particles */}
      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: 'rgba(255, 255, 255, 0.6)',
            boxShadow: '0 0 6px rgba(138, 43, 226, 0.8)',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(particle.id) * 20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Glowing Orbs */}
      {glowingOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-xl"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            background: orb.color,
            boxShadow: `0 0 ${orb.size}px ${orb.color}`,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
          animate={{
            x: [0, Math.sin(orb.id) * 30, 0],
            y: [0, Math.cos(orb.id) * 30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.id * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {useMemo(() => Array.from({ length: 10 }, (_, i) => {
          const x1 = Math.random() * 100
          const y1 = Math.random() * 100
          const x2 = x1 + (Math.random() - 0.5) * 20
          const y2 = y1 + (Math.random() - 0.5) * 20
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(138, 43, 226, 0.3)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )
        }), [])}
      </svg>

      {/* Large Distant Stars */}
      {useMemo(() => Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`big-star-${i}`}
          className="absolute rounded-full"
          style={{
            width: '4px',
            height: '4px',
            left: `${10 + (i * 7)}%`,
            top: `${15 + (i % 4) * 20}%`,
            background: 'white',
            boxShadow: '0 0 10px rgba(138, 43, 226, 0.8), 0 0 20px rgba(99, 102, 241, 0.6)',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )), [])}
    </div>
  )
})

export default CosmicBackground

