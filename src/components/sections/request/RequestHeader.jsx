import logo from '../../../assets/xty-request-logo.png'
import Button from '../../ui/Button.jsx'

export default function RequestHeader({ isUnlocked }) {
  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/xty.music/',
      className:
        'border-[#833ab4]/35 text-[#e9d5ff] hover:border-[#e1306c]/70 hover:bg-gradient-to-r hover:from-[#f58529]/20 hover:via-[#dd2a7b]/20 hover:to-[#8134af]/20 hover:text-white',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@xtymusic',
      className:
        'border-[#25f4ee]/35 text-[#a5f3fc] hover:border-[#fe2c55]/70 hover:bg-[linear-gradient(90deg,rgba(37,244,238,0.15),rgba(254,44,85,0.15))] hover:text-white',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@xty-music',
      className:
        'border-[#ff0000]/40 text-[#fecaca] hover:border-[#ff0000]/80 hover:bg-[#ff0000]/20 hover:text-white',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-6 mt-14 text-center">
      {/* <div className="flex items-center gap-3 rounded-sm border border-border-base bg-surface/50 px-4 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        <span className="text-label font-bold tracking-widest text-secondary">NARUCI PESMU</span>
      </div> */}

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

      <h1 className="max-w-2xl px-4 text-title text-[0.78rem] sm:text-[0.9rem] uppercase tracking-[0.14em] text-primary/90 leading-relaxed">
        Zaprati nas kako bi saznali gde je sledeca XTY - Svi Za Pultom zurka!
      </h1>

      <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3">
        {socialLinks.map((link) => (
          <Button
            key={link.label}
            variant="ghost"
            className={`px-2.5 sm:px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] transform-gpu transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${link.className}`}
            onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
            aria-label={`Open ${link.label}`}
          >
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
