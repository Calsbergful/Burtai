import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
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

  const { token } = req.body;
  const jwtSecret = process.env.JWT_SECRET || 'd8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223';

  if (!token) {
    return res.status(401).json({ 
      authenticated: false,
      error: 'No token provided' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Check if token is still valid
    if (decoded.authenticated === true) {
      return res.status(200).json({
        authenticated: true,
        valid: true
      });
    } else {
      return res.status(401).json({
        authenticated: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
      error: 'Token verification failed'
    });
  }
}
