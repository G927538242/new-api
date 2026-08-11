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
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface FAQProps {
  className?: string
}

export function FAQ(_props: FAQProps) {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const items = [
    {
      q: t('home.faq.01.q'),
      a: t('home.faq.01.a'),
    },
    {
      q: t('home.faq.02.q'),
      a: t('home.faq.02.a'),
    },
    {
      q: t('home.faq.03.q'),
      a: t('home.faq.03.a'),
    },
    {
      q: t('home.faq.04.q'),
      a: t('home.faq.04.a'),
    },
  ]

  return (
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.faq.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.faq.title')}
          </h2>
        </div>

        <div
          className='home-fade-in-up divide-y divide-border border border-border rounded-md overflow-hidden bg-background opacity-0'
          style={{ animationDelay: '80ms' }}
        >
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q}>
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/5 md:px-6 md:py-5'
                >
                  <span className='text-[14px] font-medium text-foreground'>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-200 ease-out',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className='overflow-hidden'>
                    <p className='px-5 pb-5 text-[13px] leading-6 text-muted-foreground md:px-6 md:pb-6'>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
