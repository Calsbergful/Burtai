import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  // Get password from environment variable
  const correctPassword = process.env.ADMIN_PASSWORD || 'dauns33';
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';

  // Debug logging (remove in production if needed)
  // console.log('Login attempt:', { hasPassword: !!password, envPassword: !!correctPassword });

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
}

