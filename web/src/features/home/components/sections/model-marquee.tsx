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
    <section className='relative py-24 md:py-32'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='home-reveal-up mb-8 flex items-center justify-between gap-4' style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-semibold tracking-wide text-muted-foreground">
              Providers
            </span>
            <span className="h-px w-8 bg-border" />
          </div>
          <span className='hidden text-[13px] text-muted-foreground md:block'>
            {t('home.marquee.title')}
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
