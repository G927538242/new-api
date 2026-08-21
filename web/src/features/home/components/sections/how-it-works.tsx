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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '01',
      title: t('home.steps.01.title'),
      desc: t('home.steps.01.desc'),
      hint: t('home.steps.01.hint'),
    },
    {
      num: '02',
      title: t('home.steps.02.title'),
      desc: t('home.steps.02.desc'),
      hint: t('home.steps.02.hint'),
    },
    {
      num: '03',
      title: t('home.steps.03.title'),
      desc: t('home.steps.03.desc'),
      hint: t('home.steps.03.hint'),
    },
  ]

  return (
    <section className='relative border-t border-border/60 bg-muted/25 py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div
          className='home-reveal-up mb-16 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between'
          style={{ animationDelay: '0ms' }}
        >
          <div className='max-w-xl'>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.steps.eyebrow')}
            </span>
            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.steps.title')}
            </h2>
            <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
              {t('home.steps.subtitle')}
            </p>
          </div>
        </div>

        {/* Steps with connector line */}
        <div className='home-reveal-up relative' style={{ animationDelay: '100ms' }}>
          {/* Connector */}
          <div className='absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-border md:block' />

          <div className='grid gap-12 md:grid-cols-3 md:gap-10'>
            {steps.map((step, i) => (
              <div key={step.num} className='relative flex flex-col items-start'>
                {/* Node */}
                <div className='relative z-10 flex items-center gap-4'>
                  <span className='flex size-14 items-center justify-center rounded-full border-2 border-border bg-background font-mono text-[15px] font-semibold text-foreground shadow-sm'>
                    {step.num}
                  </span>
                  {i < steps.length - 1 && (
                    <ArrowRight className='size-4 shrink-0 text-muted-foreground/40 md:hidden' />
                  )}
                </div>

                <h3 className='mt-7 text-[19px] font-semibold tracking-tight text-foreground'>
                  {step.title}
                </h3>
                <p className='mt-2.5 max-w-xs text-[14px] leading-6 text-muted-foreground'>
                  {step.desc}
                </p>

                {step.hint && (
                  <div className='mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[11.5px] text-foreground'>
                    <span className='size-1 rounded-full bg-foreground/30' />
                    {step.hint}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
