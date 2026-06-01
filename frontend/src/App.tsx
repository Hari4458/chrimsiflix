import { useState, useEffect } from 'react'
import { useRoomStore } from './stores/roomStore'
import socketService from './services/socket'
import LandingPage from './pages/LandingPage'
import RoomPage from './pages/RoomPage'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const { room, currentUser, setConnected, isConnected } = useRoomStore()

  useEffect(() => {
    if (room && currentUser) {
      const token = localStorage.getItem('token') || ''
      socketService.connect(token)
      socketService.joinRoom(room.code)
      setConnected(true)
    } else {
      socketService.disconnect()
      setConnected(false)
    }

    return () => {
      socketService.disconnect()
      setConnected(false)
    }
  }, [room, currentUser, setConnected])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-darker to-dark">
      {!room || !currentUser ? (
        <LandingPage onLoading={setIsLoading} />
      ) : (
        <RoomPage />
      )}
    </div>
  )
}

export default App
