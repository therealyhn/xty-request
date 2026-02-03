import TrackItem from './TrackItem.jsx'

export default function TrackResultsList({ items = [] }) {
  if (!items.length) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 font-semibold">Results</h3>
          <span className="text-label text-secondary">0 tracks</span>
        </div>
        <div className="group rounded-surface border border-border-light bg-background/40 p-6 text-body text-secondary">
          <p>No results yet. Start typing to search for tracks.</p>
          <p className="mt-4 opacity-0 transition group-hover:opacity-100">
            Tap the search field to begin.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold">Results</h3>
        <span className="text-label text-secondary">{items.length} tracks</span>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((track) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}
