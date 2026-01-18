# Deployment Guide

## Architecture Overview

Your application has two parts:
- **Frontend**: React + Vite (can deploy to Vercel or Netlify)
- **Backend**: Express API (needs Node.js runtime - deploy to Vercel, Render, or Railway)

## Recommended Deployment Strategy

### Option 1: Vercel (Full-Stack) ⭐ RECOMMENDED

Deploy both frontend and backend on Vercel.

### Option 2: Split Deployment
- Frontend: Netlify
- Backend: Render/Railway

---

## 🚀 Option 1: Deploy to Vercel (Full-Stack)

### Step 1: Prepare Backend for Vercel

Create a `vercel.json` in the backend folder:

```bash
cd /Users/macbook/Documents/fullstack-users/backend
```

Create file: `backend/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### Step 2: Update Backend for Serverless

Modify `backend/src/index.ts` to export the app:

Add at the end of the file:
```typescript
// Export for Vercel
export default app;
```

### Step 3: Update CORS in Backend

Update `backend/src/index.ts` CORS configuration:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend.vercel.app' // Update after deploying frontend
  ]
}));
```

### Step 4: Deploy Backend to Vercel

1. **Push to GitHub**:
   ```bash
   cd /Users/macbook/Documents/fullstack-users
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/fullstack-users.git
   git push -u origin main
   ```

2. **Deploy Backend**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Import your repository
   - Select **backend** folder as Root Directory
   - Add Environment Variable:
     - Key: `DATABASE_URL`
     - Value: `mongodb+srv://mdrafiqulalamahid_db_user:bji4SLZLX9Mvu46q@rafi-cluster0.jpwlilx.mongodb.net/fullstack_users?retryWrites=true&w=majority`
   - Click "Deploy"
   - Save the backend URL (e.g., `https://your-backend.vercel.app`)

### Step 5: Update Frontend API URL

Update `frontend/src/api/users.ts`:
```typescript
const API_BASE_URL = import.meta.env.PROD
  ? "https://your-backend.vercel.app"
  : "http://localhost:3001";
```

Or create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.vercel.app
```

And update `frontend/src/api/users.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
```

### Step 6: Deploy Frontend to Vercel

1. **Deploy Frontend**:
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import the same repository
   - Select **frontend** folder as Root Directory
   - Framework Preset: Vite
   - Add Environment Variable (if using .env.production):
     - Key: `VITE_API_URL`
     - Value: `https://your-backend.vercel.app`
   - Click "Deploy"

2. **Update Backend CORS**:
   - Copy your frontend URL (e.g., `https://your-app.vercel.app`)
   - Update `backend/src/index.ts` CORS origin
   - Git commit and push (Vercel auto-redeploys)

---

## 🌐 Option 2: Netlify (Frontend) + Render (Backend)

### Backend on Render

1. **Deploy Backend**:
   - Go to https://render.com
   - Sign up/Login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `fullstack-users-backend`
     - Root Directory: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Environment Variables:
       - `DATABASE_URL`: Your MongoDB connection string
   - Click "Create Web Service"
   - Save the backend URL

2. **Add package.json start script** (already done):
   ```json
   "start": "node dist/index.js"
   ```

### Frontend on Netlify

1. **Update API URL** in `frontend/src/api/users.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.PROD
     ? "https://your-backend.onrender.com"
     : "http://localhost:3001";
   ```

2. **Create `frontend/netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy to Netlify**:
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`
   - Click "Deploy"

---

## 🔧 Required Code Changes

### 1. Backend: Export for Vercel

Add to `backend/src/index.ts` (at the very end):

```typescript
// Export for Vercel serverless
export default app;
```

### 2. Backend: Update CORS

Replace the CORS line in `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### 3. Frontend: Environment-based API URL

Update `frontend/src/api/users.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://your-backend.vercel.app"
    : "http://localhost:3001");
```

---

## 📋 Pre-Deployment Checklist

- [ ] Push code to GitHub
- [ ] MongoDB Atlas IP whitelist set to "Allow from Anywhere" (0.0.0.0/0)
- [ ] Backend environment variables ready (DATABASE_URL)
- [ ] Frontend API URL updated
- [ ] CORS configured with frontend URL
- [ ] Backend builds successfully (`npm run build`)
- [ ] Frontend builds successfully (`npm run build`)

---

## 🚨 Common Issues

### CORS Errors
**Solution**: Add your frontend URL to backend CORS configuration

### Database Connection Failed
**Solution**:
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify DATABASE_URL environment variable

### API 404 Errors
**Solution**: Verify API_BASE_URL in frontend matches backend URL

### Vercel Build Fails
**Solution**: Check Node.js version in vercel.json:
```json
{
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

---

## 🎯 Quick Deploy Script

I can create the necessary files and help you deploy. Which option do you prefer?

1. **Vercel (Full-Stack)** - Easiest, all in one place
2. **Netlify + Render** - Frontend on Netlify, Backend on Render
3. **Railway** - Simple full-stack deployment

Let me know and I'll set it up for you!

---

## 📊 Deployment Comparison

| Platform | Free Tier | Build Time | Best For |
|----------|-----------|------------|----------|
| Vercel   | ✅ Yes    | Fast       | Full-stack, Serverless |
| Netlify  | ✅ Yes    | Fast       | Frontend only |
| Render   | ✅ Yes    | Moderate   | Backend services |
| Railway  | ✅ Yes    | Fast       | Full-stack |

**Recommendation**: Use Vercel for both frontend and backend - simplest setup!
