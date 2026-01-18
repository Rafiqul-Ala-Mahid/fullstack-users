# ✅ Deployment Checklist

## Your code is committed and ready! Follow these steps:

### □ Step 1: Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Name: `fullstack-users`
- [ ] Make it Public
- [ ] Click "Create repository"

### □ Step 2: Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/fullstack-users.git
git push -u origin main
```
(Replace YOUR_USERNAME with your GitHub username)

### □ Step 3: Deploy Backend
- [ ] Go to https://vercel.com/new
- [ ] Import `fullstack-users` repository
- [ ] Root Directory: Select `backend`
- [ ] Add Environment Variable:
  - KEY: `DATABASE_URL`
  - VALUE: `mongodb+srv://mdrafiqulalamahid_db_user:bji4SLZLX9Mvu46q@rafi-cluster0.jpwlilx.mongodb.net/fullstack_users?retryWrites=true&w=majority`
- [ ] Click Deploy
- [ ] Copy backend URL: __________________________

### □ Step 4: Deploy Frontend
- [ ] Go to https://vercel.com/new
- [ ] Import `fullstack-users` repository again
- [ ] Root Directory: Select `frontend`
- [ ] Add Environment Variable:
  - KEY: `VITE_API_URL`
  - VALUE: (Your backend URL from Step 3)
- [ ] Click Deploy
- [ ] Copy frontend URL: __________________________

### □ Step 5: Update CORS
- [ ] Edit `backend/src/index.ts` line 12
- [ ] Add your frontend URL to the array
- [ ] Run: `git add . && git commit -m "Update CORS" && git push`
- [ ] Wait for auto-redeploy (~1 min)

### □ Step 6: Test
- [ ] Visit your frontend URL
- [ ] Test search, filter, sort
- [ ] Test clicking users
- [ ] Test toggle active

---

## 🎉 Done!

Your app is live at: (your frontend URL)

See detailed instructions in: [VERCEL_DEPLOY_NOW.md](VERCEL_DEPLOY_NOW.md)
