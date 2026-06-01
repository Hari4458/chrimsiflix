import { useState } from 'react'
import { useRoomStore } from '../stores/roomStore'
import { roomService, authService } from '../services/api'
import socketService from '../services/socket'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

interface LandingPageProps {
  onLoading: (loading: boolean) => void
}

export default function LandingPage({ onLoading }: LandingPageProps) {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [displayName, setDisplayName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { setRoom, setCurrentUser, setParticipants } = useRoomStore()

  const handleCreateRoom = async () => {
    if (!displayName.trim()) {
      setError('Please enter a display name')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await roomService.createRoom(displayName)
      authService.setToken(response.token)

      setRoom(response.room)
      setCurrentUser(response.user)
      setParticipants([response.user])

      socketService.connect(response.token)
      socketService.joinRoom(response.room.code)

      onLoading(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create room')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!displayName.trim()) {
      setError('Please enter a display name')
      return
    }

    if (!roomCode.trim() || roomCode.length !== 8) {
      setError('Please enter a valid 8-digit room code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await roomService.joinRoom(roomCode, displayName)
      authService.setToken(response.token)

      setRoom(response.room)
      setCurrentUser(response.user)
      setParticipants(response.room.participants)

      socketService.connect(response.token)
      socketService.joinRoom(response.room.code)

      onLoading(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join room')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">
            ChrimsiFlix
          </h1>
          <p className="text-gray-300">Collaborative Browser Workspace</p>
        </div>

        {mode === 'choose' ? (
          <div className="space-y-4 animate-fade-in">
            <Card className="p-8">
              <p className="text-gray-300 mb-6 text-center">
                Create a new room or join an existing one to start collaborating
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => setMode('create')}
                  className="w-full"
                  size="lg"
                >
                  ✨ Create Room
                </Button>
                <Button
                  onClick={() => setMode('join')}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  📍 Join Room
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-gray-400 text-center">
                💡 Tip: Invite friends to your room using the 8-digit room code
              </p>
            </Card>
          </div>
        ) : (
          <Card className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-accent-light mb-6">
              {mode === 'create' ? '✨ Create Room' : '📍 Join Room'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  disabled={isLoading}
                />
              </div>

              {mode === 'join' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Room Code
                  </label>
                  <Input
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="8-digit code"
                    maxLength={8}
                    disabled={isLoading}
                  />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-600/20 border border-red-500/50 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setMode('choose')
                    setError('')
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={
                    mode === 'create' ? handleCreateRoom : handleJoinRoom
                  }
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={!displayName.trim()}
                >
                  {mode === 'create' ? 'Create' : 'Join'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
