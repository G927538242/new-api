import { Link } from '@tanstack/react-router'
import { ArrowRight, Terminal, BookOpen, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  const primaryCta = props.isAuthenticated ? (
    <Button
      className='h-12 rounded-lg border-0 bg-foreground px-7 text-[14px] font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:scale-[1.02] hover:bg-foreground/90'
      render={<Link to='/dashboard' />}
    >
      {t('Go to Dashboard')}
      <ArrowRight className='ml-2 size-4' />
    </Button>
  ) : (
    <Button
      className='h-12 rounded-lg border-0 bg-foreground px-7 text-[14px] font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:scale-[1.02] hover:bg-foreground/90'
      render={<Link to='/sign-up' />}
    >
      {t('Get Started')}
      <ArrowRight className='ml-2 size-4' />
    </Button>
  )

  return (
    <section className='relative overflow-hidden px-6 pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40'>
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.03] blur-3xl dark:bg-foreground/[0.04]" />
        <div className="absolute top-40 right-0 h-[300px] w-[300px] translate-x-1/4 rounded-full bg-foreground/[0.02] blur-3xl dark:bg-foreground/[0.03]" />
      </div>

      <div className='relative mx-auto max-w-[1200px] px-6'>
        {/* Top badge */}
        <div className='home-reveal-up mb-12 flex justify-center' style={{ animationDelay: '0ms' }}>
          <Link
            to={props.isAuthenticated ? '/playground' : '/sign-in'}
            className='group inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-foreground/30 hover:bg-background hover:text-foreground'
          >
            <Sparkles className="size-3.5 text-foreground/60 transition-transform group-hover:scale-110" />
            <span>API 在线体验 · 支持 50+ 主流模型</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Main hero content */}
        <div className='flex flex-col items-center text-center'>
          <div className='home-reveal-up' style={{ animationDelay: '80ms' }}>
            <h1 className='text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] font-semibold tracking-tight text-foreground'>
              <span className="block">{t('home.hero.title')}</span>
              <span className="home-shimmer-text block text-foreground/60">{t('home.hero.titleHighlight')}</span>
            </h1>
          </div>

          <div className='home-reveal-up mt-8 max-w-2xl' style={{ animationDelay: '160ms' }}>
            <p className='text-[17px] leading-7 text-muted-foreground'>
              {t('home.hero.subtitle')}
            </p>
          </div>

          <div className='home-reveal-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6' style={{ animationDelay: '240ms' }}>
            {primaryCta}
            <div className='flex items-center gap-5'>
              <Link
                to={props.isAuthenticated ? '/playground' : '/sign-in'}
                className='inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-[14px] font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-foreground/5'
              >
                <Terminal className='size-4' />
                <span>{t('Open API')}</span>
              </Link>
              <Link
                to='/docs'
                className='inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-[14px] font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-foreground/5'
              >
                <BookOpen className='size-4' />
                <span>{t('Docs')}</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className='home-reveal-up mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4' style={{ animationDelay: '320ms' }}>
            {[
              { val: '50+', label: t('home.stats.providers') },
              { val: '200+', label: t('home.stats.models') },
              { val: '99.9%', label: t('home.stats.uptime') },
              { val: '11', label: t('home.stats.routes') },
            ].map((s) => (
              <div key={s.label} className='flex flex-col items-center'>
                <div className='text-2xl font-semibold tracking-tight text-foreground'>
                  {s.val}
                </div>
                <div className='mt-1 text-[11px] tracking-wide text-muted-foreground'>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Demo Card */}
        <div className='home-reveal-scale mt-16 flex justify-center' style={{ animationDelay: '400ms' }}>
          <div className='home-float w-full max-w-lg'>
            <HeroTerminalDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
