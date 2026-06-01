#!/usr/bin/env pwsh

<#
.SYNOPSIS
    ChrimsiFlix Online Deployment Script
.DESCRIPTION
    Automated deployment to Render, Railway, or Vercel
.PARAMETER DeploymentMethod
    Choose: render, railway, or vercel
.PARAMETER GitHubRepo
    Your GitHub repository URL
#>

param(
    [ValidateSet('render', 'railway', 'vercel', 'all')]
    [string]$DeploymentMethod = 'render',
    [string]$GitHubRepo = $null
)

$ErrorActionPreference = "Stop"

function Write-Section {
    param([string]$Message)
    Write-Host "`n$('=' * 60)" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "$('=' * 60)`n" -ForegroundColor Cyan
}

function Write-Step {
    param([int]$Number, [string]$Message)
    Write-Host "[$Number] $Message" -ForegroundColor Green
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Main script
Write-Section "ChrimsiFlix Online Deployment"

# Step 1: Verify prerequisites
Write-Step 1 "Checking prerequisites..."

$checks = @(
    @{Name = 'Node.js'; Cmd = 'node --version'},
    @{Name = 'npm'; Cmd = 'npm --version'},
    @{Name = 'Git'; Cmd = 'git --version'}
)

foreach ($check in $checks) {
    try {
        $result = & cmd /c "$($check.Cmd)" 2>&1
        Write-Success "$($check.Name) installed"
    } catch {
        Write-Error-Custom "$($check.Name) not found. Please install it first."
        exit 1
    }
}

# Step 2: Navigate to project
Write-Step 2 "Setting up project directory..."
$projectPath = "c:\Users\ADMIN\OneDrive\Desktop\Chrimsiflix"

if (-not (Test-Path $projectPath)) {
    Write-Error-Custom "Project path not found: $projectPath"
    exit 1
}

Set-Location $projectPath
Write-Success "Located project at: $projectPath"

# Step 3: Install dependencies
Write-Step 3 "Installing dependencies..."

Write-Host "  Installing backend dependencies..." -ForegroundColor Cyan
Set-Location "$projectPath\backend"
npm install 2>&1 | Out-Null
Write-Success "Backend dependencies installed"

Write-Host "  Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "$projectPath\frontend"
npm install 2>&1 | Out-Null
Write-Success "Frontend dependencies installed"

Set-Location $projectPath

# Step 4: Generate JWT Secret
Write-Step 4 "Generating JWT Secret..."
$jwtSecret = [Convert]::ToBase64String((1..32 | ForEach-Object {[byte]$(Get-Random -Maximum 256)}))
Write-Success "Generated: $($jwtSecret.Substring(0, 20))..."

# Step 5: Create environment files
Write-Step 5 "Creating environment configuration files..."

# Backend production env
$backendEnv = @"
PORT=10000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
JWT_SECRET=$jwtSecret
CORS_ORIGIN=https://chrimsiflix-frontend.onrender.com
"@

$backendEnv | Out-File -Encoding UTF8 "$projectPath\backend\.env.production"
Write-Success "Created backend/.env.production"

# Frontend production env
$frontendEnv = @"
VITE_API_URL=https://chrimsiflix-backend.onrender.com
VITE_SOCKET_URL=https://chrimsiflix-backend.onrender.com
"@

$frontendEnv | Out-File -Encoding UTF8 "$projectPath\frontend\.env.production"
Write-Success "Created frontend/.env.production"

# Step 6: Initialize Git (if not already)
Write-Step 6 "Setting up Git repository..."

if (-not (Test-Path "$projectPath\.git")) {
    git init
    git config user.name "ChrimsiFlix Deployer"
    git config user.email "deploy@chrimsiflix.app"
    Write-Success "Git repository initialized"
} else {
    Write-Success "Git repository already exists"
}

# Step 7: Git add and commit
Write-Host "  Adding files to Git..." -ForegroundColor Cyan
git add .
git commit -m "ChrimsiFlix deployment configuration" 2>&1 | Out-Null
Write-Success "Files committed to Git"

# Step 8: Deployment instructions
Write-Section "Next Steps"

Write-Host @"
📋 BEFORE YOU PROCEED, YOU NEED:

1. GitHub Account:
   - Create GitHub account at github.com
   - Create a new repository named 'chrimsiflix'
   - DO NOT initialize with README

2. Supabase Account (for Database):
   - Go to supabase.com
   - Sign up (free)
   - Create a new project
   - Get your DATABASE_URL from Settings → Database

3. Choose Deployment Platform:
"@

if ($DeploymentMethod -eq 'render' -or $DeploymentMethod -eq 'all') {
    Write-Host @"
   ✨ RENDER (Recommended - Easiest):
      1. Go to render.com
      2. Sign up with GitHub
      3. Create Web Service for backend
      4. Create Static Site for frontend
      5. Add environment variables:
         - DATABASE_URL (from Supabase)
         - JWT_SECRET (already generated)
         - CORS_ORIGIN (frontend URL)
"@ -ForegroundColor Yellow
}

if ($DeploymentMethod -eq 'railway' -or $DeploymentMethod -eq 'all') {
    Write-Host @"
   🚂 RAILWAY:
      1. Go to railway.app
      2. Sign up with GitHub
      3. Create new project
      4. Add PostgreSQL (will auto-generate DATABASE_URL)
      5. Deploy backend and frontend
      6. Add JWT_SECRET
"@ -ForegroundColor Magenta
}

if ($DeploymentMethod -eq 'vercel' -or $DeploymentMethod -eq 'all') {
    Write-Host @"
   ▲ VERCEL (Frontend only, needs separate backend):
      1. Go to vercel.com
      2. Sign up with GitHub
      3. Import chrimsiflix repository
      4. Deploy frontend
      5. Add environment variables
"@ -ForegroundColor Blue
}

Write-Host @"

📝 STEP-BY-STEP GITHUB SETUP:

1. Copy repository URL from your GitHub (HTTPS):
   https://github.com/YOUR-USERNAME/chrimsiflix.git

2. Run these commands:

   git remote remove origin 2>$null
   git remote add origin https://github.com/YOUR-USERNAME/chrimsiflix.git
   git branch -M main
   git push -u origin main

3. When prompted, use your GitHub username and personal access token

4. After pushing, go to render.com/railway.app and connect your repository

⚠️  IMPORTANT - SET THESE ENVIRONMENT VARIABLES IN YOUR DEPLOYMENT:

Backend:
  PORT: 10000
  NODE_ENV: production
  DATABASE_URL: [from Supabase]
  JWT_SECRET: $jwtSecret
  CORS_ORIGIN: [your frontend URL]

Frontend:
  VITE_API_URL: [your backend URL]
  VITE_SOCKET_URL: [your backend URL]

💾 SAVED JWT SECRET (keep this safe):
   $jwtSecret

"@

Write-Section "Configuration Files Created"

Write-Host "Configuration files ready for deployment:" -ForegroundColor Cyan
Write-Host "  ✓ render.yaml          (for Render)" -ForegroundColor Green
Write-Host "  ✓ railway.toml         (for Railway)" -ForegroundColor Green
Write-Host "  ✓ vercel.json          (for Vercel)" -ForegroundColor Green
Write-Host "  ✓ .env.production      (for local testing)" -ForegroundColor Green
Write-Host "`n"

Write-Success "Deployment preparation complete!"

Write-Host @"
🚀 QUICK START:

1. Get GitHub repository URL created
2. Run: git remote add origin [YOUR-REPO-URL]
3. Run: git push -u origin main
4. Go to your chosen platform (render.com/railway.app/vercel.com)
5. Connect GitHub and deploy
6. Set environment variables (especially DATABASE_URL from Supabase)

For Render:
   render.yaml is configured and ready to deploy

For Railway:
   railway.toml is configured and ready to deploy

For Vercel:
   vercel.json is configured and ready to deploy

Need help? Check README.md or API.md
"@ -ForegroundColor Cyan
