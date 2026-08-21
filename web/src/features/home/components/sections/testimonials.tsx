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
      initials: t('home.testimonials.01.initials'),
    },
    {
      quote: t('home.testimonials.02.quote'),
      name: t('home.testimonials.02.name'),
      role: t('home.testimonials.02.role'),
      initials: t('home.testimonials.02.initials'),
    },
    {
      quote: t('home.testimonials.03.quote'),
      name: t('home.testimonials.03.name'),
      role: t('home.testimonials.03.role'),
      initials: t('home.testimonials.03.initials'),
    },
  ]

  return (
    <section className='relative py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div
          className='home-reveal-up mb-16 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between'
          style={{ animationDelay: '0ms' }}
        >
          <div className='max-w-xl'>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.testimonials.eyebrow')}
            </span>
            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.testimonials.title')}
            </h2>
          </div>
        </div>

        {/* Cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          {items.map((item, i) => (
            <figure
              key={item.name}
              className='home-reveal-up flex flex-col rounded-xl border border-border/80 bg-background p-7 transition-all hover:border-foreground/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]'
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className='mb-5 flex items-center justify-between'>
                <Quote className='size-5 text-foreground/15' />
                <span className='h-px w-10 bg-border' />
              </div>
              <blockquote className='mb-8 flex-1 text-[14.5px] leading-7 text-foreground/85'>
                {item.quote}
              </blockquote>
              <figcaption className='flex items-center gap-3 border-t border-border/60 pt-5'>
                <span className='flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-[13px] font-semibold text-foreground'>
                  {item.initials}
                </span>
                <div className='flex flex-col'>
                  <span className='text-[14px] font-semibold text-foreground'>{item.name}</span>
                  <span className='text-[12px] text-muted-foreground'>
                    {item.role}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
