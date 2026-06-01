#!/bin/bash

# ChrimsiFlix Online Deployment Script (macOS/Linux)

set -e

echo ""
echo "========================================="
echo "  ChrimsiFlix Online Deployment"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}[1] Checking prerequisites...${NC}"

command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js not installed${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm not installed${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}❌ Git not installed${NC}"; exit 1; }

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
echo -e "${GREEN}✅ npm $(npm -v)${NC}"
echo -e "${GREEN}✅ git $(git --version)${NC}"

# Navigate to project
echo ""
echo -e "${BLUE}[2] Setting up project directory...${NC}"

PROJECT_PATH="$HOME/Desktop/Chrimsiflix"

if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}❌ Project not found at: $PROJECT_PATH${NC}"
    exit 1
fi

cd "$PROJECT_PATH"
echo -e "${GREEN}✅ Located project${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}[3] Installing dependencies...${NC}"

echo -e "${YELLOW}Installing backend...${NC}"
cd backend
npm install > /dev/null
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo -e "${YELLOW}Installing frontend...${NC}"
cd ../frontend
npm install > /dev/null
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd "$PROJECT_PATH"

# Generate JWT Secret
echo ""
echo -e "${BLUE}[4] Generating JWT Secret...${NC}"

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo -e "${GREEN}✅ Generated: ${JWT_SECRET:0:20}...${NC}"

# Create environment files
echo ""
echo -e "${BLUE}[5] Creating environment files...${NC}"

cat > backend/.env.production << EOF
PORT=10000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
JWT_SECRET=$JWT_SECRET
CORS_ORIGIN=https://chrimsiflix-frontend.onrender.com
EOF
echo -e "${GREEN}✅ Created backend/.env.production${NC}"

cat > frontend/.env.production << EOF
VITE_API_URL=https://chrimsiflix-backend.onrender.com
VITE_SOCKET_URL=https://chrimsiflix-backend.onrender.com
EOF
echo -e "${GREEN}✅ Created frontend/.env.production${NC}"

# Initialize Git
echo ""
echo -e "${BLUE}[6] Setting up Git repository...${NC}"

if [ ! -d .git ]; then
    git init
    git config user.name "ChrimsiFlix Deployer"
    git config user.email "deploy@chrimsiflix.app"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

# Git add and commit
echo -e "${YELLOW}Adding files to Git...${NC}"
git add . > /dev/null
git commit -m "ChrimsiFlix deployment configuration" > /dev/null 2>&1 || true
echo -e "${GREEN}✅ Files committed${NC}"

# Print next steps
echo ""
echo "========================================="
echo "  🚀 Ready for Deployment!"
echo "========================================="
echo ""

cat << EOF

📋 REQUIRED BEFORE DEPLOYMENT:

1. GitHub Account:
   • Create account at github.com
   • Create new repository: chrimsiflix
   • Get your repository URL

2. Supabase (Free PostgreSQL Database):
   • Go to supabase.com
   • Sign up (free)
   • Create new project
   • Copy DATABASE_URL from Settings → Database

3. Choose Deployment Platform:

   ✨ RENDER (Recommended):
      • Go to render.com
      • Sign up with GitHub
      • Connect repository
      • Add environment variables
      • Deploy!

   🚂 RAILWAY:
      • Go to railway.app
      • Sign up with GitHub
      • Create project
      • Add PostgreSQL
      • Deploy!

   ▲ VERCEL (Frontend only):
      • Go to vercel.com
      • Sign up with GitHub
      • Deploy frontend only
      • Use separate backend service

📝 NEXT COMMANDS:

# 1. Push to GitHub
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/YOUR-USERNAME/chrimsiflix.git
git branch -M main
git push -u origin main

# 2. Go to render.com/railway.app and connect GitHub repository

# 3. Add environment variables:
#    - DATABASE_URL (from Supabase)
#    - JWT_SECRET: $JWT_SECRET
#    - CORS_ORIGIN: [your frontend URL]

💾 SAVE YOUR JWT SECRET:
   $JWT_SECRET

EOF

echo ""
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
