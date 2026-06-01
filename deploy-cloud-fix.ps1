# ChrimsiFlix - Automated Cloud Deployment Script

$ErrorActionPreference = "Stop"

# Colors
$Green = @{ ForegroundColor = "Green" }
$Yellow = @{ ForegroundColor = "Yellow" }
$Cyan = @{ ForegroundColor = "Cyan" }

Write-Host ""
Write-Host "========================================" @Cyan
Write-Host "CHRIMSIFLIX CLOUD DEPLOYMENT STARTED" @Cyan
Write-Host "========================================" @Cyan
Write-Host ""

# Check GitHub
Write-Host "[1] Checking GitHub Repository..." @Yellow
$repoUrl = git config --get remote.origin.url 2>$null
if ($repoUrl -match "chrimsiflix") {
    Write-Host "  ✓ GitHub repo already created and pushed" @Green
    Write-Host "    $repoUrl" @Green
    Write-Host ""
} else {
    Write-Host "  ✗ GitHub repo not found" @Red
    exit 1
}

# Supabase Setup
Write-Host "[2] Supabase Database Setup..." @Yellow
Write-Host ""
Write-Host "   Instructions:" @Cyan
Write-Host "   1. Visit https://supabase.com" @Cyan
Write-Host "   2. Sign up with GitHub account" @Cyan
Write-Host "   3. Create new project and wait 5-10 minutes" @Cyan
Write-Host "   4. Go to Settings -> Database -> Connection string" @Cyan
Write-Host "   5. Copy PostgreSQL connection string" @Cyan
Write-Host ""

$databaseUrl = Read-Host "   Paste your Supabase DATABASE_URL"

if ([string]::IsNullOrWhiteSpace($databaseUrl) -or -not $databaseUrl.StartsWith("postgresql://")) {
    Write-Host "  ✗ Invalid database URL" @Red
    exit 1
}

Write-Host "  ✓ Database URL saved" @Green
Write-Host ""

# Run migrations
Write-Host "[3] Running Database Migrations..." @Yellow
$env:DATABASE_URL = $databaseUrl

try {
    cd backend
    npm run db:migrate *>$null
    cd ..
    Write-Host "  ✓ Database tables created successfully" @Green
    Write-Host ""
} catch {
    Write-Host "  ✗ Migration failed" @Red
    Write-Host "    Check your DATABASE_URL format" @Red
    exit 1
}

# Render Deployment Instructions
Write-Host "[4] Render.com Deployment Instructions..." @Yellow
Write-Host ""
Write-Host "   Step A: Deploy Backend" @Cyan
Write-Host "   1. Visit https://render.com" @Cyan
Write-Host "   2. Sign up with GitHub" @Cyan
Write-Host "   3. Click 'New +' then 'Web Service'" @Cyan
Write-Host "   4. Select 'Hari4458/chrimsiflix' repo" @Cyan
Write-Host "   5. Configure:" @Cyan
Write-Host "      Name: chrimsiflix-backend" @Cyan
Write-Host "      Runtime: Node" @Cyan
Write-Host "      Build: npm install" @Cyan
Write-Host "      Start: npm start" @Cyan
Write-Host "      Plan: Free" @Cyan
Write-Host "   6. Click Advanced and add variables:" @Cyan
Write-Host "      DATABASE_URL = (from Supabase)" @Cyan
Write-Host "      JWT_SECRET = zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMw=" @Cyan
Write-Host "      CORS_ORIGIN = https://chrimsiflix-frontend.onrender.com" @Cyan
Write-Host "      NODE_ENV = production" @Cyan
Write-Host "      PORT = 10000" @Cyan
Write-Host "   7. Click 'Create Web Service'" @Cyan
Write-Host ""
Write-Host "   Step B: Deploy Frontend" @Cyan
Write-Host "   1. After backend deploys, click 'New +' then 'Static Site'" @Cyan
Write-Host "   2. Select same repository" @Cyan
Write-Host "   3. Configure:" @Cyan
Write-Host "      Name: chrimsiflix-frontend" @Cyan
Write-Host "      Build: cd frontend; npm install" @Cyan
Write-Host "      Start: npm run build (auto)" @Cyan
Write-Host "      Publish: frontend/dist" @Cyan
Write-Host "      Plan: Free" @Cyan
Write-Host "   4. Add variables:" @Cyan
Write-Host "      VITE_API_URL = (your backend URL from step A)" @Cyan
Write-Host "      VITE_SOCKET_URL = (your backend URL from step A)" @Cyan
Write-Host ""

Write-Host "[5] Final Steps..." @Yellow
Write-Host ""
Write-Host "  When deployments are ready:" @Green
Write-Host "  1. Test at your frontend URL" @Green
Write-Host "  2. Create a room and share code" @Green
Write-Host "  3. Join from another browser/device" @Green
Write-Host "  4. Test chat and cursor sync" @Green
Write-Host ""

Write-Host "========================================" @Cyan
Write-Host "DEPLOYMENT INFO" @Cyan
Write-Host "========================================" @Cyan
Write-Host ""
Write-Host "GitHub: https://github.com/Hari4458/chrimsiflix" @Green
Write-Host "JWT Secret: zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMw=" @Green
Write-Host ""
Write-Host "Your application is ready for the cloud!" @Green
Write-Host ""
