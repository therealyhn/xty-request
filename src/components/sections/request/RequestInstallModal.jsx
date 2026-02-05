export default function RequestInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-sm rounded-sm border border-border-light bg-surface/90 p-6 text-left shadow-soft backdrop-blur">
        <div className="mb-4 text-lg uppercase tracking-[0.3em] text-secondary/70">
          Instaliraj aplikaciju
        </div>
        <div className="space-y-4 text-sm text-secondary">
          <div>
            <div className="mb-1 text-xs font-semibold text-primary">Android</div>
            <div>Otvori u Chrome → meni ⋮ → Install app ili Add to Home screen.</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-primary">iOS</div>
            <div>Otvori u Safari → Share → Add to Home Screen.</div>
          </div>
        </div>
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
