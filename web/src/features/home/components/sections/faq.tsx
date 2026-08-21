import { Plus } from 'lucide-react'
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
    <section className='relative border-t border-border/60 bg-muted/25 py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='grid gap-12 lg:grid-cols-12 lg:gap-20'>
          {/* Left: header */}
          <div className='home-reveal-up lg:col-span-5' style={{ animationDelay: '0ms' }}>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.faq.eyebrow')}
            </span>
            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.faq.title')}
            </h2>
            <div className='mt-6 hidden items-center gap-3 lg:flex'>
              <span className='h-px w-10 bg-border' />
              <span className='text-[12px] font-medium tracking-wide text-muted-foreground'>
                FAQ
              </span>
            </div>
          </div>

          {/* Right: accordion */}
          <div className='home-reveal-up lg:col-span-7' style={{ animationDelay: '120ms' }}>
            <div className='divide-y divide-border/80 rounded-xl border border-border/80 bg-background px-6 shadow-sm md:px-8'>
              {items.map((item, i) => {
                const isOpen = openIndex === i
                return (
                  <div key={item.q}>
                    <button
                      type='button'
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className='flex w-full items-center justify-between gap-4 py-5 text-left transition-colors'
                    >
                      <span
                        className={cn(
                          'text-[15px] font-medium transition-colors',
                          isOpen ? 'text-foreground' : 'text-foreground/80'
                        )}
                      >
                        {item.q}
                      </span>
                      <Plus
                        className={cn(
                          'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                          isOpen && 'rotate-45'
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
                        <p className='pb-5 text-[14px] leading-6 text-muted-foreground'>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
