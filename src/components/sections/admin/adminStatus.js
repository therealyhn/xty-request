export const STATUS_TABS = [
  { id: 'all', label: 'Sve' },
  { id: 'new', label: 'Novo' },
  { id: 'accepted', label: 'Prihvaćeno' },
  { id: 'played', label: 'Pušteno' },
  { id: 'declined', label: 'Odbijeno' },
]

export const STATUS_STYLES = {
  new: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  accepted: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  played: 'bg-green-500/10 text-green-300 border-green-500/20',
  declined: 'bg-red-500/10 text-red-300 border-red-500/20',
}

export const STATUS_LABELS = {
  new: 'Novo',
  accepted: 'Prihvaćeno',
  played: 'Pušteno',
  declined: 'Odbijeno',
}
