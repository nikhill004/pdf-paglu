# Pre-Deployment Checklist ✅

## Before You Deploy

- [ ] Test app locally with `npm run dev`
- [ ] All features working correctly
- [ ] No console errors in browser
- [ ] Files upload and download successfully

## Files Created for Deployment

- [x] `render.yaml` - Render deployment config
- [x] `client/src/config.js` - API URL configuration
- [x] `client/.env.example` - Environment variable template
- [x] `DEPLOYMENT.md` - Full deployment guide
- [x] Updated `.gitignore`

## Quick Deploy to Render (Easiest)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - PDF Paglu"
   ```

2. **Push to GitHub**
   - Create new repo on GitHub
   - Copy the repo URL
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Render**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New" → "Blueprint"
   - Select your repository
   - Click "Apply"
   - Wait 5-10 minutes

4. **Done!** 🎉
   - Your app will be live at the URLs provided by Render
   - Frontend: `https://pdf-paglu-frontend.onrender.com`
   - Backend: `https://pdf-paglu-api.onrender.com`

## Important Notes

⚠️ **Free Tier Limitations:**
- App sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Uploaded files are deleted on server restart
- 750 free hours per month

💡 **For Better Performance:**
- Upgrade to paid plan ($7/month per service)
- Or use Vercel (frontend) + Render (backend)

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and alternative deployment options.
