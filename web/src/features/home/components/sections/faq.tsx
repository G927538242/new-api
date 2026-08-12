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
    <section className='py-28 md:py-36'>
      <div className='mx-auto max-w-[800px] px-6'>
        {/* Header */}
        <div className='home-reveal-up mb-12 flex flex-col items-center text-center' style={{ animationDelay: '0ms' }}>
          <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
            {t('home.faq.eyebrow')}
          </span>
          <h2 className='max-w-xl text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
            {t('home.faq.title')}
          </h2>
        </div>

        <div
          className='home-reveal-up divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background'
          style={{ animationDelay: '100ms' }}
        >
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q}>
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className='flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/30'
                >
                  <span className='text-[15px] font-medium text-foreground'>
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
                    'grid transition-all duration-300 ease-out',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className='overflow-hidden'>
                    <p className='px-6 pb-5 text-[14px] leading-6 text-muted-foreground'>
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
