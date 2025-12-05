/**
 * Simple in-memory rate limiter for serverless functions
 * Note: This is per-function-instance. For production, consider using
 * Vercel Edge Middleware or an external service like Upstash Redis
 */

// In-memory store (cleared on function cold start)
const attempts = new Map();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, data] of attempts.entries()) {
      if (now - data.resetTime > 0) {
        attempts.delete(key);
      }
    }
    lastCleanup = now;
  }
}

/**
 * Rate limiter middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.maxAttempts - Maximum attempts allowed (default: 5)
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @returns {Function} Middleware function
 */
export function rateLimiter(options = {}) {
  const {
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000 // 15 minutes
  } = options;

  return (req, res) => {
    // Cleanup old entries
    cleanup();

    // Get client identifier (IP address)
    const clientId = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     req.headers['x-real-ip'] ||
                     req.connection?.remoteAddress ||
                     'unknown';

    const now = Date.now();
    const key = `rate_limit:${clientId}`;
    
    const attemptData = attempts.get(key);

    if (!attemptData) {
      // First attempt
      attempts.set(key, {
        count: 1,
        resetTime: now + windowMs,
        firstAttempt: now
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    // Check if window has expired
    if (now > attemptData.resetTime) {
      // Reset the counter
      attempts.set(key, {
        count: 1,
        resetTime: now + windowMs,
        firstAttempt: now
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    // Increment attempt count
    attemptData.count += 1;

    if (attemptData.count > maxAttempts) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((attemptData.resetTime - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        resetTime: attemptData.resetTime
      };
    }

    // Update the map
    attempts.set(key, attemptData);

    return {
      allowed: true,
      remaining: maxAttempts - attemptData.count,
      resetTime: attemptData.resetTime
    };
  };
}

/**
 * Clear rate limit for a specific client (e.g., on successful login)
 * @param {string} clientId - Client identifier (IP address)
 */
export function clearRateLimit(clientId) {
  const key = `rate_limit:${clientId}`;
  attempts.delete(key);
}

/**
 * Get client ID from request
 * @param {Object} req - Request object
 * @returns {string} Client identifier
 */
export function getClientId(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         'unknown';
}
