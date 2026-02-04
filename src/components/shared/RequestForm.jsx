import Button from '../ui/Button.jsx'
import TextInput from '../ui/TextInput.jsx'

export default function RequestForm({
  nickname,
  message,
  onNicknameChange,
  onMessageChange,
  onSubmit,
  disabled,
  isSubmitting,
  error,
}) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold uppercase">PoÅ¡alji zahtev</h3>
      </div>
      <div className="flex flex-col gap-2">
        <TextInput
          id="nickname"
          placeholder="Tvoje ime"
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value)}
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
        PoÅ¡alji zahtev
      </Button>
    </form>
  )
}
