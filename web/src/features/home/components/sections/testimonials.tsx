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
import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TestimonialsProps {
  className?: string
}

export function Testimonials(_props: TestimonialsProps) {
  const { t } = useTranslation()

  const items = [
    {
      quote: t('home.testimonials.01.quote'),
      name: t('home.testimonials.01.name'),
      role: t('home.testimonials.01.role'),
      initials: t('home.testimonials.01.initials'),
      avatar: '/assets/tokenhub/avatars/david-chen.jpg',
    },
    {
      quote: t('home.testimonials.02.quote'),
      name: t('home.testimonials.02.name'),
      role: t('home.testimonials.02.role'),
      initials: t('home.testimonials.02.initials'),
      avatar: '/assets/tokenhub/avatars/sarah-jenkins.jpg',
    },
    {
      quote: t('home.testimonials.03.quote'),
      name: t('home.testimonials.03.name'),
      role: t('home.testimonials.03.role'),
      initials: t('home.testimonials.03.initials'),
      avatar: '/assets/tokenhub/avatars/marcus-row.jpg',
    },
  ]

  return (
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.testimonials.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.testimonials.title')}
          </h2>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {items.map((item, i) => (
            <div
              key={item.name}
              className='home-fade-in-up border border-border rounded-md p-7 bg-background opacity-0 flex flex-col'
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <Quote className='mb-4 size-6 text-muted-foreground/30' />
              <p className='mb-8 text-[14px] leading-6 text-foreground/80 flex-1'>
                {item.quote}
              </p>
              <div className='flex items-center gap-3 mt-auto'>
                <img
                  src={item.avatar}
                  alt={item.name}
                  width={32}
                  height={32}
                  loading='lazy'
                  decoding='async'
                  className='size-8 rounded-full object-cover'
                />
                <div className='flex flex-col'>
                  <span className='text-[14px] font-semibold text-foreground'>{item.name}</span>
                  <span className='text-[12px] text-muted-foreground'>
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
