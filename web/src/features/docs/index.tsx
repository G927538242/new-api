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
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/ui/markdown'
import { cn } from '@/lib/utils'

import { docCategories, docPages } from './content'

function useBaseUrl(): string {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

function processContent(content: string, baseUrl: string): string {
  return content.replace(/\{\{BASE_URL\}\}/g, baseUrl)
}

function DocsSidebar(props: {
  currentPageId: string
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <nav className={cn('space-y-6', props.className)}>
      {docCategories.map((category) => (
        <div key={category}>
          <h3 className='text-muted-foreground/60 mb-2 px-3 text-xs font-semibold tracking-wider uppercase'>
            {category}
          </h3>
          <ul className='space-y-0.5'>
            {docPages
              .filter((p) => p.category === category)
              .map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => props.onSelect(page.id)}
                    className={cn(
                      'w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                      props.currentPageId === page.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {page.title}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function Docs() {
  const { t } = useTranslation()
  const baseUrl = useBaseUrl()
  const [currentPageId, setCurrentPageId] = useState(docPages[0]?.id ?? '')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const currentPageIndex = useMemo(
    () => docPages.findIndex((p) => p.id === currentPageId),
    [currentPageId]
  )
  const currentPage = docPages[currentPageIndex]
  const prevPage = currentPageIndex > 0 ? docPages[currentPageIndex - 1] : null
  const nextPage =
    currentPageIndex < docPages.length - 1
      ? docPages[currentPageIndex + 1]
      : null

  const processedContent = useMemo(
    () => processContent(currentPage?.content ?? '', baseUrl),
    [currentPage, baseUrl]
  )

  const selectPage = useCallback((id: string) => {
    setCurrentPageId(id)
    setMobileSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Sync with URL hash for deep linking
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && docPages.some((p) => p.id === hash)) {
      setCurrentPageId(hash)
    }
  }, [])

  useEffect(() => {
    if (currentPageId) {
      window.history.replaceState(null, '', `#${currentPageId}`)
    }
  }, [currentPageId])

  return (
    <PublicLayout showMainContainer={false}>
      <div className='mx-auto flex max-w-7xl gap-0 px-0 pt-16 md:pt-20'>
        {/* Desktop sidebar */}
        <aside className='sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto border-r px-4 py-8 md:block'>
          <DocsSidebar
            currentPageId={currentPageId}
            onSelect={selectPage}
          />
        </aside>

        {/* Mobile sidebar toggle */}
        <div className='fixed left-4 top-20 z-30 md:hidden'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setMobileSidebarOpen(true)}
            className='shadow-md'
          >
            <Menu className='size-4' />
          </Button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className='fixed inset-0 z-50 md:hidden'>
            <div
              className='bg-background/80 absolute inset-0 backdrop-blur-sm'
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className='bg-background absolute left-0 top-0 h-full w-72 overflow-y-auto border-r px-4 py-8 shadow-xl'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-sm font-semibold'>{t('Docs')}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X className='size-4' />
                </Button>
              </div>
              <DocsSidebar
                currentPageId={currentPageId}
                onSelect={selectPage}
              />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className='min-w-0 flex-1 px-4 py-8 md:px-8 md:py-8'>
          <div className='mx-auto max-w-3xl'>
            {/* Breadcrumb */}
            <div className='text-muted-foreground/60 mb-6 flex items-center gap-2 text-xs md:hidden'>
              <span>{currentPage?.category}</span>
              <ChevronRight className='size-3' />
              <span className='text-foreground/80'>{currentPage?.title}</span>
            </div>

            {/* Content */}
            <article className='prose prose-neutral dark:prose-invert max-w-none'>
              <Markdown>{processedContent}</Markdown>
            </article>

            {/* Prev / Next navigation */}
            <div className='mt-12 flex items-center justify-between gap-4 border-t pt-6'>
              {prevPage ? (
                <button
                  onClick={() => selectPage(prevPage.id)}
                  className='group flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted/50'
                >
                  <ChevronLeft className='text-muted-foreground group-hover:text-foreground size-4 shrink-0' />
                  <div className='text-left'>
                    <div className='text-muted-foreground/60 text-xs'>
                      上一篇
                    </div>
                    <div className='text-foreground/80 text-sm font-medium'>
                      {prevPage.title}
                    </div>
                  </div>
                </button>
              ) : (
                <div />
              )}
              {nextPage ? (
                <button
                  onClick={() => selectPage(nextPage.id)}
                  className='group flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted/50'
                >
                  <div className='text-right'>
                    <div className='text-muted-foreground/60 text-xs'>
                      下一篇
                    </div>
                    <div className='text-foreground/80 text-sm font-medium'>
                      {nextPage.title}
                    </div>
                  </div>
                  <ChevronRight className='text-muted-foreground group-hover:text-foreground size-4 shrink-0' />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>
      </div>
    </PublicLayout>
  )
}
