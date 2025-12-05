import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
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
