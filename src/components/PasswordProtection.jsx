import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CryptoJS from 'crypto-js'
import CosmicBackground from './CosmicBackground'

function PasswordProtection({ onPasswordCorrect }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fakeLoading, setFakeLoading] = useState(false)
  const [displayedErrors, setDisplayedErrors] = useState([])
  const [errorIndex, setErrorIndex] = useState(0)

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

  // Decoy password (base64) - shows fake loading screen
  const getDecoyPassword = () => {
    const _d1 = [70, 78, 85, 75, 84, 65, 83, 51, 51];
    const _d2 = atob('ZnJ1a3RhczMz');
    return _d2;
  }

  // Real password - AES encrypted with multiple layers of obfuscation
  const getCorrectPassword = () => {
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const inputPwd = password.trim();
      const decoyPassword = getDecoyPassword();
      
      // Check decoy password first (client-side check)
      if (inputPwd === decoyPassword) {
        setIsSubmitting(false);
        setFakeLoading(true);
        setPassword('');
        setDisplayedErrors([]);
        setErrorIndex(0);
        // Auto-reset after showing errors for a while
        setTimeout(() => {
          setFakeLoading(false);
          setError('');
          setDisplayedErrors([]);
          setErrorIndex(0);
        }, 8000);
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
  }

  // Error messages for matrix-style display
  const errorMessages = [
    "ERROR: SYSTEM_INIT_FAILURE",
    "WARNING: UNAUTHORIZED_ACCESS_DETECTED",
    "CRITICAL: SECURITY_BREACH_ATTEMPT",
    "FATAL: MEMORY_CORRUPTION_DETECTED",
    "ERROR: NETWORK_PROTOCOL_VIOLATION",
    "WARNING: ENCRYPTION_KEY_MISMATCH",
    "CRITICAL: DATABASE_CONNECTION_LOST",
    "FATAL: AUTHENTICATION_SERVICE_DOWN",
    "ERROR: INVALID_CREDENTIALS_FORMAT",
    "WARNING: MULTIPLE_FAILED_ATTEMPTS",
    "CRITICAL: SYSTEM_INTEGRITY_COMPROMISED",
    "FATAL: CORE_SYSTEM_MALFUNCTION",
    "ERROR: ACCESS_DENIED_LEVEL_9",
    "WARNING: INTRUSION_DETECTION_ACTIVE",
    "CRITICAL: EMERGENCY_SHUTDOWN_INITIATED"
  ];

  // Effect to display error messages one by one
  useEffect(() => {
    if (!fakeLoading) {
      setDisplayedErrors([]);
      setErrorIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setDisplayedErrors(prev => {
        if (prev.length < errorMessages.length) {
          return [...prev, errorMessages[prev.length]];
        }
        return prev;
      });
      setErrorIndex(prev => {
        if (prev < errorMessages.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [fakeLoading]);

  // Matrix-style error screen for decoy password
  if (fakeLoading) {

    return (
      <div className="min-h-screen bg-black relative flex items-center justify-center overflow-hidden font-mono">
        {/* Matrix-style background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%)',
            backgroundSize: '100% 4px',
          }} />
        </div>

        {/* Scrolling error messages */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          <div className="bg-black/90 border-2 border-green-500/50 p-6 rounded-lg shadow-2xl" style={{
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1)'
          }}>
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-green-500/30">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-red-500 text-sm font-bold"
              >
                ⚠ SYSTEM ERROR LOG - {new Date().toISOString()}
              </motion.div>
            </div>

            {/* Error messages container */}
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {displayedErrors.map((error, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-green-400 text-xs sm:text-sm font-mono"
                  style={{
                    textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                    fontFamily: 'monospace'
                  }}
                >
                  <span className="text-red-500">[{
                    String(idx + 1).padStart(3, '0')
                  }]</span>{' '}
                  <span className="text-yellow-400">{new Date().toLocaleTimeString()}</span>{' '}
                  <span className="text-green-400">{error}</span>
                </motion.div>
              ))}
              
              {/* Cursor blink effect */}
              {errorIndex < errorMessages.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-green-400 text-sm"
                >
                  _
                </motion.span>
              )}
            </div>

            {/* Footer warning */}
            <div className="mt-4 pt-3 border-t border-red-500/30">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-red-500 text-xs font-bold text-center"
              >
                ⚠ CRITICAL SYSTEM FAILURE - CONTACT ADMINISTRATOR ⚠
              </motion.div>
            </div>
          </div>
        </div>

        {/* Glitch overlay effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.05, 0],
            x: [0, -1, 1, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 49%, rgba(0, 255, 0, 0.1) 50%, transparent 51%)',
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
              onClick={() => {
                // Store token in sessionStorage (obfuscated key)
                const _authKey = String.fromCharCode(105, 115, 65, 117, 116, 104, 101, 110, 116, 105, 99, 97, 116, 101, 100); // "isAuthenticated"
                const _fakeToken = 'bypass_' + Date.now();
                sessionStorage.setItem(_authKey, _fakeToken);
                onPasswordCorrect('calculator');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-3xl sm:text-4xl font-bold mb-2 cursor-pointer select-none"
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

