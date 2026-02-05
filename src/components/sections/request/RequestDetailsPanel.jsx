import SelectedTrackCard from '../../shared/SelectedTrackCard.jsx'
import RequestForm from '../../shared/RequestForm.jsx'

export default function RequestDetailsPanel({
  selectedTrack,
  onRemoveTrack,
  nightCode,
  message,
  onNightCodeChange,
  onMessageChange,
  onSubmit,
  isSubmitting,
  submitError,
}) {
  return (
    <div className="flex flex-col gap-8">
      <SelectedTrackCard track={selectedTrack} onRemove={onRemoveTrack} />

      <div
        className={`transition-all duration-500 ${selectedTrack ? 'opacity-100' : 'pointer-events-none opacity-40 blur-[2px]'}`}
      >
        <RequestForm
          nightCode={nightCode}
          message={message}
          onNightCodeChange={onNightCodeChange}
          onMessageChange={onMessageChange}
          onSubmit={onSubmit}
          disabled={!selectedTrack || isSubmitting}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      </div>
    </div>
  )
}
