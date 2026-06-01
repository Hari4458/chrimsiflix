interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  isOwner?: boolean
}

export default function Avatar({ name, size = 'md', isOwner = false }: AvatarProps) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    'bg-purple-600',
    'bg-blue-600',
    'bg-pink-600',
    'bg-green-600',
    'bg-orange-600',
    'bg-red-600',
  ]

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const bgColor = colors[hash % colors.length]

  return (
    <div className={`relative inline-flex`}>
      <div
        className={`${sizes[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white`}
      >
        {initials}
      </div>
      {isOwner && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-dark">
          👑
        </div>
      )}
    </div>
  )
}
