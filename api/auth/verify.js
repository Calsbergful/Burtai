import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';

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

