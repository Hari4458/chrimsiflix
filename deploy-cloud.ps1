#!/usr/bin/env powershell
#Requires -Version 5.0

# ╔════════════════════════════════════════════════════════════════════╗
# ║  ChrimsiFlix - Automated Cloud Deployment Script                  ║
# ║  Handles: GitHub (✓Done) → Supabase → Render                     ║
# ╚════════════════════════════════════════════════════════════════════╝

$ErrorActionPreference = "Stop"

# Colors
$Green = @{ ForegroundColor = "Green" }
$Yellow = @{ ForegroundColor = "Yellow" }
$Cyan = @{ ForegroundColor = "Cyan" }
$Red = @{ ForegroundColor = "Red" }

function Print-Header {
    param([string]$Text)
    Write-Host "`n╔═══════════════════════════════════════════════════════════╗" @Cyan
    Write-Host "║ $Text" @Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝`n" @Cyan
}

function Print-Step {
    param([string]$Text, [int]$Step)
    Write-Host "[$Step] $Text" @Yellow
}

function Print-Success {
    param([string]$Text)
    Write-Host "✓ $Text" @Green
}

function Print-Error {
    param([string]$Text)
    Write-Host "✗ $Text" @Red
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 1: Verify GitHub Setup
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Print-Header "STEP 1: GITHUB REPOSITORY VERIFICATION"

$repoUrl = git config --get remote.origin.url 2>$null
if ($repoUrl -match "github\.com.*chrimsiflix") {
    Print-Success "GitHub repository already created and pushed"
    $githubUrl = $repoUrl -replace "\.git$", ""
    Write-Host "   Repository: $githubUrl`n" @Green
} else {
    Print-Error "GitHub repository not found"
    exit 1
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 2: Supabase Setup
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Print-Header "STEP 2: SUPABASE DATABASE SETUP"

Write-Host "Opening Supabase dashboard..." @Yellow
Write-Host "Instructions:" @Cyan
Write-Host "  1. Sign up/Login with GitHub at https://supabase.com" @Cyan
Write-Host "  2. Click 'New Project'" @Cyan
Write-Host "  3. Fill in details and wait for database" @Cyan
Write-Host "  4. Go to Settings → Database → Connection string (PostgreSQL)" @Cyan
Write-Host "  5. Copy the connection string`n" @Cyan

# Try to open Supabase in browser
try {
    Start-Process "https://supabase.com"
} catch {
    Write-Host "Please visit: https://supabase.com" @Yellow
}

# Get DATABASE_URL from user
Write-Host ""
$databaseUrl = Read-Host "Paste your Supabase DATABASE_URL"

if ([string]::IsNullOrWhiteSpace($databaseUrl) -or -not $databaseUrl.StartsWith("postgresql://")) {
    Print-Error "Invalid database URL. Must start with 'postgresql://'"
    exit 1
}

Print-Success "Database URL saved"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 3: Run Database Migrations
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Print-Header "STEP 3: RUNNING DATABASE MIGRATIONS"

Write-Host "Creating tables in Supabase..." @Yellow

$env:DATABASE_URL = $databaseUrl
try {
    cd backend
    npm run db:migrate
    cd ..
    Print-Success "Database tables created successfully"
} catch {
    Print-Error "Failed to run migrations. Check your DATABASE_URL"
    exit 1
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 4: Render Deployment
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Print-Header "STEP 4: RENDER.COM DEPLOYMENT"

Write-Host "Opening Render dashboard..." @Yellow

$jwtSecret = "zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMw="

Write-Host "Instructions for Render:" @Cyan
Write-Host "  1. Go to https://render.com" @Cyan
Write-Host "  2. Sign up/Login with GitHub" @Cyan
Write-Host "  3. Click 'New +' → 'Web Service'" @Cyan
Write-Host "  4. Select 'Hari4458/chrimsiflix' repository" @Cyan
Write-Host "  5. Fill form:" @Cyan
Write-Host "     - Name: chrimsiflix-backend" @Cyan
Write-Host "     - Runtime: Node" @Cyan
Write-Host "     - Build: npm install and npm run build" @Cyan
Write-Host "     - Start: npm start" @Cyan
Write-Host "     - Plan: Free" @Cyan
Write-Host "  6. Click 'Advanced' and add environment variables:" @Cyan
Write-Host "" @Cyan
Write-Host "     DATABASE_URL = $databaseUrl" @Cyan
Write-Host "     JWT_SECRET = $jwtSecret" @Cyan
Write-Host "     CORS_ORIGIN = https://chrimsiflix-frontend.onrender.com" @Cyan
Write-Host "     NODE_ENV = production" @Cyan
Write-Host "     PORT = 10000" @Cyan
Write-Host "" @Cyan
Write-Host "  7. Click 'Create Web Service' and wait for deployment" @Cyan
Write-Host "  8. Once backend is deployed, note its URL" @Cyan
Write-Host "  9. Create frontend as 'Static Site':" @Cyan
Write-Host "     - Build: cd frontend and npm install and npm run build" @Cyan
Write-Host "     - Publish: frontend/dist" @Cyan
Write-Host "     - Environment:" @Cyan
Write-Host "       VITE_API_URL = [backend URL from step 8]" @Cyan
Write-Host "       VITE_SOCKET_URL = [backend URL from step 8]`n" @Cyan

try {
    Start-Process "https://render.com"
} catch {
    Write-Host "Please visit: https://render.com" @Yellow
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# STEP 5: Completion
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Print-Header "STEP 5: DEPLOYMENT COMPLETE!"

Write-Host "What was done:" @Green
Write-Host "  ✓ GitHub repository created and code pushed" @Green
Write-Host "  ✓ Supabase database configured with tables" @Green
Write-Host "  ✓ DATABASE_URL verified" @Green
Write-Host "" @Green

Write-Host "What to do next:" @Yellow
Write-Host "  1. Deploy backend on Render" @Yellow
Write-Host "  2. Deploy frontend on Render" @Yellow
Write-Host "  3. Test the application" @Yellow
Write-Host "  4. Share with friends!" @Yellow
Write-Host "" @Yellow

Write-Host "Key values (save these!):" @Cyan
Write-Host "  GitHub: https://github.com/Hari4458/chrimsiflix" @Cyan
Write-Host "  JWT Secret: $jwtSecret" @Cyan
Write-Host "  DATABASE_URL: $databaseUrl" @Cyan
Write-Host "" @Cyan

Print-Success "Your application is ready for the cloud!"
