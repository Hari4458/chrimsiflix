import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import routes from './routes.js'
import setupSocketEvents from './events.js'

dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(express.json())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many requests, please try again later',
})

app.use(limiter)

// Routes
app.use(routes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Setup Socket.IO events
setupSocketEvents(io)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  })
})

// Start server
const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📡 WebSocket ready at ws://localhost:${PORT}`)
})

export default app
