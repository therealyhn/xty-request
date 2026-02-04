export default function AdminActionButton({ onClick, colorClass, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center gap-2 rounded-sm border border-transparent bg-cover px-3 py-1.5 transition-all hover:bg-white/5 disabled:opacity-50 ${colorClass}`}
      title={label}
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  )
}
