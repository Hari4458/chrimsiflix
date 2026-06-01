interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'idle'
  label?: string
}

export default function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    idle: 'bg-yellow-500',
  }

  const labels = {
    online: 'Online',
    offline: 'Offline',
    idle: 'Idle',
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colors[status]} animate-pulse`}></div>
      <span className="text-xs text-gray-400">{label || labels[status]}</span>
    </div>
  )
}
