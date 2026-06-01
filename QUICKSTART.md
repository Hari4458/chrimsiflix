# ChrimsiFlix - Quick Start Guide

Get ChrimsiFlix running in 5 minutes! ⚡

## Prerequisites

- **Node.js** 18.0.0+ - [Download](https://nodejs.org/)
- **PostgreSQL** 14.0+ - [Download](https://www.postgresql.org/download/)

## Step 1: Clone/Setup Project

```bash
# Navigate to the project
cd Chrimsiflix
```

## Step 2: Run Setup Script

### Windows
```bash
.\setup.bat
```

### macOS/Linux
```bash
bash setup.sh
```

This will:
- ✅ Install frontend dependencies
- ✅ Install backend dependencies
- ✅ Create environment files
- ✅ Setup PostgreSQL database

## Step 3: Start Development Servers

### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:3000**

### Terminal 2 - Backend
```bash
cd backend
npm run dev
```

Backend runs on: **http://localhost:5000**

## Step 4: Open in Browser

Visit: **http://localhost:3000**

## Usage

1. **Create a Room**
   - Enter your display name
   - Click "Create Room"
   - Share the 8-digit code

2. **Join a Room**
   - Enter your display name
   - Enter the room code
   - Click "Join Room"

3. **Load a Website** (Owner only)
   - Enter a website URL in the Owner Controls
   - Click "Load"
   - All users will see the same website

4. **Share Control**
   - Owner can grant/revoke control to participants
   - Users with control can interact with the website

5. **Chat**
   - Send messages in the chat panel
   - See typing indicators
   - Check online status

## Troubleshooting

### Port Already in Use

**Port 3000 (Frontend):**
```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
cd frontend
npm run dev -- --port 3001
```

**Port 5000 (Backend):**
```bash
# Kill process
lsof -ti:5000 | xargs kill -9

# Or change in backend/.env
PORT=5001
```

### Database Connection Error

1. Make sure PostgreSQL is running
2. Check database URL in `backend/.env`
3. Verify credentials match your PostgreSQL setup
4. Run migrations again: `cd backend && npm run db:migrate`

### Dependencies Installation Error

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### WebSocket Connection Failed

1. Ensure backend is running on port 5000
2. Check `CORS_ORIGIN` in `backend/.env` matches your frontend URL
3. Check firewall settings
4. Restart both servers

## Docker Setup (Optional)

If you prefer to use Docker:

```bash
docker-compose up
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432

## Environment Variables

If you need to customize settings, edit these files:

**backend/.env:**
```env
PORT=5000
DATABASE_URL=postgresql://chrimsiflix:password@localhost:5432/chrimsiflix
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env.local:**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Available Commands

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint code
npm run type-check   # Type checking
```

### Backend
```bash
npm run dev          # Development server
npm run build        # Build TypeScript
npm start            # Production server
npm run db:migrate   # Run migrations
npm run lint         # Lint code
npm run type-check   # Type checking
```

## File Structure

```
Chrimsiflix/
├── frontend/              # React app
│   ├── src/components/    # React components
│   ├── src/pages/         # Page components
│   └── package.json
├── backend/               # Express server
│   ├── src/              # Backend code
│   ├── db/migrations/    # Database setup
│   └── package.json
├── docker-compose.yml    # Docker setup
├── README.md             # Full documentation
├── DEVELOPMENT.md        # Development guide
├── API.md                # API documentation
└── setup.sh/bat          # Setup scripts
```

## Features Included

✅ Create/join rooms with 8-digit codes  
✅ Real-time collaborative browsing  
✅ Live cursor collaboration  
✅ Shared website control  
✅ Real-time chat  
✅ Permission management  
✅ Modern glassmorphism UI  
✅ Mobile responsive  
✅ Docker ready  
✅ Authentication & security  

## Next Steps

1. **Customize**: Edit components in `frontend/src/components/`
2. **Add Features**: Extend backend routes in `backend/src/routes.ts`
3. **Deploy**: Use `docker-compose` for deployment
4. **Learn More**: Read [DEVELOPMENT.md](./DEVELOPMENT.md) for in-depth guide

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🛠️ [Development Guide](./DEVELOPMENT.md)
- 📡 [API Documentation](./API.md)
- 🐛 Check terminal output for errors

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Setup database |
| `docker-compose up` | Docker deployment |

---

**Happy coding! 🚀**

Questions? Check the documentation or adjust settings in `.env` files.
