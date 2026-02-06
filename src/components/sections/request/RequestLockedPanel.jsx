import { motion } from 'framer-motion'

export default function RequestLockedPanel({ onUnlock }) {
  return (
    <motion.div
      key="locked"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex w-full max-w-md pt-12 flex-col gap-6"
    >
      <div className="relative overflow-hidden rounded-sm border border-border-base bg-surface p-8 text-center shadow-2xl">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 bg-purple-500/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h3 className="mb-2 text-2xl font-bold text-primary">ZAPRATI NAS</h3>
            <p className="text-body text-secondary">
              Da bi naručili pesmu, potrebno je samo jedan follow na našem Instagramu.
            </p>
          </div>

          <button
            onClick={onUnlock}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xs bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 h-6 w-6"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="relative z-10">XTY MUSIC</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <p className="text-[11px] uppercase tracking-widest text-secondary/50">
            Kada nas zapratiš, otvoriće se pretraga.
          </p>
        </div>
      </div>
    </motion.div >
  )
}
