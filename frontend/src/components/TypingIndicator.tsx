import { useEffect, useState } from 'react'

interface TypingIndicatorProps {
  isTyping: boolean
}

export default function TypingIndicator({ isTyping }: TypingIndicatorProps) {
  if (!isTyping) return null

  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  )
}
