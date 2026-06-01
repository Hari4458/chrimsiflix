import { useState, useEffect } from 'react'
import { useRoomStore } from '../stores/roomStore'
import socketService from '../services/socket'
import Input from './Input'
import Button from './Button'
import Card from './Card'

interface OwnerControlsPanelProps {
  onEndRoom: () => void
  onTransferOwnership: (userId: string) => void
}

export default function OwnerControlsPanel({
  onEndRoom,
  onTransferOwnership,
}: OwnerControlsPanelProps) {
  const { room, currentUser, participants } = useRoomStore()
  const [urlInput, setUrlInput] = useState(room?.currentUrl || '')

  // Keep input in sync with external changes
  useEffect(() => {
    if (room?.currentUrl) {
      setUrlInput(room.currentUrl)
    }
  }, [room?.currentUrl])

  const handleLoadUrl = () => {
    if (urlInput.trim()) {
      socketService.loadUrl(urlInput)
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-accent-light">Browser Controls</h3>

      {/* Website URL Loader - Available to Everyone */}
      <div className="space-y-2">
        <label className="text-sm text-accent-light font-semibold">
          Website URL
        </label>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com"
            type="url"
            onKeyPress={(e) => e.key === 'Enter' && handleLoadUrl()}
          />
          <Button onClick={handleLoadUrl}>Load</Button>
        </div>
      </div>

      {/* Owner-Only Actions */}
      {currentUser?.isOwner && (
        <>
          <hr className="border-gray-800 my-1" />
          
          <div className="space-y-2">
            <Button
              variant="secondary"
              onClick={() => {
                const locked = !room?.isLocked
                // Toggle lock via API
              }}
              className="w-full"
            >
              {room?.isLocked ? '🔓 Unlock Room' : '🔒 Lock Room'}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-accent-light font-semibold font-semibold block">
              Transfer Ownership
            </label>
            <div className="flex gap-2">
              <select className="flex-1 px-4 py-2.5 rounded-lg glass text-white bg-darker">
                {participants
                  .filter((p) => !p.isOwner)
                  .map((p) => (
                    <option key={p.id} value={p.id} className="bg-darker">
                      {p.name}
                    </option>
                  ))}
              </select>
              <Button
                variant="secondary"
                onClick={() => {
                  const selectEl = document.querySelector('select')
                  if (selectEl) {
                    onTransferOwnership(selectEl.value)
                  }
                }}
              >
                Transfer
              </Button>
            </div>
          </div>

          <Button variant="danger" onClick={onEndRoom} className="w-full">
            End Room
          </Button>
        </>
      )}

      <div className="text-xs text-gray-400 p-3 glass rounded-lg mt-2">
        <p className="font-semibold mb-1">Room Code:</p>
        <p className="font-mono text-accent-light select-all">{room?.code}</p>
      </div>
    </Card>
  )
}
