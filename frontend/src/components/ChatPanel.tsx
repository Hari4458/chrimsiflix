import { useState } from 'react'
import { useRoomStore } from '../stores/roomStore'
import socketService from '../services/socket'
import Input from './Input'
import Button from './Button'
import Card from './Card'

export default function ChatPanel() {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { chatMessages, currentUser } = useRoomStore()

  const handleSendMessage = () => {
    if (message.trim()) {
      socketService.sendMessage(message)
      setMessage('')
      setIsTyping(false)
    }
  }

  const handleTyping = (value: string) => {
    setMessage(value)
    if (!isTyping && value.length > 0) {
      setIsTyping(true)
      socketService.typingIndicator(true)
    } else if (isTyping && value.length === 0) {
      setIsTyping(false)
      socketService.typingIndicator(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-accent-light mb-4">Room Chat</h3>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {chatMessages.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No messages yet...</p>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <p className="text-accent-light font-semibold">{msg.userName}</p>
              <p className="text-gray-300">{msg.message}</p>
              <p className="text-gray-500 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={!currentUser?.hasControl}
        />
        <Button onClick={handleSendMessage} disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </Card>
  )
}
