import { motion } from 'framer-motion'
import AdminStatusBadge from './AdminStatusBadge.jsx'
import AdminActionButton from './AdminActionButton.jsx'
import AdminIconCheck from './AdminIconCheck.jsx'
import AdminIconPlay from './AdminIconPlay.jsx'
import AdminIconX from './AdminIconX.jsx'
import AdminIconRefresh from './AdminIconRefresh.jsx'
import AdminIconUser from './AdminIconUser.jsx'

export default function AdminRequestCard({
  item,
  isActionsHidden,
  onEdit,
  onAccept,
  onPlay,
  onDecline,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#111111] p-0 transition-colors hover:border-white/10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-3 mb-1">
            <AdminStatusBadge status={item.status} />
            <span className="text-[10px] text-secondary/60 font-mono hidden sm:inline-block">
              ID: #{item.id.toString().slice(-4)}
            </span>
          </div>

          <h3 className="line-clamp-1 text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors">
            {item.track_title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-2 text-sm text-secondary/80">
            <span className="font-medium text-white/80">{item.track_artist}</span>
            <span className="h-1 w-1 rounded-full bg-border-strong opacity-50" />
            <span className="italic opacity-70">{item.track_album}</span>
          </div>

          {item.message && (
            <div className="mt-2 text-xs italic text-secondary/70 border-l-2 border-primary/20 pl-2">
              "{item.message}"
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-secondary">
              <AdminIconUser className="h-3 w-3" />
            </div>
            <span className="font-medium text-white/60">
              {item.nickname}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-row gap-2 pt-2 sm:flex-col sm:items-end sm:pt-0">
          <div className="flex items-center gap-2 rounded-lg bg-black/20 p-1">
            {isActionsHidden ? (
              <AdminActionButton
                onClick={onEdit}
                colorClass="text-secondary hover:bg-white/5 hover:border-white/10"
                icon={<AdminIconRefresh />}
                label="Edit"
              />
            ) : (
              <>
                <AdminActionButton
                  onClick={onAccept}
                  colorClass="text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20"
                  icon={<AdminIconCheck />}
                  label="Prihvati"
                />
                <div className="h-4 w-px bg-white/10" />
                <AdminActionButton
                  onClick={onPlay}
                  colorClass="text-green-400 hover:bg-green-500/10 hover:border-green-500/20"
                  icon={<AdminIconPlay />}
                  label="Puštena"
                />
                <div className="h-4 w-px bg-white/10" />
                <AdminActionButton
                  onClick={onDecline}
                  colorClass="text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                  icon={<AdminIconX />}
                  label="Odbij"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
