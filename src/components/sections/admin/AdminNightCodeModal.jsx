import Button from '../../ui/Button.jsx'

export default function AdminNightCodeModal({
  isOpen,
  onClose,
  nightCode,
  onNightCodeChange,
  onGenerate,
  onSave,
  status,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-sm rounded-sm border border-border-light bg-surface/90 p-6 shadow-soft backdrop-blur">
        <div className="mb-4 text-xs uppercase tracking-[0.3em] text-secondary/70">Kod Žurke</div>
        <input
          type="text"
          value={nightCode}
          onChange={(event) => onNightCodeChange(event.target.value)}
          className="w-full rounded-sm border border-border-base bg-black/20 px-3 py-2 text-sm text-primary outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
          placeholder="Upiši ili generiši kod"
        />
        {status === 'saved' ? <span className="mt-2 block text-xs text-green-400">Sačuvano.</span> : null}
        {status === 'error' ? <span className="mt-2 block text-xs text-red-400">Greška pri čuvanju.</span> : null}
        <div className="mt-5 flex gap-2">
          <Button variant="ghost" onClick={onGenerate}>
            Generiši Novi
          </Button>
          <Button onClick={onSave}>
            Sačuvaj
          </Button>
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full"
          onClick={onClose}
        >
          Zatvori
        </Button>
      </div>
    </div>
  )
}
