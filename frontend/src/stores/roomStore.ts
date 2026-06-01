import { create } from 'zustand'
import { User, Room, ChatMessage } from '../types'

interface RoomState {
  room: Room | null
  currentUser: User | null
  participants: User[]
  chatMessages: ChatMessage[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setRoom: (room: Room | null) => void
  setCurrentUser: (user: User | null) => void
  setParticipants: (participants: User[]) => void
  addChatMessage: (message: ChatMessage) => void
  setConnected: (connected: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUserCursor: (userId: string, x: number, y: number) => void
}

export const useRoomStore = create<RoomState>((set) => ({
  room: null,
  currentUser: null,
  participants: [],
  chatMessages: [],
  isConnected: false,
  isLoading: false,
  error: null,

  setRoom: (room) => set({ room }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setParticipants: (participants) => set({ participants }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updateUserCursor: (userId, x, y) => set((state) => ({
    participants: state.participants.map((p) =>
      p.id === userId ? { ...p, cursorX: x, cursorY: y } : p
    ),
  })),
}))
