import Chip from '../ui/Chip.jsx'

export default function SelectedTrackCard({ track, onRemove }) {
  if (!track) {
    return (
      <div className="flex flex-col gap-6 opacity-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold uppercase">Izabrana pesma</h3>
        </div>
        <div className="rounded-sm border border-b border-border-light bg-background/40 p-6 text-center text-body text-secondary">
          Nije izabrana pesma. Izaberite rezultat da biste ga pregledali ovde.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold text-primary uppercase">Izabrana pesma</h3>
        <Chip variant="success">SPREMAN ZA SLANJE</Chip>
      </div>

      <div className="relative overflow-hidden rounded-sm border border-border-light bg-surface/50 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm shadow-lg">
            <img
              src={track.album?.cover_medium}
              alt={track.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h4 className="truncate text-sm font-bold text-primary">{track.title}</h4>
            <p className="truncate text-body text-secondary">{track.artist?.name}</p>
            {/* <p className="truncate text-label text-secondary/70">{track.album?.title}</p> */}
          </div>

          <button
            onClick={onRemove}
            className="ml-2 rounded-full p-2 text-secondary hover:bg-white/10 hover:text-primary transition-colors"
            aria-label="Remove track"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className=" h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
