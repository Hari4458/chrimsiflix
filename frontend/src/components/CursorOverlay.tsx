import { useEffect, useRef } from 'react'
import { useRoomStore } from '../stores/roomStore'
import socketService from '../services/socket'

export default function CursorOverlay() {
  const { participants, currentUser } = useRoomStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current?.parentElement
    if (!container || !currentUser) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Only emit if within boundaries
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        socketService.moveCursor(x, y)
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [currentUser])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {participants.map((user) => {
        if (user.id === currentUser?.id) return null

        return (
          <div
            key={user.id}
            className="absolute transition-all duration-75"
            style={{
              left: `${user.cursorX}px`,
              top: `${user.cursorY}px`,
            }}
          >
            <div className="flex flex-col items-start">
              <svg
                className="w-6 h-6 text-accent-light"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M0 0l7.08 18.75h2.93l1.53-6.84 6.84-1.53L0 0z" />
              </svg>
              <div className="glass rounded px-2 py-1 text-xs font-semibold text-accent-light whitespace-nowrap mt-1">
                {user.name}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
