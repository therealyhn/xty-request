export default function AdminEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 py-16 text-secondary">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-secondary/40">
        <span className="text-xl">?</span>
      </div>
      <p>Nema zahteva u ovoj kategoriji.</p>
    </div>
  )
}
