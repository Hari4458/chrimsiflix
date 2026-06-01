@echo off
REM ChrimsiFlix - Simple Cloud Deployment Guide

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   ChrimsiFlix Cloud Deployment - Final Steps           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo [✓] GitHub Repository: https://github.com/Hari4458/chrimsiflix
echo.
echo ════════════════════════════════════════════════════════
echo NEXT STEPS (Copy and follow these):
echo ════════════════════════════════════════════════════════
echo.
echo [STEP 1] Create Supabase Database
echo   1. Visit: https://supabase.com
echo   2. Click "Sign up" -> "Continue with GitHub"
echo   3. Authorize Supabase access
echo   4. Create new project (name: chrimsiflix)
echo   5. Wait 5-10 minutes for database
echo   6. Go to Settings -^> Database -^> Connection string
echo   7. Copy PostgreSQL connection string
echo.
echo [STEP 2] Run Database Migrations
echo   After you have the DATABASE_URL from Supabase, run:
echo   $env:DATABASE_URL="postgresql://user:pass@host:5432/postgres"
echo   cd backend
echo   npm run db:migrate
echo   cd ..
echo.
echo [STEP 3] Deploy to Render
echo   1. Visit: https://render.com
echo   2. Click "Sign up" -^> "Continue with GitHub"
echo   3. Authorize Render
echo   4. Click "New +" -^> "Web Service"
echo   5. Select "Hari4458/chrimsiflix" repository
echo   6. Configure Backend:
echo      - Name: chrimsiflix-backend
echo      - Runtime: Node
echo      - Build Command: npm install
echo      - Start Command: npm start
echo      - Plan: Free
echo   7. Click "Advanced" and add environment variables:
echo      DATABASE_URL = [from Supabase]
echo      JWT_SECRET = zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMw=
echo      CORS_ORIGIN = https://chrimsiflix-frontend.onrender.com
echo      NODE_ENV = production
echo      PORT = 10000
echo   8. Click "Create Web Service" (wait 5-10 minutes)
echo.
echo [STEP 4] Deploy Frontend
echo   1. After backend deploys, click "New +" -^> "Static Site"
echo   2. Select "Hari4458/chrimsiflix" again
echo   3. Configure Frontend:
echo      - Name: chrimsiflix-frontend
echo      - Build Command: cd frontend; npm install
echo      - Publish Directory: frontend/dist
echo      - Plan: Free
echo   4. Add environment variables:
echo      VITE_API_URL = [your backend URL]
echo      VITE_SOCKET_URL = [your backend URL]
echo   5. Click "Create Static Site"
echo.
echo [STEP 5] Test Your App
echo   1. Visit your frontend URL
echo   2. Create a room
echo   3. Share the 8-digit code
echo   4. Join from another browser
echo   5. Test chat and cursor sync
echo.
echo ════════════════════════════════════════════════════════
echo KEY VALUES (Save these):
echo ════════════════════════════════════════════════════════
echo GitHub: https://github.com/Hari4458/chrimsiflix
echo JWT Secret: zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMw=
echo.
echo Project ready! Follow the steps above to go live.
echo.
pause
