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
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div
          className='home-fade-in-up mx-auto max-w-2xl text-center opacity-0'
          style={{ animationDelay: '0ms' }}
        >
          <h2 className='text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.02em]'>
            {t('home.hero.title')}
            <br />
            <span className='bg-gradient-to-br from-foreground/90 via-foreground/95 to-foreground/92 bg-clip-text text-transparent'>
              {t('home.hero.titleHighlight')}
            </span>
          </h2>
          <p className='max-w-xl mx-auto text-[15px] leading-7 text-muted-foreground mt-5'>
            {t('home.cta.subtitle')}
          </p>
          <div className='mt-9 flex items-center justify-center gap-3'>
            <Button
              className='h-12 rounded-md bg-foreground px-7 text-base font-medium text-background hover:bg-foreground/90'
              render={<Link to='/sign-up' />}
            >
              {t('Get Started')}
              <ArrowRight className='ml-1.5 size-4' />
            </Button>
            <Button
              variant='outline'
              className='h-12 rounded-md border-sky-200/60 bg-sky-50/60 px-5 text-base font-medium text-sky-700 backdrop-blur-sm hover:bg-sky-100/70 hover:text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20'
              render={<Link to='/pricing' />}
            >
              {t('home.hero.exploreModels')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
