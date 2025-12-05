import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    // Set CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
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

    const { password } = req.body || {};

    // Get password from environment variable
    const correctPassword = process.env.ADMIN_PASSWORD || 'dauns33';
    const jwtSecret = process.env.JWT_SECRET || 'd8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223';

    // Validate password (trim to handle whitespace)
    const inputPassword = password ? password.trim() : '';
    if (!inputPassword || inputPassword !== correctPassword) {
      return res.status(401).json({ 
        error: 'Invalid password',
        success: false 
      });
    }

  // Generate JWT token
  const token = jwt.sign(
    { 
      authenticated: true,
      timestamp: Date.now(),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
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
    // Error handling
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Server error',
      success: false,
      message: error.message
    });
  }
}
