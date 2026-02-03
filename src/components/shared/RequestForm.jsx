import Button from '../ui/Button.jsx'
import TextInput from '../ui/TextInput.jsx'

export default function RequestForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold">Send Request</h3>
        <span className="text-label text-secondary">Live queue</span>
      </div>
      <div className="flex flex-col gap-4">
        <TextInput id="nickname" label="Nickname" placeholder="Your name" />
        <div className="flex flex-col gap-2">
          <label className="text-label text-secondary" htmlFor="message">
            Message (optional)
          </label>
          <textarea
            id="message"
            className="min-h-32 w-full rounded-sm border border-border-base bg-background/60 px-4 py-3 text-body text-primary outline-none transition hover:border-border-strong hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/40"
            placeholder="Shoutout or dedication"
          />
        </div>
      </div>
      <Button>Send Request</Button>
    </div>
  )
}
