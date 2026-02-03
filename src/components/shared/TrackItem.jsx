export default function TrackItem({ track }) {
  return (
    <button
      className="group flex w-full flex-col gap-2 rounded-surface border border-border-light bg-background/30 p-4 text-left transition hover:border-border-strong hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-body font-medium text-primary">
            {track.title || 'Unknown title'}
          </p>
          <p className="text-body text-secondary">
            {track.artist?.name || 'Unknown artist'} · {track.album?.title || 'Unknown album'}
          </p>
        </div>
        <span className="text-label text-secondary">Select</span>
      </div>
      <div className="flex items-center justify-between text-body text-secondary">
        <span>Preview available</span>
        <span className="opacity-0 transition group-hover:opacity-100">Tap to choose</span>
      </div>
    </button>
  )
}
