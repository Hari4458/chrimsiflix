import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  setToken: (token: string) => {
    localStorage.setItem('token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  getToken: () => localStorage.getItem('token'),
  clearToken: () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
  },
}

export const roomService = {
  createRoom: async (userName: string) => {
    const { data } = await api.post('/rooms/create', { userName })
    return data
  },
  
  joinRoom: async (roomCode: string, userName: string) => {
    const { data } = await api.post('/rooms/join', { roomCode, userName })
    return data
  },

  leaveRoom: async (roomId: string) => {
    const { data } = await api.post(`/rooms/${roomId}/leave`)
    return data
  },

  getRoomInfo: async (roomId: string) => {
    const { data } = await api.get(`/rooms/${roomId}`)
    return data
  },

  updateRoomUrl: async (roomId: string, url: string) => {
    const { data } = await api.post(`/rooms/${roomId}/url`, { url })
    return data
  },

  grantControl: async (roomId: string, userId: string) => {
    const { data } = await api.post(`/rooms/${roomId}/grant-control`, { userId })
    return data
  },

  revokeControl: async (roomId: string, userId: string) => {
    const { data } = await api.post(`/rooms/${roomId}/revoke-control`, { userId })
    return data
  },

  kickUser: async (roomId: string, userId: string) => {
    const { data } = await api.post(`/rooms/${roomId}/kick`, { userId })
    return data
  },

  lockRoom: async (roomId: string, locked: boolean) => {
    const { data } = await api.post(`/rooms/${roomId}/lock`, { locked })
    return data
  },

  endRoom: async (roomId: string) => {
    const { data } = await api.post(`/rooms/${roomId}/end`)
    return data
  },

  transferOwnership: async (roomId: string, userId: string) => {
    const { data } = await api.post(`/rooms/${roomId}/transfer-ownership`, { userId })
    return data
  },
}

export default api
