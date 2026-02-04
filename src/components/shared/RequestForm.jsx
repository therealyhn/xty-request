import Button from '../ui/Button.jsx'
import TextInput from '../ui/TextInput.jsx'

export default function RequestForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold uppercase">Pošalji zahtev</h3>
      </div>
      <div className="flex flex-col gap-2">
        <TextInput id="nickname" placeholder="Tvoje ime" />
        <div className="flex flex-col gap-2">
          <textarea
            id="message"
            className="min-h-32 w-full text-center rounded-sm border border-border-base bg-background/60 px-4 py-3 text-body text-primary outline-none transition hover:border-border-strong hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/40"
            placeholder="Poruka (Opciono)..."
          />
        </div>
      </div>
      <Button>Pošalji zahtev</Button>
    </div>
  )
}
