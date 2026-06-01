import { Router, Request, Response } from 'express'
import { authenticateToken } from './middlewares.js'
import { generateToken, generateRoomCode } from './utils.js'
import { UserService, RoomService, ChatService } from './services.js'
import { JWTPayload } from './types.js'

const router = Router()

// Create room
router.post('/rooms/create', async (req: Request, res: Response) => {
  try {
    const { userName } = req.body

    if (!userName || userName.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid user name' })
    }

    const roomCode = generateRoomCode()
    const room = await RoomService.createRoom(null, roomCode)
    const user = await UserService.createUser(userName, room.id, true)
    await RoomService.updateRoomOwner(room.id, user.id)
    room.ownerId = user.id
    const token = generateToken(user.id, room.id)

    res.json({
      token,
      room: {
        ...room,
        participants: [user],
      },
      user,
    })
  } catch (error: any) {
    console.error('Create room error:', error)
    res.status(500).json({ message: 'Failed to create room' })
  }
})

// Join room
router.post('/rooms/join', async (req: Request, res: Response) => {
  try {
    const { roomCode, userName } = req.body

    if (!roomCode || !userName) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const room = await RoomService.getRoomById(roomCode)
    if (!room) {
      const roomByCode = await RoomService.getRoomByCode(roomCode)
      if (!roomByCode) {
        return res.status(404).json({ message: 'Room not found' })
      }
    }

    const targetRoom = room || (await RoomService.getRoomByCode(roomCode))!

    if (targetRoom.isLocked) {
      return res.status(403).json({ message: 'Room is locked' })
    }

    const user = await UserService.createUser(
      userName,
      targetRoom.id,
      false
    )
    const participants = await UserService.getUsersByRoom(targetRoom.id)
    const messages = await ChatService.getRoomMessages(targetRoom.id)

    const token = generateToken(user.id, targetRoom.id)

    res.json({
      token,
      room: {
        ...targetRoom,
        participants,
        chatHistory: messages,
      },
      user,
    })
  } catch (error: any) {
    console.error('Join room error:', error)
    res.status(500).json({ message: 'Failed to join room' })
  }
})

// Get room info
router.get('/rooms/:roomId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const room = await RoomService.getRoomById(roomId)

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    const participants = await UserService.getUsersByRoom(roomId)
    const messages = await ChatService.getRoomMessages(roomId)

    res.json({
      ...room,
      participants,
      chatHistory: messages,
    })
  } catch (error: any) {
    console.error('Get room error:', error)
    res.status(500).json({ message: 'Failed to get room info' })
  }
})

// Leave room
router.post('/rooms/:roomId/leave', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const token = req.headers.authorization?.split(' ')[1]
    const payload = token ? JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as JWTPayload : null
    
    if (!payload || payload.userId === undefined) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    await UserService.deleteUser(payload.userId)
    const count = await RoomService.getRoomParticipantCount(roomId)

    if (count === 0) {
      await ChatService.deleteRoomMessages(roomId)
      await RoomService.deleteRoom(roomId)
    }

    res.json({ message: 'Left room' })
  } catch (error: any) {
    console.error('Leave room error:', error)
    res.status(500).json({ message: 'Failed to leave room' })
  }
})

// Update room URL
router.post('/rooms/:roomId/url', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const { url } = req.body

    const room = await RoomService.getRoomById(roomId)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    // Verify owner
    const token = req.headers.authorization?.split(' ')[1]
    const payload = token ? JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as JWTPayload : null
    const user = payload ? await UserService.getUserById(payload.userId) : null

    if (!user || !user.isOwner) {
      return res.status(403).json({ message: 'Only room owner can update URL' })
    }

    await RoomService.updateRoomUrl(roomId, url)
    res.json({ message: 'URL updated' })
  } catch (error: any) {
    console.error('Update URL error:', error)
    res.status(500).json({ message: 'Failed to update URL' })
  }
})

// Grant control
router.post('/rooms/:roomId/grant-control', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const { userId } = req.body

    await UserService.grantControl(userId)
    res.json({ message: 'Control granted' })
  } catch (error: any) {
    console.error('Grant control error:', error)
    res.status(500).json({ message: 'Failed to grant control' })
  }
})

// Revoke control
router.post('/rooms/:roomId/revoke-control', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const { userId } = req.body

    await UserService.revokeControl(userId)
    res.json({ message: 'Control revoked' })
  } catch (error: any) {
    console.error('Revoke control error:', error)
    res.status(500).json({ message: 'Failed to revoke control' })
  }
})

// Kick user
router.post('/rooms/:roomId/kick', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const { userId } = req.body

    await UserService.deleteUser(userId)
    res.json({ message: 'User kicked' })
  } catch (error: any) {
    console.error('Kick user error:', error)
    res.status(500).json({ message: 'Failed to kick user' })
  }
})

// Lock room
router.post('/rooms/:roomId/lock', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const { locked } = req.body

    await RoomService.lockRoom(roomId, locked)
    res.json({ message: locked ? 'Room locked' : 'Room unlocked' })
  } catch (error: any) {
    console.error('Lock room error:', error)
    res.status(500).json({ message: 'Failed to lock room' })
  }
})

// End room
router.post('/rooms/:roomId/end', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params

    const room = await RoomService.getRoomById(roomId)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    // Delete all users in room
    const users = await UserService.getUsersByRoom(roomId)
    for (const user of users) {
      await UserService.deleteUser(user.id)
    }

    // Delete messages and room
    await ChatService.deleteRoomMessages(roomId)
    await RoomService.deleteRoom(roomId)

    res.json({ message: 'Room ended' })
  } catch (error: any) {
    console.error('End room error:', error)
    res.status(500).json({ message: 'Failed to end room' })
  }
})

// Transfer ownership
router.post('/rooms/:roomId/transfer-ownership', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const { userId } = req.body

    const targetUser = await UserService.getUserById(userId)
    if (!targetUser || targetUser.roomId !== roomId) {
      return res.status(404).json({ message: 'User not found in room' })
    }

    res.json({ message: 'Ownership transferred' })
  } catch (error: any) {
    console.error('Transfer ownership error:', error)
    res.status(500).json({ message: 'Failed to transfer ownership' })
  }
})

export default router
