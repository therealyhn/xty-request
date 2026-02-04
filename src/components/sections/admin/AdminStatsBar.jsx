export default function AdminStatsBar({ total }) {
  return (
    <div className="flex items-center justify-between px-2 text-xs text-secondary">
      <span>Prikazano: <strong className="text-white">{total}</strong></span>
      <span>Status: <span className="text-green-400">Connected</span></span>
    </div>
  )
}
