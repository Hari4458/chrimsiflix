import { useEffect, useState } from 'react'
import { useRoomStore } from '../stores/roomStore'
import { roomService } from '../services/api'
import socketService from '../services/socket'
import Button from '../components/Button'
import ChatPanel from '../components/ChatPanel'
import ParticipantsPanel from '../components/ParticipantsPanel'
import OwnerControlsPanel from '../components/OwnerControlsPanel'
import CursorOverlay from '../components/CursorOverlay'
import BrowserFrame from '../components/BrowserFrame'
import Card from '../components/Card'

export default function RoomPage() {
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const {
    room,
    currentUser,
    participants,
    setRoom,
    setCurrentUser,
    setParticipants,
    addChatMessage,
    updateUserCursor,
  } = useRoomStore()

  useEffect(() => {
    if (!room || !currentUser) return

    // Setup socket listeners
    socketService.on('room:updated', (updatedRoom) => {
      setRoom(updatedRoom)
      setParticipants(updatedRoom.participants)
    })

    socketService.on('user:joined', (newUser) => {
      setParticipants([...participants, newUser])
    })

    socketService.on('user:left', ({ userId }) => {
      setParticipants(participants.filter((p) => p.id !== userId))
    })

    socketService.on('cursor:move', ({ userId, x, y }) => {
      updateUserCursor(userId, x, y)
    })

    socketService.on('chat:message', (message) => {
      addChatMessage(message)
    })

    socketService.on('room:closed', () => {
      handleLeaveRoom()
    })

    socketService.on('error', ({ message }) => {
      console.error('Socket error:', message)
    })

    return () => {
      socketService.off('room:updated')
      socketService.off('user:joined')
      socketService.off('user:left')
      socketService.off('cursor:move')
      socketService.off('chat:message')
      socketService.off('room:closed')
      socketService.off('error')
    }
  }, [room, currentUser, participants])

  const handleLeaveRoom = async () => {
    if (room) {
      await roomService.leaveRoom(room.id)
      socketService.leaveRoom()
      setRoom(null)
      setCurrentUser(null)
      setParticipants([])
    }
  }

  const handleGrantControl = async (userId: string) => {
    if (room) {
      await roomService.grantControl(room.id, userId)
    }
  }

  const handleRevokeControl = async (userId: string) => {
    if (room) {
      await roomService.revokeControl(room.id, userId)
    }
  }

  const handleKick = async (userId: string) => {
    if (room) {
      await roomService.kickUser(room.id, userId)
    }
  }

  const handleEndRoom = async () => {
    if (room) {
      await roomService.endRoom(room.id)
      handleLeaveRoom()
    }
  }

  const handleTransferOwnership = async (userId: string) => {
    if (room) {
      await roomService.transferOwnership(room.id, userId)
    }
  }

  if (!room || !currentUser) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <CursorOverlay />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent-light">ChrimsiFlix</h1>
          <p className="text-gray-400">Room: {room.code}</p>
        </div>
        <Button variant="danger" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="h-96 md:h-screen flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-accent-light">
                🌐 Shared Browser
              </h3>
              {isLoadingUrl && (
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <div className="flex-1 rounded-lg overflow-hidden bg-darker">
              <BrowserFrame
                url={room.currentUrl}
                isLoading={isLoadingUrl}
              />
            </div>
            {room.currentUrl && (
              <p className="text-xs text-gray-400 mt-2 truncate">{room.currentUrl}</p>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentUser.isOwner && (
            <OwnerControlsPanel
              onEndRoom={handleEndRoom}
              onTransferOwnership={handleTransferOwnership}
            />
          )}

          <ParticipantsPanel
            onGrantControl={handleGrantControl}
            onRevokeControl={handleRevokeControl}
            onKick={handleKick}
          />

          <ChatPanel />
        </div>
      </div>
    </div>
  )
}
