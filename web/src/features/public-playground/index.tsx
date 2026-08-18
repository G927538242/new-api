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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageSquare, Film, Settings2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { PublicLayout } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { sendStreamingChat } from './api'
import {
  genId,
  getInitialConfig,
  loadMessages,
  saveConfig,
  saveMessages,
} from './storage'
import type { ChatMessage, PublicPlaygroundConfig } from './types'
import { VideoPlayground } from './video-playground'

const PRESET_PROMPTS = [
  '用一句话解释什么是大语言模型',
  '写一首关于秋天的七言绝句',
  '帮我写一份产品需求文档提纲',
  '写一个 Python 快速排序实现并注释',
]

const PRESET_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-3.5-turbo',
  'claude-3.5-sonnet',
  'deepseek-chat',
  'qwen-plus',
]

const emptyStateImagePrompt =
  'Minimalist monochrome line art illustration of a floating chat bubble connected to a neural network wireframe, thin black strokes on white background, elegant enterprise SaaS style, black white gray palette, clean negative space, no text, no watermark'

function textToImageUrl(prompt: string, size: string): string {
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`
}

function ChatPanel() {
  const { t } = useTranslation()
  const [config, setConfig] = useState<PublicPlaygroundConfig>(getInitialConfig)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const msgLoadedRef = useRef(false)
  const messagesRef = useRef<ChatMessage[]>([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaded = loadMessages() ?? []
      msgLoadedRef.current = true
      setMessages(loaded)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    saveConfig(config)
  }, [config])

  useEffect(() => {
    if (!msgLoadedRef.current) return
    const timer = window.setTimeout(() => saveMessages(messages), 300)
    return () => window.clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    if (!scrollRef.current) return
    // scrollRef 指向 ScrollArea 的 Root 容器，实际可滚动的是内部的 viewport
    const viewport = scrollRef.current.querySelector(
      '[data-slot="scroll-area-viewport"]'
    )
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  const updateConfig = useCallback(
    <K extends keyof PublicPlaygroundConfig>(key: K, value: PublicPlaygroundConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const canSend = useMemo(() => {
    return (
      !isSending &&
      input.trim().length > 0 &&
      config.model.trim().length > 0
    )
  }, [isSending, input, config.model])

  const handleSend = useCallback(
    (promptText?: string) => {
      const text = (promptText ?? input).trim()
      if (!text) return
      if (!config.model.trim()) {
        toast.error(t('Please select or enter a model'))
        return
      }
      if (!config.apiKey.trim() && !config.baseUrl.includes(window.location.origin)) {
        toast.warning(t('API Key is empty — the request may be rejected'))
      }

      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        content: text,
        status: 'complete',
      }
      const assistantMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: '',
        status: 'loading',
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setInput('')
      setIsSending(true)

      const controller = new AbortController()
      abortRef.current = controller

      const sendList = [...messagesRef.current, userMsg]

      void sendStreamingChat(
        sendList,
        config,
        {
          onUpdate: (chunk) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (!last || last.role !== 'assistant') return prev
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + chunk, status: 'streaming' },
              ]
            })
          },
          onComplete: () => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (!last || last.role !== 'assistant') return prev
              return [
                ...prev.slice(0, -1),
                { ...last, status: last.content ? 'complete' : 'error', error: last.content ? undefined : 'Empty response' },
              ]
            })
            setIsSending(false)
            abortRef.current = null
          },
          onError: (err) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (!last || last.role !== 'assistant') return prev
              return [
                ...prev.slice(0, -1),
                { ...last, status: 'error', error: err },
              ]
            })
            setIsSending(false)
            abortRef.current = null
          },
        },
        controller.signal
      )
    },
    [input, config, t]
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsSending(false)
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (!last || last.role !== 'assistant') return prev
      return [
        ...prev.slice(0, -1),
        { ...last, status: last.content ? 'complete' : 'error' },
      ]
    })
  }, [])

  const handleClear = useCallback(() => {
    setMessages([])
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center justify-between border-b bg-card/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings((s) => !s)}
            className="h-7 text-xs"
          >
            <Settings2 className="mr-1 size-3" />
            {showSettings ? t('Hide Settings') : t('Show Settings')}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!messages.length} className="h-7 text-xs">
            {t('Clear')}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 p-3">
        {showSettings && (
          <Card className="w-64 shrink-0 overflow-hidden border-sky-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('API Settings')}</CardTitle>
              <CardDescription className="text-[11px]">
                {t('Configure Base URL and API Key')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              <div className="space-y-1">
                <Label htmlFor="pp-base-url" className="text-xs">{t('Base URL')}</Label>
                <Input
                  id="pp-base-url"
                  value={config.baseUrl}
                  onChange={(e) => updateConfig('baseUrl', e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pp-api-key" className="text-xs">{t('API Key')}</Label>
                <Input
                  id="pp-api-key"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => updateConfig('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pp-model" className="text-xs">{t('Model')}</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px]" />}>
                      {t('Presets')}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {PRESET_MODELS.map((m) => (
                        <DropdownMenuItem
                          key={m}
                          onClick={() => updateConfig('model', m)}
                          className="font-mono text-xs"
                        >
                          {m}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Input
                  id="pp-model"
                  value={config.model}
                  onChange={(e) => updateConfig('model', e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div className="border-t" />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{t('Temperature')}: {config.temperature.toFixed(2)}</Label>
                </div>
                <Slider
                  min={0}
                  max={2}
                  step={0.05}
                  value={[config.temperature]}
                  onValueChange={(v) =>
                    updateConfig('temperature', Number(Array.isArray(v) ? v[0] : v))
                  }
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{t('Top P')}: {config.top_p.toFixed(2)}</Label>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  value={[config.top_p]}
                  onValueChange={(v) =>
                    updateConfig('top_p', Number(Array.isArray(v) ? v[0] : v))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pp-max-tokens" className="text-xs">
                  {t('Max Tokens')}: {config.max_tokens}
                </Label>
                <Input
                  id="pp-max-tokens"
                  type="number"
                  min={1}
                  max={131072}
                  value={config.max_tokens}
                  onChange={(e) =>
                    updateConfig('max_tokens', Math.max(1, Number(e.target.value) || 1))
                  }
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Label htmlFor="pp-stream" className="text-xs">{t('Stream')}</Label>
                <Switch
                  id="pp-stream"
                  checked={config.stream}
                  onCheckedChange={(v) => updateConfig('stream', v)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-sky-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
            <ScrollArea ref={scrollRef} className="flex-1">
              <div className="flex flex-col gap-4 p-5">
                {messages.length === 0 ? (
                  <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden text-center">
                    <img
                      src={textToImageUrl(emptyStateImagePrompt, 'square_hd')}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.05]"
                    />
                    <div className="relative mb-6">
                      <div className="flex size-14 items-center justify-center rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50 to-white shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                        <svg
                          className="size-7 text-sky-600 dark:text-sky-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                      </div>
                      <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-background bg-sky-500" />
                    </div>
                    <h2 className="mb-2 text-lg font-semibold tracking-tight">
                      {t('Welcome to Open API Playground')}
                    </h2>
                    <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {t(
                        'Enter your API Key on the left (or leave empty for this server), type a message, and start testing. No login required.'
                      )}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {PRESET_PROMPTS.map((p) => (
                        <Button
                          key={p}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(p)}
                          className="max-w-[220px] truncate border-border text-left text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/40 hover:text-foreground"
                          title={p}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${
                        m.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                            : m.status === 'error'
                              ? 'bg-destructive/10 text-destructive border border-destructive/20'
                              : 'border border-border/60 bg-muted/60 dark:bg-slate-800/80'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2 text-[10px] opacity-60">
                          <span className="uppercase">{m.role}</span>
                          {m.status === 'streaming' && <Badge variant="outline" className="h-3 px-1 text-[10px]">{t('streaming')}</Badge>}
                          {m.status === 'error' && <Badge variant="destructive" className="h-3 px-1 text-[10px]">error</Badge>}
                        </div>
                        {m.status === 'loading' && !m.content ? (
                          <div className="h-4 w-16 animate-pulse rounded bg-muted-foreground/30" />
                        ) : (
                          <div className="whitespace-pre-wrap break-words leading-relaxed">
                            {m.content || (m.status === 'error' ? m.error || '' : '')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          <div className="shrink-0">
            <div className="rounded-xl border border-sky-200/60 bg-white/70 p-3 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
              <div className="mb-2 flex flex-wrap gap-1">
                {PRESET_PROMPTS.slice(0, 3).map((p) => (
                  <Button
                    key={p}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] text-muted-foreground"
                    onClick={() => setInput(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('Type your message... (Shift + Enter for new line)')}
                className="min-h-[72px] resize-none border-none bg-transparent p-1 text-sm shadow-none focus-visible:ring-0"
                rows={3}
              />
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {config.model || t('no model')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {isSending ? (
                    <Button variant="destructive" size="sm" onClick={handleStop}>
                      {t('Stop')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/30 hover:from-sky-600 hover:to-blue-700"
                      disabled={!canSend}
                      onClick={() => handleSend()}
                    >
                      {t('Send')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PublicPlayground() {
  const { t } = useTranslation()

  return (
    <PublicLayout>
      <Tabs defaultValue="chat" className="flex h-[calc(100vh-64px)] min-h-[600px] w-full flex-col bg-gradient-to-b from-sky-100 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="border-b border-sky-200/60 bg-white/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/60">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <TabsList className="grid grid-cols-2 gap-1 rounded-lg bg-sky-100/70 p-0.5 dark:bg-slate-800/70">
                <TabsTrigger
                  value="chat"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-sky-500/30"
                >
                  <MessageSquare className="size-3.5" />
                  {t('Chat Mode')}
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-sky-500/30"
                >
                  <Film className="size-3.5" />
                  {t('Video Mode')}
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-normal">
                {t('No login required')}
              </Badge>
            </div>
          </div>
        </div>

        <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden p-0">
          <ChatPanel />
        </TabsContent>

        <TabsContent value="video" className="mt-0 flex-1 overflow-hidden p-0">
          <VideoPlayground />
        </TabsContent>
      </Tabs>
    </PublicLayout>
  )
}
