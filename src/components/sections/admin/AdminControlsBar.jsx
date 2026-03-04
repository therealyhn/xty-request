export default function AdminControlsBar({
  events,
  activeEventId,
  onActiveEventChange,
  newEventName,
  onNewEventNameChange,
  onCreateEvent,
  renameEventName,
  onRenameEventNameChange,
  onRenameEvent,
  onDeleteEvent,
  isEventsLoading,
}) {
  return (
    <div className="sticky top-4 z-20 rounded-sm border border-white/5 bg-[#0A0A0A]/90 p-2.5 shadow-2xl backdrop-blur-xl sm:p-3">
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-12">
          <div className="flex flex-col gap-2 xl:col-span-4">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Aktivni Event</label>
            <select
              value={activeEventId || ''}
              onChange={(event) => onActiveEventChange(Number(event.target.value))}
                className="h-[36px] w-full rounded-xs border border-white/10 bg-white/5 px-3 text-[11px] font-semibold text-white outline-none transition-colors hover:border-white/20 focus:border-white/30 sm:h-[38px] sm:text-xs"
            >
              {!events.length ? (
                <option value="" className="bg-[#0A0A0A]">
                  Nema eventa
                </option>
              ) : null}
              {events.map((eventItem) => (
                <option key={eventItem.id} value={eventItem.id} className="bg-[#0A0A0A]">
                  {eventItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 xl:col-span-4">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Novi Event</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEventName}
                onChange={(event) => onNewEventNameChange(event.target.value)}
                placeholder="Naziv nove zurke"
                className="h-[36px] min-w-0 flex-1 rounded-xs border border-white/10 bg-white/5 px-3 text-[11px] font-semibold text-white placeholder:text-secondary/60 outline-none transition-colors hover:border-white/20 focus:border-white/30 sm:h-[38px] sm:text-xs"
              />
              <button
                onClick={onCreateEvent}
                className="h-[36px] shrink-0 rounded-xs border border-white/10 bg-white/5 px-3 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[38px] sm:text-xs"
                disabled={isEventsLoading || !newEventName.trim()}
              >
                Kreiraj
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 xl:col-span-4">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Preimenuj Aktivni</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={renameEventName}
                onChange={(event) => onRenameEventNameChange(event.target.value)}
                placeholder="Novo ime aktivnog eventa"
                className="h-[36px] min-w-0 flex-1 rounded-xs border border-white/10 bg-white/5 px-3 text-[11px] font-semibold text-white placeholder:text-secondary/60 outline-none transition-colors hover:border-white/20 focus:border-white/30 sm:h-[38px] sm:text-xs"
              />
              <button
                onClick={onRenameEvent}
                className="h-[36px] shrink-0 rounded-xs border border-white/10 bg-white/5 px-3 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[38px] sm:text-xs"
                disabled={isEventsLoading || !activeEventId || !renameEventName.trim()}
              >
                Preimenuj
              </button>
            </div>
          </div>

          <div className="xl:col-span-12">
            <div className="flex justify-end md:max-xl:justify-start">
              <button
                onClick={onDeleteEvent}
                className="h-[34px] rounded-xs border border-red-500/25 bg-red-500/10 px-3 text-[11px] font-bold uppercase tracking-wider text-red-200 transition-colors hover:border-red-500/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[36px] sm:text-xs"
                disabled={isEventsLoading || !activeEventId}
              >
                Obrisi aktivni event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
