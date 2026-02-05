import logo from '../../../assets/xty-request-logo.png'

export default function RequestHeader({ isUnlocked }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex items-center gap-3 rounded-sm border border-border-base bg-surface/50 px-4 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        <span className="text-label font-bold tracking-widest text-secondary">NARUCI PESMU</span>
      </div>

      <div className="group relative">
        <div className="absolute -inset-8 rounded-full bg-white/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
        <img
          src={logo}
          alt="XTY logo"
          className={`relative w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-500 ${isUnlocked ? 'h-[9rem] sm:h-[14rem] md:h-[16rem]' : 'h-[12rem] sm:h-[14rem] md:h-[16rem]'}`}
          width={200}
          height={100}
        />
      </div>

      <a
        href="https://jovanljusic.com"
        target="_blank"
        rel="noreferrer"
        className="text-[16px] uppercase tracking-[0.3em] text-secondary/60 transition-colors hover:text-secondary"
      >
        Developed &amp; Powered by Yhn (XTY)
      </a>
    </div>
  )
}
