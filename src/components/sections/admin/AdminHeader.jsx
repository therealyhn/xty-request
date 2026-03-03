import logo from '../../../assets/xty-request-logo.png'

export default function AdminHeader({ className = '', logoClassName = '' }) {
  return (
    <div className={`flex flex-col items-center gap-4 text-center ${className}`}>
      <div className="flex items-center gap-3 rounded-sm border border-border-base bg-surface/50 px-4 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        <span className="text-label font-bold tracking-widest text-secondary">ADMIN PANEL</span>
      </div>

      <div className="group relative">
        <div className="absolute -inset-8 rounded-full bg-white/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
        <img
          src={logo}
          alt="XTY logo"
          width={200}
          className={`relative h-[6.5rem] w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-500 sm:h-[7rem] md:h-[8rem] lg:h-[10rem] ${logoClassName}`}
          height={100}
        />
      </div>
    </div>
  )
}
