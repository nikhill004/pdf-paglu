# Deployment Guide for PDF Paglu

## Free Deployment Options

### Option 1: Render (Recommended - Easiest)

**Why Render?**
- 750 free hours/month
- Automatic deployments from GitHub
- Both frontend and backend on one platform
- Zero configuration with render.yaml

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Done!** Your app will be live at:
   - Frontend: `https://pdf-paglu-frontend.onrender.com`
   - Backend: `https://pdf-paglu-api.onrender.com`

**Note:** Free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds.

---

### Option 2: Railway

**Why Railway?**
- $5 free credit monthly
- Fast deployments
- Easy setup

**Steps:**

1. **Push to GitHub** (same as above)

2. **Deploy on Railway**
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js

3. **Configure Services**
   
   **Backend:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add PORT variable: `5000`
   - Generate domain

   **Frontend:**
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -p $PORT`
   - Add environment variable:
     - `VITE_API_URL` = your backend URL
   - Generate domain

---

### Option 3: Vercel (Frontend) + Render (Backend)

**Why this combo?**
- Vercel has best frontend performance
- Render handles backend well
- Both have generous free tiers

**Steps:**

1. **Deploy Backend on Render**
   - Go to https://render.com
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Copy the backend URL

2. **Deploy Frontend on Vercel**
   - Go to https://vercel.com
   - Import your GitHub repo
   - Root Directory: `client`
   - Framework Preset: Vite
   - Add environment variable:
     - `VITE_API_URL` = your Render backend URL
   - Deploy

---

## Important Notes

### File Storage Limitation
⚠️ **Free hosting platforms have ephemeral file systems**. Uploaded files will be deleted when:
- The server restarts
- The container is redeployed
- On Render free tier: every time the service spins down

**Solutions:**
1. **Use cloud storage** (Recommended for production):
   - AWS S3 (free tier: 5GB)
   - Cloudinary (free tier: 25GB)
   - Supabase Storage (free tier: 1GB)

2. **Keep current setup** (OK for demo):
   - Files auto-delete after 1 hour anyway
   - Users download immediately
   - Just inform users files are temporary

### Environment Variables

**Backend (.env):**
```
PORT=5000
NODE_ENV=production
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### CORS Configuration
The backend already has CORS enabled for all origins. For production, update `server/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app'
}));
```

---

## Testing Deployment Locally

Before deploying, test production build:

```bash
# Build frontend
cd client
npm run build
npm run preview

# Run backend in production mode
cd ../server
NODE_ENV=production npm start
```

---

## Cost Comparison

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| **Render** | 750 hrs/month | Sleeps after 15 min inactivity |
| **Railway** | $5 credit/month | ~500 hours with basic usage |
| **Vercel** | Unlimited | Frontend only, 100GB bandwidth |
| **Netlify** | Unlimited | Frontend only, 100GB bandwidth |

---

## Recommended Setup for Production

1. **Frontend**: Vercel (best performance)
2. **Backend**: Render or Railway
3. **File Storage**: Cloudinary or AWS S3
4. **Database** (if needed later): Supabase or MongoDB Atlas

---

## Quick Deploy Commands

```bash
# 1. Initialize git
git init
git add .
git commit -m "Ready for deployment"

# 2. Create GitHub repo and push
git remote add origin YOUR_REPO_URL
git push -u origin main

# 3. Go to Render.com and deploy using Blueprint (render.yaml)
```

That's it! Your PDF Paglu app will be live in minutes! 🚀
