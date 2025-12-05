import { useState, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import CryptoJS from 'crypto-js'
import CosmicBackground from './CosmicBackground'

const PasswordProtection = memo(function PasswordProtection({ onPasswordCorrect }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fakeLoading, setFakeLoading] = useState(false)

  // Advanced AES encryption with multiple layers and key derivation
  const _deriveKey = (baseKey, salt) => {
    // PBKDF2-like key derivation (simplified, obfuscated)
    const _k1 = CryptoJS.SHA256(baseKey + salt).toString();
    const _k2 = CryptoJS.SHA256(salt + baseKey).toString();
    return CryptoJS.SHA256(_k1 + _k2).toString().substring(0, 32);
  };

  const _encryptAES = (text, key, salt) => {
    const _derivedKey = _deriveKey(key, salt);
    const _encrypted = CryptoJS.AES.encrypt(text, _derivedKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(salt.substring(0, 16))
    });
    return _encrypted.toString();
  };

  const _decryptAES = (encrypted, key, salt) => {
    try {
      const _derivedKey = _deriveKey(key, salt);
      const _decrypted = CryptoJS.AES.decrypt(encrypted, _derivedKey, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.enc.Utf8.parse(salt.substring(0, 16))
      });
      return _decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return '';
    }
  };

  // Decoy password (base64) - shows fake loading screen - memoized
  const getDecoyPassword = useMemo(() => {
    const _d1 = [70, 78, 85, 75, 84, 65, 83, 51, 51];
    const _d2 = atob('ZnJ1a3RhczMz');
    return _d2;
  }, []);

  // Real password - AES encrypted with multiple layers of obfuscation - memoized
  const getCorrectPassword = useMemo(() => {
    // Encryption key (scattered and obfuscated)
    const _keyParts = [107, 101, 121, 51, 51]; // "key33" in char codes
    const _key = String.fromCharCode(..._keyParts);
    
    // Salt (obfuscated) - split across multiple parts
    const _saltParts1 = [115, 97, 108, 116]; // "salt"
    const _saltParts2 = [51, 51, 120, 48]; // "33x0"
    const _saltParts3 = [98, 102, 117, 115, 99, 52, 116, 51]; // "bfusc4t3"
    const _salt = String.fromCharCode(..._saltParts1) + 
                  String.fromCharCode(..._saltParts2) + 
                  String.fromCharCode(..._saltParts3);
    
    // AES encrypted password (not visible as plain text)
    // Encrypted with AES-256-CBC using key derivation
    const _encrypted = 'U2FsdGVkX1/yOYtSqt527po9Niki0GAY3MN2iEkS0XM=';
    
    // Decoy encrypted strings to confuse reverse engineers
    const _decoy1 = 'U2FsdGVkX1+test1234567890abcdefghijklmnop=';
    const _decoy2 = 'U2FsdGVkX1+fakePasswordEncryptedStringHere=';
    const _decoy3 = 'U2FsdGVkX1+anotherDecoyEncryptedValue1234=';
    
    // Decoy calculations (unused but look important)
    const _decoySum = _decoy1.length + _decoy2.length + _decoy3.length;
    const _decoyHash = CryptoJS.SHA256(_decoy1 + _decoy2).toString();
    const _decoyMod = _decoySum % 1000;
    
    // Decrypt the real password using AES
    const _decrypted = _decryptAES(_encrypted, _key, _salt);
    
    // More obfuscation - verify it's correct through multiple checks
    const _verify1 = _decrypted && _decrypted.length === 7;
    const _verify2 = _decrypted && _decrypted.charCodeAt(0) === 100; // 'd'
    const _verify3 = _decrypted && _decrypted.charCodeAt(6) === 51; // '3'
    const _verify4 = _decrypted && _decrypted.includes('33');
    
    // Return decrypted password only if all verifications pass
    return (_verify1 && _verify2 && _verify3 && _verify4) ? _decrypted : '';
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const inputPwd = password.trim();
      const decoyPassword = getDecoyPassword;
      
      // Check decoy password first (client-side check)
      if (inputPwd === decoyPassword) {
        setIsSubmitting(false);
        setFakeLoading(true);
        setPassword('');
        return;
      }

      // Send password to server for validation
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: inputPwd }),
      });

      // Check if response is ok
      if (!response.ok) {
        // Try to get error message
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        setError(errorData.error || 'Neteisingas slaptažodis');
        setIsSubmitting(false);
        setPassword('');
        return;
      }

      const data = await response.json();

      if (data.success && data.token) {
        // Store token in sessionStorage (obfuscated key)
        const _authKey = String.fromCharCode(105, 115, 65, 117, 116, 104, 101, 110, 116, 105, 99, 97, 116, 101, 100); // "isAuthenticated"
        sessionStorage.setItem(_authKey, data.token);
        onPasswordCorrect();
      } else {
        setError(data.error || 'Neteisingas slaptažodis');
        setIsSubmitting(false);
        setPassword('');
      }
    } catch (error) {
      // Better error handling - check if it's a network error
      console.error('Login error:', error);
      if (error.message && error.message.includes('Failed to fetch')) {
        setError('Nepavyko prisijungti prie serverio. Naudokite "vercel dev" vietoj "npm run dev".');
      } else {
        setError('Klaida prisijungiant. Bandykite dar kartą.');
      }
      setIsSubmitting(false);
      setPassword('');
    }
  }, [onPasswordCorrect]);

  // Fake loading screen for decoy password - scary glitching ghost animations
  if (fakeLoading) {
    return (
      <div className="min-h-screen gradient-bg relative flex items-center justify-center overflow-hidden">
        <CosmicBackground />
        
        {/* Binary orbit system for 8 and 2 - they orbit around each other AND around the main circle */}
        {(() => {
          const eightIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].indexOf(8);
          const twoIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].indexOf(2);
          const angleStep = (360 / 12) * (Math.PI / 180);
          const baseRadius = 200;
          
          // Main orbit angles for 8 and 2 (they still orbit the main circle)
          const eightMainAngle = eightIndex * angleStep;
          const twoMainAngle = twoIndex * angleStep;
          
          const binaryOrbitRadius = 35; // How far 8 and 2 orbit from each other
          const binaryOrbitSpeed = 2.5; // Fast orbit around each other
          const mainOrbitSpeed = 9; // Orbit speed around main circle (synchronized)
          
          return (
            <>
              {/* Number 8 - combines main orbit + binary orbit */}
              <motion.div
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center center',
                  zIndex: 20,
                }}
                animate={{
                  // Main orbit around center + binary orbit around each other
                  x: [
                    Math.cos(eightMainAngle) * baseRadius + Math.cos(0) * binaryOrbitRadius,
                    Math.cos(eightMainAngle + Math.PI * 2) * baseRadius + Math.cos(Math.PI * 2) * binaryOrbitRadius,
                  ],
                  y: [
                    Math.sin(eightMainAngle) * baseRadius + Math.sin(0) * binaryOrbitRadius,
                    Math.sin(eightMainAngle + Math.PI * 2) * baseRadius + Math.sin(Math.PI * 2) * binaryOrbitRadius,
                  ],
                  rotate: [0, 360],
                  opacity: [0.8, 1, 0.9, 1, 0.7, 0.95, 0.8],
                  scale: [1.2, 1.6, 1.1, 1.5, 1, 1.4, 1.2],
                }}
                transition={{
                  x: {
                    duration: mainOrbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  y: {
                    duration: mainOrbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  rotate: {
                    duration: binaryOrbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    textShadow: [
                      '0 0 15px rgba(255, 100, 255, 0.9), 0 0 30px rgba(255, 100, 255, 0.7)',
                      '0 0 25px rgba(255, 100, 255, 1), 0 0 50px rgba(255, 100, 255, 0.8), 0 0 75px rgba(255, 100, 255, 0.6)',
                      '0 0 15px rgba(255, 100, 255, 0.9), 0 0 30px rgba(255, 100, 255, 0.7)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: 'rgba(255, 150, 255, 0.95)',
                    fontFamily: 'monospace',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  8
                </motion.div>
              </motion.div>
              
              {/* Number 2 - combines main orbit + binary orbit (opposite side) */}
              <motion.div
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center center',
                  zIndex: 20,
                }}
                animate={{
                  // Main orbit around center + binary orbit (opposite phase from 8)
                  x: [
                    Math.cos(twoMainAngle) * baseRadius + Math.cos(Math.PI) * binaryOrbitRadius,
                    Math.cos(twoMainAngle + Math.PI * 2) * baseRadius + Math.cos(Math.PI + Math.PI * 2) * binaryOrbitRadius,
                  ],
                  y: [
                    Math.sin(twoMainAngle) * baseRadius + Math.sin(Math.PI) * binaryOrbitRadius,
                    Math.sin(twoMainAngle + Math.PI * 2) * baseRadius + Math.sin(Math.PI + Math.PI * 2) * binaryOrbitRadius,
                  ],
                  rotate: [0, -360],
                  opacity: [0.8, 1, 0.9, 1, 0.7, 0.95, 0.8],
                  scale: [1.2, 1.6, 1.1, 1.5, 1, 1.4, 1.2],
                }}
                transition={{
                  x: {
                    duration: mainOrbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  y: {
                    duration: mainOrbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  rotate: {
                    duration: binaryOrbitSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    textShadow: [
                      '0 0 15px rgba(255, 100, 255, 0.9), 0 0 30px rgba(255, 100, 255, 0.7)',
                      '0 0 25px rgba(255, 100, 255, 1), 0 0 50px rgba(255, 100, 255, 0.8), 0 0 75px rgba(255, 100, 255, 0.6)',
                      '0 0 15px rgba(255, 100, 255, 0.9), 0 0 30px rgba(255, 100, 255, 0.7)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: 'rgba(255, 150, 255, 0.95)',
                    fontFamily: 'monospace',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  2
                </motion.div>
              </motion.div>
            </>
          );
        })()}
        
        {/* Other numbers 1-9 and master numbers (11, 22, 33) orbiting around the circle */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((num, i) => {
          // Skip 8 and 2 as they have their own binary orbit
          if (num === 8 || num === 2) return null;
          
          // Calculate circular orbit positions
          const totalNumbers = 12;
          const angleStep = (360 / totalNumbers) * (Math.PI / 180);
          const baseRadius = 200;
          const radiusVariation = 50;
          
          // Each number starts at a different angle
          const startAngle = i * angleStep;
          
          // Master numbers get special styling
          const isMaster = [11, 22, 33].includes(num);
          const baseSize = isMaster ? 48 : 36;
          const glowColor = isMaster ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 0, 0, 0.6)';
          const orbitRadius = baseRadius + (isMaster ? radiusVariation : 0);
          const orbitSpeed = isMaster ? 8 : 10 + i * 0.5;
          
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: 'center center',
                zIndex: 10,
              }}
              animate={{
                x: [
                  Math.cos(startAngle) * orbitRadius,
                  Math.cos(startAngle + Math.PI * 2) * orbitRadius,
                ],
                y: [
                  Math.sin(startAngle) * orbitRadius,
                  Math.sin(startAngle + Math.PI * 2) * orbitRadius,
                ],
                opacity: [0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 0.4],
                scale: [1, 1.3, 0.9, 1.2, 0.8, 1.1, 1],
                rotate: [0, 360],
                filter: [
                  'blur(1px) brightness(1)',
                  'blur(3px) brightness(1.4)',
                  'blur(0.5px) brightness(0.9)',
                  'blur(2px) brightness(1.2)',
                  'blur(1px) brightness(1)',
                ],
              }}
              transition={{
                x: {
                  duration: orbitSpeed,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  duration: orbitSpeed,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: 2 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 3 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                },
                filter: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <motion.div
                className="relative"
                animate={{
                  textShadow: [
                    `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
                    `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`,
                    `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  fontSize: `${baseSize}px`,
                  fontWeight: 'bold',
                  color: isMaster ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.8)',
                  fontFamily: 'monospace',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {num}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Main loading circle with glitch effect */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [1, 0.8, 1, 0.9, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1, 0.9, 1],
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative"
          >
            {/* Outer glowing ring */}
            <motion.div
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 border-4 border-red-500/50 rounded-full"
              style={{
                boxShadow: '0 0 30px rgba(255, 0, 0, 0.5), 0 0 60px rgba(255, 0, 0, 0.3)',
              }}
            />
            
            {/* Main spinning circle */}
            <motion.div
              animate={{ 
                rotate: 360,
                borderColor: [
                  'rgba(255, 0, 0, 0.5)',
                  'rgba(255, 100, 0, 0.7)',
                  'rgba(255, 0, 100, 0.5)',
                  'rgba(200, 0, 255, 0.7)',
                  'rgba(255, 0, 0, 0.5)',
                ],
              }}
              transition={{ 
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-t-red-500 rounded-full relative"
              style={{
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.6), inset 0 0 20px rgba(255, 0, 0, 0.2)',
              }}
            />
            
            {/* Inner pulsing dot */}
            <motion.div
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"
              style={{
                boxShadow: '0 0 15px rgba(255, 0, 0, 0.8)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Glitch overlay effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.1, 0, 0.15, 0],
            x: [0, -2, 2, -1, 1, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 48%, rgba(255, 0, 0, 0.1) 49%, rgba(255, 0, 0, 0.1) 51%, transparent 52%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>
    );
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
})

export default PasswordProtection

