export default function RequestSuccessModal({ isOpen, onClose, message, variant = 'success' }) {
  if (!isOpen) return null
  const isError = variant === 'error'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-sm rounded-sm border border-border-light bg-surface/90 p-6 text-center shadow-soft backdrop-blur">
        <div className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full ${isError ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
          {isError ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <p className="text-body text-primary">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-sm border border-border-strong bg-primary px-6 py-3 text-body font-medium text-background transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          OK
        </button>
      </div>
    </div>
  )
}
