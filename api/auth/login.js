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

    // Set CORS headers
    if (!origin) {
      // Same-origin request (no origin header) - allow it
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (allowedOrigins.includes(origin)) {
      // Origin is in allowed list
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      // Origin not allowed - reject by not setting the header
      // Browser will block the request
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

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
    const correctPassword = process.env.ADMIN_PASSWORD || 'dauns33';
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
    const inputPassword = password ? password.trim() : '';
    if (!inputPassword || inputPassword !== correctPassword) {
      return res.status(401).json({ 
        error: 'Invalid password',
        success: false 
      });
    }

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
