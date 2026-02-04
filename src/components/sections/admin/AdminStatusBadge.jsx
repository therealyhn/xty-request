import { STATUS_LABELS, STATUS_STYLES } from './adminStatus.js'

export default function AdminStatusBadge({ status }) {
  return (
    <span
      className={`rounded-sm border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || 'border-border-light text-secondary'}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}
