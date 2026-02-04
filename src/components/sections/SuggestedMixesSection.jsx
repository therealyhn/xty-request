import Container from '../ui/Container.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import teodora from '../../assets/teodora.png'
import mix from '../../assets/mix.png'
import tec from '../../assets/tec.png'
import turira from '../../assets/turira.png'
import varnice from '../../assets/varnice.png'

import 'swiper/css'
import 'swiper/css/pagination'

const PLACEHOLDER_MIXES = [
  {
    title: 'XTY Balkan Mix',
    tag: 'Only XTY Mashups',
    link: 'https://www.youtube.com/watch?v=owGr-LL3UlQ&t=1773s',
    image: mix,
  },
  {
    title: 'Teodora - Bad',
    tag: 'XTY Mashup',
    link: 'https://xty-music.com/#mashups',
    image: teodora,
  },
  {
    title: 'Jala & Buba - Tec-9',
    tag: 'XTY Mashup',
    link: 'https://xty-music.com/#mashups',
    image: tec,
  },
  {
    title: 'Relja X Rasta - Turira',
    tag: 'XTY Mashup',
    link: 'https://xty-music.com/#mashups',
    image: turira,
  },
  {
    title: 'Voyage - Varnice',
    tag: 'XTY Mashup',
    link: 'https://xty-music.com/#mashups',
    image: varnice,
  },
]

export default function SuggestedMixesSection() {
  return (
    <section className="relative overflow-hidden pb-10 pt-12">
      <Container className="max-w-[750px]">
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
              breakpoints={{
                1024: { slidesPerView: 3 },
              }}
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col overflow-hidden rounded-surface border border-border-light bg-surface/60 transition hover:border-border-strong"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
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
