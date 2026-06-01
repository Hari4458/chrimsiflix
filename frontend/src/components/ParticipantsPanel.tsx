import { useRoomStore } from '../stores/roomStore'
import Button from './Button'
import Card from './Card'

interface ParticipantsPanelProps {
  onGrantControl: (userId: string) => void
  onRevokeControl: (userId: string) => void
  onKick: (userId: string) => void
}

export default function ParticipantsPanel({
  onGrantControl,
  onRevokeControl,
  onKick,
}: ParticipantsPanelProps) {
  const { participants, currentUser, room } = useRoomStore()

  const isOwner = currentUser?.isOwner

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-accent-light mb-4">
        Participants ({participants.length})
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {participants.map((user) => (
          <div
            key={user.id}
            className="glass rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="font-semibold text-white">
                {user.name}
                {user.isOwner && (
                  <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                    Owner
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {user.hasControl ? '✓ Has Control' : 'No Control'}
              </p>
            </div>

            {isOwner && user.id !== currentUser.id && (
              <div className="flex gap-1">
                {!user.hasControl ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onGrantControl(user.id)}
                  >
                    Grant
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onRevokeControl(user.id)}
                  >
                    Revoke
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onKick(user.id)}
                >
                  Kick
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
