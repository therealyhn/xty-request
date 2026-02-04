import AdminIconRefresh from './AdminIconRefresh.jsx'
import { STATUS_TABS } from './adminStatus.js'

export default function AdminControlsBar({ status, onStatusChange, onReload, isLoading }) {
  return (
    <div className="sticky top-4 z-20 flex flex-col gap-4 rounded-sm border border-white/5 bg-[#0A0A0A]/80 p-2 shadow-2xl backdrop-blur-xl transition-all md:flex-row md:items-center md:justify-between">
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

      <button
        onClick={onReload}
        className="flex shrink-0 items-center justify-center gap-2 rounded-xs border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-white/10 hover:text-white"
      >
        <AdminIconRefresh className={isLoading ? 'animate-spin' : ''} />
        <span>Osveži</span>
      </button>
    </div>
  )
}
