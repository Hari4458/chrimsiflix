import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { JWTPayload } from './types.js'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'
const JWT_EXPIRES_IN = '24h'

export const generateToken = (
  userId: string,
  roomId: string
): string => {
  return jwt.sign(
    { userId, roomId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export const generateRoomCode = (): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const generateId = (): string => uuidv4()
