import fs from 'fs';
import path from 'path';
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
  ].filter(Boolean);

  // Set CORS headers
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from query parameter
    const token = req.query.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify token with the same logic as verify.js
    const jwtSecret = process.env.JWT_SECRET || 'd8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223';
    
    // Allow bypass tokens (for title click) or verify JWT
    if (!token.startsWith('bypass_')) {
      try {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.authenticated !== true) {
          return res.status(401).json({ error: 'Invalid token' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // Read the image file from assets folder (not public, so it's not directly accessible)
    const imagePath = path.join(process.cwd(), 'assets', 'Screenshot_2025-12-06_at_6.23.37_PM-a2e033fa-ea9f-46a4-921f-039a32f6eb88.png');
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Read and serve the image
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the image
    return res.status(200).send(imageBuffer);
    
  } catch (error) {
    console.error('Error serving image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
