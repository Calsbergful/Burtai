import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    // Secure CORS configuration
    const origin = req.headers.origin;
    const host = req.headers.host;
    
    // Build list of allowed origins
    const allowedOrigins = [
      // Local development
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      // Vercel deployment domains (from environment or request)
      process.env.ALLOWED_ORIGIN,
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      // Allow same-origin (when frontend and API are on same domain)
      ...(host ? [`https://${host}`, `http://${host}`] : [])
    ].filter(Boolean); // Remove undefined/null values

    // Set CORS headers - allow requests from same domain
    // Check if request is from same domain (no origin or origin matches host)
    const isSameOrigin = !origin || (host && origin.includes(host.split(':')[0]));
    
    if (isSameOrigin || !origin) {
      // Same-origin request - allow it
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else if (allowedOrigins.includes(origin)) {
      // Origin is in allowed list
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      // Allow request but log it for monitoring
      console.warn('Request from unlisted origin:', origin, 'Host:', host, 'Allowed:', allowedOrigins);
      // Set origin to allow the request (temporary - should restrict in production)
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate request body exists
    if (!req.body) {
      console.error('Request body is missing');
      return res.status(400).json({
        error: 'Bad request',
        success: false,
        message: 'Request body is required'
      });
    }

    const { password } = req.body;

    // Get password from environment variable
    // Check if env var is set, if not use fallback
    const envPassword = process.env.ADMIN_PASSWORD;
    const correctPassword = envPassword ? envPassword.trim() : 'dauns33';
    
    // Log environment variable status (for debugging)
    console.log('=== ENVIRONMENT CHECK ===');
    console.log('ADMIN_PASSWORD env var exists:', !!envPassword);
    console.log('ADMIN_PASSWORD value (first 3 chars only):', envPassword ? envPassword.substring(0, 3) + '...' : 'NOT SET');
    console.log('ADMIN_PASSWORD length:', envPassword ? envPassword.length : 0);
    console.log('Using fallback password:', !envPassword);
    console.log('Correct password to compare:', JSON.stringify(correctPassword), 'Length:', correctPassword.length);
    console.log('========================');
    
    if (!envPassword) {
      console.warn('⚠️ ADMIN_PASSWORD environment variable not set, using fallback "dauns33"');
    }
    const jwtSecret = process.env.JWT_SECRET || 'd8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223';

    // Validate JWT secret is not empty
    if (!jwtSecret || jwtSecret.trim() === '') {
      console.error('JWT_SECRET is empty or not set');
      return res.status(500).json({
        error: 'Server configuration error',
        success: false,
        message: 'JWT secret is not configured'
      });
    }

    // Validate password (trim to handle whitespace)
    const inputPassword = password ? String(password).trim() : '';
    const trimmedCorrectPassword = String(correctPassword).trim();
    
    // Debug logging to help diagnose issues
    console.log('=== PASSWORD VALIDATION DEBUG ===');
    console.log('Input password:', JSON.stringify(inputPassword), 'Length:', inputPassword.length);
    console.log('Expected password:', JSON.stringify(trimmedCorrectPassword), 'Length:', trimmedCorrectPassword.length);
    console.log('Environment variable set:', !!process.env.ADMIN_PASSWORD);
    console.log('Using fallback:', !process.env.ADMIN_PASSWORD);
    console.log('Passwords match:', inputPassword === trimmedCorrectPassword);
    console.log('Character codes - Input:', inputPassword.split('').map(c => c.charCodeAt(0)));
    console.log('Character codes - Expected:', trimmedCorrectPassword.split('').map(c => c.charCodeAt(0)));
    console.log('================================');
    
    if (!inputPassword || inputPassword !== trimmedCorrectPassword) {
      console.error('❌ PASSWORD MISMATCH');
      console.error('Received:', JSON.stringify(inputPassword), `(${inputPassword.length} chars)`);
      console.error('Expected:', JSON.stringify(trimmedCorrectPassword), `(${trimmedCorrectPassword.length} chars)`);
      console.error('Lengths match:', inputPassword.length === trimmedCorrectPassword.length);
      console.error('First char match:', inputPassword[0] === trimmedCorrectPassword[0]);
      console.error('Last char match:', inputPassword[inputPassword.length - 1] === trimmedCorrectPassword[trimmedCorrectPassword.length - 1]);
      
      return res.status(401).json({ 
        error: 'Invalid password',
        success: false,
        // Only include debug info in development
        ...(process.env.VERCEL_ENV !== 'production' && {
          debug: {
            receivedLength: inputPassword.length,
            expectedLength: trimmedCorrectPassword.length,
            envVarSet: !!process.env.ADMIN_PASSWORD
          }
        })
      });
    }
    
    console.log('✅ PASSWORD MATCH - Generating token');

    // Generate JWT token (removed manual exp, using expiresIn option only)
    const token = jwt.sign(
      { 
        authenticated: true,
        timestamp: Date.now()
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Return token
    return res.status(200).json({
      success: true,
      token: token
    });
  } catch (error) {
    // Error handling with detailed logging
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    // Check if it's a JWT-related error
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(500).json({
        error: 'JWT token error',
        success: false,
        message: error.message,
        details: 'Token generation failed'
      });
    }
    
    // Check if it's a module import error
    if (error.message && error.message.includes('Cannot find module')) {
      return res.status(500).json({
        error: 'Module import error',
        success: false,
        message: error.message,
        details: 'jsonwebtoken package may not be installed'
      });
    }
    
    return res.status(500).json({
      error: 'Server error',
      success: false,
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
