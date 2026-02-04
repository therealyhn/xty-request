import Container from '../ui/Container.jsx'

const PLACEHOLDER_MIXES = [
  {
    title: 'XTY Mashup 01',
    tag: 'Club Edit',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'XTY Mashup 02',
    tag: 'Peak Hour',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'XTY Mashup 03',
    tag: 'Live Set',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'XTY Mashup 04',
    tag: 'Afterhours',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'XTY Mashup 05',
    tag: 'Festival',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'XTY Mashup 06',
    tag: 'Underground',
    link: '#',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop',
  },
]

export default function SuggestedMixesSection() {
  const items = [...PLACEHOLDER_MIXES, ...PLACEHOLDER_MIXES]

  return (
    <section className="relative overflow-hidden pb-10">
      <Container className="max-w-5xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-semibold text-primary">Suggested Mixes</h2>
            <span className="text-label text-secondary">Autoplay</span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
            <div className="flex w-full overflow-hidden">
              <div className="flex min-w-full animate-marquee gap-4 pr-4">
                {items.map((mix, index) => (
                  <a
                    key={`${mix.title}-${index}`}
                    href={mix.link}
                    className="group relative flex w-48 flex-none flex-col overflow-hidden rounded-surface border border-border-light bg-surface/60 transition hover:border-border-strong"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <img
                        src={mix.image}
                        alt={mix.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        width={384}
                        height={224}
                      />
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <span className="text-body font-medium text-primary">{mix.title}</span>
                      <span className="text-label text-secondary">{mix.tag}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
