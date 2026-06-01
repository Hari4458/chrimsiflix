export interface User {
  id: string
  name: string
  roomId: string
  isOwner: boolean
  hasControl: boolean
  cursorX: number
  cursorY: number
  createdAt: string
}

export interface Room {
  id: string
  code: string
  ownerId: string
  isLocked: boolean
  currentUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  roomId: string
  userId: string
  message: string
  createdAt: string
}

export interface RoomUser {
  userId: string
  roomId: string
  isOwner: boolean
  hasControl: boolean
  cursorX: number
  cursorY: number
  joinedAt: string
}

export interface JWTPayload {
  userId: string
  roomId: string
  iat: number
  exp: number
}
