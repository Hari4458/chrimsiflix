# ChrimsiFlix 🎬

A modern cloud-based collaborative browser web application where multiple users can interact with the same synchronized website session in real-time.

## 🚀 Features

### Room System
- Create or join rooms using secure random 8-digit codes
- Display name entry
- Room owner automatically assigned
- Real-time participant list

### Shared Website Session
- Room owner enters website URL
- Synchronized page state for all participants
- Real-time navigation sync
- Instant page change reflection

### Real-Time Cursor Collaboration
- Visible cursors with user names
- Synchronized cursor movement
- Multiple cursors simultaneously
- Active user indicators

### Shared Control
- Owner grants/revokes control permissions
- Authorized users can click, scroll, fill forms, navigate
- All actions synchronized
- Show which user performed each action

### Live Chat
- Real-time room chat
- Typing indicators
- Message timestamps
- Online/offline status

### Owner Controls
- End room for everyone
- Lock room
- Kick participants
- Grant/revoke permissions
- Transfer ownership

### Additional Features
- Automatic room cleanup
- Network reconnection
- Server-side security
- Rate limiting
- JWT authentication
- Modern glassmorphism UI
- Mobile responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Deployment**: Docker
- **All free, open-source services**

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional, for containerization)

## 🔧 Installation

### 1. Clone or setup the project
```bash
cd Chrimsiflix
```

### 2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Configure environment variables

**Backend** - Create `.env` in `/backend`:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/chrimsiflix
JWT_SECRET=your-secure-secret-key
CORS_ORIGIN=http://localhost:3000
```

**Frontend** - Create `.env` in `/frontend`:
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Database setup
```bash
cd backend
npm run db:migrate
npm run db:seed  # Optional: seed with sample data
```

### 5. Run development servers

**Terminal 1 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend**:
```bash
cd backend
npm run dev
```

Visit `http://localhost:3000`

## 🐳 Docker Setup

```bash
docker-compose up
```

## 📚 Project Structure

```
chrimsiflix/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── events/
│   │   └── server.ts
│   ├── db/
│   │   └── migrations/
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Server-side permission validation
- Rate limiting (10 requests/minute per IP)
- CORS protection
- Input validation
- Secure room access
- Protection against unauthorized access

## 🎨 UI Design

- Modern dark theme
- Glassmorphism design pattern
- Smooth animations and transitions
- Mobile responsive (mobile-first approach)
- Real-time participant panel
- Integrated chat panel
- Room controls panel
- Live cursor overlays

## 📱 Usage

1. **Create a Room**: Enter your display name and click "Create Room"
2. **Share Room Code**: Share the 8-digit room code with others
3. **Join a Room**: Others enter the code to join
4. **Enter Website URL** (Owner only): Load any website
5. **Share Control**: Owner grants permissions to participants
6. **Collaborate**: All users see the same page and can interact together
7. **Chat**: Real-time chat for communication

## 🤝 Contributing

This is a demonstration project. For improvements or bug reports, please open an issue.

## 📄 License

MIT License - feel free to use and modify

## 🆘 Troubleshooting

**Port already in use**:
```bash
# Change PORT in .env or kill the process
```

**Database connection error**:
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env

**WebSocket connection failed**:
- Check if backend is running
- Verify SOCKET_URL in frontend .env
- Check CORS_ORIGIN in backend .env

## 🚀 Deployment

ChrimsiFlix can be deployed to any cloud platform:
- **Heroku**: Using Procfile and docker-compose
- **AWS**: Using ECS + RDS
- **DigitalOcean**: Using Docker + App Platform
- **Self-hosted**: Using Docker or direct Node.js

---

Built with ❤️ for collaborative browsing
