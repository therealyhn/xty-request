import AdminIconRefresh from './AdminIconRefresh.jsx'
import { STATUS_TABS } from './adminStatus.js'

export default function AdminFilterBar({ status, onStatusChange, onReload, isLoading }) {
  return (
    <div className="rounded-sm border border-white/5 bg-[#0A0A0A]/90 p-2.5 shadow-xl backdrop-blur-xl sm:p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
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
          className="flex h-[32px] shrink-0 items-center justify-center gap-2 rounded-xs border border-white/5 bg-white/5 px-3 text-[11px] font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-white/10 hover:text-white sm:h-[34px] sm:px-4 sm:text-xs"
        >
          <AdminIconRefresh className={isLoading ? 'animate-spin' : ''} />
          <span>Osvezi</span>
        </button>
      </div>
    </div>
  )
}
