import Chip from '../ui/Chip.jsx'

export default function SelectedTrackCard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold">Selected Track</h3>
        <Chip>Queued</Chip>
      </div>
      <div className="rounded-surface border border-border-light bg-background/40 p-6 text-body text-secondary">
        No track selected. Choose a result to preview it here.
      </div>
    </div>
  )
}
