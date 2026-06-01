import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import Card from './Card'

interface RoomCodeDisplayProps {
  code: string
}

export default function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <label className="text-xs text-accent-light font-semibold">Room Code</label>
        <div className="flex gap-2 items-center">
          <Input
            value={code}
            readOnly
            className="font-mono text-center text-lg tracking-widest"
          />
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            className="whitespace-nowrap"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </div>
        <p className="text-xs text-gray-400">Share this code with others to invite them</p>
      </div>
    </Card>
  )
}
