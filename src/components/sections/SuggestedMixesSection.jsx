import Container from '../ui/Container.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

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
  return (
    <section className="relative overflow-hidden pb-10">
      <Container className="max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-semibold text-primary">Naši radovi</h2>
            <span className="text-label text-secondary">Poslušajte</span>
          </div>
          <div className="rounded-surface border border-border-light bg-surface/40 p-3">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1.1}
              loop={PLACEHOLDER_MIXES.length > 1}
              grabCursor
              speed={500}
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                el: '.custom-swiper-pagination',
                renderBullet: (index, className) =>
                  `<span class="${className} !w-6 !h-1 !rounded-sm transition-all duration-300"></span>`,
              }}
              className="w-full"
            >
              {PLACEHOLDER_MIXES.map((mix, index) => (
                <SwiperSlide key={`${mix.title}-${index}`}>
                  <a
                    href={mix.link}
                    className="group relative flex flex-col overflow-hidden rounded-surface border border-border-light bg-surface/60 transition hover:border-border-strong"
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={mix.image}
                        alt={mix.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                      />
                    </div>
                    <div className="flex flex-col gap-1 p-4">
                      <span className="text-body font-medium text-primary">{mix.title}</span>
                      <span className="text-label text-secondary">{mix.tag}</span>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="custom-swiper-pagination mt-4 flex gap-2" />
          </div>
        </div>
      </Container>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-swiper-pagination .swiper-pagination-bullet {
              background: rgba(255, 255, 255, 0.2) !important;
              opacity: 1 !important;
              margin: 0 !important;
            }
            .custom-swiper-pagination .swiper-pagination-bullet-active {
              background: rgba(255, 255, 255, 0.8) !important;
              width: 2.5rem !important;
            }
          `,
        }}
      />
    </section>
  )
}
