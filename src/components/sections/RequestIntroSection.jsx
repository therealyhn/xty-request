import Container from '../ui/Container.jsx'
import Chip from '../ui/Chip.jsx'
import Button from '../ui/Button.jsx'

export default function RequestIntroSection() {
  return (
    <section className="relative z-10 pb-12 pt-12 md:pb-16 md:pt-16">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Chip>XTY REQUEST MODE</Chip>
              <span className="h-px w-24 bg-border-light" />
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-h1 font-semibold tracking-tight">XTY REQUESTS</h1>
              <p className="max-w-2xl text-body text-secondary">
                Request a track for right now or the next run. Search Deezer, pick a song,
                and send it straight to the booth.
              </p>
            </div>
            <div className="flex items-center gap-4 text-secondary">
              <span className="h-px w-12 bg-border-light" />
              <span className="text-label">Powered by XTY</span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Button variant="ghost">Instagram</Button>
            <Button variant="ghost">YouTube</Button>
            <Button variant="ghost">Website</Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
