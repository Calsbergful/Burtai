# 🔧 Troubleshooting: Admin Password Not Working

## Common Issues & Solutions

### Issue 1: Testing Locally with `npm run dev`

**Problem:** Vite dev server doesn't handle `/api` routes automatically.

**Solution:** Use Vercel CLI for local development:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Run with Vercel (handles API routes)
vercel dev
```

**OR** Test directly on Vercel (after deployment).

---

### Issue 2: Environment Variables Not Set in Vercel

**Problem:** `ADMIN_PASSWORD` or `JWT_SECRET` not set in Vercel.

**Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both variables exist:
   - `ADMIN_PASSWORD` = `dauns33`
   - `JWT_SECRET` = (the long secret key)

**Fix:**
- Add missing variables
- Make sure they're enabled for **Production** environment
- **Redeploy** after adding variables

---

### Issue 3: API Endpoint Not Found (404)

**Problem:** `/api/auth/login` returns 404.

**Possible Causes:**
- API files not pushed to GitHub
- Vercel didn't detect `/api` folder
- Deployment failed

**Check:**
1. Verify `/api/auth/login.js` exists in GitHub
2. Check Vercel deployment logs
3. Check Vercel Functions tab - should see `/api/auth/login`

**Fix:**
- Re-push code if files missing
- Redeploy on Vercel

---

### Issue 4: Wrong Password

**Problem:** Password doesn't match.

**Check:**
- Are you entering: `dauns33` (exactly, no spaces)?
- Is `ADMIN_PASSWORD` set correctly in Vercel?

**Fix:**
- Verify password in Vercel environment variables
- Make sure no extra spaces

---

### Issue 5: CORS or Network Error

**Problem:** "Failed to fetch" or network error.

**Check:**
- Browser console for errors
- Network tab in DevTools
- Check if API endpoint is reachable

**Fix:**
- Check Vercel function logs
- Verify API endpoint URL is correct
- Check if site is deployed

---

## 🔍 How to Debug

### Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for errors

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Try logging in
3. Look for `/api/auth/login` request
4. Check:
   - Status code (should be 200)
   - Response body
   - Request payload

### Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Your Project → Functions tab
3. Click on `/api/auth/login`
4. Check logs for errors

### Step 4: Test API Directly

**In Browser Console:**
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'dauns33' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Should return:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ✅ Quick Checklist

- [ ] Environment variables set in Vercel?
- [ ] Variables enabled for Production?
- [ ] Redeployed after setting variables?
- [ ] Testing on Vercel (not local `npm run dev`)?
- [ ] Password is exactly `dauns33`?
- [ ] API files exist in GitHub?
- [ ] Checked browser console for errors?
- [ ] Checked Vercel function logs?

---

## 🚀 Quick Fixes

### If Testing Locally:
```bash
# Use Vercel CLI instead of npm run dev
vercel dev
```

### If on Vercel:
1. Check environment variables are set
2. Redeploy
3. Test again

### If Still Not Working:
1. Check Vercel function logs
2. Test API endpoint directly (see Step 4 above)
3. Verify password matches exactly

