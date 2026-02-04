import DeezerSearchInput from '../../shared/DeezerSearchInput.jsx'
import TrackResultsList from '../../shared/TrackResultsList.jsx'

export default function RequestSearchPanel({
  searchQuery,
  onSearchChange,
  isLoading,
  error,
  results,
  selectedTrack,
  onSelectTrack,
}) {
  return (
    <div className="rounded-sm border border-border-base bg-surface/50 p-1 backdrop-blur-xl">
      <div
        className={`transition-all duration-300 ${selectedTrack ? 'pointer-events-none opacity-50 blur-[2px]' : ''}`}
      >
        <DeezerSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          isLoading={isLoading}
          disabled={!!selectedTrack}
        />
      </div>

      <div className="mt-2 text-left">
        <TrackResultsList tracks={results} onSelect={onSelectTrack} />
        {error ? (
          <p className="mt-3 text-body text-secondary">
            Search failed. Try again.
          </p>
        ) : null}
      </div>
    </div>
  )
}
