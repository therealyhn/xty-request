export default function RequestSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-sm rounded-surface border border-border-light bg-surface/90 p-6 text-center shadow-soft backdrop-blur">
        <p className="text-body text-primary">Zahtev je uspešno poslat.</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-surface border border-border-strong bg-primary px-6 py-3 text-body font-medium text-background transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          OK
        </button>
      </div>
    </div>
  )
}
