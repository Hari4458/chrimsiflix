interface LoadingScreenProps {}

export default function LoadingScreen({}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-dark via-darker to-dark z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-glass border-t-accent rounded-full animate-spin"></div>
        <p className="text-accent-light text-lg font-semibold animate-pulse">
          ChrimsiFlix
        </p>
      </div>
    </div>
  )
}
