import { ImageIcon, Video, AudioLines, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const cards = [
    {
      id: 'vision',
      icon: <ImageIcon className='size-5' />,
      title: t('home.features.vision.title'),
      desc: t('home.features.vision.desc'),
      tags: [t('home.features.vision.tag1'), t('home.features.vision.tag2')],
      media: <img src='/assets/tokenhub/vision-image-models.png' alt={t('home.features.vision.title')} loading='lazy' decoding='async' className='aspect-[4/3] w-full rounded-xl object-cover' />,
    },
    {
      id: 'video',
      icon: <Video className='size-5' />,
      title: t('home.features.video.title'),
      desc: t('home.features.video.desc'),
      tags: [t('home.features.video.tag1'), t('home.features.video.tag2')],
      media: (
        <img
          src='/assets/tokenhub/demo-video-poster.jpg'
          alt={t('home.features.video.title')}
          loading='lazy'
          decoding='async'
          className='aspect-[4/3] w-full rounded-xl object-cover'
        />
      ),
    },
    {
      id: 'audio',
      icon: <AudioLines className='size-5' />,
      title: t('home.features.audio.title'),
      desc: t('home.features.audio.desc'),
      tags: [t('home.features.audio.tag1'), t('home.features.audio.tag2')],
      media: <img src='/assets/tokenhub/audio-image-models.png' alt={t('home.features.audio.title')} loading='lazy' decoding='async' className='aspect-[4/3] w-full rounded-xl object-cover' />,
    },
  ]

  return (
    <section className='relative py-32 md:py-40'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Section header */}
        <div className='home-reveal-up mb-16 flex flex-col items-center text-center' style={{ animationDelay: '0ms' }}>
          <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
            <span className='size-1 rounded-full bg-emerald-500 home-pulse-dot' />
            {t('home.features.eyebrow')}
          </span>
          <h2 className='max-w-3xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
            {t('home.features.title')}
          </h2>
          <p className='mt-5 max-w-2xl text-[16px] leading-7 text-muted-foreground'>
            {t('home.features.subtitle')}
          </p>
        </div>

        {/* Feature cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          {cards.map((card, i) => (
            <article
              key={card.id}
              className={`home-reveal-up group relative flex flex-col rounded-2xl border border-border bg-background p-6 home-card-hover ${i === 1 ? 'md:-translate-y-4' : ''}`}
              style={{ animationDelay: `${(i + 1) * 120}ms` }}
            >
              {/* Icon */}
              <div className='flex size-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground transition-colors group-hover:bg-foreground/5'>
                {card.icon}
              </div>

              <h3 className='mt-5 text-[18px] font-semibold text-foreground'>
                {card.title}
              </h3>
              <p className='mt-2 text-[14px] leading-6 text-muted-foreground'>
                {card.desc}
              </p>

              {/* Media */}
              <div className='mt-5 overflow-hidden rounded-xl border border-border/50'>
                {card.media}
              </div>

              {/* Tags */}
              <div className='mt-5 flex flex-wrap gap-2'>
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-md bg-muted/50 px-2.5 py-1 text-[12px] text-muted-foreground transition-colors group-hover:bg-foreground/5 group-hover:text-foreground'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Learn more */}
              <div className='mt-auto pt-5'>
                <div className='inline-flex items-center gap-1 text-[13px] font-medium text-foreground/70 transition-all group-hover:text-foreground'>
                  <span>Learn more</span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
