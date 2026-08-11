/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
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
    <section className='border-t border-border bg-transparent py-24 md:py-32'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-10 flex items-center gap-4' style={{ animationDelay: '0ms' }}>
          <p className='text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            Providers
          </p>
          <span className='text-[13px] font-medium text-foreground/80'>
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
                      <span className='flex size-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/40 text-foreground/70 transition-all duration-200 group-hover:border-border group-hover:bg-muted group-hover:text-foreground'>
                        <IconComponent className='size-[18px]' />
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
