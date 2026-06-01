# ChrimsiFlix Online Deployment Guide

## 🚀 Quick Start (Choose One Platform)

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- GitHub Account (free at [github.com](https://github.com))
- Supabase Account (free at [supabase.com](https://supabase.com))

## Step 1: Run Deployment Script

### Windows (PowerShell)
```powershell
cd c:\Users\ADMIN\OneDrive\Desktop\Chrimsiflix
.\deploy.ps1
```

### macOS/Linux (Bash)
```bash
cd ~/Desktop/Chrimsiflix
bash deploy.sh
```

This will:
- ✅ Check prerequisites
- ✅ Install all dependencies
- ✅ Generate JWT Secret
- ✅ Create environment files
- ✅ Initialize Git repository

## Step 2: Create Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Create new project
4. Wait for database to provision
5. Go to **Settings → Database → Connection string**
6. Copy the connection string (looks like: `postgresql://user:password@host:5432/postgres`)

## Step 3: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create repository named `chrimsiflix`
3. Do **NOT** initialize with README
4. Copy the repository URL (HTTPS)

## Step 4: Push Code to GitHub

```powershell
# Navigate to project
cd c:\Users\ADMIN\OneDrive\Desktop\Chrimsiflix

# Set your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/chrimsiflix.git

# Push code
git branch -M main
git push -u origin main

# You'll be prompted for GitHub credentials:
# - Use your GitHub username
# - For password, use a Personal Access Token (create at github.com/settings/tokens)
```

## Step 5: Deploy to Render (Recommended)

### Option A: Web UI (Easiest)

1. Go to [render.com](https://render.com)
2. Click "Sign up"
3. Sign up with GitHub (authorize access)
4. Click "New +" → "Web Service"
5. Select your `chrimsiflix` repository
6. Fill in:
   - **Name**: `chrimsiflix-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
7. Click "Advanced" and add environment variables:
   ```
   DATABASE_URL = postgresql://user:password@db.supabase.co:5432/postgres
   JWT_SECRET = [from your terminal output]
   CORS_ORIGIN = https://chrimsiflix-frontend.onrender.com
   NODE_ENV = production
   PORT = 10000
   ```
8. Click "Create Web Service"
9. Wait for deployment (5-10 minutes)

### Deploy Frontend to Render

1. After backend deploys, go to dashboard
2. Click "New +" → "Static Site"
3. Select your `chrimsiflix` repository
4. Fill in:
   - **Name**: `chrimsiflix-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free
5. Add environment variables:
   ```
   VITE_API_URL = https://chrimsiflix-backend.onrender.com
   VITE_SOCKET_URL = https://chrimsiflix-backend.onrender.com
   ```
6. Click "Create Static Site"
7. Wait for deployment

### Option B: Via render.yaml (Automatic)

The `render.yaml` file is already configured! Just:

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Render will auto-detect `render.yaml`
6. Fill in environment variables
7. Click deploy!

---

## Alternative: Deploy to Railway

### Step 1: Setup Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link
```

### Step 2: Create .env in Railway

```bash
# Add PostgreSQL
railway add
# Select: PostgreSQL

# Get connection details
railway variables
```

### Step 3: Deploy

```bash
# Backend
cd backend
railway up

# Frontend
cd ../frontend
railway up
```

---

## Alternative: Deploy to Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Add environment variables when prompted
```

---

## ✅ Verify Deployment

After deployment completes:

1. Visit your frontend URL (e.g., `https://chrimsiflix-frontend.onrender.com`)
2. Create a room
3. Share the room code
4. Open in another tab/browser
5. Join the room
6. Test chat and collaboration

## 🔧 Update Environment Variables

### On Render Dashboard

1. Go to your service
2. Click "Environment"
3. Edit variables
4. Click "Save"
5. Service will auto-redeploy

### On Railway Dashboard

1. Go to your project
2. Click "Variables"
3. Edit values
4. Save and redeploy

---

## 📋 Troubleshooting

### Database Connection Error
```
ERROR: database "chrimsiflix" does not exist
```
**Solution**: 
1. Go to Supabase dashboard
2. Run migrations in SQL editor:
   ```sql
   -- Copy from backend/db/migrations/run.ts
   ```

### Backend Not Starting
```
Error: Cannot find module
```
**Solution**:
1. Check logs: View in dashboard
2. Ensure `npm install` ran successfully
3. Check `package.json` dependencies

### Frontend Not Loading
```
Cannot GET /
```
**Solution**:
1. Check build command ran: `npm run build`
2. Check publish directory is set to `dist`
3. Check `vite.config.ts` settings

### WebSocket Connection Failed
```
WebSocket connection to wss://... failed
```
**Solution**:
1. Ensure backend URL is correct in `VITE_API_URL`
2. Check CORS_ORIGIN includes frontend URL
3. Verify backend is running (check logs)

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
1. Update `CORS_ORIGIN` to your frontend URL
2. Ensure it includes `https://`
3. Redeploy backend

---

## 📊 Monitoring

### Check Service Logs

**Render**:
1. Go to service
2. Click "Logs" tab
3. View real-time logs

**Railway**:
1. Go to project
2. Click service
3. View logs on right panel

**Vercel**:
1. Go to project
2. Click "Deployments"
3. View logs for latest deployment

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] DATABASE_URL is from Supabase
- [ ] CORS_ORIGIN is your actual frontend URL (not localhost)
- [ ] NODE_ENV is set to `production`
- [ ] .env files are in .gitignore (not committed)
- [ ] Use HTTPS for all connections
- [ ] Enable Supabase row-level security
- [ ] Set up database backups

---

## 📈 Performance Tips

1. **Database Indexing**: Already included in migrations
2. **Connection Pooling**: Configured in backend
3. **CDN**: Render/Railway include CDN automatically
4. **Caching**: Add header caching in production
5. **Monitoring**: Enable APM in platform dashboard

---

## 🎯 Next Steps

1. ✅ Run deployment script
2. ✅ Create Supabase account & database
3. ✅ Create GitHub account & repository
4. ✅ Push code to GitHub
5. ✅ Deploy to Render/Railway/Vercel
6. ✅ Set environment variables
7. ✅ Run database migrations
8. ✅ Test the application
9. ✅ Share your app with others!

---

## 💬 Support

- 📖 Full docs: [README.md](./README.md)
- 🛠️ Dev guide: [DEVELOPMENT.md](./DEVELOPMENT.md)
- 📡 API docs: [API.md](./API.md)
- 🚀 Render docs: [render.com/docs](https://render.com/docs)
- 🚂 Railway docs: [railway.app/docs](https://railway.app/docs)

---

**Your app is ready to go online! 🚀**
