import { Link } from '@tanstack/react-router'
import { ArrowRight, Terminal, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

import { ParticleStream } from '../particle-stream'
import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  const primaryCta = props.isAuthenticated ? (
    <Button
      className='h-12 rounded-lg bg-foreground px-8 text-[14px] font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:bg-foreground/85 hover:shadow-foreground/20'
      render={<Link to='/dashboard' />}
    >
      {t('Go to Dashboard')}
      <ArrowRight className='ml-2 size-4' />
    </Button>
  ) : (
    <Button
      className='h-12 rounded-lg bg-foreground px-8 text-[14px] font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:bg-foreground/85 hover:shadow-foreground/20'
      render={<Link to='/sign-up' />}
    >
      {t('Get Started')}
      <ArrowRight className='ml-2 size-4' />
    </Button>
  )

  const stats = [
    { val: '50+', label: t('home.stats.providers') },
    { val: '200+', label: t('home.stats.models') },
    { val: '99.9%', label: t('home.stats.uptime') },
    { val: '11', label: t('home.stats.routes') },
  ]

  return (
    <section className='relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-24'>
      {/* Dynamic particle stream background */}
      <ParticleStream className='pointer-events-none absolute inset-0 z-0' />

      {/* Gradient overlays for readability */}
      <div className='pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background via-background/60 to-background/80' />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-24 z-[1] bg-gradient-to-b from-background to-transparent' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 z-[1] bg-gradient-to-t from-background to-transparent' />

      <div className='relative z-[2] mx-auto max-w-[1200px] px-6'>
        <div className='flex flex-col items-center text-center'>
          {/* Top badge */}
          <div className='home-reveal-up mb-8' style={{ animationDelay: '0ms' }}>
            <Link
              to={props.isAuthenticated ? '/playground' : '/sign-in'}
              className='group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-[12px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:border-foreground/25 hover:text-foreground'
            >
              <span className='relative flex size-2'>
                <span className='home-pulse-dot absolute inline-flex size-full rounded-full bg-foreground/60' />
                <span className='relative inline-flex size-2 rounded-full bg-foreground/70' />
              </span>
              <span>API 在线体验 · 支持 50+ 主流模型</span>
              <ArrowRight className='size-3 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </div>

          {/* Title */}
          <div className='home-reveal-up' style={{ animationDelay: '80ms' }}>
            <h1 className='max-w-3xl text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.08] font-semibold tracking-tight text-foreground'>
              {t('home.hero.title')}
              <span className='block text-foreground/40'>{t('home.hero.titleHighlight')}</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className='home-reveal-up mt-7' style={{ animationDelay: '160ms' }}>
            <p className='mx-auto max-w-2xl text-[15.5px] leading-7 text-muted-foreground'>
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* CTAs */}
          <div
            className='home-reveal-up mt-10 flex flex-col items-center gap-4 sm:flex-row'
            style={{ animationDelay: '240ms' }}
          >
            {primaryCta}
            <div className='flex items-center gap-3'>
              <Link
                to={props.isAuthenticated ? '/playground' : '/sign-in'}
                className='inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-background/60 px-5 text-[14px] font-medium text-foreground backdrop-blur-sm transition-all hover:border-foreground/30 hover:bg-foreground/[0.03]'
              >
                <Terminal className='size-4' />
                <span>{t('Open API')}</span>
              </Link>
              <Link
                to='/docs'
                className='inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-background/60 px-5 text-[14px] font-medium text-foreground backdrop-blur-sm transition-all hover:border-foreground/30 hover:bg-foreground/[0.03]'
              >
                <BookOpen className='size-4' />
                <span>{t('Docs')}</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className='home-reveal-up mt-14 grid w-full max-w-2xl grid-cols-2 gap-x-6 gap-y-8 border-t border-border/80 pt-10 sm:grid-cols-4'
            style={{ animationDelay: '320ms' }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={i % 2 === 1 ? 'sm:pl-6 sm:border-l sm:border-border/60' : ''}
              >
                <div className='text-[28px] font-semibold tracking-tight text-foreground tabular-nums'>
                  {s.val}
                </div>
                <div className='mt-1 text-[12px] tracking-wide text-muted-foreground'>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live API console */}
        <div className='home-reveal-scale mt-16 md:mt-20' style={{ animationDelay: '200ms' }}>
          <div className='mx-auto max-w-4xl'>
            <HeroTerminalDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
