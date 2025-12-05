# Option 2: Server-Side Authentication Implementation Guide

## Overview

This guide will help you implement true server-side authentication using Vercel Serverless Functions. This will make your authentication **unbypassable** from the client side.

---

## What You'll Need

### 1. **Dependencies**
- `jsonwebtoken` - For JWT token generation
- `bcryptjs` - For password hashing (optional, but recommended)

### 2. **Vercel Account**
- Free tier supports serverless functions
- No additional cost for basic usage

### 3. **Environment Variables**
- `JWT_SECRET` - Secret key for signing tokens
- `ADMIN_PASSWORD` - Your password (hashed or plain, depending on approach)

---

## Step-by-Step Implementation

### Step 1: Install Dependencies

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken  # If using TypeScript
```

---

### Step 2: Create Vercel API Directory Structure

Create the following directory structure:
```
/api
  /auth
    login.js
    verify.js
```

---

### Step 3: Create Login API Endpoint

**File: `/api/auth/login.js`**

```javascript
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

  // Validate password
  if (!password || password !== correctPassword) {
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
```

---

### Step 4: Create Verify API Endpoint

**File: `/api/auth/verify.js`**

```javascript
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
```

---

### Step 5: Update Client-Side Password Protection

**Update: `/src/components/PasswordProtection.jsx`**

Replace the `handleSubmit` function:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setIsSubmitting(true)

  try {
    const inputPwd = password.trim();
    const decoyPassword = getDecoyPassword();
    
    // Check decoy password first
    if (inputPwd === decoyPassword) {
      setIsSubmitting(false);
      setFakeLoading(true);
      setPassword('');
      return;
    }

    // Send password to server for validation
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: inputPwd }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      // Store token in sessionStorage
      const _authKey = String.fromCharCode(105, 115, 65, 117, 116, 104, 101, 110, 116, 105, 99, 97, 116, 101, 100);
      sessionStorage.setItem(_authKey, data.token);
      onPasswordCorrect();
    } else {
      setError('Neteisingas slaptažodis');
      setIsSubmitting(false);
      setPassword('');
    }
  } catch (error) {
    setError('Klaida prisijungiant. Bandykite dar kartą.');
    setIsSubmitting(false);
    setPassword('');
  }
}
```

---

### Step 6: Update App.jsx to Verify Token

**Update: `/src/App.jsx`**

Add token verification on page load:

```javascript
useEffect(() => {
  const verifyAuth = async () => {
    const _authKey = String.fromCharCode(105, 115, 65, 117, 116, 104, 101, 110, 116, 105, 99, 97, 116, 101, 100);
    const token = sessionStorage.getItem(_authKey);
    
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      // Verify token with server
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem(_authKey);
        setIsAuthenticated(false);
      }
    } catch (error) {
      sessionStorage.removeItem(_authKey);
      setIsAuthenticated(false);
    }
  };

  verifyAuth();
  
  // Database is always hidden on page load/reload
  setDatabaseUnlocked(false);
  const _dbKey = String.fromCharCode(100, 97, 116, 97, 98, 97, 115, 101, 85, 110, 108, 111, 99, 107, 101, 100);
  sessionStorage.removeItem(_dbKey);
}, [])
```

---

### Step 7: Set Environment Variables

**Create: `/.env.local`** (for local development)

```env
JWT_SECRET=your-super-secret-key-change-this-to-something-random-and-long
ADMIN_PASSWORD=dauns33
```

**In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `JWT_SECRET` = (generate a long random string)
   - `ADMIN_PASSWORD` = `dauns33`

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### Step 8: Update .gitignore

Make sure `.env.local` is in `.gitignore`:

```
.env.local
.env
*.local
```

---

## File Structure After Implementation

```
Burtai/
├── api/
│   └── auth/
│       ├── login.js
│       └── verify.js
├── src/
│   ├── components/
│   │   └── PasswordProtection.jsx (updated)
│   └── App.jsx (updated)
├── .env.local (not in git)
├── .gitignore
└── package.json
```

---

## Testing

### 1. **Test Locally:**
```bash
npm run dev
```

### 2. **Test Login:**
- Enter correct password → Should authenticate
- Enter wrong password → Should show error
- Enter decoy password → Should show fake loading

### 3. **Test Token Verification:**
- Reload page → Should stay authenticated if token valid
- Modify token in sessionStorage → Should require re-authentication

---

## Security Improvements

### ✅ **What This Achieves:**

1. **True Server-Side Validation:**
   - Password checked on server
   - Can't be bypassed client-side
   - Token must be valid

2. **JWT Token Security:**
   - Tokens expire (24 hours)
   - Signed with secret key
   - Can't be forged without secret

3. **No Client-Side Bypass:**
   - Setting `sessionStorage` won't work
   - Token must be valid and verified
   - Server validates every time

### ⚠️ **Remaining Considerations:**

1. **Token Storage:**
   - Still in `sessionStorage` (can be stolen if XSS)
   - Consider `httpOnly` cookies (more complex)

2. **Rate Limiting:**
   - Add rate limiting to prevent brute force
   - Vercel has built-in rate limiting

3. **HTTPS:**
   - Vercel provides HTTPS by default ✅

---

## Optional Enhancements

### 1. **Add Rate Limiting**

**File: `/api/auth/login.js`** (add at top)

```javascript
// Simple rate limiting (in-memory)
const attempts = new Map();

export default async function handler(req, res) {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  
  // Check rate limit (5 attempts per 15 minutes)
  if (attempts.has(clientIp)) {
    const { count, resetTime } = attempts.get(clientIp);
    if (now < resetTime) {
      if (count >= 5) {
        return res.status(429).json({ 
          error: 'Too many attempts. Please try again later.' 
        });
      }
      attempts.set(clientIp, { count: count + 1, resetTime });
    } else {
      attempts.set(clientIp, { count: 1, resetTime: now + 15 * 60 * 1000 });
    }
  } else {
    attempts.set(clientIp, { count: 1, resetTime: now + 15 * 60 * 1000 });
  }
  
  // ... rest of login code
}
```

### 2. **Add Password Hashing**

If you want to hash the password:

```bash
npm install bcryptjs
```

```javascript
import bcrypt from 'bcryptjs';

// Hash password (run once to get hash)
const hashedPassword = await bcrypt.hash('dauns33', 10);

// In login.js
const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
```

### 3. **Add Token Refresh**

Create `/api/auth/refresh.js` to refresh tokens before expiration.

---

## Deployment Checklist

- [ ] Install `jsonwebtoken` package
- [ ] Create `/api/auth/login.js`
- [ ] Create `/api/auth/verify.js`
- [ ] Update `PasswordProtection.jsx`
- [ ] Update `App.jsx` with token verification
- [ ] Set environment variables in Vercel
- [ ] Test locally
- [ ] Deploy to Vercel
- [ ] Test in production

---

## Cost

**Vercel Free Tier Includes:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited serverless function invocations
- ✅ 100 hours execution time/month
- ✅ Perfect for your use case

**You'll likely stay on free tier** unless you have massive traffic.

---

## Migration Notes

### **Breaking Changes:**
- Old authentication (client-side) will stop working
- Users will need to re-authenticate after deployment
- Token-based system replaces simple boolean

### **Backward Compatibility:**
- Decoy password still works (client-side check)
- All other features remain the same

---

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test API endpoints directly with Postman/curl
4. Check browser console for errors

---

## Summary

**What you get:**
- ✅ True server-side authentication
- ✅ Unbypassable from client
- ✅ JWT token security
- ✅ Token expiration
- ✅ Free on Vercel

**What you need:**
- ✅ Install `jsonwebtoken`
- ✅ Create 2 API files
- ✅ Update 2 client files
- ✅ Set 2 environment variables
- ✅ Deploy to Vercel

**Time estimate:** 30-60 minutes

**Difficulty:** Medium (requires understanding of APIs)

