interface BrowserFrameProps {
  url?: string
  isLoading?: boolean
  onUrlChange?: (url: string) => void
}

export default function BrowserFrame({
  url,
  isLoading = false,
  onUrlChange,
}: BrowserFrameProps) {
  if (!url) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-8">
        <div className="text-6xl mb-4">🌐</div>
        <h3 className="text-2xl font-bold text-accent-light mb-2">No Website Loaded</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          The room owner will enter a website URL to get started. All participants will see the same page in real-time.
        </p>
        <div className="glass rounded-lg p-4 text-sm text-gray-300 max-w-md">
          <p className="font-semibold text-accent-light mb-2">💡 Tips:</p>
          <ul className="text-left space-y-1">
            <li>• Works with any public website</li>
            <li>• All users see synchronized content</li>
            <li>• Real-time navigation updates</li>
            <li>• Shared interactions</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-darker rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300 text-sm">Loading...</p>
          </div>
        </div>
      )}
      
      <iframe
        key={url}
        src={url}
        className="w-full h-full border-none flex-1"
        title="Shared Website"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        onLoad={() => console.log('Website loaded:', url)}
        onError={() => console.error('Failed to load:', url)}
      />
    </div>
  )
}
