import Button from '../ui/Button.jsx'
import TextInput from '../ui/TextInput.jsx'

export default function RequestForm({
  nightCode,
  message,
  onNightCodeChange,
  onMessageChange,
  onSubmit,
  disabled,
  isSubmitting,
  error,
}) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold uppercase">Pošalji zahtev</h3>
      </div>
      <div className="flex flex-col gap-2">
        <TextInput
          id="night-code"
          placeholder="Kod Žurke"
          value={nightCode}
          onChange={(event) => onNightCodeChange(event.target.value)}
          disabled={disabled}
        />
        <div className="flex flex-col gap-2">
          <textarea
            id="message"
            className="min-h-32 w-full text-center rounded-sm border border-border-base bg-background/60 px-4 py-3 text-sm text-primary outline-none transition hover:border-border-strong hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/40"
            placeholder="Poruka (Opciono)..."
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      {error ? <p className="text-body text-secondary">{error}</p> : null}
      <Button type="submit" className={disabled ? 'pointer-events-none opacity-60' : ''}>
        Pošalji zahtev
      </Button>
      <p className="text-[11px] uppercase tracking-[0.2em] text-secondary/70">
        Uključi notifikacije da bi dobio obaveštenje kada tvoj zahtev bude prihvaćen ili odbijen.
      </p>
    </form>
  )
}
