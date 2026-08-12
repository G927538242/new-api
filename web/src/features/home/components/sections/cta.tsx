import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='py-32 md:py-40'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='home-reveal-up relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-muted/50 to-background p-12 md:p-20' style={{ animationDelay: '0ms' }}>
          {/* Decorative */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-foreground/[0.04] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-foreground/[0.03] blur-3xl" />

          <div className='relative flex flex-col items-center text-center'>
            <span className='mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-emerald-500 home-pulse-dot' />
              Ready to start
            </span>

            <h2 className='max-w-2xl text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-foreground'>
              <span className="block">{t('home.hero.title')}</span>
              <span className="home-shimmer-text block text-foreground/50">{t('home.hero.titleHighlight')}</span>
            </h2>

            <p className='mt-6 max-w-xl text-[16px] leading-7 text-muted-foreground'>
              {t('home.cta.subtitle')}
            </p>

            <div className='mt-10 flex flex-col items-center gap-5 sm:flex-row'>
              <Button
                className='h-12 rounded-lg border-0 bg-foreground px-8 text-[14px] font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:scale-[1.02] hover:bg-foreground/90'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-2 size-4' />
              </Button>
              <Link
                to='/pricing'
                className='inline-flex items-center gap-1.5 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                {t('home.hero.exploreModels')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
