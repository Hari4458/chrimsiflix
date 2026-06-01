# ChrimsiFlix - AI Assistant Instructions

ChrimsiFlix is a modern collaborative browser web application that allows multiple users to view and interact with the same synchronized website session in real-time.

## Project Structure
- `/frontend` - React + TypeScript + Tailwind CSS application
- `/backend` - Node.js + Express + Socket.IO server
- `/docker` - Docker configuration files

## Key Technologies
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Database: PostgreSQL
- Authentication: JWT
- Real-time Sync: Socket.IO

## Development Commands
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `docker-compose up` - Start with Docker

## Core Features
1. Room system with 8-digit secure codes
2. Shared website session with synchronized state
3. Real-time cursor collaboration
4. Shared control with permission management
5. Live chat with typing indicators
6. Owner controls (kick, lock, transfer ownership)
7. Automatic room cleanup
8. Reconnection handling
9. Security and rate limiting
10. Modern glassmorphism UI with animations
