@echo off
echo 🚀 ChrimsiFlix Setup Script
echo ==========================
echo.

echo 📋 Checking prerequisites...

where /q node
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
echo.

echo 📝 Setting up environment variables...

if not exist "backend\.env" (
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo DATABASE_URL=postgresql://chrimsiflix:chrimsiflix_dev_password@localhost:5432/chrimsiflix
        echo JWT_SECRET=super-secret-jwt-key-change-in-production
        echo CORS_ORIGIN=http://localhost:3000
    ) > backend\.env
    echo ✅ Created backend\.env
) else (
    echo ⏭️  backend\.env already exists
)

if not exist "frontend\.env.local" (
    (
        echo VITE_API_URL=http://localhost:5000
        echo VITE_SOCKET_URL=http://localhost:5000
    ) > frontend\.env.local
    echo ✅ Created frontend\.env.local
) else (
    echo ⏭️  frontend\.env.local already exists
)

echo.

echo 📦 Installing dependencies...

echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
cd ..

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
cd ..

echo ✅ Dependencies installed
echo.

echo 🗄️  Setting up database...
cd backend
call npm run db:migrate
if errorlevel 1 (
    echo ⚠️  Database migration failed. Make sure PostgreSQL is running
    echo    Connection string: postgresql://chrimsiflix:chrimsiflix_dev_password@localhost:5432/chrimsiflix
) else (
    echo ✅ Database setup complete
)
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 📖 To start development:
echo.
echo Terminal 1 - Frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Terminal 2 - Backend:
echo   cd backend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo 📚 For more information, see DEVELOPMENT.md
