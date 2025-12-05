# 🔧 Local & Vercel Setup Guide

## 🚨 **Problem:** API routes don't work with `npm run dev`

Vite doesn't automatically handle `/api` routes. You need to use **Vercel CLI** for local development.

---

## ✅ **Solution: Use Vercel CLI for Local Development**

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Run Local Dev with Vercel**

```bash
# Instead of: npm run dev
# Use this:
vercel dev
```

This will:
- ✅ Handle `/api` routes automatically
- ✅ Use environment variables from `.env.local`
- ✅ Simulate Vercel environment locally

---

## 📝 **Local Development Setup**

### **1. Create `.env.local` file** (in project root):

```env
JWT_SECRET=d8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223
ADMIN_PASSWORD=dauns33
```

### **2. Run with Vercel:**

```bash
vercel dev
```

### **3. Test:**
- Visit: http://localhost:3000
- Enter password: `dauns33`
- Should authenticate ✅

---

## 🌐 **Vercel Production Setup**

### **1. Set Environment Variables:**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- `JWT_SECRET` = `d8f8ed21769ed995d997ef9366efb0b8475df9eeb6483b64fe796fd0d24c95613a6e543a2bc899f81a970d7bd6bf21ba1f67b6bf6b98bca52b5e6e802fb8d223`
- `ADMIN_PASSWORD` = `dauns33`

**Important:** Select all environments (Production, Preview, Development)

### **2. Redeploy:**

After setting variables, redeploy:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

## 🔍 **Troubleshooting**

### **Local: "Failed to fetch" or 404**

**Problem:** Using `npm run dev` instead of `vercel dev`

**Solution:**
```bash
# Stop npm run dev
# Use vercel dev instead
vercel dev
```

### **Vercel: "Invalid password"**

**Problem:** Environment variables not set or wrong

**Check:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify both `JWT_SECRET` and `ADMIN_PASSWORD` exist
3. Make sure they're enabled for **Production**
4. **Redeploy** after setting variables

### **Vercel: API returns 404**

**Problem:** API files not deployed

**Check:**
1. Verify `/api/auth/login.js` exists in GitHub
2. Check Vercel deployment logs
3. Check Vercel Functions tab - should see `/api/auth/login`

---

## 📋 **Quick Commands**

```bash
# Local development (with API support)
vercel dev

# Regular Vite dev (NO API support)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✅ **Checklist**

### **For Local Development:**
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Create `.env.local` with `JWT_SECRET` and `ADMIN_PASSWORD`
- [ ] Use `vercel dev` instead of `npm run dev`
- [ ] Test login with password `dauns33`

### **For Vercel Production:**
- [ ] Set environment variables in Vercel dashboard
- [ ] Enable for Production environment
- [ ] Redeploy after setting variables
- [ ] Test on production URL

---

## 🎯 **Summary**

**Local:** Use `vercel dev` (not `npm run dev`)  
**Vercel:** Set environment variables and redeploy

**Both need:**
- `JWT_SECRET` environment variable
- `ADMIN_PASSWORD` environment variable

