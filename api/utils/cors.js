/**
 * CORS helper - restricts origins to allowed domains
 */

export function setCORSHeaders(req, res) {
  // Get allowed origins from environment variable or use defaults
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ];

  // Get the origin from the request
  const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/');

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (process.env.VERCEL_ENV === 'development' || !process.env.VERCEL) {
    // Allow localhost in development
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // In production, only allow if origin matches
    // Default to first allowed origin or deny
    if (allowedOrigins.length > 0) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}
