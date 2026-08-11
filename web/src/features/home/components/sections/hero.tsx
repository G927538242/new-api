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
import { ArrowRight, BookOpen, Terminal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

const renderOpenApiButton = (isAuthenticated: boolean, t: (k: string) => string) => {
  const to = isAuthenticated ? '/playground' : '/sign-in'
  return (
    <Button
      variant='outline'
      className='h-11 rounded-md border-sky-200/60 bg-sky-50/60 px-5 text-sm font-medium text-sky-700 backdrop-blur-sm hover:bg-sky-100/70 hover:text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20'
      render={<Link to={to} />}
    >
      <Terminal className='mr-1.5 size-4' />
      <span>{t('Open API')}</span>
    </Button>
  )
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || '/docs'

  const renderDocsButton = () => {
    const isExternal = docsUrl.startsWith('http')
    if (isExternal) {
      return (
        <Button
          variant='outline'
          className='h-11 rounded-md border-sky-200/60 bg-sky-50/60 px-5 text-sm font-medium text-sky-700 backdrop-blur-sm hover:bg-sky-100/70 hover:text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20'
          render={
            <a href={docsUrl} target='_blank' rel='noopener noreferrer' />
          }
        >
          <BookOpen className='mr-1.5 size-4' />
          <span>{t('Docs')}</span>
        </Button>
      )
    }
    return (
      <Button
        variant='outline'
        className='h-11 rounded-md border-sky-200/60 bg-sky-50/60 px-5 text-sm font-medium text-sky-700 backdrop-blur-sm hover:bg-sky-100/70 hover:text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20'
        render={<Link to={docsUrl} />}
      >
        <BookOpen className='mr-1.5 size-4' />
        <span>{t('Docs')}</span>
      </Button>
    )
  }

  return (
    <section className='relative z-10 bg-transparent px-6 pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10'>
          <div className='flex flex-col items-start text-left lg:col-span-6'>
            <div className='home-fade-in-up w-full' style={{ animationDelay: '0ms' }}>
              <h1 className='text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.05] font-semibold tracking-[-0.02em]'>
                {t('home.hero.title')}
                <br />
                <span className='bg-gradient-to-br from-foreground/90 via-foreground/95 to-foreground/92 bg-clip-text text-transparent'>
                  {t('home.hero.titleHighlight')}
                </span>
              </h1>
            </div>

            <p
              className='home-fade-in-up mt-6 max-w-2xl text-[15px] leading-7 text-muted-foreground opacity-0'
              style={{ animationDelay: '80ms' }}
            >
              {t('home.hero.subtitle')}
            </p>

            <div
              className='home-fade-in-up mt-9 flex flex-wrap items-center gap-3 opacity-0'
              style={{ animationDelay: '160ms' }}
            >
              {props.isAuthenticated ? (
                <>
                  <Button
                    className='h-11 rounded-md bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90'
                    render={<Link to='/dashboard' />}
                  >
                    {t('Go to Dashboard')}
                    <ArrowRight className='ml-1.5 size-4' />
                  </Button>
                  {renderOpenApiButton(true, t)}
                  {renderDocsButton()}
                </>
              ) : (
                <>
                  <Button
                    className='h-11 rounded-md bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90'
                    render={<Link to='/sign-up' />}
                  >
                    {t('Get Started')}
                    <ArrowRight className='ml-1.5 size-4' />
                  </Button>
                  {renderOpenApiButton(false, t)}
                  <Button
                    variant='outline'
                    className='h-11 rounded-md border-sky-200/60 bg-sky-50/60 px-5 text-sm font-medium text-sky-700 backdrop-blur-sm hover:bg-sky-100/70 hover:text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20'
                    render={<Link to='/pricing' />}
                  >
                    {t('home.hero.exploreModels')}
                  </Button>
                  {renderDocsButton()}
                </>
              )}
            </div>
          </div>

          <div
            className='home-fade-in-up flex w-full justify-center opacity-0 lg:col-span-6'
            style={{ animationDelay: '240ms' }}
          >
            <div className='mt-8 scale-[0.92] origin-top-left lg:mt-0'>
              <HeroTerminalDemo />
            </div>
          </div>
        </div>

        <div
          className='home-fade-in-up mx-auto mt-20 grid grid-cols-2 gap-8 opacity-0 md:mt-24 md:grid-cols-4'
          style={{ animationDelay: '320ms' }}
        >
          {[
            { val: '50+', label: t('home.stats.providers') },
            { val: '200+', label: t('home.stats.models') },
            { val: '99.9%', label: t('home.stats.uptime') },
            { val: '50+', label: t('home.stats.routes') },
          ].map((s) => (
            <div key={s.label} className='flex flex-col items-start'>
              <div className='text-2xl font-semibold tracking-tight'>
                {s.val}
              </div>
              <div className='mt-1 text-[12px] text-muted-foreground'>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
