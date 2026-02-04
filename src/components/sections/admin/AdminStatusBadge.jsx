import { STATUS_LABELS, STATUS_STYLES } from './adminStatus.js'

export default function AdminStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || 'border-border-light text-secondary'}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}
