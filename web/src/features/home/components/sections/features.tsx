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
import { ImageIcon, Video, AudioLines } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const cards = [
    {
      id: 'vision',
      num: '01',
      icon: <ImageIcon className='size-5 stroke-[1.5] text-foreground/70' />,
      title: t('home.features.vision.title'),
      desc: t('home.features.vision.desc'),
      tags: [t('home.features.vision.tag1'), t('home.features.vision.tag2')],
      media: <img src='/assets/tokenhub/vision-image-models.png' alt={t('home.features.vision.title')} loading='lazy' decoding='async' className='mt-5 aspect-[4/3] w-full rounded-md border border-border/60 object-cover' />,
    },
    {
      id: 'video',
      num: '02',
      icon: <Video className='size-5 stroke-[1.5] text-foreground/70' />,
      title: t('home.features.video.title'),
      desc: t('home.features.video.desc'),
      tags: [t('home.features.video.tag1'), t('home.features.video.tag2')],
      media: (
        <img
          src='/assets/tokenhub/demo-video-poster.jpg'
          alt={t('home.features.video.title')}
          loading='lazy'
          decoding='async'
          className='mt-5 aspect-[4/3] w-full rounded-md border border-border/60 object-cover'
        />
      ),
    },
    {
      id: 'audio',
      num: '03',
      icon: <AudioLines className='size-5 stroke-[1.5] text-foreground/70' />,
      title: t('home.features.audio.title'),
      desc: t('home.features.audio.desc'),
      tags: [t('home.features.audio.tag1'), t('home.features.audio.tag2')],
      media: <img src='/assets/tokenhub/audio-image-models.png' alt={t('home.features.audio.title')} loading='lazy' decoding='async' className='mt-5 aspect-[4/3] w-full rounded-md border border-border/60 object-cover' />,
    },
  ]

  return (
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.features.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.features.title')}
          </h2>
          <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
            {t('home.features.subtitle')}
          </p>
        </div>

        {/* TokenHub-style video showcase */}
        <div className='home-fade-in-up mb-16 overflow-hidden rounded-lg border border-border/80 bg-muted/20 opacity-0' style={{ animationDelay: '80ms' }}>
          <video
            className='aspect-video w-full object-cover'
            autoPlay
            muted
            loop
            playsInline
            preload='auto'
            poster='/assets/tokenhub/demo-video-poster.jpg'
            src='/assets/tokenhub/demo-video.mp4'
          />
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {cards.map((card, i) => (
            <div
              key={card.id}
              className='home-fade-in-up border border-border rounded-md p-7 bg-background transition-colors duration-200 hover:border-border/80 hover:bg-muted/[0.03] opacity-0'
              style={{ animationDelay: `${(i + 1) * 80 + 160}ms` }}
            >
              <div className='flex items-start justify-between'>
                <div className='border border-border rounded-md p-2.5 inline-flex items-center justify-center'>
                  {card.icon}
                </div>
                <span className='text-[11px] font-semibold text-muted-foreground tabular-nums'>
                  {card.num}
                </span>
              </div>
              <h3 className='mt-5 text-[15px] font-semibold text-foreground'>
                {card.title}
              </h3>
              <p className='mt-2 text-[14px] leading-6 text-muted-foreground'>
                {card.desc}
              </p>
              {card.media}
              <div className='mt-5 space-y-1'>
                {card.tags.map((tag) => (
                  <p key={tag} className='text-[12px] text-muted-foreground/80'>
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
