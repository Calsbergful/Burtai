import jwt from 'jsonwebtoken';
import { setCORSHeaders } from '../utils/cors.js';
import { rateLimiter, clearRateLimit, getClientId } from '../utils/rateLimiter.js';

export default async function handler(req, res) {
  try {
    // Set secure CORS headers
    setCORSHeaders(req, res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting - prevent brute force attacks
    const rateLimit = rateLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 }); // 5 attempts per 15 minutes
    const rateLimitResult = rateLimit(req, res);
    
    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.retryAfter);
      return res.status(429).json({
        error: 'Too many requests',
        success: false,
        message: 'Too many login attempts. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      });
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
      // Add rate limit headers even on failed attempts
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
      
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

    // Clear rate limit on successful login
    const clientId = getClientId(req);
    clearRateLimit(clientId);
    
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
    
    // Only show detailed errors in development
    const isDevelopment = process.env.VERCEL_ENV === 'development' || 
                          (!process.env.VERCEL && process.env.NODE_ENV === 'development');
    
    // Check if it's a JWT-related error
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(500).json({
        error: 'JWT token error',
        success: false,
        message: isDevelopment ? error.message : 'Token generation failed',
        details: isDevelopment ? 'Token generation failed' : undefined
      });
    }
    
    // Check if it's a module import error
    if (error.message && error.message.includes('Cannot find module')) {
      return res.status(500).json({
        error: 'Module import error',
        success: false,
        message: isDevelopment ? error.message : 'Server configuration error',
        details: isDevelopment ? 'jsonwebtoken package may not be installed' : undefined
      });
    }
    
    return res.status(500).json({
      error: 'Server error',
      success: false,
      message: isDevelopment ? error.message : 'An error occurred. Please try again later.',
      // Never expose stack traces in production
      details: isDevelopment ? error.stack : undefined
    });
  }
}
