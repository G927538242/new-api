import { useTranslation } from 'react-i18next'

import { providerIconMap } from './provider-icons'

interface ModelMarqueeProps {
  className?: string
}

const providerKeys = [
  'home.marquee.openai',
  'home.marquee.gemini',
  'home.marquee.claude',
  'home.marquee.deepseek',
  'home.marquee.bytedance',
  'home.marquee.elevenlabs',
  'home.marquee.minimax',
  'home.marquee.kling',
  'home.marquee.vidu',
  'home.marquee.grok',
  'home.marquee.wan',
  'home.marquee.runway',
] as const

export function ModelMarquee(_props: ModelMarqueeProps) {
  const { t } = useTranslation()

  const groups = [0, 1]

  return (
    <section className='relative border-y border-border/60 bg-muted/25 py-16 md:py-20'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div
          className='home-reveal-up mb-10 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between'
          style={{ animationDelay: '0ms' }}
        >
          <div>
            <h2 className='text-[24px] font-semibold tracking-tight text-foreground'>
              {t('home.marquee.title')}
            </h2>
            <p className='mt-2 text-[13.5px] text-muted-foreground'>
              {t('home.stats.providers')} · {t('home.stats.models')}
            </p>
          </div>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
            <span className='relative flex size-1.5'>
              <span className='home-pulse-dot absolute inline-flex size-full rounded-full bg-emerald-500/60' />
              <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className='relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]'>
        <div className='home-marquee-track flex w-max items-center'>
          {groups.map((group) => (
            <ul
              key={group}
              aria-hidden={group === 1}
              className='flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14'
            >
              {providerKeys.map((key) => {
                const IconComponent = providerIconMap[key]
                return (
                  <li
                    key={key}
                    className='group flex shrink-0 items-center gap-2.5 text-[14px] font-medium tracking-tight text-muted-foreground transition-colors duration-200 hover:text-foreground'
                  >
                    {IconComponent && (
                      <span className='flex size-6 shrink-0 items-center justify-center text-foreground/40 transition-colors duration-200 group-hover:text-foreground'>
                        <IconComponent className='size-[14px]' />
                      </span>
                    )}
                    <span>{t(key)}</span>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
