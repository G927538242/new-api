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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Markdown, slugifyHeading, type HeadingAnchor } from '@/components/ui/markdown'
import { cn } from '@/lib/utils'

import type { DocPage } from './content'
import { docCategories as docCategoriesZh, docPages as docPagesZh } from './content'
import { docCategoriesEn, docPagesEn } from './content-en'
import { docCategoriesFr, docPagesFr } from './content-fr'
import { docCategoriesRu, docPagesRu } from './content-ru'
import { docCategoriesJa, docPagesJa } from './content-ja'
import { docCategoriesVi, docPagesVi } from './content-vi'
import { docCategoriesZhTw, docPagesZhTw } from './content-zh-tw'

// 文档内容按界面语言选择：zhCN 用中文，其余语言用各自翻译文件
const DOC_CONTENT = {
  zhCN: { categories: docCategoriesZh, pages: docPagesZh },
  en: { categories: docCategoriesEn, pages: docPagesEn },
  fr: { categories: docCategoriesFr, pages: docPagesFr },
  ru: { categories: docCategoriesRu, pages: docPagesRu },
  ja: { categories: docCategoriesJa, pages: docPagesJa },
  vi: { categories: docCategoriesVi, pages: docPagesVi },
  zhTW: { categories: docCategoriesZhTw, pages: docPagesZhTw },
} as const

function useBaseUrl(): string {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

function processContent(content: string, baseUrl: string): string {
  return content.replace(/\{\{BASE_URL\}\}/g, baseUrl)
}

/**
 * 从 Markdown 源文本提取标题目录（跳过代码块），
 * 生成的 id 与 Markdown 组件渲染出的锚点 id 保持一致。
 */
function extractToc(markdown: string): HeadingAnchor[] {
  const anchors: HeadingAnchor[] = []
  const counts = new Map<string, number>()
  let inCode = false

  for (const line of markdown.split('\n')) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      inCode = !inCode
      continue
    }

    if (inCode) {
      continue
    }

    const match = /^(#{2,3})\s+(.+)$/.exec(trimmed)

    if (!match) {
      continue
    }

    const level = match[1].length
    const text = match[2].trim()
    const slug = slugifyHeading(text)
    const count = counts.get(slug) ?? 0
    counts.set(slug, count + 1)
    const id = count === 0 ? slug : `${slug}-${count}`

    anchors.push({ id, level, text })
  }

  return anchors
}

function DocsSidebar(props: {
  currentPageId: string
  onSelect: (id: string) => void
  docCategories: readonly string[]
  docPages: DocPage[]
  className?: string
}) {
  return (
    <nav className={cn('space-y-6', props.className)}>
      {props.docCategories.map((category) => (
        <div key={category}>
          <h3 className='text-muted-foreground/60 mb-2 px-3 text-xs font-semibold tracking-wider uppercase'>
            {category}
          </h3>
          <ul className='space-y-0.5'>
            {props.docPages
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

function DocsToc(props: {
  anchors: HeadingAnchor[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const { anchors, activeId, onSelect } = props

  if (anchors.length === 0) {
    return null
  }

  return (
    <nav className='space-y-4'>
      <div className='text-muted-foreground/60 text-xs font-semibold tracking-wider uppercase'>
        本篇目录
      </div>
      <ul className='space-y-0.5 border-l'>
        {anchors.map((anchor) => (
          <li key={anchor.id}>
            <button
              onClick={() => onSelect(anchor.id)}
              className={cn(
                '-ml-px block w-full border-l py-1 text-left text-[13px] leading-snug transition-colors',
                anchor.level === 3 ? 'pl-6' : 'pl-4',
                activeId === anchor.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
              )}
            >
              {anchor.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Docs() {
  const { t, i18n } = useTranslation()
  const baseUrl = useBaseUrl()
  // 文档内容按界面语言切换
  const docContent =
    DOC_CONTENT[i18n.language as keyof typeof DOC_CONTENT] ?? DOC_CONTENT.en
  const docCategories = docContent.categories
  const docPages = docContent.pages
  const [currentPageId, setCurrentPageId] = useState(docPages[0]?.id ?? '')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeHeadingId, setActiveHeadingId] = useState('')
  const articleRef = useRef<HTMLElement>(null)

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

  const toc = useMemo(() => extractToc(processedContent), [processedContent])

  const selectPage = useCallback((id: string) => {
    setCurrentPageId(id)
    setMobileSidebarOpen(false)
    setActiveHeadingId('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const selectHeading = useCallback((id: string) => {
    setActiveHeadingId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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

  // Track the heading currently in view for the TOC highlight
  useEffect(() => {
    const article = articleRef.current

    if (!article) {
      return
    }

    const headings = Array.from(
      article.querySelectorAll<HTMLElement>('h2[id], h3[id]')
    )

    if (headings.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id)
          }
        }
      },
      { rootMargin: '-88px 0px -70% 0px' }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [currentPageId, processedContent])

  return (
    <PublicLayout showMainContainer={false}>
      <div className='bg-gradient-to-b from-sky-100/70 via-white/30 to-transparent dark:from-sky-950/30 dark:via-slate-950/10 dark:to-transparent'>
      <div className='mx-auto flex max-w-[1400px] gap-0 px-0 pt-16 md:pt-20'>
        {/* Desktop sidebar */}
        <aside className='sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto border-r px-4 py-8 md:block'>
          <DocsSidebar
            currentPageId={currentPageId}
            onSelect={selectPage}
            docCategories={docCategories}
            docPages={docPages}
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
                docCategories={docCategories}
                docPages={docPages}
              />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className='min-w-0 flex-1 px-4 py-8 md:px-10 md:py-8'>
          <div className='mx-auto max-w-3xl'>
            {/* Breadcrumb */}
            <nav className='text-muted-foreground/60 mb-8 flex items-center gap-2 text-xs'>
              <span>{currentPage?.category}</span>
              <ChevronRight className='size-3' />
              <span className='text-foreground/80'>{currentPage?.title}</span>
            </nav>

            {/* Content */}
            <article ref={articleRef} className='prose prose-neutral dark:prose-invert max-w-none'>
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

        {/* Right TOC (on-page directory) */}
        <aside className='sticky top-20 hidden h-[calc(100vh-5rem)] w-60 shrink-0 overflow-y-auto px-6 py-8 lg:block'>
          <DocsToc
            anchors={toc}
            activeId={activeHeadingId}
            onSelect={selectHeading}
          />
        </aside>
      </div>
      </div>
    </PublicLayout>
  )
}
