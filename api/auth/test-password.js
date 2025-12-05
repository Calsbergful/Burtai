// Temporary test endpoint to verify password configuration
// DELETE THIS FILE AFTER DEBUGGING FOR SECURITY

export default async function handler(req, res) {
  // Only allow in development or with special header
  if (process.env.VERCEL_ENV === 'production' && req.headers['x-debug'] !== 'true') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const envPassword = process.env.ADMIN_PASSWORD;
    const correctPassword = envPassword ? envPassword.trim() : 'dauns33';
    
    // Return info about password configuration (without revealing actual password)
    return res.status(200).json({
      envVarSet: !!envPassword,
      passwordLength: correctPassword.length,
      firstChar: correctPassword[0],
      lastChar: correctPassword[correctPassword.length - 1],
      usingFallback: !envPassword,
      // Only show first and last char for verification
      hint: `Password starts with "${correctPassword[0]}" and ends with "${correctPassword[correctPassword.length - 1]}"`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
