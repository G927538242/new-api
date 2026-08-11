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
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@/components/dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { HeaderLogo } from './header-logo'

const AUTH_PROMPT_SECONDS = 5

type AuthPromptTarget = {
  title: string
  href: string
}

export interface PublicHeaderProps {
  navLinks?: TopNavLink[]
  mobileLinks?: TopNavLink[]
  navContent?: React.ReactNode
  showThemeSwitch?: boolean
  showLanguageSwitcher?: boolean
  logo?: React.ReactNode
  siteName?: string
  homeUrl?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  showNavigation?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  className?: string
}

export function PublicHeader(props: PublicHeaderProps) {
  const {
    navLinks = defaultTopNavLinks,
    showThemeSwitch = true,
    showLanguageSwitcher = true,
    logo: customLogo,
    siteName: customSiteName,
    homeUrl = '/',
    showAuthButtons = true,
    showNotifications = true,
  } = props

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authPromptTarget, setAuthPromptTarget] =
    useState<AuthPromptTarget | null>(null)
  const [authPromptSecondsLeft, setAuthPromptSecondsLeft] =
    useState(AUTH_PROMPT_SECONDS)
  const { auth } = useAuthStore()
  const {
    systemName,
    logo: systemLogo,
    loading,
    logoLoaded,
  } = useSystemConfig()
  const dynamicLinks = useTopNavLinks()
  const notifications = useNotifications()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const user = auth.user
  const isAuthenticated = !!user
  const displaySiteName = customSiteName || systemName
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!authPromptTarget) return

    const intervalId = window.setInterval(() => {
      setAuthPromptSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    const timeoutId = window.setTimeout(() => {
      const redirect = authPromptTarget.href
      setAuthPromptTarget(null)
      navigate({ to: '/sign-in', search: { redirect } })
    }, AUTH_PROMPT_SECONDS * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [authPromptTarget, navigate])

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null)
    setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
  }, [])

  const navigateToSignIn = useCallback(() => {
    const redirect = authPromptTarget?.href || '/'
    setAuthPromptTarget(null)
    navigate({ to: '/sign-in', search: { redirect } })
  }, [authPromptTarget?.href, navigate])

  const handleNavLinkClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      link: TopNavLink,
      closeMobile = false
    ) => {
      if (link.disabled) {
        event.preventDefault()
        return
      }

      if (link.requiresAuth) {
        event.preventDefault()
        if (closeMobile) {
          setMobileOpen(false)
        }
        setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
        setAuthPromptTarget({
          title: t(link.title),
          href: link.href,
        })
        return
      }

      if (closeMobile) {
        setMobileOpen(false)
      }
    },
    [t]
  )

  return (
    <>
      <header className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-transparent border-b border-transparent'
      )}>
        <nav className='mx-auto flex h-12 max-w-[1200px] items-center justify-between px-6'>
          {/* Logo + Brand */}
          <Link
            to={homeUrl}
            className='flex shrink-0 items-center gap-2'
          >
            <div className='flex size-6 shrink-0 items-center justify-center'>
              {loading ? (
                <Skeleton className='size-full' />
              ) : customLogo ? (
                customLogo
              ) : (
                <HeaderLogo
                  src={systemLogo}
                  loading={loading}
                  logoLoaded={logoLoaded}
                  className='size-full object-contain'
                />
              )}
            </div>
            <span className='text-[13px] font-semibold tracking-tight'>
              {loading ? <Skeleton className='h-3.5 w-24' /> : displaySiteName}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className='hidden items-center gap-1 md:flex'>
            {links.map((link, i) => {
              const isActive = pathname === link.href
              const commonCls = cn(
                'relative px-3 py-1.5 text-[13px] transition-colors duration-200 rounded-md',
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                link.disabled && 'pointer-events-none opacity-50'
              )
              if (link.external) {
                return (
                  <a
                    key={i}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-disabled={link.disabled}
                    tabIndex={link.disabled ? -1 : undefined}
                    onClick={(event) => handleNavLinkClick(event, link)}
                    className={commonCls}
                  >
                    {t(link.title)}
                  </a>
                )
              }
              return (
                <Link
                  key={i}
                  to={link.href}
                  disabled={link.disabled}
                  onClick={(event) => handleNavLinkClick(event, link)}
                  className={commonCls}
                >
                  {t(link.title)}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className='flex items-center gap-0.5 md:gap-1'>
            {showLanguageSwitcher && (
              <div className='hidden sm:block'>
                <LanguageSwitcher />
              </div>
            )}
            {showThemeSwitch && (
              <div className='hidden sm:block'>
                <ThemeSwitch />
              </div>
            )}
            {showNotifications && (
              <div className='hidden sm:block'>
                <NotificationPopover
                  open={notifications.popoverOpen}
                  onOpenChange={notifications.setPopoverOpen}
                  unreadCount={notifications.unreadCount}
                  activeTab={notifications.activeTab}
                  onTabChange={notifications.setActiveTab}
                  notice={notifications.notice}
                  announcements={notifications.announcements}
                  loading={notifications.loading}
                />
              </div>
            )}

            {showAuthButtons && (
              <>
                {loading ? (
                  <Skeleton className='h-7 w-16 hidden sm:block' />
                ) : isAuthenticated ? (
                  <div className='hidden sm:block'>
                    <ProfileDropdown />
                  </div>
                ) : (
                  <Link
                    to='/sign-in'
                    className='hidden sm:inline-flex h-7 items-center rounded-md px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/50'
                  >
                    {t('Sign in')}
                  </Link>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <div className='flex items-center sm:hidden'>
              {showThemeSwitch && <ThemeSwitch />}
              {showLanguageSwitcher && <LanguageSwitcher />}
              <button
                type='button'
                className='inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50'
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={t('Toggle navigation menu')}
              >
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  {mobileOpen ? (
                    <path d='M3 3L13 13M13 3L3 13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                  ) : (
                    <>
                      <path d='M2.5 4H13.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                      <path d='M2.5 8H13.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                      <path d='M2.5 12H13.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={cn(
          'fixed inset-x-0 top-12 z-40 border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 sm:hidden',
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <div className='flex h-[calc(100vh-3rem)] flex-col justify-between px-6 py-6'>
          <nav className='flex flex-col gap-0.5'>
            {links.map((link, i) => {
              const isActive = pathname === link.href
              const linkClassName = cn(
                'block rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors',
                mobileOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0',
                isActive
                  ? 'text-foreground bg-muted/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                link.disabled && 'pointer-events-none opacity-50'
              )
              const transitionStyle = {
                transitionDelay: mobileOpen ? `${60 + i * 30}ms` : '0ms',
              }
              if (link.external) {
                return (
                  <a
                    key={i}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-disabled={link.disabled}
                    tabIndex={link.disabled ? -1 : undefined}
                    onClick={(event) => handleNavLinkClick(event, link, true)}
                    className={linkClassName}
                    style={transitionStyle}
                  >
                    {t(link.title)}
                  </a>
                )
              }
              return (
                <Link
                  key={i}
                  to={link.href}
                  disabled={link.disabled}
                  onClick={(event) => handleNavLinkClick(event, link, true)}
                  className={linkClassName}
                  style={transitionStyle}
                >
                  {t(link.title)}
                </Link>
              )
            })}
          </nav>

          <div
            className={cn(
              'flex flex-col gap-2 transition-all duration-300',
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            )}
            style={{ transitionDelay: mobileOpen ? '150ms' : '0ms' }}
          >
            {showAuthButtons && !isAuthenticated && (
              <Link
                to='/sign-in'
                onClick={() => setMobileOpen(false)}
                className='inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:opacity-90'
              >
                {t('Sign in')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!authPromptTarget}
        onOpenChange={(open) => {
          if (!open) {
            closeAuthPrompt()
          }
        }}
        title={t('Sign in required')}
        description={t('Please sign in to view {{module}}.', {
          module: authPromptTarget?.title || '',
        })}
        contentClassName='sm:max-w-md'
        contentHeight='auto'
        footer={
          <>
            <Button variant='outline' onClick={closeAuthPrompt}>
              {t('Cancel')}
            </Button>
            <Button onClick={navigateToSignIn}>{t('Sign in now')}</Button>
          </>
        }
      >
        <div className='bg-muted/40 text-muted-foreground rounded-md px-3 py-2 text-sm'>
          {t('Redirecting to sign in in {{seconds}} seconds.', {
            seconds: authPromptSecondsLeft,
          })}
        </div>
      </Dialog>
    </>
  )
}
