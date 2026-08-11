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
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.steps.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.steps.title')}
          </h2>
          <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
            {t('home.steps.subtitle')}
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className='home-fade-in-up border border-border rounded-md p-7 bg-background opacity-0'
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className='grid grid-cols-[auto_1fr] gap-5'>
                <div className='text-5xl font-semibold tracking-tight text-muted-foreground/20 tabular-nums'>
                  {step.num}
                </div>
                <div className='min-w-0'>
                  <h3 className='text-[15px] font-semibold text-foreground'>
                    {step.title}
                  </h3>
                  <p className='mt-2 text-[14px] leading-6 text-muted-foreground'>
                    {step.desc}
                  </p>
                  {step.hint && (
                    <div className='mt-4 border-t border-border pt-4 font-mono text-[12px] text-foreground/60'>
                      {step.hint}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
