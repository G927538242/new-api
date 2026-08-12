import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TestimonialsProps {
  className?: string
}

export function Testimonials(_props: TestimonialsProps) {
  const { t } = useTranslation()

  const items = [
    {
      quote: t('home.testimonials.01.quote'),
      name: t('home.testimonials.01.name'),
      role: t('home.testimonials.01.role'),
      avatar: '/assets/tokenhub/avatars/david-chen.jpg',
    },
    {
      quote: t('home.testimonials.02.quote'),
      name: t('home.testimonials.02.name'),
      role: t('home.testimonials.02.role'),
      avatar: '/assets/tokenhub/avatars/sarah-jenkins.jpg',
    },
    {
      quote: t('home.testimonials.03.quote'),
      name: t('home.testimonials.03.name'),
      role: t('home.testimonials.03.role'),
      avatar: '/assets/tokenhub/avatars/marcus-row.jpg',
    },
  ]

  return (
    <section className='py-32 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div className='home-reveal-up mb-16 flex flex-col items-center text-center' style={{ animationDelay: '0ms' }}>
          <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
            {t('home.testimonials.eyebrow')}
          </span>
          <h2 className='max-w-2xl text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
            {t('home.testimonials.title')}
          </h2>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {items.map((item, i) => (
            <div
              key={item.name}
              className='home-reveal-up group flex flex-col rounded-2xl border border-border bg-background p-6 home-card-hover'
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <Quote className='mb-4 size-6 text-foreground/20' />
              <p className='mb-6 flex-1 text-[14px] leading-6 text-foreground/80'>
                {item.quote}
              </p>
              <div className='flex items-center gap-3 border-t border-border/50 pt-4'>
                <img
                  src={item.avatar}
                  alt={item.name}
                  width={36}
                  height={36}
                  loading='lazy'
                  decoding='async'
                  className='size-9 rounded-full object-cover'
                />
                <div className='flex flex-col'>
                  <span className='text-[14px] font-semibold text-foreground'>{item.name}</span>
                  <span className='text-[12px] text-muted-foreground'>
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
