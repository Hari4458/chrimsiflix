interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        glass rounded-xl p-6
        border border-glass
        hover:border-glass-dark transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  )
}
