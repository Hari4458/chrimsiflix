import { Server, Socket } from 'socket.io'
import { UserService, RoomService, ChatService } from './services.js'
import { generateId } from './utils.js'

interface CustomSocket extends Socket {
  userId?: string
  roomId?: string
}

export const setupSocketEvents = (io: Server) => {
  io.on('connection', (socket: CustomSocket) => {
    console.log('User connected:', socket.id)

    // Extract user and room from token
    const token = socket.handshake.auth.token
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        socket.userId = payload.userId
        socket.roomId = payload.roomId
      } catch (error) {
        console.error('Token parsing error:', error)
      }
    }

    // Join room
    socket.on('room:join', async (data: { code: string }) => {
      try {
        if (!socket.roomId || !socket.userId) {
          socket.emit('error', { message: 'Not authenticated', code: 'AUTH_ERROR' })
          return
        }

        socket.join(socket.roomId)
        const participants = await UserService.getUsersByRoom(socket.roomId)
        const room = await RoomService.getRoomById(socket.roomId)
        const user = await UserService.getUserById(socket.userId)

        // Notify others
        if (user) {
          socket.to(socket.roomId).emit('user:joined', user)
        }

        // Send room info to joining user
        socket.emit('room:joined', {
          id: socket.roomId,
          participants,
          currentUrl: room?.currentUrl,
        })
      } catch (error) {
        console.error('Join room error:', error)
        socket.emit('error', { message: 'Failed to join room', code: 'JOIN_ERROR' })
      }
    })

    // Leave room
    socket.on('room:leave', async () => {
      try {
        if (!socket.roomId || !socket.userId) return

        await UserService.deleteUser(socket.userId)
        socket.to(socket.roomId).emit('user:left', {
          userId: socket.userId,
          userName: 'User',
        })

        const count = await RoomService.getRoomParticipantCount(socket.roomId)
        if (count === 0) {
          await ChatService.deleteRoomMessages(socket.roomId)
          await RoomService.deleteRoom(socket.roomId)
          io.to(socket.roomId).emit('room:closed', {
            roomId: socket.roomId,
            reason: 'All participants left',
          })
        }

        socket.leave(socket.roomId)
      } catch (error) {
        console.error('Leave room error:', error)
      }
    })

    // Cursor movement
    socket.on('cursor:move', (data: { x: number; y: number }) => {
      if (!socket.roomId || !socket.userId) return

      try {
        const x = Math.round(data.x)
        const y = Math.round(data.y)

        socket.to(socket.roomId).emit('cursor:move', {
          userId: socket.userId,
          x,
          y,
        })
      } catch (error) {
        console.error('Cursor move error:', error)
      }
    })

    // Chat message
    socket.on('chat:message', async (data: { text: string }) => {
      if (!socket.roomId || !socket.userId) return

      try {
        const user = await UserService.getUserById(socket.userId)
        const messageId = await ChatService.addMessage(
          socket.roomId,
          socket.userId,
          data.text
        )

        const message = {
          id: messageId,
          userId: socket.userId,
          userName: user?.name || 'Unknown',
          message: data.text,
          timestamp: new Date().toISOString(),
          type: 'user' as const,
        }

        io.to(socket.roomId).emit('chat:message', message)
      } catch (error) {
        console.error('Chat error:', error)
      }
    })

    // Typing indicator
    socket.on('chat:typing', (data: { isTyping: boolean }) => {
      if (!socket.roomId || !socket.userId) return

      socket.to(socket.roomId).emit('chat:typing', {
        userId: socket.userId,
        userName: 'User',
        isTyping: data.isTyping,
      })
    })

    // Load URL
    socket.on('website:load', async (data: { url: string }) => {
      if (!socket.roomId) return

      try {
        await RoomService.updateRoomUrl(socket.roomId, data.url)
        io.to(socket.roomId).emit('website:load', {
          url: data.url,
        })
      } catch (error) {
        console.error('Load URL error:', error)
      }
    })

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id)
      if (socket.roomId && socket.userId) {
        socket.to(socket.roomId).emit('user:left', {
          userId: socket.userId,
          userName: 'User',
        })
      }
    })
  })
}

export default setupSocketEvents
