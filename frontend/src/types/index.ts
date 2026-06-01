export interface User {
  id: string
  name: string
  roomId: string
  isOwner: boolean
  hasControl: boolean
  cursorX: number
  cursorY: number
  lastActive: number
}

export interface Room {
  id: string
  code: string
  ownerId: string
  isLocked: boolean
  createdAt: string
  participants: User[]
  currentUrl?: string
  chatHistory: ChatMessage[]
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  type: 'user' | 'system'
}

export interface CursorPosition {
  userId: string
  userName: string
  x: number
  y: number
}

export interface WebsiteAction {
  userId: string
  userName: string
  type: 'click' | 'scroll' | 'navigate' | 'input'
  selector?: string
  value?: string
  timestamp: string
}

export interface SocketEvents {
  // Connection
  'connect': void
  'disconnect': void
  'reconnect_attempt': number
  
  // Room
  'room:joined': Room
  'room:left': { roomId: string; userId: string }
  'room:updated': Room
  'room:closed': { roomId: string; reason: string }
  'room:locked': { roomId: string; locked: boolean }
  
  // Users
  'user:joined': User
  'user:left': { userId: string; userName: string }
  'user:list': User[]
  
  // Cursors
  'cursor:move': CursorPosition
  'cursor:hide': string
  
  // Chat
  'chat:message': ChatMessage
  'chat:typing': { userId: string; userName: string; isTyping: boolean }
  
  // Website
  'website:load': { url: string }
  'website:action': WebsiteAction
  'website:state': { html: string; url: string }
  
  // Control
  'control:granted': { userId: string }
  'control:revoked': { userId: string }
  'control:requested': { userId: string; userName: string }
  
  // Errors
  'error': { message: string; code: string }
}
