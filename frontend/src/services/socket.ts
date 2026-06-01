import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket: Socket | null = null

export const socketService = {
  connect: (token?: string): Socket => {
    if (socket?.connected) return socket

    socket = io(SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem('token') || '',
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling'],
    })

    return socket
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  },

  getSocket: (): Socket | null => socket,

  on: <T = any>(event: string, callback: (data: T) => void) => {
    if (socket) {
      socket.on(event, callback)
    }
  },

  off: (event: string, callback?: any) => {
    if (socket) {
      socket.off(event, callback)
    }
  },

  emit: <T = any>(event: string, data?: T) => {
    if (socket?.connected) {
      socket.emit(event, data)
    }
  },

  // Room events
  joinRoom: (roomCode: string) => {
    socket?.emit('room:join', { code: roomCode })
  },

  leaveRoom: () => {
    socket?.emit('room:leave')
  },

  // Cursor events
  moveCursor: (x: number, y: number) => {
    socket?.emit('cursor:move', { x, y })
  },

  // Chat events
  sendMessage: (message: string) => {
    socket?.emit('chat:message', { text: message })
  },

  typingIndicator: (isTyping: boolean) => {
    socket?.emit('chat:typing', { isTyping })
  },

  // Website events
  loadUrl: (url: string) => {
    socket?.emit('website:load', { url })
  },

  recordAction: (type: string, selector?: string, value?: string) => {
    socket?.emit('website:action', { type, selector, value })
  },

  // Control events
  requestControl: () => {
    socket?.emit('control:request')
  },

  releaseControl: () => {
    socket?.emit('control:release')
  },
}

export default socketService
