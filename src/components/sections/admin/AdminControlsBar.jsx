import AdminIconRefresh from './AdminIconRefresh.jsx'
import { STATUS_TABS } from './adminStatus.js'

export default function AdminControlsBar({
  status,
  onStatusChange,
  onReload,
  isLoading,
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
    <div className="sticky top-4 z-20 flex flex-col gap-4 rounded-sm border border-white/5 bg-[#0A0A0A]/80 p-2 shadow-2xl backdrop-blur-xl transition-all md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-1 overflow-x-auto rounded-xs bg-white/5 p-1 no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const isActive = status === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={`relative flex-1 whitespace-nowrap rounded-xs px-4 py-1.5 text-xs font-semibold transition-all ${isActive
                  ? 'bg-primary text-black shadow-lg'
                  : 'text-secondary hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <select
            value={activeEventId || ''}
            onChange={(event) => onActiveEventChange(Number(event.target.value))}
            className="w-full rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white outline-none transition-colors hover:border-white/20 focus:border-white/30 md:max-w-[240px]"
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

          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <input
              type="text"
              value={newEventName}
              onChange={(event) => onNewEventNameChange(event.target.value)}
              placeholder="Naziv nove zurke"
              className="w-full rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white placeholder:text-secondary/60 outline-none transition-colors hover:border-white/20 focus:border-white/30 md:max-w-[220px]"
            />

            <button
              onClick={onCreateEvent}
              className="rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isEventsLoading || !newEventName.trim()}
            >
              Kreiraj event
            </button>
          </div>

          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <input
              type="text"
              value={renameEventName}
              onChange={(event) => onRenameEventNameChange(event.target.value)}
              placeholder="Novo ime aktivnog eventa"
              className="w-full rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white placeholder:text-secondary/60 outline-none transition-colors hover:border-white/20 focus:border-white/30 md:max-w-[220px]"
            />

            <button
              onClick={onRenameEvent}
              className="rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isEventsLoading || !activeEventId || !renameEventName.trim()}
            >
              Preimenuj
            </button>

            <button
              onClick={onDeleteEvent}
              className="rounded-xs border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-200 transition-colors hover:border-red-500/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isEventsLoading || !activeEventId}
            >
              Obrisi event
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onReload}
        className="flex shrink-0 items-center justify-center gap-2 rounded-xs border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-white/10 hover:text-white"
      >
        <AdminIconRefresh className={isLoading ? 'animate-spin' : ''} />
        <span>Osvezi</span>
      </button>
    </div>
  )
}
