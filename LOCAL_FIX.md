# 🔧 Fix: Server Error When Logging In Locally

## 🚨 **Problem:** "Server error" when using `npm run dev`

**Root Cause:** Vite dev server (`npm run dev`) doesn't handle `/api` routes. These are Vercel serverless functions that only work with `vercel dev`.

---

## ✅ **Solution: Use Vercel CLI for Local Development**

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Create `.env.local` file**

Create this file in your project root (same folder as `package.json`):

```env
JWT_SECRET=d8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223
ADMIN_PASSWORD=dauns33
```

### **Step 3: Run with Vercel**

```bash
# Stop npm run dev (if running)
# Then run:
vercel dev
```

This will:
- ✅ Start server on http://localhost:3000
- ✅ Handle `/api` routes automatically
- ✅ Use `.env.local` for environment variables
- ✅ Simulate Vercel environment

### **Step 4: Test**

- Visit: http://localhost:3000
- Enter password: `dauns33`
- Should authenticate ✅

---

## 🔍 **Why This Happens:**

- **`npm run dev`** = Vite dev server (doesn't handle `/api` routes)
- **`vercel dev`** = Vercel CLI (handles `/api` routes like production)

---

## ⚠️ **Alternative: Test on Vercel**

If you don't want to use `vercel dev`:
- Just test directly on your Vercel deployment
- Environment variables are already set there
- Should work immediately

---

## 🎯 **Quick Fix:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Create .env.local (copy the content above)

# 3. Run
vercel dev

# 4. Test login
```

---

## ✅ **After This:**

- Local development: Use `vercel dev` ✅
- Vercel production: Already working ✅

**Everything should work now!**

