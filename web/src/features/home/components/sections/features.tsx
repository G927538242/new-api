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
import { ImageIcon, Video, AudioLines, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const rows = [
    {
      id: 'vision',
      num: '01',
      icon: <ImageIcon className='size-5' />,
      title: t('home.features.vision.title'),
      desc: t('home.features.vision.desc'),
      tags: [t('home.features.vision.tag1'), t('home.features.vision.tag2')],
      media: (
        <img
          src='/assets/tokenhub/vision-image-models.png'
          alt={t('home.features.vision.title')}
          loading='lazy'
          decoding='async'
          className='aspect-[4/3] w-full rounded-xl border border-border object-cover'
        />
      ),
    },
    {
      id: 'video',
      num: '02',
      icon: <Video className='size-5' />,
      title: t('home.features.video.title'),
      desc: t('home.features.video.desc'),
      tags: [t('home.features.video.tag1'), t('home.features.video.tag2')],
      media: (
        <video
          src='/assets/tokenhub/demo-video.mp4'
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          poster='/assets/tokenhub/demo-video-poster.jpg'
          aria-label={t('home.features.video.title')}
          className='aspect-[4/3] w-full rounded-xl border border-border object-cover'
        />
      ),
    },
    {
      id: 'audio',
      num: '03',
      icon: <AudioLines className='size-5' />,
      title: t('home.features.audio.title'),
      desc: t('home.features.audio.desc'),
      tags: [t('home.features.audio.tag1'), t('home.features.audio.tag2')],
      media: (
        <img
          src='/assets/tokenhub/audio-image-models.png'
          alt={t('home.features.audio.title')}
          loading='lazy'
          decoding='async'
          className='aspect-[4/3] w-full rounded-xl border border-border object-cover'
        />
      ),
    },
  ]

  return (
    <section className='relative py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header: left-aligned, enterprise style */}
        <div
          className='home-reveal-up mb-16 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between'
          style={{ animationDelay: '0ms' }}
        >
          <div className='max-w-xl'>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.features.eyebrow')}
            </span>
            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.features.title')}
            </h2>
            <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
              {t('home.features.subtitle')}
            </p>
          </div>
          <div className='hidden shrink-0 items-center gap-2 text-[13px] text-muted-foreground md:flex'>
            <span>Vision · Video · Audio</span>
          </div>
        </div>

        {/* Capability rows: alternating editorial layout */}
        <div className='space-y-20 md:space-y-28'>
          {rows.map((row, i) => {
            const reversed = i % 2 === 1
            return (
              <div
                key={row.id}
                className='home-reveal-up grid items-center gap-10 lg:grid-cols-12 lg:gap-16'
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                {/* Media */}
                <div
                  className={cn(
                    'group relative overflow-hidden rounded-xl border border-border bg-muted/20',
                    reversed ? 'lg:order-2 lg:col-span-7' : 'lg:col-span-7'
                  )}
                >
                  <div className='transition-transform duration-500 group-hover:scale-[1.015]'>
                    {row.media}
                  </div>
                  <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-foreground/[0.03] ring-inset' />
                </div>

                {/* Copy */}
                <div
                  className={cn(
                    reversed ? 'lg:order-1 lg:col-span-5' : 'lg:col-span-5'
                  )}
                >
                  <div className='mb-6 flex items-center gap-4'>
                    <span className='flex size-11 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm'>
                      {row.icon}
                    </span>
                    <span className='home-editorial-num text-3xl font-semibold text-foreground/10'>
                      {row.num}
                    </span>
                  </div>

                  <h3 className='text-[22px] font-semibold tracking-tight text-foreground'>
                    {row.title}
                  </h3>
                  <p className='mt-3 max-w-md text-[14.5px] leading-7 text-muted-foreground'>
                    {row.desc}
                  </p>

                  <div className='mt-6 flex flex-wrap gap-2'>
                    {row.tags.map((tag) => (
                      <span
                        key={tag}
                        className='rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[12.5px] font-medium text-foreground'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className='mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-foreground transition-colors hover:text-foreground/60'>
                    <span>{t('home.hero.exploreModels')}</span>
                    <ArrowUpRight className='size-4' />
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
