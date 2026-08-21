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
    <section className='relative py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div
          className='home-reveal-up relative overflow-hidden rounded-2xl bg-[#0a0a0b] px-8 py-20 text-center md:py-24'
          style={{ animationDelay: '0ms' }}
        >
          {/* Decorative */}
          <div className='pointer-events-none absolute inset-0 overflow-hidden'>
            <div className='absolute top-[-30%] left-1/2 h-[420px] w-[840px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl' />
            <div className='absolute right-[-10%] bottom-[-30%] h-[280px] w-[280px] rounded-full bg-white/[0.04] blur-3xl' />
            <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]' />
          </div>

          <div className='relative mx-auto flex max-w-2xl flex-col items-center text-center'>
            <span className='mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide text-white/60'>
              <span className='size-1 rounded-full bg-white/40' />
              Ready to start
            </span>

            <h2 className='text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.1] font-semibold tracking-tight text-white'>
              <span className='block'>{t('home.hero.title')}</span>
              <span className='block text-white/45'>{t('home.hero.titleHighlight')}</span>
            </h2>

            <p className='mt-6 max-w-xl text-[15.5px] leading-7 text-white/55'>
              {t('home.cta.subtitle')}
            </p>

            <div className='mt-10 flex flex-col items-center gap-5 sm:flex-row'>
              <Button
                className='h-12 rounded-lg bg-white px-8 text-[14px] font-semibold text-black shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] transition-all hover:bg-white/85'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-2 size-4' />
              </Button>
              <Link
                to='/pricing'
                className='inline-flex items-center gap-1.5 text-[14px] font-medium text-white/60 transition-colors hover:text-white'
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
