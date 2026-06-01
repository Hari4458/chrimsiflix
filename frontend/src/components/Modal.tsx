import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-xl p-6 max-w-md w-full mx-4 animate-slide-in">
        <h2 className="text-xl font-bold text-accent-light mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {actions}
        </div>
      </div>
    </div>
  )
}
