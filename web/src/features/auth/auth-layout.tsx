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
import { Shield, Zap, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeSwitch } from '@/components/theme-switch'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div className='relative grid min-h-svh lg:grid-cols-2'>
      {/* Left branding panel — hidden on mobile */}
      <div className='relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-12 lg:flex dark:from-sky-700 dark:via-blue-700 dark:to-indigo-800'>
        {/* Decorative orbs */}
        <div className='pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-sky-300/20 blur-3xl' />

        {/* Logo */}
        <Link
          to='/'
          className='relative z-10 flex items-center gap-2.5 transition-opacity hover:opacity-90'
        >
          <div className='relative size-9 shrink-0'>
            {loading ? (
              <Skeleton className='absolute inset-0 rounded-full' />
            ) : (
              <img
                src={logo}
                alt={t('Logo')}
                className='size-9 rounded-full object-cover ring-2 ring-white/30'
              />
            )}
          </div>
          {loading ? (
            <Skeleton className='h-6 w-28' />
          ) : (
            <span className='text-lg font-semibold text-white'>{systemName}</span>
          )}
        </Link>

        {/* Marketing content */}
        <div className='relative z-10 space-y-8'>
          <div className='space-y-4'>
            <h1 className='text-3xl font-bold leading-tight text-white xl:text-4xl'>
              {t('home.hero.title')}
              <br />
              <span className='text-sky-200'>{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className='max-w-md text-[15px] leading-relaxed text-white/70'>
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Branding image */}
          <div className='relative overflow-hidden rounded-2xl ring-1 ring-white/20 shadow-2xl shadow-blue-900/30'>
            <img
              src='/assets/tokenhub/auth-branding.jpg'
              alt={systemName}
              loading='lazy'
              decoding='async'
              className='aspect-[4/3] w-full object-cover'
            />
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent' />
          </div>

          {/* Feature highlights */}
          <div className='space-y-4'>
            {[
              { icon: Zap, title: t('Fast & Reliable'), desc: t('99.9% uptime SLA with global edge routing') },
              { icon: Globe, title: t('200+ AI Models'), desc: t('One API key for all major providers') },
              { icon: Shield, title: t('Enterprise Ready'), desc: t('SOC2 compliant with fine-grained access control') },
            ].map((feature) => (
              <div key={feature.title} className='flex items-start gap-3'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm'>
                  <feature.icon className='size-5 text-white' />
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-white'>{feature.title}</h3>
                  <p className='text-xs text-white/60'>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='relative z-10 text-xs text-white/40'>
          © 2026 {systemName}. {t('All rights reserved.')}
        </div>
      </div>

      {/* Right form panel */}
      <div className='relative flex flex-col'>
        {/* Mobile header */}
        <div className='flex items-center justify-between p-4 lg:hidden'>
          <Link
            to='/'
            className='flex items-center gap-2 transition-opacity hover:opacity-80'
          >
            <div className='relative size-7 shrink-0'>
              {loading ? (
                <Skeleton className='absolute inset-0 rounded-full' />
              ) : (
                <img
                  src={logo}
                  alt={t('Logo')}
                  className='size-7 rounded-full object-cover'
                />
              )}
            </div>
            {loading ? (
              <Skeleton className='h-4 w-20' />
            ) : (
              <span className='text-sm font-semibold'>{systemName}</span>
            )}
          </Link>
          <div className='flex items-center gap-1'>
            <LanguageSwitcher />
            <ThemeSwitch />
          </div>
        </div>

        {/* Desktop top-right controls */}
        <div className='absolute top-4 right-4 z-10 hidden items-center gap-1 lg:flex'>
          <LanguageSwitcher />
          <ThemeSwitch />
        </div>

        {/* Form area */}
        <div className='flex flex-1 items-center justify-center px-4 py-8 sm:px-6'>
          <div className='w-full max-w-[420px] space-y-6'>
            {/* Mobile branding */}
            <div className='text-center lg:hidden'>
              <h1 className='text-xl font-semibold tracking-tight bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent'>
                {systemName}
              </h1>
            </div>

            {/* Mobile branding image */}
            <div className='relative overflow-hidden rounded-xl ring-1 ring-border/40 shadow-lg lg:hidden'>
              <img
                src='/assets/tokenhub/auth-branding.jpg'
                alt={systemName}
                loading='lazy'
                decoding='async'
                className='aspect-[16/9] w-full object-cover'
              />
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
