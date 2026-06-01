#!/bin/bash

echo "🚀 ChrimsiFlix Setup Script"
echo "=========================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL 14+ is installed"
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js ${NODE_VERSION} found"
echo ""

# Create environment files
echo "📝 Setting up environment variables..."

if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://chrimsiflix:chrimsiflix_dev_password@localhost:5432/chrimsiflix
JWT_SECRET=super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ Created backend/.env"
else
    echo "⏭️  backend/.env already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << EOF
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
EOF
    echo "✅ Created frontend/.env.local"
else
    echo "⏭️  frontend/.env.local already exists"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

echo "✅ Dependencies installed"
echo ""

# Run migrations
echo "🗄️  Setting up database..."
cd backend
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "⚠️  Database migration failed. Make sure PostgreSQL is running"
    echo "   Connection string: postgresql://chrimsiflix:chrimsiflix_dev_password@localhost:5432/chrimsiflix"
else
    echo "✅ Database setup complete"
fi
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📖 To start development:"
echo ""
echo "Terminal 1 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Terminal 2 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "📚 For more information, see DEVELOPMENT.md"
