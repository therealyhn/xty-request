import logo from '../../../assets/xty-request-logo.png'
import Button from '../../ui/Button.jsx'

export default function RequestHeader({ isUnlocked }) {
  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/xty.music/',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      className:
        'border-black/20 bg-[#C13584]/65 text-white/95',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@xtymusic',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      className: 'border-black/20 bg-cyan-500/65 text-white/95',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@xty-music',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      className: 'border-black/20 bg-red-500/65 text-white/95',
    },
  ]

  return (
    <div className="mt-12 flex flex-col items-center gap-6 text-center sm:mt-14 sm:gap-8">
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

      <h1 className="max-w-2xl px-4 text-title text-[0.78rem] font-medium uppercase leading-relaxed tracking-[0.12em] text-white/90 drop-shadow-sm sm:text-[0.95rem] sm:tracking-[0.15em]">
        Zaprati nas kako bi saznali gde je sledeca <span className="font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">XTY - Svi Za Pultom</span> zurka!
      </h1>

      <div className="flex w-full max-w-[360px] flex-nowrap items-center justify-center gap-2 px-2 sm:max-w-none sm:gap-4 sm:px-0">
        {socialLinks.map((link) => (
          <Button
            key={link.label}
            variant="ghost"
            style={{ isolation: 'isolate' }}
            className={`group relative h-9 min-w-0 flex-1 overflow-hidden rounded-full border px-1.5 text-sm font-bold tracking-[0.06em] backdrop-blur-md transition-none sm:h-11 sm:flex-none sm:px-5 sm:text-[9px] sm:tracking-wider ${link.className}`}
            onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
            aria-label={`Open ${link.label}`}
          >
            <div className="relative z-10 flex items-center justify-center">
              {link.icon}
              <span>{link.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
