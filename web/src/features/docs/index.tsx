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
    <nav className={cn('space-y-7', props.className)}>
      {props.docCategories.map((category) => (
        <div key={category}>
          <h3 className='text-foreground/40 mb-2.5 px-2 text-[11px] font-semibold tracking-widest uppercase'>
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
                      'group relative w-full rounded-md px-2 py-[7px] text-left text-[13px] leading-snug transition-colors',
                      props.currentPageId === page.id
                        ? 'bg-primary/8 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                  >
                    {props.currentPageId === page.id && (
                      <span className='bg-primary absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full' />
                    )}
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
      <div className='text-foreground/40 text-[11px] font-semibold tracking-widest uppercase'>
        本篇目录
      </div>
      <ul className='space-y-0.5 border-l'>
        {anchors.map((anchor) => (
          <li key={anchor.id}>
            <button
              onClick={() => onSelect(anchor.id)}
              className={cn(
                '-ml-px block w-full border-l py-[3px] text-left text-[12.5px] leading-snug transition-colors',
                anchor.level === 3 ? 'pl-6' : 'pl-4',
                activeId === anchor.id
                  ? 'border-primary font-medium text-primary'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
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
      <div className='min-h-screen bg-background'>
      {/* 顶部文档标题栏 */}
      <div className='border-border/70 sticky top-16 z-30 border-b bg-background/85 backdrop-blur-md'>
        <div className='mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 md:px-6'>
          <div className='flex items-center gap-2.5'>
            <span className='text-foreground text-sm font-semibold tracking-tight'>
              文档中心
            </span>
            <span className='text-foreground/30 text-xs'>/</span>
            <span className='text-muted-foreground text-[13px]'>
              {currentPage?.category}
            </span>
          </div>
          <span className='hidden text-muted-foreground/60 text-xs sm:block'>
            {currentPage?.title}
          </span>
        </div>
      </div>

      <div className='mx-auto flex max-w-[1400px] gap-0 px-0 pt-0'>
        {/* Desktop sidebar */}
        <aside className='sticky top-28 hidden h-[calc(100vh-7rem)] w-60 shrink-0 overflow-y-auto border-r border-border/60 px-3 py-7 lg:block'>
          <DocsSidebar
            currentPageId={currentPageId}
            onSelect={selectPage}
            docCategories={docCategories}
            docPages={docPages}
          />
        </aside>

        {/* Mobile sidebar toggle */}
        <div className='fixed left-4 top-20 z-30 lg:hidden'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setMobileSidebarOpen(true)}
            className='shadow-sm'
          >
            <Menu className='size-4' />
          </Button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className='fixed inset-0 z-50 lg:hidden'>
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
        <main className='min-w-0 flex-1 px-4 py-10 md:px-10 md:py-12'>
          <div className='mx-auto max-w-3xl'>
            {/* Breadcrumb */}
            <nav className='text-muted-foreground/50 mb-8 flex items-center gap-1.5 text-xs'>
              <span>{currentPage?.category}</span>
              <ChevronRight className='size-3' />
              <span className='text-foreground/80 font-medium'>
                {currentPage?.title}
              </span>
            </nav>

            {/* Content */}
            <article ref={articleRef} className='prose prose-neutral dark:prose-invert max-w-none'>
              <Markdown>{processedContent}</Markdown>
            </article>

            {/* Prev / Next navigation */}
            <div className='mt-14 grid grid-cols-2 gap-3 border-t border-border/60 pt-8'>
              {prevPage ? (
                <button
                  onClick={() => selectPage(prevPage.id)}
                  className='group flex flex-col gap-1 rounded-lg border border-border/70 px-4 py-3 text-left transition-all hover:border-primary/40 hover:bg-primary/[0.03]'
                >
                  <span className='text-muted-foreground/60 text-[11px]'>
                    <ChevronLeft className='mr-1 inline size-3' />
                    上一篇
                  </span>
                  <span className='text-foreground/90 line-clamp-1 text-[13px] font-medium'>
                    {prevPage.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
              {nextPage ? (
                <button
                  onClick={() => selectPage(nextPage.id)}
                  className='group flex flex-col items-end gap-1 rounded-lg border border-border/70 px-4 py-3 text-right transition-all hover:border-primary/40 hover:bg-primary/[0.03]'
                >
                  <span className='text-muted-foreground/60 text-[11px]'>
                    下一篇
                    <ChevronRight className='ml-1 inline size-3' />
                  </span>
                  <span className='text-foreground/90 line-clamp-1 text-[13px] font-medium'>
                    {nextPage.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>

        {/* Right TOC (on-page directory) */}
        <aside className='sticky top-28 hidden h-[calc(100vh-7rem)] w-56 shrink-0 overflow-y-auto px-4 py-7 xl:block'>
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
