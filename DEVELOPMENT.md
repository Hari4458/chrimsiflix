## ChrimsiFlix - Development Guide

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **PostgreSQL** 14.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **Git** (optional, for version control)

### 🚀 Quick Start

#### 1. Setup Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://chrimsiflix:chrimsiflix_dev_password@localhost:5432/chrimsiflix
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

#### 3. Setup Database

```bash
cd backend
npm run db:migrate
```

This creates the required tables:
- `rooms` - Room data and configuration
- `users` - User sessions and permissions
- `chat_messages` - Chat history

#### 4. Start Development Servers

**Option A: Separate Terminals**

Terminal 1 - Frontend:
```bash
cd frontend
npm run dev
```
Runs on: `http://localhost:3000`

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```
Runs on: `http://localhost:5000`

**Option B: VS Code Tasks**
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Select "Tasks: Run Task"
4. Choose "Frontend Dev" and "Backend Dev"

### 📁 Project Structure

```
chrimsiflix/
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ParticipantsPanel.tsx
│   │   │   ├── OwnerControlsPanel.tsx
│   │   │   └── CursorOverlay.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   └── RoomPage.tsx
│   │   ├── services/         # API and Socket services
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── stores/           # Zustand store
│   │   │   └── roomStore.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── styles/           # CSS styles
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── server.ts         # Main Express app
│   │   ├── db.ts             # Database connection
│   │   ├── types.ts          # TypeScript types
│   │   ├── utils.ts          # Utility functions
│   │   ├── services.ts       # Database services
│   │   ├── routes.ts         # API routes
│   │   ├── middlewares.ts    # Express middlewares
│   │   └── events.ts         # Socket.IO events
│   ├── db/
│   │   └── migrations/
│   │       └── run.ts        # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   ├── tasks.json
│   └── launch.json
├── README.md
└── .gitignore
```

### 🔧 Available Commands

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checker
```

**Backend:**
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checker
```

### 🗄️ Database Schema

**rooms table:**
```sql
- id (UUID) - Primary key
- code (VARCHAR) - 8-digit room code (unique)
- owner_id (UUID) - Room owner
- is_locked (BOOLEAN) - Room lock status
- current_url (VARCHAR) - Current website URL
- created_at (TIMESTAMP) - Creation time
- updated_at (TIMESTAMP) - Last update time
```

**users table:**
```sql
- id (UUID) - Primary key
- name (VARCHAR) - User display name
- room_id (UUID) - Foreign key to rooms
- is_owner (BOOLEAN) - Is room owner
- has_control (BOOLEAN) - Has website control
- cursor_x (INT) - Cursor X position
- cursor_y (INT) - Cursor Y position
- created_at (TIMESTAMP) - Join time
```

**chat_messages table:**
```sql
- id (UUID) - Primary key
- room_id (UUID) - Foreign key to rooms
- user_id (UUID) - Foreign key to users
- message (TEXT) - Message content
- created_at (TIMESTAMP) - Send time
```

### 🔐 Authentication Flow

1. User enters display name and creates/joins room
2. Server generates JWT token with `userId` and `roomId`
3. Token stored in `localStorage` on client
4. Token sent in `Authorization: Bearer <token>` header
5. Token verified on backend for protected routes
6. Socket.IO connection includes token in auth payload

### 📡 Real-Time Features

**Socket.IO Events:**
- `room:join` - User joins room
- `room:leave` - User leaves room
- `user:joined` - New user joined notification
- `user:left` - User left notification
- `cursor:move` - Cursor position update
- `chat:message` - Chat message
- `chat:typing` - Typing indicator
- `website:load` - Load website URL
- `website:action` - Website interaction

### 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - 30 requests per minute per IP
- **CORS Protection** - Whitelist origins
- **Input Validation** - Validate all inputs
- **Server-side Permissions** - Verify user permissions
- **Room Isolation** - Users only access their room

### 🐳 Docker Deployment

```bash
# Build and run
docker-compose up

# With rebuild
docker-compose up --build

# Detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

Ports:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

### 🚨 Troubleshooting

**Port Already in Use:**
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

**Database Connection Error:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL is correct
3. Verify credentials
4. Run migrations: `npm run db:migrate`

**WebSocket Connection Failed:**
1. Check backend is running on port 5000
2. Verify CORS_ORIGIN in .env
3. Check firewall settings
4. Try different transport: `transports: ['polling']`

**Module Not Found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 📊 Performance Tips

1. **Frontend:**
   - Use React DevTools profiler
   - Enable Vite's build analysis
   - Lazy load components

2. **Backend:**
   - Use connection pooling (already configured)
   - Add database indexes (migrations include them)
   - Monitor Socket.IO memory usage

3. **Database:**
   - Use appropriate indexes
   - Archive old rooms regularly
   - Backup frequently

### 🔄 Deployment Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS for WebSocket (`wss://`)
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] Enable CORS only for your domains
- [ ] Set up rate limiting appropriately
- [ ] Regular backups

### 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Socket.IO Docs](https://socket.io/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

### 📄 License

MIT License - Feel free to use this project for any purpose.

---

Happy coding! 🚀
